'use client'

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { Play, Menu, X, LucideIcon } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface NavItem {
    id: string;
    label: string;
    icon?: LucideIcon;
    onClick?: () => void;
    href?: string;
    target?: string;
}

interface HeroSectionProps {
    heading?: string | React.ReactNode;
    tagline?: string;
    buttonText?: string;
    imageUrl?: string;
    videoUrl?: string;
    logoUrl?: string;
    navItems?: NavItem[];
    renderPreview?: () => React.ReactNode;
}

// Helper to parse 'rgb(r, g, b)' or 'rgba(r, g, b, a)' string to {r, g, b}
const parseRgbColor = (colorString: string | null) => {
    if (!colorString) return null;
    const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (match) {
        return {
            r: parseInt(match[1], 10),
            g: parseInt(match[2], 10),
            b: parseInt(match[3], 10),
        };
    }
    return null;
};

const HeroSection = ({
    heading = "Something you really want",
    tagline = "You can't live without this product. I'm sure of it.",
    buttonText = "Get Started",
    imageUrl,
    videoUrl,
    logoUrl,
    navItems = [],
    renderPreview,
}: HeroSectionProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const targetRef = useRef<HTMLButtonElement>(null);
    const mousePosRef = useRef<{ x: number | null, y: number | null }>({ x: null, y: null });
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const [showVideo, setShowVideo] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const resolvedCanvasColorsRef = useRef({
        strokeStyle: { r: 128, g: 128, b: 128 }, // Default mid-gray
    });

    useGSAP(() => {
        if (isMenuOpen) {
            gsap.to(menuRef.current, {
                x: 0,
                opacity: 1,
                display: 'flex',
                duration: 0.5,
                ease: 'power3.out'
            });
            gsap.fromTo('.mobile-nav-item',
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, stagger: 0.1, delay: 0.2, duration: 0.4 }
            );
        } else {
            gsap.to(menuRef.current, {
                x: '100%',
                opacity: 0,
                display: 'none',
                duration: 0.4,
                ease: 'power3.in'
            });
        }
    }, [isMenuOpen]);

    useEffect(() => {
        const tempElement = document.createElement('div');
        tempElement.style.display = 'none';
        document.body.appendChild(tempElement);

        const updateResolvedColors = () => {
            tempElement.style.color = 'var(--foreground)';
            const computedFgColor = getComputedStyle(tempElement).color;
            const parsedFgColor = parseRgbColor(computedFgColor);
            if (parsedFgColor) {
                resolvedCanvasColorsRef.current.strokeStyle = parsedFgColor;
            } else {
                console.warn("HeroSection: Could not parse --foreground for canvas arrow. Using fallback.");
                const isDarkMode = document.documentElement.classList.contains('dark');
                resolvedCanvasColorsRef.current.strokeStyle = isDarkMode ? { r: 250, g: 250, b: 250 } : { r: 10, g: 10, b: 10 }; // Brighter fallback
            }
        };
        updateResolvedColors();
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target === document.documentElement) {
                    updateResolvedColors();
                    break;
                }
            }
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => {
            observer.disconnect();
            if (tempElement.parentNode) {
                tempElement.parentNode.removeChild(tempElement);
            }
        };
    }, []);

    const drawArrow = useCallback(() => {
        if (!canvasRef.current || !targetRef.current || !ctxRef.current) return;

        const targetEl = targetRef.current;
        const ctx = ctxRef.current;
        const mouse = mousePosRef.current;

        const x0 = mouse.x;
        const y0 = mouse.y;

        if (x0 === null || y0 === null) return;

        const rect = targetEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const a = Math.atan2(cy - y0, cx - x0);
        const x1 = cx - Math.cos(a) * (rect.width / 2 + 12);
        const y1 = cy - Math.sin(a) * (rect.height / 2 + 12);

        const midX = (x0 + x1) / 2;
        const midY = (y0 + y1) / 2;
        const offset = Math.min(200, Math.hypot(x1 - x0, y1 - y0) * 0.5);
        const t = Math.max(-1, Math.min(1, (y0 - y1) / 200));
        const controlX = midX;
        const controlY = midY + offset * t;

        const r = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
        // Increase max opacity to 1 (fully opaque) and adjust divisor for quicker ramp-up
        const opacity = Math.min(1.0, (r - Math.max(rect.width, rect.height) / 2) / 500);

        const arrowColor = resolvedCanvasColorsRef.current.strokeStyle;
        ctx.strokeStyle = `rgba(${arrowColor.r}, ${arrowColor.g}, ${arrowColor.b}, ${opacity})`;
        // Increase line width for more visibility
        ctx.lineWidth = 2; // Changed from 1.5 to 2

        // Draw curve
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(controlX, controlY, x1, y1);
        // Adjust dash pattern for thicker line: longer dashes, similar gap
        ctx.setLineDash([10, 5]); // e.g., 10px dash, 5px gap
        ctx.stroke();
        ctx.restore();

        // Draw arrowhead
        const angle = Math.atan2(y1 - controlY, x1 - controlX);
        // Scale arrowhead with line width, base size 10 for lineWidth 1.5
        const headLength = 10 * (ctx.lineWidth / 1.5);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(
            x1 - headLength * Math.cos(angle - Math.PI / 6),
            y1 - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(x1, y1);
        ctx.lineTo(
            x1 - headLength * Math.cos(angle + Math.PI / 6),
            y1 - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !targetRef.current) return;

        ctxRef.current = canvas.getContext("2d");
        const ctx = ctxRef.current;

        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("resize", updateCanvasSize);
        window.addEventListener("mousemove", handleMouseMove);
        updateCanvasSize();

        const animateLoop = () => {
            if (ctx && canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawArrow();
            }
            animationFrameIdRef.current = requestAnimationFrame(animateLoop);
        };

        animateLoop();

        return () => {
            window.removeEventListener("resize", updateCanvasSize);
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [drawArrow]);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement && videoUrl) {
            const handleVideoEnd = () => {
                setShowVideo(false);
                videoElement.currentTime = 0;
            };

            if (showVideo) {
                videoElement.play().catch(error => {
                    console.error("HeroSection: Error playing video:", error);
                    setShowVideo(false);
                });
                videoElement.addEventListener('ended', handleVideoEnd);
            } else {
                videoElement.pause();
            }

            return () => {
                videoElement.removeEventListener('ended', handleVideoEnd);
            };
        }
    }, [showVideo, videoUrl]);

    const handlePlayButtonClick = () => {
        if (videoUrl) {
            setShowVideo(true);
        }
    };

    return (
        <div className="bg-background text-foreground min-h-screen flex flex-col relative overflow-hidden">
            <nav className="w-full max-w-5xl mx-auto flex justify-between items-center px-6 sm:px-12 py-6 text-sm relative z-30">
                <div className="relative h-8 w-32 flex items-center">
                    {logoUrl ? (
                        <Image
                            src={logoUrl}
                            alt="Logo"
                            width={128}
                            height={32}
                            className="object-contain"
                            priority
                        />
                    ) : (
                        <div className="text-xl font-black tracking-tighter text-primary">TEXT2REEL</div>
                    )}
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const className = "py-2 px-4 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 flex items-center gap-2 group whitespace-nowrap";
                        const Icon = item.icon;

                        if (item.href) {
                            return (
                                <a key={item.id} href={item.href} target={item.target} className={className} onClick={item.onClick}>
                                    {Icon && <Icon size={16} className="group-hover:scale-110 transition-transform" />}
                                    <span className="font-medium">{item.label}</span>
                                </a>
                            );
                        }
                        return (
                            <button key={item.id} type="button" className={className} onClick={item.onClick}>
                                {Icon && <Icon size={16} className="group-hover:scale-110 transition-transform" />}
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Mobile Hamburger Toggle */}
                <button
                    className="md:hidden p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors relative z-50"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                ref={menuRef}
                className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl hidden flex-col items-center justify-center p-8 text-center border-l border-primary/10"
                style={{ transform: 'translateX(100%)' }}
            >
                <div className="flex flex-col gap-8 w-full max-w-xs">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className="mobile-nav-item flex items-center justify-center gap-4 text-3xl font-black tracking-tighter text-foreground/70 hover:text-primary transition-colors py-4 group"
                                onClick={() => {
                                    item.onClick?.();
                                    setIsMenuOpen(false);
                                }}
                            >
                                {Icon && <Icon size={32} className="group-hover:scale-125 transition-transform text-primary/50" />}
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <div className="absolute bottom-12 left-0 right-0 text-center px-8">
                    <p className="text-[10px] uppercase font-black tracking-[0.4em] text-muted-foreground/30">
                        Context Engineering Precision
                    </p>
                </div>
            </div>

            <main className="grow flex flex-col items-center justify-center relative z-20">
                <div className="mt-12 sm:mt-16 lg:mt-24 flex flex-col items-center">
                    <h1 className="text-4xl sm:text-6xl lg:text-9xl font-display font-black text-center px-4 tracking-tighter leading-[0.8] text-white">
                        {heading}
                    </h1>
                    <p className="mt-8 block text-slate-400 text-center text-lg sm:text-2xl px-4 max-w-3xl font-medium tracking-tight opacity-70">
                        {tagline}
                    </p>
                </div>

                <div className="mt-16 flex justify-center">
                    <button
                        ref={targetRef}
                        className="py-5 px-14 rounded-3xl bg-primary text-background-dark font-display font-black text-xl uppercase tracking-tighter transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/20 shadow-[0_25px_100px_rgba(247,154,122,0.5)] flex items-center gap-4 group"
                        onClick={navItems.find(n => n.id === 'get-started-nav')?.onClick}
                    >
                        <span>{buttonText}</span>
                        <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                    </button>
                </div>

                <div className="mt-20 lg:mt-32 w-full max-w-6xl mx-auto overflow-hidden px-4">
                    <div className="bg-primary/5 rounded-[3rem] p-3 border border-primary/10 shadow-3xl atmospheric-glow">
                        <div className="relative h-72 sm:h-96 md:h-[500px] lg:h-[650px] rounded-[2.5rem] bg-card overflow-hidden border border-white/5 shadow-2xl">
                            {imageUrl && (
                                <Image
                                    src={imageUrl}
                                    alt="Preview"
                                    fill
                                    className={`object-cover transition-opacity duration-700 ${showVideo ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
                                        }`}
                                />
                            )}
                            {renderPreview ? (
                                <div className={`w-full h-full object-cover transition-opacity duration-700 ${showVideo ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                    }`}>
                                    {renderPreview()}
                                </div>
                            ) : videoUrl && (
                                <video
                                    ref={videoRef}
                                    src={videoUrl}
                                    muted
                                    autoPlay
                                    loop
                                    playsInline
                                    className={`w-full h-full object-cover transition-opacity duration-700 ${showVideo ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                        }`}
                                />
                            )}
                            {!showVideo && videoUrl && imageUrl && (
                                <button
                                    onClick={handlePlayButtonClick}
                                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-all duration-500 group"
                                    aria-label="Play video"
                                >
                                    <div className="size-24 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:bg-primary group-hover:text-background-dark shadow-3xl">
                                        <Play className="w-10 h-10 fill-current ml-1" />
                                    </div>
                                </button>
                            )}

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-transparent pointer-events-none opacity-60" />
                        </div>
                    </div>
                </div>
            </main>
            <div className="h-32 sm:h-64"></div>
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10 opacity-40"></canvas>
        </div>
    );
};

export { HeroSection };
