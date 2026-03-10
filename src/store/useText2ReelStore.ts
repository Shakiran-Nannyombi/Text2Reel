import { create } from 'zustand'

export type Scene = {
    text: string
    duration: number
    color: string
    icon: string
    animationStyle: string
    imageUrl: string
    videoUrl?: string
}

export type UserAsset = {
    id: string
    type: 'image' | 'video' | 'audio'
    url: string
    name: string
}

interface Text2ReelState {
    scenes: Scene[]
    userAssets: UserAsset[]
    activeAudioTrack: string | null
    selectedAssetUrl: string | null
    isLoading: boolean
    setScenes: (scenes: Scene[]) => void
    addUserAsset: (asset: Omit<UserAsset, 'id'>) => void
    setActiveAudioTrack: (trackName: string | null) => void
    setSelectedAssetUrl: (url: string | null) => void
    setIsLoading: (isLoading: boolean) => void
    updateScene: (index: number, scene: Scene) => void
}

export const useText2ReelStore = create<Text2ReelState>((set) => ({
    scenes: [],
    userAssets: [
        { id: '1', type: 'audio', url: '#', name: 'Cyberpunk Neon Beats' },
        { id: '2', type: 'audio', url: '#', name: 'Mountain Cabin Acoustic' },
        { id: '3', type: 'audio', url: '#', name: 'Abstract Fluid Bass' }
    ], // Initial mock data
    activeAudioTrack: null,
    selectedAssetUrl: null,
    isLoading: false,
    setScenes: (scenes) => set({ scenes }),
    addUserAsset: (asset) => set((state) => ({
        userAssets: [{ ...asset, id: Math.random().toString(36).substring(7) }, ...state.userAssets]
    })),
    setActiveAudioTrack: (trackName) => set({ activeAudioTrack: trackName }),
    setSelectedAssetUrl: (url) => set({ selectedAssetUrl: url }),
    setIsLoading: (isLoading) => set({ isLoading }),
    updateScene: (index, value) =>
        set((state) => ({
            scenes: state.scenes.map((scene, i) => (i === index ? value : scene)),
        })),
}))
