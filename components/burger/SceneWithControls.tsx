"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Group } from "three";
import Lighting from "./Lighting";
import Burger from "./Burger";
import { CAMERA_CONFIG } from "@/config/BurgerConfig";
import { rotation } from "./rotationStore";

function RotatingBurger() {
  const groupRef = useRef<Group>(null);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    rotation.current += (rotation.target - rotation.current) * Math.min(delta * 8, 1);
    groupRef.current.rotation.y = rotation.current;
  });

  return (
    <group ref={groupRef}>
      <Burger />
    </group>
  );
}

export default function SceneWithControls() {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
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
        <Lighting />
        <Suspense fallback={null}>
          <RotatingBurger />
        </Suspense>
      </Canvas>
    </div>
  );
}
