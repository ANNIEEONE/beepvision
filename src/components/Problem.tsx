import React, { useState } from 'react';
import { Eye, ShieldAlert, AlertTriangle, Sparkles, ArrowRight, X, Check } from 'lucide-react';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';
import { TextRepel } from './ui/TextRepel';

export const Problem: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<number>(0);

  const scenarios = [
    {
      title: "Overhead & Approaching Hazards",
      category: "Mobility Obstacles",
      icon: AlertTriangle,
      description:
        "A white cane effectively sweeps ground-level terrain, but cannot detect head-height awning poles, low-hanging tree branches, open flatbed truck gates, or silent electric scooters closing from behind at 20 km/h.",
      caneLimitation: "White cane misses overhead (> 1m) and fast closing objects",
      beepVisionFix: "TF-Luna LiDAR + Wide Camera detect hazards at chest and head level 0.2m–8.0m away.",
      stats: "Overhead collisions account for 40%+ of upper-torso assistive cane injuries."
    },
    {
      title: "Printed Information in the Wild",
      category: "OCR & Signage",
      icon: Eye,
      description:
        "Bus route numbers, room signs, medicine labels, cafeteria menus, and elevator inspection badges exist entirely in visual form, creating immediate barriers to spontaneous daily navigation.",
      caneLimitation: "Tactile tools cannot read ink on paper or digital LED displays",
      beepVisionFix: "PaddleOCR + Piper neural TTS extracts and speaks printed text in ~180ms with 0ms cloud lag.",
      stats: "78% of visually impaired individuals report medication misidentification anxiety."
    },
    {
      title: "Unfamiliar Indoor Architecture",
      category: "Spatial Geometry",
      icon: Sparkles,
      description:
        "Entering a high-ceiling atrium, large subway mezzanine, or government office without tactile paving leads to disorientation, missed hallways, and dangerous step-downs.",
      caneLimitation: "Requires physical impact to discover room geometry",
      beepVisionFix: "YOLOv8 + MiDaS depth models recognize doorways, stairs, and structural pillars at 30 FPS.",
      stats: "Stairway transitions represent the single highest fall-risk threshold indoors."
    },
    {
      title: "Sudden Slips, Trips & Falls",
      category: "Emergency Safety",
      icon: ShieldAlert,
      description:
        "When an unexpected trip or medical emergency happens on a sidewalk, calling for help while disoriented or injured on the ground is a life-threatening vulnerability.",
      caneLimitation: "Traditional canes have zero impact telemetry or communication",
      beepVisionFix: "6-DOF IMU detects impact spikes + lack of motion, automatically triggering GPS emergency dispatch.",
      stats: "Falls are 3x more frequent among visually impaired seniors than sighted peers."
    }
  ];

  return (
    <section id="problem" className="scroll-mt-28 py-24 bg-[#F8F9FA] dark:bg-[#1A1614] border-t border-black/10 dark:border-white/10 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left mb-16 space-y-4">
          <TechnicalBadge label="Urban Mobility Vulnerabilities" color="orange" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-zinc-950 dark:text-white tracking-[-0.03em] leading-[1.05]">
            The world doesn’t stop<br />
            <span className="text-zinc-500 dark:text-zinc-400">because you can’t see it.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
            Independence isn’t about being sheltered—it’s about having the perceptual awareness to move boldly.
            Modern cities are getting faster, quieter with silent electric vehicles, and more visually demanding.
          </p>
        </div>

        {/* Interactive Scenario Cards (Componentry Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          
          {/* Left: Scenario Selector Pills */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                Critical Failure Scenarios
              </span>
              <span className="text-xs font-semibold text-[#FF5500] dark:text-[#FF7733]">Scenario {selectedScenario + 1} of 4</span>
            </div>

            {scenarios.map((sc, i) => {
              const Icon = sc.icon;
              const isSelected = selectedScenario === i;
              return (
                <button
                  key={sc.title}
                  onClick={() => setSelectedScenario(i)}
                  className={`w-full min-h-[48px] text-left p-4 rounded-xl transition-all border flex items-center justify-between group relative cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-[#3D1E1A]/40 dark:backdrop-blur-md border-[#FF5500] dark:border-[#FF9E8C]/60 shadow-lg dark:shadow-[0_4px_20px_rgba(255,158,140,0.15)] text-zinc-950 dark:text-white'
                      : 'bg-white dark:bg-[#251E1C]/40 dark:backdrop-blur-md border-black/10 dark:border-white/5 hover:border-black/20 dark:hover:border-white/15 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-zinc-100 shadow-xs'
                  }`}
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#FF5500] dark:bg-[#FF9E8C] text-white dark:text-[#1A1614] font-bold' : 'bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wide text-[#FF5500] dark:text-[#FF9E8C] font-semibold block">
                        {sc.category}
                      </span>
                      <h4 className="text-sm font-semibold transition-colors mt-0.5">
                        {sc.title}
                      </h4>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[#FF5500] dark:text-[#FF9E8C] translate-x-1' : 'opacity-0'}`} />
                </button>
              );
            })}
          </div>

          {/* Right: Comparative Breakdown Display Card */}
          <div className="lg:col-span-7 bg-white dark:bg-[#251E1C]/65 dark:backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 relative text-left shadow-lg dark:shadow-[0_12px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <ReticleCorner size={10} className="text-[#FF5500] dark:text-[#FF9E8C]" />
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wide px-3 py-1 rounded-full bg-[#FF5500]/10 dark:bg-[#FF9E8C]/15 text-[#FF5500] dark:text-[#FF9E8C] border border-[#FF5500]/25 dark:border-[#FF9E8C]/30 font-semibold">
                Scenario {selectedScenario + 1} Analysis
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Autonomous Perception Layer</span>
            </div>

            <h3 className="text-2xl font-semibold text-zinc-950 dark:text-white tracking-tight mb-3">
              {scenarios[selectedScenario].title}
            </h3>

            <p className="text-sm text-zinc-700 dark:text-[#C8BDB6] leading-relaxed mb-6 font-normal">
              {scenarios[selectedScenario].description}
            </p>

            {/* Direct Comparison Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* White Cane Limit */}
              <div className="p-4 rounded-xl bg-red-500/10 dark:bg-[#3D1E1A]/40 border border-red-500/20 dark:border-[#FF9E8C]/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono text-red-600 dark:text-[#FF9E8C] uppercase tracking-wider font-semibold">
                  <X className="w-4 h-4" />
                  <span>White Cane Limitation</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-[#C8BDB6] leading-relaxed">
                  {scenarios[selectedScenario].caneLimitation}
                </p>
              </div>

              {/* BeepVision Advantage */}
              <div className="p-4 rounded-xl bg-[#00B368]/10 dark:bg-[#30D158]/10 border border-[#00B368]/25 dark:border-[#30D158]/25 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#00B368] dark:text-[#30D158] uppercase tracking-wider font-semibold">
                  <Check className="w-4 h-4" />
                  <span>BeepVision Edge Layer</span>
                </div>
                <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  {scenarios[selectedScenario].beepVisionFix}
                </p>
              </div>
            </div>

            {/* Metric / Stat Callout */}
            <div className="bg-black/[0.03] dark:bg-[#1A1614]/70 dark:backdrop-blur-md border border-black/10 dark:border-white/8 rounded-xl p-3.5 text-xs font-mono text-zinc-700 dark:text-[#C8BDB6] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#FF5500] dark:bg-[#FF9E8C] shrink-0 shadow-[0_0_6px_#FF9E8C]" />
              <span>{scenarios[selectedScenario].stats}</span>
            </div>
          </div>
        </div>

        {/* Antimetal Comparative Landscape Table */}
        <div className="bg-white dark:bg-[#251E1C]/65 dark:backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 text-left space-y-6 relative shadow-lg dark:shadow-[0_12px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <ReticleCorner size={10} className="text-[#00B368] dark:text-[#30D158]" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono text-[#FF5500] dark:text-[#FF9E8C] font-bold uppercase tracking-[0.14em]">
                COMPETITOR ANALYSIS & LESSONS LEARNED
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold text-zinc-950 dark:text-white tracking-tight mt-1">
                Why Previous Assistive Devices Failed in the Real World
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-600 dark:text-[#30D158] bg-black/5 dark:bg-[#30D158]/10 px-3 py-1.5 rounded-full border border-black/10 dark:border-[#30D158]/20 self-start sm:self-auto uppercase tracking-wider">
              Source: PDF p.10–12
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/15 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="py-3.5 px-3">Device / Approach</th>
                  <th className="py-3.5 px-3">Form Factor</th>
                  <th className="py-3.5 px-3">Primary Sensing</th>
                  <th className="py-3.5 px-3 text-red-600 dark:text-red-400">Why It Failed / Real-World Flaw</th>
                  <th className="py-3.5 px-3 text-[#00B368] dark:text-[#00F5A0]">BeepVision Solution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10 text-zinc-700 dark:text-zinc-300">
                <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-zinc-950 dark:text-white">Sunu Band</td>
                  <td className="py-3.5 px-3 text-zinc-500 dark:text-zinc-400">Wrist Sonar</td>
                  <td className="py-3.5 px-3">Ultrasonic only</td>
                  <td className="py-3.5 px-3 text-red-600 dark:text-red-400">Blocked by winter coat/sleeves; easily damaged</td>
                  <td className="py-3.5 px-3 text-[#00B368] dark:text-[#00F5A0] font-medium">Chest harness mount; unobstructed line of sight</td>
                </tr>
                <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-zinc-950 dark:text-white">WeWalk Cane</td>
                  <td className="py-3.5 px-3 text-zinc-500 dark:text-zinc-400">Smart Handle</td>
                  <td className="py-3.5 px-3">Ultrasonic only</td>
                  <td className="py-3.5 px-3 text-red-600 dark:text-red-400">Heavy battery drain; waist-level only; zero vision</td>
                  <td className="py-3.5 px-3 text-[#00B368] dark:text-[#00F5A0] font-medium">Camera + LiDAR + Sonar 3-way multi-modal fusion</td>
                </tr>
                <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-zinc-950 dark:text-white">OrCam MyEye</td>
                  <td className="py-3.5 px-3 text-zinc-500 dark:text-zinc-400">Glasses Reader</td>
                  <td className="py-3.5 px-3">Camera only</td>
                  <td className="py-3.5 px-3 text-red-600 dark:text-red-400">Extreme cost ($4,000+), short battery; zero obstacle warning</td>
                  <td className="py-3.5 px-3 text-[#00B368] dark:text-[#00F5A0] font-medium">Full collision avoidance + OCR in unified unit</td>
                </tr>
                <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-zinc-950 dark:text-white">ViT / Cloud Canes</td>
                  <td className="py-3.5 px-3 text-zinc-500 dark:text-zinc-400">Cloud Pi 4B</td>
                  <td className="py-3.5 px-3">Cloud Vision</td>
                  <td className="py-3.5 px-3 text-red-600 dark:text-red-400">Severe latency (0.6 FPS, 2–4s), cellular deadzones</td>
                  <td className="py-3.5 px-3 text-[#00B368] dark:text-[#00F5A0] font-medium">26 TOPS on-device NPU; 0ms cloud lag</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Antimetal Signature Philosophy Statement with Text Repel */}
        <div className="mt-12 p-8 sm:p-12 rounded-2xl bg-white dark:bg-white/[0.02] border border-dashed border-black/15 dark:border-white/20 text-center relative overflow-hidden shadow-sm dark:shadow-none group">
          <ReticleCorner size={12} className="text-[#FF5500] dark:text-[#FF7733]" />
          <div className="text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed max-w-4xl mx-auto tracking-tight">
            <TextRepel
              segments={[
                {
                  text: "“BeepVision doesn’t replace the user’s independence.",
                  className: "text-zinc-950 dark:text-white"
                },
                {
                  text: "It gives them another layer of awareness.”",
                  className: "text-[#FF5500] dark:text-[#FF7733]"
                }
              ]}
              radius={130}
              strength={48}
              stiffness={190}
              damping={14}
              mass={0.4}
              className="w-full justify-center"
            />
          </div>
          <div className="mt-4 text-[11px] font-mono tracking-widest uppercase text-zinc-400 dark:text-zinc-500 opacity-60 group-hover:opacity-100 transition-opacity">
            [ Move cursor or touch to repel letters · Magnetic forcefield ]
          </div>
        </div>

      </div>
    </section>
  );
};
