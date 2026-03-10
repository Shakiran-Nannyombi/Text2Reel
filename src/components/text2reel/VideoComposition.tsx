import { AbsoluteFill, Sequence, useVideoConfig, useCurrentFrame, spring, interpolate, Img, Easing, Video } from 'remotion'
import type { Scene } from '@/store/useText2ReelStore'
import IconRenderer from './IconRenderer'

interface VideoCompositionProps {
    scenes: Scene[]
}

const FILTER_CSS: Record<string, string> = {
    none: '',
    cinematic: 'contrast(1.2) saturate(0.8) sepia(0.15)',
    vivid: 'saturate(1.8) contrast(1.1)',
    noir: 'grayscale(1) contrast(1.3)',
    warm: 'sepia(0.4) saturate(1.2)',
    cool: 'hue-rotate(180deg) saturate(0.9)',
    neon: 'hue-rotate(90deg) saturate(2) contrast(1.3)',
    vintage: 'sepia(0.8) contrast(1.2) brightness(0.9)',
    dream: 'contrast(0.9) brightness(1.2) saturate(1.5)',
}

const BackgroundAnimation = ({ style, color, frame }: { style: string, color: string, frame: number }) => {
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

    // 4. VHS Scanlines
    if (style === 'scanlines') {
        return (
            <AbsoluteFill style={{ backgroundColor: color, overflow: 'hidden' }}>
                <AbsoluteFill
                    style={{
                        background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.2) 50%)',
                        backgroundSize: '100% 4px',
                        transform: `translateY(${frame % 4}px)`
                    }}
                />
            </AbsoluteFill>
        )
    }

    // 5. Starfield
    if (style === 'stars') {
        const starCount = 50
        return (
            <AbsoluteFill style={{ backgroundColor: color, overflow: 'hidden' }}>
                {Array.from({ length: starCount }).map((_, i) => {
                    const x = ((i * 12345) % width)
                    const speed = 1 + (i % 3)
                    const y = (height - ((i * 54321 + frame * speed) % height))
                    const size = 2 + (i % 3)
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
                                opacity: Math.sin(frame * 0.1 + i) * 0.5 + 0.5,
                            }}
                        />
                    )
                })}
            </AbsoluteFill>
        )
    }

    // Default Fallback
    return <AbsoluteFill style={{ backgroundColor: color }} />
}

export const VideoComposition = ({ scenes }: VideoCompositionProps) => {
    const { fps } = useVideoConfig()
    const frame = useCurrentFrame()

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {scenes.map((scene, index) => {
                const durationInFrames = Math.floor(scene.duration * fps)

                // Calculate fromFrame cleanly (React compiler safe)
                const fromFrame = scenes.slice(0, index).reduce(
                    (acc, s) => acc + Math.floor(s.duration * fps),
                    0
                )

                const sceneFrame = frame - fromFrame

                // Get extended scene properties (Video Editor adds these)
                const s = scene as typeof scene & { filter?: string, transition?: string }
                const filterCss = FILTER_CSS[s.filter ?? 'none'] || ''
                const transitionType = s.transition ?? 'none'

                // Animations
                const popScale = spring({ frame: sceneFrame, fps, config: { stiffness: 100 } })

                // Base entry animation values (overridden by transition type)
                let opacity = 1
                const transform = `scale(${popScale * 2.5})` // For the icon
                let bgTransform = 'none'
                let bgFilter = filterCss

                const transitionFrames = 15

                if (sceneFrame < transitionFrames && index > 0) {
                    if (transitionType === 'fade') {
                        opacity = interpolate(sceneFrame, [0, transitionFrames], [0, 1])
                    } else if (transitionType === 'slide') {
                        const translateX = interpolate(sceneFrame, [0, transitionFrames], [100, 0], { easing: Easing.out(Easing.ease) })
                        bgTransform = `translateX(${translateX}%)`
                    } else if (transitionType === 'zoom') {
                        const scale = interpolate(sceneFrame, [0, transitionFrames], [1.5, 1], { easing: Easing.out(Easing.ease) })
                        bgTransform = `scale(${scale})`
                        opacity = interpolate(sceneFrame, [0, transitionFrames], [0, 1])
                    } else if (transitionType === 'spin') {
                        const rotate = interpolate(sceneFrame, [0, transitionFrames], [-90, 0], { easing: Easing.out(Easing.ease) })
                        const scale = interpolate(sceneFrame, [0, transitionFrames], [0.5, 1], { easing: Easing.out(Easing.ease) })
                        bgTransform = `rotate(${rotate}deg) scale(${scale})`
                        opacity = interpolate(sceneFrame, [0, transitionFrames], [0, 1])
                    } else if (transitionType === 'flash') {
                        const bright = interpolate(sceneFrame, [0, transitionFrames], [5, 1])
                        bgFilter = `${filterCss} brightness(${bright})`
                    }
                }

                return (
                    <Sequence key={index} from={fromFrame} durationInFrames={durationInFrames}>
                        <AbsoluteFill style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity,
                            transform: bgTransform,
                            transformOrigin: 'center center'
                        }}>
                            {/* Animated Background Layer */}
                            {scene.videoUrl ? (
                                <AbsoluteFill>
                                    <Video
                                        src={scene.videoUrl}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            filter: bgFilter,
                                            transition: 'filter 0.1s'
                                        }}
                                        loop
                                    />
                                </AbsoluteFill>
                            ) : scene.imageUrl ? (
                                <AbsoluteFill>
                                    <Img
                                        src={scene.imageUrl}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            filter: bgFilter,
                                            transition: 'filter 0.1s'
                                        }}
                                    />
                                </AbsoluteFill>
                            ) : (
                                <AbsoluteFill style={{ filter: bgFilter, transition: 'filter 0.1s' }}>
                                    <BackgroundAnimation
                                        style={scene.animationStyle}
                                        color={scene.color}
                                        frame={sceneFrame}
                                    />
                                </AbsoluteFill>
                            )}

                            {/* Dark Overlay for text readability */}
                            <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} />

                            {/* Icon Layer */}
                            {scene.icon && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '25%',
                                        transform,
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
