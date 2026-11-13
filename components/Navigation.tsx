'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import SwordReturnEffect from './SwordReturnEffect';

// Custom WhatsApp Icon Component for mobile menu
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const sidebarSocials = [
  {
    icon: Github,
    label: 'GitHub',
    url: 'https://github.com/swe-rabiaaziz',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/swe-rabiaaziz/',
  },
  {
    icon: WhatsAppIcon,
    label: 'WhatsApp',
    url: 'https://wa.me/923275676026',
  },
  {
    icon: Mail,
    label: 'Email',
    url: 'mailto:swe.rabiaaziz@gmail.com',
  },
];

// ─── Framer Motion Variants for Authentic Kuro-Urushi Katana Scabbard (Saya) Sheathing & Unsheathing ───
const scabbardVariants: Variants = {
  hidden: {
    x: '105%',
    opacity: 0.95,
  },
  covering: {
    x: '0%',
    opacity: 1,
    transition: {
      duration: 0.52,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
  covered: {
    x: '0%',
    opacity: 1,
    transition: {
      duration: 0.05,
    },
  },
  uncovering: {
    x: '105%',
    opacity: 0.95,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function Navigation({ splashDone = false }: { splashDone?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [swordEffect, setSwordEffect] = useState(false);
  const [bladeGleam, setBladeGleam] = useState(false);
  const wasScrolledRef = useRef(false);
  const effectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialFiredRef = useRef(false);

  // ─── Dual Stance System (Advanced Katana vs Standard Neumorphic) ───
  const [activeStance, setActiveStance] = useState<'advanced' | 'standard'>('advanced');
  const [targetStance, setTargetStance] = useState<'advanced' | 'standard'>('advanced');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [coverPhase, setCoverPhase] = useState<'idle' | 'covering' | 'covered' | 'uncovering'>('idle');

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Experience', id: 'experience' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'Contact', id: 'contact' },
  ];

  // Load saved preference from sessionStorage (sword default on initial landing)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('portfolio-navbar-stance');
      } catch (e) {}

      const saved = sessionStorage.getItem('portfolio-navbar-stance');
      if (saved === 'standard' || saved === 'advanced') {
        setActiveStance(saved);
        setTargetStance(saved);
      } else {
        setActiveStance('advanced');
        setTargetStance('advanced');
      }
    }
  }, []);

  // ─── Shared trigger for the blade effect ───
  const triggerBladeEffect = useCallback(() => {
    setSwordEffect(true);
    setBladeGleam(true);

    if (effectTimeoutRef.current) clearTimeout(effectTimeoutRef.current);

    effectTimeoutRef.current = setTimeout(() => {
      setSwordEffect(false);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('katana-dock-complete'));
      }
    }, 2000);

    setTimeout(() => {
      setBladeGleam(false);
    }, 1200);
  }, []);

  // ─── Stance Toggle with Authentic Kuro-Urushi Scabbard (Saya) Sheathing & Unsheathing ───
  const toggleStance = useCallback(() => {
    if (isTransitioning) return;
    const nextStance: 'advanced' | 'standard' = activeStance === 'advanced' ? 'standard' : 'advanced';
    setTargetStance(nextStance);
    setIsTransitioning(true);
    setCoverPhase('covering');

    // Step 1: Scabbard finishes sheathing horizontally and locks at 520ms
    setTimeout(() => {
      setCoverPhase('covered');
      // Swap stance while 100% encased inside the scabbard
      setActiveStance(nextStance);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('portfolio-navbar-stance', nextStance);
      }
    }, 520);

    // Step 2: Begin unsheathing (drawing off to the right) at 940ms
    setTimeout(() => {
      setCoverPhase('uncovering');
    }, 940);

    // If drawing the Katana, trigger the sleek blade gleam as scabbard unmasks the steel
    if (nextStance === 'advanced') {
      setTimeout(() => {
        setBladeGleam(true);
        setTimeout(() => setBladeGleam(false), 1200);
      }, 1100);
    }

    // Step 3: Transition fully finished at 1520ms
    setTimeout(() => {
      setCoverPhase('idle');
      setIsTransitioning(false);
    }, 1520);
  }, [activeStance, isTransitioning]);

  // ─── Keyboard Shortcut [Z] to Switch Stances ───
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in form inputs, textareas, or chat
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        toggleStance();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleStance]);

  // ─── Fire after splash + hero text animations finish ───
  useEffect(() => {
    if (!splashDone || initialFiredRef.current) return;
    initialFiredRef.current = true;

    const timer = setTimeout(() => {
      triggerBladeEffect();
    }, 2500);

    return () => clearTimeout(timer);
  }, [splashDone, triggerBladeEffect]);

  // ─── Scroll-back-to-top trigger with scroll-settle optimization ───
  useEffect(() => {
    let scrollSettleTimer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      const y = window.scrollY;
      const isScrolledDown = y > 10;
      setScrolled((prev) => (prev !== isScrolledDown ? isScrolledDown : prev));

      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const heroBottom = heroEl.getBoundingClientRect().bottom;
        setIsPastHero(heroBottom <= 80);
      } else {
        setIsPastHero(y > (window.innerHeight - 80));
      }

      if (y > 200) {
        wasScrolledRef.current = true;
      }

      // When returning to top (y <= 5), wait 60ms for scroll momentum to settle
      if (y <= 5 && wasScrolledRef.current) {
        if (scrollSettleTimer) clearTimeout(scrollSettleTimer);
        scrollSettleTimer = setTimeout(() => {
          if (window.scrollY <= 10 && wasScrolledRef.current) {
            wasScrolledRef.current = false;
            if (activeStance === 'advanced') {
              triggerBladeEffect();
            }
          }
        }, 60);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (effectTimeoutRef.current) clearTimeout(effectTimeoutRef.current);
      if (scrollSettleTimer) clearTimeout(scrollSettleTimer);
    };
  }, [activeStance, triggerBladeEffect]);

  // Offset navigation so fixed navbar doesn't cover section titles
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER HELPERS FOR BOTH STANCES (FULLY RESPONSIVE ACROSS MOBILE & DESKTOP)
  // ═══════════════════════════════════════════════════════════════

  // ─── 1. ADVANCED KATANA STANCE (RESPONSIVE: MOBILE & DESKTOP) ───
  const renderAdvancedNavbar = () => (
    <div className="relative h-10 sm:h-11 md:h-10 w-full flex items-center justify-center select-none">
      {/* Sword gleam overlay */}
      {bladeGleam && (
        <div className="absolute inset-0 z-[60] pointer-events-none overflow-hidden rounded-sm">
          <div className="sword-gleam-sweep absolute inset-y-0 w-24" />
        </div>
      )}

      {/* Energy pulse ring around the sword */}
      {swordEffect && (
        <div className="absolute inset-0 z-[55] pointer-events-none flex items-center justify-center">
          <div className="sword-energy-ring" />
          <div className="sword-energy-ring" style={{ animationDelay: '150ms' }} />
        </div>
      )}

      {/* 1. Pommel (Kashira) */}
      <div className="h-full w-2 sm:w-2.5 md:w-3 bg-gradient-to-b from-slate-400 via-slate-300 to-slate-500 rounded-l-md border border-slate-700 z-30 shadow-[0_0_5px_rgba(0,0,0,0.8)] shrink-0"></div>

      {/* 2. Handle (Tsuka) with Interactive Crest Seal */}
      <div className="h-full w-24 sm:w-36 md:w-56 bg-slate-900 border-y border-slate-800 relative flex items-center justify-center shadow-[inset_0_0_15px_rgba(0,0,0,1)] z-20 group shrink-0">
        <div
          className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, #1e293b 25%, transparent 25%, transparent 75%, #1e293b 75%, #1e293b), 
                         linear-gradient(-45deg, #1e293b 25%, transparent 25%, transparent 75%, #1e293b 75%, #1e293b)`,
            backgroundSize: `10px 10px`
          }}
        ></div>

        {/* Embedded Crest Holster Trigger */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleStance();
          }}
          className="relative z-10 flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 h-6 sm:h-7 bg-black/75 rounded-full border border-slate-700/80 hover:border-neutral-400 transition-all shadow-md group/seal cursor-pointer select-none"
          title="Tap to switch to Zen Dock (or press 'Z')"
        >
          <div
            className="neu-header-badge relative w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] rounded-md sm:rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 group-hover/seal:scale-105 transition-transform shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            style={{ backgroundImage: "url('/messageContainerBG.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {/* Dark Overlay */}
            <span className="absolute inset-0 bg-gradient-to-br from-black/60 via-slate-900/50 to-black/60 rounded-md sm:rounded-lg" />
            {/* Border & Specular Glow */}
            <span className="absolute inset-0 rounded-md sm:rounded-lg border border-white/30 group-hover/seal:border-white/60 transition-colors shadow-[inset_0_0_8px_rgba(255,255,255,0.2)]" />
            {/* Corner Nodes */}
            <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-white/70 rounded-full animate-pulse-glow" />
            <span className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-white/70 rounded-full animate-pulse-glow-delayed" />
            {/* Center Aura */}
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white/10 blur-sm rounded-full animate-pulse-glow" />
            {/* RA Typography */}
            <span
              className="relative z-10 text-white font-black text-[8px] sm:text-[9px] tracking-wider select-none leading-none"
              style={{
                textShadow: '0 0 10px rgba(255,255,255,0.5), 0 1px 3px rgba(0,0,0,0.6)',
              }}
            >
              RA
            </span>
          </div>
          <span className="text-white font-black tracking-wider text-[10px] sm:text-xs drop-shadow-[0_2px_4px_rgba(0,0,0,1)] group-hover/seal:text-neutral-200 transition-colors leading-none">
            RABIA
          </span>

          {/* Stance Indicator Icon */}
          <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold group-hover/seal:text-white transition-colors px-1 py-0.5 rounded bg-white/10 group-hover/seal:bg-white/20 flex items-center leading-none">
            ✦
          </span>

          {/* Floating Hover Badge Tooltip (desktop) */}
          <div className="hidden sm:block absolute -bottom-9 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover/seal:opacity-100 transition-all duration-200 transform translate-y-1 group-hover/seal:translate-y-0 whitespace-nowrap z-50">
            <div className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-neutral-900/95 text-neutral-200 border border-neutral-600/60 shadow-lg flex items-center gap-1.5 backdrop-blur-md">
              <span>Switch to Zen Dock</span>
              <kbd className="px-1.5 py-0.2 bg-white/15 rounded text-[9px] text-white">Z</kbd>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Guard (Tsuba) */}
      <div className="h-[125%] sm:h-[130%] w-2 sm:w-2.5 bg-gradient-to-b from-slate-800 via-slate-500 to-slate-900 rounded-sm border border-black z-30 shadow-[0_0_10px_rgba(0,0,0,1)] shrink-0"></div>

      {/* 4. Blade Collar (Habaki) */}
      <div className="h-[88%] sm:h-[90%] w-2.5 sm:w-3.5 md:w-4 bg-gradient-to-b from-slate-300 via-white to-slate-400 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.3)] shrink-0"></div>

      {/* 5. Blade (Ha) with Horizontal Scroll & Tip Menu Toggle on Mobile */}
      <div
        className={`h-[82%] sm:h-[80%] flex-1 bg-gradient-to-b from-slate-400 via-white to-slate-200 relative flex items-center justify-between px-2 sm:px-4 md:px-8 lg:px-12 z-10 border-b-2 border-white/80 shadow-[0_8px_15px_rgba(0,0,0,0.4)] min-w-0 ${swordEffect ? 'sword-blade-flash' : ''}`}
        style={{ clipPath: 'polygon(0 0, 98.5% 0, 100% 50%, 98.5% 100%, 0 100%)' }}
      >
        <div className="absolute bottom-0 w-full h-[2px] bg-white opacity-90 shadow-[0_0_8px_#ffffff]"></div>

        {/* Scrollable Blade Links */}
        <div className="flex gap-2.5 sm:gap-4 md:gap-5 lg:gap-8 xl:gap-10 items-center relative z-20 overflow-x-auto no-scrollbar py-0.5 max-w-full mr-1 sm:mr-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="relative group font-black tracking-wider lg:tracking-[0.15em] uppercase text-[10px] sm:text-[11px] lg:text-xs text-slate-800 transition-colors duration-300 hover:text-black py-0.5 whitespace-nowrap cursor-pointer shrink-0"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-slate-900 group-hover:w-full transition-all duration-300 ease-out shadow-[0_0_4px_rgba(0,0,0,0.5)]"></span>
            </button>
          ))}
        </div>

        {/* Katana Blade Tip Menu Expander Button (Mobile Only) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative z-20 p-1 rounded hover:bg-black/10 text-slate-800 shrink-0 ml-1 flex items-center justify-center transition-all cursor-pointer"
          aria-label="Toggle Navigation Menu"
          title="Open menu"
        >
          {isOpen ? <X size={15} /> : <Menu size={15} />}
        </button>
      </div>
    </div>
  );

  // ─── 2. STANDARD NEUMORPHIC CAPSULE DOCK (RESPONSIVE: MOBILE & DESKTOP) ───
  const renderStandardNavbar = () => (
    <div
      className={`relative h-12 sm:h-14 w-full flex items-center justify-between px-2 sm:px-4 lg:px-6 rounded-full backdrop-blur-xl transition-all duration-300 overflow-hidden ${
        isPastHero
          ? 'border border-slate-300/80 dark:border-white/10 bg-slate-100/95 dark:bg-[#111620]/95 shadow-[6px_6px_20px_rgba(148,163,184,0.35),-6px_-6px_20px_rgba(255,255,255,0.9),inset_0_1.5px_2px_rgba(255,255,255,0.95)] dark:shadow-[8px_8px_24px_rgba(0,0,0,0.8),-4px_-4px_16px_rgba(255,255,255,0.03),inset_0_1.5px_2px_rgba(255,255,255,0.12)]'
          : 'border border-white/20 bg-slate-100/95 dark:bg-[#111620]/95 shadow-[0_12px_32px_rgba(0,0,0,0.65),0_2px_6px_rgba(0,0,0,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.95)]'
      }`}
    >
      {/* Digital Art / Isometric Precision Micro-Dot Matrix */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />

      {/* Subtle Top Specular Bevel Line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />

      {/* 1. Left Brand Capsule — Square with rounded corners (Matching SkillsSection badge) */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          toggleStance();
        }}
        className="relative z-10 flex items-center gap-2 sm:gap-3 px-1 sm:px-2 py-1 select-none shrink-0 cursor-pointer group/brand"
        title="Tap to switch stance"
      >
        <div
          className="neu-header-badge relative w-8 h-8 sm:w-11 sm:h-11 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md group-hover/brand:scale-105 transition-transform"
          style={{
            backgroundImage: "url('/messageContainerBG.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Subtle Dark Gradient Overlay */}
          <span className="absolute inset-0 bg-gradient-to-br from-black/60 via-slate-900/50 to-black/60 rounded-xl" />

          {/* Border & Inner Specular Glow */}
          <span className="absolute inset-0 rounded-xl border border-white/30 group-hover/brand:border-white/50 transition-all duration-500 shadow-[inset_0_0_15px_rgba(255,255,255,0.18)]" />

          {/* Corner Pulse Glow Nodes */}
          <span className="absolute top-1 right-1 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/70 rounded-full animate-pulse-glow" />
          <span className="absolute bottom-1 left-1 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/70 rounded-full animate-pulse-glow-delayed" />

          {/* Center Ambient Aura */}
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-white/10 blur-md rounded-full animate-pulse-glow" />

          {/* Luminous Shimmer Sweep */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/brand:translate-x-full transition-transform duration-700 rounded-xl" />

          {/* Glowing RA Typography */}
          <span
            className="relative z-10 text-white font-black text-xs sm:text-sm tracking-wider select-none leading-none"
            style={{
              textShadow: '0 0 15px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.25), 0 2px 4px rgba(0,0,0,0.5)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
            }}
          >
            RA
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-black tracking-widest text-[11px] sm:text-xs text-slate-800 dark:text-slate-100 leading-none">
            RABIA<span className="hidden sm:inline"> AZIZ</span>
          </span>
          <span className="text-[8px] sm:text-[9px] font-mono font-bold tracking-widest text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1 sm:gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ZEN DOCK
          </span>
        </div>
      </div>

      {/* 2. Soft Recessed Pill Track for Navigation Links (Horizontal Scrollable on Mobile) */}
      <div className="relative z-10 neu-inset px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 lg:gap-3 overflow-x-auto no-scrollbar max-w-[50vw] sm:max-w-none shadow-[inset_3px_3px_6px_rgba(163,177,198,0.35),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="relative group px-2.5 sm:px-3.5 lg:px-4 py-1 sm:py-1.5 rounded-full font-bold tracking-wider uppercase text-[10px] sm:text-[11px] lg:text-xs text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:neu-button transition-all duration-200 select-none whitespace-nowrap cursor-pointer shrink-0"
          >
            {item.label}
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-neutral-800 dark:bg-white rounded-full group-hover:w-3/5 transition-all duration-200 ease-out opacity-80" />
          </button>
        ))}
      </div>

      {/* 3. Utility Controls: Stance Switch Holster & Mobile Menu Expander */}
      <div className="relative z-10 flex items-center justify-end gap-1 sm:gap-2 shrink-0">
        {/* Quick Stance Switcher Holster Button */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleStance();
          }}
          className="neu-button px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold tracking-wider cursor-pointer flex items-center gap-1.5 sm:gap-2.5 text-slate-700 dark:text-slate-200 hover:text-black dark:hover:text-white transition-all select-none group/switch border border-slate-300/80 dark:border-white/10 shadow-sm hover:scale-105 active:scale-95"
          title="Unsheathe Katana Stance (or press 'Z')"
        >
          <span className="text-xs sm:text-sm group-hover/switch:-rotate-12 transition-transform">⚔️</span>
          <span className="hidden xs:inline text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase">KATANA</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[9px] font-mono font-black text-slate-700 dark:text-slate-300 border border-black/10 dark:border-white/10">
            Z
          </kbd>
        </div>

        {/* Mobile Menu Expander */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden neu-icon-btn w-7 h-7 sm:w-8 sm:h-8 rounded-full text-slate-800 dark:text-slate-100 p-0 flex items-center justify-center shrink-0 cursor-pointer"
          aria-label="Toggle menu"
          title="Open menu"
        >
          {isOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Full-screen anime sword effect overlay (for Katana Stance dock) */}
      <SwordReturnEffect isActive={swordEffect} />

      <nav
        className={`fixed w-full z-50 transition-[top] duration-300 ${
          scrolled ? 'top-0' : 'top-2'
        }`}
      >
        <div className="max-w-[98%] sm:max-w-[95%] mx-auto px-1 sm:px-2 relative py-2">

          {/* ═══════════════════════════════════════════════════════════════
              STANCE TRANSITION LAYER (KURO-URUSHI SAYA SCABBARD SHEATH & DRAW)
          ═══════════════════════════════════════════════════════════════ */}
          <div className="relative w-full min-h-[44px] sm:min-h-[56px] flex items-center justify-center">
            {/* The Active Stance Navbar (swaps cleanly while sheathed inside scabbard) */}
            <div className="w-full">
              {activeStance === 'advanced' ? renderAdvancedNavbar() : renderStandardNavbar()}
            </div>

            {/* Bounded Scabbard Sleeve Layer — Perfectly wraps and sheaths the navbar */}
            <div className="absolute inset-0 z-[70] pointer-events-none overflow-hidden rounded-2xl md:rounded-full">
              <AnimatePresence>
                {coverPhase !== 'idle' && (
                  <motion.div
                    key="kuro-urushi-saya"
                    variants={scabbardVariants}
                    initial="hidden"
                    animate={coverPhase}
                    exit="uncovering"
                    className="absolute inset-0 w-full h-full flex items-center shadow-[0_16px_40px_rgba(0,0,0,0.9)]"
                  >
                    {/* Authentic Kuro-Urushi Japanese Scabbard (Saya) */}
                    <div className="relative w-full h-full rounded-2xl md:rounded-full bg-gradient-to-b from-[#202020] via-[#0d0d0d] to-[#161616] border border-neutral-700/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_12px_32px_rgba(0,0,0,0.95)] flex items-center justify-between overflow-hidden">
                      
                      {/* Damascene Woodgrain / Lacquer Texture */}
                      <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                          backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 14px)',
                        }}
                      />

                      {/* Cylindrical polished lacquer spine sheen */}
                      <div className="absolute top-1 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-[0.5px] pointer-events-none" />
                      <div className="absolute bottom-1 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-black to-transparent pointer-events-none" />

                      {/* 1. Left Collar: Koiguchi (鯉口 - Mouth Collar) */}
                      <div className="relative z-20 h-full w-10 sm:w-16 bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-400 border-r-2 border-neutral-600 rounded-l-2xl md:rounded-l-full flex items-center justify-between px-2 sm:px-3 shadow-[3px_0_8px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.9)] flex-shrink-0">
                        {/* 2 Steel Mekugi Rivets */}
                        <div className="flex flex-col justify-between h-[65%] my-auto">
                          <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-neutral-800 border border-neutral-500/80 shadow-inner" />
                          <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-neutral-800 border border-neutral-500/80 shadow-inner" />
                        </div>

                        {/* Mouth Aperture / Slit */}
                        <div className="w-[2.5px] sm:w-[3px] h-[75%] rounded-full bg-neutral-900 border-r border-white/50 shadow-inner ml-1" />

                        {/* Kanji Stamp */}
                        <span className="text-[10px] font-black tracking-tighter text-neutral-800 select-none hidden sm:inline">
                          鞘
                        </span>
                      </div>

                      {/* 2. Left-Center: Kurikata & Sageo Cord Wrap (下げ緒) */}
                      <div className="relative z-10 hidden sm:flex items-center gap-1.5 ml-3 flex-shrink-0">
                        <div className="w-1.5 h-7 rounded-sm bg-gradient-to-b from-neutral-300 to-neutral-500 border border-neutral-600 shadow-sm" />
                        <div
                          className="h-8 px-4 rounded-md border-y border-neutral-600/70 shadow-inner flex items-center justify-center"
                          style={{
                            background: `repeating-linear-gradient(45deg, #1c1c1c, #1c1c1c 4px, #383838 4px, #383838 8px),
                                         repeating-linear-gradient(-45deg, #1c1c1c, #1c1c1c 4px, #383838 4px, #383838 8px)`,
                          }}
                        >
                          <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-neutral-300 uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                            SAGEO • 緒
                          </span>
                        </div>
                        <div className="w-1.5 h-7 rounded-sm bg-gradient-to-b from-neutral-300 to-neutral-500 border border-neutral-600 shadow-sm" />
                      </div>

                      {/* 3. Center: Monochromatic Scabbard Crest Seal */}
                      <div className="relative z-10 flex-1 flex items-center justify-center px-2 sm:px-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="hidden md:block w-14 lg:w-24 h-[1px] bg-gradient-to-r from-transparent via-neutral-500 to-transparent" />
                          
                          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 rounded-full bg-black/70 border border-neutral-700 shadow-inner">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-pulse" />
                            <span className="text-[9px] sm:text-[11px] font-bold tracking-[0.18em] sm:tracking-[0.22em] text-neutral-200 uppercase">
                              {targetStance === 'advanced' ? 'KATANA SAYA • 刀鞘' : 'ZEN CAPSULE • 禅鞘'}
                            </span>
                          </div>

                          <div className="hidden md:block w-14 lg:w-24 h-[1px] bg-gradient-to-r from-transparent via-neutral-500 to-transparent" />
                        </div>
                      </div>

                      {/* 4. Right End: Kojiri (鐺 - Scabbard Tip) */}
                      <div className="relative z-20 h-full w-9 sm:w-16 bg-gradient-to-r from-neutral-400 via-neutral-300 to-neutral-200 border-l-2 border-neutral-500 rounded-r-2xl md:rounded-r-full flex items-center justify-center shadow-[-3px_0_8px_rgba(0,0,0,0.5)] flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <div className="w-[1.5px] h-5 sm:h-6 bg-neutral-600 rounded-full" />
                          <div className="w-[1.5px] h-3 sm:h-4 bg-neutral-500 rounded-full" />
                        </div>
                      </div>

                      {/* 5. Steel Blade Flash Line during Unwrapping */}
                      {coverPhase === 'uncovering' && (
                        <div className="absolute left-0 top-0 bottom-0 w-4 pointer-events-none z-30">
                          <div className="w-[3px] h-full bg-white shadow-[0_0_12px_#ffffff,0_0_24px_#ffffff] blur-[0.5px]" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              MOBILE MENU DROPDOWN (Matches active stance)
          ═══════════════════════════════════════════════════════════════ */}
          {isOpen && (
            <div
              className={`md:hidden mt-3 p-4 space-y-2 z-50 ${
                activeStance === 'advanced'
                  ? 'bg-slate-950/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-800'
                  : 'neu-flat rounded-3xl shadow-2xl border border-white/70 dark:border-slate-800'
              }`}
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-5 py-3 transition-all cursor-pointer ${
                    activeStance === 'advanced'
                      ? 'rounded-lg font-bold tracking-widest uppercase text-slate-300 hover:text-white hover:bg-slate-800 border-l-2 border-transparent hover:border-neutral-300 text-xs'
                      : 'neu-button rounded-2xl font-bold tracking-wider uppercase text-xs text-slate-700 dark:text-slate-200 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* ─── Sidebar Options Integrated for Mobile (Hire Me & Socials) ─── */}
              <div className="pt-3 border-t border-slate-800/60 dark:border-slate-700/60 space-y-2">
                {/* Available for Hire button with green Chakra pulse */}
                <button
                  onClick={() => scrollToSection('contact')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all cursor-pointer group ${
                    activeStance === 'advanced'
                      ? 'bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/40 hover:border-emerald-400 text-white shadow-[0_4px_16px_rgba(16,185,129,0.15)] active:scale-[0.98]'
                      : 'neu-button border border-emerald-500/40 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Glowing green Chakra Beacon */}
                    <div className="relative flex items-center justify-center w-2.5 h-2.5 flex-shrink-0">
                      <span className="absolute w-3.5 h-3.5 bg-emerald-500/50 rounded-full animate-ping" />
                      <span className="relative w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                    </div>
                    <span className="text-xs font-black tracking-widest uppercase text-emerald-400 group-hover:text-emerald-300">
                      Hire Me
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
                      • Available for hire
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 4 Social Quick Links */}
                <div className="grid grid-cols-4 gap-2 pt-0.5">
                  {sidebarSocials.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      onClick={() => setIsOpen(false)}
                      className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all cursor-pointer border ${
                        activeStance === 'advanced'
                          ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                          : 'neu-button text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white border-transparent'
                      }`}
                    >
                      <social.icon className="w-4 h-4 mb-1" />
                      <span className="text-[10px] font-bold tracking-wide">{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Stance switch button in mobile menu */}
              <div className="pt-2 border-t border-slate-800/60 dark:border-slate-700/60">
                <button
                  onClick={() => {
                    toggleStance();
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-100 border border-neutral-600/50 text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>{activeStance === 'advanced' ? '✦ Switch to Zen Dock' : '⚔️ Unsheathe Katana Blade'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </nav>

      {/* Sword animation CSS — Naruto chakra theme */}
      <style jsx>{`
        /* Chakra gleam — blue-white sweep across the blade */
        @keyframes sword-gleam-sweep {
          0% {
            left: -120px;
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            left: calc(100% + 120px);
            opacity: 0;
          }
        }
        .sword-gleam-sweep {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(140, 180, 255, 0.02) 15%,
            rgba(180, 210, 255, 0.4) 38%,
            rgba(220, 235, 255, 0.85) 46%,
            rgba(255, 255, 255, 1) 50%,
            rgba(220, 235, 255, 0.85) 54%,
            rgba(180, 210, 255, 0.4) 62%,
            rgba(140, 180, 255, 0.02) 85%,
            transparent 100%
          );
          animation: sword-gleam-sweep 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          filter: blur(1px);
          mix-blend-mode: screen;
        }

        /* Chakra energy ring */
        @keyframes sword-energy-expand {
          0% {
            width: 40px;
            height: 15px;
            opacity: 0.8;
            border-width: 2px;
            filter: blur(0px);
          }
          50% {
            opacity: 0.4;
            filter: blur(1px);
          }
          100% {
            width: 80vw;
            height: 180px;
            opacity: 0;
            border-width: 0.3px;
            filter: blur(2px);
          }
        }
        .sword-energy-ring {
          position: absolute;
          border: 2px solid rgba(160, 200, 255, 0.6);
          border-radius: 50%;
          box-shadow: 
            0 0 12px rgba(140, 180, 255, 0.3),
            0 0 30px rgba(140, 180, 255, 0.1),
            inset 0 0 12px rgba(180, 210, 255, 0.1);
          animation: sword-energy-expand 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Chakra blade flash — blue-white brightness spike */
        @keyframes sword-blade-flash-kf {
          0% {
            filter: brightness(1) drop-shadow(0 0 0px rgba(140,180,255,0));
          }
          8% {
            filter: brightness(1.8) drop-shadow(0 0 20px rgba(160,200,255,0.85));
          }
          30% {
            filter: brightness(1.3) drop-shadow(0 0 10px rgba(160,200,255,0.4));
          }
          100% {
            filter: brightness(1) drop-shadow(0 0 0px rgba(140,180,255,0));
          }
        }
        .sword-blade-flash {
          animation: sword-blade-flash-kf 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: filter;
        }
      `}</style>
    </>
  );
}
