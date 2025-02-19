import { useEffect, useState } from "react";
import { motion as m } from "framer-motion";
import Image from "next/image";
import { useAppContext } from "@/lib/AppContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useAppContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  if (!mounted) return null;

  return (
    <button
      onClick={handleTheme}
      className={`relative flex items-center w-[56px] h-[28px] rounded-full shadow-md border transition-all duration-300 overflow-hidden
        ${theme === "light" ? "bg-white shadow-md" : "bg-near-black  shadow-lg border-white"}`}
    >
      {/* Toggle Indicator */}
      <m.div
        animate={theme === "light" ? { x: 30 } : { x: 4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`w-[18px] h-[18px] flex items-center justify-center rounded-full 
          ${theme === "light" ? "bg-primary-light " : "bg-primary-dark "}`}
      >
        <Image
          src={theme === "light" ? "/assets/bulb.svg" : "/assets/moon.svg"}
          alt="theme-icon"
          width={12}
          height={12}
        />
      </m.div>
    </button>
  );
}