"use client"

import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { services} from "../../constants";
import { fadeIn, textVariant, staggerContainer } from "../../utils/motion";
import Image from "next/image";
import { useAppContext } from "@/lib/AppContext";

//@ts-ignore
const ServiceCard = ({ index, title, icon }) =>
{
  const {theme} = useAppContext();

  return(

    <Tilt className='xs:w-[250px] sm:mx-auto w-full'>
      <motion.div
        variants={fadeIn("right", "spring", index * 0.5, 0.75)}
        className={`w-full ${theme === "light" ? 'light-gradient':'dark-gradient'} p-[1px] rounded-[20px] shadow-card`}
      >
        
      
        <div
          //@ts-ignore
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className={`${theme === "light" ? 'bg-near-black' : 'bg-white'} rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col`}
        >
          <Image
            src={icon}
            alt='web-development'
            width={100}
            height={100}
            className='object-contain rounded-xl'
          />
  
          <h3 className={`${theme === "light" ? "text-white" : "text-near-black"} text-[20px] font-bold text-center`}>
            {title}
          </h3>
        </div>
      </motion.div>
    </Tilt>
  );
} 

const About = () => {
  const {theme} = useAppContext();
  return (
    <motion.div
      variants={staggerContainer()}
      initial='hidden'
      animate='show'
      className={`w-full mx-auto px-20 relative z-0 ${theme === "light" ? '' : 'bg-near-black'}`}
      id={"about"}
    >
      <motion.section>
        
            <motion.div variants={textVariant()}>
              <p className={`sectionSubText ${theme === "light" ? 'text-primary-light' : 'text-primary-dark'}`}>Introduction</p>
              <h2 className={`sectionHeadText ${theme === "light" ? 'text-primary-light' : 'text-primary-dark'}`}>Overview.</h2>
            </motion.div>

            <motion.p
              variants={fadeIn("", "", 0.1, 1)}
              className={`mt-4 text-center  text-body-normal max-w-3xl leading-[30px] ${theme === "light" ? 'text-near-black' : 'text-white'}`}
            >
            
              I have experience in Java, JavaScript, and knowledge in frameworks like React, Node.js, Next.js as well as AWS cloud foundations such as S3, RDS, EC2 and even VPCs.
              I am also acquainted with DataBase managment systems such as mySql and even .  
              I'm a quick learner and would love to collaborate closely with potential employers to
              create efficient, scalable, and user-friendly solutions that solve
              real-world problems!
            </motion.p>
            

        <div className='ml-8 mt-16 flex flex-wrap gap-10'>
          {services.map((service, index) => (
            <motion.div key={service.title} variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
              <ServiceCard index={index} {...service} />
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default About;