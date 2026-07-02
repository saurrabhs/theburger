"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const LINKS = [
  { label: "Story",       href: "#story" },
  { label: "Ingredients", href: "#ingredients" },
  { label: "Nutrition",   href: "#nutrition" },
  { label: "Experience",  href: "#experience" },
];

const SOCIALS = [
  { name: "Instagram", href: "#", icon: "IG" },
  { name: "Twitter",   href: "#", icon: "TW" },
  { name: "TikTok",    href: "#", icon: "TK" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <footer className="relative bg-dark-900 border-t border-white/[0.04]" style={{ paddingTop: "4rem", paddingBottom: 0 }}>

      {/* Top row */}
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">

          {/* Brand */}
          <div>
            <p className="text-label mb-4">The Burger</p>
            <h3 className="text-section font-light leading-none mb-6">
              Craft.
              <br />
              <em style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "var(--orange)" }}>
                Perfection.
              </em>
            </h3>
            <p className="text-body max-w-xs">
              A premium burger experience designed for those who believe the finest things deserve time, craft, and intention.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <p className="text-label mb-2">Navigation</p>
            {LINKS.map((l) => (
              <a key={l.label} href={l.href}
                className="text-sm text-white/40 hover:text-white transition-colors duration-300 w-fit">
                {l.label}
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-label mb-4">Stay in the loop</p>
            <p className="text-body mb-6 text-sm">
              Be the first to know about new ingredients, limited drops, and behind-the-craft stories.
            </p>

            {sent ? (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-white/60"
              >
                ✓ You're on the list.
              </motion.p>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 bg-white/[0.04] border border-white/[0.08] rounded-full px-5 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-colors"
                />
                <button type="submit" className="btn-primary py-3 px-5 text-xs shrink-0">
                  Join
                </button>
              </form>
            )}
            
            {/* Support - Buy Me a Coffee */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/[0.04]">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-white/40">
                  Enjoyed this? Support us.
                </p>
                <p className="text-xs text-white/20">Made with passion</p>
              </div>
              
              <motion.a
                href="https://buymeacoffee.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500/90 to-orange-600/90 rounded-full text-xs font-semibold text-white transition-all duration-300 hover:shadow-[0_20px_60px_rgba(255,107,53,0.3)] shrink-0"
              >
                ☕ Buy Me a Coffee
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/[0.04] pt-8 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-label">© 2026 The Burger. All rights reserved.</p>

          <div className="flex items-center gap-6">
            {SOCIALS.map((s) => (
              <motion.a
                key={s.name}
                href={s.href}
                whileHover={{ y: -2 }}
                className="text-xs font-medium tracking-[0.15em] text-white/30 hover:text-white transition-colors"
                aria-label={s.name}
              >
                {s.icon}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {["Privacy", "Terms"].map((l) => (
              <a key={l} href="#" className="text-label hover:text-white/50 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
