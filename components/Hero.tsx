"use client";
import React from "react";
import { motion as m } from "framer-motion";
import Image from "next/image";
import { intro } from "@/constants";
import Link from "next/link";
import { useAppContext } from "@/lib/AppContext";

interface HeroSectionProps {
  projectsRef: React.RefObject<HTMLDivElement>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ projectsRef }) => {
  const { theme } = useAppContext();

  return (
    <section className="z-0 mt-6 relative flex items-center justify-center px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 pt-4 pb-6 md:pt-8 md:pb-8">
      <div
        className={`${
          theme === "light" ? "text-near-black" : "text-white"
        } text-center max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl flex flex-col items-center`}
      >
        <m.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-heading1-semibold px-4 xs:px-6 sm:px-8 py-3 sm:py-4 text-center leading-[30px] max-sm:leading-[42px] md:leading-[44px] lg:leading-[44px]"
        >
          Hey, I am{" "}
          <span
            className={`${
              theme === "light" ? "text-primary-light" : "text-primary-dark"
            }`}
          >
            Tomy Romero
          </span>
          , a full-stack{" "}
          <span
            className={`${
              theme === "light" ? "text-primary-light" : "text-primary-dark"
            }`}
          >
            software developer
          </span>
        </m.h1>
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`mt-2 sm:mt-4 text-center max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl leading-[22px] max-sm:leading-[26px] md:leading-[28px] lg:leading-[30px] ${
            theme === "light" ? "text-near-black" : "text-white"
          } px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 max-sm:text-small-regular`}
        >
          {intro}
        </m.p>

        {/* Socials & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 xs:gap-5 sm:gap-6 backdrop-blur-md p-3 xs:p-4 sm:p-5 mt-4 max-sm:mt-2 md:mt-8">
          {/* Social Links */}
          <div className="flex space-x-4 justify-center sm:justify-start">
            <Link
              href="https://github.com/tomyRomero"
              target="_blank"
              className="group"
            >
              <Image
                src={
                  theme === "light"
                    ? "/assets/github.svg"
                    : "/assets/githubdark.svg"
                }
                alt="GitHub"
                width={35}
                height={35}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </Link>
            <Link
              href="https://www.linkedin.com/in/tomy-romero-902476145/"
              target="_blank"
              className="group"
            >
              <Image
                src={
                  theme === "light"
                    ? "/assets/linkedin.svg"
                    : "/assets/linkedindark.svg"
                }
                alt="LinkedIn"
                width={35}
                height={35}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </Link>
          </div>

          {/* CTA Button */}
          <button
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 ${
              theme === "light"
                ? "bg-primary-light text-white"
                : "bg-primary-dark text-near-black"
            }`}
            onClick={() =>
              projectsRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View Projects
            <Image
              src={
                theme === "light"
                  ? "/assets/projectwhite.png"
                  : "/assets/project.png"
              }
              alt="project icon"
              width={18}
              height={18}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;