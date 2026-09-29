import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, Zap, WifiOff } from 'lucide-react';
import { Device3D } from './Device3D';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] pt-20 pb-12 flex flex-col justify-between overflow-hidden antimetal-grid">
      {/* Subtle Laser Accent Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#FF5500]/[0.05] dark:bg-[#FF7733]/[0.08] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center relative z-10">
        
        {/* Eyebrow Status Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <TechnicalBadge number="01" label="ON-DEVICE EDGE NEURAL CORE" color="orange" />
          <TechnicalBadge label="HAILO-8 26 TOPS NPU" color="emerald" />
          <TechnicalBadge label="ZERO CLOUD DEPENDENCY" color="cyan" />
        </div>

        {/* 2-Column Hardware Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Manifesto & Engineering Intent */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-semibold tracking-[-0.04em] text-zinc-950 dark:text-white leading-[1.02]">
              SEE MORE.<br />
              <span className="text-zinc-500 dark:text-zinc-400">MOVE WITH</span><br />
              <span className="text-[#FF5500] dark:text-[#FF7733]">CONFIDENCE.</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 font-normal leading-relaxed max-w-[50ch]">
              BeepVision is an on-device AI assistive wearable that fuses high-speed camera vision,
              solid-state LiDAR, and peripheral ultrasound into an intuitive sensory awareness layer.
              Built for real-world navigation.
            </p>

            {/* Single CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#problem"
                className="relative group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-black font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200 hover:bg-[#FF5500] dark:hover:bg-[#FF7733] hover:text-white dark:hover:text-black shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>EXPLORE ARCHITECTURE</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Safety Framing Note */}
            <div className="pt-2 flex items-center gap-3 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B368] dark:bg-[#00F5A0] shadow-[0_0_6px_#00B368] dark:shadow-[0_0_6px_#00F5A0]" />
              <span>Supplements white cane technique & Orientation and Mobility training</span>
            </div>
          </div>

          {/* Right Column: 3D Hardware Model */}
          <div className="lg:col-span-6 w-full relative">
            <Device3D />
          </div>
        </div>
      </div>

      {/* Technical Summary Bar at Bottom of Hero */}
      <div className="mt-10 border-y border-dashed border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#06070B]/80 backdrop-blur-md relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            
            {/* Metric 1 */}
            <div className="space-y-1 relative pr-4">
              <div className="text-2xl font-bold font-mono text-zinc-950 dark:text-white flex items-center gap-2">
                <span>26 TOPS</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FF5500]/15 dark:bg-[#FF7733]/15 text-[#FF5500] dark:text-[#FF7733] border border-[#FF5500]/30 dark:border-[#FF7733]/30 font-mono">PCIe Gen3</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider">Hailo-8 M.2 AI HAT</p>
            </div>

            {/* Metric 2 */}
            <div className="space-y-1 relative pr-4">
              <div className="text-2xl font-bold font-mono text-[#00B368] dark:text-[#00F5A0] flex items-center gap-2">
                <span>&lt; 15 ms</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#00B368]/15 dark:bg-[#00F5A0]/15 text-[#00B368] dark:text-[#00F5A0] border border-[#00B368]/30 dark:border-[#00F5A0]/30 font-mono">Deterministic</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider">Edge Inference Latency</p>
            </div>

            {/* Metric 3 */}
            <div className="space-y-1 relative pr-4">
              <div className="text-2xl font-bold font-mono text-zinc-950 dark:text-white flex items-center gap-2">
                <span>100%</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-600/15 dark:bg-cyan-400/15 text-cyan-600 dark:text-cyan-400 border border-cyan-600/30 dark:border-cyan-400/30 font-mono">Offline</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider">Zero Cloud Dependency</p>
            </div>

            {/* Metric 4 */}
            <div className="space-y-1 relative">
              <div className="text-2xl font-bold font-mono text-zinc-950 dark:text-white flex items-center gap-2">
                <span>0.2 - 12 m</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 border border-black/10 dark:border-white/20 font-mono">Collimated</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider">Solid-State LiDAR Range</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
