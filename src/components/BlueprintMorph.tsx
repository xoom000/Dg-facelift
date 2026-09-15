import { Canvas, useFrame } from '@react-three/fiber';
import { Edges, Float, RoundedBox } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export const BLUEPRINT_LABELS = ['INTERFACE', 'WORKFLOW', 'INTELLIGENCE', 'PLATFORM', 'SYSTEM'];

const cyan = '#6edcff';
const blue = '#3488ff';
const warm = '#ffc47a';
const ink = '#071018';

function Wire({ a, b, opacity = 0.3 }: { a: [number, number, number]; b: [number, number, number]; opacity?: number }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setFromPoints([new THREE.Vector3(...a), new THREE.Vector3(...b)]);
    return g;
  }, [a, b]);
  return <lineSegments geometry={geometry}><lineBasicMaterial color={cyan} transparent opacity={opacity} /></lineSegments>;
}

function Node({ p, hot = false }: { p: [number, number, number]; hot?: boolean }) {
  return (
    <mesh position={p}>
      <sphereGeometry args={[hot ? 0.075 : 0.045, 12, 12]} />
      <meshBasicMaterial color={hot ? warm : cyan} toneMapped={false} />
    </mesh>
  );
}

function Screen({ position, rotation = [0, 0, 0], scale = 1, hot = false }: { position: [number, number, number]; rotation?: [number, number, number]; scale?: number; hot?: boolean }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <RoundedBox args={[2.15, 1.35, 0.09]} radius={0.08} smoothness={3}>
        <meshStandardMaterial color={hot ? '#11171b' : ink} metalness={0.72} roughness={0.22} emissive={hot ? '#3b2512' : '#061822'} emissiveIntensity={0.65} />
        <Edges color={hot ? warm : cyan} threshold={15} />
      </RoundedBox>
      <mesh position={[-0.7, 0.38, 0.055]}><boxGeometry args={[0.48, 0.07, 0.015]} /><meshBasicMaterial color={hot ? warm : cyan} /></mesh>
      <mesh position={[-0.42, 0.14, 0.055]}><boxGeometry args={[1.05, 0.035, 0.015]} /><meshBasicMaterial color="#496878" /></mesh>
      <mesh position={[-0.53, -0.02, 0.055]}><boxGeometry args={[0.82, 0.035, 0.015]} /><meshBasicMaterial color="#385866" /></mesh>
      <mesh position={[0.58, 0.03, 0.055]}><boxGeometry args={[0.55, 0.55, 0.015]} /><meshBasicMaterial color={hot ? '#4b321d' : '#092a38'} /></mesh>
      {[0, 1, 2].map((i) => <mesh key={i} position={[-0.65 + i * 0.45, -0.38, 0.055]}><boxGeometry args={[0.32, 0.18, 0.015]} /><meshBasicMaterial color={i === 2 && hot ? warm : '#123746'} /></mesh>)}
    </group>
  );
}

function Phone({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.78, 1.55, 0.12]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#080e13" metalness={0.8} roughness={0.18} emissive="#071b25" emissiveIntensity={0.5} />
        <Edges color={cyan} />
      </RoundedBox>
      <mesh position={[0, 0.48, 0.066]}><boxGeometry args={[0.48, 0.08, 0.012]} /><meshBasicMaterial color={cyan} /></mesh>
      {[0.2, -0.02, -0.24].map((y, i) => <mesh key={y} position={[0, y, 0.066]}><boxGeometry args={[i === 1 ? 0.52 : 0.42, 0.11, 0.012]} /><meshBasicMaterial color={i === 1 ? '#173c4b' : '#102b36'} /></mesh>)}
    </group>
  );
}

function Core() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.18;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.35) * 0.12;
  });
  return (
    <group ref={ref}>
      <mesh><icosahedronGeometry args={[0.72, 1]} /><meshStandardMaterial color="#07151d" wireframe emissive={cyan} emissiveIntensity={0.9} transparent opacity={0.72} /></mesh>
      <mesh scale={0.62}><icosahedronGeometry args={[0.72, 1]} /><meshPhysicalMaterial color="#10191e" metalness={0.88} roughness={0.16} emissive="#5a3518" emissiveIntensity={0.7} /></mesh>
      <pointLight color={warm} intensity={10} distance={4} />
    </group>
  );
}

