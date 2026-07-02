"use client";

import { useRef, useState, useMemo } from "react";
import { useGLTFWithKTX2 } from "@/hooks/useGLTFWithKTX2";
import { Group } from "three";
import { IngredientConfig } from "@/config/BurgerConfig";

interface IngredientProps {
  config: IngredientConfig;
  // Optional external ref so parent can animate position without extra wrapper group
  groupRef?: (el: Group | null) => void;
}

export default function Ingredient({ config, groupRef }: IngredientProps) {
  const internalRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  const gltf = useGLTFWithKTX2(`/models/${config.name}.glb`);
  const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  // Merge external ref with internal ref
  const setRef = (el: Group | null) => {
    (internalRef as React.MutableRefObject<Group | null>).current = el;
    if (groupRef) groupRef(el);
  };

  return (
    <group
      ref={setRef}
      position={[config.position.x, config.position.y, config.position.z]}
      rotation={[config.rotation.x, config.rotation.y, config.rotation.z]}
      scale={[
        config.scale.x * (hovered ? 1.05 : 1),
        config.scale.y * (hovered ? 1.05 : 1),
        config.scale.z * (hovered ? 1.05 : 1),
      ]}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
    >
      <primitive object={clonedScene} />
    </group>
  );
}
