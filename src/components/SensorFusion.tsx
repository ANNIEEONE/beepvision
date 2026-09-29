import React, { useState } from 'react';
import { Camera, Radio, Compass, Navigation, Mic, Activity, Check, X } from 'lucide-react';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';

export const SensorFusion: React.FC = () => {
  const [activeSensor, setActiveSensor] = useState<string>('lidar');

  const sensors = [
    {
      id: 'camera',
      name: 'Sony IMX708 Autofocus',
      type: 'RGB Wide-Angle Optics',
      bus: 'CSI-2 2-Lane MIPI Port',
      icon: Camera,
      color: 'text-[#0088CC] dark:text-[#00D2FF]',
      borderColor: 'border-[#0088CC]/40 dark:border-[#00D2FF]/40',
      bgColor: 'bg-[#0088CC]/10 dark:bg-[#00D2FF]/10',
      whatItSees: 'Dense 2D visual fields, object semantics (curbs, doors, stairs, text labels, vehicles).',
      failureMode: 'Blinded by absolute zero-lux pitch darkness, heavy fog, steam, or direct solar glare.',
      fusionRole: 'Runs YOLOv8 and depth estimation on Hailo-8; cross-checked continuously against laser ground-truth.',
      telemetry: '30 FPS · 120° FOV · 1080p'
    },
    {
      id: 'lidar',
      name: 'TF-Luna Solid-State LiDAR',
      type: '850nm Infrared Time-of-Flight (ToF)',
      bus: 'UART / Serial @ 115200 Baud',
      icon: Radio,
      color: 'text-red-600 dark:text-red-400',
      borderColor: 'border-red-500/40',
      bgColor: 'bg-red-500/10',
      whatItSees: 'Continuous millimeter-accurate line-of-sight distance readings from 0.2m to 12.0m.',
      failureMode: 'Narrow 2° collimated beam can miss thin hanging wires, low steps, or transparent clean glass.',
      fusionRole: 'Provides absolute ground-truth distance that calibrates and cross-checks camera depth estimation.',
      telemetry: '100Hz sample rate · 850nm VCSEL · ±6cm error'
    },
    {
      id: 'ultrasonic',
      name: '4x HC-SR04 Sonar Array',
      type: '40kHz Acoustic Transducers',
      bus: 'GPIO Trigger / Echo Array',
      icon: Activity,
      color: 'text-[#FF5500] dark:text-[#FFB800]',
      borderColor: 'border-[#FF5500]/40 dark:border-[#FFB800]/40',
      bgColor: 'bg-[#FF5500]/10 dark:bg-[#FFB800]/10',
      whatItSees: 'Acoustic proximity cones placed at 4 chest-height quadrants (Front L/R, Peripheral L/R).',
      failureMode: 'Wind turbulence can distort acoustic wave fronts; sound reflects away from oblique surfaces.',
      fusionRole: 'Fills peripheral blind spots and detects clear glass doors/windows that optical lasers pass through.',
      telemetry: '40kHz pulses · 15° cone per corner · 2cm–4m'
    },
    {
      id: 'imu',
      name: 'MPU6050 6-Axis IMU',
      type: '3-Axis Gyro + 3-Axis Accelerometer',
      bus: 'I2C Bus (0x68 Fast-Mode)',
      icon: Compass,
      color: 'text-[#00B368] dark:text-[#00F5A0]',
      borderColor: 'border-[#00B368]/40 dark:border-[#00F5A0]/40',
      bgColor: 'bg-[#00B368]/10 dark:bg-[#00F5A0]/10',
      whatItSees: 'Live torso tilt, walking cadence pitch, and sudden impact freefall/shock signatures.',
      failureMode: 'Slow angular drift over long walking durations without magnetometric compensation.',
      fusionRole: 'Stabilizes camera perspective angle via RANSAC filtering and triggers fall detection SOS.',
      telemetry: '±16g range · 200Hz I2C stream'
    },
    {
      id: 'gps',
      name: 'NEO-6M Satellite Receiver',
      type: 'Satellite Geolocation Positioning',
      bus: 'UART Serial Bus @ 9600 Baud',
      icon: Navigation,
      color: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-500/10',
      whatItSees: 'Global latitude and longitude coordinates for emergency SMS transmission.',
      failureMode: 'Signal blocked inside subterranean metro stations or dense urban canyon alleys.',
      fusionRole: 'Latches last-known valid coordinates so emergency alerts transmit exact location even when signal degrades.',
      telemetry: '50-channel receiver · 2.5m CEP accuracy'
    },
    {
      id: 'mic',
      name: 'Dual MEMS Acoustic Mic',
      type: 'Offline Speech Ingestion',
      bus: 'I2S / USB Digital Audio',
      icon: Mic,
      color: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-500/40',
      bgColor: 'bg-blue-500/10',
      whatItSees: 'Offline vocal queries ("Read this medicine label", "What is in front of me?").',
      failureMode: 'High ambient noise in screaming subway platforms or heavy intersection traffic.',
      fusionRole: 'Processed by local lightweight speech model with zero cellular internet connection needed.',
      telemetry: '16kHz acoustic sampling · Noise-cancelling'
    }
  ];

  const current = sensors.find((s) => s.id === activeSensor) || sensors[0];

  return (
    <section id="sensors" className="scroll-mt-28 py-24 bg-[#F8F9FA] dark:bg-[#1A1614] border-t border-black/10 dark:border-white/10 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left mb-16 space-y-4">
          <TechnicalBadge number="03" label="Multi-Modal Sensory Layer" color="cyan" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-zinc-950 dark:text-white tracking-[-0.03em] leading-[1.05]">
            One sensor guesses.<br />
            <span className="text-[#0088CC] dark:text-[#30D158]">Fusion verifies.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-700 dark:text-[#C8BDB6] leading-relaxed font-normal">
            No single sensor modality is safe in an unpredictable city. A camera is blinded by darkness or fog.
            A LiDAR laser beam passes through clean glass doors. An ultrasonic sonar is deafened by wind turbulence.
            BeepVision fuses 6 independent modalities into unified truth.
          </p>
        </div>

        {/* 2-Column Sensor Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Sensor Selector Buttons */}
          <div className="lg:col-span-5 space-y-2.5">
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-zinc-500 block mb-2">
              Integrated Sensory Inputs
            </span>

            {sensors.map((sensor) => {
              const Icon = sensor.icon;
              const isSelected = activeSensor === sensor.id;
              return (
                <button
                  key={sensor.id}
                  onClick={() => setActiveSensor(sensor.id)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all border flex items-center justify-between group relative ${
                    isSelected
                      ? 'bg-white dark:bg-[#3D1E1A]/40 dark:backdrop-blur-md border-black/20 dark:border-[#FF9E8C]/40 shadow-md dark:shadow-[0_4px_20px_rgba(255,158,140,0.15)] text-zinc-950 dark:text-white'
                      : 'bg-white dark:bg-[#251E1C]/40 dark:backdrop-blur-md border-black/10 dark:border-white/5 hover:border-black/20 dark:hover:border-white/15 text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected ? sensor.bgColor + ' ' + sensor.color : 'bg-black/5 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block">
                        {sensor.bus.split(' ')[0]}
                      </span>
                      <h4 className="text-sm font-medium transition-colors">
                        {sensor.name}
                      </h4>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${isSelected ? sensor.borderColor + ' ' + sensor.color : 'border-black/10 dark:border-white/10 text-zinc-500 dark:text-zinc-400'}`}>
                    {sensor.telemetry.split('·')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Sensor Detail HUD Card */}
          <div className="lg:col-span-7 bg-white dark:bg-[#251E1C]/65 dark:backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 relative text-left shadow-lg dark:shadow-[0_12px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] space-y-6">
            <ReticleCorner size={10} className="text-[#0088CC] dark:text-[#30D158]" />

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#0088CC] dark:text-[#30D158] font-semibold">
                  {current.type}
                </span>
                <h3 className="text-2xl font-semibold text-zinc-950 dark:text-white tracking-tight mt-0.5">{current.name}</h3>
              </div>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-black/5 dark:bg-[#30D158]/10 border border-black/10 dark:border-[#30D158]/20 text-zinc-700 dark:text-[#30D158]">
                {current.bus}
              </span>
            </div>

            {/* What it sees vs How it fails */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/[0.03] dark:bg-[#1A1614]/70 dark:backdrop-blur-md border border-black/10 dark:border-white/8 space-y-1">
                <span className="text-[11px] font-mono text-[#00B368] dark:text-[#30D158] uppercase tracking-wider block font-semibold">
                  Primary Perception Capability
                </span>
                <p className="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed font-normal">{current.whatItSees}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-500/10 dark:bg-[#3D1E1A]/40 border border-red-500/20 dark:border-[#FF9E8C]/30 space-y-1">
                  <span className="text-[11px] font-mono text-red-600 dark:text-[#FF9E8C] uppercase tracking-wider block font-semibold flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5" /> Environmental Failure Mode
                  </span>
                  <p className="text-xs text-zinc-700 dark:text-[#C8BDB6] leading-relaxed font-normal">{current.failureMode}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#0088CC]/10 dark:bg-[#30D158]/10 border border-[#0088CC]/25 dark:border-[#30D158]/25 space-y-1">
                  <span className="text-[11px] font-mono text-[#0088CC] dark:text-[#30D158] uppercase tracking-wider block font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Multi-Sensor Mitigation
                  </span>
                  <p className="text-xs text-zinc-700 dark:text-zinc-200 leading-relaxed font-normal">{current.fusionRole}</p>
                </div>
              </div>
            </div>

            {/* Real-Time Telemetry Spec */}
            <div className="p-3.5 rounded-xl bg-[#F4F5F7] dark:bg-[#1A1614]/70 dark:backdrop-blur-md border border-black/10 dark:border-white/8 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Hardware Channel:</span>
              <span className="text-[#00B368] dark:text-[#30D158] font-semibold">{current.telemetry}</span>
            </div>
          </div>
        </div>

        {/* Anime.js Kinetic Radar Visualizer Strip */}
        <div className="bg-white dark:bg-[#251E1C]/65 dark:backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 text-left relative overflow-hidden shadow-lg dark:shadow-[0_12px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <ReticleCorner size={10} className="text-[#FF5500] dark:text-[#FF7733]" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#FF5500] dark:text-[#FF7733] font-bold">
                LIVE SENSORY COVERAGE MAP
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold text-zinc-950 dark:text-white tracking-tight mt-1">
                Forward 120° Dynamic Safety Zone
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF5500] dark:bg-[#FF7733]" /> LiDAR Centerline (12m)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0088CC] dark:bg-[#00D2FF]" /> Optical Frustum (120°)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FFB800]" /> Peripheral Sonar (4m)
              </span>
            </div>
          </div>

          {/* Interactive Radar Visualizer */}
          <div className="relative h-64 w-full bg-[#030406] border border-black/10 dark:border-white/10 rounded-xl overflow-hidden flex items-center justify-center">
            {/* Concentric distance arcs */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-96 h-96 border border-white/10 rounded-full" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 h-64 border border-white/10 rounded-full" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-32 border border-white/15 rounded-full" />
            
            {/* Range distance labels */}
            <span className="absolute bottom-48 left-1/2 -translate-x-1/2 text-[10px] font-mono text-zinc-400">8.0 METERS</span>
            <span className="absolute bottom-32 left-1/2 -translate-x-1/2 text-[10px] font-mono text-zinc-400">4.0 METERS</span>
            <span className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[10px] font-mono text-zinc-400">2.0 METERS</span>

            {/* Sweep radar beam */}
            <div className="absolute bottom-4 left-1/2 w-72 h-72 -translate-x-1/2 origin-bottom radar-sweep pointer-events-none opacity-40">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-[#00D2FF]/20 to-transparent clip-triangle" />
            </div>

            {/* Center Wearable Emitter Marker */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="w-4 h-4 rounded-full bg-[#FF7733] shadow-[0_0_14px_#FF7733] animate-pulse" />
              <span className="text-[9px] font-mono text-zinc-400 uppercase mt-1 tracking-widest">BEEPVISION CORE</span>
            </div>

            {/* Simulated Tracked Obstacles */}
            <div className="absolute bottom-36 left-[38%] flex items-center gap-1.5 animate-bounce">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_8px_#F87171]" />
              <span className="text-[10px] font-mono text-white bg-black/70 px-1.5 py-0.5 rounded border border-white/20">
                VEHICLE · 4.2m · CLOSING
              </span>
            </div>

            <div className="absolute bottom-44 left-[64%] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F5A0] shadow-[0_0_8px_#00F5A0]" />
              <span className="text-[10px] font-mono text-white bg-black/70 px-1.5 py-0.5 rounded border border-white/20">
                PEDESTRIAN · 6.8m · CLEAR
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
