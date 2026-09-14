import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const COUNT = 420;
const CYCLE = 6.5;

function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function pointOnLine(a: THREE.Vector3, b: THREE.Vector3, t: number) {
  return a.clone().lerp(b, t);
}

function motorcyclePoint(i: number) {
  if (i < 120 || (i >= 120 && i < 240)) {
    const left = i < 120;
    const j = i % 120;
    const a = (j / 120) * Math.PI * 2;
    const r = 1.05 + (seeded(i) - 0.5) * 0.06;
    return new THREE.Vector3((left ? -1.5 : 1.5) + Math.cos(a) * r, -0.75 + Math.sin(a) * r, (seeded(i + 7) - 0.5) * 0.14);
  }

  if (i < 330) {
    const j = i - 240;
    const seg = j % 5;
    const t = (j % 18) / 17;
    const lines = [
      [new THREE.Vector3(-1.5, -0.7, 0), new THREE.Vector3(-0.2, 0.45, 0)],
      [new THREE.Vector3(-0.2, 0.45, 0), new THREE.Vector3(1.0, -0.25, 0)],
      [new THREE.Vector3(1.0, -0.25, 0), new THREE.Vector3(-1.0, -0.25, 0)],
      [new THREE.Vector3(-1.0, -0.25, 0), new THREE.Vector3(-0.2, 0.45, 0)],
      [new THREE.Vector3(0.25, 0.55, 0), new THREE.Vector3(1.7, 0.95, 0)],
    ];
    return pointOnLine(lines[seg][0], lines[seg][1], t).add(new THREE.Vector3(0, (seeded(i) - 0.5) * 0.05, (seeded(i + 5) - 0.5) * 0.12));
  }

  if (i < 390) {
    const j = i - 330;
    const a = (j / 60) * Math.PI * 2;
    return new THREE.Vector3(-0.1 + Math.cos(a) * 0.9, 0.35 + Math.sin(a) * 0.35, (seeded(i) - 0.5) * 0.35);
  }

  const t = (i - 390) / 30;
  return pointOnLine(new THREE.Vector3(0.65, 0.75, 0), new THREE.Vector3(1.85, 1.35, 0), t).add(new THREE.Vector3(0, 0, (seeded(i) - 0.5) * 0.18));
}

function dronePoint(i: number) {
  const centers = [
    [-1.45, 0.95],
    [1.45, 0.95],
    [-1.45, -0.95],
    [1.45, -0.95],
  ];
  if (i < 300) {
    const arm = Math.floor(i / 75) % 4;
    const j = i % 75;
    const a = (j / 75) * Math.PI * 2;
    return new THREE.Vector3(centers[arm][0] + Math.cos(a) * 0.58, centers[arm][1] + Math.sin(a) * 0.58, (seeded(i + 2) - 0.5) * 0.15);
  }
  const j = i - 300;
  const arm = j % 4;
  const t = (j % 30) / 29;
  const target = new THREE.Vector3(centers[arm][0], centers[arm][1], 0);
  return pointOnLine(new THREE.Vector3(0, 0, 0), target, t).add(new THREE.Vector3(0, 0, (seeded(i) - 0.5) * 0.12));
}

function phonePoint(i: number) {
  const w = 2.3;
  const h = 3.8;
  if (i < 300) {
    const t = i / 300;
    const p = t * 4;
    const side = Math.floor(p);
    const u = p - side;
    const corners = [
      new THREE.Vector3(-w / 2, h / 2, 0),
      new THREE.Vector3(w / 2, h / 2, 0),
      new THREE.Vector3(w / 2, -h / 2, 0),
      new THREE.Vector3(-w / 2, -h / 2, 0),
    ];
    return pointOnLine(corners[side], corners[(side + 1) % 4], u).add(new THREE.Vector3(0, 0, (seeded(i) - 0.5) * 0.08));
  }
  const j = i - 300;
  const col = j % 6;
  const row = Math.floor(j / 6) % 5;
  return new THREE.Vector3(-0.85 + col * 0.34 + (seeded(i) - 0.5) * 0.04, 1.1 - row * 0.55 + (seeded(i + 9) - 0.5) * 0.04, (seeded(i + 3) - 0.5) * 0.08);
}

function buildingPoint(i: number) {
  const tower = i % 5;
  const heights = [2.2, 3.4, 2.8, 4.1, 2.5];
  const x = -1.8 + tower * 0.9;
  const row = Math.floor(i / 5);
  const y = -1.6 + (row / (COUNT / 5)) * heights[tower];
  const face = row % 2 === 0 ? -0.45 : 0.45;
  return new THREE.Vector3(x + (seeded(i) - 0.5) * 0.5, y, face + (seeded(i + 4) - 0.5) * 0.08);
}

