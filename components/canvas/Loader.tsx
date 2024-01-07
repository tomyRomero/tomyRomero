"use client"
import { useAppContext } from "@/lib/AppContext";
import { Html, useProgress } from "@react-three/drei";


const CanvasLoader = () => {
  const {theme} = useAppContext();
  const { progress } = useProgress();
  return (
    <Html
      as='div'
      center
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <span className='canvas-loader'></span>
      <p
        style={{
          fontSize: 14,
          color: `${theme === 'light' ? '#0060d4' : '#F7B787'}`,
          fontWeight: 800,
          marginTop: 40,
        }}
      >
        {progress.toFixed(2)}%
      </p>
    </Html>
  );
};

export default CanvasLoader;