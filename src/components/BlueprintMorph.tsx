import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export const BLUEPRINT_LABELS = ['SIGNAL', 'STRUCTURE', 'INTERFACE', 'SYSTEM', 'REALITY'];

const PARTICLES = 26000;
const CYAN = new THREE.Color('#68e7ff');
const BLUE = new THREE.Color('#3978ff');
const AMBER = new THREE.Color('#ffb55f');

function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function set3(a: Float32Array, i: number, x: number, y: number, z: number) {
  const p = i * 3;
  a[p] = x; a[p + 1] = y; a[p + 2] = z;
}

function buildTargets() {
  const seed = new Float32Array(PARTICLES * 3);
  const interfaceTarget = new Float32Array(PARTICLES * 3);
  const systemTarget = new Float32Array(PARTICLES * 3);
  const phase = new Float32Array(PARTICLES);
  const weight = new Float32Array(PARTICLES);

  for (let i = 0; i < PARTICLES; i++) {
    const r1 = hash(i * 3 + 1);
    const r2 = hash(i * 3 + 2);
    const r3 = hash(i * 3 + 3);
    const theta = r1 * Math.PI * 2;
    const phi = Math.acos(2 * r2 - 1);
    const radius = 2.4 + Math.pow(r3, 2.2) * 3.4;
    set3(seed, i,
      Math.sin(phi) * Math.cos(theta) * radius,
      Math.cos(phi) * radius * 0.72,
      Math.sin(phi) * Math.sin(theta) * radius
    );

    // Target A: a dense, curved digital workspace. Not a stack of boxes: one continuous information surface.
    const lane = i % 7;
    const u = hash(i * 11 + 5);
    const v = hash(i * 13 + 9);
    let x = 0, y = 0, z = 0;
    if (lane < 4) {
      // Four nested interface ribbons, bent through 3D space.
      const width = 5.1 - lane * 0.58;
      const height = 3.2 - lane * 0.34;
      x = (u - 0.5) * width;
      y = (v - 0.5) * height;
      const edge = Math.min(u, 1 - u, v, 1 - v);
      const snap = edge < 0.055;
      if (snap) {
        if (u < 0.055) x = -width / 2;
        else if (u > 0.945) x = width / 2;
        else if (v < 0.055) y = -height / 2;
        else y = height / 2;
      }
      z = -0.45 + lane * 0.34 + Math.sin(x * 0.72) * 0.34;
    } else if (lane === 4) {
      // Flow rail.
      const t = u * Math.PI * 2;
      x = Math.cos(t) * (1.15 + 0.28 * Math.cos(t * 3));
      y = Math.sin(t * 2) * 0.92;
      z = Math.sin(t) * 1.15;
    } else if (lane === 5) {
      // Data spine.
      const t = u * 2 - 1;
      x = t * 2.65;
      y = Math.sin(t * 8.0) * 0.44;
      z = Math.cos(t * 6.0) * 0.55 + 0.6;
    } else {
      // Intelligence halo.
      const t = u * Math.PI * 2;
      const p = v * Math.PI * 2;
      const R = 1.55, rr = 0.28 + 0.1 * Math.sin(p * 5);
      x = (R + rr * Math.cos(p)) * Math.cos(t);
      y = rr * Math.sin(p) * 1.8;
      z = (R + rr * Math.cos(p)) * Math.sin(t);
    }
    set3(interfaceTarget, i, x, y, z);

    // Target B: the same information reorganized into a living system lattice.
    const shell = i % 5;
    const a = hash(i * 17 + 4) * Math.PI * 2;
    const b = hash(i * 19 + 8) * Math.PI * 2;
    const rad = 0.85 + shell * 0.36;
    const warp = 0.42 * Math.sin(a * 3 + b * 2);
    set3(systemTarget, i,
      Math.cos(a) * (rad + warp) * 1.45,
      Math.sin(b) * (1.0 + shell * 0.18),
      Math.sin(a) * (rad + warp)
    );

    phase[i] = hash(i * 23 + 7);
    weight[i] = lane === 6 ? 1.0 : lane === 5 ? 0.8 : 0.35 + hash(i * 29) * 0.5;
  }
  return { seed, interfaceTarget, systemTarget, phase, weight };
}

