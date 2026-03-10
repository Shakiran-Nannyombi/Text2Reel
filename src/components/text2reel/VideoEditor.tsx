'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useText2ReelStore } from '@/store/useText2ReelStore'
import {
    Plus,
    Sliders,
    Palette,
    Wand2,
    Sparkles,
    Music,
    Play,
    Trash2,
    Camera,
    ArrowRightLeft,
    CheckCircle2
} from 'lucide-react'
import IconRenderer from './IconRenderer'

const TRANSITIONS = [
    { id: 'none', label: 'None' },
    { id: 'fade', label: 'Fade' },
    { id: 'slide', label: 'Slide' },
    { id: 'zoom', label: 'Zoom' },
    { id: 'spin', label: 'Spin' },
    { id: 'flash', label: 'Flash' },
]

const FILTERS = [
    { id: 'none', label: 'Original', css: '' },
    { id: 'cinematic', label: 'Cinematic', css: 'contrast(1.2) saturate(0.8) sepia(0.15)' },
    { id: 'vivid', label: 'Vivid', css: 'saturate(1.8) contrast(1.1)' },
    { id: 'noir', label: 'Noir', css: 'grayscale(1) contrast(1.3)' },
    { id: 'warm', label: 'Warm', css: 'sepia(0.4) saturate(1.2)' },
    { id: 'cool', label: 'Cool', css: 'hue-rotate(180deg) saturate(0.9)' },
    { id: 'neon', label: 'Neon', css: 'hue-rotate(90deg) saturate(2) contrast(1.3)' },
    { id: 'vintage', label: 'Vintage', css: 'sepia(0.8) contrast(1.2) brightness(0.9)' },
    { id: 'dream', label: 'Dreamy', css: 'contrast(0.9) brightness(1.2) saturate(1.5)' },
]

const EFFECTS = [
    { id: 'none', label: 'None' },
    { id: 'particles', label: 'Particles' },
    { id: 'waves', label: 'Waves' },
    { id: 'gradient-pulse', label: 'Pulse' },
    { id: 'gradient', label: 'Gradient' },
    { id: 'scanlines', label: 'VHS Scanlines' },
    { id: 'stars', label: 'Starfield' },
]

type EditorTab = 'transitions' | 'filters' | 'effects' | 'color' | 'audio'

