export interface ComponentCost {
  component: string;
  purpose: string;
  priceINR: string;
  minPrice: number;
  maxPrice: number;
  category: 'compute' | 'optics' | 'ranging' | 'audio' | 'power' | 'enclosure' | 'storage';
  connection: string;
  role: string;
}

export const HARDWARE_COMPONENTS: ComponentCost[] = [
  {
    component: "Raspberry Pi 5 (8GB)",
    purpose: "Main compute brain, runs 64-bit OS and orchestrates all sensors",
    priceINR: "₹8,500 – ₹9,500",
    minPrice: 8500,
    maxPrice: 9500,
    category: "compute",
    connection: "Central Hub / Host",
    role: "Coordinates input sensor loops, runs fusion & alert priority engine, drives outputs"
  },
  {
    component: "Raspberry Pi AI HAT+ (Hailo-8)",
    purpose: "Dedicated 26 TOPS AI NPU accelerator for real-time edge vision inference",
    priceINR: "₹11,000 – ₹13,000",
    minPrice: 11000,
    maxPrice: 13000,
    category: "compute",
    connection: "PCIe Gen 3 (stacks on Pi 5)",
    role: "Executes YOLOv8 object detection, MiDaS monocular depth, and OCR locally at high FPS"
  },
  {
    component: "Raspberry Pi Camera Module 3",
    purpose: "Primary wide-angle vision input, low-light optimized with autofocus",
    priceINR: "₹2,500 – ₹3,500",
    minPrice: 2500,
    maxPrice: 3500,
    category: "optics",
    connection: "CSI camera port (ribbon cable)",
    role: "Feeds raw video frames continuously (~30 FPS) directly to Hailo NPU"
  },
  {
    component: "TF-Luna LiDAR Module",
    purpose: "Accurate short-range continuous distance sensing (0.2m – 8.0m)",
    priceINR: "₹2,200 – ₹3,000",
    minPrice: 2200,
    maxPrice: 3000,
    category: "ranging",
    connection: "UART / Serial (TX/RX pins)",
    role: "Streams millimeter-accurate distance readings to cross-verify camera depth"
  },
  {
    component: "HC-SR04 Ultrasonic Sensors (x4)",
    purpose: "Peripheral backup sensing for glass and thin obstacles LiDAR may miss",
    priceINR: "₹400 – ₹600",
    minPrice: 400,
    maxPrice: 600,
    category: "ranging",
    connection: "GPIO pins (trigger + echo)",
    role: "Placed at 4 chest-height corners to catch obstacles in lateral blind spots"
  },
  {
    component: "MPU6050 6-DOF IMU",
    purpose: "Detects falls, impacts, tilts, and torso/head orientation",
    priceINR: "₹150 – ₹300",
    minPrice: 150,
    maxPrice: 300,
    category: "ranging",
    connection: "I2C bus",
    role: "Monitors torso pitch to adjust ground-plane filtering and triggers fall SOS"
  },
  {
    component: "NEO-6M GPS Module",
    purpose: "Outdoor location tracking and emergency geolocation",
    priceINR: "₹450 – ₹700",
    minPrice: 450,
    maxPrice: 700,
    category: "ranging",
    connection: "UART",
    role: "Provides live latitude and longitude for emergency distress dispatch"
  },
  {
    component: "Bone-Conduction Audio Headset",
    purpose: "Audio feedback without blocking ear canals (critical for blind users)",
    priceINR: "₹1,500 – ₹3,500",
    minPrice: 1500,
    maxPrice: 3500,
    category: "audio",
    connection: "USB / I2S audio interface",
    role: "Transmits spoken voice alerts directly through skull bone, leaving ears open"
  },
  {
    component: "MEMS Microphone Module",
    purpose: "Voice command input for offline questions and queries",
    priceINR: "₹150 – ₹400",
    minPrice: 150,
    maxPrice: 400,
    category: "audio",
    connection: "USB / I2S audio interface",
    role: "Captures user speech for offline Vosk speech recognition engine"
  },
  {
    component: "Vibration Motors (x4, Coin Type)",
    purpose: "Silent directional haptic cues (left, right, front, back)",
    priceINR: "₹160 – ₹320",
    minPrice: 160,
    maxPrice: 320,
    category: "audio",
    connection: "GPIO pins via transistor driver circuit",
    role: "Provides immediate spatial tactile warnings even in noisy street environments"
  },
  {
    component: "Li-ion Battery Pack (20,000mAh)",
    purpose: "All-day wearable power (6–8 hours active runtime, 5V/3A output)",
    priceINR: "₹1,200 – ₹2,500",
    minPrice: 1200,
    maxPrice: 2500,
    category: "power",
    connection: "USB-C (5V/5A) to Pi, power rails to sensors",
    role: "Housed in insulated rear pouch to protect capacity in cold conditions"
  },
  {
    component: "Chest Harness & Enclosure (3D Printed)",
    purpose: "Wearable sweat-resistant housing with IP65 silicone gasket",
    priceINR: "₹1,500 – ₹3,000",
    minPrice: 1500,
    maxPrice: 3000,
    category: "enclosure",
    connection: "Ergonomic torso mount with reflective piping",
    role: "Positions sensors securely at sternum height to avoid clothing occlusion"
  },
  {
    component: "High-Endurance MicroSD (128GB)",
    purpose: "OS, compiled Hailo models (.hef), and system telemetry storage",
    priceINR: "₹1,000 – ₹1,500",
    minPrice: 1000,
    maxPrice: 1500,
    category: "storage",
    connection: "MicroSD slot",
    role: "Holds Raspberry Pi OS Bookworm, compiled neural models, and offline dictionaries"
  },
  {
    component: "Tactile SOS / Mode Push Button",
    purpose: "Emergency trigger and system mode toggling",
    priceINR: "₹50 – ₹100",
    minPrice: 50,
    maxPrice: 100,
    category: "enclosure",
    connection: "GPIO digital input",
    role: "Raised, glove-friendly mechanical tactile button pulled high/low on press"
  },
  {
    component: "Wiring, Heat Sinks & Assembly Hardware",
    purpose: "Thermal dissipation, custom wiring harness, and internal fasteners",
    priceINR: "₹1,000 – ₹1,500",
    minPrice: 1000,
    maxPrice: 1500,
    category: "enclosure",
    connection: "Internal mechanical assembly",
    role: "Maintains passive thermal cooling under heavy NPU inference workloads"
  }
];

