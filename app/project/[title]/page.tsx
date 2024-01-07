"use client"
import ImageSlider from '@/components/ImageSlider';
import { useAppContext } from '@/lib/AppContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { projectDetails } from '@/constants';

const page = ({ params }: { params: { title: string } }) => {
  const {theme} = useAppContext();
  console.log("Title: ", params.title)
  const router = useRouter();
  const currentProject =  projectDetails[0];
  
  return (
    <div className={`flex flex-col ${theme === "light" ? '' : 'bg-near-black'}`}>
        <div className="px-[24px] md:px-[103px]">
            <Image
            src={theme === 'light' ? '/assets/arrow.png' : '/assets/arrow.png'}
            alt="back-button"
            width={55}
            height={30}
            onClick={() => router.back()}
            className="cursor-pointer w-[30px] md:w-[55px] py-[30px] md:py-[50px]"
            />
            <section className="max-w-[980px] mx-auto">
            <ImageSlider project={currentProject} />
            
            </section>
        </div>
    </div>
  )
}

export default page