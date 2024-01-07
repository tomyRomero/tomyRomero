'use client';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../app/globals.css';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { useAppContext } from '@/lib/AppContext';

export default function ImageSlider({ project }: any) {

  let settings = {
    infinte: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    accessibility: true,
    pauseOnHover: true,
    autoplaySpeed: 8000,
  };

  const {theme} = useAppContext();

  return (
    <div className={`relative ${theme === "light" ? "border-black/20" : "border-white/20"} border-[2px] md:border-[3px] rounded-[5px] md:rounded-[10px]`}>
      <Slider {...settings}>
        {project.images.map((image: any) => (
          <Image
            src={`${project.image}`}
            alt={image}
            width={1920}
            height={1080}
            key={nanoid()}
            className='object-cover rounded-[5px] md:rounded-[8px]'
          />
        ))}
      </Slider>
    </div>
  );
}
