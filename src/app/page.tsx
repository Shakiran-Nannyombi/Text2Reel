'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query'
import DescriptionInput from '@/components/text2reel/DescriptionInput'
import SceneGrid from '@/components/text2reel/SceneGrid'
import VideoPreview from '@/components/text2reel/VideoPreview'
import LandingPage from '@/components/text2reel/LandingPage'
import { useText2ReelStore } from '@/store/useText2ReelStore'
import { useState, useRef, useEffect } from 'react'
import {
  Dashboard,
  AutoStories,
  FolderOpen,
  Settings,
  Help,
  UnfoldMore,
  IosShare,
  AutoAwesome,
  ViewQuilt,
  PlayArrow,
  Pause,
  CloudUpload,
  Audiotrack
} from '@mui/icons-material'

const queryClient = new QueryClient()

function Text2ReelContent() {
  const { scenes, setScenes, updateScene, setIsLoading, userAssets, addUserAsset, activeAudioTrack, setActiveAudioTrack } = useText2ReelStore()
  const [showWorkspace, setShowWorkspace] = useState(false)
  const [activeView, setActiveView] = useState<'editor' | 'storyboards' | 'assets'>('editor')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cloud Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [cloudAssets, setCloudAssets] = useState<{ tracks: any[], images: any[] }>({ tracks: [], images: [] })

  const handleCloudSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const [spotifyRes, unsplashRes] = await Promise.all([
        fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}`),
        fetch(`/api/unsplash/search?q=${encodeURIComponent(searchQuery)}`)
      ])

      const tracks = spotifyRes.ok ? await spotifyRes.json() : []
      const images = unsplashRes.ok ? await unsplashRes.json() : []

      setCloudAssets({
        tracks: Array.isArray(tracks) ? tracks : [],
        images: Array.isArray(images) ? images : []
      })
    } catch (err) {
      console.error("Cloud search failed", err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Mock upload flow: Create local object URL
    const url = URL.createObjectURL(file)
    const type = file.type.startsWith('audio/') ? 'audio' : file.type.startsWith('image/') ? 'image' : 'video'

    addUserAsset({
      name: file.name,
      type,
      url
    })

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    // Lock body scroll when workspace is active to prevent double native scrollbars
    if (showWorkspace) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showWorkspace])

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
    onSuccess: (data: any) => {
      console.log('Scenes generated:', data)
      setScenes(data.scenes)
      setIsLoading(false)
    },
    onError: (error) => {
      console.error('Generation Error:', error)
      setIsLoading(false)
      alert('Failed to generate scenes. Please try again.')
    }
  })

  if (!showWorkspace) {
    return <LandingPage onGetStarted={() => setShowWorkspace(true)} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex h-dvh w-full bg-background-dark text-[#FFD9CC] font-sans selection:bg-primary/30 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-transparent opacity-40 z-0 pointer-events-none" />

      {/* Side Navigation */}
      <aside className="w-20 lg:w-64 border-r border-primary/10 flex flex-col glass-panel z-50 overflow-hidden">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 rounded-xl flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Text2Reel Logo"
              width={32}
              height={32}
              className="drop-shadow-[0_0_8px_rgba(247,154,122,0.4)] object-contain"
            />
          </div>
          <div className="hidden lg:block">
            <h1 className="font-display font-extrabold text-xl tracking-tight text-white leading-none">Text2Reel</h1>
            <p className="text-[10px] uppercase tracking-widest text-primary/60 font-semibold">Cinematic AI</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-hidden">
          <div
            onClick={() => setActiveView('editor')}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${activeView === 'editor' ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(247,154,122,0.1)]' : 'text-slate-400 hover:bg-primary/5 hover:text-primary'
              }`}
          >
            <Dashboard fontSize="small" />
            <span className="text-sm font-medium hidden lg:block">Editor</span>
          </div>
          <div
            onClick={() => setActiveView('storyboards')}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${activeView === 'storyboards' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:bg-primary/5 hover:text-primary'
              }`}
          >
            <AutoStories fontSize="small" />
            <span className="text-sm font-medium hidden lg:block">Storyboards</span>
          </div>
          <div
            onClick={() => setActiveView('assets')}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${activeView === 'assets' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:bg-primary/5 hover:text-primary'
              }`}
          >
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
          <div
            className="flex items-center gap-3 p-2 rounded-xl bg-surface-dark border border-primary/5 cursor-pointer hover:border-primary/20 transition-all"
            onClick={() => setShowWorkspace(false)}
            title="Back to Landing Page"
          >
            <div className="size-8 rounded-full bg-primary/20 overflow-hidden border border-primary/10 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Avatar"
                width={24}
                height={24}
                className="w-full h-full object-contain p-0.5"
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
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
        {activeView === 'editor' ? (
          <section className="flex-1 flex flex-col overflow-y-auto border-r border-primary/10 p-6 lg:p-8 space-y-8 atmospheric-glow relative z-10 custom-scrollbar shadow-inner">
            {/* Header Info */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-display text-3xl font-extrabold text-[#FFD9CC] leading-tight text-shadow-glow">Vision Workspace</h2>
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
            <div className="space-y-4 pb-12 overflow-hidden flex flex-col flex-1 min-h-[400px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ViewQuilt className="text-primary" />
                  <h3 className="font-display font-semibold text-lg uppercase tracking-wide">The Blueprint</h3>
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                  {scenes.length} SCENES • {scenes.reduce((acc, s) => acc + s.duration, 0).toFixed(1)}s TOTAL
                </span>
              </div>

              <div className="flex-1">
                <SceneGrid />
              </div>
            </div>
          </section>
        ) : activeView === 'storyboards' ? (
          <section className="flex-1 flex flex-col overflow-y-auto border-r border-primary/10 p-6 lg:p-8 space-y-8 atmospheric-glow relative z-10 custom-scrollbar shadow-inner">
            <div className="flex items-center gap-3 border-b border-primary/10 pb-6">
              <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                <AutoStories className="text-primary" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-[#FFD9CC] uppercase tracking-widest">Storyboards</h2>
                <p className="text-slate-400 text-xs italic">Chronological breakdown of the cinematic sequence</p>
              </div>
            </div>

            {scenes.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-slate-500 italic opacity-50">
                <AutoStories sx={{ fontSize: 64 }} className="mb-4 opacity-20" />
                <p>No vision generated yet. Proceed to Editor.</p>
              </div>
            ) : (
              <div className="space-y-6 pb-20">
                {scenes.map((scene, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-6 glass-panel p-4 rounded-3xl border border-primary/10 hover:border-primary/30 transition-all group">
                    <div className="relative w-full md:w-48 aspect-video bg-surface-dark rounded-2xl overflow-hidden shrink-0">
                      {scene.imageUrl ? (
                        <Image src={scene.imageUrl} alt={`Scene ${i + 1}`} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: scene.color }}>
                          <span className="text-white/30 font-black text-2xl">S{i + 1}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase border border-primary/20 px-2 py-1 rounded bg-primary/5">Scene 0{i + 1}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={scene.duration}
                            onChange={(e) => updateScene(i, { ...scene, duration: Number(e.target.value) })}
                            className="w-16 bg-transparent border-b border-primary/30 text-right focus:outline-none focus:border-primary text-xs font-bold text-slate-400"
                            min="0.5" step="0.5"
                          />
                          <span className="text-xs font-bold text-slate-400">s • {scene.animationStyle}</span>
                        </div>
                      </div>
                      <textarea
                        value={scene.text}
                        onChange={(e) => updateScene(i, { ...scene, text: e.target.value })}
                        className="w-full text-sm text-slate-300 italic leading-relaxed border-l-2 border-primary/20 pl-4 py-1 bg-transparent resize-none focus:outline-none focus:border-primary/50"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="flex-1 flex flex-col overflow-y-auto border-r border-primary/10 p-6 lg:p-8 space-y-8 atmospheric-glow relative z-10 custom-scrollbar shadow-inner">
            <div className="flex justify-between items-start border-b border-primary/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <FolderOpen className="text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#FFD9CC] uppercase tracking-widest">Project Assets</h2>
                  <p className="text-slate-400 text-xs italic">Upload media, select audio, and review extractions</p>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*, audio/*, video/*"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all"
              >
                <CloudUpload fontSize="small" />
                Upload Media
              </button>
            </div>

            <div className="space-y-8 pb-20">
              {/* Audio Library Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Audiotrack fontSize="small" className="text-primary/60" /> Audio Library
                  </h3>
                  {/* Cloud Search Bar */}
                  <form onSubmit={handleCloudSearch} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Spotify & Unsplash..."
                      className="bg-black/40 border border-primary/20 rounded-full px-4 py-1.5 text-xs text-[#FFD9CC] focus:outline-none focus:border-primary/50 w-48 placeholder:text-slate-600"
                    />
                    <button type="submit" disabled={isSearching || !searchQuery} className="bg-primary/20 text-primary px-3 py-1.5 rounded-full text-[10px] font-bold uppercase disabled:opacity-50 hover:bg-primary/30 transition-colors">
                      {isSearching ? '...' : 'Search'}
                    </button>
                  </form>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Render Cloud Tracks if available, else local */}
                  {(cloudAssets.tracks.length > 0 ? cloudAssets.tracks : userAssets.filter(a => a.type === 'audio')).map((audio: any) => {
                    const isCloud = !!audio.preview_url || !!audio.artists;
                    const trackName = isCloud ? String(audio.name) : String(audio.name);
                    const artistName = isCloud ? String(audio.artists?.[0]?.name) : 'Local Asset';
                    const audioUrl = isCloud ? audio.preview_url : audio.url;
                    const id = isCloud ? audio.id : audio.id;

                    return (
                      <div
                        key={id}
                        onClick={() => setActiveAudioTrack(activeAudioTrack === trackName ? null : trackName)}
                        className={`glass-panel p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all border ${activeAudioTrack === trackName ? 'border-primary shadow-[0_0_10px_rgba(247,154,122,0.2)]' : 'border-primary/10 hover:border-primary/30'}`}
                      >
                        <div className={`size-8 rounded-full flex items-center justify-center ${activeAudioTrack === trackName ? 'bg-primary text-background-dark' : 'bg-primary/20 text-primary'}`}>
                          {activeAudioTrack === trackName ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate text-[#FFD9CC]">{trackName}</p>
                          <p className="text-[9px] text-slate-500 uppercase tracking-widest truncate">{artistName}</p>
                        </div>
                      </div>
                    )
                  })}
                  {cloudAssets.tracks.length === 0 && userAssets.filter(a => a.type === 'audio').length === 0 && (
                    <div className="col-span-full py-4 text-center border border-dashed border-primary/20 rounded-xl bg-primary/5">
                      <p className="text-xs text-slate-400 italic">No audio tracks uploaded or found yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Imagery Section */}
              <div className="space-y-4">
                <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <FolderOpen fontSize="small" className="text-primary/60" /> Visual Assets
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {/* Cloud Images */}
                  {cloudAssets.images.map((img: any) => (
                    <div key={img.id} className="relative aspect-square glass-panel rounded-xl overflow-hidden group border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                      <Image src={img.urls.small} alt={img.alt_description || 'Unsplash'} fill className="object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute top-1 right-1 bg-blue-500/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[7px] text-white uppercase font-bold tracking-widest">Unsplash</div>
                    </div>
                  ))}

                  {/* Uploaded Visuals */}
                  {userAssets.filter(a => a.type === 'image' || a.type === 'video').map((asset) => (
                    <div key={asset.id} className="relative aspect-square glass-panel rounded-xl overflow-hidden group border border-primary/20 shadow-[0_0_15px_rgba(247,154,122,0.1)]">
                      {asset.type === 'image' ? (
                        <Image src={asset.url} alt={asset.name} fill className="object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface-dark"><PlayArrow className="text-primary opacity-50" /></div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-background-dark/90 to-transparent p-2 pt-6">
                        <p className="text-[8px] text-primary font-bold truncate">{asset.name}</p>
                      </div>
                    </div>
                  ))}

                  {/* Generated Imagery */}
                  {scenes.map((scene, i) => scene.imageUrl && (
                    <div key={`asset-${i}`} className="relative aspect-square glass-panel rounded-xl overflow-hidden group cursor-pointer border border-primary/10 hover:border-primary/40">
                      <Image src={scene.imageUrl} alt={`GenAsset ${i}`} fill className="object-cover opacity-60 group-hover:opacity-100 transition-all hover:scale-110" />
                      <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[7px] text-slate-300 uppercase font-bold tracking-widest border border-white/10">Gen</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

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
    </motion.div>
  )
}


export default function Text2ReelPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Text2ReelContent />
    </QueryClientProvider>
  )
}
