import { shaderMaterial } from '@react-three/drei';

export const StarSpriteMaterial = shaderMaterial(
  {
    uSize:       1.0,   // will be overwritten by prop
    uAberration: 0.12,  // sprite-space offset
    uSoftness:   0.45,  // 0 = hard edge, 0.5+ = blurry
  },
  `
  uniform float uSize;
  varying vec3  vColor;

  void main() {
    vColor = vec3(1.0);                   // white — change if you want colours
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);

    gl_PointSize = uSize * (300.0 / -mvPos.z);  // sizeAttenuation hack
    gl_Position  = projectionMatrix * mvPos;
  }`,
  `
  uniform float uAberration;
  uniform float uSoftness;
  varying vec3  vColor;

  // return alpha for a disc with soft edge
  float disc(vec2 uv, float r) {
    return smoothstep(r, r - uSoftness, length(uv - 0.5));
  }

  void main() {
    vec2 uv = gl_PointCoord;

    float r = disc(uv + vec2( uAberration, 0.0), 0.5);
    float g = disc(uv + vec2(-uAberration, 0.0), 0.5);
    float b = disc(uv,                         0.5);

    float a = max(max(r, g), b);

    gl_FragColor = vec4(r, g, b, a) * vec4(vColor, 1.0);
  }`
);
