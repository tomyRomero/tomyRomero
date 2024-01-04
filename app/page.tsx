
import About from '@/components/home/About';
import Hero from '../components/home/Hero';
import Skills from '@/components/Skills';
import Code from '@/components/canvas/Code';
import { Photos } from '@/components/Photos';
import Intro from '@/components/home/Intro';


export default function Home() {

  return (
    <div className="flex flex-col mt-14">
    <Intro />
    <Photos />
    <About />
  </div>
  )
}
