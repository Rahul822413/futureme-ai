import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, MeshDistortMaterial, Sphere, TorusKnot, Grid, PointMaterial } from '@react-three/drei';
import { useLocation } from 'react-router-dom';

// 1. Landing Page: Glowing Distorting Sphere
const EnergySphere = () => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[2, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#00f5ff"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#a78bfa" />
    </Float>
  );
};

// 2. Auth Pages: Sleek Rotating Torus Knot
const GlassTorusKnot = () => {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <mesh ref={meshRef}>
      <TorusKnot args={[2, 0.6, 128, 32]} />
      <meshPhysicalMaterial 
        color="#ec4899"
        metalness={0.9}
        roughness={0.1}
        transmission={0.9}
        thickness={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-10, 10, 5]} intensity={1.5} color="#00f5ff" />
      <pointLight position={[10, -10, 5]} intensity={1} color="#a78bfa" />
    </mesh>
  );
};

// 3. Data Pages (Dashboard, History): Grid and Data Nodes
const DataGrid = () => {
  // Generate random points for data nodes
  const [positions] = React.useState(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  });

  const pointsRef = useRef();
  useFrame((state) => {
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <>
      <Grid 
        position={[0, -3, 0]} 
        args={[20, 20]} 
        cellSize={1} 
        cellThickness={1} 
        cellColor="#00f5ff" 
        sectionSize={5} 
        sectionThickness={1.5} 
        sectionColor="#a78bfa" 
        fadeDistance={25} 
        fadeStrength={1} 
      />
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <PointMaterial transparent color="#ffffff" size={0.05} sizeAttenuation={true} depthWrite={false} />
      </points>
      <ambientLight intensity={0.5} />
    </>
  );
};

// 4. Simulation Pages: Dynamic Shifting Tunnel/Portal
const Portal = () => {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <torusGeometry args={[4, 0.5, 32, 100]} />
      <meshStandardMaterial 
        color="#a78bfa" 
        emissive="#a78bfa"
        emissiveIntensity={0.5}
        wireframe={true} 
      />
      <ambientLight intensity={1} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#00f5ff" />
    </mesh>
  );
};

// Main Scene Controller
const SceneController = () => {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/' || path === '') return <EnergySphere />;
  if (path.includes('login') || path.includes('register')) return <GlassTorusKnot />;
  if (path.includes('dashboard') || path.includes('history') || path.includes('admin')) return <DataGrid />;
  if (path.includes('simulate') || path.includes('result')) return <Portal />;
  
  return <EnergySphere />; // Fallback
};

export default function LiveBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#050816]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <SceneController />
      </Canvas>
    </div>
  );
}
