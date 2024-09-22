"use client";
import React from 'react';
import { motion as m } from 'framer-motion';
import Image from 'next/image';
import { intro, resumeLink } from '@/constants';
import Link from 'next/link';
import { useAppContext } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  showStars: boolean;
  toggleStars: () => void;
  projectsRef: React.RefObject<HTMLDivElement>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ showStars, toggleStars, projectsRef }) => {
  const { theme } = useAppContext();
  const router = useRouter();

  return (
    <section className="z-0 max-xs:mt-6 max-sm:mt-4 mt-10 relative flex items-center justify-center px-4 py-6 md:px-6 md:py-10">
      <div
        className={`${
          theme === 'light' ? 'text-near-black' : 'text-white'
        } text-center max-w-md md:max-w-2xl lg:max-w-3xl flex flex-col items-center`}
      >
        <h1 className="max-xs:text-heading1-semibold max-sm:px-4 text-heading1.5-bold md:text-heading1-bold font-bold leading-tight">
          Hey, I am{' '}
          <span className={`${
              theme === 'light' ? 'text-primary-light' : 'text-primary-dark'
            }`}
          >
            Tomy Romero
          </span>
          , a full-stack{' '}
          <span className={`${
              theme === 'light' ? 'text-primary-light' : 'text-primary-dark'
            }`}
          >
            software developer
          </span>
        </h1>
        <p className="max-xs:text-heading6-bold max-xs:px-8 mt-6 md:mt-4 text-heading5-bold md:text-heading4-bold max-sm:px-6">{intro}</p>

        {/* Buttons Container */}
        <div className="flex flex-col max-sm:flex-col max-md:items-center max-md:space-y-4 mt-6 md:flex-row md:justify-center md:space-x-4">
          {/* GitHub button */}
          <Link
            href={'https://github.com/tomyRomero?tab=overview&from=2023-12-01&to=2023-12-31'}
            target="_blank"
          >
            <Image
              src={`${theme === 'light' ? '/assets/github.svg' : '/assets/githubdark.svg'}`}
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
              src={`${theme === 'light' ? '/assets/linkedin.svg' : '/assets/linkedindark.svg'}`}
              alt="linkedin icon"
              width={34}
              height={34}
              className="cursor-pointer hover:scale-125 ease-in-out duration-300"
            />
          </Link>
          {/* Download Resume button */}
          <button
            className={`cursor-pointer hover:scale-125 ease-in-out duration-300 flex items-center gap-1.5 px-3 py-1 rounded-xl text-body1-bold ${
              theme === 'light' ? 'bg-primary-light text-white' : 'bg-primary-dark text-near-black'
            }`}
            onClick={() => {
              window.open(`${resumeLink}`, '_blank'); 
            }}
          >
            Resume
            <Image
              src={`${theme === 'light' ? '/assets/downloadwhite.png' : '/assets/download.png'}`}
              alt="download icon"
              width={15}
              height={15}
            />
          </button>
          {/* Projects button */}
          <button
            className={`cursor-pointer hover:scale-125 ease-in-out duration-300 flex items-center gap-1.5 px-3 py-1 rounded-xl text-body1-bold ${
              theme === 'light' ? 'bg-primary-light text-white' : 'bg-primary-dark text-near-black'
            }`}
            onClick={() => {
              projectsRef.current?.scrollIntoView({ behavior: 'smooth' }); 
            }}
          >
            Projects
            <Image
              src={`${theme === 'light' ? '/assets/projectwhite.png' : '/assets/project.png'}`}
              alt="project icon"
              width={15}
              height={15}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;