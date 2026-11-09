import * as THREE from 'three';

/**
 * Creates the Modern 3D Interactive Background Shader.
 * 
 * Guarantees 100% full-screen coverage across all viewport aspect ratios.
 * 
 * Features:
 * 1. Responsive 'cover' scaling (never distorts, never cuts off with black borders).
 * 2. 2.5D Analytical Depth Parallax (foreground Sasuke & katana subtly shift relative to the moon).
 * 3. Interactive Cursor Lighting (specular sheen on sword blade and hair highlights).
 * 4. Interactive Mouse Velocity Ripple (delicate fluid ink wake).
 * 5. Scroll-driven cinematic camera zoom, focal pan, and contrast grading.
 */
export function createModernBackgroundShaderMaterial(videoTexture: THREE.VideoTexture): THREE.ShaderMaterial {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const height = typeof window !== 'undefined' ? window.innerHeight : 720;

  return new THREE.ShaderMaterial({
    uniforms: {
      tVideo: { value: videoTexture },
      uResolution: { value: new THREE.Vector2(width, height) },
      uImageResolution: { value: new THREE.Vector2(1280, 720) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseSmooth: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseVelocity: { value: 0.0 },
      uParallaxStrength: { value: 0.035 },
      uZoom: { value: 1.0 },
      uPan: { value: new THREE.Vector2(0.0, 0.0) },
      uTilt: { value: new THREE.Vector2(0.0, 0.0) },
      uContrast: { value: 1.04 },
      uBrightness: { value: 1.0 },
      uLightIntensity: { value: 1.0 },
      uScrollProgress: { value: 0.0 },
      uTime: { value: 0.0 },
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        // Full screen quad in NDC coordinates
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tVideo;
      uniform vec2 uResolution;
      uniform vec2 uImageResolution;
      uniform vec2 uMouse;
      uniform vec2 uMouseSmooth;
      uniform float uMouseVelocity;
      uniform float uParallaxStrength;
      uniform float uZoom;
      uniform vec2 uPan;
      uniform vec2 uTilt;
      uniform float uContrast;
      uniform float uBrightness;
      uniform float uLightIntensity;
      uniform float uScrollProgress;
      uniform float uTime;

      varying vec2 vUv;

      void main() {
        // 1. Calculate full-bleed 'cover' UV coordinates
        vec2 s = max(uResolution, vec2(1.0, 1.0));
        vec2 i = max(uImageResolution, vec2(1.0, 1.0));
        float rs = s.x / s.y;
        float ri = i.x / i.y;
        vec2 ratio = vec2(
          rs < ri ? s.x / (s.y * ri) : 1.0,
          rs < ri ? 1.0 : s.y / (s.x / ri)
        );

        vec2 uv = vec2(
          (vUv.x - 0.5) * ratio.x + 0.5,
          (vUv.y - 0.5) * ratio.y + 0.5
        );

        // 2. Perspective Keystone & Tilt in UV space (Subtle 3D Spatial Tilt)
        vec2 centeredUv = uv - 0.5;
        centeredUv.x += centeredUv.y * uTilt.x * 0.12;
        centeredUv.y += centeredUv.x * uTilt.y * 0.12;

        // 3. Scroll Zoom & Focal Pan (with 5% base overscan to completely eliminate edge clamping)
        float currentZoom = max(1.05, uZoom * 1.05);
        vec2 transformedUv = centeredUv / currentZoom + 0.5;
        transformedUv += uPan;

        // 4. Smooth Continuous 2.5D Spatial Parallax (Zero pixel tearing)
        // Central hero region has higher parallax depth than background edges
        vec2 centerDelta = transformedUv - vec2(0.5, 0.5);
        float distToCenter = length(centerDelta);
        float subjectDepth = smoothstep(0.65, 0.20, distToCenter);
        float depth = 0.35 + subjectDepth * 0.65;

        // Mouse Parallax Offset
        vec2 mouseDelta = (uMouseSmooth - 0.5) * 2.0;
        vec2 parallaxShift = mouseDelta * uParallaxStrength * depth;

        // 5. Interactive Fluid Ripple / Velocity Wake
        vec2 mouseDist = transformedUv - uMouse;
        float d = length(mouseDist);
        float ripple = sin(d * 22.0 - uTime * 6.0) * exp(-d * 7.0) * uMouseVelocity * 0.012;
        vec2 rippleUv = normalize(mouseDist + 0.0001) * ripple;

        vec2 finalUv = transformedUv + parallaxShift + rippleUv;
        finalUv = clamp(finalUv, 0.001, 0.999);

        // 6. Final Texture Sample
        vec4 tex = texture2D(tVideo, finalUv);
        vec3 color = tex.rgb;
        float lum = dot(color, vec3(0.299, 0.587, 0.114));

        // 7. Dynamic Specular Sheen (Sword blade, hair highlights, rope belt)
        vec2 lightDelta = finalUv - uMouse;
        float distToLight = length(lightDelta);
        float lightFalloff = exp(-distToLight * 4.2);

        // Katana blade highlight region
        float bladeZone = smoothstep(0.36, 0.64, finalUv.x) * smoothstep(0.34, 0.54, finalUv.y);
        float bladeShine = bladeZone * exp(-distToLight * 5.5) * 0.45 * uLightIntensity;

        // General highlights catch subtle specular reflection
        float highlightSheen = (1.0 - abs(lum - 0.75) * 2.0) * lightFalloff * 0.22 * uLightIntensity;
        color += vec3(bladeShine) + vec3(highlightSheen);

        // 8. Tonal Grading & Contrast (with safe clamping for pow to avoid NaN)
        float finalLum = dot(color, vec3(0.299, 0.587, 0.114));
        float safeVal = max(0.0001, finalLum * uBrightness);
        vec3 graded = vec3(pow(safeVal, uContrast));

        gl_FragColor = vec4(graded, 1.0);
      }
    `,
    transparent: false,
    depthWrite: false,
    depthTest: false,
  });
}
