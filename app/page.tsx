'use client';

import { useState, useCallback, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import FloatingElements from '@/components/FloatingElements';
import SharedBackground from '@/components/SharedBackground';
import SocialSidebar from '@/components/sidebar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ContactSection from '@/components/sections/ContactSection';
import SplashScreen from '@/components/SplashScreen';
import AIChatWidget from '@/components/AIChatWidget';
import NarutoCursor from '@/components/CustomCursor';
import BossArrivalShowcase from '@/components/ArrivalShowcase';
import { isMobileDevice } from '@/lib/utils';

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  // Skip splash screen immediately on mobile devices
  useEffect(() => {
    if (isMobileDevice()) {
      setSplashDone(true);
    }
  }, []);

  // Stable callback — splash fires onComplete when sword has docked
  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <>
      {/* Splash renders ON TOP (z-[9999] fixed) and manages its own exit animation.
          The main content renders underneath from the start.
          When the splash fades out, the crow animation is already in flight. */}
      <SplashScreen onComplete={handleSplashComplete} />

      {/* Main page content (always rendered, hidden behind splash until it exits) */}
      <SharedBackground />
      <FloatingElements />
      <Navigation splashDone={splashDone} />
      <SocialSidebar />
      <main>
        <HeroSection animReady={splashDone} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <footer
        className="relative py-12 px-4 text-white text-center overflow-hidden"
        style={{
          backgroundImage: 'url(/messageContainerBG.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-slate-900/80 dark:bg-black/85"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="mb-6">
            <h3 className="text-2xl md:text-3xl font-black mb-2 text-white drop-shadow-lg">
              Thanks for Visiting!
            </h3>
            <p className="text-slate-300 text-base md:text-lg drop-shadow-md">
              Let&apos;s build something amazing together
            </p>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent mb-5"></div>
          <p className="text-slate-400 text-sm drop-shadow-md">
            © 2024 Rabia Aziz. All rights reserved.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-8 left-8 w-24 h-24 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-8 right-8 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        </div>
      </footer>
      {splashDone && <AIChatWidget splashDone={splashDone} />}
      <BossArrivalShowcase />
      <NarutoCursor />
    </>
  );
}