function networkPoint(i: number) {
  const u = seeded(i * 3 + 1);
  const v = seeded(i * 3 + 2);
  const theta = u * Math.PI * 2;
  const phi = Math.acos(2 * v - 1);
  const r = 1.6 + seeded(i * 7) * 0.7;
  return new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta) * r,
    Math.cos(phi) * r,
    Math.sin(phi) * Math.sin(theta) * r,
  );
}

function toArray(factory: (i: number) => THREE.Vector3) {
  const arr = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const p = factory(i);
    arr[i * 3] = p.x;
    arr[i * 3 + 1] = p.y;
    arr[i * 3 + 2] = p.z;
  }
  return arr;
}

const SHAPES = [motorcyclePoint, dronePoint, phonePoint, buildingPoint, networkPoint].map(toArray);
export const BLUEPRINT_LABELS = ['MOTORCYCLE', 'DRONE', 'MOBILE', 'ARCHITECTURE', 'SYSTEM'];

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function MorphObject() {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);
  const resolved = useRef<THREE.Points>(null);
  const lines = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(SHAPES[0].slice(), 3));
    return g;
  }, []);

  const resolvedGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(SHAPES[0].slice(), 3));
    return g;
  }, []);

  const lineGeometry = useMemo(() => {
    const pairCount = Math.floor(COUNT / 3);
    const a = new Float32Array(pairCount * 2 * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(a, 3));
    return g;
  }, []);

  useFrame(({ clock, pointer }) => {
    const elapsed = clock.elapsedTime;
    const cycleIndex = Math.floor(elapsed / CYCLE);
    const current = cycleIndex % SHAPES.length;
    const next = (current + 1) % SHAPES.length;
    const local = (elapsed % CYCLE) / CYCLE;
    const morph = local < 0.28 ? 0 : local > 0.78 ? 1 : smoothstep((local - 0.28) / 0.5);
    const from = SHAPES[current];
    const to = SHAPES[next];

    const pos = geometry.attributes.position.array as Float32Array;
    const rpos = resolvedGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const x = THREE.MathUtils.lerp(from[ix], to[ix], morph);
      const y = THREE.MathUtils.lerp(from[ix + 1], to[ix + 1], morph);
      const z = THREE.MathUtils.lerp(from[ix + 2], to[ix + 2], morph);
      pos[ix] = x;
      pos[ix + 1] = y;
      pos[ix + 2] = z;

      const materialize = x > 0.25 + Math.sin(elapsed * 0.7) * 0.12;
      rpos[ix] = materialize ? x : 999;
      rpos[ix + 1] = materialize ? y : 999;
      rpos[ix + 2] = materialize ? z : 999;
    }
    geometry.attributes.position.needsUpdate = true;
    resolvedGeometry.attributes.position.needsUpdate = true;

    const lpos = lineGeometry.attributes.position.array as Float32Array;
    let cursor = 0;
    for (let i = 0; i < COUNT - 3; i += 3) {
      const a = i * 3;
      const b = (i + 1) * 3;
      lpos[cursor++] = pos[a]; lpos[cursor++] = pos[a + 1]; lpos[cursor++] = pos[a + 2];
      lpos[cursor++] = pos[b]; lpos[cursor++] = pos[b + 1]; lpos[cursor++] = pos[b + 2];
    }
    lineGeometry.attributes.position.needsUpdate = true;

    if (group.current) {
      group.current.rotation.y += 0.0025;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.08, 0.03);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -pointer.x * 0.045, 0.03);
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, pointer.x * 0.18, 0.03);
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.18}>
      <group ref={group} scale={0.92}>
        <points ref={points} geometry={geometry}>
          <pointsMaterial color="#7ddcff" size={0.038} sizeAttenuation transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
        <lineSegments ref={lines} geometry={lineGeometry}>
          <lineBasicMaterial color="#3aa7c8" transparent opacity={0.22} blending={THREE.AdditiveBlending} />
        </lineSegments>
        <points ref={resolved} geometry={resolvedGeometry}>
          <pointsMaterial color="#ffc779" size={0.06} sizeAttenuation transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
      </group>
    </Float>
  );
}

export function BlueprintMorph() {
  return (
    <Canvas camera={{ position: [0, 0, 7.2], fov: 42 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 2, 4]} intensity={16} color="#8edfff" />
      <pointLight position={[3, -2, 2]} intensity={12} color="#ffaf5f" />
      <MorphObject />
    </Canvas>
  );
}
