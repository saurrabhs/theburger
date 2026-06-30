"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { CAMERA_CONFIG } from "@/config/BurgerConfig";
import Burger from "@/components/burger/Burger";
import Lighting from "@/components/burger/Lighting";

export default function Viewer360() {
  const [autoRotate, setAutoRotate] = useState(false);

  return (
    <section id="experience-360" className="relative section-padding bg-dark-900">
      <div className="container-custom">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16"
        >
          <p className="text-label mb-6">— 360° Viewer</p>
          <h2 className="text-section font-light leading-none">
            Every angle.
            <br />
            <em style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "var(--orange)" }}>
              Every detail.
            </em>
          </h2>
        </motion.div>

        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          className="relative w-full rounded-3xl overflow-hidden"
          style={{
            height: "65vh",
            minHeight: 400,
            background: "var(--dark-800)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {/* Subtle glow inside canvas */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(255,107,53,0.05) 0%, transparent 70%)" }} />

          <Canvas shadows gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
            <PerspectiveCamera makeDefault
              position={[CAMERA_CONFIG.position.x, CAMERA_CONFIG.position.y, CAMERA_CONFIG.position.z]}
              fov={CAMERA_CONFIG.fov} near={CAMERA_CONFIG.near} far={CAMERA_CONFIG.far}
            />
            <Lighting />
            <Suspense fallback={null}>
              <Burger />
            </Suspense>
            <OrbitControls
              enableZoom minDistance={4} maxDistance={12}
              enablePan={false} enableRotate
              autoRotate={autoRotate} autoRotateSpeed={0.8}
            />
          </Canvas>

          {/* Bottom controls overlay */}
          <div className="absolute bottom-0 inset-x-0 px-8 py-6 flex items-center justify-between"
            style={{ background: "linear-gradient(to top, rgba(8,8,8,0.8), transparent)" }}>

            <p className="text-label">
              <span className="text-white/60">Drag</span> to rotate ·{" "}
              <span className="text-white/60">Scroll</span> to zoom
            </p>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`btn-ghost py-2 px-4 text-xs flex items-center gap-2 ${autoRotate ? "border-orange-500/40" : ""}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${autoRotate ? "bg-orange-400" : "bg-white/20"}`}
                style={autoRotate ? { boxShadow: "0 0 6px var(--orange)" } : {}}
              />
              {autoRotate ? "Auto-rotating" : "Auto-rotate"}
            </button>
          </div>
        </motion.div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          {["360° Orbital Rotation", "Zoom Control", "Cinematic Lighting", "Interactive"].map((f) => (
            <span key={f}
              className="text-label px-4 py-2 rounded-full"
              style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
