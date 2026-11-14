'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { isMobileDevice } from '@/lib/utils';

/* â•â•â• PREMIUM KATANA SLASH EFFECT â•â•â•
   A real sword-cut reads as: a fast white bloom (the flash of impact), a thin
   crisp edge that lingers a beat after the bloom dies (the actual "cut mark"),
   a faint lagging afterimage (sells the speed of the swing), and a small spark
   burst where the blade exits frame. Hoisted outside the component since these
   are pure â€” no need to redefine them on every render. */

const SPARK_ANGLES = [-75, -40, -12, 14, 42, 78, 118, 158];

const SparkBurst = ({ x, y, delay = 0, big = false }: { x: string; y: string; delay?: number; big?: boolean }) => (
  <div className="absolute z-[36] pointer-events-none" style={{ left: x, top: y }}>
    {SPARK_ANGLES.map((deg, i) => {
      const dist = (big ? 20 : 13) + (i % 3) * (big ? 9 : 5);
      const rad = (deg * Math.PI) / 180;
      const dx = Math.cos(rad) * dist;
      const dy = Math.sin(rad) * dist;
      return (
        <motion.span
          key={deg}
          className="absolute bg-white rounded-full"
          style={{
            width: big ? '2.5px' : '2px',
            height: big ? '13px' : '9px',
            top: 0,
            left: 0,
            transformOrigin: 'center',
            filter: 'drop-shadow(0 0 4px rgba(224,242,254,0.95))',
          }}
          initial={{ opacity: 0, x: 0, y: 0, rotate: deg, scale: 0.4 }}
          animate={{ opacity: [0, 1, 0], x: dx, y: dy, scale: [0.4, 1, 0.55] }}
          transition={{ duration: big ? 0.38 : 0.32, ease: 'easeOut', delay }}
        />
      );
    })}
  </div>
);

