"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import BurgerExploded from "./BurgerExploded";
import Lighting from "./Lighting";
import { PerspectiveCamera } from "@react-three/drei";
import { CAMERA_CONFIG } from "@/config/BurgerConfig";
import { Vector3 } from "three";

// Aim camera at burger center (Y~2.0) instead of world origin
function CameraTarget() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(new Vector3(0, 2.0, 0));
  }, [camera]);
  return null;
}

interface SceneWithScrollProps {
  scrollProgress: number;
}

export default function SceneWithScroll({ scrollProgress }: SceneWithScrollProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-30">
      <Canvas
        frameloop="always"
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera
          makeDefault
          position={[CAMERA_CONFIG.position.x, CAMERA_CONFIG.position.y, CAMERA_CONFIG.position.z]}
          fov={CAMERA_CONFIG.fov}
          near={CAMERA_CONFIG.near}
          far={CAMERA_CONFIG.far}
        />
        <CameraTarget />
        <Lighting />
        <Suspense fallback={null}>
          <BurgerExploded scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
