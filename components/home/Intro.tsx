"use client"

import { useAppContext } from "@/lib/AppContext";
import Link from "next/link"
import { Single_Day } from 'next/font/google';
import Image from "next/image";
import { Photos } from "../Photos";

const singleDayFont = Single_Day({
    weight: "400"
  })

export default function Intro() {

  const {theme} = useAppContext();

  return (
    <section className={`flex flex-col items-center justify-center md:space-y-10 py-8 md:py-16 lg:py-20 ${ theme === "light" ? "" : "bg-near-black"}`}
    id="home"
    >
      <div className="space-y-2 text-center">
        <span className={singleDayFont.className}>
        <h1 className={`text-heading1-bold tracking-tighter p-1 ${theme === "light" ? '' : 'text-primary-dark'}`}>Tomy Romero</h1>
        </span>
        <p className={`max-w-[700px] text-body-medium p-1 max-sm:p-6 ${theme === "light" ? '' : 'text-white'}`}>
        Hey! I am based in the US Virgin Islands, and I am a Full Stack Junior Developer and a graduate of the prestigious University of the Virgin Islands, where I earned my Bachelor's degree in Computer Science.
        </p>
      </div>
      <div className="flex space-x-4 mt-4">
        <Link href={''}>
          <Image 
            src={`${theme=="light" ? '/assets/github.svg' : '/assets/githubdark.svg'}`}
            alt="github icon"
            width={34}
            height={34}
            className="cursor-pointer hover:scale-125 ease-in-out duration-300"
          />
        </Link>
        <Link className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="#">
        <Image 
            src={`${theme=="light" ? '/assets/linkedin.svg' : '/assets/linkedindark.svg'}`}
            alt="linkedin icon"
            width={34}
            height={34}
            className="cursor-pointer hover:scale-125 ease-in-out duration-300"
          />
        </Link>
      </div>
    </section>
  )
}