const nodes: [number, number, number][] = [
  [-2.8, 1.45, -0.5], [-2.25, 0.25, 0.3], [-2.55, -1.25, -0.1], [-1.25, 1.8, 0.15], [-1.15, -1.7, 0.4],
  [1.2, 1.72, 0.25], [2.25, 1.0, -0.3], [2.65, -0.25, 0.2], [2.15, -1.45, -0.25], [0.9, -1.85, 0.35],
];

function DigitalConstruct() {
  const root = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;
    if (root.current) {
      root.current.rotation.y = Math.sin(t * 0.18) * 0.18 + pointer.x * 0.08;
      root.current.rotation.x = Math.cos(t * 0.14) * 0.035 - pointer.y * 0.035;
      root.current.position.y = Math.sin(t * 0.45) * 0.07;
    }
    if (pulse.current) {
      const s = 0.75 + (Math.sin(t * 1.8) + 1) * 0.18;
      pulse.current.scale.setScalar(s);
    }
  });

  return (
    <Float speed={0.65} rotationIntensity={0.04} floatIntensity={0.1}>
      <group ref={root} scale={0.82}>
        <Core />
        <Screen position={[-1.85, 0.72, -0.25]} rotation={[0.08, 0.42, -0.08]} scale={0.86} />
        <Screen position={[1.72, 0.82, -0.15]} rotation={[-0.04, -0.48, 0.08]} scale={0.72} hot />
        <Screen position={[0.15, -1.52, -0.3]} rotation={[-0.45, 0.05, 0.02]} scale={0.65} />
        <Phone position={[2.05, -0.72, 0.35]} rotation={[0.08, -0.42, 0.08]} />

        {nodes.map((p, i) => <Node key={i} p={p} hot={i === 5 || i === 8} />)}
        {nodes.slice(0, 5).map((p, i) => <Wire key={`a${i}`} a={p} b={[0, 0, 0]} opacity={0.18 + i * 0.035} />)}
        {nodes.slice(5).map((p, i) => <Wire key={`b${i}`} a={[0, 0, 0]} b={p} opacity={0.28 + i * 0.035} />)}
        <Wire a={nodes[0]} b={nodes[1]} /><Wire a={nodes[1]} b={nodes[2]} /><Wire a={nodes[3]} b={nodes[5]} />
        <Wire a={nodes[5]} b={nodes[6]} opacity={0.55} /><Wire a={nodes[6]} b={nodes[7]} opacity={0.5} /><Wire a={nodes[7]} b={nodes[8]} opacity={0.55} />

        <group ref={pulse}>
          <mesh><torusGeometry args={[1.08, 0.012, 8, 96]} /><meshBasicMaterial color={cyan} transparent opacity={0.22} /></mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.36, 0.009, 8, 96]} /><meshBasicMaterial color={warm} transparent opacity={0.16} /></mesh>
        </group>

        {[[-0.95, 0.2, 0.7], [0.85, 0.45, 0.55], [-0.55, -0.72, 0.65], [0.68, -0.62, 0.58]].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]} rotation={[0.3 * i, 0.5 * i, 0.2]}>
            <boxGeometry args={[0.24, 0.24, 0.24]} />
            <meshStandardMaterial color={i > 1 ? '#251b12' : '#081a23'} metalness={0.65} roughness={0.28} emissive={i > 1 ? warm : cyan} emissiveIntensity={0.45} />
            <Edges color={i > 1 ? warm : cyan} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export function BlueprintMorph() {
  return (
    <Canvas camera={{ position: [0, 0, 7.4], fov: 44 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <fog attach="fog" args={['#05090d', 7, 13]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[-4, 5, 5]} intensity={1.8} color="#a9eaff" />
      <pointLight position={[3.5, 2.5, 3]} intensity={12} color={warm} distance={7} />
      <pointLight position={[-3, -1, 3]} intensity={8} color={blue} distance={6} />
      <DigitalConstruct />
    </Canvas>
  );
}
