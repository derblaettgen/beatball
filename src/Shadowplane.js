import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export const Shadowplane = (props) => {
  const planeMaterialRef = useRef();
  const planeMeshRef = useRef();

  useFrame(({ clock }) => {
    planeMaterialRef.current.uniforms.uTime.value = clock.getElapsedTime();

    const scaling = 1 + Math.sin(clock.getElapsedTime()) * -0.1;
    planeMeshRef.current.scale.x = scaling;
    planeMeshRef.current.scale.y = scaling;
  });

  return (
    <mesh
      ref={planeMeshRef}
      position={[0, -1.75, 0]}
      rotation-x={Math.PI / -2}
      scale={[1, 1, 1]}
    >
      <planeBufferGeometry args={[5, 5, 1, 1]} />
      <shadowPlaneMaterial ref={planeMaterialRef} />
    </mesh>
  );
};
