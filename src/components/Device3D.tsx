import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { animate, spring } from 'animejs';
import {
  Radio,
  Layers,
  RefreshCw,
  Zap,
  Crosshair,
  Sliders,
  CheckCircle2,
  Box,
  Eye
} from 'lucide-react';

export interface Hotspot {
  id: string;
  name: string;
  shortName: string;
  category: string;
  image: string;
  bus: string;
  role: string;
  spec: string;
  status: string;
  targetPos: [number, number, number];
  targetRot: [number, number];
}

export const HOTSPOTS: Hotspot[] = [
  {
    id: 'camera',
    name: 'Raspberry Pi Camera Module 3',
    shortName: 'CAM 3',
    category: 'Primary Optical Sensor',
    image: '/components/rpi_camera.png',
    bus: 'CSI-2 Ribbon (2-Lane @ 30 FPS)',
    role: 'Ultra-wide autofocus optics continuously capturing the forward path to feed the Hailo-8 NPU for YOLOv8 perception and obstacle localization.',
    spec: '12MP Sony IMX708 · 120° Wide FOV · Phase Detect AF',
    status: 'ACTIVE · 30 FPS STREAM',
    targetPos: [0, 1.15, 1.8],
    targetRot: [-0.05, 0.0]
  },
  {
    id: 'lidar',
    name: 'TF-Luna Solid-State LiDAR',
    shortName: 'TF-LUNA',
    category: 'Distance Ranging',
    image: '/components/tf_luna.png',
    bus: 'UART / Serial (100Hz @ 115200 baud)',
    role: 'Continuous millimeter-accuracy distance sensing (0.2m–8.0m) to provide instantaneous depth validation and prevent step hazards.',
    spec: '850nm VCSEL · ±6cm accuracy · 100Hz Ranging',
    status: 'RANGING · 1.42m OBSTACLE',
    targetPos: [0, 0.35, 1.6],
    targetRot: [0.0, 0.0]
  },
  {
    id: 'ultrasonic',
    name: 'HC-SR04 Quad Sonar Array',
    shortName: 'HC-SR04',
    category: 'Peripheral Acoustic Sonar',
    image: '/components/hc_sr04.png',
    bus: 'GPIO (Trigger / Echo Interrupt)',
    role: 'Acoustic transducers detect transparent glass, reflective partitions, and wire poles that optical LiDAR or camera sensors might overlook.',
    spec: '40kHz ultrasonic pulse · 15° cone · 4× Quad Array',
    status: 'PINGING · 40kHz CYCLIC',
    targetPos: [-1.15, 1.15, 1.5],
    targetRot: [0.1, -0.3]
  },
  {
    id: 'hailo_npu',
    name: 'Raspberry Pi AI HAT+ (Hailo-8)',
    shortName: 'HAILO-8',
    category: 'Edge Neural Accelerator',
    image: '/components/hailo_hat.png',
    bus: 'PCIe Gen 3 ×1 Interface',
    role: 'Executes YOLOv8 object detection, depth estimation, and OCR completely locally on-device with zero cloud latency and total privacy.',
    spec: '26 TOPS · 2.5W typical · M.2 Key-M 2242',
    status: 'INFERENCE · 11.8ms DETERMINISTIC',
    targetPos: [0, 0.35, 1.05],
    targetRot: [0.18, 0.65]
  },
  {
    id: 'rpi5',
    name: 'Raspberry Pi 5 (8GB RAM)',
    shortName: 'RPI 5',
    category: 'Central Host Controller',
    image: '/components/rpi5.png',
    bus: '40-Pin GPIO + CSI + PCIe',
    role: 'The primary compute host running the BeepVision real-time sensor fusion daemon, audio synthesizer engine, and safety supervisor.',
    spec: 'Quad-Core BCM2712 @ 2.4GHz · 8GB LPDDR4X',
    status: 'ONLINE · 41.2°C NORMAL',
    targetPos: [0, -0.15, -0.2],
    targetRot: [0.24, 0.72]
  },
  {
    id: 'amber_ring',
    name: '590nm Amber Safety Halo',
    shortName: 'AMBER HALO',
    category: 'Motorist Visibility System',
    image: '/components/sos_button.png',
    bus: 'Ambient Light Sensor Controlled',
    role: 'High-luminance active LED perimeter halo that pulses in low-light environments to ensure pedestrians and motorists clearly see the user.',
    spec: '590nm High-CRI Amber · 360° Bezel Perimeter',
    status: 'BREATHING · 1.25 Hz PULSE',
    targetPos: [0, 0, 1.2],
    targetRot: [-0.05, 0.15]
  },
  {
    id: 'sos_button',
    name: 'Tactile Emergency SOS Plunger',
    shortName: 'TACTILE SOS',
    category: 'Tactile Safety Input',
    image: '/components/sos_button.png',
    bus: 'GPIO Interrupt Digital Pull-up',
    role: 'Oversized, textured tactile push-button with spring detent for immediate one-touch emergency GPS dispatch and high-decibel acoustic beacon.',
    spec: '2.5mm travel · Raised knurled bezel · IP67',
    status: 'STANDBY · INSTANT DISPATCH',
    targetPos: [0, -1.05, 1.6],
    targetRot: [-0.15, 0.0]
  }
];

