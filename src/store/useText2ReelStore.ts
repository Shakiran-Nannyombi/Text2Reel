import { create } from 'zustand'

export type Scene = {
    text: string
    duration: number
    color: string
    icon: string
    animationStyle: string
    imageUrl: string
}

interface Text2ReelState {
    scenes: Scene[]
    isLoading: boolean
    setScenes: (scenes: Scene[]) => void
    setIsLoading: (isLoading: boolean) => void
    updateScene: (index: number, scene: Scene) => void
}

export const useText2ReelStore = create<Text2ReelState>((set) => ({
    scenes: [],
    isLoading: false,
    setScenes: (scenes) => set({ scenes }),
    setIsLoading: (isLoading) => set({ isLoading }),
    updateScene: (index, value) =>
        set((state) => ({
            scenes: state.scenes.map((scene, i) => (i === index ? value : scene)),
        })),
}))
