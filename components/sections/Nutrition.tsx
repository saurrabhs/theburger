"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { BURGER_CONFIG } from "@/config/BurgerConfig";

// ── Animated counter ─────────────────────────────────────────────
function Counter({ to, duration = 2 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const raf = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * to));
      if (t < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, to, duration]);

  return <span ref={ref}>{val}</span>;
}

// ── Circular ring stat ───────────────────────────────────────────
function RingStat({ label, value, unit, max, color }: {
  label: string; value: number; unit: string; max: number; color: string;
}) {
  const ref = useRef<SVGCircleElement>(null);
  const inView = useInView(ref as any, { once: true });
  const r = 44;
  const circ = 2 * Math.PI * r;
  const pct = value / max;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-28 h-28">
        <svg width="112" height="112" viewBox="0 0 112 112" className="rotate-[-90deg]">
          <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
          <motion.circle
            ref={ref}
            cx="56" cy="56" r={r}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={inView ? { strokeDashoffset: circ * (1 - pct) } : {}}
            transition={{ duration: 2, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-light leading-none tracking-tight">
            <Counter to={value} />
          </span>
          <span className="text-xs text-white/30 mt-0.5">{unit}</span>
        </div>
      </div>
      <span className="text-label">{label}</span>
    </div>
  );
}

// ── Assembly steps ────────────────────────────────────────────────
const STEPS = Object.values(BURGER_CONFIG).reverse().map((cfg, i) => ({
  n: i + 1,
  name: cfg.displayName,
  color: cfg.color,
}));

export default function Nutrition() {
  return (
    <section id="nutrition" className="relative section-padding" style={{ background: "var(--dark-900)" }}>

      {/* ── Section header — centered ─────────────────────────── */}
      <div className="container-custom mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-label mb-6">— Nutrition & Craft</p>
          <h2 className="font-light leading-none"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5.5rem)", letterSpacing: "-0.03em" }}>
            Engineered for
            <br />
            <em style={{ fontFamily: "var(--font-playfair, 'Georgia', serif)", fontStyle: "italic", color: "var(--orange)" }}>
              excellence.
            </em>
          </h2>
        </motion.div>
      </div>

      {/* ── Big stats row — full width, evenly spaced ─────────── */}
      <div className="border-y border-white/[0.04] py-14 mb-20">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/[0.04]">
            {[
              { val: 650, unit: "kcal", label: "Calories",  color: "var(--orange)" },
              { val: 42,  unit: "g",    label: "Protein",   color: "var(--amber)"  },
              { val: 100, unit: "%",    label: "Natural",   color: "#90EE90"       },
              { val: 8,   unit: "layers",label: "Crafted",  color: "#87CEEB"       },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col items-center py-6"
              >
                <div className="font-light tracking-tighter leading-none mb-2"
                  style={{ fontSize: "clamp(2.5rem, 4vw, 4.5rem)" }}>
                  <Counter to={s.val} />
                  <span className="text-xl ml-1" style={{ color: s.color, opacity: 0.7 }}>{s.unit}</span>
                </div>
                <div className="text-label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Two columns: ring charts | assembly ─────────────────── */}
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left — ring charts 2×2 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="text-label mb-10">Nutritional Profile</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-12">
              <RingStat label="Calories"  value={650} unit="kcal" max={1000} color="var(--orange)" />
              <RingStat label="Protein"   value={42}  unit="g"    max={60}   color="var(--amber)"  />
              <RingStat label="Freshness" value={100} unit="%"    max={100}  color="#90EE90"        />
              <RingStat label="Quality"   value={100} unit="%"    max={100}  color="#87CEEB"        />
            </div>
          </motion.div>

          {/* Right — assembly list */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          >
            <p className="text-label mb-10">Assembly Order</p>
            <div className="flex flex-col gap-0">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.name}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="flex items-center gap-5 py-4 border-b border-white/[0.04] last:border-0 group"
                >
                  {/* Step number circle */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `${step.color}12`,
                      border: `1px solid ${step.color}25`,
                      color: step.color,
                    }}
                  >
                    {step.n}
                  </div>

                  {/* Name */}
                  <span className="text-sm text-white/60 group-hover:text-white/90 transition-colors duration-300 flex-1">
                    {step.name}
                  </span>

                  {/* Color accent bar */}
                  <div
                    className="w-6 h-px shrink-0 opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: step.color }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

    </section>
  );
}
