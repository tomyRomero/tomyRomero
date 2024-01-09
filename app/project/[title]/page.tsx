"use client"

import { useAppContext } from '@/lib/AppContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { projectDetails } from '@/constants';
import ImageSlider from '@/components/project/ImageSlider';
import ProjectDetails from '@/components/project/ProjectDetails';
import ProjectDescription from '@/components/project/ProjectDescription';

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
      livelink: '',
      githubrepo: '',
      year: '----',
      isLive: false,
    };
  };
  const projectTitle = params.title;

  // Use the findProjectByTitle function to get the project details
  const currentProject = findProjectByTitle(projectTitle);
  
  return (
    <div className={`flex flex-col gap-0 ${theme === "light" ? "" : "bg-near-black"}`}>
      <div className="max-sm:mt-12 md:m-8">
        <section className="max-w-[980px] mx-auto relative">
          
          <Image
            src={theme === "light" ? "/assets/back-light.png" : "/assets/back.png"}
            alt="back-button"
            width={55}
            height={30}
            onClick={() => router.back()}
            className="cursor-pointer w-12 mt-10 md:w-16 max-sm:ml-4"
          />
          <div className='w-full max-sm:ml-6'>
          <ProjectDetails title={currentProject.title} tools={currentProject.tools} type={currentProject.type} year={currentProject.year} />
          </div>
          
          <div className='max-sm:px-4'>
          <ImageSlider images={currentProject.images}/>
          </div>
          <div className='px-4'>
          <ProjectDescription text={currentProject.description} github={currentProject.githubrepo} live={currentProject.livelink} isLive={currentProject.isLive}/>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;


