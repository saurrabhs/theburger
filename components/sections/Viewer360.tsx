"use client";

import { motion } from "framer-motion";
import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { CAMERA_CONFIG } from "@/config/BurgerConfig";
import Burger from "@/components/burger/Burger";
import Lighting from "@/components/burger/Lighting";
import { FiRotateCw, FiMaximize2 } from "react-icons/fi";

export default function Viewer360() {
  const [autoRotate, setAutoRotate] = useState(false);

  return (
    <section id="experience" className="section relative bg-dark-900">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 glass rounded-full text-sm font-medium text-accent-orange mb-6">
            Interactive Experience
          </span>
          <h2 className="mb-6">
            Explore Every
            <br />
            <span className="text-accent-orange">Angle</span>
          </h2>
          <p className="text-premium max-w-2xl mx-auto">
            Drag to rotate. Scroll to zoom. Experience the burger in full 360°.
          </p>
        </motion.div>

        {/* 360 Viewer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[600px] rounded-3xl overflow-hidden glass"
        >
          <Canvas
            shadows
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <PerspectiveCamera
              makeDefault
              position={[
                CAMERA_CONFIG.position.x,
                CAMERA_CONFIG.position.y,
                CAMERA_CONFIG.position.z,
              ]}
              fov={CAMERA_CONFIG.fov}
            />

            <Lighting />

            <Suspense fallback={null}>
              <Burger />
            </Suspense>

            <OrbitControls
              enableZoom={true}
              enablePan={false}
              enableRotate={true}
              minDistance={4}
              maxDistance={12}
              autoRotate={autoRotate}
              autoRotateSpeed={1}
            />
          </Canvas>

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAutoRotate(!autoRotate)}
              className={`glass px-6 py-3 rounded-full flex items-center gap-2 transition-colors ${
                autoRotate ? "border-accent-orange" : ""
              }`}
            >
              <FiRotateCw className={`w-5 h-5 ${autoRotate ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
              <span className="text-sm font-medium">
                {autoRotate ? "Auto-Rotating" : "Manual Control"}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass px-6 py-3 rounded-full flex items-center gap-2"
            >
              <FiMaximize2 className="w-5 h-5" />
              <span className="text-sm font-medium">Fullscreen</span>
            </motion.button>
          </div>

          {/* Instructions */}
          <div className="absolute top-6 left-6 glass px-4 py-2 rounded-full">
            <p className="text-xs text-gray-400">
              <span className="text-white font-medium">Drag</span> to rotate •{" "}
              <span className="text-white font-medium">Scroll</span> to zoom
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { label: "360° View", description: "Full orbital rotation" },
            { label: "Zoom Control", description: "Get up close and personal" },
            { label: "Auto-Rotate", description: "Sit back and watch" },
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
              className="glass rounded-xl p-6 text-center"
            >
              <h4 className="font-semibold mb-1">{feature.label}</h4>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
