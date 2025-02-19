"use client"

import About from '@/components/home/About';
import HeroSection from '@/components/Hero';
import { Photos } from '@/components/Photos';
import Projects from '@/components/Projects';
import Tech from '@/components/Tech';
import Contact from '@/components/contact/Contact';
import { useAppContext } from '@/lib/AppContext';
import Experience from '@/components/Experience';


export default function Home() {
  const { theme, aboutRef, projectsRef, contactRef, experienceRef } = useAppContext();

  return (
    <div
      className={`relative z-0 flex flex-col mt-10 ${
        theme === "light" ? "bg-white/70" : "bg-near-black"
      } overflow-hidden items-center`}
    >
      {/* Main Content */}
      <HeroSection projectsRef={projectsRef} />
      <Photos />
      <div ref={aboutRef} className="w-full">
        <About />
      </div>
      <Tech />
      <div ref={experienceRef}>
        <Experience />
      </div>
      <div ref={projectsRef}>
        <Projects />
      </div>
      <div ref={contactRef}>
        <Contact />
      </div>
      <footer
        className={`w-full h-20 flex justify-center items-center border-t ${
          theme === "light" ? "border-primary-light" : "border-primary-dark"
        }`}
      >
        <p
          className={`text-body1 ${
            theme === "light" ? "text-near-black" : "text-white"
          }`}
        >
          ©Tomy Romero. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
