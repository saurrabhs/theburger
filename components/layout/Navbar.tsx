"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

// Scroll phase constants matching TextOverlay
const HERO_END      = 0.04;
const STORY_START   = 0.12;
const STORY_END     = 0.88;
const ASSEMBLE_END  = 0.90;

// Map nav links to scroll progress values
const NAV_LINKS = [
  { name: "Story",       scrollTarget: 0.08 }, // "Revealing the layers" fully visible
  { name: "Ingredients", scrollTarget: STORY_START + 0.05 }, // First ingredient fully visible
  { name: "Experience",  scrollTarget: 0.95 },
];

export default function Navbar() {
  const [hidden, setHidden]   = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
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

  // Calculate scroll progress and determine active section
  useEffect(() => {
    const updateActiveSection = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);

      // Determine which section is active based on scrollProgress
      if (scrollProgress < 0.06) {
        setActiveIndex(-1); // No section active (hero)
      } else if (scrollProgress < STORY_START) {
        setActiveIndex(0); // Story (opening/revealing phase)
      } else if (scrollProgress < STORY_END) {
        setActiveIndex(1); // Ingredients (story phase)
      } else {
        setActiveIndex(2); // Experience
      }
    };

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    updateActiveSection();
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  // Smooth scroll to target scroll progress
  const scrollToProgress = (targetProgress: number) => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollTop = targetProgress * scrollHeight;
    
    window.scrollTo({
      top: targetScrollTop,
      behavior: "smooth"
    });
    
    setMenu(false);
  };

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
            {NAV_LINKS.map((link, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={link.name}
                  onClick={() => scrollToProgress(link.scrollTarget)}
                  className="relative text-[0.58rem] font-medium tracking-[0.12em] uppercase transition-all duration-500 hover:text-white cursor-pointer"
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
                </button>
              );
            })}
          </div>

          {/* CTA - desktop */}
          <button
            onClick={() => scrollToProgress(0.95)}
            className="hidden md:block btn-primary text-[0.58rem] py-1.5 px-4 scale-90"
          >
            Order Now
          </button>

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
          <button
            key={link.name}
            onClick={() => scrollToProgress(link.scrollTarget)}
            className="text-sm font-medium tracking-[0.12em] uppercase text-white/60 hover:text-white transition-colors py-2 border-b border-white/5 last:border-0 text-left"
          >
            {link.name}
          </button>
        ))}
        <button 
          onClick={() => scrollToProgress(0.95)} 
          className="btn-primary text-center mt-2"
        >
          Order Now
        </button>
      </motion.div>
    </>
  );
}
