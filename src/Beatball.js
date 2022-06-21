import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Beatball = (props) => {
  const sphereMaterialRef = useRef();
  const sphereMesh = useRef();

  const origStabColor = new THREE.Color().setHSL(0.04, 1, 0.38);
  const origBassColor = new THREE.Color().setHSL(0.1, 1, 0.5);

  const [stabColor, setStabColor] = useState(origStabColor);
  const [bassColor, setBassColor] = useState(origBassColor);

  useFrame(({ clock }) => {
    const uniforms = sphereMaterialRef.current.uniforms;
    sphereMesh.current.position.y = Math.sin(clock.getElapsedTime()) * 0.1;
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uColor_1.value = stabColor;
    uniforms.uColor_2.value = bassColor;

    if (props.amp) {
      props.amp.analyze();

      const bassdrum = props.amp.getEnergy(300, 500) / 200;
      sphereMaterialRef.current.uniforms.uBassDrum.value = THREE.MathUtils.lerp(
        sphereMaterialRef.current.uniforms.uBassDrum.value,
        bassdrum,
        0.5
      );

      const stab = props.amp.getEnergy(10000, 15000) / 130;
      sphereMaterialRef.current.uniforms.uStabSynth.value = THREE.MathUtils.lerp(
        sphereMaterialRef.current.uniforms.uStabSynth.value,
        stab,
        0.5
      );

      let newStabColor = new THREE.Color(stabColor);
      let newBassColor = new THREE.Color(bassColor);
      let lerpFactor = 1.0;

      if (stab < 0.1 && bassdrum < 0.1) {
        newStabColor = origStabColor;
        newBassColor = origBassColor;
        lerpFactor = 0.00001;
      }

      if (stab > 0.65) {
        newStabColor = new THREE.Color().setHSL(
          THREE.MathUtils.randFloat(0, 1) *
            Math.abs(Math.sin(clock.getElapsedTime()) * 0.9),
          1,
          0.3 * lerpFactor
        );
        newBassColor = new THREE.Color().setHSL(
          THREE.MathUtils.randFloat(0, 1) *
            Math.abs(Math.sin(clock.getElapsedTime()) * 0.9),
          1,
          0.5 * lerpFactor
        );
      }

      setStabColor(stabColor.lerpHSL(newStabColor, 0.08));
      setBassColor(bassColor.lerpHSL(newBassColor, 0.08));
    }
  });

  return (
    <>
      <mesh ref={sphereMesh} position={[0, 0, 0]}>
        <sphereBufferGeometry args={[1, 128, 128]} />
        {/* <boxBufferGeometry args={[1,1,1,16,16,16]} /> */}
        <beatBallMaterial ref={sphereMaterialRef} />
      </mesh>
    </>
  );
};
