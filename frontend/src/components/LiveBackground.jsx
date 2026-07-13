import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const GalaxyBlackhole = () => {
  const pointsRef = useRef();
  const glowRef = useRef();
  
  // Generate particles for accretion disk
  const [positions, colors] = useMemo(() => {
    const numParticles = 12000;
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);
    
    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Exponential distribution for radius to cluster near the center
      const radius = 1.6 + Math.pow(Math.random(), 2.5) * 10;
      
      // Thicker in the middle, tapering out
      const thickness = Math.max(0.02, (10 / radius) * 0.15);
      const y = (Math.random() - 0.5) * thickness;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      const intensity = Math.max(0, 1 - (radius - 1.6) / 10);
      
      // Color palette: deep purples, bright pinks, blues, and bright whites near center
      const colorType = Math.random();
      let r, g, b;
      
      if (radius < 2.0) {
        // Bright hot inner ring
        r = 1.0; g = 0.9; b = 0.8;
      } else if (colorType > 0.7) {
        // Cyan / Blue
        r = 0.0; g = 0.8 * intensity; b = 1.0 * intensity;
      } else if (colorType > 0.4) {
        // Pink / Purple
        r = 1.0 * intensity; g = 0.2 * intensity; b = 0.8 * intensity;
      } else {
        // Deep purple / blackish
        r = 0.4 * intensity; g = 0.0; b = 0.6 * intensity;
      }
      
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }
    return [positions, colors];
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Rotate the accretion disk
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * -0.15;
      pointsRef.current.rotation.z = 0.15 * Math.sin(time * 0.2);
      pointsRef.current.rotation.x = 0.35 + 0.1 * Math.sin(time * 0.1);
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.03);
      glowRef.current.rotation.y = time * 0.5;
    }
  });

  return (
    <group>
      {/* Event Horizon */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Photon Sphere / Inner Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.65, 64, 64]} />
        <meshBasicMaterial 
          color="#8a2be2" 
          transparent 
          opacity={0.4} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer Glow */}
      <mesh>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial 
          color="#00f5ff" 
          transparent 
          opacity={0.04} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Accretion Disk */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.06} 
          vertexColors 
          transparent 
          blending={THREE.AdditiveBlending} 
          depthWrite={false} 
          sizeAttenuation={true}
        />
      </points>
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#a78bfa" />
    </group>
  );
};

export default function LiveBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#03050a]">
      <Canvas camera={{ position: [0, 3, 10], fov: 45 }}>
        <Stars radius={100} depth={50} count={6000} factor={4} saturation={1} fade speed={1.5} />
        <GalaxyBlackhole />
      </Canvas>
    </div>
  );
}
