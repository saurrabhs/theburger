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
const ASSEMBLE_END  = 0.90;  // Reduced gap - assemble starts right after story
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

  // Show text panel during story phase - extended range to allow full slide-out
  const showPanel = phase === "story" && active && active.t >= 0.12 && active.t <= 1.0;
  const copy = active ? INGREDIENT_COPY[active.key] : null;
  const cfg  = active ? BURGER_CONFIG[active.key]    : null;

  // Calculate smooth fade in/out for ingredient panels based on active.t
  let panelOpacity = 0;
  let panelTranslateX = -40;
  if (active && active.t >= 0.12) {
    // Fade in from t=0.12 to t=0.30 (slower, more gradual)
    const fadeIn = remapClamped(active.t, 0.12, 0.30, 0, 1);
    // Fade out from t=0.70 to t=0.88 (slower, more gradual)
    const fadeOut = 1 - remapClamped(active.t, 0.70, 0.88, 0, 1);
    panelOpacity = Math.min(fadeIn, fadeOut);
    // Slide in from left, then slide out to left
    const slideIn = remapClamped(active.t, 0.12, 0.30, -40, 0);
    const slideOut = remapClamped(active.t, 0.70, 0.88, 0, -40);
    panelTranslateX = slideIn + slideOut;
  }

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
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{ 
          opacity: remapClamped(scrollProgress, 0, HERO_END, 1, 0),
          pointerEvents: scrollProgress < HERO_END ? 'auto' : 'none'
        }}
      >
        {/* Mobile-first layout */}
        <div className="container-custom h-full flex flex-col justify-between lg:justify-center py-8">
          {/* Top section - Text content */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-0 items-start lg:items-center" style={{ paddingTop: window.innerWidth < 768 ? '18vh' : '0' }}>
            {/* Left side - Main content */}
            <div 
              className="flex flex-col gap-5 transition-all duration-500 text-center lg:text-left items-center lg:items-start"
              style={{ 
                transform: `translateX(${remapClamped(scrollProgress, 0, HERO_END, 0, -40)}px)`
              }}
            >
              <p style={{ fontSize: "10.5px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
                CRAFT BURGER EXPERIENCE
              </p>
              <h1 className="font-light leading-none" style={{ fontSize: "clamp(36px, 8vw, 78px)", letterSpacing: "-0.04em", lineHeight: "0.92" }}>
                The Art
                <br />
                <em style={{ fontFamily: "var(--font-playfair, 'Georgia', serif)", fontStyle: "italic", color: "var(--orange)" }}>
                  of Craft
                </em>
                <br />
                Perfection
              </h1>
              <p style={{ fontSize: "clamp(13px, 2.5vw, 15px)", lineHeight: "1.65", color: "rgba(255,255,255,0.42)", maxWidth: "340px", fontWeight: 300 }}>
                Eight meticulously sourced ingredients.<br className="hidden sm:block" />One unforgettable composition.
              </p>
              {/* Button on desktop only */}
              <div className="hidden lg:flex gap-3 pointer-events-auto mt-2">
                <button
                  onClick={() => window.scrollBy({ top: window.innerHeight * 0.5, behavior: "smooth" })}
                  className="btn-primary"
                  style={{ fontSize: "clamp(10px, 2vw, 11.5px)", padding: "clamp(9px, 2vw, 11px) clamp(18px, 4vw, 24px)" }}
                >
                  Begin the Story
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Center — empty for burger on desktop, hidden on mobile */}
            <div className="hidden lg:block" />

            {/* Right side - Premium quality indicators (hidden on mobile, show on tablets+) */}
            <div 
              className="hidden md:flex flex-col items-end gap-12 text-right transition-all duration-500"
              style={{ 
                transform: `translateX(${remapClamped(scrollProgress, 0, HERO_END, 0, 40)}px)`
              }}
            >
              {[
                { 
                  icon: "✦", 
                  value: "Fresh Daily",
                  subtext: "Never frozen"
                },
                { 
                  icon: "◆", 
                  value: "42g Protein",
                  subtext: "Power packed"
                },
                { 
                  icon: "★", 
                  value: "Hand Crafted",
                  subtext: "With passion"
                },
              ].map((item, i) => (
                <div key={i} className="group">
                  <div className="flex items-baseline justify-end gap-2 mb-1">
                    <span className="text-orange-500/40 text-sm">{item.icon}</span>
                    <span style={{ fontSize: "clamp(16px, 3vw, 20px)", fontWeight: 300, letterSpacing: "-0.02em" }}>{item.value}</span>
                  </div>
                  <div style={{ 
                    fontSize: "9.5px", 
                    letterSpacing: "0.18em", 
                    textTransform: "uppercase", 
                    color: "rgba(255,255,255,0.2)",
                    fontWeight: 300
                  }}>
                    {item.subtext}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom section - Button on mobile only */}
          <div className="lg:hidden flex justify-center pointer-events-auto" style={{ paddingBottom: '12vh' }}>
            <button
              onClick={() => window.scrollBy({ top: window.innerHeight * 0.5, behavior: "smooth" })}
              className="btn-primary"
              style={{ fontSize: "clamp(10px, 2vw, 11.5px)", padding: "clamp(9px, 2vw, 11px) clamp(18px, 4vw, 24px)" }}
            >
              Begin the Story
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── OPENING PHASE TEXT ───────────────────────────────────────── */}
      {(phase === "opening" || (phase === "pause" && scrollProgress < STORY_START)) && (
        <div
          className="absolute left-4 sm:left-10 lg:left-20 max-w-[85vw] sm:max-w-md transition-all duration-700"
          style={{ 
            top: window.innerWidth < 768 ? "20%" : "50%",
            transform: window.innerWidth < 768
              ? `translateY(0) translateX(${
                  remapClamped(scrollProgress, HERO_END, HERO_END + 0.02, -30, 0) + 
                  remapClamped(scrollProgress, OPEN_END - 0.02, OPEN_END + 0.02, 0, -30)
                }px)`
              : `translateY(-50%) translateX(${
                  remapClamped(scrollProgress, HERO_END, HERO_END + 0.02, -30, 0) + 
                  remapClamped(scrollProgress, OPEN_END - 0.02, OPEN_END + 0.02, 0, -30)
                }px)`,
            opacity: remapClamped(scrollProgress, HERO_END, HERO_END + 0.02, 0, 1) * 
                     (1 - remapClamped(scrollProgress, OPEN_END - 0.02, OPEN_END + 0.02, 0, 1))
          }}
        >
          <div className="flex flex-col gap-4">
            <p style={{ 
              fontSize: "10px", 
              letterSpacing: "0.22em", 
              textTransform: "uppercase", 
              color: "rgba(255,255,255,0.3)",
              fontWeight: 500
            }}>
              — Opening
            </p>
            <h2 style={{ 
              fontSize: "clamp(28px, 6vw, 56px)", 
              fontWeight: 300, 
              lineHeight: "1.1",
              letterSpacing: "-0.03em"
            }}>
              Revealing
              <br />
              <span style={{ 
                fontFamily: "var(--font-playfair, 'Georgia', serif)", 
                fontStyle: "italic", 
                color: "var(--orange)" 
              }}>
                the layers
              </span>
            </h2>
            <p style={{ 
              fontSize: "clamp(12px, 2.5vw, 13px)", 
              lineHeight: "1.6", 
              color: "rgba(255,255,255,0.38)",
              maxWidth: "260px"
            }}>
              Watch as each ingredient finds its place in perfect harmony.
            </p>
          </div>
        </div>
      )}

      {/* ── OPENING HINT (bottom) ───────────────────────────────────────── */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center transition-opacity duration-300"
        style={{ opacity: openingOpacity }}
      >
        <p className="text-label">Scroll to open the burger</p>
      </div>

      {/* ── INGREDIENT STORY PANEL ─────────────────────────────── */}
      {showPanel && copy && cfg && (
        <div
          key={active!.key}
          className="absolute left-0 pointer-events-none flex flex-col transition-all duration-500"
          style={{
            top: window.innerWidth < 768 ? "15%" : "50%",
            transform: window.innerWidth < 768 
              ? `translateY(0) translateX(${panelTranslateX}px)` 
              : `translateY(-50%) translateX(${panelTranslateX}px)`,
            opacity: panelOpacity,
            maxWidth: "min(320px, 85vw)",
            paddingLeft: "clamp(1rem, 4vw, 4rem)",
            paddingRight: "1rem",
          }}
        >
          {/* Label */}
          <p className="text-label mb-2" style={{ color: cfg.color, fontSize: "clamp(9px, 2vw, 10px)" }}>
            {copy.label}
          </p>

          {/* Headline — smaller to save vertical space */}
          <h2
            className="font-light leading-none mb-2"
            style={{ fontSize: "clamp(1.75rem, 5vw, 4rem)", letterSpacing: "-0.03em" }}
          >
            {copy.headline}
          </h2>

          {/* Accent line */}
          <div
            className="mb-3 origin-left transition-all duration-500"
            style={{ 
              background: cfg.color, 
              width: "clamp(24px, 8vw, 36px)", 
              height: 1,
              transform: `scaleX(${panelOpacity})`
            }}
          />

          {/* Sub name */}
          <p
            className="font-medium uppercase mb-2"
            style={{ color: cfg.color, fontSize: "clamp(9px, 2vw, 10.5px)", letterSpacing: "0.14em" }}
          >
            {copy.sub}
          </p>

          {/* Description — tighter line height */}
          <p
            className="mb-3"
            style={{
              fontSize: "clamp(11px, 2.2vw, 14px)",
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
                padding: "clamp(4px, 1vw, 5px) clamp(10px, 2.5vw, 12px)",
              }}
            >
              <div
                className="rounded-full flex-shrink-0"
                style={{ background: cfg.color, width: "clamp(4px, 1vw, 5px)", height: "clamp(4px, 1vw, 5px)" }}
              />
              <span
                className="font-medium tracking-wide"
                style={{ color: cfg.color, fontSize: "clamp(9px, 2vw, 10.5px)" }}
              >
                {copy.stat}
              </span>
            </div>
          )}
        </div>
      )}

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
        <div className="container-custom h-full flex flex-col justify-between py-8 md:py-0 md:justify-center">
          {/* Mobile: Top section with text + buttons */}
          <div className="block md:hidden text-center" style={{ paddingTop: '19vh' }}>
            <p className="text-label mb-3">— The Perfect Burger</p>
            <h2 className="font-light leading-none mb-2"
              style={{ fontSize: "clamp(1.8rem, 6vw, 2.5rem)", letterSpacing: "-0.03em" }}>
              Crafted to
              <br />
              <em style={{ fontFamily: "var(--font-playfair, 'Georgia', serif)", fontStyle: "italic", color: "var(--orange)" }}>
                perfection.
              </em>
            </h2>
            <p className="max-w-xs mx-auto mb-4" style={{ fontSize: "clamp(12px, 2.5vw, 13px)", lineHeight: "1.5", color: "rgba(255,255,255,0.45)" }}>
              Every layer considered. Every ingredient sourced with intention.
            </p>
            {/* Buttons side by side on mobile */}
            <div className="flex gap-2 justify-center">
              <button className="btn-primary" style={{ fontSize: "10px", padding: "8px 16px" }}>
                Order Now
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="btn-ghost" style={{ fontSize: "10px", padding: "8px 16px" }}>Find Location</button>
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left side - Main CTA */}
            <div className="text-center md:text-left">
              <p className="text-label mb-5">— The Perfect Burger</p>
              <h2 className="font-light leading-none mb-3"
                style={{ fontSize: "clamp(2rem, 6vw, 4.8rem)", letterSpacing: "-0.03em" }}>
                Crafted to
                <br />
                <em style={{ fontFamily: "var(--font-playfair, 'Georgia', serif)", fontStyle: "italic", color: "var(--orange)" }}>
                  perfection.
                </em>
              </h2>
              <p className="max-w-xs mx-auto md:mx-0 mb-8" style={{ fontSize: "clamp(13px, 2.5vw, 14px)", lineHeight: "1.6", color: "rgba(255,255,255,0.45)" }}>
                Every layer considered. Every ingredient sourced with intention.
                One unforgettable experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="btn-primary" style={{ fontSize: "clamp(11px, 2.2vw, 13px)", padding: "clamp(10px, 2vw, 12px) clamp(20px, 4vw, 26px)" }}>
                  Order Now
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="btn-ghost" style={{ fontSize: "clamp(11px, 2.2vw, 13px)", padding: "clamp(10px, 2vw, 12px) clamp(20px, 4vw, 26px)" }}>Find a Location</button>
              </div>
            </div>

            {/* Right side - Stats/Quality indicators */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-around md:justify-center gap-6 md:gap-7 text-center md:text-right">
              {[
                { val: "8", label: "Premium Ingredients", detail: "Hand-selected daily" },
                { val: "100%", label: "Natural", detail: "No artificial flavors" },
                { val: "★★★★★", label: "Quality", detail: "Michelin-rated" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-light tracking-tighter mb-2" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "var(--orange)" }}>
                    {stat.val}
                  </div>
                  <div className="font-medium mb-1" style={{ fontSize: "clamp(13px, 2.5vw, 16px)" }}>{stat.label}</div>
                  <div className="text-label" style={{ fontSize: "clamp(8px, 2vw, 10px)" }}>{stat.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Bottom section with stats below burger */}
          <div className="block md:hidden" style={{ paddingBottom: '8vh' }}>
            <div className="flex items-center justify-around gap-4 text-center">
              {[
                { val: "8", label: "Premium", sublabel: "Ingredients" },
                { val: "100%", label: "Natural", sublabel: "Flavors" },
                { val: "★★★★★", label: "Quality", sublabel: "Rated" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="font-light tracking-tighter mb-1" style={{ fontSize: "clamp(1.3rem, 5vw, 1.8rem)", color: "var(--orange)" }}>
                    {stat.val}
                  </div>
                  <div className="font-medium" style={{ fontSize: "11px", lineHeight: "1.3" }}>
                    {stat.label}
                    <br />
                    <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>{stat.sublabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
