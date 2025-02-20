"use client";

import { useAppContext } from "@/lib/AppContext";
import Link from "next/link";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ContactForm from "./ContactForm";
import { contactDetails } from "@/constants/index";

export default function Contact() {
  const { theme, setSelected } = useAppContext();

  // Set up the ref and inView state for the intersection observer
  const [ref, inView] = useInView({
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      setSelected(3);
    }
  }, [inView]);

  return (
    <>
      {/* <section className="w-full">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center"></div>
          <div className="pt-6 relative z-0">
            <ContactForm />
          </div>
        </div>
      </section> */}

<section className="w-full py-12">
  <div className="container mx-auto px-6 md:px-12">
    <div className="text-center mb-10">
      <h2
        className={`text-heading3-bold ${
          theme === "light" ? "text-primary-light" : "text-primary-dark"
        }`}
      >
        Get in Touch
      </h2>
      <p className={`text-body-normal mt-2 ${theme === "light" ? "text-near-black" : "text-white"}`}>
        Feel free to reach out through any of the platforms below.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
      {contactDetails.map((contact, index) => (
        <div
          key={index}
          className="relative p-6 bg-white rounded-2xl shadow-[0px_-2px_4px_rgba(0,0,0,0.2),0px_4px_6px_rgba(0,0,0,0.1)] transition-transform hover:scale-105"
        >
          <h3
            className={`text-heading6-bold mb-2 ${
              theme === "light" ? "text-primary-light" : "text-primary-dark"
            }`}
          >
            {contact.type}
          </h3>
          {contact.href ? (
            <Link href={contact.href} target="_blank">
              <p
                className={`text-body-normal font-medium ${
                  theme === "light"
                    ? "text-gray-800 hover:text-primary-light"
                    : "text-gray-300 hover:text-primary-dark"
                } transition-colors duration-300 hover:underline`}
              >
                {contact.value}
              </p>
            </Link>
          ) : (
            <p className="text-body-normal font-medium text-gray-700 dark:text-gray-300">
              {contact.value}
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
</section>

    </>
  );
}