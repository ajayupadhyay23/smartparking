import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * MiniatureCity - Interactive 3D WebGL Digital Twin
 * 
 * Renders a procedural miniature cyber city featuring:
 * - Smart parking bays with LED status indicators
 * - EV charging superchargers with glowing holographic cables
 * - Moving autonomous electric cars with headlights
 * - Raycaster-based interactive slot inspection
 */
export const MiniatureCity = ({ onSelectSlot, isNightMode = true }) => {
  const mountRef = useRef(null);
  const [hoveredObject, setHoveredObject] = useState(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // -------------------------------------------------------------
    // 1. SCENE & CAMERA SETUP
    // -------------------------------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isNightMode ? 0x080c14 : 0xe2e8f0);
    scene.fog = new THREE.FogExp2(isNightMode ? 0x080c14 : 0xe2e8f0, 0.025);

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(22, 18, 24);

    // -------------------------------------------------------------
    // 2. WEBGL RENDERER SETUP
    // -------------------------------------------------------------
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // -------------------------------------------------------------
    // 3. ORBIT CONTROLS
    // -------------------------------------------------------------
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera going below ground
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.target.set(0, 0, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    // Pause auto-rotation when user interacts
    controls.addEventListener("start", () => {
      controls.autoRotate = false;
    });

    // -------------------------------------------------------------
    // 4. LIGHTING SYSTEM
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(
      isNightMode ? 0x1e293b : 0xffffff,
      isNightMode ? 0.7 : 1.2
    );
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(
      isNightMode ? 0x38bdf8 : 0xffffff,
      isNightMode ? 1.0 : 1.5
    );
    sunLight.position.set(20, 30, 15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    sunLight.shadow.camera.left = -20;
    sunLight.shadow.camera.right = 20;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -20;
    scene.add(sunLight);

    // Neon Cyber Point Lights over EV Stations
    const evGlowGreen = new THREE.PointLight(0x10b981, 3.5, 12);
    evGlowGreen.position.set(-2, 3, 4);
    scene.add(evGlowGreen);

    const evGlowCyan = new THREE.PointLight(0x06b6d4, 3.5, 12);
    evGlowCyan.position.set(4, 3, 4);
    scene.add(evGlowCyan);

    // -------------------------------------------------------------
    // 5. CITY GROUND & ROAD GRID
    // -------------------------------------------------------------
    // Main asphalt foundation
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x0f172a : 0xcbd5e1,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Road Grid Lines
    const gridHelper = new THREE.GridHelper(
      60,
      30,
      isNightMode ? 0x10b981 : 0x0284c7,
      isNightMode ? 0x1e293b : 0x94a3b8
    );
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // -------------------------------------------------------------
    // 6. BUILDINGS GENERATION (PROCEDURAL DOWNTOWN)
    // -------------------------------------------------------------
    const buildingGroup = new THREE.Group();
    const buildingMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x111827 : 0x94a3b8,
      roughness: 0.4,
      metalness: 0.7
    });

    const windowGlowMat = new THREE.MeshBasicMaterial({
      color: isNightMode ? 0x38bdf8 : 0xfef08a
    });

    // Procedural building cluster away from central parking hub
    const buildingCoords = [
      { x: -14, z: -14, w: 6, d: 6, h: 16 },
      { x: -6, z: -15, w: 5, d: 5, h: 22 },
      { x: 3, z: -16, w: 7, d: 5, h: 14 },
      { x: 12, z: -14, w: 6, d: 6, h: 18 },
      { x: -16, z: -2, w: 5, d: 8, h: 12 },
      { x: -16, z: 8, w: 5, d: 6, h: 15 },
      { x: 16, z: -2, w: 5, d: 7, h: 20 },
      { x: 16, z: 8, w: 5, d: 6, h: 13 }
    ];

    buildingCoords.forEach((b) => {
      const bGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const bMesh = new THREE.Mesh(bGeo, buildingMat);
      bMesh.position.set(b.x, b.h / 2, b.z);
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      buildingGroup.add(bMesh);

      // Add architectural glowing roof strip
      const roofStripGeo = new THREE.BoxGeometry(b.w + 0.1, 0.4, b.d + 0.1);
      const roofStrip = new THREE.Mesh(roofStripGeo, windowGlowMat);
      roofStrip.position.set(b.x, b.h, b.z);
      buildingGroup.add(roofStrip);
    });
    scene.add(buildingGroup);

    // -------------------------------------------------------------
    // 7. SMART PARKING & EV CHARGING HUB (CENTRAL PLAZA)
    // -------------------------------------------------------------
    const interactiveSlots = [];
    const hubPlazaGeo = new THREE.BoxGeometry(18, 0.2, 14);
    const hubPlazaMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x1e293b : 0xe2e8f0,
      roughness: 0.6,
      metalness: 0.3
    });
    const hubPlaza = new THREE.Mesh(hubPlazaGeo, hubPlazaMat);
    hubPlaza.position.set(0, 0.1, 3);
    hubPlaza.receiveShadow = true;
    scene.add(hubPlaza);

    // Slot definitions
    const slotDataList = [
      { id: "EV-01", slotNumber: "EV-01", type: "ev-fast", status: "available", kw: 150, rate: 120, x: -6, z: 0 },
      { id: "EV-02", slotNumber: "EV-02", type: "ev-fast", status: "occupied", kw: 60, rate: 80, x: -2, z: 0 },
      { id: "EV-03", slotNumber: "EV-03", type: "ev-ultra", status: "available", kw: 250, rate: 150, x: 2, z: 0 },
      { id: "EV-04", slotNumber: "EV-04", type: "ev-fast", status: "reserved", kw: 60, rate: 80, x: 6, z: 0 },
      { id: "PK-05", slotNumber: "PK-05", type: "standard", status: "available", kw: 0, rate: 40, x: -6, z: 6 },
      { id: "PK-06", slotNumber: "PK-06", type: "standard", status: "occupied", kw: 0, rate: 40, x: -2, z: 6 },
      { id: "PK-07", slotNumber: "PK-07", type: "standard", status: "available", kw: 0, rate: 40, x: 2, z: 6 },
      { id: "PK-08", slotNumber: "PK-08", type: "standard", status: "available", kw: 0, rate: 40, x: 6, z: 6 }
    ];

    const slotGroup = new THREE.Group();

    slotDataList.forEach((slot) => {
      // Slot Pad
      const padGeo = new THREE.BoxGeometry(3, 0.15, 4.5);
      const isEvSlot = slot.type.startsWith("ev");

      let padColor = 0x10b981; // available emerald
      if (slot.status === "occupied") padColor = 0xef4444; // occupied red
      if (slot.status === "reserved") padColor = 0xf59e0b; // reserved amber

      const padMat = new THREE.MeshStandardMaterial({
        color: padColor,
        roughness: 0.3,
        emissive: padColor,
        emissiveIntensity: slot.status === "available" ? 0.3 : 0.15
      });

      const padMesh = new THREE.Mesh(padGeo, padMat);
      padMesh.position.set(slot.x, 0.25, slot.z);
      padMesh.castShadow = true;
      padMesh.receiveShadow = true;
      padMesh.userData = slot; // Bind data for raycaster
      interactiveSlots.push(padMesh);
      slotGroup.add(padMesh);

      // If EV Slot, build 3D Supercharger Totem
      if (isEvSlot) {
        const totemGeo = new THREE.BoxGeometry(0.5, 1.6, 0.5);
        const totemMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          metalness: 0.8,
          roughness: 0.2
        });
        const totem = new THREE.Mesh(totemGeo, totemMat);
        totem.position.set(slot.x, 1.0, slot.z - 2.0);
        totem.castShadow = true;
        slotGroup.add(totem);

        // Glowing Screen
        const screenGeo = new THREE.PlaneGeometry(0.35, 0.5);
        const screenMat = new THREE.MeshBasicMaterial({
          color: slot.status === "available" ? 0x00f59b : 0x06b6d4
        });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(slot.x, 1.2, slot.z - 1.74);
        slotGroup.add(screen);
      }

      // If Occupied, place a 3D Car Model in the slot
      if (slot.status === "occupied") {
        const carMesh = createCarMesh(0x38bdf8);
        carMesh.position.set(slot.x, 0.5, slot.z);
        slotGroup.add(carMesh);
      }
    });

    scene.add(slotGroup);

    // -------------------------------------------------------------
    // 8. PROCEDURAL 3D CAR GENERATOR
    // -------------------------------------------------------------
    function createCarMesh(carColor = 0x38bdf8) {
      const car = new THREE.Group();

      // Lower Body
      const bodyGeo = new THREE.BoxGeometry(1.6, 0.55, 2.8);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: carColor,
        metalness: 0.8,
        roughness: 0.2
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.castShadow = true;
      body.position.y = 0.35;
      car.add(body);

      // Cabin / Roof
      const cabinGeo = new THREE.BoxGeometry(1.3, 0.45, 1.5);
      const cabinMat = new THREE.MeshStandardMaterial({
        color: 0x0b0f19,
        metalness: 0.9,
        roughness: 0.1
      });
      const cabin = new THREE.Mesh(cabinGeo, cabinMat);
      cabin.position.set(0, 0.8, -0.15);
      cabin.castShadow = true;
      car.add(cabin);

      // Headlights (Glowing white)
      const lightGeo = new THREE.BoxGeometry(0.3, 0.1, 0.1);
      const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const leftLight = new THREE.Mesh(lightGeo, lightMat);
      leftLight.position.set(0.5, 0.4, 1.4);
      const rightLight = leftLight.clone();
      rightLight.position.x = -0.5;
      car.add(leftLight);
      car.add(rightLight);

      // Taillights (Glowing red)
      const tailLightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const leftTail = new THREE.Mesh(lightGeo, tailLightMat);
      leftTail.position.set(0.5, 0.4, -1.4);
      const rightTail = leftTail.clone();
      rightTail.position.x = -0.5;
      car.add(leftTail);
      car.add(rightTail);

      // Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
      wheelGeo.rotateZ(Math.PI / 2);

      const positions = [
        [-0.85, 0.25, 0.8],
        [0.85, 0.25, 0.8],
        [-0.85, 0.25, -0.8],
        [0.85, 0.25, -0.8]
      ];

      positions.forEach(([x, y, z]) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.position.set(x, y, z);
        car.add(wheel);
      });

      return car;
    }

    // -------------------------------------------------------------
    // 9. ANIMATED AUTONOMOUS TRAFFIC CARS
    // -------------------------------------------------------------
    const trafficCars = [];

    // Car 1 (Electric Sedan - Emerald)
    const trafficCar1 = createCarMesh(0x10b981);
    scene.add(trafficCar1);
    trafficCars.push({
      mesh: trafficCar1,
      angle: 0,
      radiusX: 14,
      radiusZ: 14,
      speed: 0.008
    });

    // Car 2 (Electric SUV - Cyber Cyan)
    const trafficCar2 = createCarMesh(0x06b6d4);
    scene.add(trafficCar2);
    trafficCars.push({
      mesh: trafficCar2,
      angle: Math.PI,
      radiusX: 18,
      radiusZ: 18,
      speed: -0.006
    });

    // -------------------------------------------------------------
    // 10. RAYCASTER FOR INTERACTIVE MOUSE SELECTION
    // -------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveSlots);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        renderer.domElement.style.cursor = "pointer";
        setHoveredObject(hit.userData);
      } else {
        renderer.domElement.style.cursor = "default";
        setHoveredObject(null);
      }
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveSlots);

      if (intersects.length > 0) {
        const selectedData = intersects[0].object.userData;
        onSelectSlot?.(selectedData);
      }
    };

    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("click", handleClick);

    // -------------------------------------------------------------
    // 11. RESIZE HANDLER
    // -------------------------------------------------------------
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // -------------------------------------------------------------
    // 12. RENDER LOOP
    // -------------------------------------------------------------
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Animate traffic cars along road loops
      trafficCars.forEach((tc) => {
        tc.angle += tc.speed;
        tc.mesh.position.x = Math.cos(tc.angle) * tc.radiusX;
        tc.mesh.position.z = Math.sin(tc.angle) * tc.radiusZ;
        tc.mesh.rotation.y = -tc.angle + (tc.speed > 0 ? -Math.PI / 2 : Math.PI / 2);
      });

      // Pulse EV point lights gently
      evGlowGreen.intensity = 3.0 + Math.sin(elapsedTime * 3) * 1.0;
      evGlowCyan.intensity = 3.0 + Math.cos(elapsedTime * 3) * 1.0;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // -------------------------------------------------------------
    // 13. LIFECYCLE CLEANUP & DISPOSAL
    // -------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("click", handleClick);

      controls.dispose();
      renderer.dispose();

      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }

      // Dispose geometries and materials
      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
    };
  }, [isNightMode, onSelectSlot]);

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[620px] rounded-3xl overflow-hidden border border-white/[0.08] bg-[#080C14] shadow-2xl">
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating Interactive Hover Tooltip */}
      {hoveredObject && (
        <div className="absolute top-4 left-4 z-20 pointer-events-none p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-md shadow-glow-emerald text-xs space-y-1 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-white text-sm">
              {hoveredObject.slotNumber}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                hoveredObject.status === "available"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : hoveredObject.status === "occupied"
                  ? "bg-rose-500/20 text-rose-400"
                  : "bg-amber-500/20 text-amber-400"
              }`}
            >
              {hoveredObject.status}
            </span>
          </div>
          {hoveredObject.kw > 0 && (
            <div className="text-cyan-400 font-mono">
              ⚡ {hoveredObject.kw} kW Fast Charger
            </div>
          )}
          <div className="text-slate-400">
            Rate: <span className="text-white font-semibold">₹{hoveredObject.rate}/hr</span>
          </div>
          <div className="text-[10px] text-emerald-400 pt-0.5">Click to Inspect & Reserve</div>
        </div>
      )}
    </div>
  );
};
