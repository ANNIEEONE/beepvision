import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Radio, Cpu, Bell, Shield, Layers, RefreshCw, Zap } from 'lucide-react';
import { ReticleCorner } from './ReticleCorner';

interface Hotspot {
  id: string;
  name: string;
  category: string;
  position: [number, number, number];
  bus: string;
  role: string;
  spec: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'camera',
    name: 'RPi Camera Module 3',
    category: 'Primary Optics',
    position: [0, 1.1, 0.45],
    bus: 'CSI-2 Ribbon (30 FPS)',
    role: 'Wide-angle vision capture feeding Hailo-8 NPU for YOLOv8 and depth estimation.',
    spec: 'Autofocus · Low-light tuned · 12MP'
  },
  {
    id: 'lidar',
    name: 'TF-Luna LiDAR',
    category: 'Distance Ranging',
    position: [0, 0.4, 0.45],
    bus: 'UART / Serial (100Hz)',
    role: 'Accurate continuous distance sensing (0.2m–8.0m) cross-checking camera depth.',
    spec: '850nm VCSEL · ±6cm accuracy'
  },
  {
    id: 'ultrasonic_tl',
    name: 'HC-SR04 Corner Transducer',
    category: 'Peripheral Sonar',
    position: [-1.1, 1.2, 0.4],
    bus: 'GPIO (Trigger + Echo)',
    role: 'Detects glass surfaces, transparent barriers, and thin poles LiDAR may miss.',
    spec: '40kHz acoustic pulse · 15° cone'
  },
  {
    id: 'amber_ring',
    name: 'Amber Safety LED Ring',
    category: 'Passive Visibility',
    position: [0, 0, 0.42],
    bus: 'Ambient Light Triggered',
    role: 'Illuminates the user during evening or low-light conditions for motorists.',
    spec: '590nm Amber · 360° perimeter'
  },
  {
    id: 'sos_button',
    name: 'Tactile SOS Button',
    category: 'Emergency Input',
    position: [0, -1.0, 0.45],
    bus: 'GPIO Digital Pull-Up',
    role: 'Oversized, glove-friendly button for instant GPS emergency dispatch.',
    spec: '2.5mm travel · Raised tactile bezel'
  },
  {
    id: 'hailo_npu',
    name: 'Hailo-8 AI HAT+ (26 TOPS)',
    category: 'Compute Accelerator',
    position: [0, 0.2, 0.0],
    bus: 'PCIe Gen 3 ×1',
    role: 'Executes YOLOv8 object detection, depth estimation, and OCR with zero cloud latency.',
    spec: '26 TOPS · 2.5W typical power'
  }
];

