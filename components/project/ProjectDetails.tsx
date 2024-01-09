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
  const [isMouseOver, setIsMouseOver] = useState('');
  const {theme} = useAppContext();
  const router = useRouter();

  return (
    <article className="flex flex-col-reverse md:flex-row justify-between gap-x-6 pb-6">
      <section>
        <h1 className="text-[32px] font-bold tracking-[1.92px] md:text-[58px] md:tracking-[3.48px] uppercase pb-[7px]">
         {title}
        </h1>
        <article className="text-[14px] font-semibold tracking-[0.84px] md:text-[24px] md:tracking-[1.44px] uppercase pb-[15px] md:pb-[18px]">
          <p>{type}</p>
        </article>
          <article className="flex items-center gap-[15px] flex-wrap">
          {tools?.map((image, index) => ( 
            <Image 
            src={image}
            alt="tool icon"
            width={35}
            height={35}
            className="w-[35px] md:w-[45px]"
            key={index}
          />
          ))}
          </article>
          <div className="py-2">
          <button 
        className={`
        cursor-pointer hover:scale-125 ease-in-out duration-300
        flex items-center gap-1.5 px-3 py-1 rounded-xl text-body1-bold text-white ${theme === "light" ? 'bg-primary-light ':'bg-primary-dark'}`}
        onClick={()=> {router.push('#description')}}
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
      <h4 className="text-[12px] font-bold tracking-[0.72px] md:text-[24px] md:tracking-[1.44px] md:pt-[24px]">
        {year}
      </h4>
    </article>
  );
}
