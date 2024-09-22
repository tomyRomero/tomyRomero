"use client";

import React, { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import MenuToggle from './MenuToggle';
import { navLinks } from '@/constants';
import { motion as m } from "framer-motion";
import Link from 'next/link';
import NavMenu from './NavMenu';
import { useAppContext } from '@/lib/AppContext';

const NewNav = () => {
  const { theme , selected, setSelected, scrollToSection} = useAppContext();
  const [isActive, setIsActive] = useState(false);

  const handleNavClick = (path: string) => {
    scrollToSection(path); // Trigger scroll
    setIsActive(false); // Close the menu if active
  };

  return (
    <nav className={`w-full z-50 fixed top-0 flex items-center justify-between px-6 py-4 lg:px-24 ${theme === "light" ? "bg-white" : "bg-near-black"} rounded-b-lg shadow-lg`}>
      
      {/* Logo Section */}
      <div className="max-md:hidden">
        <Link href={"/"} className={`${theme === "light" ? "text-black" : "text-white"} md:text-heading6-bold md:mr-2 lg:text-heading3-bold`}>
          <span className="uppercase">Tomy Romero</span>
        </Link>
      </div>

      {/* Links Section */}
      <ul className={`${theme === "light" ? "text-near-black bg-near-black/10" : "text-white bg-white/10"} p-2 px-4 sm:px-6 rounded-full flex space-x-4 sm:space-x-6 md:space-x-8 font-medium max-md:hidden`}>
        {navLinks.map(({ title, path }, i) => (
          <li key={i}>
            <button 
              onClick={() => handleNavClick(path)} 
              className={`px-4 py-2 rounded-lg transition-colors 
                ${selected === path ? `${theme === "light" ? "bg-primary-light text-white" : "bg-primary-dark text-near-black"}` : ""}
                ${theme === "light" ? "hover:bg-primary-light hover:text-white" : "hover:bg-primary-dark hover:text-near-black"}
              `}
            >
              {title}
            </button>
          </li>
        ))}
      </ul>

      {/* Button Section */}
      <button className='md:ml-4'>
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