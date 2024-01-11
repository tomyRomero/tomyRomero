"use client"

import React, { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { slideIn } from "../../lib/motion";
import { useAppContext } from "@/lib/AppContext";
import { useRouter } from "next/navigation";

const ContactForm = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Mail submission logic here
    const response = await fetch('/api/nodemailer', {
      method: 'POST',
      body: JSON.stringify(form), // Convert data to JSON
    });

    if(response.ok)
    { 
      setForm({
        name: "", 
        email: "",
        message: ""
      })
      const data = await response.json();
      alert(data.message);
    }else{
      alert("Error Sending Message, please try again");
    }

 
    setLoading(false)
  };

  const {theme} = useAppContext();
  return (
    <div className="flex justify-center items-center"
    >
      <motion.div
        initial='hidden'
        animate='show'
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
      >
        <h3 className={`sectionHeadText py-1 max-sm:text-center ${theme === "light" ? 'text-primary-light' : 'text-primary-dark'}`}>Contact</h3>
        <p className={`sectionSubText max-sm:text-center ${theme === "light" ? 'text-primary-light' : 'text-primary-dark'}`}>Get in touch</p>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-8"
        >
          <label className='flex flex-col'>
            <span className={`${theme === "light" ? "text-near-black" : "text-white"} font-medium mb-4 `}>Your Name</span>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              className={`bg-white border py-4 px-6
               placeholder:text-gray rounded-lg 
               outline-none
               font-medium
              ${theme === "light" ? "border-primary-light" : "border-primary-dark"}
               `}
            />
          </label>
          <label className='flex flex-col'>
            <span className={`${theme === "light" ? "text-near-black" : "text-white"} font-medium mb-4`}>Your email</span>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder="What's your web address? So I can get back to you."
              className={`bg-white py-4 px-6 placeholder:text-gray border rounded-lg outline-none 
              ${theme === "light" ? "border-primary-light" : "border-primary-dark"}
              font-medium`}
            />
          </label>
          <label className='flex flex-col'>
            <span className={`${theme === "light" ? "text-near-black" : "text-white"} font-medium mb-4`}>Your Message</span>
            <textarea
              rows={7}
              name='message'
              value={form.message}
              onChange={handleChange}
              placeholder='What would you like to say? Include phone number or web address for me to get back to you.'
              className={`bg-white py-4 px-6 placeholder:text-secondary rounded-lg outline-none font-medium border 
              ${theme === "light" ? "border-primary-light" : "border-primary-dark"}`}
            />
          </label>
          <div className="flex justify-evenly">
          <button
            onClick={() => router.back()}
            className={`${theme === "light" ? "bg-primary-light" : "bg-primary-dark"}
             text-white py-3 px-8 rounded-xl outline-none w-fit 
             cursor-pointer hover:scale-125 ease-in-out duration-300
             font-bold shadow-md shadow-primary`}
          >
            Back
          </button>
          <button
            type='submit'
            className={`${theme === "light" ? "bg-primary-light" : "bg-primary-dark"}
            cursor-pointer hover:scale-125 ease-in-out duration-300
            py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactForm;
