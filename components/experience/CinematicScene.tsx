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
const ASSEMBLE_END    = 0.90;  // Reduced gap - assemble starts right after story
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

  // Set initial position, scale, and rotation imperatively on mount
  // (JSX props removed to prevent R3F re-renders from overwriting useFrame updates)
  const initRef = useRef(false);
  const ref = useRef<Group>(null);
  
  useEffect(() => {
    if (ref.current && !initRef.current) {
      ref.current.position.set(cfg.position.x, cfg.position.y, cfg.position.z);
      ref.current.scale.set(cfg.scale.x, cfg.scale.y, cfg.scale.z);
      ref.current.rotation.set(cfg.rotation.x, cfg.rotation.y, cfg.rotation.z);
      initRef.current = true;
    }
  }, [cfg]);
  
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
    const baseScaleX = cfg.scale.x;
    const baseScaleY = cfg.scale.y;
    const baseScaleZ = cfg.scale.z;

    // Lerp speed — defined early so story block can use it
    const lerpSpeed = 1 - Math.pow(0.01, delta);

    let targetY       = baseY;
    let targetOpacity = 1;
    let scaleMultiplier = 1.0;
    
    // Final base scale values (may be overridden for special cases like pickles in spotlight)
    let finalBaseScaleX = baseScaleX;
    let finalBaseScaleY = baseScaleY;
    let finalBaseScaleZ = baseScaleZ;

    // ── HERO: idle (s < HERO_END) ──────────────────────────────────
    // positions stay at base, parent group rotates
    // Keep ingredient rotations at their base config values
    if (s < HERO_END) {
      ref.current.rotation.set(cfg.rotation.x, cfg.rotation.y, cfg.rotation.z);
    }

    // ── OPEN: slight explosion (HERO_END → OPEN_END) ───────────────
    if (s >= HERO_END && s <= OPEN_END) {
      const t = remapClamped(s, HERO_END, OPEN_END, 0, 1);
      const exp = cfg.explodedPosition;
      targetY = MathUtils.lerp(baseY, exp.y, easeInOut(t) * 0.2);
      // Maintain base rotation during opening
      ref.current.rotation.set(cfg.rotation.x, cfg.rotation.y, cfg.rotation.z);
    }

    // ── PAUSE: hold at 20% open (OPEN_END → STORY_START) ──────────
    if (s > OPEN_END && s < STORY_START) {
      const exp = cfg.explodedPosition;
      targetY = MathUtils.lerp(baseY, exp.y, 0.2);
      // Maintain base rotation during pause
      ref.current.rotation.set(cfg.rotation.x, cfg.rotation.y, cfg.rotation.z);
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

      if (isFeatured) {
        const centerYMap: Partial<Record<Key, number>> = {
          topBun:    2.0,  // Keep at reasonable height in camera view
          bottomBun: 2.2,
          lettuce:   2.1,
          tomato:    2.0,
          patty:     1.1,
          pickles:   1.3,
          onions:    1.3,
        };
        const centerY = centerYMap[ingKey] ?? 1.8;
        
        // Spotlight rotation overrides - custom rotation for each ingredient when featured
        const spotlightRotationMap: Partial<Record<Key, { x: number, y: number, z: number }>> = {
          topBun: { x: 0.3437, y: 0.9854, z: 0.2331 },
          lettuce: { x: -0.3170, y: 0.4100, z: 3.0880 },
          tomato: { x: 0.5968, y: -0.0656, z: -0.0016 },
          cheese: { x: 0.5191, y: -0.6300, z: 0.0000 },
          patty: { x: 0.0957, y: 0.4477, z: -0.0424 },
          pickles: { x: 0.2231, y: 0.5500, z: 0.0000 },
          onions: { x: 0.2137, y: 0.0524, z: 0.0593 },
          bottomBun: { x: 2.5624, y: 0.0600, z: 0.0000 },
        };
        const spotlightRot = spotlightRotationMap[ingKey];

        const toCenter        = remapClamped(featuredT, 0.05, 0.35, 0, 1);
        const fromCenter      = remapClamped(featuredT, 0.75, 0.98, 0, 1);
        const targetCenterAmt = easeInOut(toCenter) * (1 - easeInOut(fromCenter));

        const finalTargetX = MathUtils.lerp(baseX, 0, targetCenterAmt);
        const finalTargetY = MathUtils.lerp(openY, centerY, targetCenterAmt);

        // Ensure position never goes beyond screen bounds
        ref.current.position.x = MathUtils.clamp(
          MathUtils.lerp(ref.current.position.x, finalTargetX, lerpSpeed * 5),
          -10,
          10
        );
        ref.current.position.z = baseZ;

        targetY        = finalTargetY;
        targetOpacity  = 1; // Always fully visible when featured
        scaleMultiplier = 1 + 0.1 * targetCenterAmt;
        
        // Debug logging for topBun
        if (ingKey === "topBun" && Math.random() < 0.1) {
          console.log("[topBun FEATURED]", {
            featuredT: featuredT.toFixed(3),
            centerAmt: targetCenterAmt.toFixed(3),
            posX: ref.current.position.x.toFixed(2),
            posY: targetY.toFixed(2),
            opacity: targetOpacity,
            baseX,
            finalTargetX: finalTargetX.toFixed(2)
          });
        }
        
        // SPECIAL SCALE HANDLING FOR PICKLES
        // Pickles have squashed Y scale (0.17) in burger, but should show uniform/original scale in spotlight
        // Override the scale Y value for pickles based on spotlight amount
        if (ingKey === "pickles") {
          // In spotlight, use uniform scale (based on X axis which is the original size)
          // When not in spotlight (targetCenterAmt = 0), use the squashed scale from config
          const uniformScale = baseScaleX; // 0.34 - the original size
          finalBaseScaleY = MathUtils.lerp(baseScaleY, uniformScale, targetCenterAmt); // Lerp from 0.17 to 0.34
        }
        
        // Enable user rotation only at peak spotlight (centerAmt > 0.9)
        canRotate.current = targetCenterAmt > 0.9;
        
        // Calculate target rotation based on spotlight or original
        let targetRotX = cfg.rotation.x;
        let targetRotY = cfg.rotation.y;
        let targetRotZ = cfg.rotation.z;
        
        if (spotlightRot) {
          // Smoothly interpolate from burger rotation to spotlight rotation based on centerAmt
          targetRotX = MathUtils.lerp(cfg.rotation.x, spotlightRot.x, targetCenterAmt);
          targetRotY = MathUtils.lerp(cfg.rotation.y, spotlightRot.y, targetCenterAmt);
          targetRotZ = MathUtils.lerp(cfg.rotation.z, spotlightRot.z, targetCenterAmt);
        }
        
        // Apply rotation (with user adjustments if at peak)
        if (canRotate.current) {
          const finalRotX = targetRotX + userRotation.current.y;
          const finalRotY = targetRotY + userRotation.current.x;
          const finalRotZ = targetRotZ;
          ref.current.rotation.set(finalRotX, finalRotY, finalRotZ);
          
          // LOG ROTATION COORDINATES when in spotlight
          if (Math.random() < 0.05) { // Log occasionally to avoid spam
            console.log(`[${ingKey} SPOTLIGHT ROTATION]`, {
              x: ref.current.rotation.x.toFixed(4),
              y: ref.current.rotation.y.toFixed(4),
              z: ref.current.rotation.z.toFixed(4),
              userRotX: userRotation.current.x.toFixed(4),
              userRotY: userRotation.current.y.toFixed(4)
            });
          }
        } else {
          // Smoothly rotate during transition (no user input yet)
          const currX = ref.current.rotation.x;
          const currY = ref.current.rotation.y;
          const currZ = ref.current.rotation.z;
          const newX = MathUtils.lerp(currX, targetRotX, lerpSpeed * 3);
          const newY = MathUtils.lerp(currY, targetRotY, lerpSpeed * 3);
          const newZ = MathUtils.lerp(currZ, targetRotZ, lerpSpeed * 3);
          ref.current.rotation.set(newX, newY, newZ);
        }

      } else {
        // Non-featured ingredients
        canRotate.current = false;
        // Reset rotation to original when not featured
        const currX = ref.current.rotation.x;
        const currY = ref.current.rotation.y;
        const newX = MathUtils.lerp(currX, cfg.rotation.x, lerpSpeed * 3);
        const newY = MathUtils.lerp(currY, cfg.rotation.y, lerpSpeed * 3);
        ref.current.rotation.set(newX, newY, cfg.rotation.z);
        userRotation.current.x = MathUtils.lerp(userRotation.current.x, 0, lerpSpeed * 3);
        userRotation.current.y = MathUtils.lerp(userRotation.current.y, 0, lerpSpeed * 3);
        
        const hideT  = remapClamped(featuredT, 0.00, 0.25, 0, 1);
        const showT  = remapClamped(featuredT, 0.75, 1.00, 0, 1);
        const hidden = easeInOut(hideT) * (1 - easeInOut(showT));

        // All non-featured ingredients slide away to the right
        ref.current.position.x = MathUtils.lerp(
          ref.current.position.x,
          baseX + 14 * hidden,
          lerpSpeed * 6
        );
        ref.current.position.z = baseZ;
        targetY       = openY;
        
        // SPECIAL CASE: During topBun section (featuredIndex === 0), keep opacity at 1
        // to prevent rendering bug where topBun disappears
        if (featuredIndex === 0) {
          targetOpacity = 1; // Keep all ingredients fully visible during crown section
        } else {
          targetOpacity = clamp(1 - hidden * 1.2, 0, 1); // Normal fade for other sections
        }
        
        scaleMultiplier = 1.0;
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
      scaleMultiplier = 1.0;
      // Return to base rotation during assembly
      const currX = ref.current.rotation.x;
      const currY = ref.current.rotation.y;
      const currZ = ref.current.rotation.z;
      const newX = MathUtils.lerp(currX, cfg.rotation.x, lerpSpeed * 5);
      const newY = MathUtils.lerp(currY, cfg.rotation.y, lerpSpeed * 5);
      const newZ = MathUtils.lerp(currZ, cfg.rotation.z, lerpSpeed * 5);
      ref.current.rotation.set(newX, newY, newZ);
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
      scaleMultiplier = 1.0;
      // Maintain base rotation during CTA
      ref.current.rotation.set(cfg.rotation.x, cfg.rotation.y, cfg.rotation.z);
    }

    //  X/Z: outside story block, always lerp back to base position smoothly
    if (!(s >= STORY_START && s < STORY_END)) {
      ref.current.position.x = MathUtils.lerp(ref.current.position.x, baseX, lerpSpeed * 4);
      ref.current.position.z = MathUtils.lerp(ref.current.position.z, baseZ, lerpSpeed * 4);
    }

    ref.current.position.y = MathUtils.lerp(ref.current.position.y, targetY, lerpSpeed * 5);
    
    // Apply non-uniform scale properly (lerp each axis independently)
    const currentScaleX = ref.current.scale.x;
    const currentScaleY = ref.current.scale.y;
    const currentScaleZ = ref.current.scale.z;
    const targetScaleX = finalBaseScaleX * scaleMultiplier;
    const targetScaleY = finalBaseScaleY * scaleMultiplier;
    const targetScaleZ = finalBaseScaleZ * scaleMultiplier;
    const newScaleX = MathUtils.lerp(currentScaleX, targetScaleX, lerpSpeed * 8);
    const newScaleY = MathUtils.lerp(currentScaleY, targetScaleY, lerpSpeed * 8);
    const newScaleZ = MathUtils.lerp(currentScaleZ, targetScaleZ, lerpSpeed * 8);
    ref.current.scale.set(newScaleX, newScaleY, newScaleZ);

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
      frustumCulled={false}
    >
      <primitive object={cloned} />
    </group>
  );
}

