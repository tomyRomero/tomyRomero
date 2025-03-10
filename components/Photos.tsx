"use client"

import clsx from 'clsx';
//Used for dynamic styles
import { AnimatePresence, motion } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';

import { images } from '../constants/index';
import { useAppContext } from '@/lib/AppContext';
import { fadeIn } from '../lib/motion';
import { useEffect, useRef } from 'react';

const possibleRotations = [1.3, -1.3, 1.3, -1.3, 1.3, -1.3];

const Photo = ({
  img,
  title,
  alt,
  idx,
}: {
  img: StaticImageData;
  title: string;
  alt: string;
  idx: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <motion.div
      key={img.src}
      initial={{ scale: 1, rotate: possibleRotations[idx % possibleRotations.length], opacity: 0 }}
      whileHover={{ scale: 1.1, rotate: 0, transition: { duration: 0.2 } }}
      whileInView={{ opacity: 1, transition: { delay: idx / 100 } }}
      viewport={{ once: true }}
      onHoverStart={() => setIsVisible(true)}
      onHoverEnd={() => setIsVisible(false)}
      className={clsx(
        'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl',
      )}
    >
      <Image
        src={img}
        alt={alt}
        sizes="(min-width: 640px) 18rem, 11rem"
        className="absolute inset-0 h-full w-full object-cover"
        placeholder="blur"
      />
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-full flex items-end"
          >
            <h3 className="px-3 py-2 font-mono text-subtle-semibold font-bold text-white">{title}</h3>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Photos = () => {
  const { theme } = useAppContext();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 150;
    }
  }, []);

  return (
    <div className="max-sm:pt-2.5 md:pt-8">
      <div className="mb-8">
        <div 
          ref={scrollRef}
          className="hide-scrollbar -my-4 flex gap-8 overflow-y-auto py-4 px-8"
        >
          {images.map((Image, index) => (
            <motion.div 
              // initial='hidden'
              // animate='show'
              // variants={fadeIn("up", "spring", index * 0.5, 1.5)}
              key={Image.img.src}
            >
              <Photo
                key={Image.img.src}
                img={Image.img}
                title={Image.title}
                alt={Image.alt}
                idx={index}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
