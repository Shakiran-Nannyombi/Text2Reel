'use client';

import {
    useEffect,
    useRef,
    useState,
    TouchEvent,
    WheelEvent,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Bolt, PlayCircle } from '@mui/icons-material';

interface ScrollExpandMediaProps {
    onGetStarted: () => void;
    mediaType?: 'video' | 'image';
    mediaSrc?: string;
    posterSrc?: string;
    title?: string;
    textBlend?: boolean;
}

const REEL_IMAGES = [
    '/text2reel.png',
    '/text2reel.png',
    '/text2reel.png',
    '/text2reel.png',
    '/text2reel.png',
    '/text2reel.png',
];

export default function LandingPage({
    onGetStarted,
    mediaType = 'image',
    mediaSrc = '/text2reel.png',
    posterSrc,
    title = 'TEXT 2 REEL',
    textBlend = true,
}: ScrollExpandMediaProps) {
    const [scrollProgress, setScrollProgress] = useState<number>(0);
    const [showContent, setShowContent] = useState<boolean>(false);
    const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
    const [touchStartY, setTouchStartY] = useState<number>(0);
    const [isMobileState, setIsMobileState] = useState<boolean>(false);

    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
                setMediaFullyExpanded(false);
                e.preventDefault();
            } else if (!mediaFullyExpanded) {
                e.preventDefault();
                const scrollDelta = e.deltaY * 0.0009;
                const newProgress = Math.min(
                    Math.max(scrollProgress + scrollDelta, 0),
                    1
                );
                setScrollProgress(newProgress);

                if (newProgress >= 1) {
                    setMediaFullyExpanded(true);
                    setShowContent(true);
                } else if (newProgress < 0.75) {
                    setShowContent(false);
                }
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            setTouchStartY(e.touches[0].clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!touchStartY) return;

            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;

            if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
                setMediaFullyExpanded(false);
                e.preventDefault();
            } else if (!mediaFullyExpanded) {
                e.preventDefault();
                const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
                const scrollDelta = deltaY * scrollFactor;
                const newProgress = Math.min(
                    Math.max(scrollProgress + scrollDelta, 0),
                    1
                );
                setScrollProgress(newProgress);

                if (newProgress >= 1) {
                    setMediaFullyExpanded(true);
                    setShowContent(true);
                } else if (newProgress < 0.75) {
                    setShowContent(false);
                }

                setTouchStartY(touchY);
            }
        };

        const handleTouchEnd = (): void => {
            setTouchStartY(0);
        };

        const handleScroll = (): void => {
            if (!mediaFullyExpanded) {
                window.scrollTo(0, 0);
            }
        };

        window.addEventListener('wheel', handleWheel as unknown as EventListener, {
            passive: false,
        });
        window.addEventListener('scroll', handleScroll as EventListener);
        window.addEventListener(
            'touchstart',
            handleTouchStart as unknown as EventListener,
            { passive: false }
        );
        window.addEventListener(
            'touchmove',
            handleTouchMove as unknown as EventListener,
            { passive: false }
        );
        window.addEventListener('touchend', handleTouchEnd as EventListener);

        return () => {
            window.removeEventListener(
                'wheel',
                handleWheel as unknown as EventListener
            );
            window.removeEventListener('scroll', handleScroll as EventListener);
            window.removeEventListener(
                'touchstart',
                handleTouchStart as unknown as EventListener
            );
            window.removeEventListener(
                'touchmove',
                handleTouchMove as unknown as EventListener
            );
            window.removeEventListener('touchend', handleTouchEnd as EventListener);
        };
    }, [scrollProgress, mediaFullyExpanded, touchStartY]);

    useEffect(() => {
        const checkIfMobile = (): void => {
            setIsMobileState(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
    const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
    const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

    const firstWord = title ? title.split(' ')[0] : '';
    const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

    return (
        <div
            ref={sectionRef}
            className='bg-background-dark transition-colors duration-700 ease-in-out overflow-x-hidden min-h-screen text-[#FFD9CC] selection:bg-primary/30'
        >
            <section className='relative flex flex-col items-center justify-start min-h-dvh'>
                <div className='relative w-full flex flex-col items-center min-h-dvh'>

                    {/* Cinematic Cinematic Reel Background */}
                    <motion.div
                        className="absolute inset-0 z-0 overflow-hidden flex flex-col justify-center gap-4 opacity-10 grayscale hover:grayscale-0 transition-all duration-1000"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: (1 - scrollProgress) * 0.1,
                            filter: `blur(${scrollProgress * 20}px) grayscale(${scrollProgress * 100}%)`,
                        }}
                    >
                        {[1, 2, 3].map((row) => (
                            <div
                                key={row}
                                className={`flex gap-4 whitespace-nowrap ${row % 2 === 0 ? 'animate-scroll-right' : 'animate-scroll-left'}`}
                                style={{ '--duration': `${40 + row * 10}s` } as React.CSSProperties}
                            >
                                {[...REEL_IMAGES, ...REEL_IMAGES].map((img, i) => (
                                    <div key={i} className="relative w-96 h-56 rounded-[32px] overflow-hidden glass-panel border border-primary/5">
                                        <Image src={img} alt="Reel visual" fill className="object-cover opacity-60" />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </motion.div>

                    {/* Background Overlay Glow & Scroll-Driven Blur */}
                    <motion.div
                        className='absolute inset-0 z-1 h-full'
                        animate={{
                            filter: `blur(${(1 - scrollProgress) * 40}px)`,
                            opacity: 1 - scrollProgress
                        }}
                    >
                        <div className='absolute inset-0 bg-linear-to-b from-background-dark/20 via-background-dark/90 to-background-dark overflow-hidden'>
                            <div className="absolute top-[-20%] left-[-10%] size-[1000px] bg-primary/10 rounded-full blur-[200px] pointer-events-none" />
                            <div className="absolute bottom-[-20%] right-[-10%] size-[1000px] bg-purple-900/20 rounded-full blur-[200px] pointer-events-none" />
                        </div>
                    </motion.div>

                    {/* Persistent Header Removed per user request */}

                    <div className='container mx-auto flex flex-col items-center justify-start relative z-10'>
                        <div className='flex flex-col items-center justify-center w-full h-dvh relative'>

                            {/* Media Container - Moved words to Background or floating around */}
                            <div
                                className='absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-[40px] border-8 border-slate-900 shadow-2xl overflow-hidden'
                                style={{
                                    width: `${mediaWidth}px`,
                                    height: `${mediaHeight}px`,
                                    maxWidth: '95vw',
                                    maxHeight: '85vh',
                                    boxShadow: '0px 0px 100px rgba(247, 154, 122, 0.2)',
                                }}
                            >
                                {mediaType === 'video' ? (
                                    <video
                                        src={mediaSrc}
                                        poster={posterSrc}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className='w-full h-full object-cover'
                                    />
                                ) : (
                                    <div className='relative w-full h-full bg-surface-dark'>
                                        <Image
                                            src={mediaSrc}
                                            alt={title}
                                            fill
                                            className='object-cover opacity-80'
                                        />
                                        <motion.div
                                            className='absolute inset-0 bg-primary/10'
                                            initial={{ opacity: 0.7 }}
                                            animate={{ opacity: 0.4 - scrollProgress * 0.3 }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Title Typography - Integrated into the background/floating */}
                            <div
                                className={`flex items-center justify-center text-center gap-12 w-full relative z-10 transition-none flex-col ${textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                                    }`}
                            >
                                <motion.h2
                                    className='text-8xl md:text-[12rem] font-black text-primary tracking-tighter leading-none opacity-90'
                                    style={{
                                        transform: `translateX(-${textTranslateX}vw)`,
                                        filter: `blur(${scrollProgress * 10}px)`,
                                    }}
                                >
                                    {firstWord}
                                </motion.h2>
                                <motion.h2
                                    className='text-8xl md:text-[12rem] font-black text-primary tracking-tighter leading-none opacity-90'
                                    style={{
                                        transform: `translateX(${textTranslateX}vw)`,
                                        filter: `blur(${scrollProgress * 10}px)`,
                                    }}
                                >
                                    {restOfTitle}
                                </motion.h2>
                            </div>
                        </div>

                        {/* Content Section - Massive spacing and cinematic reveal */}
                        <motion.section
                            className='flex flex-col items-center w-full px-8 py-40 mt-32 relative z-20'
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 100 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <div className="max-w-5xl w-full text-center space-y-16 bg-background-dark/95 backdrop-blur-2xl p-16 rounded-[64px] border border-primary/10 shadow-3xl atmospheric-glow">

                                <h3 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                                    VISIONS INTO <br />
                                    <span className="text-primary atmospheric-glow">MOTION.</span>
                                </h3>

                                <p className="text-slate-400 text-xl md:text-3xl font-medium leading-relaxed italic max-w-3xl mx-auto opacity-80">
                                    &ldquo;The most efficient bridge between human imagination and rhythmic cinematic reality ever built.&rdquo;
                                </p>

                                <div className="flex flex-col items-center justify-center gap-12 pt-12">
                                    <div className="flex flex-col items-center gap-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 animate-bounce">Scroll down to explore or click below to start</p>
                                        <button
                                            onClick={onGetStarted}
                                            className="w-full sm:w-auto bg-primary hover:bg-[#FFD9CC] text-background-dark font-display font-black text-3xl px-20 py-10 rounded-[40px] flex items-center justify-center gap-6 transition-all shadow-[0_20px_80px_rgba(247,154,122,0.4)] active:scale-95 group uppercase tracking-tighter relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                            <span className="relative z-10">Ignite Vision</span>
                                            <Bolt fontSize="large" className="relative z-10 group-hover:rotate-12 transition-transform scale-125" />
                                            <span className="relative z-10 text-4xl ml-2 group-hover:translate-x-4 transition-transform">→</span>
                                        </button>
                                    </div>
                                    <button className="w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-6 text-slate-500 hover:text-primary transition-all font-black text-xs uppercase tracking-[0.3em] group italic opacity-50 hover:opacity-100">
                                        <PlayCircle fontSize="large" className="opacity-40 group-hover:opacity-100 transition-opacity" />
                                        Watch the process
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-24 border-t border-primary/5 mt-24">
                                    <div className="space-y-4">
                                        <p className="text-primary font-black text-5xl">9:16</p>
                                        <p className="text-[10px] uppercase font-black text-slate-600 tracking-[0.3em]">Aspect Lock</p>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-primary font-black text-5xl">AI</p>
                                        <p className="text-[10px] uppercase font-black text-slate-600 tracking-[0.3em]">Story Parsing</p>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-primary font-black text-5xl">0ms</p>
                                        <p className="text-[10px] uppercase font-black text-slate-600 tracking-[0.3em]">Latency Flow</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Branding */}
                            <footer className="py-60 flex flex-col items-center gap-16">
                                <Image
                                    src="/logo.png"
                                    alt="Text2Reel Logo"
                                    width={320}
                                    height={320}
                                    className="opacity-90 hover:opacity-100 transition-all duration-700 hover:scale-110 drop-shadow-[0_0_50px_rgba(247,154,122,0.6)] cursor-pointer object-contain"
                                />
                                <p className="text-sm font-black uppercase tracking-[0.8em] text-primary/30">
                                    A Premium Creation by Context Engineering
                                </p>
                            </footer>
                        </motion.section>
                    </div>
                </div>
            </section>
        </div>
    );
}