// ─── The burger group (handles hero spin + rotation snap + mobile scaling) ────────────────────

interface BurgerGroupProps {
  scrollProgress: number;
}

function BurgerGroup({ scrollProgress }: BurgerGroupProps) {
  const groupRef = useRef<Group>(null);
  const manualRotationRef = useRef<number>(0);
  const autoRotateRef = useRef<boolean>(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

    // Mobile scaling - scale down burger by 50% on mobile
    const targetScale = isMobile ? 0.5 : 1.0;
    const currentScale = groupRef.current.scale.x;
    groupRef.current.scale.setScalar(
      MathUtils.lerp(currentScale, targetScale, 1 - Math.pow(0.001, delta))
    );

    if (scrollProgress < HERO_END) {
      // Hero section: auto-rotate unless manually rotated
      // Sync manualRotationRef with current rotation when entering hero section
      // This ensures smooth transition from any angle
      if (autoRotateRef.current) {
        // On first frame in hero, sync to current rotation
        const diff = Math.abs(manualRotationRef.current - groupRef.current.rotation.y);
        if (diff > 0.1) {
          manualRotationRef.current = groupRef.current.rotation.y;
        }
        manualRotationRef.current += delta * 0.4;
      }
      groupRef.current.rotation.y = manualRotationRef.current;
    } else {
      // Once scrolling starts, smoothly snap Y rotation to 0 (front-facing)
      // Normalize the current rotation to [-π, π] to take the shortest path to 0
      const currentRot = groupRef.current.rotation.y;
      const TWO_PI = Math.PI * 2;
      
      // Normalize to [-π, π] range
      const normalizedRot = ((currentRot % TWO_PI) + Math.PI * 3) % TWO_PI - Math.PI;
      
      // Lerp from normalized angle to 0 (shortest path)
      groupRef.current.rotation.y = MathUtils.lerp(
        normalizedRot,
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useFrame((_state, delta) => {
    // Mobile: zoom out more to show full burger
    const mobileZoomOffset = isMobile ? 2.5 : 0;
    
    // Very subtle camera movement based on scroll
    let targetZ = CAMERA_CONFIG.position.z + mobileZoomOffset;
    if (scrollProgress >= ASSEMBLE_END) {
      // Slowly zoom in for CTA
      targetZ = CAMERA_CONFIG.position.z + mobileZoomOffset - 1.5 * remapClamped(scrollProgress, ASSEMBLE_END, 1, 0, 1);
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

  return (
    <>
      {/* PREMIUM STUDIO LIGHTING SETUP */}
      
      {/* Ambient — soft fill, prevents pure blacks */}
      <ambientLight intensity={0.6} color="#f5f5f5" />

      {/* KEY LIGHT — main directional from upper right, HDR-style */}
      <directionalLight
        position={[6, 10, 6]} 
        intensity={2.2}
        color="#ffffff" 
        castShadow
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* FILL LIGHT — softer from left, reduces harsh shadows */}
      <directionalLight 
        position={[-6, 6, 4]} 
        intensity={1.0} 
        color="#fdf8f3" 
      />

      {/* FRONT SOFT LIGHT — straight from camera, illuminates what viewer sees */}
      <directionalLight 
        position={[0, 2, 12]} 
        intensity={0.7} 
        color="#ffffff" 
      />

      {/* BOTTOM FILL — lights the bottom bun and underside */}
      <directionalLight 
        position={[0, -10, 4]} 
        intensity={0.4} 
        color="#fff8f0" 
      />

      {/* RIM LIGHTS — Create premium edge highlights and depth */}
      <pointLight 
        position={[-8, 2, -4]} 
        intensity={1.2} 
        color="#FF6B35" 
        distance={20}
        decay={2}
      />
      <pointLight 
        position={[8, 2, -4]} 
        intensity={1.2} 
        color="#FFB627" 
        distance={20}
        decay={2}
      />

      {/* TOP RIM — Highlights the top of burger */}
      <pointLight 
        position={[0, 12, -2]} 
        intensity={0.8} 
        color="#ffffff" 
        distance={15}
        decay={2}
      />

      {/* SIDE ACCENT LIGHTS — Wrap-around illumination during story */}
      <pointLight 
        position={[-7, 1.8, 5]} 
        intensity={0.6} 
        color="#fff5ed" 
        distance={15}
      />
      <pointLight 
        position={[7, 1.8, 5]} 
        intensity={0.6} 
        color="#fff5ed" 
        distance={15}
      />

      {/* CTA WARM SPOTLIGHT — Premium golden glow for final section */}
      {warmth > 0 && (
        <>
          <pointLight 
            position={[0, 3, 8]} 
            intensity={warmth * 2.5} 
            color="#FFB627"
            distance={18}
            decay={2}
          />
          <pointLight 
            position={[0, 0, 10]} 
            intensity={warmth * 1.5} 
            color="#FF8559"
            distance={15}
            decay={2}
          />
        </>
      )}

      {/* HDRI Environment — Premium studio preset with enhanced exposure */}
      <Environment 
        preset="studio" 
        environmentIntensity={0.6}
      />
      
      {/* PREMIUM CONTACT SHADOWS — Soft, realistic ground shadows */}
      <ContactShadows 
        position={[0, -0.8, 0]} 
        opacity={0.25} 
        scale={10} 
        blur={2.5} 
        far={4}
        resolution={512}
        color="#000000"
      />
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
