import React, { useState } from 'react';
import { ROADMAP_PHASES } from '../data/productData';
import { Flag, FileText, Award, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';

export const Roadmap: React.FC = () => {
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(1); // Phase 2: Functional Prototype currently active

  const grants = [
    {
      program: "NCPEDP-Mphasis AT Hub Seed Grant",
      amount: "Up to ₹5 Lakh",
      stage: "Seed Validation",
      notes: "Non-dilutive grant, no equity surrendered. Direct access to national disability network and pilot testing cohorts.",
      status: "Eligible (Phase 2)",
      statusColor: "emerald"
    },
    {
      program: "BIRAC-Social Alpha Quest for Assistive Tech",
      amount: "Up to ₹50 Lakh",
      stage: "Clinical Acceleration",
      notes: "Includes 3-month structured accelerator program, clinical validation with hospital partners, and manufacturing mentorship.",
      status: "Application Pipeline",
      statusColor: "amber"
    },
    {
      program: "Saksham 2.0 (SACC India)",
      amount: "Up to ₹10 Lakh",
      stage: "Grassroots Field Testing",
      notes: "Assistive tech commercialization accelerator focusing on grassroots physical deployment in Tier-2/3 cities.",
      status: "Eligible",
      statusColor: "emerald"
    },
    {
      program: "Startup India (DPIIT) Recognition",
      amount: "80% Patent Rebate",
      stage: "Statutory IP Protection",
      notes: "Unlocks 80% government discount on patent filing fees plus expedited 12–24 month examination window.",
      status: "Prerequisite Step",
      statusColor: "cyan"
    }
  ];

  return (
    <section id="roadmap" className="scroll-mt-28 py-28 bg-[#F8F9FA] dark:bg-[#1A1614] border-t border-black/10 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 antimetal-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl text-left mb-16 space-y-4">
          <TechnicalBadge number="13" label="Commercialization & IP Pipeline" color="orange" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-950 dark:text-white tracking-[-0.04em] leading-[1.08]">
            From benchtop prototype<br />
            <span className="text-[#FF5500] dark:text-[#FF9E8C]">to clinical deployment.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-[#C8BDB6] font-normal leading-relaxed">
            Transitioning assistive hardware from laboratory breadboards into daily mobility requires empirical road-testing,
            blind community co-design, non-dilutive grant funding, and rigorous patent protection.
          </p>
        </div>

        {/* 6-Phase Engineering Pipeline (Antimetal Bento Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16 text-left">
          {ROADMAP_PHASES.map((p, i) => {
            const isCurrent = p.status === 'Current';
            const isSelected = activePhaseIndex === i;

            return (
              <div
                key={p.phase}
                onClick={() => setActivePhaseIndex(i)}
                className={`relative p-6 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-white dark:bg-[#3D1E1A]/40 dark:backdrop-blur-md border-[#FF5500] dark:border-[#FF9E8C]/60 shadow-md dark:shadow-[0_4px_20px_rgba(255,158,140,0.15)] ring-1 ring-[#FF5500]/50 dark:ring-[#FF9E8C]/50'
                    : isSelected
                    ? 'bg-white dark:bg-[#251E1C]/65 dark:backdrop-blur-md border-black/30 dark:border-white/30'
                    : 'bg-white/70 dark:bg-[#251E1C]/40 dark:backdrop-blur-md border-black/10 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 hover:bg-white dark:hover:bg-[#251E1C]/70'
                }`}
              >
                {(isCurrent || isSelected) && <ReticleCorner size={10} />}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#FF5500] dark:text-[#FF9E8C]">
                      PHASE 0{i + 1} // {p.phase}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isCurrent
                          ? 'bg-[#FF5500] text-white dark:bg-[#FF9E8C] dark:text-[#1A1614] font-bold border-[#FF5500] dark:border-[#FF9E8C]'
                          : p.status === 'Complete'
                          ? 'bg-[#059669]/10 text-[#059669] dark:bg-[#30D158]/15 dark:text-[#30D158] border-[#059669]/30 dark:border-[#30D158]/30 font-medium'
                          : 'bg-black/5 text-zinc-500 border-black/5 dark:bg-white/5 dark:text-zinc-500 dark:border-white/5 font-medium'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white tracking-[-0.02em]">
                    {p.name}
                  </h3>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                    {p.details}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-black/10 dark:border-white/10 text-[10px] font-mono text-zinc-500 flex items-center justify-between">
                  <span>Target Milestones</span>
                  <span className={isCurrent ? 'text-[#FF5500] dark:text-[#FF9E8C] font-bold' : 'text-zinc-600 dark:text-zinc-400'}>
                    Q{(i % 4) + 1} 2026/27
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Patent Filing Plan (from PDF p. 14) */}
        <div className="relative bg-white dark:bg-[#251E1C]/65 dark:backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-10 text-left mb-16 space-y-6 shadow-lg dark:shadow-[0_12px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors">
          <ReticleCorner size={14} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#0284C7] dark:text-[#30D158] uppercase tracking-widest font-semibold">
                INTELLECTUAL PROPERTY & MOAT // STATUTORY PROTECTION
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight">
                Dual-Tier Patent Filing Architecture (India & PCT)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-zinc-600 dark:text-[#30D158] bg-black/5 dark:bg-[#30D158]/10 border border-black/10 dark:border-[#30D158]/20 px-3 py-1 rounded font-semibold">
              PDF Source p. 14
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative bg-[#F4F5F7] dark:bg-[#1A1614]/70 dark:backdrop-blur-md border border-black/10 dark:border-white/8 rounded-xl p-6 space-y-3">
              <ReticleCorner size={8} />
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#0284C7] dark:text-[#30D158] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Utility Patent
                </span>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">20-Year Term</span>
              </div>
              <h4 className="text-base font-bold text-zinc-950 dark:text-white">Sensor Fusion & Dynamic Closing Velocity Engine</h4>
              <p className="text-xs text-zinc-700 dark:text-[#C8BDB6] leading-relaxed font-normal">
                Protects the core arbitration methodology: cross-checking LiDAR, ultrasonic arrays, and monocular depth;
                the closing-velocity priority scoring function \(U = w_d/d + w_v(-v) + w_t C\); and the edge-constrained NPU scheduling scheme.
              </p>
              <div className="pt-2 text-[10px] font-mono text-zinc-500">
                Filing Strategy: Indian Patent Office provisional filing followed by 12-month PCT window.
              </div>
            </div>

            <div className="relative bg-[#F4F5F7] dark:bg-[#1A1614]/70 dark:backdrop-blur-md border border-black/10 dark:border-white/8 rounded-xl p-6 space-y-3">
              <ReticleCorner size={8} />
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#FF5500] dark:text-[#FF9E8C] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Industrial Design Patent
                </span>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">10 + 5 Year Term</span>
              </div>
              <h4 className="text-base font-bold text-zinc-950 dark:text-white">Chest-Wearable Cowl & Perimeter Ring Assembly</h4>
              <p className="text-xs text-zinc-700 dark:text-[#C8BDB6] leading-relaxed font-normal">
                Protects the ergonomic chest-wearable form factor, the downward-canted optical cowl preserving body center-of-gravity,
                the perimeter 590nm safety LED ring geometry, and the raised tactile SOS switch bezel.
              </p>
              <div className="pt-2 text-[10px] font-mono text-zinc-500">
                Filing Strategy: Class 14-02 (Assistive & Data Processing Equipment) Design Registry.
              </div>
            </div>
          </div>
        </div>

        {/* Grants & Accelerator Funding Pipeline */}
        <div className="relative bg-white dark:bg-[#251E1C]/65 dark:backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-10 text-left space-y-6 shadow-lg dark:shadow-[0_12px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors">
          <ReticleCorner size={14} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#059669] dark:text-[#30D158] uppercase tracking-widest font-semibold">
                NON-DILUTIVE CAPITAL // ACCELERATION MATRIX
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight">
                Target Assistive Tech Grants & Commercialization Programs
              </h3>
            </div>
            <span className="text-[11px] font-mono text-zinc-600 dark:text-[#30D158] bg-black/5 dark:bg-[#30D158]/10 border border-black/10 dark:border-[#30D158]/20 px-3 py-1 rounded font-semibold">
              DPIIT Alignment
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grants.map((g) => (
              <div key={g.program} className="p-5 rounded-xl bg-[#F4F5F7] dark:bg-[#1A1614]/70 dark:backdrop-blur-md border border-black/10 dark:border-white/8 space-y-3 hover:border-black/20 dark:hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-950 dark:text-white tracking-tight">{g.program}</span>
                  <span className="text-xs font-mono text-[#FF5500] dark:text-[#FF9E8C] font-bold bg-[#FF5500]/10 dark:bg-[#FF9E8C]/15 border border-[#FF5500]/25 dark:border-[#FF9E8C]/30 px-2.5 py-0.5 rounded">
                    {g.amount}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-[#C8BDB6] leading-relaxed font-normal">
                  {g.notes}
                </p>
                <div className="pt-2 border-t border-black/10 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>Stage: {g.stage}</span>
                  <span className={g.statusColor === 'emerald' ? 'text-[#059669] dark:text-[#30D158]' : g.statusColor === 'amber' ? 'text-[#FF5500] dark:text-[#FF9E8C]' : 'text-[#0284C7] dark:text-[#30D158]'}>
                    ● {g.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
