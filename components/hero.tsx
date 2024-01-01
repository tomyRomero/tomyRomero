"use client"

import React from 'react';
import Image from 'next/image';
import { useAppContext } from '@/lib/AppContext';

const hero = () => {
  const {theme, setTheme} = useAppContext();

  return (
    <div className={`w-full ${theme === 'light' ? '' : 'bg-near-black'}`}>
      <section className={`intro`} id="home">
        <h1 className={`intro_text mt-2 max-sm:text-center ${theme === "light" ? '' : 'text-white'}`}>
          Hey, I am <strong className='font-black block'>Tomy Romero</strong>
        </h1>
        <p className={`h-8 rounded ${theme === "light" ? 'bg-primary-light' : 'bg-primary-dark'} p-[0.25em] px-4 mb-4 text-center text-white font-bold max-sm:w-1/2 max-sm:mx-auto`}>A Full Stack Junior Dev</p>
        <Image
          src="/assets/tomyRomero.jpeg"
          alt="a picture of Tomy Romero smiling"
          width={800}
          height={800}
          className="intro__img block max-sm:mx-auto max-sm:h-72 max-sm:w-72 object-contain"
        />
      </section>
      
    </div>
  );
};

export default hero;
