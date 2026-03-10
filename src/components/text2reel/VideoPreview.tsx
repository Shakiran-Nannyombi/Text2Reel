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
    SkipNext
} from '@mui/icons-material'
import { useState, useRef, useEffect } from 'react'

export default function VideoPreview({ objectFit = 'contain' }: { objectFit?: 'contain' | 'cover' }) {
    const { scenes } = useText2ReelStore()
    const playerRef = useRef<PlayerRef>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    // Calculate total duration
    const totalDurationInSeconds = scenes.reduce((acc: number, scene: Scene) => acc + scene.duration, 0)
    // Default to 1 second minimum to avoid division by zero or errors if empty
    const durationInFrames = Math.max(1, Math.ceil(totalDurationInSeconds * 30))

    useEffect(() => {
        const { current } = playerRef
        if (!current) return

        const onPlay = () => setIsPlaying(true)
        const onPause = () => setIsPlaying(false)

        current.addEventListener('play', onPlay)
        current.addEventListener('pause', onPause)

        return () => {
            current.removeEventListener('play', onPlay)
            current.removeEventListener('pause', onPause)
        }
    }, [])

    const handleDownload = () => {
        alert('Rendering and Downloading... (Triggering Remotion Lambda/Server)')
    }

    const togglePlay = () => {
        if (!playerRef.current) return
        if (playerRef.current.isPlaying()) {
            playerRef.current.pause()
        } else {
            playerRef.current.play()
        }
    }

    return (
        <div className="w-full h-full bg-background-dark flex flex-col relative group overflow-hidden">
            {/* Overlay Header Controls (Internal to Phone Frame) */}
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
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit,
                        }}
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
                <div className="absolute bottom-0 inset-x-0 z-30 p-8 pt-20 bg-linear-to-t from-background-dark via-background-dark/80 to-transparent">
                    <div className="glass-panel border-white/10 p-4 rounded-3xl atmospheric-glow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                                SCENE 0{Math.min(scenes.length, 1)}
                            </span>
                            <span className="text-[10px] font-black text-primary tracking-widest leading-none">
                                {totalDurationInSeconds.toFixed(1)}s TOTAL
                            </span>
                        </div>

                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-5 border border-white/5">
                            <div
                                className="h-full bg-primary shadow-[0_0_12px_#f79878] transition-all duration-300"
                                style={{ width: isPlaying ? '100%' : '33%' }}
                            ></div>
                        </div>

                        <div className="flex items-center justify-center gap-8">
                            <button onClick={() => {
                                if (playerRef.current) {
                                    const currentFrame = playerRef.current.getCurrentFrame();
                                    playerRef.current.seekTo(Math.max(0, currentFrame - 30));
                                }
                            }} className="text-slate-400 hover:text-primary transition-all active:scale-90">
                                <SkipPrevious />
                            </button>
                            <button
                                onClick={togglePlay}
                                className="size-14 rounded-full bg-primary text-background-dark flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30 group/play"
                            >
                                {isPlaying ? (
                                    <Pause sx={{ fontSize: 32 }} />
                                ) : (
                                    <PlayArrow sx={{ fontSize: 32 }} className="translate-x-0.5" />
                                )}
                            </button>
                            <button onClick={() => {
                                if (playerRef.current) {
                                    const currentFrame = playerRef.current.getCurrentFrame();
                                    playerRef.current.seekTo(Math.min(durationInFrames - 1, currentFrame + 30));
                                }
                            }} className="text-slate-400 hover:text-primary transition-all active:scale-90">
                                <SkipNext />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Float Download Button */}
            {scenes.length > 0 && (
                <button
                    onClick={handleDownload}
                    className="absolute bottom-32 right-6 z-40 bg-[#F79A7A] hover:bg-white text-black font-black p-3.5 rounded-full flex items-center justify-center transition-all shadow-2xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 active:scale-95"
                    title="Render and Download"
                >
                    <Download />
                </button>
            )}
        </div>
    )
}
