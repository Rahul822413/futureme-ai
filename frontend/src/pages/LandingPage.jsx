import React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

const HologramGlobe = () => (
  <Canvas className="w-full h-full">
    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
    <ambientLight intensity={0.5} />
    <directionalLight position={[2, 5, 2]} intensity={1} />
    <Sphere visible args={[1, 100, 200]} scale={2.2}>
      <MeshDistortMaterial
        color="#00f5ff"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        transparent
        opacity={0.8}
        wireframe
      />
    </Sphere>
  </Canvas>
);

const LandingPage = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20">
        
        {/* Background Particles placeholder */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.1)_0,transparent_50%)] pointer-events-none" />

        <div className="relative z-10 md:w-1/2 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary w-fit text-sm font-medium"
          >
            AI-Powered Life Assistant
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight"
          >
            Simulate your <br/>
            <span className="text-gradient">Future</span> before <br/>
            making decisions.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-gray-400 max-w-xl"
          >
            FutureMe AI is a personal future simulation engine. Enter your skills, habits, and a life-changing decision to instantly generate multiple future scenarios, timelines, and personalized roadmaps.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 mt-4"
          >
            <a href="/register" className="px-8 py-4 bg-primary text-background font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,245,255,0.5)] transition hover:scale-105">
              Get Started Now
            </a>
            <a href="/login" className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition hover:scale-105">
              Login to Account
            </a>
          </motion.div>
        </div>

        {/* 3D Hologram Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="relative z-10 w-full md:w-1/2 h-[400px] md:h-[600px] mt-12 md:mt-0"
        >
          <HologramGlobe />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-20 relative z-10 bg-black/40 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Why use FutureMe AI?</h2>
          <p className="text-gray-400">Advanced predictive algorithms for your personal growth.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'AI Scenario Engine', desc: 'Generates Optimistic, Realistic, and Risk scenarios based on your current trajectory.', icon: '🔮', color: 'from-primary to-blue-500' },
            { title: 'Skill Growth Projection', desc: 'Mathematically models your skill growth over 3 months, 1 year, and 5 years.', icon: '📈', color: 'from-secondary to-purple-600' },
            { title: 'Personalized Roadmap', desc: 'Get specific course recommendations, project ideas, and daily habit adjustments.', icon: '🗺️', color: 'from-accent to-pink-600' }
          ].map((feat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="glassmorphism p-8 rounded-2xl relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feat.color} rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition`} />
              <div className="text-5xl mb-6">{feat.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 border-t border-white/5 bg-black/60">
        <p>© 2026 FutureMe AI. An AI-assisted decision support system.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
