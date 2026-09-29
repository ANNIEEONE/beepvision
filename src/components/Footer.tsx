import React from 'react';
import { ArrowUp, ShieldCheck, Heart, Radio, Cpu, Eye } from 'lucide-react';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#F8F9FA] dark:bg-[#1A1614] border-t border-black/10 dark:border-white/10 text-zinc-600 dark:text-[#C8BDB6] text-xs font-mono py-16 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-black/10 dark:border-white/10">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500] dark:bg-[#FF9E8C] shadow-[0_0_10px_#FF9E8C]" />
              <span className="font-bold text-zinc-950 dark:text-white text-base tracking-tight font-sans">BeepVision</span>
              <span className="text-zinc-400 dark:text-zinc-600 font-mono">/</span>
              <span className="text-[11px] font-mono text-[#FF5500] dark:text-[#FF9E8C] uppercase tracking-wider font-semibold">Edge-Native Assistive Wearable</span>
            </div>
            <p className="text-zinc-600 dark:text-[#C8BDB6] text-xs font-sans max-w-lg leading-relaxed">
              On-device neural perception powered by Raspberry Pi 5 + Hailo-8 AI HAT (26 TOPS).
              Designed for real-world environmental mobility and sensory dignity.
            </p>
          </div>

          {/* Live System Status Pill */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#251E1C]/65 dark:backdrop-blur-md border border-black/10 dark:border-white/10 text-[11px] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#059669] dark:bg-[#30D158] animate-pulse" />
              <span className="text-zinc-500 dark:text-zinc-400">EDGE NPU:</span>
              <span className="text-zinc-950 dark:text-[#30D158] font-bold">26 TOPS ONLINE</span>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#251E1C]/65 dark:backdrop-blur-md hover:bg-zinc-50 dark:hover:bg-[#251E1C]/90 text-zinc-800 dark:text-zinc-300 transition-colors border border-black/10 dark:border-white/10 shadow-sm cursor-pointer"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#FF5500] dark:text-[#FF9E8C]" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

        {/* Navigation Grid (Componentry style) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
          <div className="space-y-2.5">
            <div className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-widest">Sensing & Optics</div>
            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <li><a href="#sensors" className="hover:text-[#FF5500] dark:hover:text-[#FF9E8C] transition-colors">Sensor Fusion Radar</a></li>
              <li><a href="#hardware" className="hover:text-[#FF5500] dark:hover:text-[#FF9E8C] transition-colors">TF-Luna LiDAR Module</a></li>
              <li><a href="#hardware" className="hover:text-[#FF5500] dark:hover:text-[#FF9E8C] transition-colors">HC-SR04 Ultrasonic Array</a></li>
              <li><a href="#hardware" className="hover:text-[#FF5500] dark:hover:text-[#FF9E8C] transition-colors">IMX219 Wide-Angle Camera</a></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-widest">Edge AI & Models</div>
            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <li><a href="#brain" className="hover:text-[#FF5500] dark:hover:text-[#FF9E8C] transition-colors">Hailo-8 26 TOPS NPU</a></li>
              <li><a href="#brain" className="hover:text-[#FF5500] dark:hover:text-[#FF9E8C] transition-colors">YOLOv8 Edge Object Detection</a></li>
              <li><a href="#brain" className="hover:text-[#FF5500] dark:hover:text-[#FF9E8C] transition-colors">MiDaS Monocular Depth</a></li>
              <li><a href="#capabilities" className="hover:text-[#FF5500] dark:hover:text-[#FF9E8C] transition-colors">PaddleOCR + Piper TTS</a></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-widest">Safety & Hardware</div>
            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <li><a href="#safety" className="hover:text-[#FF5500] dark:hover:text-[#FF9E8C] transition-colors">Supplementary Cane Philosophy</a></li>
              <li><a href="#weather" className="hover:text-[#FF5500] dark:hover:text-[#FF9E8C] transition-colors">IP65 Weather Resistance</a></li>
              <li><a href="#alert-engine" className="hover:text-[#FF5500] dark:hover:text-[#FF9E8C] transition-colors">Closing Velocity Engine</a></li>
              <li><a href="#safety" className="hover:text-[#FF5500] dark:hover:text-[#FF9E8C] transition-colors">6-DOF Fall Emergency SOS</a></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-widest">Commercialization</div>
            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <li><a href="#pricing" className="hover:text-[#FF5500] dark:hover:text-[#FF9E8C] transition-colors">Prototype BOM Breakdown</a></li>
              <li><a href="#roadmap" className="hover:text-[#FF5500] dark:hover:text-[#FF9E8C] transition-colors">Utility & Design Patents</a></li>
              <li><a href="#roadmap" className="hover:text-[#FF5500] dark:hover:text-[#FF9E8C] transition-colors">BIRAC & NCPEDP Grants</a></li>
              <li><a href="#day-in-life" className="hover:text-[#FF5500] dark:hover:text-[#FF9E8C] transition-colors">24-Hour Operational Flow</a></li>
            </ul>
          </div>
        </div>

        {/* Responsible Safety Notice */}
        <div className="border-t border-black/10 dark:border-white/10 pt-8 text-left space-y-3 text-[11px] leading-relaxed text-zinc-500">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#251E1C]/60 dark:backdrop-blur-md border border-black/10 dark:border-white/8 space-y-1.5 shadow-sm">
            <span className="text-[#FF5500] dark:text-[#FF9E8C] font-semibold block uppercase text-[10px] tracking-wider">
              Statutory Assistive Mobility Notice
            </span>
            <p className="text-zinc-600 dark:text-[#C8BDB6] font-sans">
              BeepVision is an assistive awareness device engineered to supplement, never replace, proven white cane mobility
              techniques, trained guide dog navigation, and formal Orientation & Mobility (O&M) certified training.
              No computational sensor array can guarantee 100% collision prevention in unpredictable urban environments.
              Prototype cost figures reflect single-unit prototyping parts and do not constitute retail consumer pricing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-zinc-500 dark:text-zinc-400">
            <span>© 2026 BeepVision Project. Open-Source Edge Perception Architecture.</span>
            <span className="text-zinc-600 dark:text-zinc-400">Designed with dignity for the visually impaired community.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
