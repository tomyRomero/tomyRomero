"use client"

import About from '@/components/home/About';
import HeroSection from '@/components/Hero';
import { Photos } from '@/components/Photos';
import Projects from '@/components/Projects';
import Tech from '@/components/Tech';
import Contact from '@/components/contact/Contact';
import { useAppContext } from '@/lib/AppContext';
import Experience from '@/components/Experience';
import StarsCanvas from '@/components/canvas/Stars';
import { useRef, useState } from 'react';


export default function Home() {
  
  const { theme, aboutRef, projectsRef, contactRef, experienceRef } = useAppContext();
  const [showStars, setShowStars] = useState(false);

  const toggleStars = () => {
    setShowStars(!showStars);
  };
  
  try{
    return (
      <div className={`relative z-0 flex flex-col mt-10 ${theme === "light" ? '' : 'bg-near-black'} overflow-hidden`}>
          {/* Stars Canvas as background */}
          {/* Disabled for now due to lack of brwowser support for moblie devices */}
          {/* {showStars && <StarsCanvas />} */}
          
          {/* Main Content */}
          <HeroSection showStars={showStars} toggleStars={toggleStars} />
          <Photos />
          <div ref={aboutRef}><About /></div>
          <Tech />
          <div ref={experienceRef}><Experience /></div>
          <div ref={projectsRef}><Projects /></div>
          <div ref={contactRef}><Contact /> </div>
      </div>
      )
  } catch (error) {
    alert("failed to load stars");

    return (
      <div className={`relative z-0 flex flex-col mt-10 ${theme === "light" ? '' : 'bg-near-black'} overflow-hidden`}>
          <HeroSection showStars={showStars} toggleStars={toggleStars} />
          <Photos />
          <About />
          <Tech />
          <Experience />
          <Projects />
          <Contact />
      </div>
    )
  }

}
