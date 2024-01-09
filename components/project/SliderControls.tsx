import { useAppContext } from '@/lib/AppContext';
import Image from 'next/image';
import Slider from 'react-slick'; // Import Slider to access slick methods
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ImageControlsProps {
    slider: Slider | null;
  }
  
  const SliderControls: React.FC<ImageControlsProps> = ({ slider }) => {
    const nextSlide = () => {
      if (slider) {
        slider.slickNext();
      }
    };
  
    const prevSlide = () => {
      if (slider) {
        slider.slickPrev();
      }
    };
  
    return (
      <div className="mt-[17px] md:mt-[50px] h-[57px] md:h-[79px] border-[2px] md:border-[3px] rounded-[5px] md:rounded-[10px] mb-[30px] md:mb-[50px]">
        <div className="flex justify-between w-full px-[20px] md:px-[37px] h-full rounded-[4px] md:rounded-[8px]" style={{ backgroundColor: '#F7B787' }}>
          <button onClick={prevSlide}>
            <Image src="/assets/advance.png" alt="arrow" width={55} height={30} className="rotate-180 w-[30px] md:w-[55px]" />
          </button>
          <button onClick={nextSlide}>
            <Image src="/assets/advance.png" alt="arrow" width={55} height={30} className="w-[30px] md:w-[55px]" />
          </button>
        </div>
      </div>
    );
  };
  
  export default SliderControls;
