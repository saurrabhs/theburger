"use client";

/**
 * TextOverlay — All HTML text content driven by scrollProgress.
 * Renders as a fixed overlay above the 3D scene.
 */

import { motion, AnimatePresence } from "framer-motion";
import { BURGER_CONFIG } from "@/config/BurgerConfig";

const KEYS = ["topBun","lettuce","tomato","cheese","patty","pickles","onions","bottomBun"] as const;

const HERO_END      = 0.04;
const OPEN_END      = 0.10;
const STORY_START   = 0.12;
const STORY_END     = 0.88;
const ASSEMBLE_END  = 0.94;
const STORY_PER     = (STORY_END - STORY_START) / KEYS.length;

// Rich editorial copy per ingredient
const INGREDIENT_COPY: Record<string, {
  label: string; headline: string; sub: string; detail: string; stat?: string;
}> = {
  topBun: {
    label: "Layer 01",
    headline: "The Crown",
    sub: "Brioche Top Bun",
    detail: "Lightly toasted to a golden finish. Pillowy inside, structured enough to hold everything below. Baked fresh every morning.",
    stat: "Baked daily at 5am",
  },
  lettuce: {
    label: "Layer 02",
    headline: "The Freshness",
    sub: "Iceberg Lettuce",
    detail: "Hydroponically grown for consistent texture. Pulled at dawn, cold-stored to preserve crunch. A whisper of green against warm layers.",
    stat: "Harvested within 24h",
  },
  tomato: {
    label: "Layer 03",
    headline: "The Acidity",
    sub: "Heirloom Tomato",
    detail: "Vine-ripened, slightly tart, vivid red. The counterpoint every great burger needs to balance richness.",
    stat: "Hand-selected daily",
  },
  cheese: {
    label: "Layer 04",
    headline: "The Melt",
    sub: "Aged Cheddar",
    detail: "18-month aged cheddar, draped warm over the patty at precisely 74°C. Rich, nutty, irresistibly creamy.",
    stat: "Aged 18 months",
  },
  patty: {
    label: "Layer 05",
    headline: "The Heart",
    sub: "Grass-Fed Beef Patty",
    detail: "Dry-aged for 21 days, hand-formed, flame-grilled to a precise medium crust. The soul of the entire experience.",
    stat: "180g, 21-day dry aged",
  },
  pickles: {
    label: "Layer 06",
    headline: "The Bite",
    sub: "House-Made Pickles",
    detail: "Brined in-house for 21 days with dill, garlic, and vinegar. Sharp, bright acidity cutting through every rich layer.",
    stat: "21-day house brine",
  },
  onions: {
    label: "Layer 07",
    headline: "The Depth",
    sub: "Caramelized Onions",
    detail: "Slow-cooked at low heat for ninety minutes until sweet, jammy, and impossibly fragrant. Patience made edible.",
    stat: "90 min slow-cooked",
  },
  bottomBun: {
    label: "Layer 08",
    headline: "The Foundation",
    sub: "Brioche Base",
    detail: "Sturdier mirror of the crown. Toasted with clarified butter to create a barrier against moisture. The unsung hero.",
    stat: "Clarified butter finish",
  },
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function remapClamped(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
}

// Determine which phase we are in
function getPhase(s: number) {
  if (s < HERO_END)      return "hero";
  if (s < OPEN_END)      return "opening";
  if (s < STORY_START)   return "pause";
  if (s < STORY_END)     return "story";
  if (s < ASSEMBLE_END)  return "assemble";
  return "cta";
}

function getActiveIngredient(s: number): { key: string; t: number } | null {
  if (s < STORY_START || s >= STORY_END) return null;
  const storyT = (s - STORY_START) / (STORY_END - STORY_START);
  const idx = Math.floor(clamp(storyT * KEYS.length, 0, KEYS.length - 1));
  const t = (storyT * KEYS.length) - idx;
  return { key: KEYS[idx], t };
}

// Panel animation
const panelVariants = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] } },
  exit:    { opacity: 0, x: -20, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
};

const lineVariants = {
  hidden:  { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.2 } },
  exit:    { scaleX: 0, transition: { duration: 0.3 } },
};

