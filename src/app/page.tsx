'use client'

import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import DescriptionInput from '@/components/text2reel/DescriptionInput'
import SceneGrid from '@/components/text2reel/SceneGrid'
import VideoPreview from '@/components/text2reel/VideoPreview'
import { useText2ReelStore } from '@/store/useText2ReelStore'
import {
  MovieFilter,
  Dashboard,
  AutoStories,
  FolderOpen,
  Settings,
  Help,
  UnfoldMore,
  IosShare,
  AutoAwesome,
  ViewQuilt
} from '@mui/icons-material'

const queryClient = new QueryClient()

function Text2ReelContent() {
  const { scenes, setScenes, setIsLoading } = useText2ReelStore()

  const mutation = useMutation({
    mutationFn: async (description: string) => {
      const res = await fetch('/api/generate-scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: description }),
      })
      if (!res.ok) throw new Error('Failed to generate scenes')
      return res.json()
    },
    onMutate: () => {
      setIsLoading(true)
    },
    onSuccess: (data) => {
      setScenes(data.scenes)
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
      alert('Failed to generate scenes. Please try again.')
    }
  })

  return (
    <div className="flex h-screen w-full bg-background-dark text-[#FFD9CC] font-sans selection:bg-primary/30">
      <div className="absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-transparent opacity-80 z-10" />
      {/* Side Navigation */}
      <aside className="w-20 lg:w-64 border-r border-primary/10 flex flex-col glass-panel z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <MovieFilter className="text-background-dark font-bold" />
          </div>
          <div className="hidden lg:block">
            <h1 className="font-display font-extrabold text-xl tracking-tight text-primary">Text2Reel</h1>
            <p className="text-[10px] uppercase tracking-widest text-primary/60 font-semibold">Cinematic AI</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-primary/10 text-primary border border-primary/20 cursor-pointer">
            <Dashboard fontSize="small" />
            <span className="text-sm font-medium hidden lg:block">Editor</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer group">
            <AutoStories fontSize="small" />
            <span className="text-sm font-medium hidden lg:block">Storyboards</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer group">
            <FolderOpen fontSize="small" />
            <span className="text-sm font-medium hidden lg:block">Assets</span>
          </div>

          <div className="pt-6 mt-6 border-t border-primary/5">
            <p className="px-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 hidden lg:block">Workspace</p>
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-primary/5 transition-colors cursor-pointer">
              <Settings fontSize="small" />
              <span className="text-sm font-medium hidden lg:block">Settings</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-primary/5 transition-colors cursor-pointer">
              <Help fontSize="small" />
              <span className="text-sm font-medium hidden lg:block">Support</span>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-primary/10">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-dark border border-primary/5 cursor-pointer hover:border-primary/20 transition-all">
            <div className="size-8 rounded-full bg-primary/20 overflow-hidden border border-primary/10">
              <Image
                src="/logo.svg"
                alt="Avatar"
                width={32}
                height={32}
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Shakiran</p>
              <p className="text-[10px] text-slate-500">UI Gardener</p>
            </div>
            <UnfoldMore fontSize="small" className="text-slate-500 hidden lg:block" />
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Image
            src="/text2reel.png"
            alt="Background"
            fill
            className="object-cover opacity-10"
            priority
          />
        </div>

        {/* Left Panel: Editor */}
        <section className="flex-1 flex flex-col overflow-y-auto no-scrollbar border-r border-primary/10 p-6 lg:p-8 space-y-8 atmospheric-glow relative z-10 custom-scrollbar">
          {/* Header Info */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-[#FFD9CC] leading-tight">Vision Workspace</h2>
              <p className="text-slate-400 mt-1 italic">Transform text into rhythmic reels</p>
            </div>
            <button
              className="bg-primary hover:bg-[#FFD9CC] text-background-dark font-display font-black px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
              disabled={scenes.length === 0}
            >
              <IosShare fontSize="small" />
              Export Reel
            </button>
          </div>

          {/* Section 1: The Vision */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AutoAwesome className="text-primary" />
              <h3 className="font-display font-semibold text-lg uppercase tracking-wide">The Vision</h3>
            </div>
            <div className="relative glass-panel rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/40 transition-all shadow-inner">
              <DescriptionInput onSubmit={(data) => mutation.mutate(data.description)} />
            </div>
          </div>

          {/* Section 2: The Blueprint */}
          <div className="space-y-4 pb-12 overflow-hidden flex flex-col flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ViewQuilt className="text-primary" />
                <h3 className="font-display font-semibold text-lg uppercase tracking-wide">The Blueprint</h3>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                {scenes.length} SCENES • {scenes.reduce((acc, s) => acc + s.duration, 0).toFixed(1)}s TOTAL
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <SceneGrid />
            </div>
          </div>
        </section>

        {/* Right Panel: Preview Player */}
        <section className="w-full lg:w-[500px] bg-black/40 flex flex-col items-center justify-center p-8 lg:p-12 border-l border-primary/10 relative z-10">
          <div className="relative w-full max-w-[320px] aspect-9/16 atmospheric-glow rounded-[40px] border-12 border-slate-900 shadow-2xl overflow-hidden bg-background-dark">
            <VideoPreview />

            {/* Status Overlay */}
            <div className="absolute top-8 left-8 z-20 pointer-events-none">
              <div className="glass px-3 py-1.5 rounded-lg flex items-center gap-2 border border-primary/30">
                <div className="size-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_red]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD9CC]">Live Preview</span>
              </div>
            </div>
          </div>

          {/* Preview Info Labels */}
          <div className="mt-8 text-center space-y-2 max-w-[280px]">
            <p className="text-primary font-display font-bold tracking-widest text-[10px] uppercase">Cinematic 9:16 Preview</p>
            <p className="text-slate-400 text-xs font-medium leading-relaxed italic opacity-70">
              Preview rendered with Spring physics and Sunset Orange color grading.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function Text2ReelPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Text2ReelContent />
    </QueryClientProvider>
  )
}
