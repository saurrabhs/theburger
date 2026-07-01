"use client";

/**
 * CinematicScene — The single R3F Canvas that drives the entire website.
 * Lives fixed to the viewport. All animation is driven by scrollProgress (0→1).
 *
 * SCROLL MAP  (scrollProgress segments):
 *  0.00 – 0.04  Hero idle spin
 *  0.04 – 0.10  Burger opens slightly (15-20% explosion)
 *  0.10 – 0.12  Pause / hold
 *  0.12 – 0.88  Ingredient story — 8 ingredients × 0.095 each
 *                 Each ingredient segment (relative 0→1):
 *                   0.0–0.15  non-featured ingredients slide right+fade
 *                   0.15–0.45 featured ingredient rises + text shows
 *                   0.45–0.70 hold / read
 *                   0.70–0.85 ingredients return
 *                   0.85–1.0  pause assembled
 *  0.88 – 0.94  All layers assemble one by one
 *  0.94 – 1.00  Final CTA — burger closes, warm light
 */

import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { Group, MathUtils, Vector2 } from "three";
import { useGLTF } from "@react-three/drei";
import { BURGER_CONFIG, CAMERA_CONFIG } from "@/config/BurgerConfig";

// ─── constants ────────────────────────────────────────────────────────────────

const KEYS = ["topBun","lettuce","tomato","cheese","patty","pickles","onions","bottomBun"] as const;
type Key = typeof KEYS[number];

const HERO_END        = 0.04;
const OPEN_END        = 0.10;
const STORY_START     = 0.12;
const STORY_END       = 0.88;
const ASSEMBLE_END    = 0.94;
const STORY_PER_ING   = (STORY_END - STORY_START) / KEYS.length; // ~0.095

// Off-screen position when an ingredient is "hidden" during story
// NO longer using X translation (rotation-dependent). Using scale+opacity instead.

