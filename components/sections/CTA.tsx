"use client";

import { motion } from "framer-motion";
import { FiArrowRight, FiMail } from "react-icons/fi";

export default function CTA() {
  return (
    <section className="section relative bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-orange/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block"
            >
              <span className="inline-block px-4 py-2 glass rounded-full text-sm font-medium text-accent-orange mb-6">
                Limited Availability
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-6"
            >
              Ready To Experience
              <br />
              <span className="text-accent-orange">Perfection?</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-premium max-w-2xl mx-auto mb-8"
            >
              Join the waitlist to be among the first to experience the future of burgers.
              Limited spots available.
            </motion.p>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="max-w-md mx-auto mb-8"
            >
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full glass pl-12 pr-4 py-4 rounded-full focus:outline-none focus:border-accent-orange transition-colors"
                  />
                </div>
                <button className="btn-primary whitespace-nowrap flex items-center gap-2">
                  Join Waitlist
                  <FiArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-sm text-gray-500"
            >
              Join <span className="text-accent-orange font-medium">2,547</span> others
              already on the waitlist
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
