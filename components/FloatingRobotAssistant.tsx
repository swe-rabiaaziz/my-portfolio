'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

const ASSISTANT_IMAGES = [
  '/images/robot-pedestal.png',
  '/images/robot-waving.png',
  '/images/robot-flying.png',
  '/images/robot-standing.png',
  '/images/robot-curious.png',
  '/images/robot-dots.png',
  '/images/robot-welcome.png',
  '/images/robot-typing.png',
];

const SECTION_GUIDE_DATA: Record<string, { label: string; guideText: string; hint: string }> = {
  hero: {
    label: "RABIA'S AI",
    guideText: "Welcome! 👋 I'm Rabia's AI Assistant. Ready to explore her work?",
    hint: 'Scroll down to explore featured projects & skills',
  },
  about: {
    label: 'ABOUT RABIA',
    guideText: "Rabia's background, journey & engineering philosophy 📖",
    hint: 'Explore her experience & passion',
  },
  skills: {
    label: 'TECH ARSENAL',
    guideText: 'Core stack: Flutter, Dart, Supabase, Firebase & AI ⚡',
    hint: 'Explore state management & backends',
  },
  projects: {
    label: 'FEATURED APPS',
    guideText: 'Production Flutter apps including Zemen & CivicCoach 🚀',
    hint: 'Tap to learn about any project',
  },
  experience: {
    label: 'CREDENTIALS',
    guideText: 'Track record at X dev Soft & certified credentials 📜',
    hint: 'Explore certifications & training',
  },
  testimonials: {
    label: 'RECOMMENDATIONS',
    guideText: 'Feedback and reviews from engineering leads & seniors 🌟',
    hint: 'Explore senior team lead recommendations',
  },
  contact: {
    label: 'GET IN TOUCH',
    guideText: 'Ready to collaborate or hire? Send a message or book a call ☕',
    hint: 'Direct WhatsApp, Email & Calendly',
  },
};

interface FloatingRobotAssistantProps {
  isOpen: boolean;
  onOpen: () => void;
  splashDone?: boolean;
}

