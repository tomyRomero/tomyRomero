"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { about, services } from "../../constants";
import { fadeIn, textVariant, staggerContainer } from "../../lib/motion";
import Image from "next/image";
import { useAppContext } from "@/lib/AppContext";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const ServiceCard = ({ index, title, icon }: { index: number; title: string; icon: string }) => {
  const { theme } = useAppContext();

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.3, 0.75)}
      whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: [0, -5, 0],
        transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
      }} // Floating animation
      className={`w-full xs:w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] p-1 rounded-3xl transition-shadow duration-300`}
    >
      <Card
        className={`${
          theme === "light" ? "bg-white" : "bg-near-black"
        } rounded-3xl py-8 px-6 min-h-[260px] flex flex-col justify-center items-center text-center shadow-none border-none`} 
      >
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.2, duration: 0.5, ease: "easeOut" }}
        >
          <Image src={icon} alt="service-icon" width={80} height={80} className="object-contain rounded-xl" />
        </motion.div>
        <h3 className={`mt-4 text-heading3-bold ${theme === "light" ? "text-near-black" : "text-white"}`}>
          {title}
        </h3>
      </Card>
    </motion.div>
  );
};

const About = () => {
  const { theme, setSelected } = useAppContext();
  const [ref, inView] = useInView({ triggerOnce: false });

  useEffect(() => {
    if (inView) setSelected(1);
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer()}
      initial={inView ? "show" : "hidden"}
      animate="show"
      className="max-w-7xl w-full mx-auto px-6 sm:px-8 md:px-12 lg:px-16 relative z-0 pt-10 max-sm:pt-2 md:pt-12"
    >
      <motion.section className="flex flex-col items-center justify-center w-full">
        {/* Title */}
        <motion.div variants={textVariant()} className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
          <h2
            className={`text-heading2-bold flex items-center gap-2 text-center ${
              theme === "light" ? "text-primary-light" : "text-primary-dark"
            }`}
          >
            <Sparkles /> About Me
          </h2>
        </motion.div>

        {/* About Description */}
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className={`max-sm:text-small-regular mt-4 text-center mx-auto px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 max-w-2xl sm:max-w-3xl md:max-w-4xl leading-[26px] xs:leading-[24px] sm:leading-[28px] md:leading-[30px] lg:leading-[32px] ${
            theme === "light" ? "text-near-black" : "text-white"
          }`}
        >
          {about}
        </motion.p>

        {/* Service Cards */}
        <div
          className="flex flex-wrap justify-center gap-4 max-sm:gap-0 md:gap-8 w-full mt-8 max-sm:mt-0 lg:mt-10"
          ref={ref}
        >
          {services.map((service, index) => (
            <ServiceCard key={service.title} index={index} {...service} />
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default About;