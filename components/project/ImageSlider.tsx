'use client';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { useAppContext } from '@/lib/AppContext';
import { useEffect, useLayoutEffect, useRef} from 'react';
import SliderControls from './SliderControls';

export default function ImageSlider({ images }: any) {

    // Create a ref to the Slider component
    const sliderRef = useRef<Slider>(null);

    let settings = {
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      accessibility: true,
      pauseOnHover: true,
      autoplaySpeed: 8000,
      arrows: false,

    };
  
    const {theme, slider, setSlider} = useAppContext();

    useEffect(()=> {
      setSlider(!slider)
    }, [])
  
    return (
    <>
      <div className={`relative max-w-[980px] mx-auto shadow-[0px_-2px_4px_rgba(0,0,0,0.2),0px_4px_6px_rgba(0,0,0,0.1)] ${theme === "light" ? "shadow-primary-light" : "shadow-primary-dark"} 
       rounded-[5px] md:rounded-[10px]` }>
        {/* Pass the ref to the Slider component */}
        <Slider {...settings} ref={sliderRef} 
        >
          {images.map((image: any) => (
            <Image
              src={`${image}`}
              alt={image}
              width={1920}
              height={1080}
              key={nanoid()}
              className='object-scale-down rounded-[5px] md:rounded-[8px] h-[60vh]'
            />
          ))}
        </Slider>
    {/* Pass the slider ref to ImageControls */}  
      </div>
      <div className='mb-2 md:mb-6'>
      <SliderControls
      slider={sliderRef.current} />
      </div>
      </>
    );
  }
  