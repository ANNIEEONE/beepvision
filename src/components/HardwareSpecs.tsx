import React, { useState } from 'react';
import { HARDWARE_COMPONENTS, type ComponentCost } from '../data/productData';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';

export const HardwareSpecs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeComp, setActiveComp] = useState<ComponentCost>(HARDWARE_COMPONENTS[0]);

  const categories = [
    { id: 'all', label: 'All Modules' },
    { id: 'compute', label: 'Compute & AI' },
    { id: 'optics', label: 'Vision & LiDAR' },
    { id: 'ranging', label: 'Sensors & GPS' },
    { id: 'audio', label: 'Audio & Haptics' },
    { id: 'power', label: 'Power & Chassis' },
  ];

  const filtered = selectedCategory === 'all'
    ? HARDWARE_COMPONENTS
    : HARDWARE_COMPONENTS.filter((c) => {
        if (selectedCategory === 'compute') return c.category === 'compute';
        if (selectedCategory === 'optics') return c.category === 'optics' || (c.category === 'ranging' && c.component.includes('LiDAR'));
        if (selectedCategory === 'ranging') return c.category === 'ranging' && !c.component.includes('LiDAR');
        if (selectedCategory === 'audio') return c.category === 'audio';
        if (selectedCategory === 'power') return c.category === 'power' || c.category === 'enclosure';
        return true;
      });

  return (
    <section id="hardware" className="scroll-mt-28 py-24 bg-[#F8F9FA] dark:bg-[#1A1614] border-t border-black/10 dark:border-white/10 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left mb-16 space-y-4">
          <TechnicalBadge number="07" label="Hardware Architecture & Interconnects" color="orange" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-zinc-950 dark:text-white tracking-[-0.03em] leading-[1.05]">
            Engineered to withstand<br />
            <span className="text-[#FF5500] dark:text-[#FF9E8C]">the real world.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-[#C8BDB6] leading-relaxed font-normal">
            No fragile single-board prototypes. Every sensor, bus interconnect, power rail, and thermal dissipation path
            is architected into a sealed IP65 chest unit designed for all-day wearable reliability.
          </p>
        </div>

        {/* Category Filter Pills (Componentry Style) */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-black dark:border-white font-bold shadow-md'
                  : 'bg-white/80 dark:bg-white/[0.03] text-zinc-600 dark:text-zinc-400 border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Interactive Master-Detail Component Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          
          {/* Left Column: Component List */}
          <div className="lg:col-span-6 space-y-2.5 max-h-[580px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800">
            {filtered.map((item) => {
              const isSelected = activeComp.component === item.component;
              return (
                <button
                  key={item.component}
                  onClick={() => setActiveComp(item)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group relative ${
                    isSelected
                      ? 'bg-white dark:bg-[#3D1E1A]/40 dark:backdrop-blur-md border-[#FF5500] dark:border-[#FF9E8C]/60 shadow-md dark:shadow-[0_4px_20px_rgba(255,158,140,0.15)] text-zinc-950 dark:text-white'
                      : 'bg-white/70 dark:bg-[#251E1C]/40 dark:backdrop-blur-md border-black/10 dark:border-white/5 hover:border-black/20 dark:hover:border-white/15 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#FF5500] dark:text-[#FF9E8C] uppercase tracking-widest block font-semibold">
                      {item.connection}
                    </span>
                    <h4 className="text-sm font-semibold text-zinc-950 dark:text-white tracking-tight">
                      {item.component}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-[#8E827B] line-clamp-1 font-normal">
                      {item.purpose}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-zinc-700 dark:text-[#30D158] bg-black/5 dark:bg-[#30D158]/10 px-2.5 py-1 rounded-full border border-black/10 dark:border-[#30D158]/20 shrink-0 ml-3 font-semibold">
                    {item.priceINR}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Component Deep Dive Spec Card */}
          <div className="lg:col-span-6 bg-white dark:bg-[#251E1C]/65 dark:backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 text-left space-y-6 relative shadow-lg dark:shadow-[0_12px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors">
            <ReticleCorner size={10} className="text-[#FF5500] dark:text-[#FF9E8C]" />

            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
              <span className="text-[10px] font-mono text-[#FF5500] dark:text-[#FF9E8C] uppercase tracking-[0.14em] font-semibold">
                HARDWARE DATASHEET // PINOUT
              </span>
              <span className="text-xs font-mono text-zinc-700 dark:text-[#30D158] bg-black/5 dark:bg-[#30D158]/10 px-3 py-1 rounded-full border border-black/10 dark:border-[#30D158]/20 font-semibold">
                BOM Range: {activeComp.priceINR}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-zinc-950 dark:text-white tracking-tight">
                {activeComp.component}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-[#C8BDB6] leading-relaxed font-normal">
                {activeComp.purpose}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="bg-[#F4F5F7] dark:bg-[#1A1614]/70 dark:backdrop-blur-md border border-black/10 dark:border-white/8 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                  Hardware Bus Link & Interface:
                </span>
                <span className="text-sm font-mono text-[#059669] dark:text-[#30D158] font-semibold">
                  {activeComp.connection}
                </span>
              </div>

              <div className="bg-[#F4F5F7] dark:bg-[#1A1614]/70 dark:backdrop-blur-md border border-black/10 dark:border-white/8 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                  Perception & Safety Function:
                </span>
                <span className="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed font-normal">
                  {activeComp.role}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span>Host Architecture:</span>
              <span className="text-zinc-950 dark:text-white">Raspberry Pi 5 + Hailo-8 Bus Tree</span>
            </div>
          </div>
        </div>

        {/* Complete Hardware Wiring Table */}
        <div className="bg-white dark:bg-[#251E1C]/65 dark:backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 text-left space-y-5 relative shadow-lg dark:shadow-[0_12px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors">
          <ReticleCorner size={10} className="text-[#0284C7] dark:text-[#30D158]" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#0284C7] dark:text-[#30D158] font-semibold">
                INTERCONNECT ARCHITECTURE
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold text-zinc-950 dark:text-white tracking-tight mt-0.5">
                Full System Wiring & Communication Buses
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full border border-black/10 dark:border-white/10 uppercase tracking-wider">
              Source: PDF Page 4–5
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/15 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Hardware Module</th>
                  <th className="py-3 px-3">Interface / Bus Link</th>
                  <th className="py-3 px-3">Protocol / Bandwidth</th>
                  <th className="py-3 px-3 text-[#059669] dark:text-[#00F5A0]">System Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10 text-zinc-700 dark:text-zinc-300">
                <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-semibold text-zinc-950 dark:text-white">Sony IMX708 Camera</td>
                  <td className="py-3 px-3 text-[#0284C7] dark:text-[#00D2FF]">CSI Camera Port</td>
                  <td className="py-3 px-3">MIPI CSI-2 2-Lane</td>
                  <td className="py-3 px-3">Feeds raw frames (~30 FPS) to Hailo-8 NPU via DMA</td>
                </tr>
                <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-semibold text-zinc-950 dark:text-white">Hailo-8 AI HAT+</td>
                  <td className="py-3 px-3 text-[#FF5500] dark:text-[#FF7733]">PCIe Gen 3 ×1</td>
                  <td className="py-3 px-3">8.0 GT/s High-Speed Bus</td>
                  <td className="py-3 px-3">Runs all AI vision inference locally (26 TOPS)</td>
                </tr>
                <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-semibold text-zinc-950 dark:text-white">TF-Luna LiDAR</td>
                  <td className="py-3 px-3 text-[#FF5500] dark:text-[#FF7733]">UART / Serial</td>
                  <td className="py-3 px-3">TX/RX 115200 Baud</td>
                  <td className="py-3 px-3">Streams continuous distance readings (0.2–12m @ 100Hz)</td>
                </tr>
                <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-semibold text-zinc-950 dark:text-white">4x HC-SR04 Sonar</td>
                  <td className="py-3 px-3 text-[#D97706] dark:text-[#FFB800]">GPIO Pins</td>
                  <td className="py-3 px-3">Trigger + Echo Digital</td>
                  <td className="py-3 px-3">Acoustic backup for glass and transparent barriers</td>
                </tr>
                <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-semibold text-zinc-950 dark:text-white">MPU6050 IMU</td>
                  <td className="py-3 px-3 text-[#059669] dark:text-[#00F5A0]">I2C Bus</td>
                  <td className="py-3 px-3">400kHz Fast Mode</td>
                  <td className="py-3 px-3">Torso pitch/roll tracking & fall emergency shock detection</td>
                </tr>
                <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-semibold text-zinc-950 dark:text-white">NEO-6M GPS</td>
                  <td className="py-3 px-3 text-purple-600 dark:text-purple-400">UART Serial</td>
                  <td className="py-3 px-3">9600 Baud NMEA</td>
                  <td className="py-3 px-3">Provides live latitude and longitude for emergency dispatch</td>
                </tr>
                <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-semibold text-zinc-950 dark:text-white">Bone-Conduction Audio</td>
                  <td className="py-3 px-3 text-blue-600 dark:text-blue-400">USB / I2S</td>
                  <td className="py-3 px-3">Digital Audio Stream</td>
                  <td className="py-3 px-3">Open-ear voice feedback through temporal bone transducers</td>
                </tr>
                <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-semibold text-zinc-950 dark:text-white">4x Vibration Motors</td>
                  <td className="py-3 px-3 text-zinc-600 dark:text-zinc-300">GPIO Transistors</td>
                  <td className="py-3 px-3">PWM Frequency Drive</td>
                  <td className="py-3 px-3">Directional haptic cues (left/right/upper/lower)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
