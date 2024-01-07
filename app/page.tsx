"use client"

import About from '@/components/home/About';
import Hero from '../components/home/Hero';
import { Photos } from '@/components/Photos';
import Intro from '@/components/home/Intro';
import Projects from '@/components/Projects';
import Tech from '@/components/Tech';
import Contact from '@/components/contact/Contact';
import { useAppContext } from '@/lib/AppContext';


export default function Home() {
  const {theme} = useAppContext();
  return (
  <div className={`flex flex-col mt-10 ${theme === "light" ? '' : 'bg-near-black'}`}>
    <Intro />
    <Photos />
    <About />
    <Tech />
    <Projects />
    <Contact />
  </div>
  )
}
