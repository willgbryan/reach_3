import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { CameraDragControls } from "./camera/CameraDragControls";
import { Observer } from "./camera/Observer";
import vertexShader from './vertexShader.glsl';
import fragmentShader from './fragmentShader.glsl';
import { createConfigGUI } from './gui/datGUI';
import { createStatsGUI } from './gui/statsGUI';

const BlackHole = () => {
  const canvasRef = useRef(null);
  const [debugInfo, setDebugInfo] = useState('Initializing...');

  useEffect(() => {
    if (!canvasRef.current) {
      setDebugInfo('Canvas not found');
      return;
    }

    setDebugInfo('Setting up renderer...');
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    setDebugInfo('Setting up scene and camera...');
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    setDebugInfo('Setting up EffectComposer...');
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    setDebugInfo('Setting up Observer and CameraDragControls...');
    const observer = new Observer(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    observer.distance = 10; // Set initial distance
    observer.position.set(0, 0, observer.distance); // Set initial position
    observer.setDirection(0, 0); // Set initial direction
    const cameraControl = new CameraDragControls(observer, canvasRef.current);

    setDebugInfo('Loading textures...');
    const textureLoader = new THREE.TextureLoader();
    // const bgTexture = textureLoader.load('/milkyway.png');
    // const starTexture = textureLoader.load('/star_noise.png');
    const diskTexture = textureLoader.load('/accretion_disk.png');

    setDebugInfo('Setting up uniforms...');
    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      cam_pos: { value: new THREE.Vector3() },
      cam_dir: { value: new THREE.Vector3() },
      cam_up: { value: new THREE.Vector3() },
      fov: { value: 60 },
      cam_vel: { value: new THREE.Vector3() },
      accretion_disk: { value: true },
      use_disk_texture: { value: true },
      doppler_shift: { value: true },
      lorentz_transform: { value: true },
      beaming: { value: true },
      // bg_texture: { value: bgTexture },
      // star_texture: { value: starTexture },
      disk_texture: { value: diskTexture },
    };

    setDebugInfo('Creating shader material...');
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    setDebugInfo('Creating mesh...');
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    setDebugInfo('Setting up GUI...');
    const changePerformanceQuality = (quality) => {
      // Implement quality change logic here
      console.log('Changing quality to:', quality);
    };

    const saveScreenshot = () => {
      // Implement screenshot saving logic here
      console.log('Saving screenshot');
    };

    const { performanceConfig, bloomConfig, effectConfig, cameraConfig } = createConfigGUI(changePerformanceQuality, saveScreenshot);

    setDebugInfo('Setting up Stats...');
    const stats = createStatsGUI();
    document.body.appendChild(stats.dom);

    setDebugInfo('Starting animation loop...');
    const animate = () => {
      requestAnimationFrame(animate);
      stats.begin();

      uniforms.time.value += 0.01;
      observer.update(0.016);
      cameraControl.update(0.016);

      uniforms.cam_pos.value.copy(observer.position);
      uniforms.cam_dir.value.copy(observer.direction);
      uniforms.cam_up.value.copy(observer.up);
      uniforms.cam_vel.value.copy(observer.velocity);
      uniforms.fov.value = observer.fov;

      // Update uniforms based on GUI values
      uniforms.accretion_disk.value = effectConfig.accretion_disk;
      uniforms.use_disk_texture.value = effectConfig.use_disk_texture;
      uniforms.doppler_shift.value = effectConfig.doppler_shift;
      uniforms.lorentz_transform.value = effectConfig.lorentz_transform;
      uniforms.beaming.value = effectConfig.beaming;

      bloomPass.strength = bloomConfig.strength;
      bloomPass.radius = bloomConfig.radius;
      bloomPass.threshold = bloomConfig.threshold;

      observer.distance = cameraConfig.distance;
      observer.fov = cameraConfig.fov;
      observer.moving = cameraConfig.orbit;
      observer.updateProjectionMatrix();

      composer.render();

      stats.end();
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      composer.setSize(width, height);
      uniforms.resolution.value.set(width, height);
      observer.aspect = width / height;
      observer.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.removeChild(stats.dom);
      setDebugInfo('Component unmounted');
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100vh' }} />
      <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px' }}>
        Debug Info: {debugInfo}
      </div>
    </div>
  );
};

export default BlackHole;