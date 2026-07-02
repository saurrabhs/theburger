"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { 
      delay: 0.1 + i * 0.12, 
      duration: 1.2, 
      ease: [0.23, 1, 0.32, 1] 
    },
  }),
};

const float = {
  initial: { y: 0 },
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  
  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  const leftX = useTransform(smoothMouseX, [-1, 1], [15, -15]);
  const leftY = useTransform(smoothMouseY, [-1, 1], [15, -15]);
  const rightX = useTransform(smoothMouseX, [-1, 1], [-12, 12]);
  const rightY = useTransform(smoothMouseY, [-1, 1], [-12, 12]);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden"
      style={{ 
        background: "radial-gradient(ellipse 120% 80% at 50% 40%, rgba(255,107,53,0.02) 0%, #050505 60%), linear-gradient(180deg, #050505 0%, #030303 100%)"
      }}
    >
      {/* Depth layers - radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary glow */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-60"
          style={{ 
            background: "radial-gradient(circle, rgba(255,107,53,0.08) 0%, rgba(255,182,39,0.03) 40%, transparent 70%)",
            filter: "blur(40px)"
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Secondary accent glow */}
        <div 
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full"
          style={{ 
            background: "radial-gradient(circle, rgba(255,182,39,0.04) 0%, transparent 60%)",
            filter: "blur(60px)"
          }} 
        />
        
        {/* Vignette */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 100%)"
          }}
        />
      </div>

      {/* Three-column layout: left text | burger center | right stats */}
      <div className="absolute inset-0 z-40 pointer-events-none grid grid-cols-[1.1fr_auto_0.9fr] lg:grid-cols-[1.1fr_520px_0.9fr] gap-0 items-center px-10 lg:px-20 pt-20">

        {/* LEFT column */}
        <motion.div 
          className="flex flex-col justify-center items-start pr-12 lg:pr-20"
          style={{ x: leftX, y: leftY, gap: "12px" }}
        >
          <motion.p 
            variants={fadeUp} 
            initial="hidden" 
            animate="visible" 
            custom={0} 
            style={{ 
              fontSize: "9px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.28)",
              fontWeight: 500,
              margin: 0
            }}
          >
            CRAFT BURGER EXPERIENCE
          </motion.p>

          <motion.h1
            variants={fadeUp} 
            initial="hidden" 
            animate="visible" 
            custom={1}
            style={{ 
              fontSize: "clamp(28px, 4vw, 50px)",
              lineHeight: "0.88",
              letterSpacing: "-0.04em",
              fontWeight: 300,
              margin: 0
            }}
          >
            The Art
            <br />
            <em style={{ 
              fontFamily: "var(--font-playfair, 'Georgia', serif)", 
              fontStyle: "italic", 
              color: "#FF6B35",
              fontWeight: 300
            }}>
              of Craft
            </em>
            <br />
            Perfection
          </motion.h1>

          <motion.p
            variants={fadeUp} 
            initial="hidden" 
            animate="visible" 
            custom={2}
            style={{ 
              fontSize: "12px",
              lineHeight: "1.55",
              color: "rgba(255, 255, 255, 0.35)",
              fontWeight: 300,
              letterSpacing: "0.003em",
              maxWidth: "280px",
              margin: 0
            }}
          >
            Eight meticulously sourced ingredients assembled into one unforgettable composition.
          </motion.p>

          <motion.div
            variants={fadeUp} 
            initial="hidden" 
            animate="visible" 
            custom={3}
            className="pointer-events-auto"
            style={{ display: "flex", gap: "10px", marginTop: "4px" }}
          >
            <a 
              href="#ingredients" 
              className="btn-primary group"
              style={{ 
                fontSize: "10.5px",
                padding: "8px 18px"
              }}
            >
              Discover the Craft
              <motion.svg 
                width="12" 
                height="12" 
                viewBox="0 0 16 16" 
                fill="none"
                className="group-hover:translate-x-1 transition-transform duration-500"
              >
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            </a>
            <a 
              href="#experience-360" 
              className="btn-ghost"
              style={{ 
                fontSize: "10.5px",
                padding: "8px 18px"
              }}
            >
              360° View
            </a>
          </motion.div>
        </motion.div>

        {/* CENTER column — empty space for the fixed 3D burger (rendered behind at z-30) */}
        <div className="h-full" />

        {/* RIGHT column - Premium stats */}
        <motion.div 
          className="flex flex-col justify-center items-end gap-12 pl-12 lg:pl-20 text-right"
          style={{ x: rightX, y: rightY }}
        >

          {/* Premium quality indicators */}
          {[
            { 
              icon: "✦", 
              value: "8", 
              label: "Signature Layers",
              subtext: "Precision crafted"
            },
            { 
              icon: "◆", 
              value: "100%", 
              label: "Natural",
              subtext: "Farm to table"
            },
            { 
              icon: "★", 
              value: "5.0", 
              label: "Excellence",
              subtext: "Chef curated"
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              variants={fadeUp} 
              initial="hidden" 
              animate="visible" 
              custom={i + 2}
              className="group"
            >
              <div className="flex items-baseline justify-end gap-2 mb-1">
                <span className="text-orange-500/40 text-sm">{item.icon}</span>
                <span className="text-4xl font-light tracking-tighter">{item.value}</span>
              </div>
              <div className="text-label mb-0.5">{item.label}</div>
              <div className="text-[0.6rem] tracking-wider uppercase text-white/20 font-light">
                {item.subtext}
              </div>
            </motion.div>
          ))}

          {/* Elegant divider */}
          <motion.div
            variants={fadeUp} 
            initial="hidden" 
            animate="visible" 
            custom={5}
            className="w-px h-20 self-end opacity-30"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(255,107,53,0.3), transparent)" }}
          />

          {/* Heritage badge */}
          <motion.div
            variants={fadeUp} 
            initial="hidden" 
            animate="visible" 
            custom={6}
            className="text-right"
          >
            <p className="text-label mb-1.5">Est.</p>
            <p className="text-3xl font-light tracking-tight">2024</p>
            <p className="text-[0.6rem] tracking-wider uppercase text-white/20 font-light mt-0.5">
              Culinary excellence
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue with premium animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 2.5, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4 pointer-events-none"
      >
        <motion.span 
          className="text-label"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          Scroll to explore
        </motion.span>
        <motion.div
          animate={{ 
            scaleY: [1, 1.8, 1], 
            opacity: [0.3, 1, 0.3] 
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 origin-top"
          style={{ background: "linear-gradient(to bottom, var(--orange), transparent)" }}
        />
      </motion.div>
    </section>
  );
}
