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

    const { theme } = useAppContext();

    return (
      <>
      <br></br>
        <div className={`mb-[30px] md:mb-[50px] ${theme === "light" ? "bg-primary-light" : "bg-primary-dark"} rounded-xl py-4`}>
            <div className="flex justify-between w-full px-[20px] md:px-[37px] h-full">
                <button onClick={prevSlide} className="slider-button">
                    <Image src={"/assets/advance.png"} alt="arrow" width={40} height={40} className="rotate-180 w-[30px] md:w-[40px]" />
                </button>
                <button onClick={nextSlide} className="slider-button">
                    <Image src={"/assets/advance.png"} alt="arrow" width={40} height={40} className="w-[30px] md:w-[40px]" />
                </button>
            </div>
        </div>
        </>
    );
};

export default SliderControls;
