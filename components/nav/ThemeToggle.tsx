import { useEffect, useState } from "react";
import { motion as m } from "framer-motion";
import Image from "next/image";
import { useAppContext } from "@/lib/AppContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useAppContext();
  const [mounted, setMounted] = useState(false); 

  // Set mounted state to true after the component has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme toggle
  function handleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  // Return null if the component has not mounted to avoid hydration issues
  if (!mounted) return null;

  return (
    <div className="justify-self-end">
      <button onClick={handleTheme}>
        <div
          className={` max-sm:mt-1.5 mt-2.5 w-[53px] h-[27px] border rounded-full relative flex items-center`}
          style={{
            border: `2px solid ${theme === "light" ? "black" : "white"}`,
          }}
        >
          <m.div
            animate={theme === "light" ? { x: 29 } : { x: 5 }}
            className={`w-[17px] h-[17px] translate-x-[5px] rounded-full absolute flex items-center justify-center ${
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