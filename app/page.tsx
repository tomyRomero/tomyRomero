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
import { useState } from 'react';


export default function Home() {
  const {theme} = useAppContext();
  const [showStars, setShowStars] = useState(false);

  const toggleStars = () => {
    setShowStars(!showStars);
  };
  
  try{
    return (
      <div className={`relative z-0 flex flex-col mt-10 ${theme === "light" ? '' : 'bg-near-black'} overflow-hidden`}>
          {/* Stars Canvas as background */}
           {showStars && <StarsCanvas />}
          
          {/* Main Content */}
          <HeroSection showStars={showStars} toggleStars={toggleStars} />
          <Photos />
          <About />
          <Tech />
          <Experience />
          <Projects />
          <Contact />
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
