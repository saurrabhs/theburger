"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const NAV_LINKS = [
  { name: "Story",       href: "#story" },
  { name: "Ingredients", href: "#ingredients" },
  { name: "Nutrition",   href: "#nutrition" },
  { name: "Experience",  href: "#experience" },
];

export default function Navbar() {
  const [hidden, setHidden]   = useState(false);
  const [active, setActive]   = useState("");
  const [menuOpen, setMenu]   = useState(false);
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    if (y > lastY.current && y > 80) setHidden(true);
    else setHidden(false);
    lastY.current = y;
  });

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-[900] flex justify-center pt-6 px-6"
      >
        <nav className="glass-strong rounded-full px-6 py-3 flex items-center gap-8 shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
          {/* Logo */}
          <a href="#" className="text-sm font-semibold tracking-[0.15em] uppercase whitespace-nowrap">
            The <span className="text-accent-orange">Burger</span>
          </a>

          {/* Divider */}
          <div className="hidden md:block w-px h-4 bg-white/10" />

          {/* Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-medium tracking-[0.12em] uppercase text-white/50 hover:text-white transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-4 bg-white/10" />

          {/* CTA */}
          <a
            href="#experience"
            className="hidden md:block btn-primary text-xs py-2.5 px-5"
          >
            Order Now
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenu(!menuOpen)}
            aria-label="Menu"
          >
            <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
            <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ opacity: menuOpen ? 1 : 0, y: menuOpen ? 0 : -20 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-x-6 top-24 z-[800] glass-strong rounded-2xl p-6 flex flex-col gap-4 md:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={() => setMenu(false)}
            className="text-sm font-medium tracking-[0.12em] uppercase text-white/60 hover:text-white transition-colors py-2 border-b border-white/5 last:border-0"
          >
            {link.name}
          </a>
        ))}
        <a href="#experience" className="btn-primary text-center mt-2" onClick={() => setMenu(false)}>
          Order Now
        </a>
      </motion.div>
    </>
  );
}
