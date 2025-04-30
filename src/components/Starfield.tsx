// Starfield.tsx
import { useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StarSpriteMaterial } from './StarMaterial';

extend({StarSpriteMaterial})

type Props = {
  count?: number;
  minspeed?: number;
  maxspeed?: number;
  halfSize?: number;
  tiltDeg?: number;
  size?: number;
};

export default function Starfield({
  count = 7000,
  minspeed = 0.4,
  maxspeed = 1.2,
  halfSize = 14,
  tiltDeg = 6,
  size = 0.035,
}: Props) {
  const pts = useRef<THREE.Points>(null!);

  /* ---------- pre-compute positions & velocities ---------- */
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 2);           // vx, vy
    const tilt = THREE.MathUtils.degToRad(tiltDeg);
    const slope = Math.tan(tilt);                      // vy = slope * vx

    for (let i = 0; i < count; i++) {
      // initial scatter
      pos[i * 3 + 0] = THREE.MathUtils.randFloatSpread(halfSize * 2);
      pos[i * 3 + 1] = THREE.MathUtils.randFloatSpread(halfSize * 2);
      pos[i * 3 + 2] = THREE.MathUtils.randFloatSpread(halfSize * 2) - halfSize/2;

      // speed
      const vx = THREE.MathUtils.randFloat(minspeed, maxspeed);
      vel[i * 2 + 0] = vx;
      vel[i * 2 + 1] = vx * slope;                    // same sign → diagonal
    }
    return { positions: pos, velocities: vel };
  }, [count, minspeed, maxspeed, halfSize, tiltDeg]);

  useFrame((_, delta) => {
    const geom = pts.current.geometry as THREE.BufferGeometry;
    const attr = geom.attributes.position as THREE.BufferAttribute;
    const { array } = attr;

    for (let i = 0; i < count; i++) {
      let x = array[i * 3 + 0] + velocities[i * 2 + 0] * delta;
      let y = array[i * 3 + 1] + velocities[i * 2 + 1] * delta;

      if (x >  halfSize) x -= halfSize * 2;
      if (y >  halfSize) y -= halfSize * 2;
      if (y < -halfSize) y += halfSize * 2;

      array[i * 3 + 0] = x;
      array[i * 3 + 1] = y;
    }
    attr.needsUpdate = true;
  });

  const mat = useMemo(() => {
    const m = new StarSpriteMaterial();
    m.uniforms.uSize.value        = size;
    m.uniforms.uAberration.value  = 0.08;
    m.uniforms.uSoftness.value    = 0.48;
    m.transparent                 = true;
    m.depthWrite                  = false;
    m.blending                    = THREE.AdditiveBlending;
    return m;
  }, [size]);

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute
          args={[positions, 3]}
          attach="attributes-position"
          count={count}
        />
      </bufferGeometry>

      <primitive 
        object={mat}
        attach="material"
      />
    </points>
  );
}
