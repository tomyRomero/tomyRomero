"use client"

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { slideIn } from "../../lib/motion";
import { useAppContext } from "@/lib/AppContext";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";

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
      body: JSON.stringify(form), 
    });

    if(response.ok)
    { 
      setForm({
        name: "", 
        email: "",
        message: ""
      })
      const data = await response.json();

      toast({
        title: "Success!",
        description: `${data.message}`, 
      })

    }else{
      toast({
        title: "Failed to send message",
        description: "Something went wrong!", 
        variant: "destructive",
      })
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
        <h3 className={`sectionHeadText text-center ${theme === "light" ? 'text-primary-light' : 'text-primary-dark'}`}>Contact</h3>
        <p className={`sectionSubText text-center ${theme === "light" ? 'text-primary-light' : 'text-primary-dark'}`}>Get in touch</p>
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
              required
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
            <span className={`${theme === "light" ? "text-near-black" : "text-white"} font-medium mb-4`}>Your Email</span>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder="What's your web address? So I can get back to you."
              className={`bg-white py-4 px-6 placeholder:text-gray border rounded-lg outline-none 
              ${theme === "light" ? "border-primary-light" : "border-primary-dark"}
              font-medium`}
              required
            />
          </label>
          <label className='flex flex-col'>
            <span className={`${theme === "light" ? "text-near-black" : "text-white"} font-medium mb-4`}>Your Message</span>
            <textarea
              required
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
            type='submit'
            className={`${theme === "light" ? "bg-primary-light text-white" : "bg-primary-dark text-near-black"}
            cursor-pointer hover:scale-125 ease-in-out duration-300
            py-3 px-8 rounded-xl outline-none w-fit font-bold shadow-md shadow-primary`}
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