const vertexShader = /* glsl */`
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPixelRatio;
  attribute vec3 aSeed;
  attribute vec3 aInterface;
  attribute vec3 aSystem;
  attribute float aPhase;
  attribute float aWeight;
  varying float vHeat;
  varying float vAlpha;
  varying float vSpark;

  float ease(float x) { return x*x*(3.0-2.0*x); }
  float hash31(vec3 p) { return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453); }

  void main() {
    float cycle = mod(uTime, 18.0);
    float gather = ease(smoothstep(0.6, 5.0, cycle));
    float rethink = ease(smoothstep(10.5, 15.0, cycle));
    float release = ease(smoothstep(15.2, 17.7, cycle));

    vec3 target = mix(aInterface, aSystem, rethink);
    vec3 p = mix(aSeed, target, gather);
    p = mix(p, aSeed * 1.08, release);

    // Residual thought/noise lives mostly in the unfinished phase.
    float noise = sin(uTime * 0.7 + aPhase * 31.0 + p.x * 1.7 + p.y * 1.2);
    p += normalize(aSeed + vec3(0.001)) * noise * (1.0 - gather) * 0.24;

    // A travelling materialization front sweeps through the construct.
    float scan = sin(uTime * 0.58) * 2.15;
    float frontier = smoothstep(scan - 0.48, scan + 0.48, p.x);
    vHeat = gather * (1.0 - release) * frontier;
    vSpark = exp(-abs(p.x - scan) * 4.5) * gather * (1.0 - release);

    // Pointer bends the field rather than rotating a rigid object.
    float influence = exp(-0.13 * dot(p.xy, p.xy));
    p.x += uPointer.x * influence * (0.22 + 0.12 * sin(p.y * 2.0));
    p.y += uPointer.y * influence * (0.18 + 0.10 * cos(p.x * 2.0));

    // Slow breathing/parallax in depth.
    p.z += sin(uTime * 0.22 + p.x * 0.65) * 0.10;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float perspective = clamp(7.0 / -mv.z, 0.55, 1.8);
    gl_PointSize = (1.15 + aWeight * 2.25 + vSpark * 5.5) * uPixelRatio * perspective;
    vAlpha = 0.22 + aWeight * 0.55 + vSpark * 0.65;
  }
`;

const fragmentShader = /* glsl */`
  uniform vec3 uCyan;
  uniform vec3 uBlue;
  uniform vec3 uAmber;
  varying float vHeat;
  varying float vAlpha;
  varying float vSpark;

  void main() {
    vec2 q = gl_PointCoord - 0.5;
    float d = length(q);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.05, d);
    float halo = smoothstep(0.5, 0.22, d);
    vec3 cold = mix(uBlue, uCyan, 0.72 + 0.28 * core);
    vec3 color = mix(cold, uAmber, clamp(vHeat + vSpark * 0.75, 0.0, 1.0));
    float alpha = (halo * 0.55 + core * 0.65) * vAlpha;
    gl_FragColor = vec4(color, alpha);
  }
`;

function MaterializationField() {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const targets = useMemo(buildTargets, []);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(targets.interfaceTarget.slice(), 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(targets.seed, 3));
    g.setAttribute('aInterface', new THREE.BufferAttribute(targets.interfaceTarget, 3));
    g.setAttribute('aSystem', new THREE.BufferAttribute(targets.systemTarget, 3));
    g.setAttribute('aPhase', new THREE.BufferAttribute(targets.phase, 1));
    g.setAttribute('aWeight', new THREE.BufferAttribute(targets.weight, 1));
    g.computeBoundingSphere();
    return g;
  }, [targets]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2() },
    uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.7) },
    uCyan: { value: CYAN },
    uBlue: { value: BLUE },
    uAmber: { value: AMBER },
  }), []);

  useFrame(({ clock, pointer }) => {
    if (!material.current || !points.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uPointer.value.lerp(pointer, 0.045);
    points.current.rotation.y = Math.sin(clock.elapsedTime * 0.08) * 0.12;
    points.current.rotation.x = Math.sin(clock.elapsedTime * 0.11) * 0.035;
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

function ScanLight() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.x = Math.sin(clock.elapsedTime * 0.58) * 2.15;
    const m = ref.current.material as THREE.MeshBasicMaterial;
    m.opacity = 0.08 + Math.sin(clock.elapsedTime * 1.4) * 0.025;
  });
  return (
    <mesh ref={ref} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[6.2, 5.0]} />
      <meshBasicMaterial color="#ffb55f" transparent opacity={0.09} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Atmosphere() {
  const stars = useMemo(() => {
    const a = new Float32Array(1600 * 3);
    for (let i = 0; i < 1600; i++) {
      const r = 5 + hash(i * 5) * 7;
      const t = hash(i * 7 + 1) * Math.PI * 2;
      const y = (hash(i * 11 + 2) - 0.5) * 8;
      set3(a, i, Math.cos(t) * r, y, Math.sin(t) * r - 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(a, 3));
    return g;
  }, []);
  return (
    <points geometry={stars}>
      <pointsMaterial color="#4ecdf0" size={0.012} transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export function BlueprintMorph() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.7], fov: 46 }}
      dpr={[1, 1.7]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => { gl.outputColorSpace = THREE.SRGBColorSpace; }}
    >
      <fog attach="fog" args={['#04070a', 8.5, 16]} />
      <Atmosphere />
      <MaterializationField />
      <ScanLight />
    </Canvas>
  );
}