const SwordSlash = ({
  x1, y1, x2, y2, delay = 0, big = false,
}: { x1: string; y1: string; x2: string; y2: string; delay?: number; big?: boolean }) => (
  <>
    <svg className="absolute inset-0 w-full h-full z-[35] pointer-events-none overflow-visible">
      {/* Afterimage â€” a faint offset duplicate that lags slightly behind, selling the speed of the swing */}
      <motion.line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#94a3b8" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0, strokeWidth: 1 }}
        animate={{ pathLength: 1, opacity: [0, 0.45, 0], strokeWidth: [1, big ? 8 : 5, 0] }}
        transition={{ duration: big ? 0.36 : 0.33, ease: 'easeOut', delay: delay + 0.06 }}
        style={{ filter: 'blur(3px)', transform: 'translate(6px, -5px)', willChange: 'opacity, stroke-width' }}
      />

      {/* Bloom â€” the initial white-hot flash of the cut, wide and very fast to decay */}
      <motion.line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#ffffff" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0, strokeWidth: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 0], strokeWidth: [0, big ? 60 : 38, 0] }}
        transition={{ duration: big ? 0.24 : 0.22, ease: 'easeOut', delay }}
        style={{ filter: `blur(${big ? 18 : 13}px)`, willChange: 'opacity, stroke-width' }}
      />
      <motion.line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#e0f2fe" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0, strokeWidth: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.9, 0], strokeWidth: [0, big ? 22 : 14, 0] }}
        transition={{ duration: big ? 0.22 : 0.2, ease: 'easeOut', delay: delay + 0.02 }}
        style={{ filter: 'blur(5px)', willChange: 'opacity, stroke-width' }}
      />

      {/* Crisp edge â€” the thin sharp line that lingers a beat after the bloom fades: the actual cut mark */}
      <motion.line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#ffffff" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 0.75, 0] }}
        transition={{ duration: big ? 0.4 : 0.48, times: [0, 0.15, 0.55, 1], ease: 'easeOut', delay }}
        style={{ strokeWidth: big ? 2 : 1.4, filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.9))', willChange: 'opacity' }}
      />
    </svg>

    {/* Spark shards fired from the point the blade exits frame */}
    <SparkBurst x={x2} y={y2} delay={delay + (big ? 0.12 : 0.17)} big={big} />
  </>
);

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'intro' | 'slash1' | 'slash2' | 'slash3' | 'tension' | 'slashFinal' | 'impact' | 'dock'>('intro');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Skip splash screen immediately only on mobile devices (phones); keep on tablet & desktop
    if (isMobileDevice()) {
      onComplete();
      setIsVisible(false);
      return;
    }

    const t1 = setTimeout(() => setPhase('slash1'), 600);
    const t2 = setTimeout(() => setPhase('slash2'), 1100);
    const t3 = setTimeout(() => setPhase('slash3'), 1600);
    const t4 = setTimeout(() => setPhase('tension'), 2100);
    const t5 = setTimeout(() => setPhase('slashFinal'), 2700);
    const t6 = setTimeout(() => setPhase('impact'), 2850);
    const t7 = setTimeout(() => setPhase('dock'), 3000);

    // Call onComplete so the home page starts rendering underneath
    const t8 = setTimeout(() => onComplete(), 3600);

    // Unmount splash cleanly
    const t9 = setTimeout(() => setIsVisible(false), 4200);

    // Hard failsafe timer: ensures splash NEVER gets stuck
    const safety = setTimeout(() => {
      onComplete();
      setIsVisible(false);
    }, 4500);

    // Allow user to press any key or click to skip immediately
    const handleSkip = () => {
      onComplete();
      setIsVisible(false);
    };
    window.addEventListener('keydown', handleSkip, { once: true });
    window.addEventListener('click', handleSkip, { once: true });

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      clearTimeout(t5); clearTimeout(t6); clearTimeout(t7); clearTimeout(t8);
      clearTimeout(t9); clearTimeout(safety);
      window.removeEventListener('keydown', handleSkip);
      window.removeEventListener('click', handleSkip);
    };
  }, [onComplete]);

  const fallEase: [number, number, number, number] = [0.4, 0, 0.2, 1];
  const drawEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
  const glideEase: [number, number, number, number] = [0.25, 1, 0.3, 1];

  const isCut = phase === 'impact' || phase === 'dock';

  const topClipPath = isCut
    ? 'polygon(0 0, 100% 0, 100% calc(50vh - 23vw), 0 calc(50vh + 23vw))'
    : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';

  const bottomClipPath = isCut
    ? 'polygon(0 calc(50vh + 23vw), 100% calc(50vh - 23vw), 100% 100%, 0 100%)'
    : 'polygon(0 0, 0 0, 0 0, 0 0)';

  const topVariants: Variants = {
    intro: { y: 0, x: 0, rotate: 0 },
    slash1: { y: 0, x: 0, rotate: 0 },
    slash2: { y: 0, x: 0, rotate: 0 },
    slash3: { y: 0, x: 0, rotate: 0 },
    tension: { y: 0, x: 0, rotate: 0 },
    slashFinal: { y: 0, x: 0, rotate: 0 },
    impact: { y: '-1vh', x: '-1vw', rotate: 0 },
    dock: { y: '-100vh', x: '-15vw', rotate: -5, opacity: 0, transition: { duration: 1.2, ease: fallEase } }
  };

  const bottomVariants: Variants = {
    intro: { y: 0, x: 0, rotate: 0 },
    slash1: { y: 0, x: 0, rotate: 0 },
    slash2: { y: 0, x: 0, rotate: 0 },
    slash3: { y: 0, x: 0, rotate: 0 },
    tension: { y: 0, x: 0, rotate: 0 },
    slashFinal: { y: 0, x: 0, rotate: 0 },
    impact: { y: '1vh', x: '1vw', rotate: 0 },
    dock: { y: '100vh', x: '15vw', rotate: 5, opacity: 0, transition: { duration: 1.2, ease: fallEase } }
  };

  const swordVariants: Variants = {
    intro: { top: '120%', left: '-20%', x: '-50%', y: '-50%', rotate: -80, scale: 1.5, opacity: 0 },
    slash1: { opacity: 0 },
    slash2: { opacity: 0 },
    slash3: { opacity: 0 },
    tension: {
      top: '85%', left: '10%', x: '-50%', y: '-50%', rotate: -45, scale: 1.3, opacity: 1,
      transition: { duration: 0.8, ease: drawEase }
    },
    slashFinal: {
      top: '50%', left: '50%', x: '-50%', y: '-50%', rotate: -25, scale: 1.1, opacity: 1,
      transition: { duration: 0.15, ease: 'easeIn' }
    },
    impact: {
      top: '48%', left: '52%', x: '-50%', y: '-50%', rotate: -23, scale: 1.1, opacity: 1,
      transition: { duration: 0.15, ease: 'easeOut' }
    },
    dock: {
      top: '16px', left: '50%', x: '-50%', y: '0%', rotate: 0, scale: 1, opacity: 1,
      transition: { duration: 1.0, ease: glideEase }
    }
  };

  const getShakeClass = () => {
    if (phase === 'slash1' || phase === 'slash2' || phase === 'slash3') return 'animate-shake-medium';
    if (phase === 'tension') return 'animate-rumble';
    if (phase === 'slashFinal') return 'animate-shake-heavy';
    return '';
  };

  const LogoContent = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_#262626_0%,_#0a0a0a_70%,_#000000_100%)]">
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>
      <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none pointer-events-none z-0">
        <span className="text-[35vw] font-black text-white tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">開始</span>
      </div>
      <Image
        src="/images/logo.jpg"
        alt="Rabia Aziz - Flutter Developer Brand Logo"
        width={180}
        height={180}
        className="rounded-full drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] z-10"
        priority
      />
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        // Fade the entire splash wrapper to opacity:0 before unmounting
        // â€” home page renders underneath while this is still covering it
        <motion.div
          className={`fixed inset-0 z-[9999] bg-black overflow-hidden pointer-events-none splash-screen-desktop-only ${getShakeClass()}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } }}
          style={{ willChange: 'opacity, transform' }}
        >
          {/* TOP SCREEN PANEL */}
          <motion.div
            className="absolute inset-0 z-20 origin-bottom-left"
            style={{ clipPath: topClipPath, willChange: 'transform, clip-path' }}
            variants={topVariants}
            initial="intro"
            animate={phase}
          >
            <LogoContent />
          </motion.div>

          {/* BOTTOM SCREEN PANEL */}
          <motion.div
            className="absolute inset-0 z-20 origin-top-right"
            style={{ clipPath: bottomClipPath, willChange: 'transform, clip-path' }}
            variants={bottomVariants}
            initial="intro"
            animate={phase}
          >
            <LogoContent />
          </motion.div>

          {/* SWORD SLASHES */}
          {phase === 'slash1' && <SwordSlash x1="-20%" y1="10%" x2="120%" y2="50%" />}
          {phase === 'slash2' && <SwordSlash x1="80%" y1="-20%" x2="20%" y2="120%" />}
          {phase === 'slash3' && <SwordSlash x1="120%" y1="80%" x2="-20%" y2="30%" />}

          {/* FINAL CLEAVE â€” the decisive full-screen cut, bigger bloom + bigger spark burst */}
          {(phase === 'slashFinal' || phase === 'impact') && (
            <SwordSlash x1="-20%" y1="calc(50vh + 35vw)" x2="120%" y2="calc(50vh - 35vw)" big />
          )}

          {/* IMPACT FLASH */}
          {phase === 'impact' && (
            <div className="absolute inset-0 bg-white z-[50] animate-impact-flash" />
          )}

          {/* NAVBAR SWORD */}
          <motion.div
            className="absolute z-[40] w-full max-w-[98%] sm:max-w-[95%] px-1 sm:px-2 flex"
            variants={swordVariants}
            style={{ willChange: 'transform, top, left, opacity' }}
            initial="intro"
            animate={phase}
          >
            <div className="relative h-10 w-full items-center justify-center flex drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
              <div className="h-full w-3 bg-gradient-to-b from-slate-400 via-slate-300 to-slate-500 rounded-l-md border border-slate-700 z-30 shadow-[0_0_5px_rgba(0,0,0,0.8)]"></div>
              <div className="h-full w-28 sm:w-40 md:w-56 bg-slate-900 border-y border-slate-800 relative flex items-center justify-center shadow-[inset_0_0_15px_rgba(0,0,0,1)] z-20 group">
                <div className="absolute inset-0 opacity-40 transition-opacity duration-300" style={{ background: `linear-gradient(45deg, #1e293b 25%, transparent 25%, transparent 75%, #1e293b 75%, #1e293b), linear-gradient(-45deg, #1e293b 25%, transparent 25%, transparent 75%, #1e293b 75%, #1e293b)`, backgroundSize: `12px 12px` }}></div>
                <div className="relative z-10 flex items-center gap-2 px-2 bg-black/40 rounded shadow-md">
                  <div className="w-7 h-7 rounded border border-slate-500" style={{ backgroundImage: "url('/messageContainerBG.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="w-full h-full bg-black/50 flex items-center justify-center text-[10px] font-black text-white">RA</div>
                  </div>
                  <span className="text-white font-black tracking-widest text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">RABIA</span>
                </div>
              </div>
              <div className="h-[130%] w-2.5 bg-gradient-to-b from-slate-800 via-slate-500 to-slate-900 rounded-sm border border-black z-30 shadow-[0_0_10px_rgba(0,0,0,1)]"></div>
              <div className="h-[90%] w-4 bg-gradient-to-b from-slate-300 via-white to-slate-400 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.3)]"></div>
              <div className="h-[80%] flex-1 bg-gradient-to-b from-slate-400 via-white to-slate-200 relative flex items-center justify-end px-3 sm:px-6 md:px-12 z-10 border-b-2 border-white/80 shadow-[0_8px_15px_rgba(0,0,0,0.4)]" style={{ clipPath: 'polygon(0 0, 98.5% 0, 100% 50%, 98.5% 100%, 0 100%)' }}>
                <div className="absolute bottom-0 w-full h-[2px] bg-white opacity-90 shadow-[0_0_8px_#ffffff]"></div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase === 'dock' ? 1 : 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex gap-2.5 sm:gap-6 md:gap-8 lg:gap-12 items-center relative z-20 mr-1 sm:mr-4 overflow-hidden"
                >
                  {['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => (
                    <span key={item} className="relative font-black tracking-[0.15em] uppercase text-xs text-slate-800 py-1">
                      {item}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>

          <style jsx>{`
            /* Hide splash screen completely on mobile devices (phones), keeping it on tablet and desktop */
            @media (max-width: 767px) {
              .splash-screen-desktop-only {
                display: none !important;
              }
            }
            @media (max-height: 500px) and (max-width: 950px) and (pointer: coarse) {
              .splash-screen-desktop-only {
                display: none !important;
              }
            }
            @keyframes rumble {
              0%, 100% { transform: translate(0, 0); }
              50% { transform: translate(-2px, 2px); }
            }
            .animate-rumble { animation: rumble 0.05s linear infinite; }
            @keyframes shake-medium {
              0%, 100% { transform: translate(0, 0); }
              25% { transform: translate(-8px, 6px) rotate(-1deg); }
              50% { transform: translate(8px, -6px) rotate(1deg); }
              75% { transform: translate(-4px, -8px) rotate(-0.5deg); }
            }
            @keyframes shake-heavy {
              0%, 100% { transform: translate(0, 0); }
              20% { transform: translate(-20px, 15px) rotate(-2deg); }
              40% { transform: translate(20px, -15px) rotate(2deg); }
              60% { transform: translate(-15px, -20px) rotate(-1.5deg); }
              80% { transform: translate(15px, 15px) rotate(1.5deg); }
            }
            .animate-shake-medium { animation: shake-medium 0.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
            .animate-shake-heavy { animation: shake-heavy 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
            @keyframes impact-flash {
              0% { opacity: 0.9; }
              100% { opacity: 0; }
            }
            .animate-impact-flash { animation: impact-flash 0.15s ease-out forwards; }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
