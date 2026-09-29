import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, Zap, WifiOff } from 'lucide-react';
import { Device3D } from './Device3D';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';
import { FlippingWordSwap } from './ui/FlippingWordSwap';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] pt-20 pb-12 flex flex-col justify-between overflow-hidden antimetal-grid">
      {/* Subtle Laser Accent Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#FF5500]/[0.05] dark:bg-[#FF7733]/[0.08] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center relative z-10">
        
        {/* Eyebrow Status Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <TechnicalBadge label="On-Device Neural Core" color="orange" />
          <TechnicalBadge label="Hailo-8 26 TOPS NPU" color="emerald" />
          <TechnicalBadge label="100% Private & Air-Gapped" color="cyan" />
        </div>

        {/* 2-Column Hardware Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Manifesto & Engineering Intent */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-white leading-[1.05]">
              See more.<br />
              <span className="text-zinc-500 dark:text-zinc-400">Move with </span><br className="sm:hidden" />
              <FlippingWordSwap
                word1="confidence."
                word2="BeepVision."
                autoInterval={5000}
                duration={420}
                stagger={38}
                className="text-[#FF5500] dark:text-[#FF9E8C]"
                toClassName="text-[#00B368] dark:text-[#30D158]"
              />
            </h1>

            <p className="text-base sm:text-lg text-zinc-700 dark:text-[#D6CBC5] font-normal leading-relaxed max-w-[50ch]">
              BeepVision is an on-device AI assistive wearable that fuses high-speed camera vision,
              solid-state LiDAR, and peripheral ultrasound into an intuitive sensory awareness layer.
              Built for real-world navigation.
            </p>

            {/* Single CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#problem"
                className="relative group inline-flex items-center justify-center gap-2.5 min-h-[48px] px-7 py-3 rounded-full bg-zinc-950 dark:bg-[#FF9E8C] text-white dark:text-[#1A1614] text-sm font-semibold tracking-wide transition-all duration-200 hover:bg-[#FF5500] dark:hover:bg-[#FFAF9F] shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Architecture</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Safety Framing Note */}
            <div className="pt-2 flex items-center gap-2.5 text-xs text-zinc-600 dark:text-[#A7F3BE] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#00B368] dark:bg-[#30D158] dark:shadow-[0_0_8px_#30D158] shrink-0" />
              <span>Supplements white cane mobility and O&amp;M orientation training</span>
            </div>
          </div>

          {/* Right Column: 3D Hardware Model with Apple Dark Glass Frame */}
          <div className="lg:col-span-6 w-full relative dark:bg-[#251E1C]/65 dark:backdrop-blur-2xl dark:border dark:border-white/10 dark:rounded-3xl dark:p-3 dark:shadow-[0_16px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]">
            <Device3D />
          </div>
        </div>
      </div>

      {/* Technical Summary Bar at Bottom of Hero */}
      <div className="mt-10 border-y border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#1A1614]/85 dark:backdrop-blur-xl relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            
            {/* Metric 1 */}
            <div className="space-y-1.5 relative pr-4">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
                <span>26 TOPS</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FF5500]/15 dark:bg-[#FF9E8C]/15 text-[#FF5500] dark:text-[#FF9E8C] font-medium border border-transparent dark:border-[#FF9E8C]/25">PCIe Gen3</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-[#C8BDB6] font-medium">Hailo-8 M.2 AI HAT</p>
            </div>

            {/* Metric 2 */}
            <div className="space-y-1.5 relative pr-4">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#00B368] dark:text-[#30D158] flex items-center gap-2">
                <span>&lt; 15 ms</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#00B368]/15 dark:bg-[#30D158]/15 text-[#00B368] dark:text-[#30D158] font-medium border border-transparent dark:border-[#30D158]/25">Deterministic</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-[#C8BDB6] font-medium">Edge Inference Latency</p>
            </div>

            {/* Metric 3 */}
            <div className="space-y-1.5 relative pr-4">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
                <span>100%</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-600/15 dark:bg-[#30D158]/15 text-cyan-700 dark:text-[#30D158] font-medium border border-transparent dark:border-[#30D158]/25">Offline</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-[#C8BDB6] font-medium">Zero Cloud Dependency</p>
            </div>

            {/* Metric 4 */}
            <div className="space-y-1.5 relative">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
                <span>0.2 - 12 m</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-[#FF9E8C]/15 text-zinc-700 dark:text-[#FF9E8C] font-medium border border-transparent dark:border-[#FF9E8C]/25">Collimated</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-[#C8BDB6] font-medium">Solid-State LiDAR Range</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
