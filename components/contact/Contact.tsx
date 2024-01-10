"use client"

import { useAppContext } from "@/lib/AppContext";
import Link from "next/link"

export default function Contact() {
const {theme} = useAppContext();

  return (
    <>
      <section className={`w-full py-12 md:py-16 lg:py-20 `}>
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className={`text-heading1-semibold tracking-tighter py-2 ${theme === 'light' ? 'text-primary-light' : 'text-primary-dark'}`}>
                Get in Touch
              </h1>
              <p className={`mx-auto max-w-[700px] text-body-medium py-6 ${theme === 'light' ? 'text-near-black' : 'text-white'}`}>
                I would love to hear from you. Click below to send me a message and I'll get back to you as soon as
                possible.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Link
                className={`
                ${theme === "light" ? 'bg-primary-light text-white' : 'bg-primary-dark '}
                inline-flex h-10 items-center justify-center rounded-md 
                px-8 text-body1-bold shadow transition-colors focus-visible:outline-none 
                focus-visible:ring-1 disabled:opacity-50
                cursor-pointer hover:scale-105 ease-in-out duration-300
                `}
                href="/contact"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full ml-20 py-10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-2">
              <h2 className={`text-heading3-bold ${theme === 'light' ? 'text-primary-light' : 'text-primary-dark'}`}>Email</h2>
              <p className={`text-base-regular ${theme === 'light' ? 'text-near-black' : 'text-white'}`}>tomyfletcher99@hotmail.com</p>
            </div>
            <div className="space-y-2">
              <h2 className={`text-heading3-bold ${theme === 'light' ? 'text-primary-light' : 'text-primary-dark'}`}>Linkedin</h2>
              <p className={`text-base-regular ${theme === 'light' ? 'text-near-black' : 'text-white'}`}>Tomy Romero</p>
            </div>
            <div className="space-y-2">
              <h2 className={`text-heading3-bold ${theme === 'light' ? 'text-primary-light' : 'text-primary-dark'}`}>Location</h2>
              <p className={`text-base-regular ${theme === 'light' ? 'text-near-black' : 'text-white'}`}>U.S Virgin Islands</p>
            </div>
          </div>
        </div>
      </section>
      <footer className={`w-full h-20 flex justify-center items-center border-t ${ theme === "light" ? 'border-primary-light' : 'border-primary-dark'}`}>
        <p className={`text-body1 ${theme === 'light' ? 'text-near-black' : 'text-white'}`}>©Tomy Romero. All rights reserved.</p>
        </footer>
        </>
  )
}

