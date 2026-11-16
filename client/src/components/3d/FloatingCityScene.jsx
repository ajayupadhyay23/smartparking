/**
 * FloatingCityScene.jsx
 *
 * ParkVolt – Premium 3D Digital Twin City on a Floating Island
 * Built with @react-three/fiber and @react-three/drei (React 18 + Three.js)
 *
 * Visual Enhancements:
 * - Multi-tiered modern skyscrapers with individual illuminated window matrices
 * - Rooftop animated spinning wind turbine, helipad, and pulsing aviation beacons
 * - Solar-canopy EV charging superhub with holographic displays and pulsing energy cable
 * - Looping animated cars with headlights, taillights, and spinning wheels
 * - Walking pedestrians with natural swinging limbs
 * - Floating low-poly clouds lazily drifting above the skyline
 * - Levitation glow ring and faceted rock crystal island base
 * - Clean, non-overlapping interactive parking slots with price & status tags
 * - Real-time Day/Night lighting adaptation based on active theme
 */
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

// Detect if user has requested reduced motion in their OS
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ====================================================================
   1. ANIMATED CARS
   ==================================================================== */
function AnimatedCar({ radiusX, radiusZ, speed, initialAngle, bodyColor, isDark }) {
  const carRef = useRef();
  const wheelRefs = [useRef(), useRef(), useRef(), useRef()];
  const angleRef = useRef(initialAngle);

  useFrame((_, delta) => {
    if (prefersReducedMotion) return;
    angleRef.current += speed * delta;
    const a = angleRef.current;

    if (carRef.current) {
      carRef.current.position.x = Math.cos(a) * radiusX;
      carRef.current.position.z = Math.sin(a) * radiusZ;
      carRef.current.position.y = 0.28;
      // Orient car along tangent of the oval road
      carRef.current.rotation.y = -a + (speed > 0 ? -Math.PI / 2 : Math.PI / 2);
    }

    // Spin wheels
    wheelRefs.forEach((ref) => {
      if (ref.current) ref.current.rotation.x += speed * 14 * delta;
    });
  });

  return (
    <group ref={carRef} position={[Math.cos(initialAngle) * radiusX, 0.28, Math.sin(initialAngle) * radiusZ]}>
      {/* Lower Chassis */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <boxGeometry args={[0.85, 0.26, 1.7]} />
        <meshStandardMaterial color={bodyColor} roughness={0.25} metalness={0.7} />
      </mesh>
      {/* Aerodynamic Cabin / Windshield */}
      <mesh position={[0, 0.38, -0.05]} castShadow>
        <boxGeometry args={[0.7, 0.24, 0.95]} />
        <meshStandardMaterial color={isDark ? "#0F172A" : "#1E293B"} roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Headlights (Warm White / Cyan glow) */}
      <mesh position={[0.28, 0.18, 0.86]}>
        <boxGeometry args={[0.16, 0.08, 0.04]} />
        <meshBasicMaterial color={isDark ? "#E0F2FE" : "#FEF08A"} />
      </mesh>
      <mesh position={[-0.28, 0.18, 0.86]}>
        <boxGeometry args={[0.16, 0.08, 0.04]} />
        <meshBasicMaterial color={isDark ? "#E0F2FE" : "#FEF08A"} />
      </mesh>
      {/* Taillight LED Lightbar */}
      <mesh position={[0, 0.18, -0.86]}>
        <boxGeometry args={[0.72, 0.06, 0.04]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      {/* 4 Wheels */}
      {[
        [-0.45, 0.12, 0.52],
        [0.45, 0.12, 0.52],
        [-0.45, 0.12, -0.52],
        [0.45, 0.12, -0.52]
      ].map(([x, y, z], idx) => (
        <group key={idx} position={[x, y, z]} ref={wheelRefs[idx]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.13, 0.13, 0.09, 14]} />
            <meshStandardMaterial color="#111827" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[x > 0 ? 0.046 : -0.046, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.01, 10]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ====================================================================
   2. WALKING PEDESTRIANS
   ==================================================================== */
function WalkingPedestrian({ radius, speed, initialAngle, shirtColor }) {
  const personRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const angleRef = useRef(initialAngle);

  useFrame((state, delta) => {
    if (prefersReducedMotion) return;
    angleRef.current += speed * delta;
    const a = angleRef.current;

    if (personRef.current) {
      personRef.current.position.x = Math.cos(a) * radius;
      personRef.current.position.z = Math.sin(a) * radius;
      personRef.current.rotation.y = -a + Math.PI / 2;
    }

    const swing = Math.sin(state.clock.elapsedTime * 7) * 0.45;
    if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.75;
    if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.75;
  });

  return (
    <group ref={personRef} position={[Math.cos(initialAngle) * radius, 0.22, Math.sin(initialAngle) * radius]}>
      {/* Head */}
      <mesh position={[0, 0.74, 0]} castShadow>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#FBBF24" roughness={0.4} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.2, 0.3, 0.12]} />
        <meshStandardMaterial color={shirtColor} roughness={0.5} />
      </mesh>
      {/* Legs */}
      <group position={[-0.06, 0.34, 0]} ref={leftLegRef}>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.06, 0.28, 0.07]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
      </group>
      <group position={[0.06, 0.34, 0]} ref={rightLegRef}>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.06, 0.28, 0.07]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
      </group>
      {/* Arms */}
      <group position={[-0.14, 0.58, 0]} ref={leftArmRef}>
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.05, 0.22, 0.05]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
      </group>
      <group position={[0.14, 0.58, 0]} ref={rightArmRef}>
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.05, 0.22, 0.05]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
      </group>
    </group>
  );
}

/* ====================================================================
   3. DRIFTING LOW-POLY CLOUDS
   ==================================================================== */
function DriftingClouds({ isDark }) {
  const cloud1 = useRef();
  const cloud2 = useRef();

  useFrame((state) => {
    if (prefersReducedMotion) return;
    const t = state.clock.elapsedTime * 0.15;
    if (cloud1.current) {
      cloud1.current.position.x = Math.sin(t) * 7.5;
      cloud1.current.position.z = Math.cos(t) * 7.5;
    }
    if (cloud2.current) {
      cloud2.current.position.x = Math.sin(t + Math.PI) * 8.2;
      cloud2.current.position.z = Math.cos(t + Math.PI) * 8.2;
    }
  });

  const cloudColor = isDark ? "#334155" : "#FFFFFF";
  const cloudOpacity = isDark ? 0.45 : 0.75;

  return (
    <group>
      {/* Cloud 1 */}
      <group ref={cloud1} position={[0, 5.8, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.55, 7, 7]} />
          <meshStandardMaterial color={cloudColor} transparent opacity={cloudOpacity} roughness={0.9} />
        </mesh>
        <mesh position={[0.45, -0.05, 0]}>
          <sphereGeometry args={[0.42, 6, 6]} />
          <meshStandardMaterial color={cloudColor} transparent opacity={cloudOpacity} roughness={0.9} />
        </mesh>
        <mesh position={[-0.45, -0.05, 0]}>
          <sphereGeometry args={[0.4, 6, 6]} />
          <meshStandardMaterial color={cloudColor} transparent opacity={cloudOpacity} roughness={0.9} />
        </mesh>
      </group>

      {/* Cloud 2 */}
      <group ref={cloud2} position={[0, 6.4, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.65, 7, 7]} />
          <meshStandardMaterial color={cloudColor} transparent opacity={cloudOpacity} roughness={0.9} />
        </mesh>
        <mesh position={[0.55, 0.05, 0]}>
          <sphereGeometry args={[0.45, 6, 6]} />
          <meshStandardMaterial color={cloudColor} transparent opacity={cloudOpacity} roughness={0.9} />
        </mesh>
        <mesh position={[-0.5, -0.04, 0]}>
          <sphereGeometry args={[0.42, 6, 6]} />
          <meshStandardMaterial color={cloudColor} transparent opacity={cloudOpacity} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/* ====================================================================
   4. PROCEDURAL SKYSCRAPERS WITH LIT WINDOW MATRICES & WIND TURBINE
   ==================================================================== */
function ModernBuildings({ isDark }) {
  const beaconRef = useRef();
  const turbineRef = useRef();

  useFrame((state) => {
    // Pulse rooftop red aviation warning light
    if (beaconRef.current) {
      beaconRef.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
    }
    // Spin green energy wind turbine
    if (turbineRef.current && !prefersReducedMotion) {
      turbineRef.current.rotation.z += 0.05;
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      {/* ---------------- TOWER 1: Cyber Headquarters (Main Center Tower) ---------------- */}
      <group position={[3.2, 0, 1.8]}>
        {/* Podium Base */}
        <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 1.4, 2.0]} />
          <meshStandardMaterial color={isDark ? "#0F172A" : "#CBD5E1"} roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Main Shaft */}
        <mesh position={[0, 2.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 2.6, 1.7]} />
          <meshStandardMaterial color={isDark ? "#172347" : "#E2E8F0"} roughness={0.2} metalness={0.6} />
        </mesh>
        {/* Glass Penthouse */}
        <mesh position={[0, 4.3, 0]} castShadow>
          <boxGeometry args={[1.4, 0.6, 1.4]} />
          <meshStandardMaterial
            color={isDark ? "#38BDF8" : "#93C5FD"}
            roughness={0.1}
            metalness={0.9}
            emissive={isDark ? "#0284C7" : "#3B82F6"}
            emissiveIntensity={isDark ? 0.35 : 0.15}
          />
        </mesh>
        {/* Helipad on Roof */}
        <mesh position={[0, 4.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.55, 16]} />
          <meshBasicMaterial color={isDark ? "#334155" : "#64748B"} />
        </mesh>
        <mesh position={[0, 4.63, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.5, 16]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>

        {/* Illuminated Window Matrix Bands (Day: subtle blue, Night: warm cyan glow) */}
        {[1.8, 2.4, 3.0, 3.6].map((y, idx) => (
          <group key={idx} position={[0, y, 0]}>
            <mesh position={[0, 0, 0.86]}>
              <planeGeometry args={[1.4, 0.35]} />
              <meshBasicMaterial
                color={isDark ? "#38BDF8" : "#FEF08A"}
                transparent
                opacity={isDark ? 0.85 : 0.4}
              />
            </mesh>
            <mesh position={[0.86, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[1.4, 0.35]} />
              <meshBasicMaterial
                color={isDark ? "#38BDF8" : "#FEF08A"}
                transparent
                opacity={isDark ? 0.85 : 0.4}
              />
            </mesh>
          </group>
        ))}

        {/* Rooftop Antenna Mast & Beacon */}
        <mesh position={[0, 5.1, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 1.0, 8]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
        <mesh position={[0, 5.62, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>
        <pointLight ref={beaconRef} position={[0, 5.62, 0]} color="#EF4444" distance={3} />
      </group>

      {/* ---------------- TOWER 2: Green Energy Tower with Wind Turbine ---------------- */}
      <group position={[1.6, 0, 3.4]}>
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 3.6, 1.4]} />
          <meshStandardMaterial color={isDark ? "#0A1329" : "#F1F5F9"} roughness={0.25} metalness={0.5} />
        </mesh>
        {/* Vertical Glowing Energy Ribbons */}
        <mesh position={[0, 1.8, 0.71]}>
          <planeGeometry args={[0.15, 3.2]} />
          <meshBasicMaterial color="#12B76A" />
        </mesh>
        {/* Windows */}
        {[0.8, 1.5, 2.2, 2.9].map((y, i) => (
          <mesh key={i} position={[0, y, 0.72]}>
            <planeGeometry args={[1.0, 0.3]} />
            <meshBasicMaterial color={isDark ? "#6EE7B7" : "#FCD34D"} transparent opacity={isDark ? 0.8 : 0.35} />
          </mesh>
        ))}

        {/* Rooftop Wind Turbine Mast */}
        <mesh position={[0, 3.9, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.6, 8]} />
          <meshStandardMaterial color="#94A3B8" />
        </mesh>
        {/* Turbine Hub & 3 Blades */}
        <group position={[0, 4.25, 0.1]} ref={turbineRef}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => (
            <mesh key={idx} rotation={[0, 0, angle]} position={[0, 0.4, 0]}>
              <boxGeometry args={[0.06, 0.8, 0.015]} />
              <meshStandardMaterial color="#E2E8F0" />
            </mesh>
          ))}
        </group>
      </group>

      {/* ---------------- TOWER 3: Modern Glass Tower ---------------- */}
      <group position={[4.2, 0, -0.6]}>
        <mesh position={[0, 2.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 4.6, 1.5]} />
          <meshStandardMaterial color={isDark ? "#1E1B4B" : "#E0E7FF"} roughness={0.15} metalness={0.8} />
        </mesh>
        {/* Diagonal architectural brace */}
        <mesh position={[0, 2.3, 0.76]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.06, 3.5, 0.02]} />
          <meshBasicMaterial color="#7C5CFF" />
        </mesh>
        {/* Glowing window strip */}
        {[1.0, 1.8, 2.6, 3.4, 4.0].map((y, i) => (
          <mesh key={i} position={[0, y, 0.77]}>
            <planeGeometry args={[1.1, 0.32]} />
            <meshBasicMaterial color={isDark ? "#A78BFA" : "#FEF3C7"} transparent opacity={isDark ? 0.75 : 0.3} />
          </mesh>
        ))}
      </group>

      {/* ---------------- TOWER 4: Tech Incubator Loft ---------------- */}
      <group position={[3.5, 0, -2.6]}>
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 3.0, 1.4]} />
          <meshStandardMaterial color={isDark ? "#111827" : "#F8FAFC"} roughness={0.3} metalness={0.4} />
        </mesh>
        {[0.7, 1.4, 2.1].map((y, i) => (
          <mesh key={i} position={[0, y, 0.71]}>
            <planeGeometry args={[1.0, 0.35]} />
            <meshBasicMaterial color={isDark ? "#FBBF24" : "#FDE68A"} transparent opacity={isDark ? 0.75 : 0.35} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ====================================================================
   5. EV CHARGING SUPERHUB (With Solar Canopy & Animated Energy Pulse)
   ==================================================================== */
function EvChargingSuperhub({ isDark }) {
  const pulseRef1 = useRef();
  const pulseRef2 = useRef();

  useFrame((state) => {
    if (prefersReducedMotion) return;
    const t = (state.clock.elapsedTime * 2.2) % 1;
    // Animate energy pulse traveling along the charging cable
    if (pulseRef1.current) {
      pulseRef1.current.position.x = 0.5 + 0.85 * t;
      pulseRef1.current.position.y = 0.45 - Math.sin(t * Math.PI) * 0.12;
    }
    if (pulseRef2.current) {
      const t2 = (state.clock.elapsedTime * 2.2 + 0.5) % 1;
      pulseRef2.current.position.x = 0.5 + 0.85 * t2;
      pulseRef2.current.position.y = 0.45 - Math.sin(t2 * Math.PI) * 0.12;
    }
  });

  return (
    <group position={[0.6, 0.21, -2.0]}>
      {/* Solar Canopy Roof */}
      <mesh position={[1.2, 1.9, 0]} castShadow>
        <boxGeometry args={[2.6, 0.08, 2.2]} />
        <meshStandardMaterial color={isDark ? "#0B132B" : "#1E293B"} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Solar Panel Cells Top Grid */}
      <mesh position={[1.2, 1.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.4, 2.0]} />
        <meshStandardMaterial color="#1E3A8A" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Canopy Glowing Neon Edge */}
      <mesh position={[1.2, 1.88, 1.1]}>
        <boxGeometry args={[2.6, 0.04, 0.04]} />
        <meshBasicMaterial color="#12B76A" />
      </mesh>

      {/* Canopy Support Pillars */}
      {[
        [0.1, 0.95, -0.9],
        [2.3, 0.95, -0.9],
        [0.1, 0.95, 0.9],
        [2.3, 0.95, 0.9]
      ].map(([x, y, z], idx) => (
        <mesh key={idx} position={[x, y, z]}>
          <cylinderGeometry args={[0.04, 0.04, 1.9, 8]} />
          <meshStandardMaterial color="#64748B" metalness={0.7} />
        </mesh>
      ))}

      {/* EV Supercharger Kiosk Column */}
      <group position={[0.4, 0, 0]}>
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[0.35, 1.3, 0.35]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* OLED Screen showing 150 kW */}
        <mesh position={[0, 0.85, 0.18]}>
          <planeGeometry args={[0.26, 0.38]} />
          <meshBasicMaterial color="#12B76A" />
        </mesh>
        {/* ParkVolt Logo Strip */}
        <mesh position={[0, 0.45, 0.18]}>
          <planeGeometry args={[0.2, 0.08]} />
          <meshBasicMaterial color="#2F6BFF" />
        </mesh>
      </group>

      {/* Connected Electric Vehicle (Tesla Model 3 Style) */}
      <group position={[1.5, 0, 0]}>
        {/* Chassis */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.95, 0.36, 1.8]} />
          <meshStandardMaterial color="#2F6BFF" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Glass Dome Cabin */}
        <mesh position={[0, 0.46, -0.08]} castShadow>
          <boxGeometry args={[0.78, 0.26, 1.0]} />
          <meshStandardMaterial color="#0B132B" roughness={0.05} metalness={0.95} />
        </mesh>
        {/* Headlights */}
        <mesh position={[0.3, 0.22, 0.91]}>
          <boxGeometry args={[0.15, 0.06, 0.02]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
        <mesh position={[-0.3, 0.22, 0.91]}>
          <boxGeometry args={[0.15, 0.06, 0.02]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
        {/* Taillights */}
        <mesh position={[0, 0.22, -0.91]}>
          <boxGeometry args={[0.76, 0.05, 0.02]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>
      </group>

      {/* Flexible Cable from Charger Kiosk to Car */}
      <mesh position={[0.92, 0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.85, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* Animated Glowing Energy Pulses along Cable */}
      <mesh ref={pulseRef1} position={[0.5, 0.45, 0]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshBasicMaterial color="#12B76A" />
      </mesh>
      <mesh ref={pulseRef2} position={[0.8, 0.45, 0]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshBasicMaterial color="#34D399" />
      </mesh>

      {/* EV Bay Area Light */}
      <pointLight position={[1.2, 1.6, 0]} color="#12B76A" intensity={isDark ? 3.0 : 1.5} distance={3.8} />
    </group>
  );
}

/* ====================================================================
   6. INTERACTIVE PARKING LOT SLOTS (Spaced cleanly to eliminate clutter)
   ==================================================================== */
function InteractiveParkingLot({ selectedSlotId, onSelectSlot, isDark }) {
  // 6 slots generously spaced out across a dedicated lot
  const slotsData = [
    { id: "S-1", code: "G-EV-01", isEv: true, evSpeed: "120 kW CCS2", status: "free", price: 60, x: -3.3, z: -1.7 },
    { id: "S-2", code: "G-EV-02", isEv: true, evSpeed: "60 kW Type 2", status: "occupied", price: 60, x: -1.7, z: -1.7 },
    { id: "S-3", code: "G-PK-03", isEv: false, status: "free", price: 40, x: -3.3, z: 0.3 },
    { id: "S-4", code: "G-PK-04", isEv: false, status: "occupied", price: 40, x: -1.7, z: 0.3 },
    { id: "S-5", code: "G-PK-05", isEv: false, status: "free", price: 40, x: -3.3, z: 2.3 },
    { id: "S-6", code: "G-PK-06", isEv: false, status: "free", price: 40, x: -1.7, z: 2.3 }
  ];

  return (
    <group position={[0, 0.22, 0]}>
      {/* Parking Lot Perimeter Concrete Boundary */}
      <mesh position={[-2.5, 0, 0.3]} receiveShadow>
        <boxGeometry args={[3.2, 0.02, 5.8]} />
        <meshStandardMaterial color={isDark ? "#111827" : "#CBD5E1"} roughness={0.7} />
      </mesh>

      {slotsData.map((slot) => {
        const isSelected = selectedSlotId === slot.id;
        let slotColor = "#12B76A"; // Green (Free)
        if (slot.status === "occupied") slotColor = "#EF4444"; // Red (Occupied)
        if (isSelected) slotColor = "#2F6BFF"; // Blue (Selected)

        return (
          <group key={slot.id} position={[slot.x, 0, slot.z]}>
            {/* Slot Ground Pad */}
            <mesh
              position={[0, 0.02, 0]}
              onClick={(e) => {
                e.stopPropagation();
                if (slot.status === "free" && onSelectSlot) {
                  onSelectSlot(slot);
                }
              }}
              receiveShadow
            >
              <boxGeometry args={[1.25, 0.03, 1.7]} />
              <meshStandardMaterial
                color={slotColor}
                roughness={0.4}
                emissive={slotColor}
                emissiveIntensity={isSelected ? 0.75 : isDark ? 0.3 : 0.12}
              />
            </mesh>

            {/* Delineator Marking Line */}
            <mesh position={[0, 0.036, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.15, 1.6]} />
              <meshBasicMaterial
                color="#FFFFFF"
                wireframe
                transparent
                opacity={isSelected ? 0.9 : 0.45}
              />
            </mesh>

            {/* Occupied Slot: Realistic Parked Vehicle */}
            {slot.status === "occupied" && (
              <group position={[0, 0.2, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.8, 0.3, 1.45]} />
                  <meshStandardMaterial color={isDark ? "#334155" : "#64748B"} roughness={0.4} metalness={0.5} />
                </mesh>
                <mesh position={[0, 0.24, -0.05]} castShadow>
                  <boxGeometry args={[0.68, 0.22, 0.75]} />
                  <meshStandardMaterial color="#0F172A" roughness={0.1} />
                </mesh>
              </group>
            )}

            {/* Clean HTML Badge floating right above the bay */}
            <Html position={[0, 0.85, 0]} center distanceFactor={11} pointerEvents="none">
              <div
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, #2F6BFF, #1E55E3)"
                    : slot.status === "free"
                    ? "linear-gradient(135deg, rgba(18, 183, 106, 0.95), rgba(5, 150, 105, 0.95))"
                    : "linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))",
                  color: "#FFFFFF",
                  padding: "3px 8px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: "700",
                  fontFamily: "var(--font-mono)",
                  whiteSpace: "nowrap",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
                  border: isSelected ? "1.5px solid #FFFFFF" : "1px solid rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  transform: isSelected ? "scale(1.15)" : "scale(1)",
                  transition: "all 0.2s ease"
                }}
              >
                <span>{slot.code}</span>
                {slot.status === "free" ? <span>• ₹{slot.price}/h</span> : <span>• Occupied</span>}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

/* ====================================================================
   7. FLOATING ISLAND PLAZA, ROAD, LOW-POLY TREES & LEVITATION RING
   ==================================================================== */
function IslandEnvironment({ isDark }) {
  const levitationGlow = useRef();

  useFrame((state) => {
    if (levitationGlow.current && !prefersReducedMotion) {
      levitationGlow.current.rotation.z += 0.005;
    }
  });

  return (
    <group>
      {/* Top Plaza Ground Plate */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[6.8, 7.1, 0.3, 36]} />
        <meshStandardMaterial
          color={isDark ? "#1E293B" : "#F1F5F9"}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Cyberpunk Outer Island Perimeter Neon Ring */}
      <mesh position={[0, 0.255, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.65, 6.78, 36]} />
        <meshBasicMaterial color={isDark ? "#2F6BFF" : "#3B82F6"} side={THREE.DoubleSide} />
      </mesh>

      {/* Underneath Faceted Rock Island Crystal */}
      <mesh position={[0, -1.3, 0]}>
        <coneGeometry args={[7.0, 2.6, 18]} />
        <meshStandardMaterial color={isDark ? "#0A0F1D" : "#64748B"} roughness={0.9} />
      </mesh>

      {/* Levitating Energy Core underneath the floating island */}
      <group position={[0, -2.6, 0]} ref={levitationGlow}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 3.2, 32]} />
          <meshBasicMaterial
            color={isDark ? "#7C5CFF" : "#3B82F6"}
            transparent
            opacity={isDark ? 0.6 : 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Circular Asphalt Road */}
      <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[4.4, 5.8, 36]} />
        <meshStandardMaterial color={isDark ? "#080D1A" : "#334155"} roughness={0.6} />
      </mesh>

      {/* Yellow Center Road Line */}
      <mesh position={[0, 0.215, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.08, 5.12, 36]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>

      {/* Low-Poly Trees with varied foliage styles */}
      {[
        [-4.5, 0.2, -4.0, "#10B981"],
        [-0.8, 0.2, -4.6, "#059669"],
        [-4.8, 0.2, 2.8, "#10B981"],
        [4.8, 0.2, -3.8, "#34D399"],
        [-4.8, 0.2, -1.2, "#047857"]
      ].map(([x, y, z, foliageColor], i) => (
        <group key={i} position={[x, y, z]}>
          {/* Wooden Trunk */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.1, 0.6, 8]} />
            <meshStandardMaterial color="#78350F" roughness={0.9} />
          </mesh>
          {/* Tiered Foliage Cones */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <coneGeometry args={[0.5, 0.8, 7]} />
            <meshStandardMaterial color={foliageColor} roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.25, 0]} castShadow>
            <coneGeometry args={[0.35, 0.6, 7]} />
            <meshStandardMaterial color={foliageColor} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Modern Streetlamps with soft ambient light pools */}
      {[
        [4.0, 0.2, 3.8],
        [-3.8, 0.2, 4.0],
        [-4.0, 0.2, -3.8]
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 1.8, 8]} />
            <meshStandardMaterial color="#94A3B8" />
          </mesh>
          <mesh position={[0, 1.8, 0]}>
            <sphereGeometry args={[0.1, 10, 10]} />
            <meshBasicMaterial color={isDark ? "#FEF08A" : "#FFFFFF"} />
          </mesh>
          {isDark && (
            <pointLight position={[0, 1.8, 0]} color="#FEF08A" intensity={1.8} distance={4.5} />
          )}
        </group>
      ))}
    </group>
  );
}

/* ====================================================================
   8. MASTER 3D SCENE WRAPPER
   ==================================================================== */
export default function FloatingCityScene({ selectedSlotId, onSelectSlot, height = "100%" }) {
  const { isDark } = useTheme();

  return (
    <div style={{ width: "100%", height, position: "relative" }}>
      <Canvas
        camera={{ position: [11.5, 9.5, 12.5], fov: 38 }}
        dpr={[1, 2]} // Performance cap: maximum 2x pixel ratio
        shadows
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      >
        {/* Dynamic Sky & Fog */}
        <color attach="background" args={[isDark ? "#070C1F" : "#EEF2F6"]} />
        <fog attach="fog" args={[isDark ? "#070C1F" : "#EEF2F6", 16, 36]} />

        {/* Ambient & Sun Lights */}
        <ambientLight intensity={isDark ? 0.7 : 1.3} />
        <directionalLight
          position={[14, 18, 12]}
          intensity={isDark ? 1.2 : 2.0}
          color={isDark ? "#93C5FD" : "#FFFFFF"}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <hemisphereLight
          skyColor={isDark ? 0x1e293b : 0xffffff}
          groundColor={isDark ? 0x070c1f : 0xe2e8f0}
          intensity={0.6}
        />

        {/* Environment, Buildings, Charging Hub & Lots */}
        <IslandEnvironment isDark={isDark} />
        <ModernBuildings isDark={isDark} />
        <EvChargingSuperhub isDark={isDark} />
        <InteractiveParkingLot selectedSlotId={selectedSlotId} onSelectSlot={onSelectSlot} isDark={isDark} />

        {/* Looping Traffic with distinct colors */}
        <AnimatedCar radiusX={4.8} radiusZ={4.8} speed={0.9} initialAngle={0} bodyColor="#2F6BFF" isDark={isDark} />
        <AnimatedCar radiusX={5.3} radiusZ={5.3} speed={-0.75} initialAngle={Math.PI * 0.9} bodyColor="#12B76A" isDark={isDark} />
        <AnimatedCar radiusX={4.8} radiusZ={4.8} speed={0.9} initialAngle={Math.PI * 1.5} bodyColor="#F59E0B" isDark={isDark} />

        {/* Walking Pedestrians */}
        <WalkingPedestrian radius={3.6} speed={0.35} initialAngle={0.6} shirtColor="#7C5CFF" />
        <WalkingPedestrian radius={3.6} speed={0.35} initialAngle={3.4} shirtColor="#EF4444" />

        {/* Lazy Drifting Clouds */}
        <DriftingClouds isDark={isDark} />

        {/* Camera Orbit Controls (smooth damping with clamped polar angles) */}
        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={8}
          maxDistance={25}
          autoRotate={!prefersReducedMotion}
          autoRotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}
