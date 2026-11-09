'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, Compass, FileText } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const SumiBackground = dynamic(
  () => import('@/components/three/SumiBackground'),
  { ssr: false }
);

// --- CUSTOM ANIME CIPHER TEXT (Untouched) ---
const CipherGlitchText = ({ words, delay = 3500 }: { words: string[], delay?: number }) => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState(words[0]);

  useEffect(() => {
    let scrambleInterval: ReturnType<typeof setInterval>;

    const timeoutId = setTimeout(() => {
      const nextWord = words[(index + 1) % words.length];
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アイウエオカキクケコサシスセソタチツテト";

      let iterations = 0;
      scrambleInterval = setInterval(() => {
        setDisplayText((prev) =>
          nextWord.split("").map((char, i) => {
            if (char === " ") return " ";
            if (i < iterations) return nextWord[i];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("")
        );

        if (iterations >= nextWord.length) {
          clearInterval(scrambleInterval);
          setIndex((prev) => (prev + 1) % words.length);
        }

        iterations += 1 / 2;
      }, 40);

    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (scrambleInterval) clearInterval(scrambleInterval);
    };
  }, [index, words, delay]);

  return (
    <span className="inline-block min-w-[260px] sm:min-w-[320px] md:min-w-[400px] text-white font-mono tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
      {displayText}
    </span>
  );
};

export default function HeroSection({ animReady = false }: { animReady?: boolean }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handleChange = () => {
      setPrefersReducedMotion(mq.matches);
    };
    mq.addEventListener?.('change', handleChange);
    return () => mq.removeEventListener?.('change', handleChange);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- THE UPGRADE: Awwwards-Style Agency Animations ---
  // This curve creates a very fast start that dramatically slows down at the end
  const premiumEase: [number, number, number, number] = [0.85, 0, 0.15, 1];

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const wordContainerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04, // Fast ripple effect
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: {
      y: "120%",     // Starts pushed way down
      rotateZ: 15,   // Slightly angled
      opacity: 0,
      scale: 0.8
    },
    visible: {
      y: "0%",
      rotateZ: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: premiumEase
      }
    },
  };

  const roleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: [0.19, 1, 0.22, 1] as [number, number, number, number], // Expo ease out
        delay: 0.8
      }
    },
  };

  const paraVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: premiumEase,
        delay: 1.1
      }
    },
  };

  const headingText = "Hi, I'm Rabia Aziz";

  return (
    <section
      id="hero"
      className="relative z-0 isolate min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* 3D Modern Interactive Sumi-e Background */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
        <SumiBackground
          videoSrc="/liveBackground.mp4"
          mouseEnabled={!prefersReducedMotion}
          parallaxSensitivity={1.0}
        />
      </div>

      {/* Retained Filter & Vignette Overlays for Crisp Text Contrast */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/30 to-black/50 pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center" style={{ perspective: '1000px' }}>
        {/* Hero Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={animReady ? 'visible' : 'hidden'}
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.5)]">

              <motion.span
                variants={wordContainerVariants}
                className="inline-flex justify-center flex-wrap gap-x-2 sm:gap-x-3.5 animate-glow-text"
              >
                {headingText.split(' ').map((word, wordIndex) => (
                  <span key={wordIndex} className="inline-flex whitespace-nowrap">
                    {word.split('').map((char, charIndex) => (
                      <span
                        key={charIndex}
                        className="inline-block overflow-hidden pb-1 -mb-1"
                      >
                        <motion.span
                          variants={letterVariants}
                          style={{
                            display: 'inline-block',
                            transformOrigin: 'bottom left'
                          }}
                        >
                          {char}
                        </motion.span>
                      </span>
                    ))}
                  </span>
                ))}
              </motion.span>
              <br />

              <motion.div variants={roleVariants} className="mt-3 sm:mt-4 h-12 sm:h-16 text-lg sm:text-2xl md:text-3xl">
                <span className="inline-block bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] animate-shimmer">
                  <CipherGlitchText
                    words={[
                      'Flutter App Developer',
                      'AI-Powered Apps',
                      'Supabase & Firebase',
                      'UI/UX Enthusiast'
                    ]}
                    delay={2000}
                  />
                </span>
              </motion.div>
            </h1>

            <motion.p
              variants={paraVariants}
              className="text-sm sm:text-lg md:text-xl text-white mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto font-medium px-2 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] [text-shadow:_0_2px_15px_rgb(0_0_0_/_80%),_0_0_30px_rgb(255_255_255_/_20%)]"
            >
              I build AI-powered experiences, scalable Flutter applications, and solid Supabase backends that work across mobile, web, and desktop. From idea to deployment, I make it happen.
            </motion.p>
          </motion.div>


        {/* CTA Buttons - Modern Fluid Neumorphic (Monochrome Theme) */}
        {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={animReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, ease: premiumEase, delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 w-full max-w-xl mx-auto"
          >
            {/* 1. Explore My Journey: Monochrome Obsidian Pill */}
            <div className="relative group/journey cursor-pointer w-full sm:w-auto">
              <button
                type="button"
                onClick={() => scrollToSection('about')}
                className="relative z-10 w-full sm:w-auto min-h-[58px] px-4 py-2 rounded-full flex items-center justify-between gap-3 text-white transition-all duration-300 select-none cursor-pointer border border-white/20 shadow-[0_12px_28px_rgba(0,0,0,0.7),inset_0_1.5px_2px_rgba(255,255,255,0.25),inset_0_-2px_4px_rgba(0,0,0,0.8)] group-hover/journey:scale-[1.03] group-hover/journey:border-white/40 group-hover/journey:shadow-[0_16px_36px_rgba(0,0,0,0.9),0_0_24px_rgba(255,255,255,0.12)] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #18181b 0%, #09090b 55%, #18181b 100%)',
                }}
              >
                {/* Left 3D Tactile Token Pebble */}
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover/journey:scale-110 shadow-[0_3px_8px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.4),inset_0_-1.5px_2px_rgba(0,0,0,0.8)] bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-950 border border-white/20"
                >
                  <Compass className="w-5 h-5 text-zinc-100 transform group-hover/journey:rotate-45 transition-transform duration-500" />
                </span>

                {/* Typography: Explore My Journey */}
                <span className="text-base sm:text-lg flex items-center gap-1.5 px-1.5 whitespace-nowrap">
                  <span className="font-normal text-zinc-400">Explore</span>
                  <span className="font-bold text-white tracking-wide">
                    My Journey
                  </span>
                </span>

                {/* Right Arrow Pod */}
                <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-white/20 bg-white/10 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] group-hover/journey:bg-white/20 transition-all">
                  <ArrowRight className="w-4 h-4 text-zinc-200 group-hover/journey:translate-x-0.5 transition-transform duration-200" />
                </span>
              </button>
            </div>

            {/* 2. View Resume: Monochrome Ceramic Cream / Silver Pill */}
            <div className="relative group/resume cursor-pointer w-full sm:w-auto">
              <a
                href="https://drive.google.com/file/d/1xAb2h17uqQ9PtSzpiO2XRSF1BU8fn-A5/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 w-full sm:w-auto min-h-[58px] px-4 py-2 rounded-full flex items-center justify-between gap-3 text-zinc-900 transition-all duration-300 select-none cursor-pointer border border-white/95 shadow-[0_12px_28px_rgba(0,0,0,0.45),0_2px_6px_rgba(0,0,0,0.25),inset_0_2px_3px_#ffffff,inset_0_-2px_4px_rgba(0,0,0,0.12)] group-hover/resume:scale-[1.03] group-hover/resume:shadow-[0_16px_36px_rgba(0,0,0,0.55),0_0_24px_rgba(255,255,255,0.35)] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f4f4f5 55%, #e4e4e7 100%)',
                }}
              >
                {/* Left 3D Tactile Token Pebble */}
                <span className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover/resume:scale-105 shadow-[0_3px_6px_rgba(0,0,0,0.15),inset_0_1.5px_2px_#ffffff,inset_0_-1.5px_2px_rgba(0,0,0,0.1)] bg-gradient-to-br from-white via-zinc-100 to-zinc-300 border border-white/80">
                  <FileText className="w-5 h-5 text-zinc-900" />
                </span>

                {/* Typography: View Resume */}
                <span className="text-base sm:text-lg flex items-center gap-1.5 px-1.5 whitespace-nowrap">
                  <span className="font-normal text-zinc-600">View</span>
                  <span className="font-bold text-zinc-950 tracking-wide">
                    Resume
                  </span>
                </span>

                {/* Right Arrow Pod */}
                <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-zinc-900/10 bg-zinc-900/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] group-hover/resume:bg-zinc-900/15 transition-all">
                  <ArrowRight className="w-4 h-4 text-zinc-900 group-hover/resume:translate-x-0.5 transition-transform duration-200" />
                </span>
              </a>
            </div>
          </motion.div>

      </div>
    </section>
  );
}
