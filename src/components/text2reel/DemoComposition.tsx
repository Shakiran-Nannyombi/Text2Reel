import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig, Audio, random } from 'remotion'

const Particle = ({ i, color }: { i: number; color: string }) => {
    const frame = useCurrentFrame()
    const { width, height } = useVideoConfig()

    // Deterministic random values based on index
    const seed = i * 133.7
    const randomX = random(seed) * width
    const randomY = random(seed + 1) * height
    const delay = random(seed + 2) * 100
    const speedX = (random(seed + 3) - 0.5) * 2
    const speedY = (random(seed + 4) - 0.5) * 2

    const opacity = interpolate(
        frame - delay,
        [0, 20, 150, 200],
        [0, 0.6, 0.6, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )

    const x = randomX + speedX * frame
    const y = randomY + speedY * frame

    return (
        <div
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: 2 + random(seed + 5) * 4,
                height: 2 + random(seed + 5) * 4,
                borderRadius: '50%',
                backgroundColor: color,
                opacity,
                boxShadow: `0 0 15px ${color}`,
                filter: 'blur(1px)'
            }}
        />
    )
}

const ProceduralRings = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', opacity: 0.1 }}>
            {[1, 2, 3].map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: 400 + i * 300,
                        height: 400 + i * 300,
                        borderRadius: '50%',
                        border: '2px dashed rgba(247, 152, 120, 0.4)',
                        transform: `rotate(${frame * (0.2 + i * 0.1)}deg)`,
                    }}
                />
            ))}
        </AbsoluteFill>
    );
};

const DataNodes = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <AbsoluteFill style={{ pointerEvents: 'none', opacity: 0.15 }}>
            {Array.from({ length: 15 }).map((_, i) => {
                const seed = i * 99;
                const x = random(seed) * width;
                const y = random(seed + 1) * height;
                const size = 4 + random(seed + 2) * 8;
                const pulse = interpolate(Math.sin(frame / 20 + i), [-1, 1], [0.3, 1]);
                return (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: x,
                            top: y,
                            width: size,
                            height: size,
                            backgroundColor: '#f79a7a',
                            borderRadius: '50%',
                            opacity: pulse,
                            boxShadow: '0 0 20px #f79a7a'
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};

const Grid = () => {
    const frame = useCurrentFrame()
    const opacity = interpolate(frame % 90, [0, 45, 90], [0.05, 0.1, 0.05])

    return (
        <AbsoluteFill style={{ opacity, pointerEvents: 'none' }}>
            <div style={{
                width: '100%',
                height: '100%',
                backgroundImage: `
                    linear-gradient(to right, rgba(247, 152, 120, 0.2) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(247, 152, 120, 0.2) 1px, transparent 1px)
                `,
                backgroundSize: '100px 100px',
                transform: `perspective(1000px) rotateX(60deg) translateY(${frame % 100}px)`,
                transformOrigin: 'top'
            }} />
        </AbsoluteFill>
    )
}

const Halo = ({ color, i }: { color: string; i: number }) => {
    const frame = useCurrentFrame()
    const scale = interpolate(frame, [0, 270], [1, 1.5])
    const opacity = interpolate(frame % 135, [0, 67, 135], [0, 0.2, 0])
    const x = random(i) * 100
    const y = random(i + 1) * 100

    return (
        <div style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: 800,
            height: 800,
            transform: `translate(-50%, -50%) scale(${scale})`,
            background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
            filter: 'blur(120px)',
            opacity
        }} />
    )
}

const SceneContent = ({ text, color, subtitle }: { text: string; color: string; subtitle: string }) => {
    const frame = useCurrentFrame()
    const { fps } = useVideoConfig()

    const entry = spring({
        frame,
        fps,
        config: { damping: 12 }
    })

    const titleOpacity = interpolate(frame, [0, 15, 75, 90], [0, 1, 1, 0])
    const titleScale = interpolate(entry, [0, 1], [0.85, 1])

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
                transform: `scale(${titleScale})`,
                opacity: titleOpacity,
                textAlign: 'center'
            }}>
                <h1 style={{
                    color: 'white',
                    fontSize: 120,
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 900,
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    textShadow: `0 0 40px ${color}`
                }}>
                    {text}
                </h1>
                <div style={{
                    width: interpolate(entry, [0, 1], [0, 200]),
                    height: 4,
                    backgroundColor: color,
                    margin: '20px auto',
                    borderRadius: 2
                }} />
                <p style={{
                    color: color,
                    fontSize: 24,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6em',
                    opacity: 0.8
                }}>
                    {subtitle}
                </p>
            </div>
        </AbsoluteFill>
    )
}

export const DemoComposition = () => {
    const frame = useCurrentFrame();
    const colors = ['#f79a7a', '#7aa7f7', '#a77af7']

    const scanlineY = interpolate(frame % 90, [0, 90], [-100, 1100]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#020617', overflow: 'hidden' }}>
            {/* Background Music */}
            <Audio src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" volume={0.3} />

            {/* Background Grid */}
            <Grid />

            {/* Background Procedural Depth */}
            <ProceduralRings />
            <DataNodes />

            {/* Ambient Halos */}
            {colors.map((c, i) => <Halo key={i} color={c} i={i} />)}

            {/* Global Particles */}
            {Array.from({ length: 60 }).map((_, i) => (
                <Particle
                    key={i}
                    i={i}
                    color={colors[i % colors.length]}
                />
            ))}

            <Sequence from={0} durationInFrames={90}>
                <SceneContent
                    text="Vision"
                    color="#f79a7a"
                    subtitle="AI Storyboarding"
                />
            </Sequence>

            <Sequence from={90} durationInFrames={90}>
                <SceneContent
                    text="Blueprint"
                    color="#7aa7f7"
                    subtitle="Neural Director"
                />
            </Sequence>

            <Sequence from={180} durationInFrames={90}>
                <SceneContent
                    text="Render"
                    color="#a77af7"
                    subtitle="Cinematic Reality"
                />
            </Sequence>

            {/* Vignette Overlay */}
            <AbsoluteFill style={{
                boxShadow: 'inset 0 0 300px rgba(0,0,0,0.9)',
                pointerEvents: 'none'
            }} />

            {/* Scanning Bar */}
            <div style={{
                position: 'absolute',
                top: `${scanlineY}%`,
                left: 0,
                right: 0,
                height: 2,
                background: 'linear-gradient(to right, transparent, rgba(247, 154, 122, 0.5), transparent)',
                boxShadow: '0 0 20px rgba(247, 154, 122, 0.8)',
                opacity: 0.3,
                pointerEvents: 'none'
            }} />

            {/* Subtle Screen Scanlines */}
            <AbsoluteFill style={{
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 4px, 3px 100%',
                pointerEvents: 'none',
                opacity: 0.1
            }} />
        </AbsoluteFill>
    )
}