// How far the featured ingredient rises
const FEATURE_Y_OFFSET = 0.6;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function remap(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function remapClamped(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return clamp(remap(v, inMin, inMax, outMin, outMax), Math.min(outMin, outMax), Math.max(outMin, outMax));
}

// ─── Single ingredient 3D mesh ─────────────────────────────────────────────

interface IngredientMeshProps {
  ingKey: Key;
  scrollProgress: number;
}

function IngredientMesh({ ingKey, scrollProgress }: IngredientMeshProps) {
  const cfg = BURGER_CONFIG[ingKey];
  const { scene } = useGLTF(`/models/${cfg.name}.glb`);
  const cloned = useMemo(() => {
    const clonedScene = scene.clone(true);
    // Disable frustum culling on all children to prevent disappearing
    clonedScene.traverse((child: any) => {
      if (child.isMesh) {
        child.frustumCulled = false;
      }
    });
    return clonedScene;
  }, [scene]);

  // Set initial position and scale imperatively on mount
  // (JSX props removed to prevent R3F re-renders from overwriting useFrame updates)
  const initRef = useRef(false);
  useFrame(() => {
    if (!initRef.current && ref.current) {
      ref.current.position.set(cfg.position.x, cfg.position.y, cfg.position.z);
      ref.current.scale.setScalar(cfg.scale.x);
      initRef.current = true;
    }
  });
  const ref = useRef<Group>(null);
  
  // Mouse drag rotation state
  const isDragging = useRef(false);
  const previousMouse = useRef(new Vector2());
  const userRotation = useRef({ x: 0, y: 0 });
  const canRotate = useRef(false);
  
  // Mouse event handlers for drag rotation
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (canRotate.current) {
        isDragging.current = true;
        previousMouse.current.set(e.clientX, e.clientY);
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current && canRotate.current) {
        const deltaX = e.clientX - previousMouse.current.x;
        const deltaY = e.clientY - previousMouse.current.y;
        
        // Update rotation based on mouse delta
        userRotation.current.x += deltaX * 0.01; // Horizontal drag = Y rotation
        userRotation.current.y += deltaY * 0.01; // Vertical drag = X rotation
        
        previousMouse.current.set(e.clientX, e.clientY);
      }
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useFrame((_state, delta) => {
    if (!ref.current) return;

    const s = scrollProgress;
    const baseX = cfg.position.x;
    const baseY = cfg.position.y;
    const baseZ = cfg.position.z;
    const baseScale = cfg.scale.x;

    // Lerp speed — defined early so story block can use it
    const lerpSpeed = 1 - Math.pow(0.01, delta);

    let targetY       = baseY;
    let targetOpacity = 1;
    let targetScale   = baseScale;

    // ── HERO: idle (s < HERO_END) ──────────────────────────────────
    // positions stay at base, parent group rotates

    // ── OPEN: slight explosion (HERO_END → OPEN_END) ───────────────
    if (s >= HERO_END && s <= OPEN_END) {
      const t = remapClamped(s, HERO_END, OPEN_END, 0, 1);
      const exp = cfg.explodedPosition;
      targetY = MathUtils.lerp(baseY, exp.y, easeInOut(t) * 0.2);
    }

    // ── PAUSE: hold at 20% open (OPEN_END → STORY_START) ──────────
    if (s > OPEN_END && s < STORY_START) {
      const exp = cfg.explodedPosition;
      targetY = MathUtils.lerp(baseY, exp.y, 0.2);
    }

    // ── STORY (STORY_START → STORY_END) ────────────────────────────
    if (s >= STORY_START && s < STORY_END) {
      const storyT    = (s - STORY_START) / (STORY_END - STORY_START);
      const ingIndex  = KEYS.indexOf(ingKey);
      const featuredF = storyT * KEYS.length;
      const featuredIndex = Math.floor(clamp(featuredF, 0, KEYS.length - 1));
      const featuredT = featuredF - featuredIndex;
      const isFeatured = ingIndex === featuredIndex;

      const exp   = cfg.explodedPosition;
      const openY = MathUtils.lerp(baseY, exp.y, 0.2);

      // Special handling for topBun section to prevent disappearing bug
      const isTopBunSection = featuredIndex === 0;

      if (isFeatured) {
        const centerYMap: Partial<Record<Key, number>> = {
          topBun:    1.8,
          bottomBun: 2.2,
          lettuce:   2.1,
          patty:     1.1,
          pickles:   1.3,
          onions:    1.3,
        };
        const centerY = centerYMap[ingKey] ?? 1.8;

        const toCenter        = remapClamped(featuredT, 0.05, 0.35, 0, 1);
        const fromCenter      = remapClamped(featuredT, 0.75, 0.98, 0, 1);
        const targetCenterAmt = easeInOut(toCenter) * (1 - easeInOut(fromCenter));

        const finalTargetX = MathUtils.lerp(baseX, 0, targetCenterAmt);
        const finalTargetY = MathUtils.lerp(openY, centerY, targetCenterAmt);

        // Hard-reset position if ingredient is off-screen (coming from slide-right)
        // Do this BEFORE lerp so it doesn't drift in from the right
        if (Math.abs(ref.current.position.x - baseX) > 2) {
          ref.current.position.x = finalTargetX;
        } else {
          ref.current.position.x = MathUtils.lerp(ref.current.position.x, finalTargetX, lerpSpeed * 5);
        }
        ref.current.position.z = baseZ;

        targetY        = finalTargetY;
        targetOpacity  = 1;
        targetScale    = baseScale * (1 + 0.1 * targetCenterAmt);
        
        // Enable user rotation only at peak spotlight (centerAmt > 0.9)
        canRotate.current = targetCenterAmt > 0.9;
        
        // Apply user rotation when featured and at peak
        if (canRotate.current) {
          ref.current.rotation.x = cfg.rotation.x + userRotation.current.y;
          ref.current.rotation.y = cfg.rotation.y + userRotation.current.x;
          ref.current.rotation.z = cfg.rotation.z;
        } else {
          // Smoothly reset to original rotation when not at peak
          ref.current.rotation.x = MathUtils.lerp(ref.current.rotation.x, cfg.rotation.x, lerpSpeed * 3);
          ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, cfg.rotation.y, lerpSpeed * 3);
          ref.current.rotation.z = cfg.rotation.z;
          // Reset user rotation
          userRotation.current.x = MathUtils.lerp(userRotation.current.x, 0, lerpSpeed * 3);
          userRotation.current.y = MathUtils.lerp(userRotation.current.y, 0, lerpSpeed * 3);
        }

      } else {
        // Non-featured ingredients
        canRotate.current = false;
        // Reset rotation to original when not featured
        ref.current.rotation.x = MathUtils.lerp(ref.current.rotation.x, cfg.rotation.x, lerpSpeed * 3);
        ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, cfg.rotation.y, lerpSpeed * 3);
        ref.current.rotation.z = cfg.rotation.z;
        userRotation.current.x = MathUtils.lerp(userRotation.current.x, 0, lerpSpeed * 3);
        userRotation.current.y = MathUtils.lerp(userRotation.current.y, 0, lerpSpeed * 3);
        
        const hideT  = remapClamped(featuredT, 0.00, 0.25, 0, 1);
        const showT  = remapClamped(featuredT, 0.75, 1.00, 0, 1);
        const hidden = easeInOut(hideT) * (1 - easeInOut(showT));

        if (isTopBunSection) {
          // WORKAROUND: During topBun section, keep all ingredients visible at their positions
          // This prevents a rendering bug where topBun disappears
          ref.current.position.x = MathUtils.lerp(ref.current.position.x, baseX, lerpSpeed * 4);
          ref.current.position.z = baseZ;
          targetY       = openY;
          targetOpacity = 1; // Keep fully visible
          targetScale   = baseScale;
        } else {
          // Normal behavior: slide right for all other ingredient sections
          ref.current.position.x = MathUtils.lerp(
            ref.current.position.x,
            baseX + 14 * hidden,
            lerpSpeed * 6
          );
          ref.current.position.z = baseZ;
          targetY       = openY;
          targetOpacity = clamp(1 - hidden * 1.2, 0, 1);
          targetScale   = baseScale;
        }
      }
    }

    // ── ASSEMBLE (STORY_END → ASSEMBLE_END) ───────────────────────
    if (s >= STORY_END && s < ASSEMBLE_END) {
      const exp   = cfg.explodedPosition;
      const openY = MathUtils.lerp(baseY, exp.y, 0.2);

      ref.current.position.x = MathUtils.lerp(ref.current.position.x, baseX, lerpSpeed * 5);
      ref.current.position.z = MathUtils.lerp(ref.current.position.z, baseZ, lerpSpeed * 5);
      targetY       = openY;
      targetOpacity = 1; // fully visible immediately — no fade
      targetScale   = baseScale;
    }

    // ── FINAL CTA (s >= ASSEMBLE_END) ────────────────────────────
    // Scroll-driven close: burger layers compress from open → assembled
    if (s >= ASSEMBLE_END) {
      const closeT = easeInOut(remapClamped(s, ASSEMBLE_END, 1.0, 0, 1));
      const exp    = cfg.explodedPosition;
      const openY  = MathUtils.lerp(baseY, exp.y, 0.2);

      // Lerp from open position → exact assembled position as user scrolls
      targetY       = MathUtils.lerp(openY, baseY, closeT);
      ref.current.position.x = MathUtils.lerp(ref.current.position.x, baseX, lerpSpeed * 5);
      ref.current.position.z = MathUtils.lerp(ref.current.position.z, baseZ, lerpSpeed * 5);
      targetOpacity = 1;
      targetScale   = baseScale;
    }

    //  X/Z: outside story block, always lerp back to base position smoothly
    if (!(s >= STORY_START && s < STORY_END)) {
      ref.current.position.x = MathUtils.lerp(ref.current.position.x, baseX, lerpSpeed * 4);
      ref.current.position.z = MathUtils.lerp(ref.current.position.z, baseZ, lerpSpeed * 4);
    }

    ref.current.position.y = MathUtils.lerp(ref.current.position.y, targetY, lerpSpeed * 5);
    ref.current.scale.setScalar(MathUtils.lerp(ref.current.scale.x, targetScale, lerpSpeed * 8));

    // Opacity — handle featured (hard set) vs non-featured (lerp) differently
    const isCurrentlyFeatured = s >= STORY_START && s < STORY_END &&
      KEYS.indexOf(ingKey) === Math.floor(clamp(((s - STORY_START) / (STORY_END - STORY_START)) * KEYS.length, 0, KEYS.length - 1));

    ref.current.traverse((child: any) => {
      if (child.material) {
        child.material.transparent = true;
        if (isCurrentlyFeatured) {
          // Hard-set to 1 immediately when featured — no lerp
          child.material.opacity = 1;
        } else if (targetOpacity >= 0.99) {
          // Assemble phase: snap to full opacity
          child.material.opacity = MathUtils.lerp(child.material.opacity ?? 1, 1, lerpSpeed * 20);
        } else if (targetOpacity <= 0.01) {
          child.material.opacity = 0;
        } else {
          // Non-featured in story: lerp based on hide progress
          child.material.opacity = MathUtils.lerp(child.material.opacity ?? 1, targetOpacity, lerpSpeed * 8);
        }
      }
    });
  });

  return (
    <group
      ref={ref}
      rotation={[cfg.rotation.x, cfg.rotation.y, cfg.rotation.z]}
      frustumCulled={false}
    >
      <primitive object={cloned} />
    </group>
  );
}

