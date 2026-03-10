'use client'

import { Player } from '@remotion/player'
import { DemoComposition } from './DemoComposition'

export default function DemoPlayer() {
    return (
        <Player
            component={DemoComposition}
            durationInFrames={270}
            fps={30}
            compositionWidth={1920}
            compositionHeight={1080}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            }}
            autoPlay
            loop
            controls
        />
    )
}
