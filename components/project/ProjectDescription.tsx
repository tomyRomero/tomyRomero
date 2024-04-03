'use client';

import { useAppContext } from "@/lib/AppContext";
import Magnetic from "./Magnetic";
import Link from "next/link";
import RoundButton from "./RoundButton";

interface Props{
text: string;
github: string,
live: string,
isLive: Boolean
}

export default function ProjectDescription({text, github, live, isLive}: Props) {
  const {theme} = useAppContext();

  return (
    <section className="mt-6 flex items-center justify-between mb-[100px] flex-col md:flex-row gap-[76px]"
    id="description"
    >
      <p className={`md:max-w-[530px] text-body-normal  ${theme === "light" ? '' : 'text-white'}`}>
        {text}
      </p>

      <div className="relative">
        <div>
          <div className="hidden lg:block">
            <Magnetic padding="p-0">
              <Link href={isLive ? live : github} target="_blank">
                <RoundButton  text={`${isLive ? 'Live Site' : 'Code'}`} variant="lg" />
              </Link>
            </Magnetic>
          </div>

          <div className="lg:hidden">
            <Link href={isLive ? live : github} target="_blank">
              <RoundButton  text={`${isLive ? 'Live Site' : 'Code'}`}  variant="lg" />
            </Link>
          </div>
        </div>

        <div className={`absolute top-[-45%] right-[-45%] translate-x-[-50%] translate-y-[50%] ${isLive ? '' : 'hidden'}`}>
          <div className="hidden lg:block">
            <Magnetic padding="p-0">
              <Link
                href={github}
                target="_blank"
                className={`${
                  theme === 'light' ? 'bg-primary-light' : 'bg-near-black'
                } rounded-full block hover:bg-primary-light`}
              >
                <RoundButton fill text="Code" variant="sm" />
              </Link>
            </Magnetic>
          </div>

          <div className="lg:hidden">
            <Link
              href={github}
              target="_blank"
              className={`${
                theme === 'light' ? 'bg-primary-light' : 'bg-near-black'
              } rounded-full block hover:bg-primary-light`}
            >
              <RoundButton fill text="Code" variant="sm" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
