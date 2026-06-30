"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 1, ease: [0.23, 1, 0.32, 1] },
  }),
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden"
      style={{ background: "var(--dark-900)" }}
    >
      {/* Radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 65%)" }} />
      </div>

      {/* Three-column layout: left text | burger center | right text */}
      <div className="absolute inset-0 z-40 pointer-events-none grid grid-cols-[1fr_auto_1fr] lg:grid-cols-[1fr_460px_1fr] gap-0 items-center px-8 lg:px-16 pt-20">

        {/* LEFT column */}
        <div className="flex flex-col justify-center items-start gap-6 pr-8 lg:pr-12">
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0} className="text-label">
            — Craft Burger Experience
          </motion.p>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-hero font-light leading-none"
          >
            The Art
            <br />
            <em style={{ fontFamily: "var(--font-playfair, 'Georgia', serif)", fontStyle: "italic", color: "var(--orange)" }}>
              of Craft
            </em>
            <br />
            Perfection
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-body max-w-xs"
          >
            Eight meticulously sourced ingredients. One unforgettable composition.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-wrap gap-3 pointer-events-auto"
          >
            <a href="#ingredients" className="btn-primary">
              Discover the Craft
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#experience-360" className="btn-ghost">360° View</a>
          </motion.div>
        </div>

        {/* CENTER column — empty space for the fixed 3D burger (rendered behind at z-30) */}
        <div className="h-full" />

        {/* RIGHT column */}
        <div className="flex flex-col justify-center items-end gap-8 pl-8 lg:pl-12 text-right">

          {/* Stats */}
          {[
            { val: "8",    label: "Premium layers" },
            { val: "100%", label: "Natural ingredients" },
            { val: "1",    label: "Perfect bite" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
            >
              <div className="text-3xl font-light tracking-tighter mb-1">{s.val}</div>
              <div className="text-label">{s.label}</div>
            </motion.div>
          ))}

          {/* Divider */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="w-px h-16 self-end"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent)" }}
          />

          {/* Quality badge */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={5}
            className="text-right"
          >
            <p className="text-label mb-1">Crafted since</p>
            <p className="text-2xl font-light tracking-tight">2024</p>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3 pointer-events-none"
      >
        <span className="text-label">Scroll to explore</span>
        <motion.div
          animate={{ scaleY: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 origin-top"
          style={{ background: "linear-gradient(to bottom, var(--orange), transparent)" }}
        />
      </motion.div>
    </section>
  );
}
