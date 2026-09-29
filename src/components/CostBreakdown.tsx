import React, { useState } from 'react';
import { HARDWARE_COMPONENTS, TOTAL_ESTIMATE_RANGE } from '../data/productData';
import { DollarSign, Layers, CheckCircle2, TrendingDown, ArrowRight, ShieldCheck } from 'lucide-react';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';

export const CostBreakdown: React.FC = () => {
  return (
    <section id="pricing" className="scroll-mt-28 py-24 bg-[#F8F9FA] dark:bg-[#030406] border-t border-dashed border-black/10 dark:border-white/10 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left mb-16 space-y-4">
          <TechnicalBadge number="12" label="PROTOTYPE BILL OF MATERIALS & ECONOMICS" color="orange" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-zinc-950 dark:text-white tracking-[-0.03em] leading-[1.05]">
            TRANSPARENT PROTOTYPE<br />
            <span className="text-[#FF5500] dark:text-[#FF7733]">BILL OF MATERIALS.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
            We believe in honest hardware accounting. Below is the exact, unvarnished component breakdown
            for building an individual BeepVision lab prototype unit.
          </p>
        </div>

        {/* Prototype Cost Callout Box (Antimetal Signature Style) */}
        <div className="mb-14 p-8 rounded-2xl bg-white dark:bg-[#06080D] border border-dashed border-black/10 dark:border-white/20 text-left flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative shadow-lg dark:shadow-2xl transition-colors">
          <ReticleCorner size={12} className="text-[#FF5500] dark:text-[#FF7733]" />

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#FF5500] dark:text-[#FF7733] block font-semibold">
              INDIVIDUAL PROTOTYPE BENCH BUILD ESTIMATE
            </span>
            <div className="text-4xl sm:text-5xl font-bold text-zinc-950 dark:text-white font-mono tracking-tight">
              {TOTAL_ESTIMATE_RANGE}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              * Clearly labeled as estimated prototype build costs. Not a commercial retail price. Drops significantly at bulk manufacturing scale.
            </p>
          </div>

          <div className="bg-[#F4F5F7] dark:bg-[#030406] border border-black/10 dark:border-white/10 rounded-xl p-4 space-y-2 max-w-md font-mono text-xs text-zinc-700 dark:text-zinc-300">
            <div className="flex items-center gap-2 text-[#059669] dark:text-[#00F5A0] font-semibold uppercase tracking-wider">
              <TrendingDown className="w-4 h-4" /> Production Volume Trajectory
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              At production runs of 1,000+ units, custom ASIC/SoM integration and bulk silicon orders project unit BOM costs dropping below ₹22,000–₹26,000.
            </p>
          </div>
        </div>

        {/* Economic Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
          
          <div className="bg-white dark:bg-[#06080D] border border-dashed border-black/10 dark:border-white/15 rounded-2xl p-6 space-y-3 relative shadow-md dark:shadow-xl transition-colors">
            <ReticleCorner size={8} className="text-zinc-400 dark:text-zinc-600" />
            <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Traditional Mobility Companion</span>
            <h3 className="text-xl font-semibold text-zinc-950 dark:text-white tracking-tight">Trained Guide Dog</h3>
            <div className="text-2xl font-mono font-bold text-zinc-800 dark:text-zinc-300">$40,000 – $60,000+</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Over ₹35 Lakh in training and lifelong veterinary care. 2 years of intensive training, 6–8 year service lifespan. Cannot read text or signs.
            </p>
          </div>

          <div className="bg-white dark:bg-[#06080D] border border-dashed border-black/10 dark:border-white/15 rounded-2xl p-6 space-y-3 relative shadow-md dark:shadow-xl transition-colors">
            <ReticleCorner size={8} className="text-zinc-400 dark:text-zinc-600" />
            <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">Imported Ultrasonic Grips</span>
            <h3 className="text-xl font-semibold text-zinc-950 dark:text-white tracking-tight">Commercial Cane Attachments</h3>
            <div className="text-2xl font-mono font-bold text-zinc-800 dark:text-zinc-300">₹80,000 – ₹1,20,000</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Proprietary single-sensor ultrasonic handles. Lacks computer vision, object classification, OCR, and fall detection. High import markups.
            </p>
          </div>

          <div className="bg-white dark:bg-[#06080D] border border-dashed border-[#FF5500]/40 dark:border-[#FF7733]/40 rounded-2xl p-6 space-y-3 relative shadow-md dark:shadow-xl transition-colors">
            <ReticleCorner size={8} className="text-[#FF5500] dark:text-[#FF7733]" />
            <span className="text-[10px] font-mono uppercase text-[#FF5500] dark:text-[#FF7733] tracking-wider font-semibold">Edge AI Wearable</span>
            <h3 className="text-xl font-semibold text-zinc-950 dark:text-white tracking-tight">BeepVision Wearable</h3>
            <div className="text-2xl font-mono font-bold text-[#FF5500] dark:text-[#FF7733]">{TOTAL_ESTIMATE_RANGE}</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
              26 TOPS on-device NPU, solid-state LiDAR, 4-corner sonar, IMU, GPS, and bone-conduction voice. Designed to supplement cane technique at fraction of cost.
            </p>
          </div>

        </div>

        {/* Detailed BOM Table */}
        <div className="bg-white dark:bg-[#06080D] border border-dashed border-black/10 dark:border-white/15 rounded-2xl p-6 sm:p-8 text-left space-y-4 relative shadow-lg dark:shadow-2xl transition-colors">
          <ReticleCorner size={10} className="text-[#059669] dark:text-[#00F5A0]" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-[#059669] dark:text-[#00F5A0] uppercase tracking-[0.14em]">
                DETAILED COMPONENT BILL OF MATERIALS
              </span>
              <h3 className="text-xl font-semibold text-zinc-950 dark:text-white tracking-tight mt-0.5">
                Single-Unit Prototype Hardware Pricing (INR)
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full border border-black/10 dark:border-white/10 uppercase tracking-wider">
              Source: PDF Page 1–2
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/15 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Component Description</th>
                  <th className="py-3 px-3">System Role</th>
                  <th className="py-3 px-3">Hardware Interface</th>
                  <th className="py-3 px-3 text-[#059669] dark:text-[#00F5A0]">Estimated Prototype Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10 text-zinc-700 dark:text-zinc-300">
                {HARDWARE_COMPONENTS.map((item) => (
                  <tr key={item.component} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-semibold text-zinc-950 dark:text-white">{item.component}</td>
                    <td className="py-3 px-3 text-zinc-600 dark:text-zinc-300 font-normal">{item.purpose}</td>
                    <td className="py-3 px-3 text-[#0284C7] dark:text-[#00D2FF] font-normal">{item.connection}</td>
                    <td className="py-3 px-3 text-[#059669] dark:text-[#00F5A0] font-semibold">{item.priceINR}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
