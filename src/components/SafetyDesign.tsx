import React from 'react';
import { ShieldCheck, AlertOctagon, CheckCircle2, Sliders, EyeOff, Layers, RefreshCw } from 'lucide-react';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';

export const SafetyDesign: React.FC = () => {
  const safetyDefenses = [
    {
      problem: "Vulnerability 1: Bending / Torso Tilt Creates Blind Spots",
      details:
        "When the user bends to tie a shoe or sits down, a chest-mounted camera tilts downward, potentially losing track of approaching street traffic.",
      fixTitle: "IMU Dynamic Torso Tilt Compensation",
      fixDesc:
        "The MPU6050 IMU monitors pitch in real time. If a steep torso tilt angle is detected near a roadway, the fusion engine expands alert sensitivity, weights LiDAR more heavily, and issues a calm voice notification: 'Sensor view reduced.'",
      icon: EyeOff
    },
    {
      problem: "Vulnerability 2: Pavement Misclassified as Obstacle",
      details:
        "Downward-angled sensors can misread normal flat asphalt, shadows, or small curb rises as impending collisions, triggering annoying false beeps.",
      fixTitle: "RANSAC Mathematical Ground-Plane Segmentation",
      fixDesc:
        "RANSAC point-cloud plane fitting calculates the planar geometry of the walking surface and subtracts ground points automatically. Ultrasonic transducers are angled slightly forward-upward to avoid pavement reflections.",
      icon: Layers
    },
    {
      problem: "Vulnerability 3: False Alarms Eroding User Trust",
      details:
        "False alarms killed user adoption in predecessor devices (Sunu, WeWalk). Constant errant beeping causes anxiety and leads users to abandon the device.",
      fixTitle: "Hysteresis Debouncing & >85% Confidence Gating",
      fixDesc:
        "An obstacle must persist across 3+ consecutive video frames before triggering an alarm. Alerts are graduated: quiet pulses for low-risk awareness; loud warnings only for high-confidence, closing hazards. Calm voice tone prevents panic.",
      icon: Sliders
    },
    {
      problem: "Vulnerability 4: Single-Sensor Degraded Vision",
      details:
        "If a single sensor encounters glare, dust, or interference, relying on it blindly could cause missed obstacles or false triggers.",
      fixTitle: "Redundant 2-of-3 Sensor Voting Matrix",
      fixDesc:
        "Critical alerts require consensus: at least 2 of the 3 primary modalities (LiDAR, Camera Depth, Ultrasonic) must corroborate an obstacle before an urgent warning fires. Fail-safe over fail-silent: when uncertain, it defaults to mild caution.",
      icon: RefreshCw
    }
  ];

  return (
    <section id="safety" className="scroll-mt-28 py-24 bg-[#F8F9FA] dark:bg-[#030406] border-t border-dashed border-black/10 dark:border-white/10 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left mb-12 space-y-4">
          <TechnicalBadge number="11" label="SAFETY BY DESIGN & VERIFIED TRANSPARENCY" color="orange" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-zinc-950 dark:text-white tracking-[-0.03em] leading-[1.05]">
            HONEST ENGINEERING.<br />
            <span className="text-[#FF5500] dark:text-[#FF7733]">ZERO FALSE PROMISES.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
            No sensor system in the world—including multi-million-dollar automotive ADAS and autonomous vehicles—achieves
            100% detection accuracy. True safety comes from layered defenses, redundant sensor voting, and honest human-machine integration.
          </p>
        </div>

        {/* Mandatory Prominent Disclaimer Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-[#FFF7ED] dark:bg-[#080706] border border-dashed border-[#FF5500]/50 dark:border-[#FF7733]/50 text-left space-y-3 relative shadow-md dark:shadow-2xl transition-colors">
          <ReticleCorner size={10} className="text-[#FF5500] dark:text-[#FF7733]" />
          
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-5 h-5 text-[#FF5500] dark:text-[#FF7733] shrink-0" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5500] dark:text-[#FF7733]">
              MANDATORY SAFETY NOTICE & USAGE BASELINE
            </span>
          </div>
          <p className="text-base sm:text-lg font-semibold text-zinc-950 dark:text-white leading-relaxed tracking-tight">
            “BeepVision is an assistive awareness technology designed to supplement, never replace,
            established white cane mobility techniques, guide dog navigation, and orientation & mobility (O&M) training.”
          </p>
          <p className="text-xs text-zinc-700 dark:text-zinc-400 font-mono leading-relaxed">
            Claims of "100% safe" or "cane replacement" are irresponsible in life-safety assistive devices.
            BeepVision provides an extra cognitive layer of overhead and approaching hazard awareness while the user’s cane maintains physical contact with the terrain.
          </p>
        </div>

        {/* Layered Engineering Defenses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 text-left">
          {safetyDefenses.map((def) => {
            const Icon = def.icon;
            return (
              <div
                key={def.problem}
                className="bg-white dark:bg-[#06080D] border border-dashed border-black/10 dark:border-white/15 rounded-2xl p-6 sm:p-7 space-y-4 flex flex-col justify-between relative shadow-md dark:shadow-xl transition-colors"
              >
                <ReticleCorner size={8} className="text-[#059669] dark:text-[#00F5A0]" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FF5500]/10 dark:bg-[#FF7733]/15 text-[#FF5500] dark:text-[#FF7733] flex items-center justify-center shrink-0 border border-[#FF5500]/30 dark:border-[#FF7733]/30">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                      Failure Mode & Engineering Mitigation
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-zinc-950 dark:text-white tracking-tight leading-snug">
                    {def.problem}
                  </h3>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                    {def.details}
                  </p>
                </div>

                <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-1 bg-[#F4F5F7] dark:bg-[#030406] p-3.5 rounded-xl border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#059669] dark:text-[#00F5A0] uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{def.fixTitle}</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                    {def.fixDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Development Targets Strip */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#06080D] border border-dashed border-black/10 dark:border-white/15 text-left flex flex-col md:flex-row md:items-center justify-between gap-6 relative shadow-md dark:shadow-xl transition-colors">
          <ReticleCorner size={8} className="text-[#0284C7] dark:text-[#00D2FF]" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#0284C7] dark:text-[#00D2FF]">
              ISO 26262 AUTOMOTIVE SAFETY BENCHMARKS
            </span>
            <h4 className="text-xl font-semibold text-zinc-950 dark:text-white tracking-tight mt-0.5">
              Production Target Reliability Metrics
            </h4>
          </div>

          <div className="flex items-center gap-8 font-mono">
            <div>
              <span className="text-2xl font-bold text-[#059669] dark:text-[#00F5A0] block">&gt; 99.0%</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Obstacle Detection Target</span>
            </div>
            <div className="h-8 w-px bg-black/10 dark:bg-white/10" />
            <div>
              <span className="text-2xl font-bold text-zinc-950 dark:text-white block">&lt; 2.0%</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">False Alarm Target</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
