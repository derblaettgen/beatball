import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Particles = (props) => {
  const mesh = useRef();

  const getRandomInt = (min, max) => {
    if (min < 0) max = Math.abs(min) + max;
    return Math.floor(Math.random() * max) + min;
  };

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < props.count; i++) {
      const time = getRandomInt(0, 100);
      const factor = getRandomInt(20, 120);
      const speed = getRandomInt(0.01, 0.015) * 0.005;
      const x = getRandomInt(-20, 20);
      const y = getRandomInt(-20, 20);
      const z = getRandomInt(-20, 20);

      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [props.count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    particles.forEach((particle, index) => {
      let { factor, speed, x, y, z } = particle;
      const t = (particle.time += speed);

      dummy.position.set(
        x + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 5,
        y + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 5,
        z + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 5
      );

      const s = Math.cos(t);
      dummy.scale.set(s * 0.5, s * 0.5, s * 0.5);
      dummy.rotation.set(s * 20, s * 20, s * 20);
      dummy.updateMatrix();

      mesh.current.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={mesh} args={[null, null, props.count]}>
        <dodecahedronBufferGeometry args={[0.1, 0]} />
        <meshBasicMaterial color="lightgray" />
      </instancedMesh>
    </>
  );
};
