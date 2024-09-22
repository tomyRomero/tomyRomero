"use client";

import { useAppContext } from '@/lib/AppContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { projectDetails } from '@/constants';
import ImageSlider from '@/components/project/ImageSlider';
import ProjectDetails from '@/components/project/ProjectDetails';
import ProjectDescription from '@/components/project/ProjectDescription';
import { motion } from 'framer-motion';
import { slideIn } from '@/lib/motion';
import StarsCanvas from '@/components/canvas/Stars';

const page = ({ params }: { params: { title: string } }) => {
  const { theme, selected, scrollToSection, descriptionRef } = useAppContext();
  const router = useRouter();

  const handleNavClick = (path: string) => {
    scrollToSection(path); // Trigger scroll
  };

  // Function to find project details by title/params
  const findProjectByTitle = (title: string) => {
    return projectDetails.find((project) => project.title === title) || {
      title: 'No Project Found',
      type: 'Try Going Back And ReTrying',
      tools: ['/assets/docker.png', '/assets/docker.png', '/assets/docker.png'],
      images: ['', '', ''],
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
    <section className={`z-0 relative flex flex-col gap-0 ${theme === "light" ? "" : "bg-near-black"} pb-16`}>
      <div>
        <motion.div
          initial="hidden"
          animate="show"
          variants={slideIn("left", "tween", 0.2, 1)}
          className="z-0 mt-20 md:mt-16 lg:mt-20 px-4 sm:px-6 md:px-8"
        >
          <section className="max-w-[980px] mx-auto relative">
            {/* Project Content */}
            <div className="px-6 max-sm:px-4 md:px-0 mb-12">
               {/* Back Button */}
            <div className="flex items-center justify-start mb-4">
              <button
                onClick={() => handleNavClick("projects")}
                className={`flex items-center p-2 md:p-3 lg:p-4 rounded-full border-2 
                  transition-transform transform hover:scale-110 ease-in-out duration-300 
                  ${theme === "light" 
                    ? "border-primary-light bg-transparent hover:bg-primary-light hover:bg-opacity-20" 
                    : "border-primary-dark bg-near-black bg-opacity-20 hover:bg-primary-dark hover:bg-opacity-20"
                  }`}
              >
                <Image
                  src={theme === "light" ? "/assets/back-light.png" : "/assets/back.png"}
                  alt="back-button"
                  width={24}
                  height={24}
                  className="w-6"
                />
                <span
                  className={`hidden md:inline-block font-semibold ${theme === "light" ? "text-primary-light" : "text-primary-dark"}`}
                >
                  Go Back
                </span>
              </button>
            </div>


              <ProjectDetails
                title={currentProject.title}
                tools={currentProject.tools}
                type={currentProject.type}
                year={currentProject.year}
              />
            </div>

            <div className="px-6 max-sm:px-4 md:px-0 mb-8">
              <ImageSlider images={currentProject.images} />
            </div>

            <div className="px-6 max-sm:px-4 md:px-0 mb-12" ref={descriptionRef}>
              <ProjectDescription
                features={currentProject.features ? currentProject.features : []}
                text={currentProject.description}
                github={currentProject.githubrepo}
                live={currentProject.livelink}
                isLive={currentProject.isLive}
              />
            </div>
          </section>
        </motion.div>
      </div>
    </section>
  );
};

export default page;