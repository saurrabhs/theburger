"use client";

import { motion } from "framer-motion";
import { BURGER_CONFIG } from "@/config/BurgerConfig";

export default function IngredientStory() {
  const ingredients = Object.values(BURGER_CONFIG);

  return (
    <section id="ingredients" className="section relative bg-dark-800">
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
            Every Layer Matters
          </span>
          <h2 className="mb-6">
            Eight Perfect
            <br />
            <span className="text-accent-orange">Ingredients</span>
          </h2>
          <p className="text-premium max-w-2xl mx-auto">
            Each ingredient is carefully sourced and prepared to create
            the ultimate burger experience.
          </p>
        </motion.div>

        {/* Ingredients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ingredients.map((ingredient, index) => (
            <motion.div
              key={ingredient.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass rounded-2xl p-6 group cursor-pointer transition-all duration-300 hover:border-accent-orange"
            >
              {/* Color indicator */}
              <div
                className="w-12 h-12 rounded-full mb-4 flex items-center justify-center"
                style={{ backgroundColor: ingredient.color + "20" }}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: ingredient.color }}
                />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2 group-hover:text-accent-orange transition-colors">
                {ingredient.displayName}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {ingredient.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
