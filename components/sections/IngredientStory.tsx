"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BURGER_CONFIG } from "@/config/BurgerConfig";

const COPY: Record<string, { headline: string; body: string; number: string; tag: string }> = {
  "Brioche Top":      { number: "01", headline: "The Crown",      tag: "Brioche Bun",       body: "Lightly toasted brioche — golden, pillowy, structured enough to hold everything below." },
  "Fresh Lettuce":    { number: "02", headline: "The Freshness",  tag: "Iceberg Lettuce",   body: "Garden-grown iceberg pulled at dawn. A whisper of crunch against the warm layers." },
  "Heirloom Tomato":  { number: "03", headline: "The Acidity",    tag: "Heirloom Tomato",   body: "Vine-ripened, vivid, slightly tart — the counterpoint every great burger needs." },
  "Aged Cheddar":     { number: "04", headline: "The Melt",       tag: "Aged Cheddar",      body: "18-month aged cheddar draped warm over the patty. Rich, nutty, irresistible." },
  "Prime Beef Patty": { number: "05", headline: "The Heart",      tag: "Grass-Fed Beef",    body: "Dry-aged, hand-formed, flame-grilled to a precise medium crust." },
  "Kosher Pickles":   { number: "06", headline: "The Bite",       tag: "Kosher Pickles",    body: "House-brined for 21 days. Sharp, vinegared crunch cutting through the richness." },
  "Caramelized Onions":{ number: "07", headline: "The Depth",     tag: "Caramelized Onions",body: "Slow-cooked at low heat for ninety minutes. Sweet, jammy, impossibly fragrant." },
  "Brioche Bottom":   { number: "08", headline: "The Foundation", tag: "Brioche Base",      body: "Mirror of the crown. Sturdier, toasted with a touch of clarified butter." },
};

const INGREDIENTS = Object.values(BURGER_CONFIG);

function IngredientRow({ ing, index }: { ing: typeof INGREDIENTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const y       = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const copy    = COPY[ing.displayName] ?? { number: String(index + 1).padStart(2, "0"), headline: ing.displayName, tag: ing.displayName, body: ing.description };
  const isEven  = index % 2 === 1;

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className="py-20 border-b border-white/[0.04] last:border-0"
    >
      <div className="container-custom">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center ${isEven ? "" : ""}`}>

          {/* Number + headline side */}
          <div className={isEven ? "lg:order-2" : ""}>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-label">{copy.number}</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <h3
              className="font-light leading-none mb-4"
              style={{ fontSize: "clamp(3rem, 6vw, 6rem)", letterSpacing: "-0.03em" }}
            >
              {copy.headline}
            </h3>

            {/* Accent line in ingredient color */}
            <div className="w-10 h-px my-6" style={{ background: ing.color }} />

            <p className="text-sm font-medium tracking-[0.12em] uppercase mb-3"
              style={{ color: ing.color }}>
              {copy.tag}
            </p>
            <p className="text-body max-w-sm">{copy.body}</p>
          </div>

          {/* Visual card side — clean typography, no fake images */}
          <motion.div style={{ y }} className={isEven ? "lg:order-1" : ""}>
            <div
              className="relative rounded-2xl overflow-hidden p-10 flex flex-col justify-between"
              style={{
                minHeight: 280,
                background: `linear-gradient(135deg, ${ing.color}08 0%, ${ing.color}03 50%, transparent 100%)`,
                border: `1px solid ${ing.color}12`,
              }}
            >
              {/* Large number watermark */}
              <div
                className="absolute right-8 top-4 font-light select-none pointer-events-none"
                style={{
                  fontSize: "clamp(5rem, 10vw, 9rem)",
                  letterSpacing: "-0.05em",
                  color: ing.color,
                  opacity: 0.08,
                  lineHeight: 1,
                }}
              >
                {copy.number}
              </div>

              <div>
                <p className="text-label mb-4">{copy.tag}</p>
                <p
                  className="font-light leading-tight"
                  style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", letterSpacing: "-0.02em" }}
                >
                  {copy.headline}
                </p>
              </div>

              {/* Bottom accent */}
              <div className="mt-8 flex items-center gap-4">
                <div className="w-6 h-px" style={{ background: ing.color }} />
                <span className="text-label" style={{ color: ing.color }}>Layer {copy.number}</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}

export default function IngredientStory() {
  return (
    <section id="ingredients" className="relative" style={{ background: "var(--dark-900)" }}>

      {/* Section header */}
      <div className="container-custom pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-label mb-6">— The Ingredients</p>
          <h2 className="font-light leading-none" style={{ fontSize: "clamp(2.5rem, 5vw, 5.5rem)", letterSpacing: "-0.03em" }}>
            Every layer
            <br />
            <em style={{ fontFamily: "var(--font-playfair, 'Georgia', serif)", fontStyle: "italic", color: "var(--orange)" }}>
              tells a story.
            </em>
          </h2>
        </motion.div>
      </div>

      {/* Ingredient rows */}
      {INGREDIENTS.map((ing, i) => (
        <IngredientRow key={ing.displayName} ing={ing} index={i} />
      ))}
    </section>
  );
}
