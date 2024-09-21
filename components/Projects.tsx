"use client";

import Link from "next/link";
import Image from "next/image";
import { fadeIn, staggerContainer, textVariant } from "../lib/motion";
import { motion } from "framer-motion";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { useAppContext } from "@/lib/AppContext";
import { projects } from "@/constants";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

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
    <motion.div
      //@ts-ignore
      variants={staggerContainer()}
      className="mt-10"
    >
      <motion.div
        //@ts-ignore
        variants={textVariant()}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        <h2
          className={`sectionHeadText text-center p-1 ${
            theme === "light" ? "text-primary-light" : "text-primary-dark"
          }`}
        >
          Projects
        </h2>
        <p
          ref={ref}
          className={`sectionSubText text-center p-1 ${
            theme === "light" ? "text-near-black" : "text-white"
          }`}
        >
          Some of my top projects so far
        </p>
      </motion.div>
      <div className="flex flex-col w-full">
        <section className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 ">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full mx-auto">
            {projects.map((project, index) => (
              <motion.div
                initial="hidden"
                animate={"show"}
                key={project.title}
                variants={fadeIn("up", "spring", index * 0.5, 0.75)}
              >
                <Link href={`/project/${project.title}`}>
                  <Card
                    className={`border-2 rounded-xl max-sm:w-3/4 max-sm:mx-auto
                  cursor-pointer hover:scale-105 ease-in-out duration-300 
                  ${theme === "light" ? "border-primary-light shadow-card" : "border-primary-dark bg-near-black text-white"}
                  `}
                  >
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Link href={project.link} target="_blank"
                      onClick={(e) => e.stopPropagation()} // Prevents click from triggering main link
                      >
                        <Image
                          src={
                            theme === "light"
                              ? "/assets/github.svg"
                              : "/assets/githubdark.png"
                          }
                          alt={"Project Icon"}
                          width={34}
                          height={34}
                          className="hover:scale-150 ease-in-out duration-300"
                        />
                      </Link>
                      <div className="grid gap-1">
                        <CardTitle className="text-heading2-bold">
                          <span>{project.title}</span>
                        </CardTitle>
                        <CardDescription
                          className={`text-base-regular font-bold ${
                            theme === "light"
                              ? "text-primary-light"
                              : "text-primary-dark"
                          }`}
                        >
                          {project.techStack}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                      <Image
                        alt={project.title}
                        className="object-contain w-full h-60 rounded-2xl"
                        height={300}
                        width={300}
                        src={project.image}
                      />
                      <div className="text-base1-semibold p-1">
                        {project.description}
                      </div>
                      <div
                        className={`text-small-semibold p-1 ${
                          theme === "light"
                            ? "text-primary-light"
                            : "text-primary-dark"
                        }`}
                      >
                        Click for Details
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Projects;