import React, { useState } from 'react';
import {
  CloudRain,
  CloudFog,
  ThermometerSnowflake,
  Sun,
  Wind,
  Moon,
  Activity,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { ENVIRONMENTAL_CONDITIONS } from '../data/productData';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';

export const WeatherConditions: React.FC = () => {
  const [selectedCondition, setSelectedCondition] = useState<number>(0);

  const iconMap: Record<string, React.ElementType> = {
    CloudRain,
    CloudFog,
    ThermometerSnowflake,
    Sun,
    Wind,
    Moon,
    Activity,
    ShieldAlert
  };

  const current = ENVIRONMENTAL_CONDITIONS[selectedCondition];
  const Icon = iconMap[current.icon] || CloudRain;

  return (
    <section id="conditions" className="scroll-mt-28 py-24 bg-[#F8F9FA] dark:bg-[#030406] border-t border-dashed border-black/10 dark:border-white/10 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left mb-16 space-y-4">
          <TechnicalBadge number="10" label="REAL-WORLD ENVIRONMENTAL RESILIENCE" color="orange" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-zinc-950 dark:text-white tracking-[-0.03em] leading-[1.05]">
            DESIGNED FOR REAL WEATHER.<br />
            <span className="text-[#FF5500] dark:text-[#FF7733]">NOT STERILE LAB BENCHES.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
            A mobility aid must perform in monsoon downpours, zero-degree winter mornings, and blinding 45°C summer glare.
            The sensor fusion engine dynamically re-weights which sensor to trust based on live atmospheric telemetry.
          </p>
        </div>

        {/* Condition Picker Grid (Componentry Style) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
          {ENVIRONMENTAL_CONDITIONS.map((cond, i) => {
            const CIcon = iconMap[cond.icon] || CloudRain;
            const isSelected = selectedCondition === i;
            return (
              <button
                key={cond.condition}
                onClick={() => setSelectedCondition(i)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between h-28 group relative ${
                  isSelected
                    ? 'bg-white dark:bg-white/[0.06] border-[#FF5500] dark:border-[#FF7733]/60 shadow-md dark:shadow-[0_0_20px_rgba(255,119,51,0.15)] text-zinc-950 dark:text-white'
                    : 'bg-white/70 dark:bg-[#06080D] border-black/10 dark:border-white/5 hover:border-black/20 dark:hover:border-white/15 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                }`}
                aria-pressed={isSelected}
              >
                <CIcon className={`w-5 h-5 ${isSelected ? 'text-[#FF5500] dark:text-[#FF7733]' : 'text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300'}`} />
                <span className="text-xs font-semibold block leading-tight tracking-tight">
                  {cond.condition.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Condition Card */}
        <div className="bg-white dark:bg-[#06080D] border border-dashed border-black/10 dark:border-white/15 rounded-2xl p-6 sm:p-10 text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative shadow-lg dark:shadow-2xl transition-colors">
          <ReticleCorner size={10} className="text-[#FF5500] dark:text-[#FF7733]" />

          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-[#FF5500] dark:text-[#FF7733] bg-[#FF5500]/10 dark:bg-[#FF7733]/15 border border-[#FF5500]/25 dark:border-[#FF7733]/30 px-3 py-1 rounded-full uppercase tracking-wider">
                PROFILE 0{selectedCondition + 1}
              </span>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                Operating Envelope: -10°C to +50°C
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-semibold text-zinc-950 dark:text-white tracking-tight flex items-center gap-3">
              <Icon className="w-7 h-7 text-[#FF5500] dark:text-[#FF7733] shrink-0" />
              <span>{current.condition}</span>
            </h3>

            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-200 leading-relaxed font-normal">
              {current.behavior}
            </p>

            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center gap-2 text-xs font-mono text-[#059669] dark:text-[#00F5A0]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Engineered hardware mitigation documented in PDF Section 10</span>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#F4F5F7] dark:bg-[#030406] border border-black/10 dark:border-white/10 rounded-xl p-5 space-y-3 font-mono text-xs">
            <span className="text-zinc-600 dark:text-zinc-400 uppercase tracking-widest text-[10px] block">
              Sensor Re-Weighting Logic:
            </span>
            <div className="space-y-1.5 text-zinc-700 dark:text-zinc-300">
              <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-1">
                <span>Optical Trust:</span>
                <span className={current.condition.includes('Rain') || current.condition.includes('Fog') || current.condition.includes('Dark') ? 'text-amber-500 dark:text-amber-400 font-bold' : 'text-[#059669] dark:text-[#00F5A0]'}>
                  {current.condition.includes('Rain') || current.condition.includes('Fog') || current.condition.includes('Dark') ? '40% (Degraded)' : '95% (Nominal)'}
                </span>
              </div>
              <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-1">
                <span>LiDAR Ground Truth:</span>
                <span className={current.condition.includes('Rain') ? 'text-amber-500 dark:text-amber-400' : 'text-[#059669] dark:text-[#00F5A0]'}>
                  {current.condition.includes('Rain') ? 'Filtered Scatter' : '100% Locked'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ultrasonic Sonar:</span>
                <span className="text-[#059669] dark:text-[#00F5A0]">Active Failsafe</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
