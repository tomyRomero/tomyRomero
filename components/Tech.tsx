"use client";

import { technologies } from "@/constants";
import BallCanvas from "./canvas/Ball";
import { useAppContext } from "@/lib/AppContext";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { slideIn } from "../lib/motion";

const Tech = () => {
  const { theme } = useAppContext();
  const [ref, inView] = useInView({ triggerOnce: true });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensure animations only run on the client
  }, []);

  // Avoid rendering animations on the server side
  if (!mounted) return null;

  return (
    <motion.div
      className={`flex flex-row flex-wrap justify-center gap-10 px-4 py-8`}
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={slideIn("left", "tween", 0.2, 1)}
    >
      {technologies.map((technology, index) => (
        <div className="w-28 h-28" key={technology.name}>
          <motion.div>
            <BallCanvas icon={technology.icon} />
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
};

export default Tech;