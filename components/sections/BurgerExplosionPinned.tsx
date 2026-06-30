"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BurgerExplosionPinnedProps {
  onProgressUpdate: (progress: number) => void;
}

const STORY_BEATS = [
  { threshold: 0,   headline: "Watch it unfold.",   sub: "Eight layers. One vision." },
  { threshold: 0.25, headline: "Crafted with care.", sub: "Every ingredient sourced with intention." },
  { threshold: 0.55, headline: "Precision stacking.", sub: "The architecture of flavour." },
  { threshold: 0.8,  headline: "The perfect bite.",  sub: "Ready to be experienced." },
];

export default function BurgerExplosionPinned({ onProgressUpdate }: BurgerExplosionPinnedProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [beatIndex, setBeatIndex] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY      = window.scrollY;
        const wh           = window.innerHeight;
        const start        = wh;
        const duration     = wh * 3;
        const end          = start + duration;

        if (scrollY < start) {
          setScrollProgress(0);
          onProgressUpdate(0);
        } else if (scrollY >= end) {
          setScrollProgress(1);
          onProgressUpdate(1);
        } else {
          const p = Math.min(Math.max((scrollY - start) / duration, 0), 1);
          setScrollProgress(p);
          onProgressUpdate(p);
          // update story beat
          let bi = 0;
          for (let i = STORY_BEATS.length - 1; i >= 0; i--) {
            if (p >= STORY_BEATS[i].threshold) { bi = i; break; }
          }
          setBeatIndex(bi);
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onProgressUpdate]);

  const beat = STORY_BEATS[beatIndex];

  return (
    <section className="relative bg-dark-900" style={{ height: "400vh" }}>

      {/* Fixed overlay — only during explosion */}
      <AnimatePresence>
        {scrollProgress > 0 && scrollProgress < 1 && (
          <motion.div
            key="explosion-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-20"
            style={{ background: "var(--dark-900)" }}
          >
            {/* Glow behind burger */}
            <div
              className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)" }}
            />

            {/* Story text — left aligned, editorial */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full max-w-sm px-10 lg:px-16 z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={beatIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                >
                  <p className="text-label mb-4">— Layer by layer</p>
                  <h2 className="text-section font-light leading-none mb-4">
                    {beat.headline}
                  </h2>
                  <p className="text-body">{beat.sub}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress line — bottom */}
            <div className="absolute bottom-10 left-10 right-10 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${scrollProgress * 100}%`,
                    background: "linear-gradient(to right, var(--orange), var(--amber))",
                  }}
                />
              </div>
              <span className="text-label shrink-0">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
