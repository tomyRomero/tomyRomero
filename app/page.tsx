
import About from '@/components/home/About';
import Hero from '../components/home/Hero';
import { Photos } from '@/components/Photos';
import Intro from '@/components/home/Intro';
import Projects from '@/components/Projects';
import Tech from '@/components/Tech';


export default function Home() {

  return (
    <div className="flex flex-col mt-14">
    <Intro />
    <Photos />
    <About />
    <Tech />
    <Projects />
  </div>
  )
}
