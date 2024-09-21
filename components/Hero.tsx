"use client";
import React from 'react';
import { motion as m } from 'framer-motion';
import Image from 'next/image';
import { intro } from '@/constants';
import Link from 'next/link';
import { useAppContext } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import { resumeLink } from '@/constants';

interface HeroSectionProps {
  showStars: boolean;
  toggleStars: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ showStars, toggleStars }) => {
  const { theme } = useAppContext();
  const router = useRouter();

  return (
    <section className="z-0 mt-10 max-sm:mt-16 relative flex items-center justify-center px-4 py-6 md:px-6 md:py-10">
      <div
        className={`${
          theme == 'light' ? 'text-near-black' : 'text-white'
        } text-center max-w-md md:max-w-2xl lg:max-w-3xl flex flex-col items-center`}
      >
        <h1 className="text-heading2.5-bold md:text-heading1-bold font-bold leading-tight">
          Hey, I am{' '}
          <span
            className={`${
              theme == 'light' ? 'text-primary-light' : 'text-primary-dark'
            }`}
          >
            Tomy Romero
          </span>
          , a full-stack{' '}
          <span
            className={`${
              theme == 'light' ? 'text-primary-light' : 'text-primary-dark'
            }`}
          >
            software developer
          </span>
        </h1>
        <p className="mt-3 md:mt-4 text-heading5-bold md:text-heading4-bold">{intro}</p>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-6">
          {/* GitHub button */}
          <Link
            href={
              'https://github.com/tomyRomero?tab=overview&from=2023-12-01&to=2023-12-31'
            }
            target="_blank"
          >
            <Image
              src={`${
                theme == 'light' ? '/assets/github.svg' : '/assets/githubdark.svg'
              }`}
              alt="github icon"
              width={34}
              height={34}
              className="cursor-pointer hover:scale-125 ease-in-out duration-300"
            />
          </Link>
          {/* LinkedIn button */}
          <Link
            href="https://www.linkedin.com/in/tomy-romero-902476145/"
            target="_blank"
          >
            <Image
              src={`${
                theme == 'light' ? '/assets/linkedin.svg' : '/assets/linkedindark.svg'
              }`}
              alt="linkedin icon"
              width={34}
              height={34}
              className="cursor-pointer hover:scale-125 ease-in-out duration-300"
            />
          </Link>
          {/* Download Resume button */}
          <button
            className={`cursor-pointer hover:scale-125 ease-in-out duration-300 flex items-center gap-1.5 px-3 py-1 rounded-xl text-body1-bold ${
              theme === 'light'
                ? 'bg-primary-light text-white'
                : 'bg-primary-dark text-near-black '
            }`}
            onClick={() => {
              window.open(`${resumeLink}`, '_blank'); 
            }}
          >
            Resume
            <Image
              src={`${
                theme == 'light' ? '/assets/downloadwhite.png' : '/assets/download.png'
              }`}
              alt="download icon"
              width={15}
              height={15}
            />
          </button>
          {/* Projects button */}
          <button
            className={`cursor-pointer hover:scale-125 ease-in-out duration-300 flex items-center gap-1.5 px-3 py-1 rounded-xl text-body1-bold ${
              theme === 'light'
                ? 'bg-primary-light text-white'
                : 'bg-primary-dark text-near-black '
            }`}
            onClick={() => {
              router.push('#projects');
            }}
          >
            Projects
            <Image
              src={`${
                theme == 'light' ? '/assets/projectwhite.png' : '/assets/project.png'
              }`}
              alt="project icon"
              width={15}
              height={15}
            />
          </button>
          {/* Toggle Stars Canvas button */}
          {/* Disabled for now due to lack of support for moblie device browsers */}
          {/* <button onClick={toggleStars} className="relative">
            <div
              className={`w-[53px] h-[30px] border rounded-full relative flex items-center`}
              style={{
                border: `2px solid ${theme === 'light' ? 'black' : 'white'}`,
              }}
            >
              <m.div
                animate={showStars ? { x: 29 } : { x: 5 }}
                className={`w-[17px] h-[17px] translate-x-[5px] rounded-full absolute flex items-center justify-center ${
                  theme === 'light' ? 'bg-primary-light' : 'bg-primary-dark'
                }`}
              >
                <Image
                  src={'/assets/starfilled.png' } 
                  alt="toggle stars icon"
                  width={11}
                  height={11}
                />
              </m.div>
            </div>
          </button> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;