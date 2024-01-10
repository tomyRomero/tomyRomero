"use client"

import React, { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { slideIn } from "../../utils/motion";
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Add your form submission logic here
  };

  const {theme} = useAppContext();
  return (
    <div className="flex justify-center items-center"
    >
      <motion.div
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
              placeholder="What's your good name?"
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
              placeholder="What's your web address?"
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
              placeholder='What you want to say?'
              className={`bg-white py-4 px-6 placeholder:text-secondary rounded-lg outline-none font-medium border 
              ${theme === "light" ? "border-primary-light" : "border-primary-dark"}`}
            />
          </label>
          <div className="flex justify-evenly">
          <button
            onClick={() => router.back()}
            className={`${theme === "light" ? "bg-primary-light" : "bg-primary-dark"} text-white py-3 px-8 rounded-xl outline-none w-fit font-bold shadow-md shadow-primary`}
          >
            Back
          </button>
          <button
            type='submit'
            className={`${theme === "light" ? "bg-primary-light" : "bg-primary-dark"} py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
          </div>
        </form>
      </motion.div>
      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
      </motion.div>
    </div>
  );
};

export default ContactForm;
