import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Detects if the current device/viewport is specifically a mobile phone (not a tablet or desktop).
 * - Mobile phones in portrait: width < 768px (Tailwind 'md' breakpoint starts at 768px for tablets/desktops)
 * - Mobile phones in landscape: short height (< 500px), width <= 950px, and touch/coarse pointer
 * - Mobile phone user agents: matches mobile phones while explicitly excluding tablets/iPads
 *
 * Tablets (e.g. iPad in portrait/landscape, Android tablets) have viewport widths >= 768px in portrait and >= 1024px in landscape.
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Viewport width check: phones in portrait are < 768px; tablets start at 768px (iPad portrait is 768px)
  const isSmallScreen = window.innerWidth < 768;

  // 2. Mobile phone in landscape mode: short height (< 500px) with touch pointer
  // (tablets in landscape have height >= 768px, e.g. iPad 1024x768)
  const isLandscapePhone =
    window.innerHeight < 500 &&
    window.innerWidth <= 950 &&
    window.matchMedia('(pointer: coarse)').matches;

  // 3. User agent check targeting phones (explicitly excluding iPad and tablets)
  const ua = navigator.userAgent || '';
  const isPhoneUA =
    /Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) &&
    !/iPad|Tablet/i.test(ua);
  const isPhysicalPhone =
    isPhoneUA &&
    typeof window.screen !== 'undefined' &&
    Math.min(window.screen.width, window.screen.height) < 768;

  return isSmallScreen || isLandscapePhone || isPhysicalPhone;
}
