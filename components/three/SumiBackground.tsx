'use client';

import React, { useEffect, useRef } from 'react';
import { SceneManager } from './SceneManager';

export interface SumiBackgroundProps {
  scrollProgress?: number;
  mouseEnabled?: boolean;
  parallaxSensitivity?: number;
  videoSrc?: string;
  className?: string;
  onReady?: () => void;
}

export const SumiBackground: React.FC<SumiBackgroundProps> = ({
  scrollProgress,
  mouseEnabled = true,
  parallaxSensitivity = 1.0,
  videoSrc = '/liveBackground.mp4',
  className = '',
  onReady,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<SceneManager | null>(null);

  // Initialize SceneManager once on mount
  useEffect(() => {
    if (!mountRef.current) return;

    const manager = new SceneManager({
      container: mountRef.current,
      videoSrc,
      onReady,
    });
    managerRef.current = manager;

    // Track pointer movement in normalized 0..1 screen space
    const handlePointerMove = (e: PointerEvent) => {
      if (!managerRef.current) return;
      const x = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
      const y = Math.max(0, Math.min(1, e.clientY / window.innerHeight));
      managerRef.current.setMouseScreenPos(x, y);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (managerRef.current) {
        managerRef.current.dispose();
        managerRef.current = null;
      }
    };
  }, [videoSrc, onReady]);

  // Imperatively update properties to prevent canvas teardown
  useEffect(() => {
    if (managerRef.current && scrollProgress !== undefined) {
      managerRef.current.setScrollProgress(scrollProgress);
    }
  }, [scrollProgress]);

  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.setMouseInteraction(mouseEnabled);
    }
  }, [mouseEnabled]);

  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.setParallaxSensitivity(parallaxSensitivity);
    }
  }, [parallaxSensitivity]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none bg-[#0c0f14] ${className}`}
      aria-hidden="true"
    />
  );
};

export default SumiBackground;
