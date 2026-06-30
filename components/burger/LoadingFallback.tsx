"use client";

import { motion } from "framer-motion";

export default function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-dark-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        {/* Loading spinner */}
        <div className="relative w-16 h-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 border-4 border-accent-orange/20 border-t-accent-orange rounded-full"
          />
        </div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-400"
        >
          Crafting your experience...
        </motion.p>
      </motion.div>
    </div>
  );
}
