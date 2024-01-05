"use client"

import { technologies } from "@/constants";
import BallCanvas from "./canvas/Ball";
import { useAppContext } from "@/lib/AppContext";
import { useInView } from "react-intersection-observer";
import { motion } from 'framer-motion'
import { fadeIn } from "@/utils/motion";

const Tech = () => {
  const {theme} = useAppContext();
  const [ref, inView] = useInView({
    triggerOnce: true, // Only trigger once when the component comes into view
  });
  return (
    <div className={`flex flex-row flex-wrap justify-center gap-10 px-4 py-8 ${theme === 'light' ? '' : 'bg-near-black'}`} ref={ref}>
      {technologies.map((technology, index) => (
        <div className='w-28 h-28' key={technology.name}>
        <motion.div
        initial='hidden'
        animate={inView ? 'show' : 'hidden'}
        key={technology.name} variants={fadeIn("up", "spring", index * 0.5, .75)}
        >
            <BallCanvas icon={technology.icon}/>
        </motion.div>
        </div>
      ))}
    </div>
  );
};

export default Tech;
