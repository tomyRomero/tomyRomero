"use client";

import { technologies } from "@/constants";
import { useAppContext } from "@/lib/AppContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.6 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } },
};

const Tech = () => {
  const { theme } = useAppContext();  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); 
  }, []);

  if (!mounted) return null;

  return (
    <section className="flex flex-col items-center px-6 sm:px-8 md:px-12 lg:px-16">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }}
        className={`relative z-10 px-6 py-3 font-bold text-lg shadow-lg 
          ${theme === "light" ? "text-primary-light" : "text-primary-dark"} 
          ${theme === "light" ? "border-primary-light" : "border-primary-dark"} 
          border-2 rounded-xl transition-all duration-300 ease-in-out mb-6`}
      >
        🚀 Tech Stack
      </motion.div>

      {/* Icons Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 sm:gap-8 md:gap-10 lg:gap-12"
      >
        {technologies.map((tech, index) => (
          <motion.div
            key={tech.name}
            variants={itemVariants}
            whileHover={{ scale: 1.1, rotate: 3 }}
            className="relative flex flex-col items-center"
          >
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center rounded-xl shadow-lg 
                transition-all duration-300 ease-out transform hover:-translate-y-2
                ${theme === "light" ? "bg-primary-light/40" : "bg-primary-dark/50"}`}  
            >
              <img src={tech.icon} alt={tech.name} className="w-2/3 h-2/3 object-contain" />
            </div>
            <p className={`mt-2 text-sm sm:text-base font-medium text-center ${theme === "light" ? "text-near-black" : "text-white"}`}>
              {tech.name}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Tech;