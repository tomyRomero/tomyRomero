"use client"

// Import necessary React modules
import React, { createContext, useContext, ReactNode, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Define the types for the context
type AppContextProps = {
  // Define your state and methods here
  theme: any;
  setTheme: React.Dispatch<React.SetStateAction<any>>;
  // Add additional states here
  slider: any;
  setSlider: React.Dispatch<React.SetStateAction<any>>;
  
  selected: any;
  setSelected: React.Dispatch<React.SetStateAction<any>>;

   // New section refs
   aboutRef: React.RefObject<HTMLDivElement>;
   projectsRef: React.RefObject<HTMLDivElement>;
   contactRef: React.RefObject<HTMLDivElement>;
   experienceRef: React.RefObject<HTMLDivElement>;
   descriptionRef: React.RefObject<HTMLDivElement>;

   scrollToSection: (section: string) => void;
};

// Create the AppContext with an initial value of undefined
const AppContext = createContext<AppContextProps | undefined>(undefined);

// Create the AppProvider component that will wrap your application
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const router = useRouter();
  // Initialize the user state using the useState hook
  const [theme, setTheme] = useState<any>("light");

  // Add additional states using the useState hook
  const [slider, setSlider] = useState(false)

  //For navbar , selected pages
  const [selected, setSelected] = useState(0);

  // Create refs for sections
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: string) => {
    const refMap: { [key: string]: React.RefObject<HTMLDivElement> } = {
      about: aboutRef,
      projects: projectsRef,
      contact: contactRef,
      experience: experienceRef,
      description: descriptionRef,
    };
  
    const sectionRef = refMap[section];
    // Check if we are already on the home page
    if (sectionRef?.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If we are on a project page, push to home and then scroll
      router.push('/'); // Navigate to the home page
      setTimeout(() => {
        // Use a timeout to ensure the navigation happens before scrolling
        const targetRef = refMap[section];
        if (targetRef?.current) {
          targetRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300); // Adjust the delay if necessary
    }
  };

  // Provide the context value to the children components, include additional states if there are any
  const contextValue: AppContextProps = {
    theme,
    setTheme,
    slider,
    setSlider,
    selected, setSelected,

    // Refs
    aboutRef,
    projectsRef,
    contactRef,
    experienceRef,
    descriptionRef,

    scrollToSection 
  };


  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// Create a custom hook (useAppContext) to easily access the context
export const useAppContext = () => {
  // Use the useContext hook to access the AppContext
  const context = useContext(AppContext);

  // Throw an error if the hook is not used within an AppProvider
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  // Return the context value
  return context;
};
