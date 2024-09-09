"use client";
import React from 'react';
import Image from 'next/image';
import { intro } from '@/constants';
import Link from 'next/link';
import { useAppContext } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const { theme, setSelected } = useAppContext();
  const router = useRouter();

  return (
    <section className={`z-0 mt-10 max-sm:mt-16 relative flex items-center justify-center px-4 py-6 md:px-6 md:py-10 `}>
  
      <div className={`${theme == "light" ? "text-near-black" : "text-white"} text-center max-w-md md:max-w-2xl lg:max-w-3xl flex flex-col items-center`}>
        <h1 className="text-heading2.5-bold md:text-heading1-bold font-bold leading-tight">
          Hey, I am <span className={`${theme == 'light' ? 'text-primary-light' : 'text-primary-dark'}`}>Tomy Romero</span>, a full-stack{' '}
          <span className={`${theme == 'light' ? 'text-primary-light' : 'text-primary-dark'}`}>software developer</span>
        </h1>
        <p className="mt-3 md:mt-4 text-heading5-bold md:text-heading4-bold">
          {intro}
        </p>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-6">
          <Link href={'https://github.com/tomyRomero?tab=overview&from=2023-12-01&to=2023-12-31'} target="_blank">
            <Image
              src={`${theme == 'light' ? '/assets/github.svg' : '/assets/githubdark.svg'}`}
              alt="github icon"
              width={34}
              height={34}
              className="cursor-pointer hover:scale-125 ease-in-out duration-300"
            />
          </Link>
          <Link href="https://www.linkedin.com/in/tomy-romero-902476145/" target="_blank">
            <Image
              src={`${theme == 'light' ? '/assets/linkedin.svg' : '/assets/linkedindark.svg'}`}
              alt="linkedin icon"
              width={34}
              height={34}
              className="cursor-pointer hover:scale-125 ease-in-out duration-300"
            />
          </Link>
          <button
            className={`cursor-pointer hover:scale-125 ease-in-out duration-300 flex items-center gap-1.5 px-3 py-1 rounded-xl text-body1-bold ${
              theme === 'light' ? 'bg-primary-light text-white' : 'bg-primary-dark text-near-black '
            }`}
            onClick={() => {
              router.push('#projects');
            }}
          >
            Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;