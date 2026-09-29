import React, { useState } from 'react';
import { Eye, BookOpen, Compass, Mic, Radio, ShieldAlert, WifiOff, Users, ArrowRight } from 'lucide-react';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';

export const Capabilities: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<number>(0);

  const features = [
    {
      id: 'obstacles',
      icon: Eye,
      title: "Real-Time Obstacle Call-Out",
      badge: "Core Vision",
      shortDesc: "Classifies and tracks pedestrians, vehicles, poles, stairs, doors, and curbs at 30+ FPS.",
      model: "YOLOv8n on Hailo-8 NPU",
      sampleCue: "\"Car, left, close!\" or \"Pole ahead, 3 meters\"",
      details:
        "Trained on COCO and fine-tuned on custom sidewalk obstacle datasets (curbs, potholes, open truck beds, low-hanging branches). Objects must persist across 3+ consecutive frames before triggering an alert."
    },
    {
      id: 'ocr',
      icon: BookOpen,
      title: "Read The World (OCR)",
      badge: "Optical Text",
      shortDesc: "Translates street signs, medication labels, packaging, menus, and paper currency into speech.",
      model: "PaddleOCR + Piper Neural TTS",
      sampleCue: "\"Reading sign: Pharmacy. Hours 9 AM to 9 PM.\"",
      details:
        "Runs on-demand when the user asks \"Read this\" or points the camera toward printed text. Lightweight PaddleOCR extracts character glyphs in ~180ms, read aloud through bone conduction."
    },
    {
      id: 'spatial',
      icon: Compass,
      title: "3D Spatial Understanding",
      badge: "Depth & Vectors",
      shortDesc: "Fuses distance, lateral direction, and closing velocity to construct a live 3D awareness map.",
      model: "MiDaS Monocular Depth + TF-Luna LiDAR",
      sampleCue: "\"Vehicle closing fast at 1.2m on left\"",
      details:
        "Rather than flat bounding boxes, BeepVision calculates vector closing speed. A stationary car at 4 meters is ignored, while a bicycle approaching at 4 m/s triggers immediate priority escalation."
    },
    {
      id: 'voice',
      icon: Mic,
      title: "Natural Voice Q&A",
      badge: "Offline Speech",
      shortDesc: "Ask spoken questions without taking your phone out of your pocket or pressing tiny buttons.",
      model: "Vosk Offline Speech Recognizer",
      sampleCue: "\"What is in front of me?\" → \"Person 2m ahead, door slightly right\"",
      details:
        "Uses a lightweight offline Vosk model running on Raspberry Pi 5. Audio never leaves the unit. Answers are summarized concisely to avoid unnecessary chatter."
    },
    {
      id: 'haptics',
      icon: Radio,
      title: "4-Zone Directional Haptics",
      badge: "Tactile Audio",
      shortDesc: "Silent, tactile vibration pulses across Left, Right, Chest Upper, and Chest Lower harness zones.",
      model: "GPIO Transistor Haptic Matrix",
      sampleCue: "Gentle pulse on right; urgent rapid buzz on left",
      details:
        "Essential in roaring subway stations, loud construction zones, or quiet environments where spoken voice alerts would be disruptive. Intuitive directional mapping."
    },
    {
      id: 'fall',
      icon: ShieldAlert,
      title: "Fall Detection & Automatic SOS",
      badge: "Emergency Kinematics",
      shortDesc: "Continuous IMU telemetry detects violent impact spikes followed by lack of movement.",
      model: "6-DOF IMU Kinematic Filter + NEO-6M GPS",
      sampleCue: "\"Fall detected. Emergency countdown initiated: 15 seconds.\"",
      details:
        "Sudden acceleration spike (>3.5G) followed by 5 seconds of torso stillness activates an audible 15-second cancellation window before auto-dispatching GPS coordinates to designated emergency contacts."
    },
    {
      id: 'offline',
      icon: WifiOff,
      title: "100% Offline Resilience",
      badge: "Air-Gapped",
      shortDesc: "Full perception stack runs on-board. Zero cloud dependencies, zero data costs.",
      model: "On-Device Linux Bookworm + HailoRT",
      sampleCue: "Full awareness inside tunnels, elevators, and basements",
      details:
        "Cloud-based vision tools fail when network reception drops. BeepVision was engineered from day one as an air-gapped, standalone safety companion."
    },
    {
      id: 'faces',
      icon: Users,
      title: "Known Companion Recognition",
      badge: "Optional / Consent-Based",
      shortDesc: "Identifies enrolled family members, guides, and colleagues with strict privacy controls.",
      model: "InsightFace (Vector Embeddings Only)",
      sampleCue: "\"Sarah is approaching on the right\"",
      details:
        "Strictly optional and consent-driven. Stores encrypted 512-dimension mathematical embeddings rather than photographic images. No external facial databases are ever queried."
    }
  ];

  const current = features[selectedFeature];

  return (
    <section id="capabilities" className="scroll-mt-28 py-24 bg-[#F8F9FA] dark:bg-[#030406] border-t border-dashed border-black/10 dark:border-white/10 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left mb-16 space-y-4">
          <TechnicalBadge number="05" label="MODULAR ASSISTIVE CAPABILITIES" color="cyan" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-zinc-950 dark:text-white tracking-[-0.03em] leading-[1.05]">
            BUILT FOR THE COMPLEXITY<br />
            <span className="text-[#0284C7] dark:text-[#00D2FF]">OF MODERN CITIES.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
            BeepVision goes far beyond obstacle detection. From reading medication instructions to detecting sudden falls,
            every capability runs on-device with zero latency and zero data leakage.
          </p>
        </div>

        {/* 2-Column Capability Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Capability Selector Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              const isSelected = selectedFeature === i;
              return (
                <button
                  key={feat.id}
                  onClick={() => setSelectedFeature(i)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all border flex items-center justify-between group relative ${
                    isSelected
                      ? 'bg-white dark:bg-white/[0.06] border-[#0284C7] dark:border-[#00D2FF]/60 shadow-md dark:shadow-[0_0_20px_rgba(0,210,255,0.15)] text-zinc-950 dark:text-white'
                      : 'bg-white/70 dark:bg-[#06080D] border-black/10 dark:border-white/5 hover:border-black/20 dark:hover:border-white/15 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#0284C7] dark:bg-[#00D2FF] text-white dark:text-black font-bold' : 'bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#0284C7] dark:text-[#00D2FF] block">
                        {feat.badge}
                      </span>
                      <h4 className="text-xs font-semibold tracking-tight">{feat.title}</h4>
                    </div>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-[#0284C7] dark:text-[#00D2FF] translate-x-1' : 'opacity-0'}`} />
                </button>
              );
            })}
          </div>

          {/* Right: Feature Deep Dive Card */}
          <div className="lg:col-span-7 bg-white dark:bg-[#06080D] border border-dashed border-black/10 dark:border-white/15 rounded-2xl p-6 sm:p-8 text-left space-y-6 relative shadow-lg dark:shadow-2xl transition-colors">
            <ReticleCorner size={10} className="text-[#0284C7] dark:text-[#00D2FF]" />

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#0284C7] dark:text-[#00D2FF]">
                  CAPABILITY 0{selectedFeature + 1} SPECIFICATION
                </span>
                <h3 className="text-2xl font-semibold text-zinc-950 dark:text-white tracking-tight mt-1">{current.title}</h3>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300">
                {current.model}
              </span>
            </div>

            <p className="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed font-normal">{current.shortDesc}</p>

            <div className="p-4 rounded-xl bg-[#0284C7]/10 dark:bg-[#00D2FF]/10 border border-[#0284C7]/20 dark:border-[#00D2FF]/20 space-y-1">
              <span className="text-[10px] font-mono text-[#0284C7] dark:text-[#00D2FF] uppercase tracking-wider block font-semibold">
                Simulated User Audio Cue
              </span>
              <p className="text-sm font-mono text-zinc-950 dark:text-white font-medium">{current.sampleCue}</p>
            </div>

            <div className="p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block font-semibold">
                Technical Execution Details
              </span>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">{current.details}</p>
            </div>

            <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <span>Silicon Engine:</span>
              <span className="text-[#059669] dark:text-[#00F5A0] font-semibold">Hailo-8 NPU + BCM2712 Quad-Core</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