export const TOTAL_ESTIMATE_RANGE = "₹45,000 – ₹60,000";

export const SOFTWARE_STACK = [
  {
    layer: "Base OS",
    technology: "Raspberry Pi OS (64-bit, Bookworm)",
    role: "Underlying Linux kernel with official PCIe and Hailo NPU driver support"
  },
  {
    layer: "AI Compilation & Runtime",
    technology: "Hailo Dataflow Compiler + HailoRT",
    role: "Quantizes ONNX models into native .hef binaries for 26 TOPS execution"
  },
  {
    layer: "Object & Obstacle Vision",
    technology: "YOLOv8 (Hailo-optimized, nano/small)",
    role: "Detects pedestrians, cars, poles, stairs, curbs, and doors at 30+ FPS"
  },
  {
    layer: "Monocular Depth Estimation",
    technology: "MiDaS / Depth Anything (Lightweight)",
    role: "Generates 2D dense depth maps to complement narrow-beam LiDAR"
  },
  {
    layer: "Sensor Fusion Logic",
    technology: "Custom C++ / Python Engine",
    role: "Fuses LiDAR distance, ultrasonic echoes, and camera depth into a 3D obstacle map"
  },
  {
    layer: "Text & Sign Reading",
    technology: "PaddleOCR / Tesseract",
    role: "Extracts text from street signs, medication labels, menus, and paper currency"
  },
  {
    layer: "Natural Speech Synthesis",
    technology: "Piper TTS (Offline neural voice)",
    role: "Low-latency (<150ms), natural offline speech output to bone-conduction headset"
  },
  {
    layer: "Offline Voice Recognition",
    technology: "Vosk Speech Engine",
    role: "Listens for voice commands like 'What is in front of me?' and 'Read this'"
  },
  {
    layer: "Fall & Impact Detection",
    technology: "Custom IMU Kinematics Algorithm",
    role: "Monitors sudden acceleration spike + stillness to trigger automated GPS SOS"
  },
  {
    layer: "Face Recognition (Optional)",
    technology: "dlib / InsightFace (Consent-based)",
    role: "Stores vector embeddings only (no raw photos) to identify approved companions"
  }
];

