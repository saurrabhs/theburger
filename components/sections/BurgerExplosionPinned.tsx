"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BurgerExplosionPinnedProps {
  onProgressUpdate: (progress: number) => void;
}

export default function BurgerExplosionPinned({ onProgressUpdate }: BurgerExplosionPinnedProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          
          // Animation happens during first 3 viewport heights after hero
          const explosionStart = windowHeight; // After hero section
          const explosionDuration = windowHeight * 3; // 3 viewport heights for animation
          const explosionEnd = explosionStart + explosionDuration;
          
          if (scrollY < explosionStart) {
            // Before explosion - burger assembled
            setScrollProgress(0);
            onProgressUpdate(0);
            setIsAnimationComplete(false);
          } else if (scrollY >= explosionEnd) {
            // After explosion - burger fully exploded, allow normal scroll
            setScrollProgress(1);
            onProgressUpdate(1);
            setIsAnimationComplete(true);
          } else {
            // During explosion - calculate progress
            const progress = (scrollY - explosionStart) / explosionDuration;
            const smoothProgress = Math.min(Math.max(progress, 0), 1);
            setScrollProgress(smoothProgress);
            onProgressUpdate(smoothProgress);
            setIsAnimationComplete(false);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [onProgressUpdate]);

  return (
    <>
      {/* Explosion Zone - takes 4x viewport height */}
      <section 
        className="relative bg-dark-900"
        style={{ height: '400vh' }} // 4x viewport for smooth animation
      >
        {/* Fixed content during explosion - show only when scrolling into explosion zone */}
        <div 
          className="fixed top-0 left-0 w-full h-screen z-20 bg-dark-900"
          style={{ display: (scrollProgress > 0 && scrollProgress < 1) ? 'block' : 'none' }}
        >
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-orange/5 rounded-full blur-[150px] pointer-events-none" />

          {/* Center text - changes during explosion */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              {scrollProgress < 0.3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-5xl md:text-7xl font-bold mb-4">
                    Watch It <span className="text-accent-orange">Unfold</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-400">
                    Every layer tells a story
                  </p>
                </motion.div>
              )}
              
              {scrollProgress >= 0.3 && scrollProgress < 0.7 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-5xl md:text-7xl font-bold mb-4">
                    <span className="text-accent-orange">Crafted</span> With Care
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-400">
                    Premium ingredients revealed
                  </p>
                </motion.div>
              )}

              {scrollProgress >= 0.7 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-5xl md:text-7xl font-bold mb-4">
                    <span className="text-accent-orange">Experience</span> Perfection
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-400">
                    The art of burger mastery
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
            <div className="w-48 h-1 bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-orange to-accent-amber"
                style={{ width: `${scrollProgress * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center mt-3 uppercase tracking-wider">
              {scrollProgress < 1 ? 'Keep scrolling to explore' : 'Animation complete'}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
