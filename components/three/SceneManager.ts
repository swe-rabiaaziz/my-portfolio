import * as THREE from 'three';
import { createModernBackgroundShaderMaterial } from './materials';
import {
  interpolateScrollState,
  calculateMouseParallax,
} from './scrollPhases';

export interface SceneManagerOptions {
  container: HTMLDivElement;
  videoSrc?: string;
  onReady?: () => void;
}

export class SceneManager {
  private container: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private clock: THREE.Clock;
  private frameId = 0;
  private isDisposed = false;
  private resizeObserver: ResizeObserver | null = null;

  // Visual Assets
  private videoElement: HTMLVideoElement | null = null;
  private videoTexture: THREE.VideoTexture | null = null;
  private backgroundMesh: THREE.Mesh | null = null;
  private backgroundMaterial: THREE.ShaderMaterial | null = null;

  // Dynamic Interaction State
  private targetScrollProgress = 0.0;
  private currentScrollProgress = 0.0;
  private mousePos = { x: 0.5, y: 0.5 }; // 0..1 in screen space
  private smoothMouse = { x: 0.5, y: 0.5 };
  private lastMouse = { x: 0.5, y: 0.5 };
  private mouseVelocity = 0.0;
  private smoothVelocity = 0.0;
  private mouseInteractionEnabled = true;
  private parallaxSensitivity = 1.0;

