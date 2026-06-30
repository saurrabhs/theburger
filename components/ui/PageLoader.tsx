"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone]         = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 18;
        if (next >= 100) {
          clearInterval(id);
          setTimeout(() => setDone(true), 600);
          return 100;
        }
        return next;
      });
    }, 120);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "var(--dark-900)" }}
        >
          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,107,53,0.06) 0%, transparent 60%)" }} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-8 relative z-10"
          >
            {/* Logo */}
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-white/50">
              The <span style={{ color: "var(--orange)" }}>Burger</span>
            </p>

            {/* Progress bar */}
            <div className="w-48 h-px bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  background: "linear-gradient(to right, var(--orange), var(--amber))",
                }}
                transition={{ duration: 0.2 }}
              />
            </div>

            <p className="text-label">
              {progress < 100 ? "Preparing your experience" : "Ready"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
