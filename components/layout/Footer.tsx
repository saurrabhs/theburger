"use client";

import { motion } from "framer-motion";
import { FiInstagram, FiTwitter, FiFacebook, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: ["Story", "Ingredients", "Nutrition", "Experience"],
    },
    {
      title: "Company",
      links: ["About", "Careers", "Press", "Contact"],
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Cookies", "Licenses"],
    },
  ];

  const socialLinks = [
    { icon: FiInstagram, href: "#", label: "Instagram" },
    { icon: FiTwitter, href: "#", label: "Twitter" },
    { icon: FiFacebook, href: "#", label: "Facebook" },
    { icon: FiLinkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="relative bg-dark-900 border-t border-white/5">
      <div className="container-custom py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-4">
                THE <span className="text-accent-orange">BURGER</span>
              </h3>
              <p className="text-gray-400 max-w-sm mb-6">
                Crafting the finest burger experience through precision,
                passion, and perfect ingredients.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 glass rounded-full flex items-center justify-center text-gray-400 hover:text-accent-orange hover:border-accent-orange transition-all"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sectionIndex * 0.1 + 0.2, duration: 0.6 }}
              >
                <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-gray-500">
            © 2024 The Burger. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-700">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <span className="text-gray-700">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Accessibility
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