export const ENVIRONMENTAL_CONDITIONS = [
  {
    condition: "Rain",
    icon: "CloudRain",
    behavior: "IP65 sealed silicone gasket and rubber port flaps keep water out. Camera features a protective overhang lip and hydrophobic lens coating. Because LiDAR laser pulses can scatter in rain, the fusion logic automatically re-weights ultrasonic readings, which remain unaffected by water droplets."
  },
  {
    condition: "Fog & Low Visibility",
    icon: "CloudFog",
    behavior: "Thick fog causes optical camera confidence to decline. The perception engine detects reduced visual contrast and dynamically shifts arbitration weighting toward LiDAR and ultrasonic sonar."
  },
  {
    condition: "Cold (-10°C to 0°C)",
    icon: "ThermometerSnowflake",
    behavior: "Lithium-ion batteries suffer capacity loss in sub-zero cold. BeepVision uses an insulated rear pouch to retain internal pack warmth and surfaces low-temperature threshold alerts early. Speaker arms are sealed against condensation."
  },
  {
    condition: "Heat & Direct Sunlight",
    icon: "Sun",
    behavior: "Camera utilizes high dynamic range auto-exposure to prevent white-out glare. The TF-Luna LiDAR window features anti-reflective, anti-fog coating. Enclosure employs a light matte finish to minimize chest heat absorption."
  },
  {
    condition: "Dust & Sand",
    icon: "Wind",
    behavior: "Full IP65 rating guarantees dust-tight operation. Ultrasonic transducer cones are protected behind acoustic fine mesh that permits 40kHz sound waves to pass while blocking sand and debris."
  },
  {
    condition: "Night & Darkness",
    icon: "Moon",
    behavior: "Integrated ambient light sensor automatically activates the front amber LED ring for passive pedestrian visibility to drivers. Camera low-light sensitivity activates with support for optional infrared backup."
  },
  {
    condition: "Wind Echo Interference",
    icon: "Activity",
    behavior: "Heavy outdoor wind can create echo turbulence on acoustic sensors. The software applies a moving-average smoothing filter across consecutive readings before triggering any alert."
  },
  {
    condition: "Gloves & Cold Hands",
    icon: "ShieldAlert",
    behavior: "The emergency SOS button is oversized and elevated with 2.5mm of mechanical travel, ensuring positive physical feedback even when operating with thick winter gloves."
  }
];

export const ROADMAP_PHASES = [
  {
    phase: "Phase 1",
    name: "Prototype & Bench Validation",
    status: "Current",
    details: "Functional hardware integration with Raspberry Pi 5, Hailo-8 AI HAT, TF-Luna LiDAR, 4 ultrasonic sensors, and bone conduction audio on 3D printed chest chassis."
  },
  {
    phase: "Phase 2",
    name: "Real-World Sidewalk Testing",
    status: "Planned",
    details: "Active road trials with visually impaired test participants and mobility instructors. Logging real sidewalk failure cases (curbs, potholes, low branches)."
  },
  {
    phase: "Phase 3",
    name: "Hailo Model Optimization",
    status: "Planned",
    details: "Fine-tuning YOLOv8 on sidewalk-specific obstacle datasets. Converting models to Hailo .hef format with INT8 quantization for maximum FPS and battery efficiency."
  },
  {
    phase: "Phase 4",
    name: "Hardware Ruggedization",
    status: "Proposed",
    details: "Injection-molded IP65 enclosure, 100+ hours continuous vibration and thermal stress testing, and custom PCB wiring consolidation."
  },
  {
    phase: "Phase 5",
    name: "Accessibility Organization Alliances",
    status: "Proposed",
    details: "Partnerships with NCPEDP, National Federation of the Blind, and orientation & mobility centers for clinical trials and certification."
  },
  {
    phase: "Phase 6",
    name: "Production & Subsidized Distribution",
    status: "Future",
    details: "Scaled manufacturing to reduce unit costs from ₹45k–60k prototype level down to subsidized consumer pricing via government grants and CSR initiatives."
  }
];
