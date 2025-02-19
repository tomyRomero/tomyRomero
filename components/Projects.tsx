"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/lib/AppContext";
import { projects } from "@/constants";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import { textVariant } from "@/lib/motion";

const Projects = () => {
  const { theme, setSelected } = useAppContext();
  const [ref, inView] = useInView({ triggerOnce: false });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (inView) {
      setSelected(2);
    }
  }, [inView]);

  if (!mounted) return null;

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-12 sm:mt-8 px-4 md:px-16 max-w-7xl mx-auto">
      {/* Projects Title */}
      <motion.div variants={textVariant()} className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
          <h2
            className={`text-heading2-bold flex items-center gap-2 text-center ${
              theme === "light" ? "text-primary-light" : "text-primary-dark"
            }`}
          >
            <FolderOpen /> Projects
          </h2>
        </motion.div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6 mt-10 px-6 sm:px-4 md:px-16">
        {projects.map((project) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Link href={`/project/${project.title}`} className="block">
              <Card className={`relative rounded-3xl shadow-[0px_-2px_4px_rgba(0,0,0,0.2),0px_4px_6px_rgba(0,0,0,0.1)] transition-transform ${theme === "light" ? "bg-white" : " text-white shadow-primary-dark bg-near-black"} p-4 border-none`}> 
                <div className="absolute inset-0 opacity-20 rounded-xl"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className={`text-heading6-bold tracking-wide whitespace-nowrap ${theme === "light" ? "text-primary-light" : "text-primary-dark"}`}>{project.title}</CardTitle>
                  <CardDescription className={`text-body-normal italic ${theme === "light" ? "text-near-black" : "text-white"}`}>{project.techStack}</CardDescription>
                </CardHeader>
                <CardContent className="p-2 flex flex-col gap-2 relative z-10">
                  {/* Project Image */}
                  <Image
                    alt={project.title}
                    src={project.image}
                    width={300}
                    height={160}
                    className="w-full h-36 object-scale-down rounded-xl"
                  />
                  <p className="pt-1 leading-5 max-sm:text-small-regular md:text-body-normal ">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <span className={`${theme === "light" ? "text-primary-light" : "text-primary-dark"}`}>Click for Details</span>
                    {/* GitHub Button */}
                    <Link href={project.link} target="_blank" className="w-10 h-10 flex justify-center items-center rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Image
                        src={theme === "light" ? "/assets/github.svg" : "/assets/githubdark.png"}
                        alt="GitHub Repository"
                        width={20}
                        height={20}
                        className="object-contain w-5 h-5 transition-transform hover:scale-110"
                      />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </section>
    </motion.div>
  );
};

export default Projects;
