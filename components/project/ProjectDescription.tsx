'use client';

import { useAppContext } from "@/lib/AppContext";
import Magnetic from "./Magnetic";
import Link from "next/link";
import RoundButton from "./RoundButton";

interface Props {
  text: string;
  features: string[];
  github: string;
  live: string;
  isLive: boolean;
}

export default function ProjectDescription({ text, features, github, live, isLive }: Props) {
  const { theme } = useAppContext();

  return (
    <section
      className="mt-6 flex items-center justify-between mb-[100px] flex-col md:flex-row gap-[76px]"
      id="description"
    >
      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <div className="space-y-4">
          <h2 className={`text-heading3-bold font-bold tracking-tighter md:text-heading2-bold ${theme === "light" ? 'text-primary-light' : 'text-primary-dark'}`}>Project Description</h2>
          <p className={`max-w-[600px] ${theme === "light" ? 'text-black' : 'text-white'} `}>
            {text}
          </p>
        </div>
        <div className="space-y-4">
          <h3 className={`text-heading3-bold md:text-heading2-bold ${theme === "light" ? 'text-primary-light' : 'text-primary-dark'}`}>Key Features:</h3>
          <ul className="grid gap-2 text-muted-foreground">
            {features.map((feature: string, index: number) => (
              <li key={index}>
                <CheckIcon
                className={`mr-2 inline-block h-4 w-4 ${
                  theme === "light" ? "text-near-black" : "text-white"
                }`}
                />
                <span className= {`${theme === "light" ? 'text-black' : 'text-white'}`}>
                {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mt-6 md:mt-0">
        <div className="flex gap-4">
          <Link href={isLive ? live : github} target="_blank">
            <RoundButton text={`${isLive ? 'Live Site' : 'Code'}`} variant="lg" />
          </Link>
          {isLive && (
            <Link href={github} target="_blank">
              <RoundButton fill text="Code" variant="sm" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}