interface TextOverlayProps {
  scrollProgress: number;
}

export default function TextOverlay({ scrollProgress }: TextOverlayProps) {
  const phase  = getPhase(scrollProgress);
  const active = getActiveIngredient(scrollProgress);

  // Show text panel during story phase, when ingredient is "on stage" (t 0.15–0.85)
  const showPanel = phase === "story" && active && active.t >= 0.12 && active.t <= 0.88;
  const copy = active ? INGREDIENT_COPY[active.key] : null;
  const cfg  = active ? BURGER_CONFIG[active.key]    : null;

  // CTA phase opacity
  const ctaOpacity = remapClamped(scrollProgress, ASSEMBLE_END, 1, 0, 1);

  // Assemble phase message
  const assembleProgress = remapClamped(scrollProgress, STORY_END, ASSEMBLE_END, 0, 1);
  const showAssemble = phase === "assemble";

  // Opening hint
  const openingOpacity = remapClamped(scrollProgress, HERO_END, OPEN_END, 0, 1) *
                         (1 - remapClamped(scrollProgress, OPEN_END, STORY_START, 0, 1));

  return (
    <div className="fixed inset-0 z-20 pointer-events-none" aria-hidden>

      {/* ── HERO text ──────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "hero" && (
          <motion.div
            key="hero-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center"
          >
            {/* Left side */}
            <div className="container-custom w-full grid grid-cols-[1fr_auto_1fr] lg:grid-cols-[1fr_420px_1fr] items-center">
              <div className="flex flex-col gap-5">
                <p className="text-label">— Craft Burger Experience</p>
                <h1 className="font-light leading-none" style={{ fontSize: "clamp(3rem, 7vw, 7rem)", letterSpacing: "-0.04em" }}>
                  The Art
                  <br />
                  <em style={{ fontFamily: "var(--font-playfair, 'Georgia', serif)", fontStyle: "italic", color: "var(--orange)" }}>
                    of Craft
                  </em>
                  <br />
                  Perfection
                </h1>
                <p className="text-body max-w-xs">
                  Eight meticulously sourced ingredients.<br />One unforgettable composition.
                </p>
                <div className="flex gap-3 pointer-events-auto mt-2">
                  <button
                    onClick={() => window.scrollBy({ top: window.innerHeight * 0.5, behavior: "smooth" })}
                    className="btn-primary"
                  >
                    Begin the Story
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Center — empty for burger */}
              <div />

              {/* Right side stats */}
              <div className="flex flex-col items-end gap-8 text-right">
                {[
                  { val: "8",    label: "Premium layers" },
                  { val: "100%", label: "Natural ingredients" },
                  { val: "2024", label: "Perfected" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-3xl font-light tracking-tight">{s.val}</div>
                    <div className="text-label mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── OPENING HINT ───────────────────────────────────────── */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center transition-opacity duration-300"
        style={{ opacity: openingOpacity }}
      >
        <p className="text-label">Scroll to open the burger</p>
      </div>

      {/* ── INGREDIENT STORY PANEL ─────────────────────────────── */}
      <AnimatePresence mode="wait">
        {showPanel && copy && cfg && (
          <motion.div
            key={active!.key}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-0 pointer-events-none flex flex-col"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
              maxWidth: "min(360px, 36vw)",
              paddingLeft: "clamp(2rem, 4vw, 4rem)",
              paddingRight: "1rem",
            }}
          >
            {/* Label */}
            <p className="text-label mb-2" style={{ color: cfg.color }}>
              {copy.label}
            </p>

            {/* Headline — smaller to save vertical space */}
            <h2
              className="font-light leading-none mb-2"
              style={{ fontSize: "clamp(2rem, 3.5vw, 4rem)", letterSpacing: "-0.03em" }}
            >
              {copy.headline}
            </h2>

            {/* Accent line */}
            <motion.div
              variants={lineVariants}
              className="mb-3 origin-left"
              style={{ background: cfg.color, width: 36, height: 1 }}
            />

            {/* Sub name */}
            <p
              className="font-medium uppercase mb-2"
              style={{ color: cfg.color, fontSize: "0.65rem", letterSpacing: "0.14em" }}
            >
              {copy.sub}
            </p>

            {/* Description — tighter line height */}
            <p
              className="mb-3"
              style={{
                fontSize: "clamp(0.72rem, 0.9vw, 0.88rem)",
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.48)",
              }}
            >
              {copy.detail}
            </p>

            {/* Stat badge */}
            {copy.stat && (
              <div
                className="inline-flex items-center gap-2 self-start rounded-full"
                style={{
                  background: `${cfg.color}12`,
                  border: `1px solid ${cfg.color}25`,
                  padding: "5px 12px",
                }}
              >
                <div
                  className="rounded-full flex-shrink-0"
                  style={{ background: cfg.color, width: 5, height: 5 }}
                />
                <span
                  className="font-medium tracking-wide"
                  style={{ color: cfg.color, fontSize: "0.65rem" }}
                >
                  {copy.stat}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ingredient counter — right side during story */}
      <AnimatePresence>
        {phase === "story" && active && (
          <motion.div
            key="counter"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-10 lg:right-16 top-1/2 -translate-y-1/2 flex flex-col items-end gap-3"
          >
            {KEYS.map((k, i) => {
              const idx = KEYS.indexOf(active.key as any);
              const isCurrent = i === idx;
              const isPast    = i < idx;
              return (
                <div key={k} className="flex items-center gap-3">
                  <span className="text-label transition-all duration-300"
                    style={{ opacity: isCurrent ? 1 : isPast ? 0.3 : 0.12 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="h-px transition-all duration-500"
                    style={{
                      width: isCurrent ? 32 : isPast ? 16 : 8,
                      background: isCurrent
                        ? BURGER_CONFIG[k].color
                        : isPast
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(255,255,255,0.06)",
                    }}
                  />
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ASSEMBLE MESSAGE ──────────────────────────────────── */}
      <AnimatePresence>
        {showAssemble && (
          <motion.div
            key="assemble"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-end pb-20"
          >
            <p className="text-label mb-3">— Coming together</p>
            <div className="w-48 h-px bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${assembleProgress * 100}%`,
                  background: "linear-gradient(to right, var(--orange), var(--amber))",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: ctaOpacity, pointerEvents: ctaOpacity > 0.5 ? "auto" : "none" }}
      >
        {/* Left side - Main CTA */}
        <div className="absolute left-10 lg:left-16 top-1/2 -translate-y-1/2 max-w-md">
          <p className="text-label mb-6">— The Perfect Burger</p>
          <h2 className="font-light leading-none mb-4"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5.5rem)", letterSpacing: "-0.03em" }}>
            Crafted to
            <br />
            <em style={{ fontFamily: "var(--font-playfair, 'Georgia', serif)", fontStyle: "italic", color: "var(--orange)" }}>
              perfection.
            </em>
          </h2>
          <p className="text-body max-w-xs mb-10">
            Every layer considered. Every ingredient sourced with intention.
            One unforgettable experience.
          </p>
          <div className="flex gap-4">
            <button className="btn-primary">
              Order Now
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn-ghost">Find a Location</button>
          </div>
        </div>

        {/* Right side - Stats/Quality indicators */}
        <div className="absolute right-10 lg:right-16 top-1/2 -translate-y-1/2 flex flex-col items-end gap-8 text-right">
          {[
            { val: "8", label: "Premium Ingredients", detail: "Hand-selected daily" },
            { val: "100%", label: "Natural", detail: "No artificial flavors" },
            { val: "★★★★★", label: "Quality", detail: "Michelin-rated" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-light tracking-tighter mb-2" style={{ color: "var(--orange)" }}>
                {stat.val}
              </div>
              <div className="text-lg font-medium mb-1">{stat.label}</div>
              <div className="text-label">{stat.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SCROLL PROGRESS indicator — thin left edge line ─── */}
      <div className="fixed left-0 top-0 bottom-0 w-px">
        <div
          className="w-full rounded-full transition-all duration-100"
          style={{
            height: `${scrollProgress * 100}%`,
            background: "linear-gradient(to bottom, var(--orange), var(--amber))",
            opacity: phase !== "hero" && phase !== "cta" ? 0.5 : 0,
          }}
        />
      </div>

    </div>
  );
}
