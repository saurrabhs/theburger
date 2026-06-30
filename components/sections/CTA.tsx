"use client";

import { useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Burger from "@/components/burger/Burger";
import Lighting from "@/components/burger/Lighting";
import { CAMERA_CONFIG } from "@/config/BurgerConfig";

// Floating particles
function Particles() {
  const count = 40;
  const items = Array.from({ length: count }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: Math.random() * 3 + 1,
    d: Math.random() * 6 + 4,
    delay: Math.random() * 3,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left:   `${p.x}%`,
            top:    `${p.y}%`,
            width:  p.s,
            height: p.s,
            background: i % 3 === 0 ? "var(--orange)" : "rgba(255,255,255,0.15)",
          }}
          animate={{ y: [0, -30, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: p.d, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function CTA() {
  return (
    <section id="experience" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden section-padding"
      style={{ background: "linear-gradient(to bottom, var(--dark-900), var(--dark-800), var(--dark-900))" }}>

      <Particles />

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 65%)" }} />
      </div>

      {/* 3D Burger — cinematic */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-2xl h-[500px] mb-12"
      >
        <Canvas shadows gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
          <PerspectiveCamera makeDefault
            position={[CAMERA_CONFIG.position.x, CAMERA_CONFIG.position.y, CAMERA_CONFIG.position.z]}
            fov={CAMERA_CONFIG.fov} near={CAMERA_CONFIG.near} far={CAMERA_CONFIG.far}
          />
          <Lighting />
          <Suspense fallback={null}>
            <Burger />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
        </Canvas>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
        className="text-center max-w-2xl px-6 relative z-10"
      >
        <p className="text-label mb-6">— The Final Experience</p>
        <h2 className="text-section font-light leading-none mb-6">
          Experience the
          <br />
          <em style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "var(--orange)" }}>
            perfect burger.
          </em>
        </h2>
        <p className="text-body max-w-md mx-auto mb-10">
          Every layer considered. Every ingredient perfected. One unforgettable moment.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="btn-primary">
            Order Your Burger
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="btn-ghost">Find a Location</button>
        </div>

        {/* Social proof */}
        <p className="text-label mt-10">
          Joined by <span style={{ color: "var(--orange)" }}>2,547</span> burger enthusiasts
        </p>
      </motion.div>
    </section>
  );
}
