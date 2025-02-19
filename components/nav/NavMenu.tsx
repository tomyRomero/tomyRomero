"use client";

import { navLinks } from '@/constants';
import { useAppContext } from '@/lib/AppContext';
import { motion as m, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  theme: string;
}

export default function NavMenu({ isActive, setIsActive, theme }: Props) {
  const { scrollToSection } = useAppContext(); // Access the scrollToSection function

  return (
    <>
      <AnimatePresence>
        {isActive && (
          <m.article
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className={`absolute top-[50px] left-0 right-0 border-b ${
              theme === 'light'
                ? ' bg-white '
                : ' bg-near-black border-white'
            }`}
          >
            <div className="flex items-center justify-between max-w-custom mx-auto px-[24px] xl:px-[103px] md:pt-[75px] md:pb-[69px] py-[42px]">
              <nav className="flex flex-wrap lg:max-w-[880px] flex-col md:flex-row md:gap-x-[35px]">
                {navLinks.map(({ title, path }, index) => (
                  <m.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: -20,
                      transition: { delay: index * 0.05 },
                    }}
                    transition={{ delay: index * 0.15 + 0.45 }}
                    key={title}
                  >
                    <button
                      onClick={() => {
                        scrollToSection(path); // Trigger scroll
                        setIsActive(false); // Close the menu
                      }}
                      className={`md:text-[82px] text-[42px] tracking-[2.52px] font-bold uppercase md:tracking-[5.8px] transition-all duration-500 ${
                        theme === 'light'
                          ? 'text-near-black hover:text-primary-light'
                          : 'text-white hover:text-primary-dark'
                      }`}
                    >
                      {title}
                    </button>
                  </m.div>
                ))}
              </nav>
            </div>
          </m.article>
        )}
      </AnimatePresence>
    </>
  );
}