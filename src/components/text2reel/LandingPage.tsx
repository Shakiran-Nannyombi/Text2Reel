import React, { useRef, useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/HeroSection';
import { Sparkles, BookOpen, Crown, Zap, Shield, Database, Layout, PenTool, Tv } from 'lucide-react';

const DEMO_VIDEOS = ['/demo1.mp4', '/demo2.webm', '/demo3.mp4'];

function DemoVideoPlayer() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleVideoEnd = () => {
        setCurrentIndex(prev => (prev + 1) % DEMO_VIDEOS.length);
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.play().catch(() => { });
        }
    }, [currentIndex]);

    return (
        <video
            ref={videoRef}
            key={currentIndex}
            src={DEMO_VIDEOS[currentIndex]}
            onEnded={handleVideoEnd}
            autoPlay
            muted
            playsInline
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
            }}
        />
    );
}

interface LandingPageProps {
    onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navItems = [
        { id: 'guide-nav', label: 'User Guide', icon: BookOpen, onClick: () => scrollToSection('user-guide') },
        { id: 'premium-nav', label: 'Premium', icon: Crown, onClick: () => scrollToSection('premium') },
        { id: 'get-started-nav', label: 'Enter Workspace', icon: Sparkles, onClick: onGetStarted },
    ];

    return (
        <div className="min-h-screen bg-background-dark scroll-smooth">
            <HeroSection
                heading={
                    <>
                        VISIONS INTO <br />
                        <span className="text-primary italic">MOTION.</span>
                    </>
                }
                tagline="The most efficient bridge between human imagination and rhythmic cinematic reality ever built. Turn any story into a high-octane 9:16 reel instantly."
                buttonText="Ignite Vision"
                logoUrl="/logo.png"
                navItems={navItems}
                renderPreview={() => <DemoVideoPlayer />}
            />

            {/* Features Section */}
            <section className="py-24 px-8 border-t border-primary/10 relative z-20 bg-background-dark/50 backdrop-blur-3xl">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="space-y-4 group transition-transform hover:-translate-y-2">
                        <div className="text-primary font-display font-black text-6xl tracking-tighter shadow-glow group-hover:scale-110 transition-transform">9:16</div>
                        <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.4em]">Cinematic Lock</p>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto opacity-70">Perfectly formatted for modern short-form storytelling.</p>
                    </div>
                    <div className="space-y-4 group transition-transform hover:-translate-y-2">
                        <div className="text-primary font-display font-black text-6xl tracking-tighter shadow-glow group-hover:scale-110 transition-transform">AI</div>
                        <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.4em]">Story Engine</p>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto opacity-70">Deep scene parsing using high-performance Groq LLMs.</p>
                    </div>
                    <div className="space-y-4 group transition-transform hover:-translate-y-2">
                        <div className="text-primary font-display font-black text-6xl tracking-tighter shadow-glow group-hover:scale-110 transition-transform">∞</div>
                        <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.4em]">Asset Library</p>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto opacity-70">Infinite stock imagery and Spotify-linked audio tracks.</p>
                    </div>
                </div>
            </section>

            {/* Premium Section */}
            <section id="premium" className="py-32 px-8 relative z-20 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[1000px] bg-primary/5 rounded-full blur-[200px] pointer-events-none" />

                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-4">PREMIUM <span className="text-primary">FLOW</span></h2>
                        <p className="text-slate-500 uppercase font-black tracking-[0.4em] text-xs">Excellence specialized for visionaries</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-panel p-12 rounded-[3.5rem] border border-primary/10 hover:border-primary/30 transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Database size={120} className="text-primary" />
                            </div>
                            <h3 className="text-3xl font-black tracking-tighter mb-6">Cloud Sync</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-slate-400">
                                    <Shield size={18} className="text-primary" />
                                    <span>Encrypted Project Persistence</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-400">
                                    <Shield size={18} className="text-primary" />
                                    <span>Infinite Scene Archiving</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-400">
                                    <Shield size={18} className="text-primary" />
                                    <span>Cross-Device Workspace Access</span>
                                </li>
                            </ul>
                        </div>

                        <div className="glass-panel p-12 rounded-[3.5rem] bg-primary/5 border border-primary/20 hover:border-primary/40 transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Zap size={120} className="text-primary" />
                            </div>
                            <h3 className="text-3xl font-black tracking-tighter mb-6">Enterprise AI</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-slate-400">
                                    <Crown size={18} className="text-primary" />
                                    <span>Llama 3.3 70B Deep Scene Reasoning</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-400">
                                    <Crown size={18} className="text-primary" />
                                    <span>High-Priority GPU Rendering</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-400">
                                    <Crown size={18} className="text-primary" />
                                    <span>Custom Asset Training Ready</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* User Guide Section */}
            <section id="user-guide" className="py-32 px-8 bg-black/20 backdrop-blur-3xl relative z-20 border-t border-primary/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-4">THE <span className="text-primary italic">GUIDE</span></h2>
                        <p className="text-slate-500 uppercase font-black tracking-[0.4em] text-xs">From concept to cinema in three movements</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-6">
                            <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow">
                                <PenTool size={32} />
                            </div>
                            <h4 className="text-2xl font-black tracking-tighter">1. Ignite Vision</h4>
                            <p className="text-slate-400 leading-relaxed">Enter your prompt into the <span className="text-primary/70">Vision Panel</span>. Our neural engine parses your narrative into a cinematic sequence instantly.</p>
                        </div>
                        <div className="space-y-6">
                            <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow">
                                <Layout size={32} />
                            </div>
                            <h4 className="text-2xl font-black tracking-tighter">2. Refine Blueprint</h4>
                            <p className="text-slate-400 leading-relaxed">Tweak scenes in the <span className="text-primary/70">Blueprint Panel</span>. Adjust timing, colors, and assets with granular precision.</p>
                        </div>
                        <div className="space-y-6">
                            <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow">
                                <Tv size={32} />
                            </div>
                            <h4 className="text-2xl font-black tracking-tighter">3. Live Render</h4>
                            <p className="text-slate-400 leading-relaxed">Experience your creation in the <span className="text-primary/70">Cinematic Preview</span>. Export your high-octane reel directly to your camera roll.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-40 text-center relative z-20">
                <div className="max-w-3xl mx-auto px-8">
                    <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter mb-12 leading-none">READY FOR <br />THE <span className="text-primary shadow-glow">FUTURE?</span></h2>
                    <button
                        onClick={onGetStarted}
                        className="py-6 px-16 rounded-full bg-primary text-background-dark font-display font-black text-2xl uppercase tracking-tighter hover:scale-110 active:scale-95 transition-all shadow-3xl"
                    >
                        Enter Workspace
                    </button>
                </div>
            </section>

            {/* Footer Branding */}
            <footer className="py-20 flex flex-col items-center gap-8 relative z-20 border-t border-primary/5">
                <p className="text-[10px] font-black uppercase tracking-[0.8em] text-primary/30">
                    A Premium Creation by Context Engineering
                </p>
            </footer>
        </div>
    );
}
