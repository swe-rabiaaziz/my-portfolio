'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Images,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { RevealContainer, RevealItem } from '@/components/ui/scroll_reveal';

interface SlideItem {
  id: string;
  type: 'showcase' | 'screenshot';
  src: string;
  alt: string;
  badge: string;
  title: string;
  shortLabel: string;
}

function getProjectSlides(project: Project): SlideItem[] {
  const items: SlideItem[] = [];
  if (project.showcase) {
    items.push({
      id: `${project.title}-showcase`,
      type: 'showcase',
      src: project.showcase,
      alt: project.showcaseAlt || `${project.title} feature showcase`,
      badge: 'Feature Showcase',
      title: 'Showcase Overview & Feature Graphic',
      shortLabel: 'Showcase',
    });
  }
  project.screenshots.forEach((shot, index) => {
    items.push({
      id: `${project.title}-shot-${index}`,
      type: 'screenshot',
      src: shot,
      alt: `${project.title} app interface screenshot ${index + 1}`,
      badge: `Screen ${index + 1} of ${project.screenshots.length}`,
      title: `App Screen ${index + 1}`,
      shortLabel: `#${index + 1}`,
    });
  });
  return items;
}

interface Project {
  title: string;
  shortTitle?: string;
  desc: string;
  tags: string[];
  github?: string | null;
  download?: string | null;
  playstore?: string | null;
  initial?: string;
  showcase?: string | null;
  showcaseAlt?: string;
  screenshots: string[];
  comingSoon?: boolean;
}

const projects: Project[] = [
  {
    title: 'CivicCoach — AI US Citizenship 2026',
    shortTitle: 'AI US Citizenship Test',
    desc: 'AI-powered Flutter application for USCIS civics prep featuring oral AI mock interviews, 128 official questions with spaced-repetition, ZIP-based elected officials lookup, and bilingual study modes.',
    tags: [
      'Flutter',
      'AI Voice & STT',
      'Civics Prep',
      'Google Play',
      'Drift / SQLite',
    ],
    github: null,
    download: null,
    playstore:
      'https://play.google.com/store/apps/details?id=com.us.citizenship.test.naturalization.civics.prep&hl=en',
    initial: 'C',
    showcase: '/images/civic_coach_showcase.jpeg',
    showcaseAlt: 'CivicCoach — AI US Citizenship Test 2026 showcase',
    screenshots: [
      '/images/civic_coach_screenshots/image.png',
      '/images/civic_coach_screenshots/image2.png',
      '/images/civic_coach_screenshots/image3.png',
      '/images/civic_coach_screenshots/image4.png',
      '/images/civic_coach_screenshots/image5.png',
      '/images/civic_coach_screenshots/image6.png',
    ],
  },
  {
    title: 'Ethiopian Calendar — Zemen App',
    shortTitle: 'Zemen App',
    desc: 'Feature-rich Ethiopian calendar & date converter with 13-month Geez navigation, live 12-hour sunrise Ethiopian clock, Orthodox Tewahedo fasting & saints, Islamic prayer times, and holiday countdowns.',
    tags: [
      'Flutter',
      'Calendar & Tools',
      'Date Converter',
      'Google Play',
      'Orthodox & Fasts',
    ],
    github: null,
    download: null,
    playstore:
      'https://play.google.com/store/apps/details?id=com.ethiopia.zemen.calendar.aqotater.ethiopian.habesha&hl=en',
    initial: 'Z',
    showcase: '/images/zemen_showcase.png',
    showcaseAlt: 'Ethiopian Calendar — Zemen App showcase',
    screenshots: [
      '/images/zemen_screenshots/image.png',
      '/images/zemen_screenshots/image2.png',
      '/images/zemen_screenshots/image3.png',
      '/images/zemen_screenshots/image4.png',
      '/images/zemen_screenshots/image5.png',
      '/images/zemen_screenshots/image6.png',
      '/images/zemen_screenshots/image7.png',
      '/images/zemen_screenshots/image8.png',
    ],
  },
  {
    title: 'ZenPeace — Pomodoro & Mindful Flow',
    shortTitle: 'ZenPeace',
    desc: 'A minimalist Pomodoro companion built with Flutter and Provider. Offers customizable focus intervals, ambient soundscapes (piano, lofi, ocean), session analytics with fl_chart, and haptic feedback.',
    tags: [
      'Flutter',
      'Provider',
      'Pomodoro & Focus',
      'Google Play',
      'Audio & Charts',
    ],
    github: null,
    download: null,
    playstore:
      'https://play.google.com/store/apps/details?id=com.zenpeace.pomodoro.focus.timer.mindfulstate&hl=en',
    initial: 'Z',
    showcase: '/images/zenpeace_showcase.png',
    showcaseAlt: 'ZenPeace — Pomodoro Focus & Mindful Flow showcase',
    screenshots: [
      '/images/zenpeace_screenshots/image.png',
      '/images/zenpeace_screenshots/image2.png',
      '/images/zenpeace_screenshots/image3.png',
      '/images/zenpeace_screenshots/image4.png',
      '/images/zenpeace_screenshots/image5.png',
      '/images/zenpeace_screenshots/image6.png',
    ],
  },
  {
    title: 'Health Tracker — Vitals & BP Monitor',
    shortTitle: 'Health Tracker',
    desc: 'A personal health companion to record and monitor blood pressure, pulse rate, temperature, and blood glucose with weekly summaries and visual trend charts.',
    tags: [
      'Flutter',
      'Health & Vitals',
      'Provider',
      'Charts',
      'Google Play',
    ],
    github: null,
    download: null,
    playstore:
      'https://play.google.com/store/apps/details?id=com.vitals.bp.family.health.tracker&hl=en',
    initial: 'H',
    showcase: '/images/health_trackor showcase.jpg',
    showcaseAlt: 'Health Tracker showcase',
    screenshots: [
      '/images/health_tracker_screenshots/image.png',
      '/images/health_tracker_screenshots/image2.png',
      '/images/health_tracker_screenshots/image3.png',
      '/images/health_tracker_screenshots/image4.png',
      '/images/health_tracker_screenshots/image5.png',
      '/images/health_tracker_screenshots/image6.png',
      '/images/health_tracker_screenshots/image7.png',
    ],
  },
];