export const Device3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [exploded, setExploded] = useState<boolean>(false);
  const [sensorsActive, setSensorsActive] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const explodedRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 1.2);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 2.0);
    rimLight.position.set(0, -4, -4);
    scene.add(rimLight);

    // Root Group
    const deviceRoot = new THREE.Group();
    scene.add(deviceRoot);

    // Materials
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x151822,
      metalness: 0.25,
      roughness: 0.35,
    });

    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0x050c18,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 0.5,
      ior: 1.52,
    });

    const amberLedMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.6,
      roughness: 0.2,
    });

    const ultrasonicMeshMat = new THREE.MeshStandardMaterial({
      color: 0x71717a,
      metalness: 0.8,
      roughness: 0.3,
    });

    const redButtonMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.5,
      roughness: 0.4,
    });

    const pcbGreenMat = new THREE.MeshStandardMaterial({
      color: 0x14532d,
      metalness: 0.4,
      roughness: 0.5,
    });

    const chipSilverMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.9,
      roughness: 0.2,
    });

    // 1. FRONT CASING LAYER
    const frontGroup = new THREE.Group();
    deviceRoot.add(frontGroup);

    // Front main shell (rounded box)
    const shellGeom = new THREE.BoxGeometry(2.8, 3.6, 0.4);
    const frontShell = new THREE.Mesh(shellGeom, chassisMat);
    frontGroup.add(frontShell);

    // Amber LED perimeter ring
    const ringShape = new THREE.Shape();
    ringShape.moveTo(-1.42, -1.82);
    ringShape.lineTo(1.42, -1.82);
    ringShape.lineTo(1.42, 1.82);
    ringShape.lineTo(-1.42, 1.82);
    ringShape.closePath();

    const holePath = new THREE.Path();
    holePath.moveTo(-1.36, -1.76);
    holePath.lineTo(1.36, -1.76);
    holePath.lineTo(1.36, 1.76);
    holePath.lineTo(-1.36, 1.76);
    holePath.closePath();
    ringShape.holes.push(holePath);

    const ringGeom = new THREE.ExtrudeGeometry(ringShape, { depth: 0.08, bevelEnabled: false });
    const amberRing = new THREE.Mesh(ringGeom, amberLedMat);
    amberRing.position.set(0, 0, 0.2);
    frontGroup.add(amberRing);

    // Camera Module 3
    const camBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.18, 32), chassisMat);
    camBarrel.rotation.x = Math.PI / 2;
    camBarrel.position.set(0, 1.1, 0.26);
    frontGroup.add(camBarrel);

    const camGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 32), lensMat);
    camGlass.rotation.x = Math.PI / 2;
    camGlass.position.set(0, 1.1, 0.34);
    frontGroup.add(camGlass);

    // TF-Luna LiDAR Window
    const lidarHousing = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.36, 0.12), chassisMat);
    lidarHousing.position.set(0, 0.4, 0.25);
    frontGroup.add(lidarHousing);

    const lidarLens1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.04, 24), new THREE.MeshStandardMaterial({ color: 0x450a0a, emissive: 0x991b1b, emissiveIntensity: 0.8 }));
    lidarLens1.rotation.x = Math.PI / 2;
    lidarLens1.position.set(-0.22, 0.4, 0.32);
    frontGroup.add(lidarLens1);

    const lidarLens2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.04, 24), lensMat);
    lidarLens2.rotation.x = Math.PI / 2;
    lidarLens2.position.set(0.22, 0.4, 0.32);
    frontGroup.add(lidarLens2);

    // 4 Corner Ultrasonic Transducers
    const cornerPositions: [number, number][] = [
      [-1.1, 1.3],
      [1.1, 1.3],
      [-1.1, -1.3],
      [1.1, -1.3],
    ];

    cornerPositions.forEach(([ux, uy]) => {
      const uRim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 24), ultrasonicMeshMat);
      uRim.rotation.x = Math.PI / 2;
      uRim.position.set(ux, uy, 0.24);
      frontGroup.add(uRim);

      const uCone = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.08, 0.06, 24), lensMat);
      uCone.rotation.x = Math.PI / 2;
      uCone.position.set(ux, uy, 0.28);
      frontGroup.add(uCone);
    });

    // Center Piezo Vent
    const ventGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.02, 16);
    const vent = new THREE.Mesh(ventGeom, ultrasonicMeshMat);
    vent.rotation.x = Math.PI / 2;
    vent.position.set(0, -0.2, 0.21);
    frontGroup.add(vent);

    // SOS Button
    const sosBezel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 32), chassisMat);
    sosBezel.rotation.x = Math.PI / 2;
    sosBezel.position.set(0, -1.0, 0.23);
    frontGroup.add(sosBezel);

    const sosButton = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.14, 32), redButtonMat);
    sosButton.rotation.x = Math.PI / 2;
    sosButton.position.set(0, -1.0, 0.28);
    frontGroup.add(sosButton);

    // 2. MID LAYER: HAILO-8 AI HAT + RASPBERRY PI 5
    const midGroup = new THREE.Group();
    deviceRoot.add(midGroup);

    // Hailo-8 AI HAT Board
    const hailoPcb = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 0.08), pcbGreenMat);
    hailoPcb.position.set(0, 0.3, 0.0);
    midGroup.add(hailoPcb);

    // Hailo-8 AI Silicon Core Shield
    const hailoChip = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.06), chipSilverMat);
    hailoChip.position.set(0, 0.4, 0.07);
    midGroup.add(hailoChip);

    // Raspberry Pi 5 Board below HAT
    const pi5Pcb = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.2, 0.08), pcbGreenMat);
    pi5Pcb.position.set(0, -0.1, -0.3);
    midGroup.add(pi5Pcb);

    // Pi 5 Broadcom BCM2712 SoC with heat sink
    const piChip = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.12), chipSilverMat);
    piChip.position.set(0, -0.2, -0.22);
    midGroup.add(piChip);

    // 3. REAR LAYER: BATTERY POUCH & HARNESS CHASSIS
    const rearGroup = new THREE.Group();
    deviceRoot.add(rearGroup);

    const rearChassis = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.6, 0.3), chassisMat);
    rearChassis.position.set(0, 0, -0.6);
    rearGroup.add(rearChassis);

    // Battery Pack Pouch
    const batteryPouch = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.0, 0.35), new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.7,
      metalness: 0.1
    }));
    batteryPouch.position.set(0, 0, -0.9);
    rearGroup.add(batteryPouch);

    // Harness strap anchors
    const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.15), chassisMat);
    strapL.position.set(-1.5, 0.5, -0.6);
    rearGroup.add(strapL);

    const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.15), chassisMat);
    strapR.position.set(1.5, 0.5, -0.6);
    rearGroup.add(strapR);

    // Reflective strap strips
    const reflMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, emissive: 0xffffff, emissiveIntensity: 0.2 });
    const reflL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.04), reflMat);
    reflL.position.set(-1.5, 0.5, -0.5);
    rearGroup.add(reflL);

    const reflR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.04), reflMat);
    reflR.position.set(1.5, 0.5, -0.5);
    rearGroup.add(reflR);

    // 4. SENSOR RAY EFFECTS
    const sensorGroup = new THREE.Group();
    deviceRoot.add(sensorGroup);

    // LiDAR Laser line
    const laserMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 });
    const laserGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.4, 0.4),
      new THREE.Vector3(0, 0.4, 4.5),
    ]);
    const laserLine = new THREE.Line(laserGeom, laserMat);
    sensorGroup.add(laserLine);

    // Laser target dot
    const laserDot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    laserDot.position.set(0, 0.4, 4.5);
    sensorGroup.add(laserDot);

    // Camera FOV Frustum
    const fovMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.4 });
    const fovGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.1, 0.35), new THREE.Vector3(-1.8, 2.5, 4.0),
      new THREE.Vector3(0, 1.1, 0.35), new THREE.Vector3(1.8, 2.5, 4.0),
      new THREE.Vector3(0, 1.1, 0.35), new THREE.Vector3(-1.8, -0.5, 4.0),
      new THREE.Vector3(0, 1.1, 0.35), new THREE.Vector3(1.8, -0.5, 4.0),
      // Frame box
      new THREE.Vector3(-1.8, 2.5, 4.0), new THREE.Vector3(1.8, 2.5, 4.0),
      new THREE.Vector3(1.8, 2.5, 4.0), new THREE.Vector3(1.8, -0.5, 4.0),
      new THREE.Vector3(1.8, -0.5, 4.0), new THREE.Vector3(-1.8, -0.5, 4.0),
      new THREE.Vector3(-1.8, -0.5, 4.0), new THREE.Vector3(-1.8, 2.5, 4.0),
    ]);
    const fovLines = new THREE.LineSegments(fovGeom, fovMat);
    sensorGroup.add(fovLines);

    // Mouse Interaction for Orbit
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.05;
    let targetRotationY = -0.2;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.006;
      targetRotationX += deltaY * 0.006;
      targetRotationX = Math.max(-0.6, Math.min(0.6, targetRotationX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth rotation
      if (autoRotate && !isDragging) {
        targetRotationY += 0.004;
      }
      deviceRoot.rotation.y += (targetRotationY - deviceRoot.rotation.y) * 0.08;
      deviceRoot.rotation.x += (targetRotationX - deviceRoot.rotation.x) * 0.08;

      // Exploded interpolation
      const targetExploded = explodedRef.current;
      const currentExploded = THREE.MathUtils.lerp(frontGroup.position.z, targetExploded * 1.0, 0.08);
      frontGroup.position.z = currentExploded;
      midGroup.position.z = THREE.MathUtils.lerp(midGroup.position.z, targetExploded * -0.2, 0.08);
      rearGroup.position.z = THREE.MathUtils.lerp(rearGroup.position.z, targetExploded * -1.2, 0.08);

      // Amber LED pulse
      amberLedMat.emissiveIntensity = 1.4 + 0.4 * Math.sin(time * 3.5);

      // Sensor ray animations
      sensorGroup.visible = sensorsActive && targetExploded < 0.2;
      if (sensorsActive) {
        // Laser sweep oscillation
        laserDot.position.x = 0.3 * Math.sin(time * 4.0);
        laserLine.geometry.attributes.position.setXYZ(1, laserDot.position.x, 0.4, 4.5);
        laserLine.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoRotate, sensorsActive]);

  useEffect(() => {
    explodedRef.current = exploded ? 1 : 0;
  }, [exploded]);

  return (
    <div className="relative w-full h-[620px] rounded-2xl bg-white dark:bg-[#251E1C]/65 dark:backdrop-blur-2xl border border-black/10 dark:border-white/10 overflow-hidden select-none shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-colors">
      {/* Antimetal Signature Reticle Corners */}
      <ReticleCorner size={10} className="text-[#FF5500]/50 dark:text-[#FF9E8C]/50" />

      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Controls (Antimetal Glass Pills) */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
        <button
          onClick={() => setExploded(!exploded)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all border ${
            exploded
              ? 'bg-[#FF5500] dark:bg-[#FF9E8C] text-white dark:text-[#1A1614] border-[#FF5500] dark:border-[#FF9E8C] font-bold shadow-md'
              : 'glass-surface border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-black/25 dark:hover:border-white/25'
          }`}
          aria-label="Toggle Exploded Layer View"
        >
          <Layers className="w-3.5 h-3.5" />
          {exploded ? 'Collapse' : 'Explode Assembly'}
        </button>

        <button
          onClick={() => setSensorsActive(!sensorsActive)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all border ${
            sensorsActive
              ? 'glass-surface border-[#0088CC]/40 dark:border-[#30D158]/40 text-[#0088CC] dark:text-[#30D158] font-semibold'
              : 'glass-surface border-black/10 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
          }`}
          aria-label="Toggle Active Sensor Rays"
        >
          <Radio className="w-3.5 h-3.5" />
          {sensorsActive ? 'Active Beams' : 'Beams Muted'}
        </button>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all border ${
            autoRotate
              ? 'glass-surface border-black/15 dark:border-white/20 text-zinc-900 dark:text-white'
              : 'glass-surface border-black/10 dark:border-white/10 text-zinc-400 dark:text-zinc-500'
          }`}
          aria-label="Toggle Orbit Rotation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {autoRotate ? 'Orbiting' : 'Paused'}
        </button>
      </div>

      {/* Interactive Hotspot Picker Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 glass-surface p-2.5 rounded-xl border border-black/10 dark:border-white/10 z-10">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 mr-2 flex items-center gap-1 tracking-widest">
            <Zap className="w-3 h-3 text-[#FF5500] dark:text-[#FF9E8C]" /> Telemetry:
          </span>
          {HOTSPOTS.map((spot) => (
            <button
              key={spot.id}
              onClick={() => setActiveHotspot(activeHotspot?.id === spot.id ? null : spot)}
              className={`px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
                activeHotspot?.id === spot.id
                  ? 'bg-zinc-950 dark:bg-white text-white dark:text-black font-bold shadow-md'
                  : 'bg-black/[0.04] dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 hover:bg-black/[0.08] dark:hover:bg-white/[0.09] border border-black/5 dark:border-white/5'
              }`}
            >
              {spot.name.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest hidden sm:block">
          [ 360° Drag Orbit · Click to Inspect ]
        </div>
      </div>

      {/* Active Hotspot HUD Detail Card */}
      {activeHotspot && (
        <div className="absolute top-16 right-4 w-84 glass-surface border border-[#FF5500]/40 dark:border-[#FF9E8C]/40 rounded-xl p-5 shadow-2xl text-left z-20 transition-all relative">
          <ReticleCorner size={8} className="text-[#FF5500] dark:text-[#FF9E8C]" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-[#FF5500] dark:text-[#FF9E8C] tracking-[0.14em] font-semibold">
              {activeHotspot.category}
            </span>
            <button
              onClick={() => setActiveHotspot(null)}
              className="text-zinc-400 hover:text-black dark:hover:text-white text-xs px-1 font-mono"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>
          <h4 className="text-base font-semibold text-zinc-950 dark:text-white tracking-tight mb-1">{activeHotspot.name}</h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">{activeHotspot.role}</p>

          <div className="space-y-2 pt-3 border-t border-black/10 dark:border-white/10 text-[11px] font-mono">
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Interconnect:</span>
              <span className="text-zinc-900 dark:text-white font-medium">{activeHotspot.bus}</span>
            </div>
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Performance:</span>
              <span className="text-[#00B368] dark:text-[#30D158] font-semibold">{activeHotspot.spec}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
