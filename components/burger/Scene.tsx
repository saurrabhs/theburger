"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Burger from "./Burger";
import Lighting from "./Lighting";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { CAMERA_CONFIG } from "@/config/BurgerConfig";
import LoadingFallback from "./LoadingFallback";

export default function Scene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        {/* Camera */}
        <PerspectiveCamera
          makeDefault
          position={[
            CAMERA_CONFIG.position.x,
            CAMERA_CONFIG.position.y,
            CAMERA_CONFIG.position.z,
          ]}
          fov={CAMERA_CONFIG.fov}
          near={CAMERA_CONFIG.near}
          far={CAMERA_CONFIG.far}
        />

        {/* Lighting */}
        <Lighting />

        {/* 3D Content with Loading Fallback */}
        <Suspense fallback={null}>
          <Burger />
        </Suspense>

        {/* Controls - subtle auto-rotation */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={false}
          enabled={false}
        />
      </Canvas>

      {/* Loading UI Overlay */}
      <Suspense fallback={<LoadingFallback />}>
        <div className="sr-only">3D Scene Loaded</div>
      </Suspense>
    </div>
  );
}