export const Device3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [exploded, setExploded] = useState<boolean>(false);
  const [beamsActive, setBeamsActive] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [buttonPressed, setButtonPressed] = useState<boolean>(false);

  // Animation values manipulated by Anime.js
  const animStateRef = useRef({
    frontZ: 0,
    hatZ: 0,
    piZ: 0,
    rearZ: 0,
    rotY: -0.2,
    rotX: 0.08,
    buttonDepress: 0,
    fanAngle: 0
  });

  // Anime.js Spring-Physics Explosion Animation
  useEffect(() => {
    animate(animStateRef.current, {
      frontZ: exploded ? 2.5 : 0,
      hatZ: exploded ? 1.05 : 0,
      piZ: exploded ? -0.2 : 0,
      rearZ: exploded ? -1.65 : 0,
      rotY: exploded ? 0.72 : -0.2,
      rotX: exploded ? 0.22 : 0.08,
      duration: 1300,
      ease: spring({
        damping: 15,
        stiffness: 75,
        mass: 1.15
      })
    });
  }, [exploded]);

  // Anime.js Hotspot Focus & Camera Tilt
  useEffect(() => {
    if (activeHotspot) {
      setAutoRotate(false);
      // Automatically expand assembly when inspecting internal compute cores (Hailo-8 or Raspberry Pi 5)
      if (activeHotspot.id === 'hailo_npu' || activeHotspot.id === 'rpi5') {
        setExploded(true);
      }
      animate(animStateRef.current, {
        rotX: activeHotspot.targetRot[0],
        rotY: activeHotspot.targetRot[1],
        duration: 950,
        ease: 'outExpo'
      });
    }
  }, [activeHotspot]);

  // Tactile SOS Button Press Animation
  const handleButtonPress = () => {
    setButtonPressed(true);
    animate(animStateRef.current, {
      buttonDepress: 0.08,
      duration: 120,
      ease: 'outQuad',
      onComplete: () => {
        animate(animStateRef.current, {
          buttonDepress: 0,
          duration: 350,
          ease: spring({ damping: 10, stiffness: 120 })
        });
        setButtonPressed(false);
      }
    });
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Three.js Scene, Camera, High-Precision WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // Studio Lighting setup for realistic metallic and specular highlights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 2.8);
    rimLight.position.set(0, -5, -4);
    scene.add(rimLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1.5);
    topLight.position.set(0, 6, 2);
    scene.add(topLight);

    // Texture Loader with sRGB setup for surface micro-details
    const textureLoader = new THREE.TextureLoader();
    const loadTex = (url: string) => {
      const tex = textureLoader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    };

    const rpiTex = loadTex('/components/rpi5.png');
    const hailoTex = loadTex('/components/hailo_hat.png');
    const camTex = loadTex('/components/rpi_camera.png');
    const lidarTex = loadTex('/components/tf_luna.png');
    const sonarTex = loadTex('/components/hc_sr04.png');

    // ==========================================
    // PHYSICAL MATERIAL PALETTE
    // ==========================================
    const pcbGreenMat = new THREE.MeshStandardMaterial({
      color: 0x14532d,
      roughness: 0.35,
      metalness: 0.25
    });

    const brushedAluminumMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.92,
      roughness: 0.2
    });

    const darkAnodizedMat = new THREE.MeshStandardMaterial({
      color: 0x181c24,
      metalness: 0.8,
      roughness: 0.3
    });

    const chassisUnibodyMat = new THREE.MeshStandardMaterial({
      color: 0x12151c,
      metalness: 0.45,
      roughness: 0.32
    });

    const goldPinMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.96,
      roughness: 0.15
    });

    const brassStandoffMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.92,
      roughness: 0.25
    });

    const physicalGlassLensMat = new THREE.MeshPhysicalMaterial({
      color: 0x071e33,
      metalness: 0.9,
      roughness: 0.04,
      transmission: 0.82,
      thickness: 0.45,
      ior: 1.55,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });

    const amberNeonHaloMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 2.2,
      roughness: 0.15
    });

    const redButtonMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0x991b1b,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.15
    });

    const acousticMeshMat = new THREE.MeshStandardMaterial({
      color: 0x3f3f46,
      roughness: 0.75,
      metalness: 0.6
    });

    const deviceRoot = new THREE.Group();
    scene.add(deviceRoot);

    // =========================================================================
    // LAYER 1: FRONT SENSORY ENCLOSURE & VOLUMETRIC MODULES (Front Z)
    // =========================================================================
    const frontGroup = new THREE.Group();
    deviceRoot.add(frontGroup);

    // 1.1 Front Molded Unibody Shell (Thick beveled housing)
    const frontBezel = new THREE.Mesh(new THREE.BoxGeometry(2.9, 3.7, 0.38), chassisUnibodyMat);
    frontGroup.add(frontBezel);

    // 1.2 590nm Amber Safety Halo Light Guide (3D extruded perimeter channel)
    const ringShape = new THREE.Shape();
    ringShape.moveTo(-1.48, -1.88);
    ringShape.lineTo(1.48, -1.88);
    ringShape.lineTo(1.48, 1.88);
    ringShape.lineTo(-1.48, 1.88);
    ringShape.closePath();

    const holePath = new THREE.Path();
    holePath.moveTo(-1.40, -1.80);
    holePath.lineTo(1.40, -1.80);
    holePath.lineTo(1.40, 1.80);
    holePath.lineTo(-1.40, 1.80);
    holePath.closePath();
    ringShape.holes.push(holePath);

    const amberHalo = new THREE.Mesh(
      new THREE.ExtrudeGeometry(ringShape, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 }),
      amberNeonHaloMat
    );
    amberHalo.position.set(0, 0, 0.18);
    frontGroup.add(amberHalo);

    // 1.3 FULL 3D RASPBERRY PI CAMERA MODULE 3 (Sony IMX708)
    const cam3Group = new THREE.Group();
    cam3Group.position.set(0, 1.15, 0.2);
    frontGroup.add(cam3Group);

    // Camera PCB substrate block
    const camPcb = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.88, 0.06), pcbGreenMat);
    cam3Group.add(camPcb);

    // Textured circuit face
    const camDecal = new THREE.Mesh(
      new THREE.PlaneGeometry(0.94, 0.86),
      new THREE.MeshStandardMaterial({ map: camTex, transparent: true, alphaTest: 0.1, roughness: 0.35, metalness: 0.2 })
    );
    camDecal.position.z = 0.035;
    cam3Group.add(camDecal);

    // 4 Corner brass screw standoffs
    [[-0.42, 0.38], [0.42, 0.38], [-0.42, -0.38], [0.42, -0.38]].forEach(([cx, cy]) => {
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12), brassStandoffMat);
      screw.rotation.x = Math.PI / 2;
      screw.position.set(cx, cy, 0.04);
      cam3Group.add(screw);
    });

    // 3D Autofocus Voice-Coil Actuator Box (Dark metal cube)
    const vcmActuator = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.52, 0.16), darkAnodizedMat);
    vcmActuator.position.set(0, 0, 0.1);
    cam3Group.add(vcmActuator);

    // 3D Multi-Stage Cylindrical Optical Lens Barrel
    const outerBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.16, 32), darkAnodizedMat);
    outerBarrel.rotation.x = Math.PI / 2;
    outerBarrel.position.set(0, 0, 0.22);
    cam3Group.add(outerBarrel);

    const innerStep = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 32), brushedAluminumMat);
    innerStep.rotation.x = Math.PI / 2;
    innerStep.position.set(0, 0, 0.28);
    cam3Group.add(innerStep);

    // Deep Curved Glass Lens (Physical Transmission & Glare)
    const glassLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      physicalGlassLensMat
    );
    glassLens.rotation.x = Math.PI / 2;
    glassLens.position.set(0, 0, 0.28);
    cam3Group.add(glassLens);

    // Animated Rotating Autofocus Reticle HUD Ring
    const reticleRing = new THREE.Mesh(
      new THREE.RingGeometry(0.28, 0.31, 32),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    reticleRing.position.set(0, 0, 0.32);
    cam3Group.add(reticleRing);

    // 3D CSI Flexible Flat Ribbon Cable (Curving backward into Pi)
    const csiCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, -0.44, 0.02),
      new THREE.Vector3(0, -0.9, -0.15),
      new THREE.Vector3(0, -1.1, -0.45)
    );
    const csiTube = new THREE.Mesh(
      new THREE.TubeGeometry(csiCurve, 20, 0.16, 4, false),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.45, metalness: 0.3 })
    );
    cam3Group.add(csiTube);

    // 1.4 FULL 3D TF-LUNA LIDAR SENSOR (Benewake)
    const lidar3Group = new THREE.Group();
    lidar3Group.position.set(0, 0.35, 0.2);
    frontGroup.add(lidar3Group);

    // 3D Stepped Enclosure Body
    const lidarMainBody = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.65, 0.35), darkAnodizedMat);
    lidarMainBody.position.set(0, 0, 0.1);
    lidar3Group.add(lidarMainBody);

    // Side Mounting Tabs (Ears) with screw holes
    [-0.64, 0.64].forEach((tx) => {
      const ear = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 0.12), darkAnodizedMat);
      ear.position.set(tx, 0, 0.05);
      lidar3Group.add(ear);

      const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.14, 16), brushedAluminumMat);
      hole.rotation.x = Math.PI / 2;
      hole.position.set(tx, 0, 0.05);
      lidar3Group.add(hole);
    });

    // Dual Cylindrical Snout Apertures (TX Laser & RX Avalanche Diode)
    const txSnout = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 24), darkAnodizedMat);
    txSnout.rotation.x = Math.PI / 2;
    txSnout.position.set(-0.24, 0, 0.28);
    lidar3Group.add(txSnout);

    const txRubyLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 1.0, roughness: 0.1 })
    );
    txRubyLens.rotation.x = Math.PI / 2;
    txRubyLens.position.set(-0.24, 0, 0.3);
    lidar3Group.add(txRubyLens);

    const rxSnout = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 24), darkAnodizedMat);
    rxSnout.rotation.x = Math.PI / 2;
    rxSnout.position.set(0.24, 0, 0.28);
    lidar3Group.add(rxSnout);

    const rxGlassLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      physicalGlassLensMat
    );
    rxGlassLens.rotation.x = Math.PI / 2;
    rxGlassLens.position.set(0.24, 0, 0.3);
    lidar3Group.add(rxGlassLens);

    // 6-Pin Micro-JST Cable Harness on rear
    const jstSocket = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.1), brushedAluminumMat);
    jstSocket.position.set(0, 0, -0.08);
    lidar3Group.add(jstSocket);

    // 1.5 4× FULL 3D CORNER HC-SR04 ULTRASONIC TRANSDUCERS
    const sonarWaveGroups: THREE.Group[] = [];
    const cornerCoordinates: [number, number][] = [
      [-1.08, 1.25],
      [1.08, 1.25],
      [-1.08, -1.25],
      [1.08, -1.25]
    ];

    cornerCoordinates.forEach(([cx, cy]) => {
      const sonarUnit = new THREE.Group();
      sonarUnit.position.set(cx, cy, 0.2);
      frontGroup.add(sonarUnit);

      // Blue FR4 PCB Base Plate
      const pcb = new THREE.Mesh(
        new THREE.BoxGeometry(0.88, 0.54, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.2 })
      );
      sonarUnit.add(pcb);

      // Dual Prominent Aluminum Transducer Cans (T and R)
      [-0.2, 0.2].forEach((txOffset) => {
        // Outer machined metal cylinder
        const can = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.24, 28), brushedAluminumMat);
        can.rotation.x = Math.PI / 2;
        can.position.set(txOffset, 0, 0.12);
        sonarUnit.add(can);

        // Chamfered bezel rim
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.02, 12, 28), brushedAluminumMat);
        rim.position.set(txOffset, 0, 0.24);
        sonarUnit.add(rim);

        // Recessed Dark Perforated Acoustic Mesh Grille
        const meshDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.02, 20), acousticMeshMat);
        meshDisc.rotation.x = Math.PI / 2;
        meshDisc.position.set(txOffset, 0, 0.23);
        sonarUnit.add(meshDisc);
      });

      // 3D Quartz Crystal Oscillator (HC-49/S silver elliptical can)
      const crystal = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.14, 16), brushedAluminumMat);
      crystal.rotation.z = Math.PI / 2;
      crystal.position.set(0, 0, 0.06);
      sonarUnit.add(crystal);

      // 4-Pin Gold Right-Angle Header
      for (let p = 0; p < 4; p++) {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.12), goldPinMat);
        pin.position.set(-0.15 + p * 0.1, -0.22, 0.04);
        sonarUnit.add(pin);
      }

      // Animated Sonar Wavefront Emitters
      const waveGroup = new THREE.Group();
      waveGroup.position.set(cx, cy, 0.45);
      frontGroup.add(waveGroup);
      sonarWaveGroups.push(waveGroup);

      for (let w = 0; w < 3; w++) {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.15 + w * 0.15, 0.19 + w * 0.15, 28),
          new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
        );
        ring.userData = { phase: w * 0.33 };
        waveGroup.add(ring);
      }
    });

    // 1.6 FULL 3D TACTILE EMERGENCY SOS PUSHBUTTON (Plunger + Spring)
    const sosGroup = new THREE.Group();
    sosGroup.position.set(0, -1.05, 0.2);
    frontGroup.add(sosGroup);

    // Heavy Knurled Anodized Aluminum Protective Bezel Ring
    const sosBezel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.18, 32), darkAnodizedMat);
    sosBezel.rotation.x = Math.PI / 2;
    sosBezel.position.set(0, 0, 0.08);
    sosGroup.add(sosBezel);

    // Bezel knurling ridges
    for (let k = 0; k < 18; k++) {
      const angle = (k / 18) * Math.PI * 2;
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.03), brushedAluminumMat);
      ridge.position.set(0.4 * Math.cos(angle), 0.4 * Math.sin(angle), 0.08);
      sosGroup.add(ridge);
    }

    // Depressable Red Dome Plunger (Interactive with Anime.js)
    const plungerGroup = new THREE.Group();
    plungerGroup.position.set(0, 0, 0.12);
    sosGroup.add(plungerGroup);

    const plungerDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      redButtonMat
    );
    plungerDome.rotation.x = Math.PI / 2;
    plungerGroup.add(plungerDome);

    const plungerSkirt = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.12, 32), redButtonMat);
    plungerSkirt.rotation.x = Math.PI / 2;
    plungerSkirt.position.z = -0.06;
    plungerGroup.add(plungerSkirt);

    // White tactile exclamation symbol on dome
    const excPoint = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.02), brushedAluminumMat);
    excPoint.position.set(0, 0.02, 0.16);
    plungerGroup.add(excPoint);

    const excDot = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.02), brushedAluminumMat);
    excDot.position.set(0, -0.08, 0.16);
    plungerGroup.add(excDot);

    // =========================================================================
    // LAYER 2: HAILO-8 AI HAT+ (26 TOPS NPU) ACCELERATOR (Mid-High Z)
    // =========================================================================
    const hatGroup = new THREE.Group();
    deviceRoot.add(hatGroup);

    // 2.1 HAT Form-Factor PCB Board with Fan Intake Cutout Window
    const hatBoard = new THREE.Mesh(new THREE.BoxGeometry(2.45, 1.85, 0.08), pcbGreenMat);
    hatBoard.position.set(0, 0.35, 0);
    hatGroup.add(hatBoard);

    // Fan ventilation aperture (recessed pass-through for Pi 5 active cooler air intake)
    const fanAperture = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.95, 0.1),
      darkAnodizedMat
    );
    fanAperture.position.set(0.45, 0.25, 0);
    hatGroup.add(fanAperture);

    // High-Resolution Silkscreen Overlay
    const hatDecal = new THREE.Mesh(
      new THREE.PlaneGeometry(2.45, 1.85),
      new THREE.MeshStandardMaterial({ map: hailoTex, transparent: true, alphaTest: 0.1, roughness: 0.35, metalness: 0.2 })
    );
    hatDecal.position.set(0, 0.35, 0.045);
    hatGroup.add(hatDecal);

    // 2.2 4× Heavy Brass Hexagonal Standoff Pillars with Threaded Screws
    [[-1.1, 1.15], [1.1, 1.15], [-1.1, -0.45], [1.1, -0.45]].forEach(([sx, sy]) => {
      const standoff = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.65, 6), brassStandoffMat);
      standoff.position.set(sx, sy, -0.3);
      hatGroup.add(standoff);

      const screwHead = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 16), brushedAluminumMat);
      screwHead.position.set(sx, sy, 0.05);
      hatGroup.add(screwHead);

      const screwSlot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.02), darkAnodizedMat);
      screwSlot.position.set(sx, sy, 0.08);
      hatGroup.add(screwSlot);
    });

    // 2.3 M.2 Key-M Socket (Black connector housing with gold contact fingers)
    const m2Socket = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.18, 0.22), darkAnodizedMat);
    m2Socket.position.set(-0.35, -0.15, 0.14);
    hatGroup.add(m2Socket);

    // M.2 Gold spring contact fingers inside socket
    for (let c = 0; c < 12; c++) {
      const contact = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 0.04), goldPinMat);
      contact.position.set(-0.65 + c * 0.055, -0.15, 0.18);
      hatGroup.add(contact);
    }

    // 2.4 Hailo-8 M.2 2242 AI Accelerator Module Card
    const m2Card = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 1.35, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x0f3d2e, roughness: 0.35, metalness: 0.25 })
    );
    m2Card.position.set(-0.35, 0.58, 0.14);
    hatGroup.add(m2Card);

    // M.2 Semicircular Retention Notch & Knurled Standoff Screw
    const m2Standoff = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.14, 16), brushedAluminumMat);
    m2Standoff.position.set(-0.35, 1.25, 0.14);
    hatGroup.add(m2Standoff);

    const m2Screw = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 16), brushedAluminumMat);
    m2Screw.position.set(-0.35, 1.25, 0.22);
    hatGroup.add(m2Screw);

    // 2.5 HAILO-8 26 TOPS NEURAL SILICON CORE & FINNED HEATSINK
    // Silicon Flip-Chip Die with Laser-Etched Metal Heat Spreader
    const hailoChipDie = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 0.58, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.94, roughness: 0.15 })
    );
    hailoChipDie.position.set(-0.35, 0.52, 0.2);
    hatGroup.add(hailoChipDie);

    // Laser-etched metallic core label plate
    const hailoLabelPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.52, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.3 })
    );
    hailoLabelPlate.position.set(-0.35, 0.52, 0.245);
    hatGroup.add(hailoLabelPlate);

    // 3D Extruded Aluminum NPU Heatsink Block (8 Machined Cooling Fins)
    const npuHeatsinkBase = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.06), brushedAluminumMat);
    npuHeatsinkBase.position.set(-0.35, 0.52, 0.26);
    hatGroup.add(npuHeatsinkBase);

    for (let f = 0; f < 8; f++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.6, 0.16), brushedAluminumMat);
      fin.position.set(-0.6 + f * 0.075, 0.52, 0.35);
      hatGroup.add(fin);
    }

    // Glowing Cyan Neural Activity Core Tensor Light
    const npuHalo = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.68, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x00F0FF, emissive: 0x00F0FF, emissiveIntensity: 2.2, transparent: true, opacity: 0.85 })
    );
    npuHalo.position.set(-0.35, 0.52, 0.25);
    hatGroup.add(npuHalo);

    // Surrounding SMD 0402 ceramic decoupling capacitors
    [[-0.6, 0.85], [-0.55, 0.95], [-0.15, 0.85], [-0.1, 0.95], [-0.6, 0.15], [-0.15, 0.15]].forEach(([cx, cy]) => {
      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.08, 0.04),
        new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.5, metalness: 0.2 })
      );
      cap.position.set(cx, cy, 0.18);
      hatGroup.add(cap);
    });

    // 2.6 Dual SMD Status LEDs (Power + Active Neural Tensor Inference)
    const pwrLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.05, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 2.5 })
    );
    pwrLed.position.set(0.95, 1.15, 0.06);
    hatGroup.add(pwrLed);

    const actLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.05, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x00F0FF, emissive: 0x00F0FF, emissiveIntensity: 2.8 })
    );
    actLed.position.set(0.95, 1.05, 0.06);
    hatGroup.add(actLed);

    // 2.7 40-Pin Stacking Pass-Through GPIO Header Block
    const hatGpioHeader = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.9, 0.34), darkAnodizedMat);
    hatGpioHeader.position.set(-1.08, 0.35, 0.18);
    hatGroup.add(hatGpioHeader);

    // 40 Recessed Gold Female Socket Holes on Top
    for (let r = 0; r < 20; r++) {
      [-0.04, 0.04].forEach((col) => {
        const socketHole = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.04), goldPinMat);
        socketHole.position.set(-1.08 + col, -0.55 + r * 0.09, 0.36);
        hatGroup.add(socketHole);
      });
    }

    // 2.8 3D PCIe Gen 3 ×1 Polyimide Flexible Flat Cable (Connecting HAT to Pi 5 below)
    const pcieFlexCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-1.15, -0.35, 0.02),
      new THREE.Vector3(-1.35, -0.35, -0.15),
      new THREE.Vector3(-1.35, -0.75, -0.3),
      new THREE.Vector3(-1.18, -0.85, -0.26)
    );
    const pcieFlexCable = new THREE.Mesh(
      new THREE.TubeGeometry(pcieFlexCurve, 24, 0.14, 4, false),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25, side: THREE.DoubleSide })
    );
    hatGroup.add(pcieFlexCable);

    // =========================================================================
    // LAYER 3: RASPBERRY PI 5 MAINBOARD HOST (Mid-Low Z)
    // =========================================================================
    const piGroup = new THREE.Group();
    deviceRoot.add(piGroup);

    // 3.1 Pi 5 Multi-Layer FR4 Substrate with Gold Mounting Rings
    const piBoard = new THREE.Mesh(new THREE.BoxGeometry(2.68, 3.48, 0.08), pcbGreenMat);
    piBoard.position.set(0, -0.1, -0.3);
    piGroup.add(piBoard);

    // 4 Gold annular screw pads on corners
    [[-1.2, 1.55], [1.2, 1.55], [-1.2, -1.75], [1.2, -1.75]].forEach(([hx, hy]) => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.12, 16), goldPinMat);
      ring.position.set(hx, hy, -0.255);
      piGroup.add(ring);
    });

    // High-Resolution Silkscreen Overlay (Micro-traces, resistors, IC pads)
    const piDecal = new THREE.Mesh(
      new THREE.PlaneGeometry(2.65, 3.45),
      new THREE.MeshStandardMaterial({ map: rpiTex, transparent: true, alphaTest: 0.1, roughness: 0.35, metalness: 0.2 })
    );
    piDecal.position.set(0, -0.1, -0.255);
    piGroup.add(piDecal);

    // 3.2 BROADCOM BCM2712 SOC & OFFICIAL 3D ACTIVE COOLER
    // Processor Silicon Die with Silver Heat Spreader
    const bcmSoc = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.85, 0.1),
      new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.94, roughness: 0.15 })
    );
    bcmSoc.position.set(0, -0.1, -0.21);
    piGroup.add(bcmSoc);

    // Machined Aluminum Heatsink Base Block (12 Distinct Cooling Fins)
    const activeCoolerBase = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.35, 0.08), brushedAluminumMat);
    activeCoolerBase.position.set(0.15, -0.05, -0.16);
    piGroup.add(activeCoolerBase);

    for (let finIdx = 0; finIdx < 12; finIdx++) {
      const coolerFin = new THREE.Mesh(new THREE.BoxGeometry(0.035, 1.3, 0.18), brushedAluminumMat);
      coolerFin.position.set(-0.4 + finIdx * 0.09, -0.05, -0.05);
      piGroup.add(coolerFin);
    }

    // Centrifugal Blower Fan Housing with Circular Intake Shroud
    const fanRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.04, 16, 32), darkAnodizedMat);
    fanRing.position.set(0.15, -0.05, 0.05);
    piGroup.add(fanRing);

    const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 20), brushedAluminumMat);
    fanHub.rotation.x = Math.PI / 2;
    fanHub.position.set(0.15, -0.05, 0.05);
    piGroup.add(fanHub);

    // 9 Curved Aerodynamic Fan Impeller Blades
    const fanBladesGroup = new THREE.Group();
    fanBladesGroup.position.set(0.15, -0.05, 0.05);
    piGroup.add(fanBladesGroup);

    for (let b = 0; b < 9; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.26, 0.03), darkAnodizedMat);
      blade.rotation.z = (b / 9) * Math.PI * 2;
      blade.position.set(0.14 * Math.cos(blade.rotation.z), 0.14 * Math.sin(blade.rotation.z), 0);
      fanBladesGroup.add(blade);
    }

    // 2× Nylon Spring-Loaded Push-Pin Mounting Posts
    [[-0.45, 0.65], [0.75, -0.75]].forEach(([px, py]) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.35, 12), brushedAluminumMat);
      post.position.set(px, py, -0.1);
      piGroup.add(post);
    });

    // 3.3 RP1 Southbridge I/O Controller Silicon
    const rp1Chip = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.55, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 })
    );
    rp1Chip.position.set(0.35, -1.05, -0.22);
    piGroup.add(rp1Chip);

    // 8GB LPDDR4X SDRAM Package
    const dramChip = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.65, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.92, roughness: 0.18 })
    );
    dramChip.position.set(-0.45, -0.1, -0.23);
    piGroup.add(dramChip);

    // 3.4 3D Gigabit RJ45 Ethernet Port Block (Right edge)
    const ethPort = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.68, 0.52), brushedAluminumMat);
    ethPort.position.set(1.24, 0.85, -0.06);
    piGroup.add(ethPort);

    // Recessed Ethernet jack cavity with retention latch notch
    const ethHole = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.52, 0.38), darkAnodizedMat);
    ethHole.position.set(1.39, 0.85, -0.06);
    piGroup.add(ethHole);

    // Dual Ethernet Status LEDs (Link Activity + 1Gbps Speed)
    const ethLedGreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.06, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 2.2 })
    );
    ethLedGreen.position.set(1.4, 1.08, 0.12);
    piGroup.add(ethLedGreen);

    const ethLedAmber = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.06, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 2.2 })
    );
    ethLedAmber.position.set(1.4, 0.62, 0.12);
    piGroup.add(ethLedAmber);

    // 3.5 2× Dual USB 3.0 Ports (Two-tier silver metal blocks with signature blue tongues)
    [0.05, -0.7].forEach((uy) => {
      const usbBlock = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.58, 0.48), brushedAluminumMat);
      usbBlock.position.set(1.24, uy, -0.06);
      piGroup.add(usbBlock);

      // Dual USB socket holes with bright blue tabs
      [-0.13, 0.13].forEach((slotOffset) => {
        const usbSlot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.14), darkAnodizedMat);
        usbSlot.position.set(1.39, uy, -0.06 + slotOffset);
        piGroup.add(usbSlot);

        const blueTab = new THREE.Mesh(
          new THREE.BoxGeometry(0.09, 0.4, 0.035),
          new THREE.MeshStandardMaterial({ color: 0x0072c6, roughness: 0.35 })
        );
        blueTab.position.set(1.38, uy, -0.06 + slotOffset + 0.035);
        piGroup.add(blueTab);
      });
    });

    // 3.6 40-Pin GPIO Header (Dual row of 20 3D gold wire pins)
    const gpioBase = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.9, 0.14), darkAnodizedMat);
    gpioBase.position.set(-1.18, 0.25, -0.19);
    piGroup.add(gpioBase);

    for (let r = 0; r < 20; r++) {
      [-0.045, 0.045].forEach((col) => {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.32), goldPinMat);
        pin.position.set(-1.18 + col, -0.65 + r * 0.09, -0.04);
        piGroup.add(pin);
      });
    }

    // 3.7 2× Micro-HDMI Ports & USB-C Power Jack on lower edge
    [-0.35, 0.15].forEach((hx) => {
      const hdmi = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.16, 0.18), brushedAluminumMat);
      hdmi.position.set(hx, -1.74, -0.21);
      piGroup.add(hdmi);
    });

    const usbcPort = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.35, 18), brushedAluminumMat);
    usbcPort.rotation.z = Math.PI / 2;
    usbcPort.position.set(0.85, -1.74, -0.21);
    piGroup.add(usbcPort);

    // 3.8 2× 4-Lane MIPI Camera/Display Connectors with Slide-Lock Bars
    [[-0.85, -1.3], [-0.4, -1.3]].forEach(([mx, my]) => {
      const mipiBase = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 0.08), darkAnodizedMat);
      mipiBase.position.set(mx, my, -0.22);
      piGroup.add(mipiBase);

      const mipiLock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.32, 0.06), brushedAluminumMat);
      mipiLock.position.set(mx - 0.06, my, -0.19);
      piGroup.add(mipiLock);
    });

    // 3.9 6× Cylindrical Aluminum Solid Capacitors
    [[-0.65, -0.75], [-0.35, -0.75], [-0.65, -1.05], [-0.35, -1.05], [0.65, -1.45], [0.35, -1.45]].forEach(([cx, cy]) => {
      const capCan = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.22, 18), brushedAluminumMat);
      capCan.position.set(cx, cy, -0.15);
      piGroup.add(capCan);

      const capMarking = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.02, 18, 1, false, 0, Math.PI), darkAnodizedMat);
      capMarking.position.set(cx, cy, -0.035);
      piGroup.add(capMarking);
    });

    // 3.10 4× Molded Ferrite Power Inductors (Shielded Chokes)
    [[0.65, 0.25], [0.85, 0.25], [0.65, -0.35], [0.85, -0.35]].forEach(([ix, iy]) => {
      const inductor = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.16, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5, roughness: 0.4 })
      );
      inductor.position.set(ix, iy, -0.2);
      piGroup.add(inductor);
    });

    // =========================================================================
    // LAYER 4: REAR BATTERY PACK & TACTICAL CHEST HARNESS (Rear Z)
    // =========================================================================
    const rearGroup = new THREE.Group();
    deviceRoot.add(rearGroup);

    // 4.1 Rear Protective Carbon Backplate
    const rearPlate = new THREE.Mesh(new THREE.BoxGeometry(2.9, 3.7, 0.25), chassisUnibodyMat);
    rearPlate.position.set(0, 0, -0.65);
    rearGroup.add(rearPlate);

    // 4.2 10,000 mAh LiPo Battery Pack Core (Ribbed texture)
    const batteryPack = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.1, 0.42), darkAnodizedMat);
    batteryPack.position.set(0, 0, -0.98);
    rearGroup.add(batteryPack);

    // Battery LED Fuel Gauge (4 bright green LED segments)
    for (let g = 0; g < 4; g++) {
      const fuelLed = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.06, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 2.2 })
      );
      fuelLed.position.set(-0.35 + g * 0.24, -1.2, -0.74);
      rearGroup.add(fuelLed);
    }

    // 4.3 Chest Harness Mounting Anchors & Quick-Release Buckles
    [-1.52, 1.52].forEach((bx) => {
      const anchor = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.8, 0.22), chassisUnibodyMat);
      anchor.position.set(bx, 0.4, -0.65);
      rearGroup.add(anchor);

      // Nylon Webbing Strap segment
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.4, 0.06), darkAnodizedMat);
      strap.position.set(bx, 0.4, -0.52);
      rearGroup.add(strap);

      // 3M Silver Reflective Safety Stripe
      const reflective = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.1, 0.08),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xd4d4d8, emissiveIntensity: 0.6 })
      );
      reflective.position.set(bx, 0.4, -0.49);
      rearGroup.add(reflective);
    });

    // =========================================================================
    // LAYER 5: DYNAMIC SENSOR BEAMS & MOVING PARTS (Anime.js Driven)
    // =========================================================================
    const sensorBeamsGroup = new THREE.Group();
    deviceRoot.add(sensorBeamsGroup);

    // 5.1 Sweeping Red Laser Ray Beam
    const laserMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 3 });
    const laserGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.35, 0.45),
      new THREE.Vector3(0, 0.35, 4.8)
    ]);
    const laserLine = new THREE.Line(laserGeom, laserMat);
    sensorBeamsGroup.add(laserLine);

    // Laser Target Dot
    const laserDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff2222 })
    );
    laserDot.position.set(0, 0.35, 4.8);
    sensorBeamsGroup.add(laserDot);

    // 4 Concentric Distance Echo Radar Rings along beam
    const distanceEchoRings: THREE.Mesh[] = [];
    for (let r = 0; r < 4; r++) {
      const echoRing = new THREE.Mesh(
        new THREE.RingGeometry(0.08, 0.13, 28),
        new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
      );
      echoRing.userData = { offsetZ: r * 1.15 };
      sensorBeamsGroup.add(echoRing);
      distanceEchoRings.push(echoRing);
    }

    // 5.2 Camera 120° Wide FOV Frustum Projection Wireframe
    const fovMat = new THREE.LineBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.45 });
    const fovGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.15, 0.38), new THREE.Vector3(-2.2, 2.8, 4.2),
      new THREE.Vector3(0, 1.15, 0.38), new THREE.Vector3(2.2, 2.8, 4.2),
      new THREE.Vector3(0, 1.15, 0.38), new THREE.Vector3(-2.2, -0.5, 4.2),
      new THREE.Vector3(0, 1.15, 0.38), new THREE.Vector3(2.2, -0.5, 4.2),
      // Outer rectangular framing
      new THREE.Vector3(-2.2, 2.8, 4.2), new THREE.Vector3(2.2, 2.8, 4.2),
      new THREE.Vector3(2.2, 2.8, 4.2), new THREE.Vector3(2.2, -0.5, 4.2),
      new THREE.Vector3(2.2, -0.5, 4.2), new THREE.Vector3(-2.2, -0.5, 4.2),
      new THREE.Vector3(-2.2, -0.5, 4.2), new THREE.Vector3(-2.2, 2.8, 4.2)
    ]);
    const fovWireframe = new THREE.LineSegments(fovGeom, fovMat);
    sensorBeamsGroup.add(fovWireframe);

    // ==========================================
    // 6. INTERACTIVE 360° DRAG ORBIT
    // ==========================================
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMousePos.x;
      const dy = e.clientY - prevMousePos.y;
      dragVelocity = { x: dx * 0.005, y: dy * 0.005 };

      animStateRef.current.rotY += dx * 0.006;
      animStateRef.current.rotX += dy * 0.006;
      animStateRef.current.rotX = Math.max(-0.65, Math.min(0.65, animStateRef.current.rotX));

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // ==========================================
    // 7. RENDER & ANIME.JS UPDATE LOOP
    // ==========================================
    let animId: number;
    const clock = new THREE.Clock();

    const animateLoop = () => {
      animId = requestAnimationFrame(animateLoop);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Continuous slow cinematic orbit
      if (autoRotate && !isDragging) {
        animStateRef.current.rotY += 0.0045;
      }

      // Smooth inertia damping
      if (!isDragging) {
        dragVelocity.x *= 0.92;
        dragVelocity.y *= 0.92;
        animStateRef.current.rotY += dragVelocity.x;
        animStateRef.current.rotX += dragVelocity.y;
      }

      // Apply Rotations to 3D Device
      deviceRoot.rotation.y = THREE.MathUtils.lerp(deviceRoot.rotation.y, animStateRef.current.rotY, 0.08);
      deviceRoot.rotation.x = THREE.MathUtils.lerp(deviceRoot.rotation.x, animStateRef.current.rotX, 0.08);

      // Layer Explosion Z-offsets (Anime.js spring animated)
      frontGroup.position.z = animStateRef.current.frontZ;
      hatGroup.position.z = animStateRef.current.hatZ;
      piGroup.position.z = animStateRef.current.piZ;
      rearGroup.position.z = animStateRef.current.rearZ;

      // Moving Parts 1: Camera Lens Reticle Rotation & Optical Breathing
      reticleRing.rotation.z += 0.02;
      const camScale = 1.0 + 0.04 * Math.sin(time * 3.0);
      reticleRing.scale.set(camScale, camScale, 1);

      // Moving Parts 2: Active Pi 5 Cooling Fan Spin
      fanBladesGroup.rotation.z += 0.15;

      // Moving Parts 3: Amber Safety Halo Pulse
      amberNeonHaloMat.emissiveIntensity = 1.6 + 0.9 * Math.sin(time * 3.8);

      // Moving Parts 4: Hailo-8 NPU Neural Heartbeat
      npuHalo.scale.setScalar(1.0 + 0.08 * Math.sin(time * 6.5));

      // Moving Parts 5: Tactile SOS Button Depress
      plungerGroup.position.z = 0.12 - animStateRef.current.buttonDepress;

      // Moving Parts 6: Sonar Wavefront Emitters (HC-SR04 40kHz pulses)
      sonarWaveGroups.forEach((wg) => {
        wg.children.forEach((child) => {
          const mesh = child as THREE.Mesh;
          const phase = (mesh.userData.phase + time * 0.9) % 1.0;
          mesh.scale.setScalar(0.4 + phase * 2.2);
          const mat = mesh.material as THREE.MeshBasicMaterial;
          mat.opacity = (1.0 - phase) * 0.75;
        });
      });

      // Moving Parts 7: TF-Luna LiDAR Sweeping Laser Beam & Echo Rings
      sensorBeamsGroup.visible = beamsActive && animStateRef.current.frontZ < 0.35;
      if (beamsActive) {
        // Laser sweep oscillation
        const sweepX = 0.45 * Math.sin(time * 4.2);
        laserDot.position.x = sweepX;
        laserLine.geometry.attributes.position.setXYZ(1, sweepX, 0.35, 4.8);
        laserLine.geometry.attributes.position.needsUpdate = true;

        // Propagate distance echo rings along beam
        distanceEchoRings.forEach((ring) => {
          const zProgress = (ring.userData.offsetZ + time * 1.8) % 4.5;
          ring.position.set((sweepX * zProgress) / 4.8, 0.35, zProgress + 0.3);
          const scale = 0.5 + zProgress * 0.5;
          ring.scale.set(scale, scale, 1);
          const mat = ring.material as THREE.MeshBasicMaterial;
          mat.opacity = Math.max(0, 1.0 - zProgress / 4.5);
        });
      }

      renderer.render(scene, camera);
    };

    animateLoop();

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
  }, [beamsActive, autoRotate]);

  return (
    <div className="relative w-full h-[640px] rounded-3xl bg-gradient-to-b from-white via-zinc-50 to-zinc-100 dark:from-[#1b1715]/90 dark:via-[#151210]/95 dark:to-[#0f0d0c] border border-black/10 dark:border-white/10 overflow-hidden select-none shadow-2xl dark:shadow-[0_24px_60px_rgba(0,0,0,0.8)] transition-all">
      {/* Precision Engineering Cyber-Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Header Engineering HUD Controls (Anime.js Style) */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2.5 z-20 pointer-events-none">
        {/* Left Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Spring Explode Assembly Toggle */}
          <button
            onClick={() => setExploded(!exploded)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 border shadow-lg ${
              exploded
                ? 'bg-[#FF5500] dark:bg-[#FF9E8C] text-white dark:text-[#1A1614] border-[#FF5500] dark:border-[#FF9E8C] font-bold ring-2 ring-[#FF5500]/30'
                : 'bg-white/80 dark:bg-black/60 backdrop-blur-md border-black/15 dark:border-white/15 text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white hover:border-[#FF5500]/50'
            }`}
            aria-label="Toggle Exploded Assembly"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{exploded ? 'Collapse Unit' : 'Explode Assembly'}</span>
          </button>

          {/* Active Sensor Beams Toggle */}
          <button
            onClick={() => setBeamsActive(!beamsActive)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 border shadow-md backdrop-blur-md ${
              beamsActive
                ? 'bg-[#0088CC]/10 dark:bg-[#30D158]/15 border-[#0088CC]/40 dark:border-[#30D158]/40 text-[#0088CC] dark:text-[#30D158] font-semibold'
                : 'bg-white/70 dark:bg-black/50 border-black/10 dark:border-white/10 text-zinc-500 dark:text-zinc-400'
            }`}
            aria-label="Toggle Active Sensor Rays"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{beamsActive ? 'Active Beams' : 'Beams Muted'}</span>
          </button>

          {/* Orbit Rotation Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 border shadow-md backdrop-blur-md ${
              autoRotate
                ? 'bg-white/80 dark:bg-black/60 border-black/15 dark:border-white/20 text-zinc-900 dark:text-white font-medium'
                : 'bg-white/60 dark:bg-black/40 border-black/10 dark:border-white/10 text-zinc-400 dark:text-zinc-500'
            }`}
            aria-label="Toggle Orbit Rotation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin [animation-duration:8s]' : ''}`} />
            <span>{autoRotate ? 'Orbiting' : 'Paused'}</span>
          </button>

          {/* Interactive Tactile SOS Test Trigger */}
          <button
            onClick={handleButtonPress}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 border shadow-md backdrop-blur-md bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/20 active:scale-95"
            aria-label="Test Tactile SOS Button Click"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Test SOS Plunger</span>
          </button>
        </div>

        {/* Live 3D Architecture Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-[11px] font-mono text-zinc-600 dark:text-zinc-300">
          <Box className="w-3.5 h-3.5 text-[#00B368] dark:text-[#30D158]" />
          <span>TRUE 3D CAD ASSEMBLY</span>
        </div>
      </div>

      {/* Floating Animated Telemetry Hotspot Card (Shown when a component is selected) */}
      {activeHotspot && (
        <div className="absolute top-16 right-4 sm:right-6 w-[340px] max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-[#1E1917]/95 backdrop-blur-2xl border border-[#FF5500]/40 dark:border-[#FF9E8C]/40 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] text-left z-30 transition-all duration-300 animate-in fade-in zoom-in-95">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              {/* HD Component Thumbnail Preview */}
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-black/40 border border-black/10 dark:border-white/10 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-inner">
                <img
                  src={activeHotspot.image}
                  alt={activeHotspot.name}
                  className="w-full h-full object-contain filter drop-shadow-md hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#FF5500] dark:text-[#FF9E8C] tracking-widest font-semibold block">
                  {activeHotspot.category}
                </span>
                <h4 className="text-sm font-bold text-zinc-950 dark:text-white tracking-tight leading-snug">
                  {activeHotspot.name}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="w-6 h-6 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 text-zinc-500 hover:text-black dark:hover:text-white transition-colors text-xs font-mono"
              aria-label="Close component details"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
            {activeHotspot.role}
          </p>

          {/* Technical Specs Grid */}
          <div className="space-y-2 pt-3 border-t border-black/10 dark:border-white/10 text-[11px] font-mono">
            <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
              <span>Hardware Bus:</span>
              <span className="text-zinc-900 dark:text-white font-medium">{activeHotspot.bus}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
              <span>Performance:</span>
              <span className="text-[#00B368] dark:text-[#30D158] font-semibold">{activeHotspot.spec}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-black/5 dark:border-white/5">
              <span className="text-zinc-500 dark:text-zinc-400">Telemetry Status:</span>
              <span className="px-2 py-0.5 rounded-full bg-[#00B368]/15 dark:bg-[#30D158]/15 text-[#00B368] dark:text-[#30D158] font-bold">
                {activeHotspot.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Telemetry Component Selector Bar with HD Thumbnails */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/85 dark:bg-[#181412]/85 backdrop-blur-xl p-2.5 rounded-2xl border border-black/10 dark:border-white/10 z-20 shadow-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-0.5 scrollbar-none">
          <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 mr-2 flex items-center gap-1 tracking-widest shrink-0">
            <Zap className="w-3.5 h-3.5 text-[#FF5500] dark:text-[#FF9E8C]" /> 3D PARTS:
          </span>
          {HOTSPOTS.map((spot) => {
            const isSelected = activeHotspot?.id === spot.id;
            return (
              <button
                key={spot.id}
                onClick={() => setActiveHotspot(isSelected ? null : spot)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 whitespace-nowrap border shrink-0 ${
                  isSelected
                    ? 'bg-zinc-950 dark:bg-white text-white dark:text-black font-bold shadow-lg scale-105 border-transparent'
                    : 'bg-black/[0.03] dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border-black/5 dark:border-white/5'
                }`}
              >
                <div className="w-4 h-4 rounded-md overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
                  <img src={spot.image} alt={spot.shortName} className="w-full h-full object-contain" />
                </div>
                <span>{spot.shortName}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest hidden lg:flex items-center gap-2 shrink-0">
          <Crosshair className="w-3 h-3 text-[#FF5500] dark:text-[#FF9E8C]" />
          <span>[ 360° Drag Orbit · Select Part to Inspect ]</span>
        </div>
      </div>
    </div>
  );
};
