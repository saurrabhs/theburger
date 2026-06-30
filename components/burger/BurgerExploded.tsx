"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import Ingredient from "./Ingredient";
import { BURGER_CONFIG } from "@/config/BurgerConfig";

interface BurgerExplodedProps {
  scrollProgress?: number;
}

const KEYS = ["topBun", "lettuce", "tomato", "cheese", "patty", "pickles", "onions", "bottomBun"] as const;

export default function BurgerExploded({ scrollProgress = 0 }: BurgerExplodedProps) {
  const burgerRef = useRef<Group>(null);
  // Refs directly on the Ingredient groups (one ref per ingredient, no wrapper group)
  const ingredientRefs = useRef<Record<string, Group | null>>({});

  // Auto-spin at hero (scrollProgress = 0), freeze when user scrolls
  useFrame((_state, delta) => {
    if (!burgerRef.current) return;
    if (scrollProgress === 0) {
      burgerRef.current.rotation.y += delta * 0.5;
    }
  });

  // Explode — only move Y position, never touch rotation (Ingredient owns that)
  useEffect(() => {
    KEYS.forEach((key) => {
      const config = BURGER_CONFIG[key];
      const ref = ingredientRefs.current[key];
      if (!ref) return;
      // Lerp Y from assembled → exploded position
      ref.position.y =
        config.position.y +
        (config.explodedPosition.y - config.position.y) * scrollProgress;
      // X and Z stay at config values — do NOT touch rotation here
      ref.position.x = config.position.x;
      ref.position.z = config.position.z;
    });
  }, [scrollProgress]);

  return (
    <group ref={burgerRef}>
      {KEYS.map((key) => (
        <Ingredient
          key={key}
          config={BURGER_CONFIG[key]}
          groupRef={(el) => { ingredientRefs.current[key] = el; }}
        />
      ))}
    </group>
  );
}
