"use client";

import { motion } from "framer-motion";
import { FiArrowRight, FiPlay } from "react-icons/fi";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">

      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent-orange/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Text content — sits above the fixed 3D scene (z-30) from BurgerExperienceWrapper */}
      <div className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-5xl px-6"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 glass rounded-full text-sm font-medium text-accent-orange">
              Introducing
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="mb-6 font-bold tracking-tighter">
            The Art of
            <br />
            <span className="text-accent-orange">Burger Perfection</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-premium max-w-2xl mx-auto mb-12">
            Eight meticulously crafted layers. One unforgettable experience.
            Discover the precision, passion, and perfection in every bite.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto"
          >
            <button className="btn-primary flex items-center gap-2 group">
              Experience Now
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-secondary flex items-center gap-2 group">
              <FiPlay className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Watch Story
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-500 uppercase tracking-wider">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-accent-orange to-transparent"
          />
        </motion.div>
      </div>

    </section>
  );
}
