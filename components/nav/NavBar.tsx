"use client";

import React, { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import MenuToggle from './MenuToggle';
import { navLinks } from '@/constants';
import Link from 'next/link';
import NavMenu from './NavMenu';
import { useAppContext } from '@/lib/AppContext';

const NavBar = () => {
  const { theme , selected, setSelected, scrollToSection } = useAppContext();
  const [isActive, setIsActive] = useState(false);

  const handleNavClick = (path: string) => {
    scrollToSection(path); // Trigger scroll
    setIsActive(false); // Close the menu if active
  };

  return (
    <nav className={` w-full z-50 fixed top-0 flex items-center justify-between px-6 py-4 lg:px-24 ${theme === "light" ? "bg-white" : "bg-near-black"}`}>
      
      {/* Small Screen Layout - Menu Toggle on Left */}
      <div className="md:hidden">
        <MenuToggle isActive={isActive} setIsActive={setIsActive} />
      </div>

      {/* Logo Section */}
      <div className="hidden md:block">
        <Link href={"/"} className={`${theme === "light" ? "text-black" : "text-white"} font-bold md:text-heading5-bold`}>
          <span className="uppercase">Tomy Romero</span>
        </Link>
      </div>

      {/* Links Section */}
      <ul className={`shadow-[0px_2px_8px_rgba(0,0,0,0.1),0px_-2px_8px_rgba(0,0,0,0.1)] ${theme === "light" ? "text-near-black shadow-near-black/50" : "text-white shadow-white/50"} p-2 px-4 sm:px-6 rounded-full flex space-x-4 sm:space-x-6 md:space-x-8 font-medium hidden md:flex`}>
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

      {/* Small Screen Layout - Theme Toggle on Right */}
      <div className="md:hidden">
        <ThemeToggle />
      </div>

      {/* Desktop Layout - Theme Toggle stays in place */}
      <button className="hidden md:block md:ml-4">
        <ThemeToggle />
      </button>

      <NavMenu
        isActive={isActive}
        setIsActive={setIsActive}
        theme={theme}
      />
    </nav>
  );
};

export default NavBar;