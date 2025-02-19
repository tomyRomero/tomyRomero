"use client";
import { experiences } from '@/constants';
import { useAppContext } from '@/lib/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { textVariant } from '@/lib/motion';

export default function Experience() {
  const { theme } = useAppContext();

  return (
    <section className="max-sm:mt-4 mt-8 w-full px-6 md:px-16 py-8 relative z-0 rounded-2xl">
      <div className="space-y-8">
        {/* Title with animation */}
        <motion.div variants={textVariant()} className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
          <h2
            className={`text-heading3-bold flex items-center gap-2 text-center ${
              theme === "light" ? "text-primary-light" : "text-primary-dark"
            }`}
          >
            <Briefcase /> Experience
          </h2>
        </motion.div>

        {/* Experience Cards with animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center"
        >
          {experiences.map((experience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.2 }}
              className="w-full flex justify-center"
            >
              <Card className="w-full max-w-[500px] rounded-xl shadow-xl transition-all duration-300 transform hover:rotate-x-12 hover:rotate-y-8 hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-2xl font-bold">{experience.title}</h3>
                      <p
                        className={`text-xl font-semibold mt-1 ${
                          theme === 'light' ? 'text-primary-light' : 'text-primary-dark'
                        }`}
                      >
                        {experience.company}
                      </p>
                    </div>
                    <p className="text-md text-muted-foreground mt-2 md:mt-0">
                      {experience.date}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {experience.description.map((bullet, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle
                          className={`h-5 w-5 ${
                            theme === 'light' ? 'text-primary-light' : 'text-primary-dark'
                          }`}
                        />
                        <span className="text-md leading-relaxed">{bullet}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
      
          ))}
        </motion.div>
      </div>
    </section>
  );
}