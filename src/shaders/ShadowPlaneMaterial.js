import * as THREE from "three";
import { extend } from "@react-three/fiber";
import glsl from "babel-plugin-glsl/macro";

class ShadowPlaneMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: glsl`
        precision mediump float;

        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: glsl`
        uniform float uTime;

        varying vec2 vUv;
    
        #pragma glslify:snoise4 = require(glsl-noise/simplex/4d.glsl);
    
        void main() {
          precision mediump float;
    
          float shadowMask = 0.12 / (distance(vUv, vec2(0.5)));
          float shadowMask1 = smoothstep(0.5, 0.8, shadowMask);
          float shadowMask2 = smoothstep(0.6, 0.85, shadowMask);
    
          vec3 circleMask = mix(vec3(0), vec3(1.), shadowMask1);
          vec3 noise = abs(vec3(snoise4(vec4(vUv*8., 1.0, uTime * 0.25))));
    
          vec3 color = noise * circleMask;
          color = clamp(vec3(0), vec3(1.), color + shadowMask2);
          color = mix(vec3(1.,1.,1.), vec3(0.2,0.3,0.55), color * 0.25);
    
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  }
}

extend({ ShadowPlaneMaterial });
