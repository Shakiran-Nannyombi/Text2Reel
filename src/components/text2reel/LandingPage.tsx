'use client'

import Image from 'next/image'
import { MovieFilter, AutoAwesome, Bolt, PlayCircle } from '@mui/icons-material'
import { motion } from 'framer-motion'

interface LandingPageProps {
    onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-background-dark text-[#FFD9CC] font-sans selection:bg-primary/30 flex flex-col relative overflow-hidden">
            {/* Cinematic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] size-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] size-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Navigation */}
            <nav className="flex items-center justify-between px-8 py-6 relative z-10 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <MovieFilter className="text-background-dark font-bold" />
                    </div>
                    <h1 className="font-display font-extrabold text-2xl tracking-tight text-primary">Text2Reel</h1>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-400">
                    <a href="#" className="hover:text-primary transition-colors">Showcase</a>
                    <a href="#" className="hover:text-primary transition-colors">Pricing</a>
                    <button
                        onClick={onGetStarted}
                        className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-6 py-2 rounded-xl transition-all active:scale-95"
                    >
                        Sign In
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 max-w-5xl mx-auto py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 px-4 py-1.5 rounded-full mb-4">
                        <AutoAwesome sx={{ fontSize: 16 }} className="text-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Powered by Groq & Remotion</span>
                    </div>

                    <h2 className="font-display text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
                        PROMPT TO <br />
                        <span className="text-primary atmospheric-glow">REEL.</span>
                    </h2>

                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed italic">
                        Transform your wildest visions into atmospheric, rhythmic video reels with cinematic precision. Neural AI meets kinetic motion.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <button
                            onClick={onGetStarted}
                            className="w-full sm:w-auto bg-primary hover:bg-[#FFD9CC] text-background-dark font-display font-black text-xl px-10 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-primary/40 active:scale-95 group"
                        >
                            <Bolt fontSize="large" className="group-hover:rotate-12 transition-transform" />
                            START IGNITING
                        </button>
                        <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 text-slate-400 hover:text-[#FFD9CC] transition-colors font-bold uppercase tracking-widest group">
                            <PlayCircle fontSize="large" className="opacity-40 group-hover:opacity-100 transition-opacity" />
                            Watch Demo
                        </button>
                    </div>
                </motion.div>

                {/* Feature Grid Mini */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                    <div className="glass-panel p-6 rounded-2xl text-left space-y-3 atmospheric-glow">
                        <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">auto_graph</span>
                        </div>
                        <h3 className="font-display font-bold text-lg">Neural Rhythms</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">AI-driven scene parsing ensures perfect alignment between text and cinematic cuts.</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl text-left space-y-3 atmospheric-glow">
                        <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">waves</span>
                        </div>
                        <h3 className="font-display font-bold text-lg">Spring Motion</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">Ultra-smooth transitions powered by Remotion&apos;s spring physics engine.</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl text-left space-y-3 atmospheric-glow">
                        <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">bolt</span>
                        </div>
                        <h3 className="font-display font-bold text-lg">Llama 3.3 Speed</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">Instant blueprint generation using the world&apos;s most capable AI reasoning.</p>
                    </div>
                </div>
            </main>

            {/* Footer Branding */}
            <footer className="py-12 flex flex-col items-center gap-4 relative z-10 border-t border-primary/5 mt-12 bg-black/20">
                <Image
                    src="/logo.svg"
                    alt="Text2Reel Logo"
                    width={48}
                    height={48}
                    className="opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-pointer"
                />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                    Part of the Context Engineering Showroom
                </p>
            </footer>
        </div>
    )
}