  constructor(options: SceneManagerOptions) {
    this.container = options.container;

    // 1. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
      stencil: false,
      depth: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.setPixelRatio(
      typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1
    );

    const initW = this.container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1280);
    const initH = this.container.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 720);
    this.renderer.setSize(initW, initH);

    // Style canvas to cover container perfectly
    const dom = this.renderer.domElement;
    dom.style.position = 'absolute';
    dom.style.top = '0';
    dom.style.left = '0';
    dom.style.width = '100%';
    dom.style.height = '100%';
    dom.style.objectFit = 'cover';
    dom.style.pointerEvents = 'none';

    this.container.appendChild(dom);

    // 2. Scene & Full-Screen Orthographic Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 3. Setup Video & Shader Quad
    const videoSrc = options.videoSrc || '/liveBackground.mp4';
    this.setupVideoQuad(videoSrc);

    // 4. Timing & Animation Loop
    this.clock = new THREE.Clock();
    this.bindEvents();
    this.startLoop();

    if (options.onReady) {
      options.onReady();
    }
  }

  private setupVideoQuad(src: string) {
    const video = document.createElement('video');
    
    // Critical: Set attributes BEFORE source to ensure browser autoplay compliance
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.loop = true;
    video.autoplay = true;
    video.preload = 'auto';

    // Only set crossOrigin if loading from an external domain
    if (src.startsWith('http://') || src.startsWith('https://')) {
      video.crossOrigin = 'anonymous';
    }

    video.src = src;

    // Listen for video dimensions
    video.addEventListener('loadedmetadata', () => {
      if (this.backgroundMaterial && video.videoWidth && video.videoHeight) {
        this.backgroundMaterial.uniforms.uImageResolution.value.set(
          video.videoWidth,
          video.videoHeight
        );
      }
    });

    // Gracefully handle browser autoplay policies
    const attemptPlay = () => {
      video.play().catch(() => {
        const resumeOnInteraction = () => {
          video.play().catch(() => {});
          window.removeEventListener('click', resumeOnInteraction);
          window.removeEventListener('scroll', resumeOnInteraction);
          window.removeEventListener('touchstart', resumeOnInteraction);
        };
        window.addEventListener('click', resumeOnInteraction, { once: true, passive: true });
        window.addEventListener('scroll', resumeOnInteraction, { once: true, passive: true });
        window.addEventListener('touchstart', resumeOnInteraction, { once: true, passive: true });
      });
    };

    video.load();
    attemptPlay();

    this.videoElement = video;
    this.videoTexture = new THREE.VideoTexture(video);
    this.videoTexture.colorSpace = THREE.SRGBColorSpace;
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;
    this.videoTexture.format = THREE.RGBAFormat;
    this.videoTexture.generateMipmaps = false;

    // Full-screen quad geometry
    const quadGeo = new THREE.PlaneGeometry(2, 2);
    this.backgroundMaterial = createModernBackgroundShaderMaterial(this.videoTexture);

    this.backgroundMesh = new THREE.Mesh(quadGeo, this.backgroundMaterial);
    this.scene.add(this.backgroundMesh);
  }

  private handleResize = () => {
    if (this.isDisposed || !this.container) return;
    const width = this.container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1280);
    const height = this.container.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 720);
    if (width === 0 || height === 0) return;

    this.renderer.setSize(width, height);
    if (this.backgroundMaterial) {
      this.backgroundMaterial.uniforms.uResolution.value.set(width, height);
    }
  };

  private bindEvents() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize);
    }

    if (typeof ResizeObserver !== 'undefined' && this.container) {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this.container);
    }
  }

  private startLoop() {
    const tick = () => {
      if (this.isDisposed) return;

      const delta = Math.min(this.clock.getDelta(), 0.1);
      const elapsed = this.clock.getElapsedTime();

      // Ensure video texture updates every frame when video is ready
      if (this.videoElement && this.videoElement.readyState >= 2 && this.videoTexture) {
        this.videoTexture.needsUpdate = true;
      }

      // 1. Exponential Damping for Smooth Scroll Transitions
      this.currentScrollProgress = THREE.MathUtils.damp(
        this.currentScrollProgress,
        this.targetScrollProgress,
        5.5,
        delta
      );

      // 2. Exponential Damping for Mouse Motion
      this.smoothMouse.x = THREE.MathUtils.damp(
        this.smoothMouse.x,
        this.mousePos.x,
        8.0,
        delta
      );
      this.smoothMouse.y = THREE.MathUtils.damp(
        this.smoothMouse.y,
        this.mousePos.y,
        8.0,
        delta
      );

      // 3. Mouse Velocity Calculation for Interactive Fluid Wake
      const dx = this.mousePos.x - this.lastMouse.x;
      const dy = this.mousePos.y - this.lastMouse.y;
      const instantVelocity = Math.sqrt(dx * dx + dy * dy) / Math.max(0.001, delta);
      this.lastMouse.x = this.mousePos.x;
      this.lastMouse.y = this.mousePos.y;

      this.mouseVelocity = THREE.MathUtils.damp(
        this.mouseVelocity,
        instantVelocity,
        6.0,
        delta
      );
      this.smoothVelocity = THREE.MathUtils.damp(
        this.smoothVelocity,
        this.mouseVelocity,
        3.0,
        delta
      );

      // Video playback rate remains steady at normal speed
      if (this.videoElement && !this.videoElement.paused) {
        this.videoElement.playbackRate = 1.0;
      }

      // 4. Interpolate Cinematic Camera State Across Sections
      const camState = interpolateScrollState(this.currentScrollProgress);
      const mouseParallax = this.mouseInteractionEnabled
        ? calculateMouseParallax(
            (this.smoothMouse.x - 0.5) * 2.0,
            (this.smoothMouse.y - 0.5) * 2.0,
            0.045 * this.parallaxSensitivity
          )
        : { offsetX: 0, offsetY: 0, tiltX: 0, tiltY: 0 };

      // 5. Update Shader Uniforms
      if (this.backgroundMaterial) {
        const uniforms = this.backgroundMaterial.uniforms;
        uniforms.uTime.value = elapsed;
        uniforms.uScrollProgress.value = this.currentScrollProgress;

        // Mouse tracking
        uniforms.uMouse.value.set(this.mousePos.x, 1.0 - this.mousePos.y);
        uniforms.uMouseSmooth.value.set(this.smoothMouse.x, 1.0 - this.smoothMouse.y);
        uniforms.uMouseVelocity.value = this.mouseInteractionEnabled ? Math.min(1.5, this.smoothVelocity) : 0.0;
        uniforms.uParallaxStrength.value = this.mouseInteractionEnabled ? 0.045 * this.parallaxSensitivity : 0.0;

        // Camera Choreography
        uniforms.uZoom.value = THREE.MathUtils.damp(uniforms.uZoom.value, camState.zoom, 5.0, delta);
        uniforms.uPan.value.x = THREE.MathUtils.damp(
          uniforms.uPan.value.x,
          camState.panX + mouseParallax.offsetX,
          5.0,
          delta
        );
        uniforms.uPan.value.y = THREE.MathUtils.damp(
          uniforms.uPan.value.y,
          camState.panY + mouseParallax.offsetY,
          5.0,
          delta
        );

        // 3D Tilt perspective (Vector2 for UV keystone warp)
        uniforms.uTilt.value.set(
          camState.tiltX + mouseParallax.tiltX,
          camState.tiltY + mouseParallax.tiltY
        );

        // Dynamic Grading & Lighting
        uniforms.uContrast.value = THREE.MathUtils.damp(uniforms.uContrast.value, camState.contrast, 4.0, delta);
        uniforms.uBrightness.value = THREE.MathUtils.damp(uniforms.uBrightness.value, camState.brightness, 4.0, delta);
        uniforms.uLightIntensity.value = THREE.MathUtils.damp(uniforms.uLightIntensity.value, camState.lightIntensity, 4.0, delta);
      }

      // 6. Render
      this.renderer.render(this.scene, this.camera);
      this.frameId = requestAnimationFrame(tick);
    };

    this.frameId = requestAnimationFrame(tick);
  }

  // Public Interaction APIs
  public setScrollProgress(progress: number) {
    this.targetScrollProgress = Math.max(0, Math.min(1, progress));
  }

  public setMouseScreenPos(normX: number, normY: number) {
    this.mousePos.x = normX;
    this.mousePos.y = normY;
  }

  public setMouseInteraction(enabled: boolean) {
    this.mouseInteractionEnabled = enabled;
  }

  public setParallaxSensitivity(val: number) {
    this.parallaxSensitivity = val;
  }

  public getScrollProgress(): number {
    return this.currentScrollProgress;
  }

  public dispose() {
    this.isDisposed = true;
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    cancelAnimationFrame(this.frameId);

    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.removeAttribute('src');
      this.videoElement.load();
      this.videoElement = null;
    }

    if (this.videoTexture) {
      this.videoTexture.dispose();
      this.videoTexture = null;
    }

    if (this.backgroundMesh) {
      this.backgroundMesh.geometry.dispose();
      if (this.backgroundMaterial) {
        this.backgroundMaterial.dispose();
      }
    }

    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
