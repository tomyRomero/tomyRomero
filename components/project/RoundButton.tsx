import { useAppContext } from '@/lib/AppContext';
import { motion as m, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Props {
  text: string;
  variant?: 'lg' | 'sm';
  fill?: boolean;
}

export default function RoundButton({
  text,
  variant = 'lg',
  fill,
}: Props) {

  const [isMouseOver, setIsMouseOver] = useState(false);
  const {theme} = useAppContext();


return (
  <div
    className={`${
      variant === 'lg'
        ? 'w-[173px] text-[18px] tracking-[1.08px]'
        : 'w-[87px] text-[12px] tracking-[0.72px]'
    } aspect-square rounded-full border-[3px] ${theme === "light" ?  '' : 'text-white hover:bg-primary-dark'} ${
      theme === 'light'
        ? 'border-primary-light hover:text-white'
        : 'border-primary-dark hover:text-white'
    } transition-colors flex items-center justify-center uppercase font-bold cursor-pointer relative overflow-hidden ${
      fill ? (theme === 'light' ? 'bg-white hover:bg-primary-light' : 'bg-near-black hover:bg-primary-dark') : ''
    }`}
    onMouseEnter={() => setIsMouseOver(true)}
    onMouseLeave={() => setIsMouseOver(false)}
  >
    <p>{text}</p>

    <AnimatePresence>
      {isMouseOver && (
        <>
          <m.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            className={`absolute inset-[-3px] rounded-full z-[-1] ${
              theme === 'light' ? 'bg-primary-light' : 'bg-primary-dark'
            }`}
          />
        </>
      )}
    </AnimatePresence>
  </div>
);

}
