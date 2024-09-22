'use client';
import { experiences } from '@/constants';
import { useAppContext } from '@/lib/AppContext';

export default function Experience() {
  const { theme } = useAppContext();

  return (
    <section
      className={`w-full mt-10 mx-auto px-10 md:px-20 py-6 relative z-0 ${
        theme === 'light' ? '' : 'bg-near-black'
      }`}
    >
      <div className="space-y-6">
        <h2
          className={`text-heading2-bold md:text-heading1-bold ${
            theme === 'light' ? 'text-primary-light' : 'text-primary-dark'
          }`}
        >
          Experience
        </h2>
        <div
          className={`grid gap-6 md:gap-8 ${
            theme === 'light' ? 'text-near-black' : 'text-white'
          }`}
        >
          {experiences.map((experience, index) => (
            <div key={index} className="grid gap-2">
              {/* Flex Direction adjusted for smaller screens */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-heading2-bold max-sm:text-heading3-bold">
                    {experience.title}
                  </h3>
                  <p
                    className={`text-heading3-bold max-sm:text-heading4-bold ${
                      theme === 'light'
                        ? 'text-primary-light'
                        : 'text-primary-dark'
                    }`}
                  >
                    {experience.company}
                  </p>
                </div>
                <p className="text-heading4-bold text-muted-foreground sm:mt-0 mt-2">
                  {experience.date}
                </p>
              </div>

              {/* Rendering the description as bullet points */}
              <ul className="grid gap-2">
                {experience.description.map((bullet, i) => (
                  <li key={i}>
                    <CheckIcon
                      className={`mr-2 inline-block h-4 w-4 ${
                        theme === 'light' ? 'text-near-black' : 'text-white'
                      }`}
                    />
                    <span className={`${theme === 'light' ? 'text-black' : 'text-white'}`}>
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}