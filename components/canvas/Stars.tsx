"use client"

import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
//@ts-ignore
import * as random from "maath/random/dist/maath-random.esm";
import { useAppContext } from "@/lib/AppContext";

const Stars = (props: any) => {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.2 }));

  useFrame((state, delta) => {
    //@ts-ignore
    ref.current.rotation.x -= delta / 10;
    //@ts-ignore
    ref.current.rotation.y -= delta / 15;
  });

  const {theme} = useAppContext();

  // Conditionally set the star color based on the theme
  const starColor = theme === "light" ? '#001F3F' : '#F7B787';

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color={starColor}
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  const {theme} = useAppContext();
  return (
    <div className={`w-full h-auto absolute inset-0 z-[-1]  ${theme === "light" ? '' : 'bg-near-black'}`}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;