import React, { useState } from 'react';
import { Radio, Eye, Layers, Bell, Volume2, ArrowRight } from 'lucide-react';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      phase: 'SENSE',
      timing: '0 – 3 ms',
      title: 'Continuous Sensory Ingestion',
      icon: Radio,
      color: 'text-[#00D2FF]',
      tag: '10–100 Hz Multi-modal Loop',
      desc: 'The wide-angle camera captures continuous video frames while the TF-Luna LiDAR and 4 corner ultrasonics poll distance in parallel. The MPU6050 IMU constantly measures torso angle and walking tilt.',
      tech: 'CSI-2 Camera + UART LiDAR + GPIO Sonar + I2C IMU',
      bullet: 'Gathers raw environmental data without burdening the main Pi CPU.'
    },
    {
      num: '02',
      phase: 'PERCEIVE',
      timing: '4 – 15 ms',
      title: 'On-Device NPU Neural Vision',
      icon: Eye,
      color: 'text-[#FF7733]',
      tag: 'Hailo-8 26 TOPS Acceleration',
      desc: 'Video frames stream directly into Hailo-8 buffers via PCIe. YOLOv8 scans for pedestrians, vehicles, poles, stairs, and doors, while Depth Anything generates continuous depth topology from the 2D frame.',
      tech: 'YOLOv8n + MiDaS Depth (Compiled .hef format)',
      bullet: 'Sub-15ms classification latency running fully offline.'
    },
    {
      num: '03',
      phase: 'FUSE',
      timing: '16 – 20 ms',
      title: 'Sensor Fusion Arbitration',
      icon: Layers,
      color: 'text-[#00F5A0]',
      tag: 'C++ / Python Safety Engine',
      desc: 'Camera-based depth is cross-checked against exact LiDAR physical distance readings. Ultrasonic sonar readings patch blind spots (such as glass partitions and transparent storefronts).',
      tech: 'RANSAC Ground-Plane Filter + 2-of-3 Sensor Voting',
      bullet: 'Translates disparate sensor streams into one unified 3D obstacle map.'
    },
    {
      num: '04',
      phase: 'PRIORITIZE',
      timing: '21 – 25 ms',
      title: 'Alert Priority Engine',
      icon: Bell,
      color: 'text-red-400',
      tag: 'Safety Urgency Formulation',
      desc: 'The system computes Urgency = f(distance, closing_speed, object_type). A car closing fast at 1.2 meters suppresses all static poles or distant pedestrians to eliminate sensory clutter.',
      tech: 'Hysteresis (3+ frames) + 85% Confidence Threshold',
      bullet: 'Ensures only the single most critical threat breaks through to the user.'
    },
    {
      num: '05',
      phase: 'RESPOND',
      timing: '26 – 30 ms',
      title: 'Dual-Channel Sensory Delivery',
      icon: Volume2,
      color: 'text-purple-400',
      tag: 'Bone Conduction + 4-Zone Haptics',
      desc: 'The alert fires across two synchronized channels: a spoken warning via open-ear bone-conduction audio ("Car, left, close!") and directional vibration pulsing on the corresponding chest motor.',
      tech: 'Piper Neural TTS + GPIO Transistor Haptic Matrix',
      bullet: 'Ear canals remain 100% open to hear traffic, horns, and ambient life.'
    }
  ];

  const current = steps[activeStep];
  const Icon = current.icon;

  return (
    <section id="how-it-works" className="scroll-mt-28 py-24 bg-[#F8F9FA] dark:bg-[#1A1614] border-t border-black/10 dark:border-white/10 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left mb-16 space-y-4">
          <TechnicalBadge number="08" label="30ms Closed-Loop Operating Cycle" color="cyan" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-zinc-950 dark:text-white tracking-[-0.03em] leading-[1.05]">
            How it works.<br />
            <span className="text-[#0284C7] dark:text-[#30D158]">From photons to haptics.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-[#C8BDB6] leading-relaxed font-normal">
            Every 30 milliseconds, BeepVision completes a full perception-to-action cycle:
            sensing raw physical energy, processing neural weights, fusing redundant sensors, and delivering clear guidance.
          </p>
        </div>

        {/* 5-Step Process Timeline (Componentry Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
          {steps.map((st, i) => {
            const StepIcon = st.icon;
            const isSelected = activeStep === i;
            return (
              <button
                key={st.num}
                onClick={() => setActiveStep(i)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between h-44 group relative ${
                  isSelected
                    ? 'bg-white dark:bg-[#3D1E1A]/40 dark:backdrop-blur-md border-black/20 dark:border-[#FF9E8C]/50 shadow-md dark:shadow-[0_4px_20px_rgba(255,158,140,0.15)] text-zinc-950 dark:text-white'
                    : 'bg-white/70 dark:bg-[#251E1C]/40 dark:backdrop-blur-md border-black/10 dark:border-white/5 hover:border-black/20 dark:hover:border-white/15 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                }`}
                aria-pressed={isSelected}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold font-mono text-zinc-400">{st.num}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-[#30D158]/10 border border-black/10 dark:border-[#30D158]/20 text-[#059669] dark:text-[#30D158] font-semibold">
                      {st.timing}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF5500] dark:text-[#FF9E8C] block font-semibold">
                    {st.phase}
                  </span>
                  <h4 className="text-xs font-semibold tracking-tight text-zinc-950 dark:text-white leading-snug">
                    {st.title}
                  </h4>
                </div>
                <StepIcon className={`w-4 h-4 ${isSelected ? st.color : 'text-zinc-400 dark:text-zinc-500'}`} />
              </button>
            );
          })}
        </div>

        {/* Detailed Active Step Showcase */}
        <div className="bg-white dark:bg-[#251E1C]/65 dark:backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-10 text-left relative shadow-lg dark:shadow-[0_12px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] space-y-6 transition-colors">
          <ReticleCorner size={10} className="text-[#0284C7] dark:text-[#30D158]" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center">
                <Icon className={`w-5 h-5 ${current.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#FF5500] dark:text-[#FF9E8C] uppercase tracking-widest font-semibold">
                    STEP {current.num} // {current.phase}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#059669]/10 dark:bg-[#30D158]/15 text-[#059669] dark:text-[#30D158] border border-[#059669]/30 dark:border-[#30D158]/30 font-semibold">
                    LATENCY: {current.timing}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-950 dark:text-white tracking-tight mt-0.5">
                  {current.title}
                </h3>
              </div>
            </div>

            <span className="text-xs font-mono text-zinc-600 dark:text-[#30D158] bg-black/5 dark:bg-[#30D158]/10 px-3 py-1.5 rounded-full border border-black/10 dark:border-[#30D158]/20 self-start sm:self-auto font-semibold">
              {current.tag}
            </span>
          </div>

          <p className="text-sm sm:text-base text-zinc-700 dark:text-[#C8BDB6] leading-relaxed font-normal">
            {current.desc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#F4F5F7] dark:bg-[#1A1614]/70 dark:backdrop-blur-md border border-black/10 dark:border-white/8 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                Hardware / Algorithm Interface
              </span>
              <span className="text-xs font-mono text-[#0284C7] dark:text-[#30D158] font-semibold">{current.tech}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F5F7] dark:bg-[#1A1614]/70 dark:backdrop-blur-md border border-black/10 dark:border-white/8 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                Safety Guarantee
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-300 font-normal">{current.bullet}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
