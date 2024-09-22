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
      <section className="w-full">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center"></div>
          <div className="py-6 relative z-0">
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="w-full ml-20 py-10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {contactDetails.map((contact, index) => (
              <div key={index} className="space-y-2">
                <h2
                  className={`text-heading3-bold ${
                    theme === "light"
                      ? "text-primary-light"
                      : "text-primary-dark"
                  }`}
                >
                  {contact.type}
                </h2>
                {contact.href ? (
                  <Link href={contact.href} target="_blank">
                    <p
                      className={`text-base-regular ${
                        theme === "light"
                          ? "text-near-black hover:text-primary-light"
                          : "text-white hover:text-primary-dark"
                      } hover:underline`}
                    >
                      {contact.value}
                    </p>
                  </Link>
                ) : (
                  <p
                    className={`text-base-regular ${
                      theme === "light" ? "text-near-black" : "text-white"
                    }`}
                  >
                    {contact.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer
        className={`w-full h-20 flex justify-center items-center border-t ${
          theme === "light" ? "border-primary-light" : "border-primary-dark"
        }`}
      >
        <p
          ref={ref}
          className={`text-body1 ${
            theme === "light" ? "text-near-black" : "text-white"
          }`}
        >
          ©Tomy Romero. All rights reserved.
        </p>
      </footer>
    </>
  );
}