"use client"

import React from "react";
import { Tilt } from "react-tilt";
import { motion} from "framer-motion";
import { services} from "../../constants";
import { fadeIn, textVariant, staggerContainer } from "../../utils/motion";
import Image from "next/image";
import { useAppContext } from "@/lib/AppContext";
import { useInView } from "react-intersection-observer";

//@ts-ignore
const ServiceCard = ({ index, title, icon }) =>
{
  const {theme} = useAppContext();

  return(

    <Tilt className='xs:w-[250px] max-sm:mx-auto w-full'>
      <motion.div
        variants={fadeIn("right", "spring", index * 0.5, 0.75)}
        className={`w-full border-2 ${theme === "light" ? 'border-primary-light shadow-card':'border-primary-dark white-shadow-card'} p-[1px] rounded-[20px] `}
      >
        <div
          //@ts-ignore
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className={`${theme === "light" ? 'bg-white' : 'bg-near-black'} rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col`}
        >
          <Image
            src={icon}
            alt='web-development'
            width={100}
            height={100}
            className='object-contain rounded-xl'
          />
  
          <h3 className={`${theme === "light" ? "text-near-black" : "text-white"} text-[20px] font-bold text-center`}>
            {title}
          </h3>
        </div>
      </motion.div>
    </Tilt>
  );
} 

const About = () => {
  const {theme} = useAppContext();
  // Set up the ref and inView state for the intersection observer
  const [ref, inView] = useInView({
    triggerOnce: true, // Only trigger once when the component comes into view
  });
  return (
    <motion.div
      variants={staggerContainer()}
      initial='hidden'
      animate='show'
      className={`w-full mx-auto px-20 py-6 relative z-0 ${theme === "light" ? '' : 'bg-near-black'}`}
      id={"about"}
    >
      <motion.section>
        
            <motion.div variants={textVariant()}>
              <p className={`sectionSubText ${theme === "light" ? 'text-primary-light' : 'text-primary-dark'}`}>Introduction</p>
              <h2 className={`sectionHeadText ${theme === "light" ? 'text-primary-light' : 'text-primary-dark'}`}>Overview.</h2>
            </motion.div>

            <motion.p
              variants={fadeIn("", "", 0.1, 1)}
              className={`mt-4 text-left  max-sm:text-base-semibold text-body-normal max-w-3xl leading-[30px] ${theme === "light" ? 'text-near-black' : 'text-white'}`}
            >
              I bring a robust skill set to the table, I have proficiency in Java, JavaScript, and a suite of frameworks including React, React Native, Node.js, and Next.js. My knowledge extends to AWS cloud foundations, navigating services such as S3, RDS, and EC2.
              In the realm of database management, I am well-versed in both relational databases like MySQL and also NoSQL databases such as MongoDB and Firebase. Alongside this, I possess adept knowledge of Restful APIs, and I'm skilled in crafting engaging and responsive user interfaces with CSS, Tailwind CSS, and HTML. 
              Driven by a passion for continuous learning, I am eager to collaborate closely with employers. My goal is to contribute to the creation of efficient, scalable, and user-friendly solutions that address real-world challenges. Let's build something great together!
            </motion.p>
            

        <div className='ml-8 mt-16 flex flex-wrap gap-10'
        ref={ref}>
          {services.map((service, index) => (
            <motion.div 
            initial='hidden'
            animate={inView ? 'show' : 'hidden'} // Use inView state to trigger animation
            key={service.title} variants={fadeIn("up", "spring", index * 0.5, 0.75)}

            >
              <ServiceCard index={index} {...service} />
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default About;