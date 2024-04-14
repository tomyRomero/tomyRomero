"use client"

import StarsCanvas from '@/components/canvas/Stars'
import ContactForm from '@/components/contact/ContactForm'
import { useAppContext } from '@/lib/AppContext'
import React from 'react'

const page = () => {

  const {theme} = useAppContext();

  return (
    <section className={`${theme === "light" ? '' : 'bg-near-black h-screen'}`}>
      <div className={`py-6 relative z-0`}>
          <ContactForm />
          <StarsCanvas />
      </div>
    </section>
  )
}

export default page