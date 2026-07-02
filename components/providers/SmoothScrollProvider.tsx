"use client";

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,        // Scroll duration (higher = smoother/slower)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,     // Enable smooth wheel scrolling
      wheelMultiplier: 1,    // Scroll speed multiplier
      smoothTouch: false,    // Disable on touch devices (better performance on mobile)
      touchMultiplier: 2,
      infinite: false,
    });

    // Expose Lenis instance globally for sync with 3D scene
    (window as any).__lenis = lenis;

    // Sync Lenis with requestAnimationFrame
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return <>{children}</>;
}
