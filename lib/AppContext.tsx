"use client"

// Import necessary React modules
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

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
};

// Create the AppContext with an initial value of undefined
const AppContext = createContext<AppContextProps | undefined>(undefined);

// Create the AppProvider component that will wrap your application
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize the user state using the useState hook
  const [theme, setTheme] = useState<any>("light");

  // Add additional states using the useState hook
  const [slider, setSlider] = useState(false)

  //For navbar , selected pages
  const [selected, setSelected] = useState(0);

  // Provide the context value to the children components, include additional states if there are any
  const contextValue: AppContextProps = {
    theme,
    setTheme,
    slider,
    setSlider,
    selected, setSelected
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
