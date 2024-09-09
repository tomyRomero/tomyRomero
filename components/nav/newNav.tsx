"use client";

import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import MenuToggle from './MenuToggle';
import { navLinks } from '@/constants';
import { motion as m } from "framer-motion";
import Link from 'next/link';
import NavMenu from './NavMenu';
import { useAppContext } from '@/lib/AppContext';
import { usePathname } from 'next/navigation';

const NewNav = () => {
  const { theme , selected} = useAppContext();
  const [isActive, setIsActive] = useState(false);
  
  

  return (
    <nav className={`w-full z-50 fixed top-0 flex items-center justify-between px-6 py-4 lg:px-24 ${theme === "light" ? "bg-white" : "bg-near-black"}`}>
      
      {/* Logo Section */}
      <div className="max-md:hidden">
        <Link href={"/#home"} className={`${theme === "light" ? "text-black" : "text-white"} md:text-heading4-bold lg:text-heading3-bold`}>
          <span className="uppercase">Tomy Romero</span>
        </Link>
      </div>

      {/* Links Section */}
      <ul className={`${theme === "light" ? "text-near-black bg-near-black/10 " : "text-white bg-white/10 "} p-2 px-4 sm:px-6 rounded-full flex space-x-4 sm:space-x-6 md:space-x-8 font-medium max-md:hidden`}>
        {navLinks.map(({ title, path }, i) => (
          <Link key={i} href={path} className={`px-4 py-2 rounded-lg transition-colors 
          ${selected === path ? `${theme === "light" ? "bg-primary-light text-white" : "bg-primary-dark text-near-black"} ` : ""}
          ${theme === "light" ? "hover:bg-primary-light hover:text-white" : "hover:bg-primary-dark hover:text-near-black"}
          
          `}>
            <m.li key={i}>
              {title}
            </m.li>
          </Link>
        ))}
      </ul>

      {/* Button Section */}
      <button>
        <ThemeToggle />
      </button>

      <div className="max-md:block hidden">
        <MenuToggle isActive={isActive} setIsActive={setIsActive} />
      </div>

      <NavMenu
        isActive={isActive}
        setIsActive={setIsActive}
        theme={theme}
      />
    </nav>
  );
};

export default NewNav;