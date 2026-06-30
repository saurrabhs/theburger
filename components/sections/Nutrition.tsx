"use client";

import { motion } from "framer-motion";
import { FiZap, FiActivity, FiHeart, FiShield } from "react-icons/fi";

export default function Nutrition() {
  const nutritionData = [
    {
      icon: FiZap,
      label: "Energy",
      value: "650",
      unit: "kcal",
      description: "Premium fuel for your day",
    },
    {
      icon: FiActivity,
      label: "Protein",
      value: "42",
      unit: "g",
      description: "High-quality grass-fed beef",
    },
    {
      icon: FiHeart,
      label: "Quality",
      value: "100",
      unit: "%",
      description: "Fresh, natural ingredients",
    },
    {
      icon: FiShield,
      label: "Crafted",
      value: "2024",
      unit: "",
      description: "Perfected recipe",
    },
  ];

  return (
    <section id="nutrition" className="section relative bg-dark-900">
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
            Nutritional Excellence
          </span>
          <h2 className="mb-6">
            Designed For
            <br />
            <span className="text-accent-orange">Performance</span>
          </h2>
          <p className="text-premium max-w-2xl mx-auto">
            Every bite delivers balanced nutrition without compromise.
            Premium ingredients, optimal ratios.
          </p>
        </motion.div>

        {/* Nutrition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {nutritionData.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="glass rounded-2xl p-8 text-center group hover:border-accent-orange transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent-orange/10 flex items-center justify-center group-hover:bg-accent-orange/20 transition-colors">
                <item.icon className="w-8 h-8 text-accent-orange" />
              </div>

              {/* Value */}
              <div className="mb-2">
                <span className="text-5xl font-bold">{item.value}</span>
                <span className="text-2xl text-accent-orange ml-1">{item.unit}</span>
              </div>

              {/* Label */}
              <h4 className="text-lg font-semibold mb-2">{item.label}</h4>
              <p className="text-sm text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 glass rounded-2xl p-8 text-center"
        >
          <p className="text-sm text-gray-400 leading-relaxed max-w-3xl mx-auto">
            <span className="text-white font-medium">Allergen Information:</span> Contains
            gluten, dairy, and soy. Prepared in a kitchen that handles nuts. All ingredients
            are carefully sourced from verified suppliers meeting our premium standards.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
