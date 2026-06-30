"use client";

import { motion } from "framer-motion";
import { BURGER_CONFIG } from "@/config/BurgerConfig";

export default function AssemblyTimeline() {
  const steps = [
    {
      ingredient: BURGER_CONFIG.bottomBun,
      step: 1,
      process: "Toast the brioche bun until golden brown with a slight crunch",
    },
    {
      ingredient: BURGER_CONFIG.onions,
      step: 2,
      process: "Layer caramelized onions, slow-cooked for maximum sweetness",
    },
    {
      ingredient: BURGER_CONFIG.pickles,
      step: 3,
      process: "Add house-made kosher pickles for tangy crunch",
    },
    {
      ingredient: BURGER_CONFIG.patty,
      step: 4,
      process: "Place flame-grilled grass-fed beef patty, cooked to perfection",
    },
    {
      ingredient: BURGER_CONFIG.cheese,
      step: 5,
      process: "Melt aged cheddar over the patty for creamy richness",
    },
    {
      ingredient: BURGER_CONFIG.tomato,
      step: 6,
      process: "Add vine-ripened heirloom tomato slices",
    },
    {
      ingredient: BURGER_CONFIG.lettuce,
      step: 7,
      process: "Top with crisp, garden-fresh lettuce",
    },
    {
      ingredient: BURGER_CONFIG.topBun,
      step: 8,
      process: "Crown with the toasted brioche top",
    },
  ];

  return (
    <section id="assembly" className="section relative bg-dark-800">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 glass rounded-full text-sm font-medium text-accent-orange mb-6">
            The Assembly Process
          </span>
          <h2 className="mb-6">
            Built To
            <br />
            <span className="text-accent-orange">Perfection</span>
          </h2>
          <p className="text-premium max-w-2xl mx-auto">
            Each burger is assembled with precision timing and technique,
            ensuring optimal temperature and texture.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex items-start gap-6 mb-12 last:mb-0"
            >
              {/* Step Number */}
              <div className="flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold relative"
                  style={{
                    backgroundColor: step.ingredient.color + "20",
                    color: step.ingredient.color,
                  }}
                >
                  {step.step}
                  {index < steps.length - 1 && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-12 mt-2"
                      style={{
                        background: `linear-gradient(to bottom, ${step.ingredient.color}40, transparent)`,
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="glass rounded-2xl p-6 flex-1 group hover:border-accent-orange transition-all duration-300">
                <h4 className="text-xl font-semibold mb-2 group-hover:text-accent-orange transition-colors">
                  {step.ingredient.displayName}
                </h4>
                <p className="text-gray-400 leading-relaxed">{step.process}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-16"
        >
          <button className="btn-primary">
            Experience The Process
          </button>
        </motion.div>
      </div>
    </section>
  );
}
