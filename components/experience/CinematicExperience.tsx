"use client";

/**
 * CinematicExperience — The master component.
 *
 * Layout:
 *  - A giant scroll container (TOTAL_VH tall) that creates the scroll space
 *  - CinematicScene  — fixed 3D canvas, z-10
 *  - TextOverlay     — fixed HTML panels, z-20
 *  - Navbar          — fixed, z-900
 *  - Footer          — normal flow after scroll container ends
 */

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Footer from "@/components/layout/Footer";

const CinematicScene  = dynamic(() => import("./CinematicScene"),  { ssr: false, loading: () => null });
const TextOverlay     = dynamic(() => import("./TextOverlay"),     { ssr: false, loading: () => null });

// Total scroll distance in viewport heights
// Hero(1) + Opening(1) + 8 ingredients × 3vh each + Assemble(1.5) + CTA(2) + buffer
const TOTAL_VH = 1 + 1 + 8 * 3 + 1.5 + 2 + 0.5; // = 30vh

export default function CinematicExperience() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use Lenis scroll events for smooth synchronization
    const lenis = (window as any).__lenis;
    
    const updateScrollProgress = () => {
      if (!containerRef.current) return;
      
      // Get Lenis scroll position (smooth interpolated value)
      const scrollY = lenis ? lenis.scroll : window.scrollY;
      
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      setScrollProgress(progress);
    };

    if (lenis) {
      // Listen to Lenis scroll events (fires every frame during smooth scroll)
      lenis.on('scroll', updateScrollProgress);
    } else {
      // Fallback to native scroll if Lenis not available
      window.addEventListener("scroll", updateScrollProgress, { passive: true });
    }
    
    updateScrollProgress();

    return () => {
      if (lenis) {
        lenis.off('scroll', updateScrollProgress);
      } else {
        window.removeEventListener("scroll", updateScrollProgress);
      }
    };
  }, []);

  return (
    <>
      {/* Fixed 3D scene — always behind everything */}
      <CinematicScene scrollProgress={scrollProgress} />

      {/* Fixed text overlays */}
      <TextOverlay scrollProgress={scrollProgress} />

      {/* Scroll spacer — creates the scroll distance */}
      <div
        ref={containerRef}
        style={{ height: `${TOTAL_VH * 100}vh` }}
        className="relative"
        aria-hidden
      />

      {/* Footer — normal flow, appears after scroll space ends */}
      <div className="relative z-30" style={{ background: "var(--dark-900)" }}>
        <Footer />
      </div>
    </>
  );
}
