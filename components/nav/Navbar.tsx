"use client";

import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import MenuToggle from "./MenuToggle";
import NavMenu from "./NavMenu";
import { motion as m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAppContext } from "@/lib/AppContext";
import { Single_Day } from 'next/font/google';

const singleDayFont = Single_Day({
  weight: "400"
})

export default function Navbar() {

  const {theme} = useAppContext();
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="relative">
      <header
        className={`w-full transition-colors text-inherit bg-inherit z-50 fixed top-0 border-b  ${
          theme === "light" ? "border-b-black/20 bg-white" : "border-b-white bg-near-black"
        }`}
      >
        <div
          className={`max-w-custom mx-auto grid grid-cols-2 md:grid-cols-3 items-center px-[29px] xl:px-[103px] py-[22px]`}
        >
          <div className="hidden md:block">
            <Link
              href={"/"}
              onClick={() => setIsActive(false)}
              className={`font-bold text-[28px] tracking-[1.32px] w-max ${
                theme === "light" ? "" : "text-primary-dark" }`}
              
            >
            <span className={singleDayFont.className}>
            &lt;TOMY ROMERO /&gt;
            </span>
            </Link>
          </div>

          <MenuToggle isActive={isActive} setIsActive={setIsActive} />
          
          <ThemeToggle />

          <NavMenu
            isActive={isActive}
            setIsActive={setIsActive}
            theme={theme}
          />
        </div>
      </header>

      <AnimatePresence>
        {isActive && (
          <m.div
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            onClick={() => setIsActive(false)}
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-20"
          ></m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