// ─── The burger group (handles hero spin + rotation snap) ────────────────────

interface BurgerGroupProps {
  scrollProgress: number;
}

function BurgerGroup({ scrollProgress }: BurgerGroupProps) {
  const groupRef = useRef<Group>(null);
  const manualRotationRef = useRef<number>(0);
  const autoRotateRef = useRef<boolean>(true);

  // Expose rotation controls globally for buttons
  useEffect(() => {
    (window as any).__burgerControls = {
      rotateLeft: () => {
        manualRotationRef.current -= Math.PI / 4; // 45 degrees
        autoRotateRef.current = false;
      },
      rotateRight: () => {
        manualRotationRef.current += Math.PI / 4; // 45 degrees
        autoRotateRef.current = false;
      },
      enableAutoRotate: () => {
        autoRotateRef.current = true;
      },
    };
  }, []);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    if (scrollProgress < HERO_END) {
      // Hero section: auto-rotate unless manually rotated
      if (autoRotateRef.current) {
        manualRotationRef.current += delta * 0.4;
      }
      groupRef.current.rotation.y = manualRotationRef.current;
    } else {
      // Once scrolling starts, smoothly snap Y rotation to 0 (front-facing)
      // This ensures ingredient hide/show is always consistent regardless of spin angle
      groupRef.current.rotation.y = MathUtils.lerp(
        groupRef.current.rotation.y,
        0,
        1 - Math.pow(0.001, delta)
      );
    }
  });

  return (
    <group ref={groupRef} frustumCulled={false}>
      {KEYS.map((k) => (
        <IngredientMesh key={k} ingKey={k} scrollProgress={scrollProgress} />
      ))}
    </group>
  );
}

