import { navLinks } from '@/constants';
import { motion as m, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';


interface Props {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  theme: string;
}

export default function NavMenu({ isActive, setIsActive, theme }: Props) {

  const [isMouseOver, setIsMouseOver] = useState('');
  const activeLink = navLinks.find((link) => link.title === isMouseOver);
  const pathname = usePathname();

  return (
    <>
      <AnimatePresence>
        {isActive && (
          <m.article
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className={`absolute top-[77px] left-0 right-0 border-b ${
              theme === 'light'
                ? 'border-b-black/20 bg-white'
                : 'border-b-white/20 bg-near-black'
            }`}
          >
            <div className="flex item-center justify-between max-w-custom mx-auto px-[24px] xl:px-[103px] md:pt-[75px] md:pb-[69px] py-[42px]">
              <nav className="flex flex-wrap lg:max-w-[880px] flex-col md:flex-row md:gap-x-[35px]">
              {navLinks.map((link, index) => (
                  <m.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: -20,
                      transition: { delay: index * 0.05 },
                    }}
                    transition={{ delay: index * 0.15 + 0.45 }}
                    key={link.title}
                  >
                    <Link
                      href={`/${link.path}`}
                      onClick={() => setIsActive(false)}
                      onMouseEnter={() => setIsMouseOver(link.title)}
                      onMouseLeave={() => setIsMouseOver('')}
                    >
                      <m.h2
                        className={`${
                          //Work around for default
                          isMouseOver === '' 
                            ? 'text-gray' : ''
                          }

                          ${
                          isMouseOver !== '' //If the mouse is not over the text
                            ?  activeLink?.path === link.path //If the path matches the link we are on
                              ? theme === 'light'
                                ? 'text-primary-light'
                                : 'text-primary-dark'
                              : activeLink?.path !== link.path //If the path does not match the link we are on
                              ? theme === 'light'
                                ? 'lg:blur-[6px] text-near-black'
                                : 'lg:blur-[6px] text-white'
                              : ''
                            : (pathname !== '/' 
                                ? link.path !== '' &&
                                  pathname.includes(link.path)
                                : pathname === '/' && link.path === '') &&
                              (theme === 'light'
                                ? 'text-primary-light'
                                : 'text-primary-dark')
                        } transition-all duration-[500ms] md:text-[82px] text-[42px] tracking-[2.52px] font-bold uppercase md:tracking-[5.8px]`}
                      >
                        {link.title}
                      </m.h2>
                    </Link>
                  </m.div>
                ))}
              </nav>
              <div className="w-[440px] h-[302px] relative hidden lg:block">
                {isMouseOver !== '' && activeLink?.image && (
                  <Image
                    src={activeLink?.image}
                    alt={activeLink?.title}
                    fill
                    className={`rounded-[10px] border-[2px] object-cover ${
                      theme === 'light' ? 'border-black/20' : 'border-white/20'
                    }`}
                  />
                )}
              </div>
            </div>
          </m.article>
        )}
      </AnimatePresence>
    </>
  );
}
