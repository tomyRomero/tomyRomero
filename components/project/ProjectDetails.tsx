'use client';

import { useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/lib/AppContext";
import { useRouter } from "next/navigation";


interface Props{
  title: string,
  tools: string[],
  type: string,
  year: string
}

export default function ProjectDetails({title, tools, type, year}: Props) {
  
  const {theme, scrollToSection} = useAppContext();
  const router = useRouter();

  return (
    <article className="flex flex-col-reverse md:flex-row justify-between gap-x-6">
      <section>
        <h1 className={`${theme === "light" ? 'text-primary-light' : 'text-primary-dark'} text-heading1.5-bold tracking-[1.92px] md:text-[58px] md:tracking-[3.48px] pb-[7px]`}>
         {title}
        </h1>
        <article className={`${theme === "light" ? '' : 'text-white'} text-[18px] font-semibold tracking-[0.84px] md:text-[24px] md:tracking-[1.44px] pb-[15px] md:pb-[18px]`}>
          <p>{type}</p>
        </article>
          <article className="flex items-center gap-[15px] flex-wrap">
          {tools?.map((image, index) => ( 
            <Image 
            src={image}
            alt="tool icon"
            width={35}
            height={35}
            className={`w-[35px] md:w-[45px] rounded-full ${theme === "light" ? "" : ""}`}
            key={index}
          />
          ))}
          </article>
          <div className="pt-3">
          <button 
        className={`
        cursor-pointer hover:scale-125 ease-in-out duration-300
        flex items-center gap-1.5 px-3 py-1 rounded-xl text-body1-bold text-white ${theme === "light" ? 'bg-primary-light ':'bg-primary-dark'}`}
        onClick={()=> {scrollToSection("description")}}
        >
        Description
        <Image 
          src={'/assets/arrow.png'}
          alt="arrow icon"
          width={16}
          height={16}
        />
        </button>
        </div>
      </section>
      <h4 className={`${theme === "light" ? 'text-primary-light' : 'text-primary-dark'} text-body-bold tracking-[0.72px] md:text-[24px] md:tracking-[1.44px] md:pt-[24px]`}>
        {year}
      </h4>
    </article>
  );
}
