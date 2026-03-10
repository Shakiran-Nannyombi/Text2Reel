'use client'

import { Player, PlayerRef } from '@remotion/player'
import { VideoComposition } from './VideoComposition'
import { useText2ReelStore, Scene } from '@/store/useText2ReelStore'
import {
    Download,
    VideoSettings,
    SkipPrevious,
    PlayArrow,
    Pause,
    SkipNext,
    Replay
} from '@mui/icons-material'
import { useState, useRef, useEffect, useCallback } from 'react'

export default function VideoPreview({ objectFit = 'contain' }: { objectFit?: 'contain' | 'cover' }) {
    const { scenes } = useText2ReelStore()
    const playerRef = useRef<PlayerRef>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentFrame, setCurrentFrame] = useState(0)

    const totalDurationInSeconds = scenes.reduce((acc: number, scene: Scene) => acc + scene.duration, 0)
    const durationInFrames = Math.max(1, Math.ceil(totalDurationInSeconds * 30))

    // Attach play/pause listeners when player mounts (via callback ref pattern)
    const attachListeners = useCallback((player: PlayerRef | null) => {
        if (!player) return
        const onPlay = () => setIsPlaying(true)
        const onPause = () => setIsPlaying(false)
        const onFrameUpdate = ({ detail }: { detail: { frame: number } }) => setCurrentFrame(detail.frame)
        player.addEventListener('play', onPlay)
        player.addEventListener('pause', onPause)
        // @ts-expect-error - Remotion player frameupdate event
        player.addEventListener('frameupdate', onFrameUpdate)
    }, [])

    // Re-attach when scenes change (player remounts)
    useEffect(() => {
        const timer = setTimeout(() => attachListeners(playerRef.current), 200)
        return () => clearTimeout(timer)
    }, [scenes, attachListeners])

    const handleDownload = async () => {
        // Export scenes as a JSON "project file" the user can re-import
        const projectData = {
            exportedAt: new Date().toISOString(),
            totalDuration: totalDurationInSeconds,
            scenes,
        }
        const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `text2reel-project-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const togglePlay = () => {
        if (!playerRef.current) return
        if (playerRef.current.isPlaying()) {
            playerRef.current.pause()
        } else {
            playerRef.current.play()
        }
    }

    const progressPercent = durationInFrames > 0 ? (currentFrame / (durationInFrames - 1)) * 100 : 0
    const currentTimeSeconds = currentFrame / 30

    // Which scene are we on?
    let accumulated = 0
    let currentSceneIndex = 0
    for (let i = 0; i < scenes.length; i++) {
        accumulated += scenes[i].duration
        if (currentTimeSeconds < accumulated) {
            currentSceneIndex = i
            break
        }
    }

    return (
        <div className="w-full h-full bg-background-dark flex flex-col relative group overflow-hidden">
            {/* Overlay Header Controls */}
            <div className="absolute top-0 inset-x-0 z-30 p-6 flex justify-end pointer-events-none">
                <button className="size-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 pointer-events-auto hover:bg-primary/20 hover:text-primary transition-all active:scale-95">
                    <VideoSettings sx={{ fontSize: 16 }} />
                </button>
            </div>

            <div className="flex-1 flex items-center justify-center overflow-hidden">
                {scenes.length > 0 ? (
                    <Player
                        ref={playerRef}
                        component={VideoComposition}
                        inputProps={{ scenes }}
                        durationInFrames={durationInFrames}
                        fps={30}
                        compositionWidth={1080}
                        compositionHeight={1920}
                        style={{ width: '100%', height: '100%', objectFit }}
                        autoPlay={false}
                        loop
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 font-display p-8 space-y-4 animate-pulse">
                        <div className="size-16 rounded-3xl border-2 border-dashed border-primary/20 flex items-center justify-center opacity-30">
                            <span className="material-symbols-outlined text-4xl">movie_edit</span>
                        </div>
                        <p className="text-xs uppercase tracking-[0.2em] font-black opacity-40">Waiting for Vision...</p>
                    </div>
                )}
            </div>

            {/* Bottom Controls Overlay */}
            {scenes.length > 0 && (
                <div className="absolute bottom-0 inset-x-0 z-30 p-4 pt-20 bg-linear-to-t from-background-dark via-background-dark/80 to-transparent">
                    <div className="glass-panel border-white/10 p-4 rounded-3xl atmospheric-glow">
                        {/* Scene info */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                                SCENE {String(currentSceneIndex + 1).padStart(2, '0')}
                            </span>
                            <span className="text-[10px] font-black text-primary tracking-widest leading-none">
                                {currentTimeSeconds.toFixed(1)}s / {totalDurationInSeconds.toFixed(1)}s
                            </span>
                        </div>

                        {/* Seekable progress bar */}
                        <div
                            className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-4 border border-white/5 cursor-pointer"
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect()
                                const ratio = (e.clientX - rect.left) / rect.width
                                playerRef.current?.seekTo(Math.floor(ratio * (durationInFrames - 1)))
                            }}
                        >
                            <div
                                className="h-full bg-primary shadow-[0_0_12px_#f79878] transition-none"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-8">
                            <button
                                onClick={() => {
                                    playerRef.current?.seekTo(0)
                                    setIsPlaying(false)
                                }}
                                className="text-slate-400 hover:text-primary transition-all active:scale-90"
                                title="Restart"
                            >
                                <Replay />
                            </button>
                            <button
                                onClick={() => {
                                    const f = playerRef.current?.getCurrentFrame() ?? 0
                                    playerRef.current?.seekTo(Math.max(0, f - 30))
                                }}
                                className="text-slate-400 hover:text-primary transition-all active:scale-90"
                            >
                                <SkipPrevious />
                            </button>
                            <button
                                onClick={togglePlay}
                                className="size-14 rounded-full bg-primary text-background-dark flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30"
                            >
                                {isPlaying ? (
                                    <Pause sx={{ fontSize: 32 }} />
                                ) : (
                                    <PlayArrow sx={{ fontSize: 32 }} className="translate-x-0.5" />
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    const f = playerRef.current?.getCurrentFrame() ?? 0
                                    playerRef.current?.seekTo(Math.min(durationInFrames - 1, f + 30))
                                }}
                                className="text-slate-400 hover:text-primary transition-all active:scale-90"
                            >
                                <SkipNext />
                            </button>
                            <button
                                onClick={handleDownload}
                                className="text-slate-400 hover:text-primary transition-all active:scale-90"
                                title="Download Project File"
                            >
                                <Download />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
