'use client'

import { useText2ReelStore } from '@/store/useText2ReelStore'
import { Timer, EditNote, DragIndicator, Close } from '@mui/icons-material'
import Image from 'next/image'
import IconRenderer from './IconRenderer'

export default function SceneGrid() {
    const { scenes, updateScene } = useText2ReelStore()

    if (scenes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 italic font-sans animate-pulse">
                <div className="size-12 border-2 border-dashed border-primary/20 rounded-full mb-4 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary/40">view_quilt</span>
                </div>
                <p className="text-sm tracking-wide">Enter a vision to generate the blueprint...</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-1">
            {scenes.map((scene, index) => (
                <div
                    key={index}
                    className="group glass-panel rounded-2xl overflow-hidden hover:border-primary/40 transition-all cursor-pointer relative atmospheric-glow flex flex-col h-full"
                >
                    {/* Visual Preview Area */}
                    <div className="relative aspect-3/4 bg-surface-dark overflow-hidden shrink-0">
                        {scene.imageUrl ? (
                            <Image
                                src={scene.imageUrl}
                                alt={scene.text}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                            />
                        ) : (
                            <div
                                className="absolute inset-0 transition-transform duration-700 group-hover:scale-110 flex items-center justify-center overflow-hidden"
                                style={{ backgroundColor: scene.color }}
                            >
                                {/* Background animation mockup */}
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                {scene.icon && (
                                    <div className="transform scale-[2.5] opacity-40 drop-shadow-2xl">
                                        <IconRenderer iconName={scene.icon} className="text-white" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Gradients and Overlays */}
                        <div className="absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-transparent opacity-80 z-10" />

                        {/* Scene Tag */}
                        <div className="absolute top-4 left-4 z-20 bg-background-dark/80 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-primary border border-primary/20 tracking-widest uppercase">
                            SCENE {String(index + 1).padStart(2, '0')}
                        </div>

                        {/* Duration Badge */}
                        <div className="absolute bottom-4 left-4 z-20">
                            <p className="text-[10px] font-black text-[#FFD9CC] drop-shadow-md flex items-center gap-1.5 uppercase tracking-widest">
                                <Timer sx={{ fontSize: 14 }} className="text-primary" />
                                00:{String(scene.duration).padStart(2, '0')}s
                            </p>
                        </div>

                        {/* Quick View Text */}
                        <div className="absolute inset-0 z-10 flex items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <p className="text-sm font-display font-bold text-white leading-tight drop-shadow-xl border-t border-b border-primary/20 py-2">
                                {scene.text}
                            </p>
                        </div>
                    </div>

                    {/* Content Detail Area */}
                    <div className="p-4 flex flex-col flex-1 space-y-3 bg-background-dark/50">
                        <textarea
                            value={scene.text}
                            onChange={(e) => updateScene(index, { ...scene, text: e.target.value })}
                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-xs text-slate-300 italic font-light scrollbar-hide resize-none leading-relaxed h-10 group-hover:text-[#FFD9CC] transition-colors"
                            placeholder="Scene text overlay..."
                        />

                        <div className="flex items-center justify-between pt-3 border-t border-primary/10 mt-auto">
                            <div className="flex items-center gap-3">
                                <EditNote fontSize="small" className="text-slate-500 hover:text-primary transition-colors cursor-pointer" />
                                <div className="flex items-center gap-1.5">
                                    <div
                                        className="size-3 rounded-full border border-white/20"
                                        style={{ backgroundColor: scene.color }}
                                    ></div>
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">{scene.animationStyle}</span>
                                </div>
                            </div>
                            <DragIndicator fontSize="small" className="text-slate-500 hover:text-primary transition-colors cursor-move" />
                        </div>
                    </div>

                    {/* Delete Shortcut */}
                    <button className="absolute top-4 right-4 z-20 size-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:border-red-500/40 text-slate-400 hover:text-red-500">
                        <Close sx={{ fontSize: 14 }} />
                    </button>
                </div>
            ))}
        </div>
    )
}
