import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Header from "./Header";
import { useGLTF } from "@react-three/drei";
import Starfield from "./Starfield";

const DNA = ({ progress }: { progress: number }) => {
  const { scene } = useGLTF('/dna.glb');

  // scene.position.y = 0;

  // useFrame(() => {
  //     scene.rotation.x = 0
  //     scene.rotation.z = 1
  //     scene.rotation.y = progress * Math.PI * 2;
  //     scene.position.z = -50;
  // });

  return <primitive object={scene} dispose={null} />;
};

function ScrollCamera({ progress }: { progress: number }) {
  const { camera } = useThree();
  useFrame(() => {
    if (progress <= 200) {
      const t = progress/200 * Math.PI / 2; 
      camera.rotation.x = -t/2;
      camera.position.set(0, Math.cos(t), -1.5*Math.sin(t));
    }
  });
  return null;
}

const vh = window.innerHeight * 15;

const HeroSection = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ({ progress }: { progress: number }) => {
      setProgress(progress * vh);
      console.log(progress * vh);
    });

    return () => lenis.destroy();
  }, []);

  return (
    <div className="overflow-hidden" style={{height: vh}}>
      <Header />
      {/* Three.js scene */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ position: "fixed", inset: 0, backgroundColor: "black" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <ScrollCamera progress={progress}/>
          <Starfield count={200} minspeed={0.05} maxspeed={0.15} halfSize={5} tiltDeg={20} size={0.1} />
          <DNA progress={progress} />
        </Suspense>
      </Canvas>

      {/* Text overlay */}
      { progress <= 100 &&
      <div className="fixed pointer-events-none w-full h-screen justify-center flex items-center" style={{opacity: Math.max(1-progress/100, 0)}}>
        <h1 className="playfair-display-bold text-[5rem] text-white">
          Lorem ipsum dolor sit <br />adipisicing elit.
        </h1>
      </div>
      }
    </div>
  );
};

export default HeroSection;
