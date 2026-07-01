"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HeroRotationControls() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasControls, setHasControls] = useState(false);

  useEffect(() => {
    // Check if burger controls are available
    const checkControls = () => {
      if ((window as any).__burgerControls) {
        setHasControls(true);
      }
    };

    checkControls();
    const interval = setInterval(checkControls, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      // Only show during hero section (scrollProgress < 0.04)
      setIsVisible(scrollProgress < 0.04);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!hasControls || !isVisible) return null;

  const handleRotateLeft = () => {
    (window as any).__burgerControls?.rotateLeft();
  };

  const handleRotateRight = () => {
    (window as any).__burgerControls?.rotateRight();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-4"
    >
      <button
        onClick={handleRotateLeft}
        className="btn-ghost p-3 rounded-full hover:bg-orange-500/10 transition-colors"
        title="Rotate left"
        aria-label="Rotate burger left"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleRotateRight}
        className="btn-ghost p-3 rounded-full hover:bg-orange-500/10 transition-colors"
        title="Rotate right"
        aria-label="Rotate burger right"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </motion.div>
  );
}
