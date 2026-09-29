import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, Eye, Radio } from 'lucide-react';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-32 bg-[#F8F9FA] dark:bg-[#1A1614] border-t border-black/10 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      {/* Laser peach subtle radial ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#FF5500]/10 dark:bg-[#FF9E8C]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Blueprint grid */}
      <div className="absolute inset-0 antimetal-grid opacity-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        {/* Antimetal Technical Eyebrow Badge */}
        <div className="flex justify-center">
          <TechnicalBadge number="14" label="Air-Gapped Assistive Hardware" color="orange" />
        </div>

        {/* Big Manifesto Headline */}
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-zinc-950 dark:text-white tracking-[-0.03em] leading-[1.05] max-w-4xl mx-auto">
          The goal isn't to replace vision.<br />
          <span className="text-[#FF5500] dark:text-[#FF9E8C]">
            It's to add another layer of awareness.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-[#C8BDB6] max-w-2xl mx-auto leading-relaxed font-normal">
          BeepVision combines Raspberry Pi 5, Hailo-8 26 TOPS AI, TF-Luna LiDAR, and multi-sensor fusion
          into an open-ear, air-gapped wearable designed to protect user dignity and physical autonomy.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#sensors"
            className="group flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#FF5500] hover:bg-[#FF6611] dark:bg-[#FF9E8C] dark:hover:bg-[#FFAF9F] text-white dark:text-[#1A1614] font-semibold text-sm transition-all shadow-md dark:shadow-[0_0_24px_rgba(255,158,140,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Inspect Sensor Fusion</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href="#pricing"
            className="px-8 py-3.5 rounded-full bg-white dark:bg-[#251E1C]/65 dark:backdrop-blur-md hover:bg-zinc-50 dark:hover:bg-[#251E1C]/90 text-zinc-950 dark:text-white font-medium text-sm border border-black/10 dark:border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            View Cost Breakdown
          </a>
        </div>

        {/* Credibility Footer Micro-strip with Reticles */}
        <div className="relative pt-10 mt-6 border-t border-black/10 dark:border-white/10 max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#251E1C]/60 dark:backdrop-blur-md border border-black/10 dark:border-white/8 shadow-sm">
              <div className="text-xs font-mono text-[#FF5500] dark:text-[#FF9E8C] font-semibold">26 TOPS NPU</div>
              <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">Hailo-8 M.2 Module</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#251E1C]/60 dark:backdrop-blur-md border border-black/10 dark:border-white/8 shadow-sm">
              <div className="text-xs font-mono text-[#059669] dark:text-[#30D158] font-semibold">100% OFFLINE</div>
              <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">Zero Cloud Tether</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#251E1C]/60 dark:backdrop-blur-md border border-black/10 dark:border-white/8 shadow-sm">
              <div className="text-xs font-mono text-[#0284C7] dark:text-[#70D6FF] font-semibold">IP65 SEALED</div>
              <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">All-Weather Enclosure</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#251E1C]/60 dark:backdrop-blur-md border border-black/10 dark:border-white/8 shadow-sm">
              <div className="text-xs font-mono text-amber-600 dark:text-[#FF9E8C] font-semibold">OPEN-EAR</div>
              <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">Bone Conduction Audio</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
