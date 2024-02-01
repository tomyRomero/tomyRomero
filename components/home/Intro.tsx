"use client"

import { useAppContext } from "@/lib/AppContext";
import Link from "next/link"
import { Single_Day } from 'next/font/google';
import Image from "next/image";
import { useRouter } from 'next/navigation';


const singleDayFont = Single_Day({
    weight: "400"
  })

export default function Intro() {

  const {theme} = useAppContext();
  const router = useRouter();

  return (
    <section className={`flex flex-col items-center justify-center md:space-y-10 py-8 md:py-16 lg:py-20 ${ theme === "light" ? "" : "bg-near-black"}`}
    id="home"
    >
      <div className="space-y-2 text-center">
        <span className={singleDayFont.className}>
        <h1 className={`text-heading1-bold tracking-tighter p-1 ${theme === "light" ? '' : 'text-primary-dark'}`}>Tomy Romero</h1>
        </span>
        <p className={`max-w-[700px] text-body-medium px-1 max-sm:p-6 ${theme === "light" ? '' : 'text-white'}`}>
        Recent college graduate with a Bachelor's degree in Computer Science, equipped with a strong foundation in the field and a passion for software development. Seeking a challenging role as a Junior Developer to contribute technical expertise and innovative solutions to a dynamic team.
        </p>
      </div>
      <div className="flex space-x-4 mt-4">
        <Link href={'https://github.com/tomyRomero?tab=overview&from=2023-12-01&to=2023-12-31'}
        target="_blank">
          <Image 
            src={`${theme=="light" ? '/assets/github.svg' : '/assets/githubdark.svg'}`}
            alt="github icon"
            width={34}
            height={34}
            className="cursor-pointer hover:scale-125 ease-in-out duration-300"
          />
        </Link>
        <Link href="https://www.linkedin.com/in/tomy-romero-902476145/"
        target="_blank"
        >
        <Image 
            src={`${theme=="light" ? '/assets/linkedin.svg' : '/assets/linkedindark.svg'}`}
            alt="linkedin icon"
            width={34}
            height={34}
            className="cursor-pointer hover:scale-125 ease-in-out duration-300"
          />
        </Link>
        <button 
        className={`
        cursor-pointer hover:scale-125 ease-in-out duration-300
        flex items-center gap-1.5 px-3 py-1 rounded-xl text-body1-bold text-white ${theme === "light" ? 'bg-primary-light ':'bg-primary-dark'}`}
        onClick={()=> {router.push('#projects')}}
        >
        Projects
        <Image 
          src={'/assets/arrow.png'}
          alt="arrow icon"
          width={16}
          height={16}
        />
        </button>
      </div>
    </section>
  )
}