// ─── Camera drift ─────────────────────────────────────────────────────────

function CameraDrift({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  const targetRef = useRef({ x: 0, y: 0, z: 0 });

  useFrame((_state, delta) => {
    // Very subtle camera movement based on scroll
    let targetZ = CAMERA_CONFIG.position.z;
    if (scrollProgress >= ASSEMBLE_END) {
      // Slowly zoom in for CTA
      targetZ = CAMERA_CONFIG.position.z - 1.5 * remapClamped(scrollProgress, ASSEMBLE_END, 1, 0, 1);
    }

    const lerpSpeed = 1 - Math.pow(0.001, delta);
    camera.position.z = MathUtils.lerp(camera.position.z, targetZ, lerpSpeed * 2);
    camera.lookAt(0, 2.0, 0);
  });

  return null;
}

// ─── Lighting that responds to story phase ─────────────────────────────────

function DynamicLighting({ scrollProgress }: { scrollProgress: number }) {
  const warmth = scrollProgress >= ASSEMBLE_END
    ? remapClamped(scrollProgress, ASSEMBLE_END, 1, 0, 1)
    : 0;

  const isStory = scrollProgress >= STORY_START && scrollProgress < STORY_END;

  // Detect if a bun is currently featured (they need special lighting due to their rotation)
  const storyT       = isStory ? (scrollProgress - STORY_START) / (STORY_END - STORY_START) : 0;
  const featuredIdx  = isStory ? Math.floor(clamp(storyT * KEYS.length, 0, KEYS.length - 1)) : -1;
  const featuredKey  = featuredIdx >= 0 ? KEYS[featuredIdx] : null;
  const isBunFeatured = featuredKey === "topBun" || featuredKey === "bottomBun";

  return (
    <>
      {/* Ambient — always strong, removes all pitch-black shadows */}
      <ambientLight intensity={0.5 + warmth * 0.3} color="#ffffff" />

      {/* Main directional — key light from upper right */}
      <directionalLight
        position={[5, 8, 5]} intensity={1.5}
        color="#ffffff" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
      />

      {/* Fill from upper left */}
      <directionalLight position={[-5, 5, 3]} intensity={0.8} color="#ffffff" />

      {/* FRONT DIRECT — straight from camera direction, lights the face we see */}
      <directionalLight position={[0, 1.5, 10]} intensity={0.5} color="#ffffff" />

      {/* BELOW — bottom bun is flipped, illuminate from below */}
      <directionalLight position={[0, -8, 3]} intensity={0.3} color="#fff8f0" />

      {/* Left/right wraps during story */}
      <pointLight position={[-6, 1.5, 4]} intensity={0.4} color="#ffffff" />
      <pointLight position={[ 6, 1.5, 4]} intensity={0.4} color="#ffffff" />

      {/* Rim accent lights */}
      <pointLight position={[-5, 3, -5]} intensity={0.6} color="#FF6B35" />
      <pointLight position={[ 5, 3, -5]} intensity={0.6} color="#FFB627" />

      {/* CTA warm fill */}
      {warmth > 0 && (
        <pointLight position={[0, 2, 6]} intensity={warmth * 1.5} color="#FFB627" />
      )}

      <Environment preset="studio" />
      <ContactShadows position={[0, -0.5, 0]} opacity={0.3} scale={8} blur={3} far={4} />
    </>
  );
}

// ─── Main exported component ───────────────────────────────────────────────

interface CinematicSceneProps {
  scrollProgress: number;
}

export default function CinematicScene({ scrollProgress }: CinematicSceneProps) {
  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
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

        <DynamicLighting scrollProgress={scrollProgress} />
        <CameraDrift scrollProgress={scrollProgress} />

        <Suspense fallback={null}>
          <BurgerGroup scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