export default function ProjectsSection() {
  // Unified Showcase & App Screenshots Modal State
  const [activeModal, setActiveModal] = useState<{
    project: Project;
    currentIndex: number;
    direction: number;
  } | null>(null);

  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation listener (Escape to close, Left/Right arrow keys for slide navigation)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!activeModal) return;

      if (e.key === 'Escape') {
        setActiveModal(null);
      } else if (e.key === 'ArrowLeft') {
        const slides = getProjectSlides(activeModal.project);
        setActiveModal((prev) =>
          prev
            ? {
              ...prev,
              currentIndex: (prev.currentIndex - 1 + slides.length) % slides.length,
              direction: -1,
            }
            : null
        );
      } else if (e.key === 'ArrowRight') {
        const slides = getProjectSlides(activeModal.project);
        setActiveModal((prev) =>
          prev
            ? {
              ...prev,
              currentIndex: (prev.currentIndex + 1) % slides.length,
              direction: 1,
            }
            : null
        );
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeModal) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [activeModal]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (activeModal && thumbnailContainerRef.current) {
      const activeThumb = thumbnailContainerRef.current.querySelector(
        `[data-thumb-index="${activeModal.currentIndex}"]`
      ) as HTMLElement | null;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeModal]);

  return (
    <section id="projects" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <RevealContainer>
          {/* Header */}
          <RevealItem className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display mb-3 text-center tracking-tight">
              Featured{' '}
              <span
                className="neu-header-badge rounded-2xl px-4 sm:px-5 py-1.5 inline-block group cursor-pointer translate-y-1 sm:translate-y-2"
                style={{
                  backgroundImage: "url('/messageContainerBG.jpeg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-br from-black/60 via-slate-900/50 to-black/60 rounded-2xl" />
                <span className="absolute inset-0 rounded-2xl border border-white/30 group-hover:border-white/50 transition-all duration-500 shadow-[inset_0_0_15px_rgba(255,255,255,0.15)]" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full animate-pulse-glow" />
                <span className="absolute bottom-2 left-2 w-2 h-2 bg-white/60 rounded-full animate-pulse-glow-delayed" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 blur-3xl rounded-full animate-pulse-glow" />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl" />
                <span className="relative z-10 inline-block transform group-hover:scale-105 transition-transform duration-300">
                  <span
                    className="relative text-white font-black select-none"
                    style={{
                      textShadow:
                        '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.3)',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                    }}
                  >
                    Projects
                  </span>
                </span>
              </span>
            </h2>

            <div className="relative w-24 sm:w-32 h-[3px] bg-slate-800 dark:bg-slate-200 mx-auto overflow-hidden rounded-full mt-2 mb-3 sm:mb-4">
              <div className="absolute inset-0 bg-white w-full h-full -translate-x-full animate-sword-draw" />
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base max-w-xl mx-auto leading-relaxed px-2 font-medium">
              Production Flutter applications built with clean architecture, modern state management, and fluid UI.
            </p>
          </RevealItem>

          {/* Featured Projects Grid: 1 col on mobile, 2 on tablet & desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7 items-stretch">
            {projects.map((project, index) => (
              <RevealItem
                key={project.title}
                direction={index % 2 === 0 ? 'left' : 'right'}
                className="h-full"
              >
                <div className="neu-flat-interactive group relative flex flex-col justify-between h-full rounded-2xl sm:rounded-3xl p-5 border border-white/70 dark:border-white/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {/* Ambient Shuriken watermark on hover */}
                  <div className="absolute -right-6 -top-6 w-24 h-24 text-slate-400/20 dark:text-slate-600/15 opacity-0 group-hover:opacity-100 group-hover:animate-spin-slow pointer-events-none transition-opacity duration-500">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 14.5L0 12L9.5 9.5L12 0ZM12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12Z" />
                    </svg>
                  </div>

                  {/* Shimmer sweep on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none rounded-2xl sm:rounded-3xl" />

                  <div className="relative z-10 flex flex-col flex-1">
                    {/* Top Meta: Index & Live Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                          Project {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {project.playstore && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Live App
                        </span>
                      )}
                    </div>

                    {/* Seamless Blended Showcase Image: Click to preview main showcase */}
                    {project.showcase && (
                      <div
                        className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-4 group/img cursor-pointer border border-white/50 dark:border-white/10 shadow-sm"
                        onClick={() =>
                          setActiveModal({
                            project,
                            currentIndex: 0,
                            direction: 0,
                          })
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveModal({
                              project,
                              currentIndex: 0,
                              direction: 0,
                            });
                          }
                        }}
                        aria-label={`View showcase and screenshots for ${project.title}`}
                      >
                        {/* Soft ambient color bleeding from the graphic into the card surface */}
                        <div className="absolute -inset-1 blur-md opacity-35 dark:opacity-25 pointer-events-none">
                          <img
                            src={project.showcase}
                            alt=""
                            className="w-full h-full object-cover"
                            aria-hidden="true"
                          />
                        </div>

                        {/* Edge-to-edge blended showcase image */}
                        <img
                          src={project.showcase}
                          alt={project.showcaseAlt || project.title}
                          className="relative z-10 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                          loading="lazy"
                        />

                        {/* Subtle gradient vignette to blend the image organically into the card */}
                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/35 via-transparent to-black/10 pointer-events-none" />

                        {/* Soft glass reflection on the top edge */}
                        <div className="absolute inset-x-0 top-0 h-1/4 z-20 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                        {/* Hover Overlay Hint */}
                        <div className="absolute inset-0 z-30 bg-black/45 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
                          <span className="neu-button px-3 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5 shadow-lg bg-black/60 border border-white/20">
                            <Maximize2 className="w-3 h-3" />
                            Expand View
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Project Title */}
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 mb-1.5 line-clamp-1" title={project.title}>
                      {project.shortTitle || project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-3.5">
                      {project.desc}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-auto mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="neu-pill rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300 cursor-default hover:scale-105 transition-transform"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="neu-pill rounded-full px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Row: Play Store & Screenshots Button with Equal Size & Dimensions */}
                  <div className="relative z-10 pt-3.5 border-t border-slate-200/60 dark:border-slate-800/80 grid grid-cols-2 gap-2.5 items-center">
                    {/* Google Play Button with Circulating Lightning Glow */}
                    {project.playstore ? (
                      <div className="relative flex h-10 w-full items-center justify-center overflow-hidden rounded-xl p-[1.5px] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_14px_rgba(0,230,118,0.25)] group/play">
                        {/* Circulating Conic Lightning Beam (Google Play Palette) */}
                        <div className="absolute -inset-[150%] animate-spin-beam bg-[conic-gradient(from_0deg,transparent_0_290deg,#00E676_335deg,#00D2FF_360deg)] pointer-events-none" />
                        <div className="absolute -inset-[150%] animate-spin-beam blur-[6px] opacity-75 bg-[conic-gradient(from_0deg,transparent_0_290deg,#00E676_335deg,#00D2FF_360deg)] pointer-events-none" />

                        {/* Button Inner Body */}
                        <a
                          href={project.playstore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative z-10 flex h-full w-full items-center justify-center gap-1.5 rounded-[10px] bg-slate-950/95 dark:bg-[#070b14] px-2.5 text-white transition-colors group-hover/play:bg-slate-900"
                        >
                          <svg
                            className="h-4 w-4 flex-shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M3.609 1.814 13.793 12 3.61 22.186A2.372 2.372 0 0 1 3 20.505V3.495c0-.65.231-1.246.609-1.681Z"
                              fill="#00D2FF"
                            />
                            <path
                              d="M3.609 1.814c.328-.377.818-.614 1.391-.614.502 0 .973.184 1.385.42l10.843 6.195-3.435 3.435L3.609 1.814Z"
                              fill="#00E676"
                            />
                            <path
                              d="m17.228 8.565-3.435 3.435 3.435 3.435 3.864-2.208c1.1-.628 1.1-1.826 0-2.454l-3.864-2.208Z"
                              fill="#FFD200"
                            />
                            <path
                              d="m13.793 12 3.435 3.435-10.843 6.195c-.412.236-.883.42-1.385.42-.573 0-1.063-.237-1.391-.614L13.793 12Z"
                              fill="#FF3A44"
                            />
                          </svg>
                          <span className="text-xs font-bold tracking-wide truncate">
                            Google Play
                          </span>
                          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400 group-hover/play:translate-x-0.5 group-hover/play:-translate-y-0.5 transition-transform flex-shrink-0" />
                        </a>
                      </div>
                    ) : (
                      <div className="h-10 w-full" />
                    )}

                    {/* Showcase / Screenshots Gallery Button: Opens ALL app screenshots */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModal({
                          project,
                          currentIndex: project.showcase ? 1 : 0,
                          direction: 0,
                        })
                      }
                      className="neu-button group/showcase relative flex h-10 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-bold tracking-wide text-slate-800 dark:text-slate-200 transition-all hover:scale-[1.02] active:scale-95 border border-white/60 dark:border-white/10"
                      aria-label={`View screenshots for ${project.title}`}
                    >
                      <Images className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 group-hover/showcase:scale-110 transition-transform flex-shrink-0" />
                      <span className="truncate">Screenshots</span>
                    </button>
                  </div>
                </div>
              </RevealItem>
            ))}
          </div>
        </RevealContainer>
      </div>

      {/* UNIFIED ULTRA-PREMIUM APP SHOWCASE & SCREENSHOTS MODAL */}
      <AnimatePresence>
        {activeModal && (() => {
          const slides = getProjectSlides(activeModal.project);
          const currentSlide = slides[activeModal.currentIndex] || slides[0];
          const isShowcase = currentSlide?.type === 'showcase';
          const screenshotCount = activeModal.project.screenshots.length;

          const handleNext = () => {
            setActiveModal((prev) =>
              prev
                ? {
                  ...prev,
                  currentIndex: (prev.currentIndex + 1) % slides.length,
                  direction: 1,
                }
                : null
            );
          };

          const handlePrev = () => {
            setActiveModal((prev) =>
              prev
                ? {
                  ...prev,
                  currentIndex: (prev.currentIndex - 1 + slides.length) % slides.length,
                  direction: -1,
                }
                : null
            );
          };

          const handleSelectSlide = (idx: number) => {
            if (idx === activeModal.currentIndex) return;
            const dir = idx > activeModal.currentIndex ? 1 : -1;
            setActiveModal((prev) =>
              prev ? { ...prev, currentIndex: idx, direction: dir } : null
            );
          };

          return (
            <motion.div
              key="app-showcase-backdrop"
              className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
            >
              <motion.div
                key="app-showcase-dialog"
                className={`relative w-full ${isShowcase ? 'max-w-2xl sm:max-w-3xl' : 'max-w-[380px] sm:max-w-[420px]'
                  } h-[92vh] max-h-[920px] rounded-3xl p-3 sm:p-4 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out`}
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Row */}
                <div className="flex-shrink-0 flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/80 dark:border-white/10">
                  {/* Project identity */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black text-xs flex items-center justify-center shadow-md flex-shrink-0">
                      {activeModal.project.initial || activeModal.project.title.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 truncate max-w-[100px] sm:max-w-[130px]">
                        {activeModal.project.shortTitle || activeModal.project.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                        {isShowcase
                          ? 'Feature Showcase'
                          : `Screen ${activeModal.currentIndex} of ${screenshotCount}`}
                      </p>
                    </div>
                  </div>

                  {/* Center Segmented View Switcher (Showcase vs Screenshots) - Monochrome Theme */}
                  <div className="flex items-center p-0.5 rounded-xl bg-slate-200/70 dark:bg-slate-800 border border-slate-300/60 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => handleSelectSlide(0)}
                      className={`px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all flex items-center gap-1 ${isShowcase
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                          : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                        }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Showcase</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectSlide(
                          activeModal.currentIndex === 0 ? 1 : activeModal.currentIndex
                        )
                      }
                      className={`px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all flex items-center gap-1 ${!isShowcase
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                          : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                        }`}
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>Screens ({screenshotCount})</span>
                    </button>
                  </div>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full neu-button flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex-shrink-0"
                    aria-label="Close modal"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Presentation Stage Canvas - Maximized height, zero clipping */}
                <div className="relative flex-1 min-h-0 my-2 rounded-2xl bg-slate-100/70 dark:bg-slate-950/40 border border-slate-200/70 dark:border-white/5 shadow-inner overflow-hidden flex items-center justify-center p-1 sm:p-2">
                  {/* Previous Arrow Button */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-1.5 sm:left-2 z-20 w-8 h-8 rounded-full neu-button flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition-all shadow-md"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Next Arrow Button */}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-1.5 sm:right-2 z-20 w-8 h-8 rounded-full neu-button flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition-all shadow-md"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Media Display Stage */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <AnimatePresence mode="wait" custom={activeModal.direction}>
                      {isShowcase ? (
                        /* 16:9 Showcase Banner */
                        <motion.div
                          key={currentSlide.id}
                          custom={activeModal.direction}
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="relative max-h-full max-w-full flex items-center justify-center"
                        >
                          <div className="relative max-h-full rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-lg group">
                            <img
                              src={currentSlide.src}
                              alt={currentSlide.alt}
                              className="max-h-[66vh] sm:max-h-[72vh] w-auto max-w-full object-contain select-none rounded-2xl"
                            />
                            <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/85 dark:bg-black/85 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white flex items-center gap-1 shadow-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                              <span>Showcase Banner</span>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        /* 9:16 Mobile App Screenshot - 100% visible, fully expanded height, completely unclipped! */
                        <motion.div
                          key={currentSlide.id}
                          custom={activeModal.direction}
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="relative h-full max-h-full flex items-center justify-center"
                        >
                          {/* Floating Mobile Card with Clean Elevation */}
                          <div className="relative h-full max-h-full rounded-2xl overflow-hidden border border-slate-200/90 dark:border-white/15 shadow-2xl shadow-slate-900/15 dark:shadow-black/60 flex items-center justify-center group">
                            <img
                              src={currentSlide.src}
                              alt={currentSlide.alt}
                              className="h-full max-h-[66vh] sm:max-h-[72vh] w-auto max-w-full object-contain select-none"
                            />
                            {/* Screen badge */}
                            <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-slate-900/85 dark:bg-black/85 backdrop-blur-md border border-white/20 text-[10px] font-black tracking-wider text-white shadow-sm">
                              {activeModal.currentIndex} / {screenshotCount}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Single Merged Bottom Row: Screen Counter, Thumbnails Collection, and Play Store Button */}
                <div className="flex-shrink-0 pt-2 flex items-center justify-between gap-1.5 sm:gap-2 border-t border-slate-200/80 dark:border-white/10 mt-auto">
                  {/* Left: App Screen text */}
                  <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-bold flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                    <span className="truncate">
                      {isShowcase ? 'Showcase' : `Screen ${activeModal.currentIndex}`}
                    </span>
                  </div>

                  {/* Center: The Whole Images Line (Thumbnails Collection) */}
                  <div
                    ref={thumbnailContainerRef}
                    className="flex items-center justify-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5 mx-auto"
                  >
                    {slides.map((slide, idx) => {
                      const isActive = activeModal.currentIndex === idx;
                      const isThumbShowcase = slide.type === 'showcase';

                      return (
                        <button
                          key={slide.id}
                          data-thumb-index={idx}
                          type="button"
                          onClick={() => handleSelectSlide(idx)}
                          className={`relative rounded-md overflow-hidden border transition-all flex-shrink-0 group ${isThumbShowcase
                              ? 'h-8 w-11 sm:h-9 sm:w-13'
                              : 'h-8 w-5 sm:h-9 sm:w-6'
                            } ${isActive
                              ? 'border-slate-900 dark:border-white scale-105 shadow-sm ring-1 ring-slate-900/30 dark:ring-white/40 opacity-100 z-10'
                              : 'border-slate-300 dark:border-white/15 opacity-55 hover:opacity-100 hover:border-slate-400 dark:hover:border-white/40'
                            }`}
                          aria-label={`Jump to ${slide.title}`}
                        >
                          <img
                            src={slide.src}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          {/* Badge */}
                          <div
                            className={`absolute inset-x-0 bottom-0 py-[1px] text-center text-[6px] sm:text-[7px] font-black tracking-tight leading-none ${isActive
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black'
                                : 'bg-black/60 text-white group-hover:bg-black/80'
                              }`}
                          >
                            {isThumbShowcase ? 'SHOW' : `#${idx}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right: Google Play Button */}
                  {activeModal.project.playstore && (
                    <a
                      href={activeModal.project.playstore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-button group/play inline-flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-100 hover:scale-[1.02] active:scale-95 transition-all shadow-sm flex-shrink-0 border border-slate-300/80 dark:border-white/10"
                      aria-label="View on Google Play"
                    >
                      {/* Official Google Play Icon */}
                      <svg
                        className="h-3 w-3 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3.609 1.814 13.793 12 3.61 22.186A2.372 2.372 0 0 1 3 20.505V3.495c0-.65.231-1.246.609-1.681Z"
                          fill="#00D2FF"
                        />
                        <path
                          d="M3.609 1.814c.328-.377.818-.614 1.391-.614.502 0 .973.184 1.385.42l10.843 6.195-3.435 3.435L3.609 1.814Z"
                          fill="#00E676"
                        />
                        <path
                          d="m17.228 8.565-3.435 3.435 3.435 3.435 3.864-2.208c1.1-.628 1.1-1.826 0-2.454l-3.864-2.208Z"
                          fill="#FFD200"
                        />
                        <path
                          d="m13.793 12 3.435 3.435-10.843 6.195c-.412.236-.883.42-1.385.42-.573 0-1.063-.237-1.391-.614L13.793 12Z"
                          fill="#FF3A44"
                        />
                      </svg>
                      <span className="hidden sm:inline">Google Play</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-500 dark:text-slate-400 group-hover/play:translate-x-0.5 group-hover/play:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <style jsx>{`
        /* Circulating lighting beam around play store button */
        @keyframes spin-beam {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-beam {
          animation: spin-beam 3.2s linear infinite;
        }

        /* Sword draw animation for the header */
        @keyframes sword-draw {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-sword-draw {
          animation: sword-draw 2.5s ease-in-out infinite;
        }

        /* Ambient shuriken slow spin on hover */
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        /* Pulse glow header animations */
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        @keyframes pulse-glow-delayed {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-pulse-glow-delayed {
          animation: pulse-glow-delayed 2s ease-in-out infinite 1s;
        }

        /* Hide scrollbars across all browsers for clean gallery carousel */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
