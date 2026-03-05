'use client'

import { Player } from '@remotion/player'
import { VideoComposition } from './VideoComposition'
import { useText2ReelStore, Scene } from '@/store/useText2ReelStore'
import { Download } from '@mui/icons-material'

export default function VideoPreview({ objectFit = 'contain' }: { objectFit?: 'contain' | 'cover' }) {
    const { scenes } = useText2ReelStore()

    // Calculate total duration
    const totalDurationInSeconds = scenes.reduce((acc: number, scene: Scene) => acc + scene.duration, 0)
    // Default to 1 second minimum to avoid division by zero or errors if empty
    const durationInFrames = Math.max(1, Math.ceil(totalDurationInSeconds * 30))

    const handleDownload = () => {
        alert('Rendering and Downloading... (This would trigger a Remotion Lambda/Server render in production)')
    }

    return (
        <div className="w-full h-full bg-black rounded-lg overflow-hidden flex flex-col relative group">
            <div className="flex-1 flex items-center justify-center">
                {scenes.length > 0 ? (
                    <Player
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
                        controls
                        autoPlay={false}
                        loop
                    />
                ) : (
                    <div className="text-gray-500 font-mono text-center p-8">
                        <p>Waiting for scenes...</p>
                    </div>
                )}
            </div>

            {scenes.length > 0 && (
                <button
                    onClick={handleDownload}
                    className="absolute bottom-4 right-4 bg-[#F79A7A] hover:bg-white text-black font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-all shadow-xl opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                >
                    <Download fontSize="small" />
                    <span className="text-xs">Download Video</span>
                </button>
            )}
        </div>
    )
}
