"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import MenuToggle from "./MenuToggle";
import NavMenu from "./NavMenu";
import { motion as m, AnimatePresence  } from "framer-motion";
import Link from "next/link";
import { useAppContext } from "@/lib/AppContext";
import { Single_Day } from 'next/font/google';
import { navLinks } from "@/constants";
import { usePathname } from 'next/navigation';

const singleDayFont = Single_Day({
  weight: "400"
})

export default function Navbar() {

  const {selected, setSelected} = useAppContext();

  const path= usePathname();
    useEffect(()=> {

      if(path.startsWith("/project"))
      {
        setSelected(2)
      }else if(path.startsWith("/contact"))
      {
        setSelected(3)
      }

    }, [path])

  const {theme} = useAppContext();
  const [isActive, setIsActive] = useState(false);


  return (
    <div className="relative">
      <header
        className={`w-full transition-colors z-50 fixed top-0 shadow-sm  ${
          theme === "light" ? "bg-white shadow-primary-light" : " bg-near-black shadow-primary-dark"
        }`}
      >
        <div
          className={`mx-auto grid grid-cols-2 md:grid-cols-3 px-[29px] xl:px-[103px] py-[22px]`}
        >
          <div className="max-md:hidden">
            <Link
              href={"/#home"}
              onClick={() => {
                setIsActive(false)
                setSelected(0);
              }}
              
              className={`font-bold text-[28px] tracking-[1.32px] w-max ${
                theme === "light" ? "" : "text-primary-dark" }`}
              
            >
              <span className={singleDayFont.className}>
              &lt;TOMYROMERO /&gt;
            </span>
            </Link>
          </div>

          <div className="max-md:block hidden ">
          <MenuToggle isActive={isActive} setIsActive={setIsActive} />
          </div>
          
          <ol className="max-md:hidden flex pl-10">
            {navLinks.map(({ title, path }, i) => (
              <Link href={path}>
              <m.li
                key={i}
                className={`title  ${i === selected && "selected"} ${singleDayFont.className}` }
                style={{ color: i === selected ? theme === "light" ? "#0060d4" : "#F7B787" : theme === "light" ? "black" : "white" }}
                onClick={() => setSelected(i)}
                layoutId={`title-${i}`}
                animate
                transition={{ duration: 0.5 }}
              >
                
                {i === selected && (
                  <m.div
                    className="underline"
                    layoutId="underline"
                    style={{ backgroundColor: theme === "light" ? "#0060d4" : "#F7B787"}}
                  />
                )}
                {title}
               
              </m.li>
              </Link>
            ))}
          </ol>


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
