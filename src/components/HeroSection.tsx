import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Header from "./Header";
import { useGLTF } from "@react-three/drei";
import Starfield from "./Starfield";
import { Group, MathUtils, Object3D, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils.js";

const DNA = ({ progress }: {progress : number})=> {
  const { scene } = useGLTF('/dna.glb');
  const helix = useMemo(() => {
    const g = scene.clone();
    g.scale.setScalar(0.1);
    return g;
  }, [scene]);

  const wrapper = useRef<Group>(null!);
  const spin = useRef<Object3D>(null!);

  const startPos = new Vector3(0,  0.5, -2);
  const endPos   = new Vector3(-0.5,  -0.5,  -2.5);

  useFrame((_, dt) => {
    const t = MathUtils.clamp(progress / 200, 0, 1);

    spin.current.rotation.x += dt * 0.5;

    wrapper.current.position.lerpVectors(startPos, endPos, t);
    wrapper.current.rotation.z = t * Math.PI * 0.5;
    wrapper.current.rotation.x = -t * Math.PI / 4;
  });

  return (
    <group ref={wrapper}>
      <group ref={spin}>
        <primitive object={helix} dispose={null} />
      </group>
    </group>
  );
}

const ScrollCamera = ({ progress }: { progress: number }) => {
  const { camera } = useThree();
  useFrame(() => {
    if (progress <= 200) {
      const t = ((progress / 200) * Math.PI) / 2;
      camera.rotation.x = -t / 2;
      camera.position.set(0, Math.cos(t), -1.5 * Math.sin(t));
    }
    if (progress >= 550 && progress <= 750) {
      const t = (progress - 550) / 200

      
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
    });

    return () => lenis.destroy();
  }, []);

  return (
    <div className="overflow-hidden" style={{ height: vh }}>
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
          <ScrollCamera progress={progress} />
          <Starfield
            count={200}
            minspeed={0.05}
            maxspeed={0.15}
            halfSize={5}
            tiltDeg={20}
            size={0.1}
          />
          <DNA progress={progress} />
        </Suspense>
      </Canvas>

      {/* Text overlay */}
      {progress <= 100 && (
        <div
          className="fixed pointer-events-none w-full h-screen justify-center flex items-center"
          style={{ opacity: Math.max(1 - progress / 100, 0) }}
        >
          <h1 className="playfair-display-bold text-[5rem] text-white">
            Lorem ipsum dolor sit <br />
            adipisicing elit.
          </h1>
        </div>
      )}
      {
        progress >= 200 && (
          <div
          className="absolute top-[260px] pointer-events-none w-full h-screen justify-end flex items-center"
          style={{opacity: progress < 350 ? (progress - 200) / 50 : (1 - (progress - 350) / 50)}}
        >
          <h1 className="playfair-display-medium text-[1.5rem] w-[40vw] pr-[10vw] text-white">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi doloribus tempora vel cum sapiente veritatis hic, modi aperiam ipsum repudiandae enim dolorem, quasi obcaecati corrupti!
          </h1>
        </div>
        )
      }
      {
        progress >= 400 && (
          <div
          className="absolute top-[460px] pointer-events-none w-full h-screen justify-end flex items-center"
          style={{opacity: progress < 550 ? (progress - 400) / 50 : (1 - (progress - 550) / 50)}}
        >
          <h1 className="playfair-display-medium text-[1.5rem] w-[40vw] pr-[10vw] text-white">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi doloribus tempora vel cum sapiente veritatis hic, modi aperiam ipsum repudiandae enim dolorem, quasi obcaecati corrupti!
          </h1>
        </div>
        )
      }
    </div>
  );
};

export default HeroSection;
