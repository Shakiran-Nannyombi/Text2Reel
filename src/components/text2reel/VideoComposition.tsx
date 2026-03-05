import { AbsoluteFill, Sequence, useVideoConfig, useCurrentFrame, spring, interpolate, Img } from 'remotion'
import type { Scene } from '@/store/useText2ReelStore'
import IconRenderer from './IconRenderer'

interface VideoCompositionProps {
    scenes: Scene[]
}

const BackgroundAnimation = ({ style, color, frame, fps }: { style: string, color: string, frame: number, fps: number }) => {
    const { width, height } = useVideoConfig()

    // 1. Particles Animation
    if (style === 'particles') {
        const particleCount = 20
        return (
            <AbsoluteFill style={{ backgroundColor: color }}>
                {Array.from({ length: particleCount }).map((_, i) => {
                    const x = ((i * 12345 + frame * 2) % width)
                    const y = ((i * 54321 + frame * 1) % height)
                    const size = 10 + (i % 5) * 10
                    return (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                left: x,
                                top: y,
                                width: size,
                                height: size,
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                opacity: 0.2,
                                filter: 'blur(8px)'
                            }}
                        />
                    )
                })}
            </AbsoluteFill>
        )
    }

    // 2. Waves Animation
    if (style === 'waves') {
        return (
            <AbsoluteFill style={{ backgroundColor: color, overflow: 'hidden' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: '200%',
                            height: '200%',
                            top: `${40 + i * 10}%`,
                            left: '-50%',
                            backgroundColor: 'white',
                            opacity: 0.1,
                            borderRadius: '45%',
                            transform: `rotate(${frame * (0.2 + i * 0.05)}deg)`,
                        }}
                    />
                ))}
            </AbsoluteFill>
        )
    }

    // 3. Gradient Pulse
    if (style === 'gradient-pulse' || style === 'gradient') {
        const scale = 1 + Math.sin(frame * 0.05) * 0.1
        return (
            <AbsoluteFill
                style={{
                    background: `radial-gradient(circle, ${color} 0%, black 100%)`,
                    transform: `scale(${scale})`
                }}
            />
        )
    }

    // Default Fallback
    return <AbsoluteFill style={{ backgroundColor: color }} />
}

export const VideoComposition = ({ scenes }: VideoCompositionProps) => {
    const { fps } = useVideoConfig()
    const frame = useCurrentFrame()

    let accumulatedFrames = 0

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {scenes.map((scene, index) => {
                const durationInFrames = Math.floor(scene.duration * fps)
                const fromFrame = accumulatedFrames
                accumulatedFrames += durationInFrames

                // Animation for the icon popping in
                const sceneFrame = frame - fromFrame
                const popScale = spring({
                    frame: sceneFrame,
                    fps,
                    config: {
                        stiffness: 100,
                    },
                })

                return (
                    <Sequence key={index} from={fromFrame} durationInFrames={durationInFrames}>
                        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                            {/* Animated Background Layer */}
                            {scene.imageUrl ? (
                                <AbsoluteFill>
                                    <Img
                                        src={scene.imageUrl}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </AbsoluteFill>
                            ) : (
                                <BackgroundAnimation
                                    style={scene.animationStyle}
                                    color={scene.color}
                                    frame={sceneFrame}
                                    fps={fps}
                                />
                            )}

                            {/* Dark Overlay for text readability */}
                            <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} />

                            {/* Icon Layer */}
                            {scene.icon && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '25%',
                                        transform: `scale(${popScale * 2.5})`,
                                        filter: 'drop-shadow(0 0 15px rgba(247,154,122,0.5))',
                                        color: 'white',
                                        zIndex: 10
                                    }}
                                >
                                    <IconRenderer iconName={scene.icon} style={{ fontSize: '60px' }} />
                                </div>
                            )}

                            <h1
                                style={{
                                    color: 'white',
                                    fontFamily: 'var(--font-outfit), sans-serif',
                                    fontWeight: '900',
                                    fontSize: '80px',
                                    textAlign: 'center',
                                    textShadow: '0 5px 20px rgba(0,0,0,0.9)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    zIndex: 20,
                                    marginTop: '120px',
                                    padding: '0 40px'
                                }}
                            >
                                {scene.text}
                            </h1>
                        </AbsoluteFill>
                    </Sequence>
                )
            })}
        </AbsoluteFill>
    )
}
