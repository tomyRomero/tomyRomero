"use client"

import Link from 'next/link'
import Image from 'next/image'
import { fadeIn, textVariant } from '@/utils/motion'
import { motion } from 'framer-motion'
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { useAppContext } from '@/lib/AppContext'
import { projects } from '@/constants'

const Projects = () => {
  const {theme} = useAppContext();

  return (
    <motion.div
    id='projects'
    className={`${theme === "light" ? '' : 'bg-near-black'}`}
    >
      <motion.div variants={textVariant()}>
        <h2 className={`sectionHeadText text-center p-1 ${theme === 'light' ? 'text-primary-light' : 'text-primary-dark'}`}>
          Projects
        </h2>
        <p className={`sectionSubText text-center p-1 ${theme === 'light' ? 'text-primary-light' : 'text-primary-dark'}`}>
          What I have done so far
        </p>
      </motion.div>
      <div className="flex flex-col w-full">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full mx-auto">
          {projects.map((project, index) => (
              <Card key={`project-${index}`}>
                <CardHeader className="flex flex-row items-center gap-4">
                  {/* You can use different icons based on your project */}
                  <Image 
                  src={project.projectIcon}
                  alt={'Project Icon'}
                  width={24}
                  height={24}
                  />
                  <div className="grid gap-1">
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.techStack}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <img
                    alt={project.title}
                    className="object-cover w-full h-60"
                    height={300}
                    src={project.image || "/placeholder.svg"}
                    style={{
                      aspectRatio: "400/300",
                      objectFit: "cover",
                    }}
                    width={400}
                  />
                  <div className="text-sm font-semibold">{project.description}</div>
                </CardContent>
              </Card>
            ))}
        </div>
      </main>
    </div>
    </motion.div>
  )
}

export default Projects

