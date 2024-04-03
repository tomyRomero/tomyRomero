
import { useEffect } from "react";
import { motion as m } from "framer-motion";
import Image from "next/image";
import { useAppContext } from "@/lib/AppContext";

export default function ThemeToggle() {

const {theme, setTheme} = useAppContext();

  useEffect(() => {
    if (theme === "dark") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [theme]);

  function handleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <div className="justify-self-end">
      <button onClick={handleTheme}>
        <div
          className={`md:mt-2.5 w-[53px] h-[27px] border rounded-full relative flex items-center `}
          style={{
            border: `1px solid ${theme === "light" ? "black" : "white"}`,
          }}
        >
          <m.div
            animate={theme === "light" ? { x: 29 } : { x: 5 }}
            className={`w-[17px] h-[17px] translate-x-[5px] rounded-full absolute flex items-center justify-center  ${
              theme === "light" ? "bg-primary-light" : "bg-primary-dark"
            }`}
          >
            <Image
              src={theme === "light" ? "/assets/bulb.svg" : "/assets/moon.svg"}
              alt="theme-icon"
              width={11}
              height={11}
            />
          </m.div>
        </div>
      </button>
    </div>
  );
}