export default function VideoEditor() {
    const { scenes, setScenes, updateScene, selectedAssetUrl, setSelectedAssetUrl, userAssets } = useText2ReelStore()
    const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0)
    const [activeTab, setActiveTab] = useState<EditorTab>('transitions')

    const selectedScene = scenes[selectedSceneIndex]

    if (scenes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center opacity-50">
                <Play size={64} className="text-primary/30 mb-4" />
                <p className="text-slate-400 text-sm italic">Generate a vision first to start editing.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">

            {/* ── Timeline Strip ──────────────────────────────── */}
            <div className="shrink-0 border-b border-primary/10 bg-black/30">
                <div className="flex items-center gap-1 px-4 py-3 overflow-x-auto custom-scrollbar">
                    {scenes.map((scene, i) => (
                        <div key={i} className="flex items-center gap-1 shrink-0">

                            {/* Scene clip */}
                            <button
                                onClick={() => setSelectedSceneIndex(i)}
                                className={`relative shrink-0 h-20 rounded-xl overflow-hidden border-2 transition-all group ${selectedSceneIndex === i
                                    ? 'border-primary shadow-[0_0_12px_rgba(247,154,122,0.5)] scale-105'
                                    : 'border-white/10 hover:border-primary/40'
                                    }`}
                                style={{ width: `${Math.max(60, scene.duration * 25)}px` }}
                            >
                                {/* Thumbnail */}
                                {scene.imageUrl ? (
                                    <Image src={scene.imageUrl} alt="scene" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: scene.color }}>
                                        {scene.icon && <IconRenderer iconName={scene.icon} className="text-white/40" />}
                                    </div>
                                )}
                                {/* Duration label */}
                                <div className="absolute bottom-0.5 right-1 bg-black/70 rounded text-[8px] font-bold text-white px-1">
                                    {scene.duration}s
                                </div>
                                {/* Scene number */}
                                <div className="absolute top-0.5 left-1 bg-primary/80 rounded text-[7px] font-black text-background-dark px-1">
                                    S{i + 1}
                                </div>
                                {/* Paste image/video badge */}
                                {selectedAssetUrl && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const isVideo = userAssets.find(a => a.url === selectedAssetUrl)?.type === 'video'
                                            if (isVideo) {
                                                updateScene(i, { ...scene, imageUrl: '', videoUrl: selectedAssetUrl })
                                            } else {
                                                updateScene(i, { ...scene, imageUrl: selectedAssetUrl, videoUrl: '' })
                                            }
                                            setSelectedAssetUrl(null)
                                        }}
                                        className="absolute inset-0 bg-primary/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                        title="Paste selected media"
                                    >
                                        <Camera size={20} className="text-background-dark mb-1" />
                                        <span className="text-[8px] font-black text-background-dark uppercase">Paste Asset</span>
                                    </button>
                                )}
                            </button>

                            {/* Transition connector between scenes */}
                            {i < scenes.length - 1 && (
                                <div className="text-slate-600 px-0.5 shrink-0">
                                    <ArrowRightLeft size={12} />
                                </div>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            setScenes([...scenes, {
                                id: `scene-${Date.now()}`,
                                text: 'New blank scene',
                                duration: 3,
                                color: '#16213e',
                                animationStyle: 'none',
                                transition: 'fade' // default transition
                            } as never])
                            setSelectedSceneIndex(scenes.length)
                        }}
                        className="ml-2 size-14 rounded-xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-primary/40 hover:text-primary hover:border-primary/50 transition-all shrink-0 group cursor-pointer"
                        title="Add Empty Scene"
                    >
                        <Plus size={24} />
                        <span className="text-[7px] font-black uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100">Add</span>
                    </button>
                </div>
            </div>

            {/* ── Editor Panel ─────────────────────────────────── */}
            {selectedScene && (
                <div className="flex flex-1 overflow-hidden">

                    {/* Left: Scene preview */}
                    <div className="w-44 shrink-0 p-4 border-r border-primary/10 space-y-3 flex flex-col">
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary">Scene {selectedSceneIndex + 1}</p>

                        {/* Mini preview */}
                        <div
                            className="relative aspect-9/16 rounded-xl overflow-hidden border border-primary/20 cursor-pointer"
                            style={{
                                backgroundColor: selectedScene.color,
                                filter: FILTERS.find(f => f.id === ((selectedScene as { filter?: string }).filter ?? 'none'))?.css
                                    ? `filter: ${FILTERS.find(f => f.id === ((selectedScene as { filter?: string }).filter ?? 'none'))?.css}`
                                    : undefined
                            }}
                        >
                            {selectedScene.videoUrl ? (
                                <video src={selectedScene.videoUrl} className="object-cover w-full h-full opacity-80" autoPlay loop muted />
                            ) : selectedScene.imageUrl ? (
                                <Image src={selectedScene.imageUrl} alt="scene" fill className="object-cover opacity-80" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-30">
                                    {selectedScene.icon && <IconRenderer iconName={selectedScene.icon} className="text-white text-3xl" />}
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-end p-2 bg-linear-to-t from-black/60 to-transparent">
                                <p className="text-[8px] text-white font-bold leading-tight line-clamp-3">{selectedScene.text}</p>
                            </div>
                        </div>

                        {/* Duration slider */}
                        <div>
                            <label className="text-[9px] text-slate-500 uppercase tracking-widest">Duration: {selectedScene.duration}s</label>
                            <input
                                type="range" min="1" max="10" step="0.5"
                                value={selectedScene.duration}
                                onChange={(e) => updateScene(selectedSceneIndex, { ...selectedScene, duration: Number(e.target.value) })}
                                className="w-full accent-[#f79a7a] cursor-pointer"
                            />
                        </div>

                        {/* Text overlay */}
                        <div>
                            <label className="text-[9px] text-slate-500 uppercase tracking-widest">Caption</label>
                            <textarea
                                value={selectedScene.text}
                                onChange={(e) => updateScene(selectedSceneIndex, { ...selectedScene, text: e.target.value })}
                                rows={3}
                                className="w-full bg-black/30 border border-primary/20 rounded-lg text-xs text-slate-300 p-1.5 resize-none focus:outline-none focus:border-primary/50 mt-1"
                            />
                        </div>

                        {/* Delete scene */}
                        <button
                            onClick={() => {
                                const newScenes = scenes.filter((_, idx) => idx !== selectedSceneIndex)
                                setScenes(newScenes)
                                setSelectedSceneIndex(Math.max(0, selectedSceneIndex - 1))
                            }}
                            className="flex items-center gap-1 text-red-400 hover:text-red-300 text-[9px] uppercase tracking-widest font-bold transition-colors cursor-pointer mt-auto"
                        >
                            <Trash2 size={12} /> Remove
                        </button>
                    </div>

                    {/* Right: Tool tabs */}
                    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                        {/* Tab bar */}
                        <div className="flex border-b border-primary/10 bg-black/20 shrink-0 overflow-x-auto">
                            {([
                                { id: 'transitions', icon: <ArrowRightLeft size={14} />, label: 'Transition' },
                                { id: 'filters', icon: <Sparkles size={14} />, label: 'Filter' },
                                { id: 'effects', icon: <Wand2 size={14} />, label: 'Effect' },
                                { id: 'color', icon: <Palette size={14} />, label: 'Color' },
                                { id: 'audio', icon: <Music size={14} />, label: 'Audio' },
                            ] as { id: EditorTab; icon: React.ReactNode; label: string }[]).map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-1.5 px-4 py-2.5 text-[9px] uppercase tracking-widest font-bold border-b-2 shrink-0 transition-all ${activeTab === tab.id
                                        ? 'border-primary text-primary bg-primary/5'
                                        : 'border-transparent text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">

                            {/* TRANSITIONS */}
                            {activeTab === 'transitions' && (
                                <div>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-3">Choose transition into this scene</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {TRANSITIONS.map(t => {
                                            const active = ((selectedScene as { transition?: string }).transition ?? 'none') === t.id
                                            return (
                                                <button
                                                    key={t.id}
                                                    onClick={() => updateScene(selectedSceneIndex, { ...selectedScene, transition: t.id } as never)}
                                                    className={`glass-panel rounded-xl py-4 px-2 flex flex-col items-center justify-center gap-2 border transition-all ${active ? 'border-primary bg-primary/10 shadow-[0_0_10px_rgba(247,154,122,0.2)]' : 'border-primary/10 hover:border-primary/30'
                                                        }`}
                                                >
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD9CC]">{t.label}</span>
                                                    {active && <CheckCircle2 size={12} className="text-primary" />}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* FILTERS */}
                            {activeTab === 'filters' && (
                                <div>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-3">Apply visual filter to this scene</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {FILTERS.map(filter => {
                                            const active = ((selectedScene as { filter?: string }).filter ?? 'none') === filter.id
                                            return (
                                                <button
                                                    key={filter.id}
                                                    onClick={() => updateScene(selectedSceneIndex, { ...selectedScene, filter: filter.id } as never)}
                                                    className={`glass-panel rounded-xl p-3 flex items-center gap-3 border transition-all ${active ? 'border-primary bg-primary/10' : 'border-primary/10 hover:border-primary/30'
                                                        }`}
                                                >
                                                    <div
                                                        className="size-8 rounded-lg shrink-0"
                                                        style={{
                                                            backgroundColor: selectedScene.color,
                                                            filter: filter.css || undefined,
                                                        }}
                                                    />
                                                    <div className="text-left">
                                                        <p className="text-[9px] font-bold text-[#FFD9CC]">{filter.label}</p>
                                                        {active && <p className="text-[8px] text-primary">Active</p>}
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* EFFECTS */}
                            {activeTab === 'effects' && (
                                <div>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-3">Background animation style</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {EFFECTS.map(effect => {
                                            const active = (selectedScene.animationStyle ?? 'none') === effect.id
                                            return (
                                                <button
                                                    key={effect.id}
                                                    onClick={() => updateScene(selectedSceneIndex, { ...selectedScene, animationStyle: effect.id })}
                                                    className={`glass-panel rounded-xl p-3 flex items-center justify-between border transition-all ${active ? 'border-primary bg-primary/10' : 'border-primary/10 hover:border-primary/30'
                                                        }`}
                                                >
                                                    <span className="text-xs font-bold text-[#FFD9CC]">{effect.label}</span>
                                                    {active && <CheckCircle2 size={14} className="text-primary" />}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* COLOR */}
                            {activeTab === 'color' && (
                                <div className="space-y-4">
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest">Background Color</p>
                                    <div className="flex items-center gap-4">
                                        <label
                                            className="size-16 rounded-2xl border-2 border-white/20 cursor-pointer overflow-hidden relative"
                                            style={{ backgroundColor: selectedScene.color }}
                                        >
                                            <input
                                                type="color"
                                                value={selectedScene.color}
                                                onChange={(e) => updateScene(selectedSceneIndex, { ...selectedScene, color: e.target.value })}
                                                className="absolute opacity-0 w-full h-full cursor-pointer"
                                            />
                                        </label>
                                        <div>
                                            <p className="text-xs font-bold text-[#FFD9CC]">{selectedScene.color}</p>
                                            <p className="text-[9px] text-slate-500">Click the swatch to change</p>
                                        </div>
                                    </div>

                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-4">Presets</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['#1a1a2e', '#16213e', '#0f3460', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0e7490'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => updateScene(selectedSceneIndex, { ...selectedScene, color: c })}
                                                className="size-8 rounded-full border-2 border-white/10 hover:border-white/50 transition-all hover:scale-110"
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>

                                    <div>
                                        <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">Overlay Media</p>
                                        {selectedScene.imageUrl || selectedScene.videoUrl ? (
                                            <div className="relative aspect-video rounded-xl overflow-hidden border border-primary/20 group">
                                                {selectedScene.videoUrl ? (
                                                    <video src={selectedScene.videoUrl} className="object-cover w-full h-full" autoPlay loop muted />
                                                ) : (
                                                    <Image src={selectedScene.imageUrl} alt="overlay" fill className="object-cover" />
                                                )}
                                                <button
                                                    onClick={() => updateScene(selectedSceneIndex, { ...selectedScene, imageUrl: '', videoUrl: '' })}
                                                    className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="aspect-video rounded-xl border border-dashed border-primary/20 flex items-center justify-center bg-primary/5">
                                                <p className="text-[9px] text-slate-500 italic">
                                                    {selectedAssetUrl ? 'Click "Paste Asset" on the timeline clip' : 'Select a media asset in Assets to paste here'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* AUDIO */}
                            {activeTab === 'audio' && (
                                <div className="space-y-3">
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest">Background audio for the full reel is set in the Assets tab. Scene-level audio overrides coming soon.</p>
                                    <div className="glass-panel rounded-xl p-4 border border-primary/10 space-y-2">
                                        <Sliders size={32} className="text-primary/40" />
                                        <p className="text-xs text-slate-400 italic">Go to <strong>Assets → Audio Library</strong> to select a track for the whole reel.</p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
