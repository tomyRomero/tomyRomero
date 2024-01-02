"use client"

import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { services, styles } from "../../constants";
import { fadeIn, textVariant, staggerContainer } from "../../utils/motion";
import Image from "next/image";

//@ts-ignore
const ServiceCard = ({ index, title, icon }) => (
  <Tilt className='xs:w-[250px] w-full'>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div
        //@ts-ignore
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
      >
        <Image
          src={icon}
          alt='web-development'
          width={100}
          height={100}
          className='object-contain'
        />

        <h3 className='text-white text-[20px] font-bold text-center'>
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <motion.div
      variants={staggerContainer()}
      initial='hidden'
      animate='show'
      className={`w-full mx-auto relative z-0`}
    >
      <span className='hash-span' id='about'>
        &nbsp;
      </span>

      <motion.section>
        <motion.div variants={textVariant()}>
          <p className={`${styles.sectionSubText} text-primary-light`}>Introduction</p>
          <h2 className={`${styles.sectionHeadText} text-primary-light`}>Overview.</h2>
        </motion.div>

        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          I'm a software developer with experience in TypeScript and
          JavaScript, and knowledge in frameworks like React, Node.js. I'm a quick learner and collaborate closely with clients to
          create efficient, scalable, and user-friendly solutions that solve
          real-world problems. Let's work together to bring your ideas to life!
        </motion.p>

        <div className='mt-16 flex flex-wrap gap-10'>
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