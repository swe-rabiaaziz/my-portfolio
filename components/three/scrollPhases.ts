export interface CameraState {
  zoom: number;         // 1.0 to 1.25 (cinematic zoom within safe margins)
  panX: number;         // Horizontal focal shift (-0.08 to 0.08)
  panY: number;         // Vertical focal shift (-0.08 to 0.08)
  tiltX: number;        // Perspective keystone X (-0.1 to 0.1)
  tiltY: number;        // Perspective keystone Y (-0.1 to 0.1)
  contrast: number;     // Dynamic tonal grading
  brightness: number;   // Ambient brightness
  lightIntensity: number; // Specular light intensity
}

export interface ScrollKeyframe {
  progress: number;
  camera: CameraState;
}

/**
 * 5 Smooth Cinematic Choreographies Across Website Sections:
 * 1. Hero Stance (0.0): Centered, wide, full composure
 * 2. Blade Focus (0.25): Gentle push-in towards the katana and stance
 * 3. Portrait Focus (0.50): Smooth upward pan to Sasuke's expression and hair
 * 4. Dynamic Stance (0.75): Perspective shift with enhanced specular glint
 * 5. Full Horizon Outro (1.00): Returns smoothly to full framing
 */
export const SCROLL_KEYFRAMES: ScrollKeyframe[] = [
  {
    progress: 0.0,
    camera: {
      zoom: 1.0,
      panX: 0.0,
      panY: 0.0,
      tiltX: 0.0,
      tiltY: 0.0,
      contrast: 1.04,
      brightness: 1.0,
      lightIntensity: 1.0,
    },
  },
  {
    progress: 0.25,
    camera: {
      zoom: 1.16,
      panX: -0.05,
      panY: 0.035,
      tiltX: 0.02,
      tiltY: -0.03,
      contrast: 1.1,
      brightness: 1.02,
      lightIntensity: 1.35,
    },
  },
  {
    progress: 0.50,
    camera: {
      zoom: 1.20,
      panX: 0.04,
      panY: -0.045,
      tiltX: -0.02,
      tiltY: 0.025,
      contrast: 1.14,
      brightness: 0.99,
      lightIntensity: 1.15,
    },
  },
  {
    progress: 0.75,
    camera: {
      zoom: 1.14,
      panX: -0.03,
      panY: -0.02,
      tiltX: 0.015,
      tiltY: -0.015,
      contrast: 1.08,
      brightness: 1.03,
      lightIntensity: 1.2,
    },
  },
  {
    progress: 1.0,
    camera: {
      zoom: 1.0,
      panX: 0.0,
      panY: 0.0,
      tiltX: 0.0,
      tiltY: 0.0,
      contrast: 1.04,
      brightness: 1.0,
      lightIntensity: 1.0,
    },
  },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Computes interpolated cinematic state based on normalized scroll progress (0..1).
 */
export function interpolateScrollState(progress: number): CameraState {
  const p = Math.max(0, Math.min(1, progress));

  let prev = SCROLL_KEYFRAMES[0];
  let next = SCROLL_KEYFRAMES[SCROLL_KEYFRAMES.length - 1];

  for (let i = 0; i < SCROLL_KEYFRAMES.length - 1; i++) {
    if (p >= SCROLL_KEYFRAMES[i].progress && p <= SCROLL_KEYFRAMES[i + 1].progress) {
      prev = SCROLL_KEYFRAMES[i];
      next = SCROLL_KEYFRAMES[i + 1];
      break;
    }
  }

  const span = next.progress - prev.progress;
  const rawT = span <= 0 ? 0 : (p - prev.progress) / span;
  const t = smoothstep(rawT);

  const c1 = prev.camera;
  const c2 = next.camera;

  return {
    zoom: lerp(c1.zoom, c2.zoom, t),
    panX: lerp(c1.panX, c2.panX, t),
    panY: lerp(c1.panY, c2.panY, t),
    tiltX: lerp(c1.tiltX, c2.tiltX, t),
    tiltY: lerp(c1.tiltY, c2.tiltY, t),
    contrast: lerp(c1.contrast, c2.contrast, t),
    brightness: lerp(c1.brightness, c2.brightness, t),
    lightIntensity: lerp(c1.lightIntensity, c2.lightIntensity, t),
  };
}

/**
 * Calculates modern smooth mouse parallax with natural physical falloff.
 */
export function calculateMouseParallax(
  mouseX: number, // -1 to +1
  mouseY: number, // -1 to +1
  maxOffset = 0.03
): { offsetX: number; offsetY: number; tiltX: number; tiltY: number } {
  const clampedX = Math.max(-1, Math.min(1, mouseX));
  const clampedY = Math.max(-1, Math.min(1, mouseY));

  return {
    offsetX: (clampedX * maxOffset) || 0,
    offsetY: (-clampedY * (maxOffset * 0.75)) || 0,
    tiltX: (clampedY * 0.04) || 0,
    tiltY: (-clampedX * 0.05) || 0,
  };
}

/**
 * Calculates current section index (0-based) from progress
 */
export function getSectionIndex(progress: number, totalSections = 5): number {
  const p = Math.max(0, Math.min(0.9999, progress));
  return Math.floor(p * totalSections);
}