export default function FloatingRobotAssistant({
  isOpen,
  onOpen,
  splashDone,
}: FloatingRobotAssistantProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>('hero');
  const [showNotification, setShowNotification] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);

  const isHoveredRef = useRef(false);
  const isCardHoveredRef = useRef(false);
  const currentSectionRef = useRef<string>('hero');
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const minimizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialWelcomeFiredRef = useRef(false);

  // Auto-minimize countdown (defaults to 4000ms = 4 seconds)
  const startMinimizeCountdown = useCallback((delayMs: number = 4000) => {
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    if (minimizeTimeoutRef.current) clearTimeout(minimizeTimeoutRef.current);

    notificationTimeoutRef.current = setTimeout(() => {
      // If user is currently hovering on the card or assistant, DO NOT minimize!
      if (isCardHoveredRef.current || isHoveredRef.current) return;
      setIsMinimizing(true);
      minimizeTimeoutRef.current = setTimeout(() => {
        // Double check in case user hovered during the 450ms fade-out transition
        if (isCardHoveredRef.current || isHoveredRef.current) {
          setIsMinimizing(false);
          return;
        }
        setShowNotification(false);
        setIsMinimizing(false);
      }, 450); // 450ms smooth CSS fade-out transition
    }, delayMs);
  }, []);

  // Helper to show temporary notification and then auto-minimize itself after 4s
  const displayTemporaryNotification = useCallback((sectionId: string, durationMs: number = 4000) => {
    currentSectionRef.current = sectionId;
    setCurrentSection(sectionId);

    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    if (minimizeTimeoutRef.current) clearTimeout(minimizeTimeoutRef.current);

    setIsMinimizing(false);
    setShowNotification(true);

    startMinimizeCountdown(durationMs);
  }, [startMinimizeCountdown]);

  // Card hover handlers: PAUSE auto-minimize while user is hovering on the card!
  const handleCardMouseEnter = () => {
    isCardHoveredRef.current = true;
    setIsCardHovered(true);
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    if (minimizeTimeoutRef.current) clearTimeout(minimizeTimeoutRef.current);
    setIsMinimizing(false);
  };

  const handleCardMouseLeave = () => {
    isCardHoveredRef.current = false;
    setIsCardHovered(false);
    // When cursor leaves the card, give 4 full seconds before auto-minimizing!
    startMinimizeCountdown(4000);
  };

  // Assistant trigger hover handlers
  const handleAssistantMouseEnter = () => {
    isHoveredRef.current = true;
    setIsHovered(true);
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    if (minimizeTimeoutRef.current) clearTimeout(minimizeTimeoutRef.current);
    setIsMinimizing(false);
  };

  const handleAssistantMouseLeave = () => {
    isHoveredRef.current = false;
    setIsHovered(false);
    if (showNotification) {
      startMinimizeCountdown(4000);
    }
  };

  // ═══ 1. Instant Image Preloading into Browser Cache ═══
  useEffect(() => {
    ASSISTANT_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // ═══ 2. Trigger Welcome Notification: Exactly After Hero & Katana Dock ═══
  useEffect(() => {
    if (!splashDone || isOpen) return;

    const handleKatanaDock = () => {
      // If we are at hero section (top of the page), display the hero welcome notification for 4s!
      if (window.scrollY < 300) {
        initialWelcomeFiredRef.current = true;
        displayTemporaryNotification('hero', 4000);
      }
    };

    // 1. Direct event from Navigation.tsx when sword returns and locks into navbar
    window.addEventListener('katana-dock-complete', handleKatanaDock);

    // 2. Safety fallback timer: Navigation sword dock finishes around 4.5s
    let fallbackTimer: NodeJS.Timeout | null = null;
    if (!initialWelcomeFiredRef.current) {
      fallbackTimer = setTimeout(() => {
        if (!initialWelcomeFiredRef.current && window.scrollY < 300) {
          handleKatanaDock();
        }
      }, 4600);
    }

    return () => {
      window.removeEventListener('katana-dock-complete', handleKatanaDock);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [splashDone, isOpen, displayTemporaryNotification]);

  // ═══ 3. Real-Time Section Observer (Auto-notifies for 4s on section change) ═══
  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'testimonials', 'contact'];

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          const sectionId = entry.target.id;
          if (sectionId && sectionId !== currentSectionRef.current) {
            displayTemporaryNotification(sectionId, 4000);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: [0.3, 0.6],
    });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [displayTemporaryNotification]);

  // Clean up timers only when unmounting the whole widget
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
      if (minimizeTimeoutRef.current) clearTimeout(minimizeTimeoutRef.current);
    };
  }, []);

  // ═══ 4. Real-Time Page Scroll Detection for Flying Mode ═══
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Reset states when chat opens or closes
  useEffect(() => {
    if (isOpen) {
      isHoveredRef.current = false;
      isCardHoveredRef.current = false;
      setIsHovered(false);
      setIsCardHovered(false);
      setShowNotification(false);
      setIsMinimizing(false);
    }
  }, [isOpen]);

  // Determine active companion image pose
  let floatingAssistantSrc = '/images/robot-pedestal.png';
  if (isScrolling) {
    floatingAssistantSrc = '/images/robot-flying.png';
  } else if (isHovered || isCardHovered) {
    floatingAssistantSrc = '/images/robot-waving.png';
  } else if (showNotification && !isMinimizing) {
    floatingAssistantSrc = '/images/robot-standing.png';
  }

  const activeGuideData = SECTION_GUIDE_DATA[currentSection] || SECTION_GUIDE_DATA.hero;

  if (!splashDone || isOpen) return null;

  return (
    <>
      {/* Hidden image prefetch tags */}
      <div className="hidden" aria-hidden="true">
        {ASSISTANT_IMAGES.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" width={1} height={1} />
        ))}
      </div>

      <style jsx>{`
        /* ═══ LEVITATION ANIMATION ═══ */
        @keyframes float-levitate {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(1.5deg);
          }
        }
        .animate-float-levitate {
          animation: float-levitate 3.5s ease-in-out infinite;
        }

        /* ═══════════════════════════════════════════════════════════════
           PREMIUM ANIME FLIGHT SYSTEM
           Controlled motion layers: afterimages + airflow + pressure rings
           + curved energy wakes. Palette is intentionally limited to
           sky-blue, white, graphite/slate and transparent neutrals.
        ═══════════════════════════════════════════════════════════════ */

        /* ─── Flight direction / body motion ─── */
        @keyframes flight-body {
          0%, 100% {
            transform: translate3d(0, -3px, 0) rotate(-7deg) scale(1.06);
          }
          22% {
            transform: translate3d(2px, -8px, 0) rotate(-5deg) scale(1.08);
          }
          48% {
            transform: translate3d(5px, -5px, 0) rotate(-7.5deg) scale(1.1);
          }
          72% {
            transform: translate3d(3px, -10px, 0) rotate(-4.5deg) scale(1.075);
          }
        }

        .animate-flight-surge {
          animation: flight-body 0.92s cubic-bezier(0.22, 0.61, 0.36, 1) infinite;
          transform-origin: 50% 58%;
          will-change: transform, filter;
        }

        /* ═══ PREMIUM ANIME-STYLE HYPER-SPEED FLIGHT EFFECT ═══ */

        /* Afterimage trail — faded monochrome duplicates of the companion */
        @keyframes afterimage-trail {
          0% {
            opacity: 0.4;
            transform: translate(0px, 0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(24px, 14px) scale(0.8);
          }
        }
        .afterimage-ghost {
          animation: afterimage-trail 0.42s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          filter: grayscale(1) brightness(1.55) contrast(1.05);
        }

        /* Long, clean tapered speed-lines shooting past — one consistent angle,
           sky-blue fading to white, instead of jagged multi-directional bolts */
        @keyframes speed-line-pass {
          0% {
            transform: rotate(-20deg) translateX(30px) scaleX(0.25);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: rotate(-20deg) translateX(-64px) scaleX(1.7);
            opacity: 0;
          }
        }
        .speed-line {
          position: absolute;
          height: 1.5px;
          right: -6px;
          border-radius: 999px;
          transform-origin: right center;
          background: linear-gradient(to left, #ffffff, rgba(125, 211, 252, 0.85) 45%, transparent 92%);
          animation: speed-line-pass 0.55s linear infinite;
        }

        /* Comet-tail energy smear — a single elegant trailing shape instead of chaos */
        @keyframes comet-pulse {
          0%, 100% {
            opacity: 0.55;
            transform: translate(-50%, -50%) rotate(-20deg) scaleX(1);
          }
          50% {
            opacity: 0.9;
            transform: translate(-50%, -50%) rotate(-20deg) scaleX(1.15);
          }
        }
        .comet-tail {
          animation: comet-pulse 0.5s ease-in-out infinite;
        }

        /* Single sonic shockwave ring pulsing off the thruster */
        @keyframes sonic-ring-expand {
          0% {
            transform: scale(0.4);
            opacity: 0.75;
            border-width: 1.5px;
          }
          100% {
            transform: scale(2.3);
            opacity: 0;
            border-width: 0px;
          }
        }
        .sonic-ring {
          animation: sonic-ring-expand 0.7s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        /* Thruster plasma core */
        @keyframes thruster-core-pulse {
          0%, 100% {
            transform: scale(0.9) translate(0, 0);
            opacity: 0.85;
            filter: drop-shadow(0 0 6px rgba(255, 255, 255, 1)) drop-shadow(0 0 14px rgba(56, 189, 248, 0.9));
          }
          50% {
            transform: scale(1.3) translate(-2px, 3px);
            opacity: 1;
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 1)) drop-shadow(0 0 20px rgba(125, 211, 252, 1));
          }
        }
        @keyframes thruster-flare-pulse {
          0%, 100% {
            transform: scale(0.85) translate(0, 0);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.4) translate(-3px, 4px);
            opacity: 0.9;
          }
        }
        .animate-thruster-core {
          animation: thruster-core-pulse 0.18s ease-in-out infinite;
        }
        .animate-thruster-flare {
          animation: thruster-flare-pulse 0.28s ease-in-out infinite;
        }

        @keyframes pedestal-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.18);
            opacity: 0.75;
          }
        }
        .animate-pedestal-pulse {
          animation: pedestal-pulse 3s ease-in-out infinite;
        }

        @keyframes bubble-pop-in {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.92);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .bubble-enter {
          animation: bubble-pop-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════
          FLOATING 3D AI COMPANION (ANCHORED BOTTOM-LEFT)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-4 left-3 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 z-[9990] flex items-end gap-2 sm:gap-3 pointer-events-auto">
        {/* Floating AI Companion Trigger */}
        <div
          onMouseEnter={handleAssistantMouseEnter}
          onMouseLeave={handleAssistantMouseLeave}
          onClick={() => {
            setIsHovered(false);
            setIsCardHovered(false);
            setShowNotification(false);
            onOpen();
          }}
          className="group relative cursor-pointer flex flex-col items-center select-none"
          aria-label="Open AI Assistant"
        >
          {/* Ambient Aura Glow */}
          <div className="absolute -inset-2 bg-gradient-to-t from-slate-400/20 via-slate-500/10 to-transparent rounded-full blur-xl animate-pedestal-pulse pointer-events-none" />

          {/* Glowing Pedestal Ring Underneath (Only when not flying) */}
          {!isScrolling && (
            <div className="absolute -bottom-1 w-12 sm:w-16 h-3 sm:h-4 bg-slate-400/30 rounded-full blur-[4px] animate-pedestal-pulse pointer-events-none" />
          )}

          {/* ═══ PREMIUM HYPER-SPEED FLIGHT EFFECT ═══ */}
          {isScrolling && (
            <>
              {/* Afterimage ghost trail — monochrome duplicates fading out behind the companion */}
              <div className="afterimage-ghost absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 z-0 pointer-events-none" style={{ animationDelay: '0s' }}>
                <Image src={floatingAssistantSrc} alt="" width={96} height={96} unoptimized className="w-full h-full object-contain" />
              </div>
              <div className="afterimage-ghost absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 z-0 pointer-events-none" style={{ animationDelay: '0.14s' }}>
                <Image src={floatingAssistantSrc} alt="" width={96} height={96} unoptimized className="w-full h-full object-contain" />
              </div>
              <div className="afterimage-ghost absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 z-0 pointer-events-none" style={{ animationDelay: '0.28s' }}>
                <Image src={floatingAssistantSrc} alt="" width={96} height={96} unoptimized className="w-full h-full object-contain" />
              </div>

              <div className="absolute inset-0 pointer-events-none z-0">
                {/* Sonic shockwave rings off the thruster */}
                <div className="sonic-ring absolute -bottom-1 left-2 w-8 sm:w-10 h-8 sm:h-10 rounded-full border border-sky-200/80" />
                <div className="sonic-ring absolute -bottom-1 left-2 w-8 sm:w-10 h-8 sm:h-10 rounded-full border border-sky-300/60" style={{ animationDelay: '0.35s' }} />

                {/* Comet-tail energy smear trailing behind — one clean shape, not chaos */}
                <div
                  className="comet-tail absolute blur-[2px]"
                  style={{
                    top: '40%',
                    left: '46%',
                    width: '128px',
                    height: '36px',
                    transform: 'translate(-50%, -50%) rotate(-20deg)',
                    background: 'linear-gradient(to right, transparent, rgba(56,189,248,0.5) 55%, rgba(224,242,254,0.85) 100%)',
                    clipPath: 'polygon(0% 45%, 100% 15%, 100% 85%)',
                  }}
                />
                <div
                  className="absolute blur-[1px]"
                  style={{
                    top: '40%',
                    left: '46%',
                    width: '80px',
                    height: '4px',
                    transform: 'translate(-50%, -50%) rotate(-20deg)',
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.9))',
                  }}
                />

                {/* Clean tapered speed-lines shooting past, single consistent angle */}
                <div className="speed-line" style={{ top: '8%', width: '46px', animationDelay: '0s' }} />
                <div className="speed-line" style={{ top: '24%', width: '60px', animationDelay: '0.09s' }} />
                <div className="speed-line" style={{ top: '42%', width: '38px', animationDelay: '0.18s' }} />
                <div className="speed-line" style={{ top: '58%', width: '52px', animationDelay: '0.05s' }} />
                <div className="speed-line" style={{ top: '74%', width: '34px', animationDelay: '0.24s' }} />
                <div className="speed-line" style={{ top: '90%', width: '44px', animationDelay: '0.13s' }} />

                {/* Thruster plasma core */}
                <div className="animate-thruster-flare absolute -bottom-1.5 left-1 w-9 sm:w-11 h-9 sm:h-11 rounded-full bg-sky-300/30 blur-md" />
                <div className="animate-thruster-core absolute bottom-0 left-2 w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-white/70 blur-sm" />
                <div className="absolute bottom-1.5 left-3.5 w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,1)]" />
              </div>
            </>
          )}

          {/* 3D AI Assistant Image */}
          <div
            className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 transition-transform duration-200 ${isScrolling
              ? 'animate-flight-surge'
              : 'animate-float-levitate group-hover:scale-110'
              }`}
          >
            <Image
              src={floatingAssistantSrc}
              alt="Rabia's AI Assistant"
              width={96}
              height={96}
              priority
              unoptimized
              className={`relative z-10 w-full h-full object-contain transition-[filter] duration-300 ${isScrolling
                  ? 'drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)] drop-shadow-[0_0_12px_rgba(125,211,252,0.45)]'
                  : 'drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]'
                }`}
            />
          </div>

          {/* Micro Badge */}
          <div
            className={`relative -mt-1 px-2.5 sm:px-3 py-0.5 rounded-full flex items-center gap-1.5 transition-all bg-slate-900/90 dark:bg-black/85 border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-md ${isScrolling
              ? 'ring-2 ring-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.6)]'
              : ''
              }`}
          >
            <span
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isScrolling
                ? 'bg-sky-400 shadow-[0_0_10px_#38bdf8] animate-ping'
                : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse'
                }`}
            />
            <span
              className={`text-[9px] sm:text-[10px] tracking-wide font-bold ${isScrolling
                ? 'text-sky-300'
                : 'text-white'
                }`}
            >
              {isScrolling ? 'Guiding ⚡' : 'AI Assistant'}
            </span>
          </div>
        </div>

        {/* ═══ TEMPORARY SELF-MINIMIZING NOTIFICATION OR HOVER TOOLTIP (FAT STICKER DESIGN) ═══ */}
        {(showNotification || isHovered || isCardHovered) && !isScrolling && (
          <div
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
            onClick={() => {
              setIsHovered(false);
              setIsCardHovered(false);
              setShowNotification(false);
              onOpen();
            }}
            className={`neu-header-badge relative flex flex-col items-start rounded-2xl sm:rounded-3xl px-4 py-3 sm:px-5 sm:py-3.5 mb-2 sm:mb-3 max-w-[220px] sm:max-w-[280px] cursor-pointer group transition-all duration-450 ease-out select-none border border-white/35 hover:border-white/60 shadow-[0_16px_36px_rgba(0,0,0,0.65),0_6px_16px_rgba(0,0,0,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.6)] ${
              isMinimizing && !isHovered && !isCardHovered
                ? 'opacity-0 translate-y-3 scale-90 pointer-events-none'
                : 'bubble-enter opacity-100 translate-y-0 scale-100'
            }`}
            style={{
              backgroundImage: "url('/messageContainerBG.jpeg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark Gradient Overlay for optimal manga illustration contrast & text clarity */}
            <span className="absolute inset-0 bg-gradient-to-br from-black/70 via-slate-950/65 to-black/80 rounded-2xl sm:rounded-3xl pointer-events-none" />

            {/* Die-Cut Vinyl Sticker Top Gloss */}
            <span className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-t-2xl sm:rounded-t-3xl pointer-events-none" />

            {/* Inner Specular Border & Ambient Glow */}
            <span className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-white/30 group-hover:border-white/50 transition-all duration-500 shadow-[inset_0_0_15px_rgba(255,255,255,0.18)] pointer-events-none" />

            {/* Real-Life Sticker Corner Rivet / Glow Nodes */}
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-white/75 rounded-full animate-pulse-glow pointer-events-none" />
            <span className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-white/75 rounded-full animate-pulse-glow-delayed pointer-events-none" />

            {/* Center Ambient Core Aura */}
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 blur-2xl rounded-full animate-pulse-glow pointer-events-none" />

            {/* Holographic Light Sweep Across Sticker Surface */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl sm:rounded-3xl pointer-events-none" />

            {/* Header / Meta Row */}
            <div className="relative z-10 flex items-center justify-between w-full pb-1.5 border-b border-white/15">
              <span className="text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse">✦</span>{' '}
                {isHovered && !showNotification ? "RABIA'S AI" : activeGuideData.label}
              </span>
              <span className="text-[9.5px] font-bold text-slate-200 group-hover:text-white px-2 py-0.5 rounded-full bg-white/15 group-hover:bg-white/25 border border-white/20 transition-all shadow-sm flex items-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <span>Tap to Chat</span>
              </span>
            </div>

            {/* Prompt / Message Body */}
            <p
              className="relative z-10 text-[11.5px] sm:text-xs text-white font-medium mt-1.5 leading-snug select-none"
              style={{
                textShadow: '0 0 16px rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              {isHovered && !showNotification
                ? "Hi there! 👋 Click me to ask anything about Rabia's projects & skills!"
                : activeGuideData.guideText}
            </p>

            {/* Hint / Subtitle Footer */}
            <span className="relative z-10 text-[10px] text-slate-300 mt-1.5 italic font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex items-center gap-1">
              <span className="text-white/60 not-italic text-[10px]">↳</span>
              {isHovered && !showNotification
                ? 'Ask about Flutter, Supabase & more'
                : activeGuideData.hint}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
