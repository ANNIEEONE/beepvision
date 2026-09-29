import React from 'react';
import { Cpu, Zap, Lock, WifiOff, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';

export const BrainAI: React.FC = () => {
  const pipelineSteps = [
    {
      num: '01',
      title: 'Frame Ingestion',
      component: 'CSI-2 2-Lane MIPI Port',
      details: 'Captures raw 30 FPS video frames routed directly via PCIe DMA into Hailo NPU buffers—bypassing Pi CPU for minimal thermal load.',
      highlight: '30 FPS @ 1080p'
    },
    {
      num: '02',
      title: 'Hailo-8 YOLOv8 Detection',
      component: '26 TOPS Neural Accelerator',
      details: 'High-speed object bounding boxes (.hef format): pedestrians, vehicles, poles, curbs, stairs, open doors, low-hanging branches.',
      highlight: '<12ms inference'
    },
    {
      num: '03',
      title: 'Monocular Depth Estimation',
      component: 'MiDaS / Depth Anything',
      details: 'Computes continuous depth gradient across the entire visual field from the 2D camera image alone to estimate obstacle footprints.',
      highlight: 'Dense 2D Depth'
    },
    {
      num: '04',
      title: 'LiDAR Cross-Verification',
      component: 'TF-Luna Laser Ranging',
      details: 'Compares optical depth against physical laser distance. If camera predicts 2.1m and LiDAR reads 2.05m, confidence locks at 99%.',
      highlight: '±6cm Ground Truth'
    },
    {
      num: '05',
      title: 'Obstacle Fusion Matrix',
      component: 'Pi 5 Python/C++ Engine',
      details: 'Merges LiDAR, camera depth, and 4-corner ultrasonics into a unified coordinate map: [Object Type, Vector, Closing Speed, Distance].',
      highlight: '360° Fusion Map'
    },
    {
      num: '06',
      title: 'Priority Arbitration Engine',
      component: 'Safety Decision Logic',
      details: 'Calculates Urgency = f(distance, closing_speed, threat_type). Plays only the single highest-priority alert to prevent cognitive overload.',
      highlight: 'Single-Alert Focus'
    }
  ];

  return (
    <section id="brain" className="scroll-mt-28 py-24 bg-[#F8F9FA] dark:bg-[#030406] border-t border-dashed border-black/10 dark:border-white/10 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left mb-16 space-y-4">
          <TechnicalBadge number="04" label="ON-DEVICE EDGE NEURAL COMPUTE" color="emerald" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-zinc-950 dark:text-white tracking-[-0.03em] leading-[1.05]">
            THE AI BRAIN.<br />
            <span className="text-[#059669] dark:text-[#00F5A0]">26 TOPS AT YOUR CHEST.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
            Instead of streaming the user’s continuous visual surroundings to a remote cloud API,
            BeepVision processes all perception locally on dedicated Hailo-8 neural silicon.
          </p>
        </div>

        {/* 3 Pillars of On-Device AI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
          
          <div className="bg-white dark:bg-[#06080D] border border-dashed border-black/10 dark:border-white/15 rounded-2xl p-6 space-y-3 relative shadow-md dark:shadow-xl transition-colors">
            <ReticleCorner size={8} className="text-[#FF5500] dark:text-[#FF7733]" />
            <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 dark:bg-[#FF7733]/15 text-[#FF5500] dark:text-[#FF7733] flex items-center justify-center border border-[#FF5500]/30 dark:border-[#FF7733]/30">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-white tracking-tight">0 ms Cloud Latency</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
              When a fast cyclist or electric scooter closes in, waiting 2 to 4 seconds for an API response
              is a safety catastrophe. Local inference fires in under 15 milliseconds.
            </p>
          </div>

          <div className="bg-white dark:bg-[#06080D] border border-dashed border-black/10 dark:border-white/15 rounded-2xl p-6 space-y-3 relative shadow-md dark:shadow-xl transition-colors">
            <ReticleCorner size={8} className="text-[#059669] dark:text-[#00F5A0]" />
            <div className="w-10 h-10 rounded-xl bg-[#059669]/10 dark:bg-[#00F5A0]/15 text-[#059669] dark:text-[#00F5A0] flex items-center justify-center border border-[#059669]/30 dark:border-[#00F5A0]/30">
              <WifiOff className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-white tracking-tight">Zero Dead Zones</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
              Subway stations, underground transit passages, elevators, and rural pathways often have zero
              cellular connectivity. BeepVision works 100% offline everywhere.
            </p>
          </div>

          <div className="bg-white dark:bg-[#06080D] border border-dashed border-black/10 dark:border-white/15 rounded-2xl p-6 space-y-3 relative shadow-md dark:shadow-xl transition-colors">
            <ReticleCorner size={8} className="text-[#0284C7] dark:text-[#00D2FF]" />
            <div className="w-10 h-10 rounded-xl bg-[#0284C7]/10 dark:bg-[#00D2FF]/15 text-[#0284C7] dark:text-[#00D2FF] flex items-center justify-center border border-[#0284C7]/30 dark:border-[#00D2FF]/30">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-white tracking-tight">Absolute Privacy</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
              The camera sees homes, bathrooms, financial documents, and personal encounters. Raw video
              never touches the internet, and optional face recognition stores vector embeddings only.
            </p>
          </div>

        </div>

        {/* The 6-Stage Real-Time Perception Pipeline (Antimetal Bento Grid) */}
        <div className="bg-white dark:bg-[#06080D] border border-dashed border-black/10 dark:border-white/15 rounded-2xl p-6 sm:p-10 text-left mb-16 space-y-8 relative shadow-lg dark:shadow-2xl transition-colors">
          <ReticleCorner size={10} className="text-[#059669] dark:text-[#00F5A0]" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-4">
            <div>
              <span className="text-[11px] font-mono text-[#059669] dark:text-[#00F5A0] uppercase tracking-[0.14em]">
                EXECUTION PIPELINE // DETERMINISTIC &lt;15ms
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold text-zinc-950 dark:text-white tracking-tight mt-1">
                How Sensory Data Moves Through Hailo-8 & Raspberry Pi 5
              </h3>
            </div>
            <span className="text-xs font-mono text-[#059669] dark:text-[#00F5A0] bg-[#059669]/10 dark:bg-[#00F5A0]/10 px-3 py-1 rounded-full border border-[#059669]/30 dark:border-[#00F5A0]/30 self-start sm:self-auto flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#00F5A0] animate-pulse" />
              HailoRT Dataflow Compiler
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pipelineSteps.map((step) => (
              <div
                key={step.num}
                className="bg-[#F4F5F7] dark:bg-[#080A10] border border-black/10 dark:border-white/10 hover:border-[#059669]/40 dark:hover:border-[#00F5A0]/40 rounded-xl p-5 space-y-2.5 transition-all group relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold font-mono text-[#059669] dark:text-[#00F5A0]">{step.num}</span>
                  <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10">
                    {step.highlight}
                  </span>
                </div>
                <h4 className="text-base font-semibold text-zinc-950 dark:text-white group-hover:text-[#059669] dark:group-hover:text-[#00F5A0] transition-colors">
                  {step.title}
                </h4>
                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 block">{step.component}</span>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">{step.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Benchmarks Table */}
        <div className="bg-white dark:bg-[#06080D] border border-dashed border-black/10 dark:border-white/15 rounded-2xl p-6 sm:p-8 text-left space-y-4 relative shadow-lg dark:shadow-2xl transition-colors">
          <ReticleCorner size={10} className="text-[#FF5500] dark:text-[#FF7733]" />
          
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#FF5500] dark:text-[#FF7733]">
              HARDWARE BENCHMARK COMPARISON
            </span>
            <h3 className="text-xl font-semibold text-zinc-950 dark:text-white tracking-tight mt-0.5">
              Dedicated NPU vs Traditional Smartphone App & Cloud Approaches
            </h3>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs font-mono border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/15 text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Metric</th>
                  <th className="py-3 px-3 text-[#059669] dark:text-[#00F5A0] font-bold">BeepVision (Hailo-8 AI HAT+)</th>
                  <th className="py-3 px-3">Cloud AI (AWS/OpenAI Vision)</th>
                  <th className="py-3 px-3">Smartphone CPU Only</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10 text-zinc-700 dark:text-zinc-300">
                <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-semibold text-zinc-950 dark:text-white">Inference Speed</td>
                  <td className="py-3 px-3 text-[#059669] dark:text-[#00F5A0] font-semibold">10–15 ms (&gt;30 FPS)</td>
                  <td className="py-3 px-3 text-red-500 dark:text-red-400">1,800–3,500 ms (0.3 FPS)</td>
                  <td className="py-3 px-3 text-amber-500 dark:text-amber-400">300–800 ms (1.5 FPS)</td>
                </tr>
                <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-semibold text-zinc-950 dark:text-white">Network Dependency</td>
                  <td className="py-3 px-3 text-[#059669] dark:text-[#00F5A0] font-semibold">Zero (100% Offline)</td>
                  <td className="py-3 px-3 text-red-500 dark:text-red-400">Mandatory 5G/LTE Signal</td>
                  <td className="py-3 px-3">Partial</td>
                </tr>
                <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-semibold text-zinc-950 dark:text-white">Power Consumption</td>
                  <td className="py-3 px-3 text-[#059669] dark:text-[#00F5A0] font-semibold">~2.5W (Hailo-8 NPU)</td>
                  <td className="py-3 px-3">Low local (High data cost)</td>
                  <td className="py-3 px-3 text-red-500 dark:text-red-400">8–12W (Throttles fast)</td>
                </tr>
                <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-semibold text-zinc-950 dark:text-white">Data Privacy</td>
                  <td className="py-3 px-3 text-[#059669] dark:text-[#00F5A0] font-semibold">Air-gapped on wearable</td>
                  <td className="py-3 px-3 text-red-500 dark:text-red-400">Video streamed to cloud servers</td>
                  <td className="py-3 px-3">Local app sandbox</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
