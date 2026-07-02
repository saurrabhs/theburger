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
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    if (y > lastY.current && y > 80) setHidden(true);
    else setHidden(false);
    setScrolled(y > 20);
    lastY.current = y;
  });

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-100px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ 
          y: hidden ? -100 : 0, 
          opacity: 1,
          scale: scrolled ? 0.92 : 1
        }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-[900] flex justify-center pt-6 px-6"
      >
        <nav className="glass-strong rounded-full px-4 py-1.5 flex items-center gap-5 max-w-fit text-[0.65rem]">
          {/* Logo */}
          <a 
            href="#" 
            className="text-[0.6rem] font-medium tracking-[0.18em] uppercase whitespace-nowrap transition-colors duration-500 hover:text-white"
          >
            The <span className="text-accent-orange">Burger</span>
          </a>

          {/* Links - desktop */}
          <div className="hidden md:flex items-center gap-5">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative text-[0.58rem] font-medium tracking-[0.12em] uppercase transition-all duration-500 hover:text-white"
                  style={{ 
                    color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)'
                  }}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* CTA - desktop */}
          <a
            href="#experience"
            className="hidden md:block btn-primary text-[0.58rem] py-1.5 px-4 scale-90"
          >
            Order Now
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1 p-1"
            onClick={() => setMenu(!menuOpen)}
            aria-label="Menu"
          >
            <span className={`block w-4 h-px bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
            <span className={`block w-4 h-px bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-4 h-px bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ opacity: menuOpen ? 1 : 0, y: menuOpen ? 0 : -20 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-x-6 top-28 z-[800] glass-strong rounded-2xl p-6 flex flex-col gap-4 md:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
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
