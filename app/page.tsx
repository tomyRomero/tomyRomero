
import Image from 'next/image'
import Navbar from '../components/nav/Navbar'
import Hero from '@/components/hero'
import { useAppContext } from '@/lib/AppContext';
import About from '@/components/about';

export default function Home() {

  return (
    <div className='w-full'>
        <Hero />
        <About />
   </div>
  )
}
