'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query'
import DescriptionInput from '@/components/text2reel/DescriptionInput'
import SceneGrid from '@/components/text2reel/SceneGrid'
import VideoPreview from '@/components/text2reel/VideoPreview'
import VideoEditor from '@/components/text2reel/VideoEditor'
import ProjectsList from '@/components/text2reel/ProjectsList'
import SettingsPage from '@/components/text2reel/SettingsPage'
import LandingPage from '@/components/text2reel/LandingPage'
import { Toaster, toast } from 'react-hot-toast'
import { useText2ReelStore, type Scene, type UserAsset } from '@/store/useText2ReelStore'

interface CloudTrack {
  id: string
  name: string
  preview_url?: string
  artists?: { name: string }[]
  [key: string]: unknown
}

interface CloudImage {
  id: string
  urls: { small: string }
  alt_description: string
  [key: string]: unknown
}
import { useState, useRef, useEffect } from 'react'
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  Archive,
  Settings,
  HelpCircle,
  Expand,
  Share,
  Sparkles,
  LayoutGrid,
  Play,
  Pause,
  Upload,
  Music,
  LogOut
} from 'lucide-react'

const queryClient = new QueryClient()

function Text2ReelContent() {
  const {
    scenes, setScenes,
    activeAudioTrack, setActiveAudioTrack,
    userAssets, addUserAsset,
    selectedAssetUrl, setSelectedAssetUrl,
    setIsLoading,
    showWorkspace, setShowWorkspace,
    activeView, setActiveView
  } = useText2ReelStore()

  const [mounted, setMounted] = useState(false)
  const [savedProjectId, setSavedProjectId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Cloud Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [cloudAssets, setCloudAssets] = useState<{ tracks: CloudTrack[], images: CloudImage[] }>({ tracks: [], images: [] })

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

  // Save the current project to SQLite via Next.js API route (no separate backend needed)
  const handleSaveProject = async () => {
    if (scenes.length === 0) return
    setIsSaving(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: savedProjectId ?? undefined,
          name: 'My Reel',
          scenes,
        })
      })
      const data = await res.json()
      if (res.ok) {
        setSavedProjectId(data.project.id)
        toast.success(`Project saved to SQLite! (ID: ${data.project.id.slice(0, 8)}…)`)
      } else {
        toast.error('Failed to save: ' + (data.error ?? 'Unknown error'))
      }
    } catch {
      toast.error('Could not connect to the save API.')
    } finally {
      setIsSaving(false)
    }
  }

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
    onSuccess: (data: { scenes: Scene[] }) => {
      console.log('Scenes generated:', data)
      setScenes(data.scenes)
      setIsLoading(false)
    },
    onError: (error) => {
      console.error('Generation Error:', error)
      setIsLoading(false)
      toast.error('Failed to generate scenes. Please try again.')
    }
  })

  // Prevent hydration errors by not rendering until client runs inside useText2ReelStore
  if (!mounted) return null

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
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#16213e',
            color: '#FFD9CC',
            border: '1px solid rgba(247,154,122,0.2)',
          }
        }}
      />
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
            <LayoutDashboard size={20} />
            <span className="text-sm font-medium hidden lg:block">Editor</span>
          </div >
          <div
            onClick={() => setActiveView('storyboards')}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${activeView === 'storyboards' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:bg-primary/5 hover:text-primary'
              }`}
          >
            <BookOpen size={20} />
            <span className="text-sm font-medium hidden lg:block">Storyboards</span>
          </div>
          <div
            onClick={() => setActiveView('assets')}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${activeView === 'assets' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:bg-primary/5 hover:text-primary'
              }`}
          >
            <FolderOpen size={20} />
            <span className="text-sm font-medium hidden lg:block">Assets</span>
          </div>
          <div
            onClick={() => setActiveView('projects')}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${activeView === 'projects' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:bg-primary/5 hover:text-primary'
              }`}
          >
            <Archive size={20} />
            <span className="text-sm font-medium hidden lg:block">Projects</span>
          </div>

          <div className="pt-6 mt-6 border-t border-primary/5">
            <p className="px-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 hidden lg:block">Workspace</p>
            <div onClick={() => setActiveView('settings')} className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${activeView === 'settings' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:bg-primary/5 hover:text-primary'}`}>
              <Settings size={20} />
              <span className="text-sm font-medium hidden lg:block">Settings</span>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-primary/10">
          <div
            className="flex items-center gap-3 p-2 rounded-xl bg-surface-dark border border-primary/5 cursor-pointer hover:border-primary/20 hover:bg-primary/5 transition-all group"
            onClick={() => setShowWorkspace(false)}
            title="Back to Landing Page"
          >
            <div className="size-8 rounded-full bg-primary/10 overflow-hidden border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
              <LogOut size={16} />
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Back Home</p>
              <p className="text-[10px] text-slate-500">Exit Workspace</p>
            </div>
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
                onClick={handleSaveProject}
                disabled={scenes.length === 0 || isSaving}
                className="bg-primary hover:bg-[#FFD9CC] text-background-dark font-display font-black px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
              >
                <Share size={16} />
                {isSaving ? 'Saving…' : savedProjectId ? 'Update Save' : 'Save Video'}
              </button>
            </div>

            {/* Section 1: The Vision */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary" />
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
                  <LayoutGrid className="text-primary" />
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
          <section className="flex-1 flex flex-col border-r border-primary/10 overflow-hidden atmospheric-glow relative z-10 shadow-inner">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-primary/10 px-6 py-4 shrink-0">
              <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <BookOpen className="text-primary" fontSize="small" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-[#FFD9CC] uppercase tracking-widest">Video Editor</h2>
                <p className="text-slate-400 text-[10px] italic">Timeline · Transitions · Filters · Effects</p>
              </div>
            </div>
            {/* CapCut-style editor fills the rest */}
            <div className="flex-1 overflow-hidden">
              <VideoEditor />
            </div>
          </section>
        ) : activeView === 'assets' ? (
          <section className="flex-1 flex flex-col overflow-y-auto border-r border-primary/10 p-6 lg:p-8 space-y-8 atmospheric-glow relative z-10 custom-scrollbar shadow-inner">
            <div className="flex justify-between items-start border-b border-primary/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <FolderOpen size={24} className="text-primary" />
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
                <Upload fontSize="small" />
                Upload Media
              </button>
            </div>

            <div className="space-y-8 pb-20">
              {/* Audio Library Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Music fontSize="small" className="text-primary/60" /> Audio Library
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
                  {(cloudAssets.tracks.length > 0 ? cloudAssets.tracks : userAssets.filter(a => a.type === 'audio')).map((audio: CloudTrack | UserAsset) => {
                    const isCloud = 'preview_url' in audio || 'artists' in audio;
                    const trackName = isCloud ? String(audio.name) : String(audio.name);
                    const artistName = isCloud && 'artists' in audio && audio.artists ? String(audio.artists[0]?.name) : 'Local Asset';
                    const id = audio.id;

                    return (
                      <div
                        key={id}
                        onClick={() => setActiveAudioTrack(activeAudioTrack === trackName ? null : trackName)}
                        className={`glass-panel p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all border ${activeAudioTrack === trackName ? 'border-primary shadow-[0_0_10px_rgba(247,154,122,0.2)]' : 'border-primary/10 hover:border-primary/30'}`}
                      >
                        <div className={`size-8 rounded-full flex items-center justify-center ${activeAudioTrack === trackName ? 'bg-primary text-background-dark' : 'bg-primary/20 text-primary'}`}>
                          {activeAudioTrack === trackName ? <Pause size={14} /> : <Play size={14} />}
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
                  <FolderOpen size={16} className="text-primary/60" /> Visual Assets
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {/* Cloud Images */}
                  {cloudAssets.images.map((img: CloudImage) => (
                    <div
                      key={img.id}
                      onClick={() => setSelectedAssetUrl(img.urls.small)}
                      className={`relative aspect-square glass-panel rounded-xl overflow-hidden group border cursor-pointer transition-all ${selectedAssetUrl === img.urls.small ? 'border-primary shadow-[0_0_15px_rgba(247,154,122,0.4)] scale-105' : 'border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:border-primary/50'}`}
                    >
                      <Image src={img.urls.small} alt={img.alt_description || 'Unsplash'} fill className="object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute top-1 right-1 bg-blue-500/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[7px] text-white uppercase font-bold tracking-widest">Unsplash</div>
                    </div>
                  ))}

                  {/* Uploaded Visuals */}
                  {userAssets.filter(a => a.type === 'image' || a.type === 'video').map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAssetUrl(asset.url)}
                      className={`relative aspect-square glass-panel rounded-xl overflow-hidden group border cursor-pointer transition-all ${selectedAssetUrl === asset.url ? 'border-primary shadow-[0_0_15px_rgba(247,154,122,0.4)] scale-105' : 'border-primary/20 shadow-[0_0_15px_rgba(247,154,122,0.1)] hover:border-primary/50'}`}
                    >
                      {asset.type === 'image' ? (
                        <Image src={asset.url} alt={asset.name} fill className="object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface-dark"><Play size={24} className="text-primary opacity-50" /></div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-background-dark/90 to-transparent p-2 pt-6">
                        <p className="text-[8px] text-primary font-bold truncate">{asset.name}</p>
                      </div>
                    </div>
                  ))}

                  {/* Generated Imagery */}
                  {scenes.map((scene, i) => scene.imageUrl && (
                    <div
                      key={`asset-${i}`}
                      onClick={() => setSelectedAssetUrl(scene.imageUrl)}
                      className={`relative aspect-square glass-panel rounded-xl overflow-hidden group cursor-pointer border transition-all ${selectedAssetUrl === scene.imageUrl ? 'border-primary shadow-[0_0_15px_rgba(247,154,122,0.4)] scale-105' : 'border-primary/10 hover:border-primary/40'}`}
                    >
                      <Image src={scene.imageUrl} alt={`GenAsset ${i}`} fill className="object-cover opacity-60 group-hover:opacity-100 transition-all hover:scale-110" />
                      <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[7px] text-slate-300 uppercase font-bold tracking-widest border border-white/10">Gen</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : activeView === 'instructions' ? (
          <section className="flex-1 flex flex-col overflow-y-auto border-r border-primary/10 p-6 lg:p-12 space-y-8 atmospheric-glow relative z-10 custom-scrollbar shadow-inner">
            <div className="flex justify-between items-start border-b border-primary/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <HelpCircle className="text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#FFD9CC] uppercase tracking-widest">Guide</h2>
                  <p className="text-slate-400 text-xs italic">User Guide to editing and previewing your reels</p>
                </div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-primary/20">
                <h3 className="text-primary font-display font-semibold uppercase tracking-widest text-sm mb-4">1. Generating the Vision</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Navigate to the <strong>Editor</strong> tab. Type an idea like <i>&quot;A cinematic journey through a cyberpunk city&quot;</i> and submit. Text2Reel connects to the Groq API to construct a storyboard sequence with animation details, text overlays, and duration.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-primary/20">
                <h3 className="text-primary font-display font-semibold uppercase tracking-widest text-sm mb-4">2. Modifying Storyboards</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  In both the <strong>Editor</strong> and <strong>Storyboards</strong> views, the breakdown of scenes is presented.
                </p>
                <ul className="list-disc list-inside text-sm text-slate-400 space-y-2">
                  <li><strong>Edit Text:</strong> Click directly into the text area of any scene block to edit the subtitle text inline.</li>
                  <li><strong>Edit Timing:</strong> Click on the numeric <code>&lt;input&gt;</code> (e.g. <code>2.5s</code>) to fine-tune exactly how many seconds the scene lasts.</li>
                </ul>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-primary/20">
                <h3 className="text-primary font-display font-semibold uppercase tracking-widest text-sm mb-4">3. Adding Custom Images</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  By default, AI may insert generated imagery. If you want to use specific photos:
                </p>
                <ol className="list-decimal list-inside text-sm text-slate-400 space-y-2">
                  <li>Go to the <strong>Assets</strong> tab.</li>
                  <li>Search for an image (Unsplash) or upload a local image.</li>
                  <li><strong>Click the image</strong> in the Assets grid to select it (it will glow orange).</li>
                  <li>Return to the <strong>Editor</strong> or <strong>Storyboards</strong> tab.</li>
                  <li>Click the <strong>&quot;Paste Selected Asset&quot;</strong> button now visible on any scene to apply your chosen image.</li>
                </ol>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-primary/20">
                <h3 className="text-primary font-display font-semibold uppercase tracking-widest text-sm mb-4">4. Video Preview & Export</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  The right panel contains a real-time <a href="https://www.remotion.dev/" className="text-blue-400 underline" target="_blank">Remotion</a> player. Use the Play/Pause, Rewind, and Skip buttons to review your reel. Once satisfied, external tools can be integrated with the &quot;Export Reel&quot; button to render the final MP4.
                </p>
              </div>
            </div>
          </section>
        ) : activeView === 'projects' ? (
          <ProjectsList onProjectLoaded={(id: string) => {
            setSavedProjectId(id)
            setActiveView('editor')
          }} />
        ) : activeView === 'settings' ? (
          <SettingsPage />
        ) : null}

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
