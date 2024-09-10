"use client"

import { useAppContext } from '@/lib/AppContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { projectDetails } from '@/constants';
import ImageSlider from '@/components/project/ImageSlider';
import ProjectDetails from '@/components/project/ProjectDetails';
import ProjectDescription from '@/components/project/ProjectDescription';
import { motion } from "framer-motion";
import { slideIn } from "../../../lib/motion";
import StarsCanvas from '@/components/canvas/Stars';

const page = ({ params }: { params: { title: string } }) => {
  const { theme } = useAppContext();
  const router = useRouter();

  // Function to find project details by title/params
  const findProjectByTitle = (title: string) => {
    return projectDetails.find((project) => project.title === title) || {
      title: 'No Project Found',
      type: 'Try Going Back And ReTrying',
      tools: ['/assets/docker.png', '/assets/docker.png', '/assets/docker.png'],
      images: ['','', ''],
      description: 'Project Not Found, No Details',
      features: ['empty'],
      livelink: '',
      githubrepo: '',
      year: '----',
      isLive: false,
    };
  };
  const title = params.title;
  const decodedTitle = decodeURIComponent(title);

  // Use the findProjectByTitle function to get the project details
  const currentProject = findProjectByTitle(decodedTitle);
  
  return (
    
    <section className={`z-0 relative flex flex-col gap-0 ${theme === "light" ? "" : "bg-near-black"}`}>
    <div>
        
      <motion.div
       initial='hidden'
       animate='show'
       variants={slideIn("left", "tween", 0.2, 1)}
       className="z-0 max-sm:mt-12 md:m-8">
        <section className="max-w-[980px] mx-auto relative">
          
          <Image
            src={theme === "light" ? "/assets/back-light.png" : "/assets/back.png"}
            alt="back-button"
            width={55}
            height={30}
            onClick={() => router.push("/#projects")}
            className="cursor-pointer w-12 mt-10 md:w-16 max-sm:ml-4 hover:scale-125 ease-in-out duration-300"
          />
          <div className='w-full max-sm:ml-6'>
          <ProjectDetails title={currentProject.title} tools={currentProject.tools} type={currentProject.type} year={currentProject.year} />
          </div>
          
          <div className='max-sm:px-4'>
          <ImageSlider images={currentProject.images}/>
          </div>
          <div className='px-4'>
          <ProjectDescription features={currentProject.features ? currentProject.features : []} text={currentProject.description} github={currentProject.githubrepo} live={currentProject.livelink} isLive={currentProject.isLive}/>
          </div>
        </section>
      </motion.div>
    </div>
    </section>
  );
};

export default page;


