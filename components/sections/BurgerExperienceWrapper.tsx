"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import BurgerExplosionPinned from "./BurgerExplosionPinned";

const SceneWithScroll = dynamic(() => import("@/components/burger/SceneWithScroll"), {
  ssr: false,
  loading: () => null,
});

export default function BurgerExperienceWrapper() {
  const [scrollProgress, setScrollProgress] = useState(0);

  return (
    <>
      {/* Single 3D scene — visible from page load (hero spin) through explosion */}
      {scrollProgress < 1 && (
        <SceneWithScroll scrollProgress={scrollProgress} />
      )}

      {/* Scroll driver — 400vh pinned section */}
      <BurgerExplosionPinned onProgressUpdate={setScrollProgress} />
    </>
  );
}
