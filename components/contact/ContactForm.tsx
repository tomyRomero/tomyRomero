"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { slideIn, textVariant } from "../../lib/motion";
import { useAppContext } from "@/lib/AppContext";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

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

    try {
      const response = await fetch('/api/nodemailer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setForm({ name: "", email: "", message: "" });
        toast({
          title: "Success!",
          description: data.message,
          className: `${theme === "light" ? "bg-primary-light text-white" : "bg-primary-dark"}`
        });
      } else {
        toast({
          title: "Failed to send message",
          description: data.message || "Something went wrong!",
          variant: "destructive",
          className: `${theme === "light" ? "bg-primary-light text-white" : "bg-primary-dark"}`
        });
      }
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Something went wrong!",
        variant: "destructive",
        className: `${theme === "light" ? "bg-primary-light text-white" : "bg-primary-dark"}`
      });
    }

    setLoading(false);
  };

  const { theme } = useAppContext();
  return (
    <div className="flex justify-center items-center px-4 md:px-8 lg:px-16">
      <motion.div
        initial="hidden"
        animate="show"
        variants={slideIn("left", "tween", 0.2, 1)}
        className={`w-full max-w-xl lg:max-w-2xl rounded-2xl p-8 md:p-12 
          transition-all mx-auto`}
      >
        <motion.div variants={textVariant()} className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
          <h2
            className={`text-heading2-bold flex items-center gap-2 text-center ${
              theme === "light" ? "text-primary-light" : "text-primary-dark"
            }`}
          >
            <Mail /> Contact Me
          </h2>
        </motion.div>
        <p className={`text-lg text-center mt-2 ${theme === "light" ? "text-near-black" : "text-white"}`}>
          Let's work together! Drop me a message.
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
          <label className="flex flex-col">
            <span className={`font-medium mb-2 ${theme === "light" ? "text-primary-light" : "text-primary-dark"}`}>
              Your Name
            </span>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              className={`border border-near-black py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:border-none
                ${theme === "light" ? "focus:ring-primary-light" : "focus:ring-primary-dark"} 
                transition-all duration-300 ease-in-out`}
            />
          </label>
          <label className="flex flex-col">
            <span className={`font-medium mb-2 ${theme === "light" ? "text-primary-light" : "text-primary-dark"}`}>
              Your Email
            </span>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Your email address"
              className={`py-3 px-4 rounded-lg focus:outline-none focus:ring-2 border border-near-black focus:border-none
                ${theme === "light" ? "focus:ring-primary-light" : "focus:ring-primary-dark"} 
                transition-all duration-300 ease-in-out`}
            />
          </label>
          <label className="flex flex-col">
            <span className={`font-medium mb-2 ${theme === "light" ? "text-primary-light" : "text-primary-dark"}`}>
              Your Message
            </span>
            <textarea
              required
              rows={6}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              className={`py-3 px-4 rounded-lg focus:outline-none focus:ring-2 border border-near-black focus:border-none
                ${theme === "light" ? "focus:ring-primary-light" : "focus:ring-primary-dark"} 
                transition-all duration-300 ease-in-out`}
            />
          </label>

          <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold text-lg shadow-md transition-all 
                ${loading ? "bg-gray cursor-not-allowed text-near-black" : `${theme === "light" ? "bg-primary-light" : "bg-primary-dark"} text-white hover:scale-105 focus:ring-primary`}
              `}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactForm;