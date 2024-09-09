"use client"
import { experiences } from "@/constants";
import { useAppContext } from "@/lib/AppContext";

export default function Experience() {

    const {theme} = useAppContext();

  return (
    <section className={`w-full mt-10 mx-auto px-20 py-6 relative z-0 ${theme === "light" ? '' : 'bg-near-black'}`}
     id="experience"
    >
   
        <div className="space-y-6">
          <h2 className={`sectionHeadText ${theme === "light" ? 'text-primary-light' : 'text-primary-dark'}`}>Experience</h2>
          <div className={`grid gap-8 ${theme === "light" ? 'text-near-black' : 'text-white'}`}>
            {experiences.map((experience, index) => (
              <div key={index} className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className={`text-heading2-bold max-sm:text-heading3-bold}`}>{experience.title}</h3>
                    <p className={`text-heading3-bold max-sm:text-heading4-bold ${theme === "light" ? 'text-primary-light' : 'text-primary-dark'}`}>{experience.company}</p>
                  </div>
                  <p className="text-heading4-bold text-muted-foreground">{experience.date}</p>
                </div>
                <p className="">{experience.description}</p>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
}