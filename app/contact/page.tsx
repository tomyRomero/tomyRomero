import StarsCanvas from '@/components/canvas/Stars'
import ContactForm from '@/components/contact/ContactForm'
import React from 'react'

const page = () => {
  return (
    <div className="py-6 relative z-0">
        <ContactForm />
        <StarsCanvas />
    </div>
  )
}

export default page