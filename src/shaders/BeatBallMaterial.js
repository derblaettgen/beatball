import * as THREE from "three";
import { extend } from "@react-three/fiber";
import glsl from "babel-plugin-glsl/macro";

class BeatBallMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uColor_1: { value: new THREE.Color(0, 0.74, 0.54) },
        uColor_2: { value: new THREE.Color(1, 1, 0.4) },
        uBassDrum: { value: 0 },
        uStabSynth: { value: 0 }
      },
      vertexShader: glsl`
        precision mediump float;

        uniform float uTime;
        uniform float uBassDrum;
        uniform float uStabSynth;

        varying vec3 vPos;
        varying vec3 vNoise;
        varying vec3 vNormal;

        #pragma glslify:snoise4 = require(glsl-noise/simplex/4d.glsl);

        void main() {
          vPos = position;

          vNoise = abs(vec3(snoise4(vec4(vPos*1.25, uTime * 0.25)) * 1.2));

          vec3 noisePos = position + (position * 0.25) * (vNoise * 0.5);
          vec3 bassPos = noisePos + (noisePos * (smoothstep(0.3, 1., vNoise) * 0.2));

          vec3 stabNoise= abs(vec3(snoise4(vec4(vPos * 3., uTime * 0.1))));
          stabNoise = position + position * 0.5 * (stabNoise * smoothstep(0.75, 0.9, abs(vNoise-vec3(1))));
          
          vec3 pos;
          pos = mix(noisePos, bassPos, uBassDrum);
          pos = mix(pos, stabNoise, uStabSynth);

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          vNormal = normal;
        }
      `,
      fragmentShader: glsl`
        uniform vec3 uColor_1;
        uniform vec3 uColor_2;

        varying vec3 vPos;
        varying vec3 vNoise;
        varying vec3 vNormal;
    
        void main() {
          precision mediump float;

          vec3 color = mix(uColor_1, uColor_2, vNoise * 1.5);
    
          vec3 contactShadow = vec3(vNormal.y * -1.);
          contactShadow = smoothstep(-0.2, 1.5, contactShadow);
    
          color = mix(color, vec3(0.2,0.2,0.4), contactShadow);
          color = mix(color, uColor_1, contactShadow * 0.7);
    
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  }
}

extend({ BeatBallMaterial });
