"use client"

import React, { useRef, useEffect, useState, MutableRefObject } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

type DiveData = {
  name: string;
  position: THREE.Vector3;
  rotationSpeed: number;
  urls: UrlData[];
};

type UrlData = {
  url: string;
  moons: string[];
};

type OrbitParameters = {
  a: number;
  e: number;
  i: number;
  Ω: number;
  ω: number;
  speed: number;
  angle?: number;
};

type UserData = {
  type: "dive" | "url" | "moon";
  data: DiveData | UrlData | string;
  orbit?: OrbitParameters;
};

type DiveObject = {
  diveMesh: THREE.Object3D;
  urlObjects: UrlObject[];
};

type UrlObject = {
  urlMesh: THREE.Object3D;
  moons: { moonMesh: THREE.Object3D }[];
};

const DiveMap: React.FC<{ className?: string }> = ({ className }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const composerRef = useRef<EffectComposer | null>(null);
    const diveObjectsRef = useRef<DiveObject[]>([]);
    const [hoveredObject, setHoveredObject] = useState<UserData | null>(null);
    const [selectedUrl, setSelectedUrl] = useState<UrlData | null>(null);
    const [isZoomedIn, setIsZoomedIn] = useState(false);
    const animationRef = useRef<number | null>(null);

  const getOrbitParameters = (index: number): OrbitParameters => {
    const orbits = [
      { a: 3, e: 0, i: 0, Ω: 0, ω: 0 },
      { a: 4, e: 0.2, i: Math.PI / 6, Ω: Math.PI / 4, ω: Math.PI / 2 },
      { a: 5, e: 0.1, i: Math.PI / 4, Ω: Math.PI / 3, ω: Math.PI / 6 },
      { a: 3.5, e: 0.15, i: Math.PI / 5, Ω: Math.PI / 5, ω: Math.PI / 3 },
      { a: 4.5, e: 0.05, i: Math.PI / 8, Ω: Math.PI / 6, ω: Math.PI / 4 },
    ];
    return {
      ...orbits[index % orbits.length],
      speed: 0.2 + Math.random() * 0.8, // Random speed between 0.2 and 1
    };
  };

  const getMoonParameters = (index: number): OrbitParameters => {
    return {
      a: 0.5 + Math.random() * 0.3,
      e: Math.random() * 0.1,
      i: (Math.random() * Math.PI) / 6,
      Ω: Math.random() * Math.PI * 2,
      ω: Math.random() * Math.PI * 2,
      speed: 2 + Math.random(),
    };
  };

  useEffect(() => {
    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount?.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 150;
    controlsRef.current = controls;

    // Star field creation
    const createStarField = () => {
      const starLayers = [
        { count: 1000, size: 0.1, radius: 100, color: 0xffffff },
        { count: 1500, size: 0.05, radius: 200, color: 0xccccff },
        { count: 2000, size: 0.005, radius: 300, color: 0x9999ff },
      ];

      starLayers.forEach((layer) => {
        const geometry = new THREE.BufferGeometry();
        const vertices: number[] = [];

        for (let i = 0; i < layer.count; i++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = layer.radius + (Math.random() - 0.5) * 50;

          const x = r * Math.sin(phi) * Math.cos(theta);
          const y = r * Math.sin(phi) * Math.sin(theta);
          const z = r * Math.cos(phi);

          vertices.push(x, y, z);
        }

        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(vertices, 3)
        );

        const material = new THREE.PointsMaterial({
          color: layer.color,
          size: layer.size,
          transparent: true,
          opacity: 0.8,
          sizeAttenuation: true,
        });

        const stars = new THREE.Points(geometry, material);
        scene.add(stars);
      });
    };

    createStarField();

    // Load 3D objects
    const load3DObject = (url: string): Promise<THREE.Object3D> => {
      return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
          url,
          (gltf) => resolve(gltf.scene),
          undefined,
          (error) => reject(error)
        );
      });
    };

    const load3DObjectWithFallback = (
      url: string,
      fallbackGeometry: THREE.BufferGeometry,
      fallbackMaterial: THREE.Material
    ): Promise<THREE.Object3D> => {
      return new Promise((resolve) => {
        const loader = new GLTFLoader();
        loader.load(
          url,
          (gltf) => resolve(gltf.scene),
          undefined,
          (error) => {
            console.warn(`Failed to load 3D object from ${url}:`, error);
            console.log("Using fallback geometry");
            const mesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
            resolve(mesh);
          }
        );
      });
    };

    const setupScene = async () => {
      try {
        const diveFallbackGeometry = new THREE.SphereGeometry(1, 32, 32);
        const diveFallbackMaterial = new THREE.MeshPhongMaterial({
          color: 0xffff00,
        });

        const urlFallbackGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const urlFallbackMaterial = new THREE.MeshPhongMaterial({
          color: 0x00ff00,
        });

        const moonFallbackGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const moonFallbackMaterial = new THREE.MeshPhongMaterial({
          color: 0x0000ff,
        });

        const diveObject = await load3DObjectWithFallback(
          "public/sun_and_solar_flares/scene.gltf",
          diveFallbackGeometry,
          diveFallbackMaterial
        );
        const urlObject = await load3DObjectWithFallback(
          "public/sun_and_solar_flares/scene.gltf",
          urlFallbackGeometry,
          urlFallbackMaterial
        );
        const moonObject = await load3DObjectWithFallback(
          "public/sun_and_solar_flares/scene.gltf",
          moonFallbackGeometry,
          moonFallbackMaterial
        );

        // Modify dive creation to spread them out further
        const dives = Array.from({ length: 10 }, (_, index) => {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const radius = 50 + Math.random() * 50; // Spread dives between 50 and 100 units from center
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.sin(phi) * Math.sin(theta);
          const z = radius * Math.cos(phi);

          return {
            name: `Dive ${index + 1}`,
            position: new THREE.Vector3(x, y, z),
            rotationSpeed: Math.random() * 0.002 + 0.001, // Slow rotation speed
            urls: Array.from(
              { length: Math.floor(Math.random() * 5) + 1 },
              (_, urlIndex) => ({
                url: `url${index + 1}-${urlIndex + 1}`,
                moons: Array.from(
                  { length: Math.floor(Math.random() * 3) + 1 },
                  (_, moonIndex) =>
                    `chunk${index + 1}-${urlIndex + 1}-${moonIndex + 1}`
                ),
              })
            ),
          } as DiveData;
        });

        diveObjectsRef.current = dives.map((dive) => {
          const diveMesh = diveObject.clone();
          if ((diveMesh as THREE.Group).isGroup) {
            diveMesh.scale.set(1, 1, 1);
          }
          diveMesh.position.copy(dive.position);
          diveMesh.userData = { type: "dive", data: dive };
          scene.add(diveMesh);

          const urlObjects = dive.urls.map((urlData, urlIndex) => {
            const urlMesh = urlObject.clone();
            if ((urlMesh as THREE.Group).isGroup) {
              urlMesh.scale.set(0.2, 0.2, 0.2);
            }
            const orbitParams = getOrbitParameters(urlIndex);
            urlMesh.userData = {
              type: "url",
              data: urlData,
              orbit: { ...orbitParams, angle: 0 },
            };
            scene.add(urlMesh);

            const moons = urlData.moons.map((moonData, moonIndex) => {
              const moonMesh = moonObject.clone();
              if ((moonMesh as THREE.Group).isGroup) {
                moonMesh.scale.set(0.05, 0.05, 0.05);
              }
              const moonOrbitParams = getMoonParameters(moonIndex);
              moonMesh.userData = {
                type: "moon",
                data: moonData,
                orbit: { ...moonOrbitParams, angle: 0 },
              };
              scene.add(moonMesh);

              return { moonMesh };
            });

            return { urlMesh, moons };
          });

          return { diveMesh, urlObjects };
        });

        // Add lighting to the scene
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Start the animation loop
        animate();
      } catch (error) {
        console.error("Failed to set up scene:", error);
      }
    };

    setupScene();

    // Set up EffectComposer for motion blur
    const composer = new EffectComposer(renderer);
    composerRef.current = composer;

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const afterimagePass = new AfterimagePass(0.1);
    composer.addPass(afterimagePass);

    // Raycaster setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        diveObjectsRef.current.flatMap((dive) => [
          dive.diveMesh,
          ...dive.urlObjects.map((url) => url.urlMesh),
        ])
      );

      if (intersects.length > 0) {
        const object = intersects[0].object;
        setHoveredObject(object.userData as UserData);
      } else {
        setHoveredObject(null);
      }
    };

    const onMouseClick = (event: MouseEvent) => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        diveObjectsRef.current.flatMap((dive) => [
          dive.diveMesh,
          ...dive.urlObjects.map((url) => url.urlMesh),
        ])
      );

      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData.type === "dive" && !isZoomedIn) {
          zoomToDive(object.position);
        } else if (object.userData.type === "url") {
          setSelectedUrl(object.userData.data as UrlData);
        }
      } else {
        setSelectedUrl(null);
      }
    };

    const zoomToDive = (divePosition: THREE.Vector3) => {
      const offset = new THREE.Vector3(0, 0, 10);
      const targetPosition = divePosition.clone().add(offset);
      const targetLookAt = divePosition.clone();
      animateCamera(targetPosition, targetLookAt, 2000, () => {
        setIsZoomedIn(true);
        controlsRef.current!.minDistance = 5;
        controlsRef.current!.maxDistance = 20;
      });
    };

    const animateCamera = (
      targetPosition: THREE.Vector3,
      targetLookAt: THREE.Vector3,
      duration: number,
      onComplete?: () => void
    ) => {
      const startPosition = camera.position.clone();
      const startLookAt = controlsRef.current!.target.clone();
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const t = Math.min(elapsedTime / duration, 1);

        const easedT = easeInOutCubic(t);

        camera.position.lerpVectors(startPosition, targetPosition, easedT);
        controlsRef.current!.target.lerpVectors(
          startLookAt,
          targetLookAt,
          easedT
        );
        controlsRef.current!.update();

        if (t < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          if (onComplete) onComplete();
        }
      };

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("click", onMouseClick);

    const calculateOrbitPosition = (orbit: OrbitParameters, time: number) => {
      const { a, e, i, Ω, ω, speed, angle } = orbit;
      const currentAngle = angle! + time * speed;

      const r = (a * (1 - e * e)) / (1 + e * Math.cos(currentAngle));
      const x = r * Math.cos(currentAngle);
      const y = r * Math.sin(currentAngle);

      const x3D =
        (Math.cos(Ω) * Math.cos(ω) - Math.sin(Ω) * Math.sin(ω) * Math.cos(i)) *
          x +
        (-Math.cos(Ω) * Math.sin(ω) - Math.sin(Ω) * Math.cos(ω) * Math.cos(i)) *
          y;
      const y3D =
        (Math.sin(Ω) * Math.cos(ω) + Math.cos(Ω) * Math.sin(ω) * Math.cos(i)) *
          x +
        (-Math.sin(Ω) * Math.sin(ω) + Math.cos(Ω) * Math.cos(ω) * Math.cos(i)) *
          y;
      const z3D = Math.sin(ω) * Math.sin(i) * x + Math.cos(ω) * Math.sin(i) * y;

      return new THREE.Vector3(x3D, y3D, z3D);
    };

    let time = 0;
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();

        time += 0.01;

        diveObjectsRef.current.forEach((diveObject) => {
            const dive = diveObject.diveMesh;
            const userData = dive.userData as UserData;
            if (userData.type === "dive") {
            const diveData = userData.data as DiveData;
            dive.rotation.y += diveData.rotationSpeed;
            }

            diveObject.urlObjects.forEach((urlObject) => {
            const urlOrbit = (urlObject.urlMesh.userData as UserData)
                .orbit as OrbitParameters;
            const urlPosition = calculateOrbitPosition(urlOrbit, time).add(
                dive.position
            );
            urlObject.urlMesh.position.copy(urlPosition);

            urlObject.moons.forEach((moon) => {
                const moonOrbit = (moon.moonMesh.userData as UserData)
                .orbit as OrbitParameters;
                const moonPosition = calculateOrbitPosition(moonOrbit, time);
                moon.moonMesh.position.copy(moonPosition).add(urlPosition);
            });
          });
        });

      composer.render();
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      currentMount?.removeChild(renderer.domElement);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("click", onMouseClick);
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleBackClick = () => {
    if (isZoomedIn && cameraRef.current) {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      const targetPosition = new THREE.Vector3(0, 0, 150);
      const targetLookAt = new THREE.Vector3(0, 0, 0);
      animateCamera(targetPosition, targetLookAt, 2000, () => {
        setIsZoomedIn(false);
        controls!.minDistance = 10;
        controls!.maxDistance = 150;
      });
    }
  };

  const animateCamera = (
    targetPosition: THREE.Vector3,
    targetLookAt: THREE.Vector3,
    duration: number,
    onComplete?: () => void
  ) => {
    const camera = cameraRef.current!;
    const controls = controlsRef.current!;
    const startPosition = camera.position.clone();
    const startLookAt = controls.target.clone();
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const t = Math.min(elapsedTime / duration, 1);

      const easedT = easeInOutCubic(t);

      camera.position.lerpVectors(startPosition, targetPosition, easedT);
      controls.target.lerpVectors(startLookAt, targetLookAt, easedT);
      controls.update();

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  return (
    <div className={className} style={{ position: "relative", display: "flex" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      {hoveredObject && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {hoveredObject.type === "dive"
            ? (hoveredObject.data as DiveData).name
            : (hoveredObject.data as UrlData).url}
        </div>
      )}
      {isZoomedIn && (
        <button
          onClick={handleBackClick}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            padding: "10px",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back to Main View
        </button>
      )}
      {selectedUrl && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "300px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>{selectedUrl.url}</h3>
          <h4>Chunks:</h4>
          <ul>
            {selectedUrl.moons.map((moon, index) => (
              <li key={index}>{moon}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DiveMap;
