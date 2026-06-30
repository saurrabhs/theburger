"use client";

import { useRef } from "react";
import { SpotLight, DirectionalLight } from "three";
import {
  Environment,
  ContactShadows,
  SpotLight as DreiSpotLight,
} from "@react-three/drei";
import { LIGHTING_CONFIG } from "@/config/BurgerConfig";

export default function Lighting() {
  const spotLightRef = useRef<SpotLight>(null);
  const directionalLightRef = useRef<DirectionalLight>(null);

  return (
    <>
      {/* Ambient Light - Soft fill */}
      <ambientLight
        intensity={LIGHTING_CONFIG.ambient.intensity}
        color={LIGHTING_CONFIG.ambient.color}
      />

      {/* Directional Light - Main light source */}
      <directionalLight
        ref={directionalLightRef}
        position={[
          LIGHTING_CONFIG.directional.position.x,
          LIGHTING_CONFIG.directional.position.y,
          LIGHTING_CONFIG.directional.position.z,
        ]}
        intensity={LIGHTING_CONFIG.directional.intensity}
        color={LIGHTING_CONFIG.directional.color}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Spotlight - Dramatic accent from top */}
      <DreiSpotLight
        ref={spotLightRef}
        position={[
          LIGHTING_CONFIG.spotlight.position.x,
          LIGHTING_CONFIG.spotlight.position.y,
          LIGHTING_CONFIG.spotlight.position.z,
        ]}
        angle={0.6}
        penumbra={0.5}
        intensity={LIGHTING_CONFIG.spotlight.intensity}
        color={LIGHTING_CONFIG.spotlight.color}
        castShadow
      />

      {/* Point lights for rim lighting */}
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#FF6B35" />
      <pointLight position={[5, 3, -5]} intensity={0.3} color="#FFB627" />

      {/* Environment map for realistic reflections */}
      <Environment preset="studio" />

      {/* Contact Shadows */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.5}
        scale={10}
        blur={2}
        far={4}
      />
    </>
  );
}
