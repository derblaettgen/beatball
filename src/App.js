import "./styles.css";
import React, { useRef, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Particles } from "./Particles";
import "./shaders/BeatBallMaterial";
import "./shaders/ShadowPlaneMaterial";
import Sketch from "react-p5";
import "p5/lib/addons/p5.sound";
import { Beatball } from "./Beatball";
import { Shadowplane } from "./Shadowplane";
import {
  EffectComposer,
  Noise,
  Vignette,
  Bloom,
  DepthOfField
} from "@react-three/postprocessing";
import { ReactComponent as Play } from "./svg/play.svg";
import { ReactComponent as Stop } from "./svg/stop.svg";

const BallGroup = (props) => {
  const groupRef = useRef();
  useFrame(() => (groupRef.current.rotation.y += 0.005));

  return (
    <group ref={groupRef}>
      <Beatball amp={props.amp} />
      <Shadowplane amp={props.amp} />
    </group>
  );
};

const Scene = (props) => {
  return (
    <Canvas camera={{ fov: 60 }}>
      <color attach="background" args={["#ffffff"]} />
      <Suspense fallback={null}>
        <BallGroup amp={props.amp} />
        <Particles count={8000} />
      </Suspense>
      <OrbitControls />
      <EffectComposer multisampling={0} disableNormalPass={true}>
        <Bloom
          luminanceThreshold={0.5}
          luminanceSmoothing={1.5}
          height={1000}
          opacity={2}
        />
        <Vignette eskil={false} offset={0.5} darkness={0.5} />
        <Noise opacity={0.05} />
        <DepthOfField
          focusDistance={0} // where to focus
          focalLength={0.05} // focal length
          bokehScale={5} // bokeh size
        />
      </EffectComposer>
    </Canvas>
  );
};

function App() {
  const [song, setSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [amp, setAmp] = useState(null);

  const preload = (p5) => {
    setSong(p5.loadSound("./justice.mp3"));
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(1, 1).parent(canvasParentRef);
    p5.frameRate(60);
    setAmp(new window.p5.FFT());
  };

  const draw = (p5) => {};

  const playSong = () => {
    if (song === null && song.isLoaded()) return;

    isPlaying ? song.stop() : song.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <button onClick={playSong}>{isPlaying ? <Stop /> : <Play />}</button>
      <Scene amp={amp} />
      <Sketch id="p5" preload={preload} setup={setup} draw={draw} />
    </>
  );
}

export default App;
