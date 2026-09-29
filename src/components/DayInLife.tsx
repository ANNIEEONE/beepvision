import React, { useState } from 'react';
import { Sun, Footprints, Coffee, AlertCircle, Moon, ShieldAlert, Volume2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';

export const DayInLife: React.FC = () => {
  const [selectedMilestone, setSelectedMilestone] = useState<number>(0);
  const [playingTone, setPlayingTone] = useState<boolean>(false);

  const milestones = [
    {
      time: "08:00 AM",
      code: "T+00:00",
      phase: "Morning Departure",
      title: "Tactile Harness Donning & NPU Boot",
      icon: Sun,
      location: "Home Foyer",
      story:
        "The user clips on the ergonomic 3D-printed chest harness. The dual-arm bone-conduction transducers sit comfortably behind each ear, resting against the temporal skull bones without covering the ear canal. The battery report chirps softly: 'Battery 98%. Hailo NPU online.'",
      cue: "\"System ready. Hailo NPU active.\"",
      freq: 880,
      sensorsActive: "Sony IMX219 30 FPS · IMU Baseline Calibrated",
      hapticStatus: "Standby (100% Calibrated)",
      telemetry: {
        npuLoad: "12%",
        powerDraw: "6.2W",
        temp: "37.4°C",
        earCanal: "100% Open"
      }
    },
    {
      time: "08:30 AM",
      code: "T+00:30",
      phase: "Sidewalk Navigation",
      title: "Dual-Modal Tactile Guidance",
      icon: Footprints,
      location: "Morning Commute",
      story:
        "While walking toward the metro, the white cane taps the sidewalk for ground tactile feel. Simultaneously, BeepVision’s TF-Luna LiDAR scans ahead for hanging construction scaffolding and delivery truck rear gates. A gentle right-side haptic pulse whispers a slight course correction around a parked bicycle.",
      cue: "Silent gentle vibration pulse on right harness motor",
      freq: 587,
      sensorsActive: "LiDAR Ranging (100Hz) + 4-Corner Sonar Active",
      hapticStatus: "Right Motor 220Hz Pulse (Zone 2)",
      telemetry: {
        npuLoad: "38%",
        powerDraw: "7.8W",
        temp: "39.1°C",
        earCanal: "100% Open"
      }
    },
    {
      time: "11:15 AM",
      code: "T+03:15",
      phase: "Local Cafe & Transit",
      title: "On-Demand Offline OCR Reading",
      icon: Coffee,
      location: "Espresso Bar & Station",
      story:
        "At the counter, the user holds up a wrapped pastry and asks: 'Read this.' The offline Vosk speech module detects the wake phrase, PaddleOCR extracts the label in 180ms, and Piper neural TTS speaks softly into the temporal skull bone: 'Blueberry oat muffin. Contains almonds.'",
      cue: "\"Blueberry oat muffin. Contains almonds.\"",
      freq: 1046,
      sensorsActive: "PaddleOCR (ONNX) + Piper TTS + Vosk Speech",
      hapticStatus: "Quiet State (Audio Priority)",
      telemetry: {
        npuLoad: "64%",
        powerDraw: "9.2W",
        temp: "41.2°C",
        earCanal: "100% Open"
      }
    },
    {
      time: "02:45 PM",
      code: "T+06:45",
      phase: "Busy Intersection",
      title: "The Silent Electric Vehicle Hazard",
      icon: AlertCircle,
      location: "Multi-Lane Crosswalk",
      story:
        "Waiting at a multi-lane crossing, a silent electric scooter makes a fast right turn from behind a parked van. The cane cannot feel what hasn't touched the ground yet. BeepVision calculates closing speed (+4.2 m/s at 1.2m), suppresses all background chatter, and fires an urgent directional voice cue.",
      cue: "\"Car, left, close!\" (Urgent Left Haptic Burst)",
      freq: 1760,
      sensorsActive: "Alert Arbitration Engine TRIGGERED (Class A)",
      hapticStatus: "Left Motor 320Hz Max Burst (Zone 1)",
      telemetry: {
        npuLoad: "88%",
        powerDraw: "10.4W",
        temp: "42.8°C",
        earCanal: "100% Open"
      }
    },
    {
      time: "06:10 PM",
      code: "T+10:10",
      phase: "Evening & Sudden Rain",
      title: "Night Visibility & Weather Re-Weighting",
      icon: Moon,
      location: "Evening Drizzle",
      story:
        "As sunset fades and a light drizzle begins, the integrated ambient light sensor auto-illuminates the amber 590nm LED ring around the unit's rim, providing passive visibility to motorists. The IP65 silicone gasket repels rain, and fusion logic automatically boosts ultrasonic weighting over optical scattering.",
      cue: "Amber LED Ring illuminated · Ultrasonic weighting elevated to 0.70",
      freq: 784,
      sensorsActive: "IP65 Weather Re-weighting + Ambient Luminescence Ring",
      hapticStatus: "Continuous Gentle Ground Ping",
      telemetry: {
        npuLoad: "42%",
        powerDraw: "8.1W",
        temp: "38.6°C",
        earCanal: "100% Open"
      }
    },
    {
      time: "SAFETY NET",
      code: "EMERGENCY",
      phase: "Fall Distress Protocol",
      title: "Autonomous Fall Shock Dispatch",
      icon: ShieldAlert,
      location: "Unexpected Slip on Wet Metal",
      story:
        "The user slips on an unseen oily manhole cover. The MPU6050 IMU detects a 4.2G impact shock followed by 5 seconds of complete stillness. BeepVision begins a calm 15-second audible cancellation countdown before retrieving NEO-6M satellite coordinates and dispatching emergency SOS SMS.",
      cue: "\"Fall detected. Emergency SOS in 15 seconds. Press button to cancel.\"",
      freq: 1318,
      sensorsActive: "6-DOF IMU Shock Vector + NEO-6M GPS Lock",
      hapticStatus: "Warning Beacon Pulse (All Zones)",
      telemetry: {
        npuLoad: "18%",
        powerDraw: "7.1W",
        temp: "37.9°C",
        earCanal: "100% Open"
      }
    }
  ];

  const current = milestones[selectedMilestone];

  const playTone = (freq: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      setPlayingTone(true);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.36);

      setTimeout(() => setPlayingTone(false), 380);
    } catch {
      setPlayingTone(false);
    }
  };

  return (
    <section id="day-in-life" className="scroll-mt-28 py-28 bg-[#F8F9FA] dark:bg-[#1A1614] border-t border-black/10 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 antimetal-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl text-left mb-16 space-y-4">
          <TechnicalBadge number="09" label="24-Hour Operational Profile" color="orange" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-zinc-950 dark:text-white tracking-[-0.03em] leading-[1.05]">
            A day with BeepVision.<br />
            <span className="text-[#FF5500] dark:text-[#FF9E8C]">Continuous second sight.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-[#C8BDB6] font-normal leading-relaxed">
            Assistive robotics shouldn't feel like a medical contraption. It must behave like an air-gapped,
            transparent copilot that protects situational awareness from sunrise navigation to night rain.
          </p>
        </div>

        {/* Milestone Tab Selector (Antimetal Bento Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {milestones.map((m, idx) => {
            const isSelected = selectedMilestone === idx;
            const Icon = m.icon;
            return (
              <button
                key={m.time}
                onClick={() => setSelectedMilestone(idx)}
                className={`relative p-4 rounded-xl border text-left transition-all flex flex-col justify-between h-36 ${
                  isSelected
                    ? 'bg-white dark:bg-[#3D1E1A]/40 dark:backdrop-blur-md border-[#FF5500] dark:border-[#FF9E8C]/60 shadow-md dark:shadow-[0_4px_20px_rgba(255,158,140,0.15)] ring-1 ring-[#FF5500]/40 dark:ring-[#FF9E8C]/40'
                    : 'bg-white/70 dark:bg-[#251E1C]/40 dark:backdrop-blur-md border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 hover:bg-white dark:hover:bg-[#251E1C]/70'
                }`}
                aria-pressed={isSelected}
              >
                {isSelected && <ReticleCorner size={8} />}
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-mono tracking-wider ${isSelected ? 'text-[#FF5500] dark:text-[#FF9E8C] font-bold' : 'text-zinc-500'}`}>
                    {m.time}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-[#FF5500] dark:text-[#FF9E8C]' : 'text-zinc-400 dark:text-zinc-500'}`} />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider">{m.phase}</span>
                  <span className={`text-xs font-semibold block leading-snug truncate ${isSelected ? 'text-zinc-950 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
                    {m.title}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className={isSelected ? 'text-[#059669] dark:text-[#30D158]' : 'text-zinc-500 dark:text-zinc-600'}>{m.code}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] dark:bg-[#FF9E8C] animate-ping" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Cinematic Narrative Stage Display */}
        <div className="relative bg-white dark:bg-[#251E1C]/65 dark:backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-10 text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch shadow-lg dark:shadow-[0_12px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors">
          <ReticleCorner size={14} />

          {/* Left Narrative Column */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono text-[#FF5500] dark:text-[#FF9E8C] bg-[#FF5500]/10 dark:bg-[#FF9E8C]/15 border border-[#FF5500]/25 dark:border-[#FF9E8C]/30 px-3 py-1 rounded font-semibold">
                  TIMELINE // {current.time} ({current.code})
                </span>
                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 px-2.5 py-1 rounded">
                  LOC: {current.location}
                </span>
                <span className="text-xs font-mono text-[#0284C7] dark:text-[#30D158] bg-[#0284C7]/10 dark:bg-[#30D158]/10 border border-[#0284C7]/20 dark:border-[#30D158]/20 px-2.5 py-1 rounded font-semibold">
                  {current.phase}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-semibold text-zinc-950 dark:text-white tracking-[-0.03em]">
                {current.title}
              </h3>

              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                {current.story}
              </p>
            </div>

            {/* Sensory Experience Box with Audio Trigger */}
            <div className="bg-[#F4F5F7] dark:bg-[#1A1614]/70 dark:backdrop-blur-md border border-black/10 dark:border-white/8 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-600 dark:text-[#C8BDB6] uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF5500] dark:text-[#FF9E8C]" />
                  User Sensory Experience (Audio & Haptic Signal)
                </span>
                <button
                  onClick={() => playTone(current.freq)}
                  disabled={playingTone}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF5500]/10 dark:bg-[#FF9E8C]/15 hover:bg-[#FF5500]/20 dark:hover:bg-[#FF9E8C]/25 border border-[#FF5500]/30 dark:border-[#FF9E8C]/30 text-[10px] font-mono text-[#FF5500] dark:text-[#FF9E8C] transition-colors cursor-pointer font-semibold"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{playingTone ? 'Transmitting...' : 'Play Audio Cue'}</span>
                </button>
              </div>

              <div className="p-3.5 bg-white dark:bg-[#1A1614]/90 border border-black/10 dark:border-white/8 rounded-lg">
                <span className="text-sm font-mono text-zinc-950 dark:text-[#FF9E8C] font-semibold leading-relaxed block">
                  {current.cue}
                </span>
              </div>
            </div>
          </div>

          {/* Right Hardware Telemetry Column */}
          <div className="lg:col-span-4 bg-[#F4F5F7] dark:bg-[#1A1614]/70 dark:backdrop-blur-md border border-black/10 dark:border-white/8 rounded-xl p-6 flex flex-col justify-between space-y-4 font-mono text-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
                <span className="text-zinc-600 dark:text-zinc-400 uppercase text-[10px] tracking-widest">Live Wearable State</span>
                <span className="flex items-center gap-1.5 text-[#059669] dark:text-[#30D158] text-[10px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#059669] dark:bg-[#30D158] animate-pulse" />
                  TELEMETRY
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Active Sensor Pipeline:</div>
                <div className="text-[#059669] dark:text-[#30D158] font-semibold text-xs leading-relaxed bg-white dark:bg-[#1A1614]/90 p-2.5 rounded border border-black/5 dark:border-white/8">
                  {current.sensorsActive}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Haptic Actuator Array:</div>
                <div className="text-[#0284C7] dark:text-[#FF9E8C] font-semibold text-xs bg-white dark:bg-[#1A1614]/90 p-2.5 rounded border border-black/5 dark:border-white/8">
                  {current.hapticStatus}
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="pt-3 border-t border-black/10 dark:border-white/10 grid grid-cols-2 gap-3 text-[11px]">
              <div className="bg-white dark:bg-[#1A1614]/90 p-2.5 rounded-lg border border-black/5 dark:border-white/8">
                <div className="text-zinc-500 dark:text-zinc-400 text-[10px]">Hailo NPU Load</div>
                <div className="text-zinc-950 dark:text-white font-bold">{current.telemetry.npuLoad}</div>
              </div>
              <div className="bg-white dark:bg-[#1A1614]/90 p-2.5 rounded-lg border border-black/5 dark:border-white/8">
                <div className="text-zinc-500 dark:text-zinc-400 text-[10px]">Power Draw</div>
                <div className="text-zinc-950 dark:text-white font-bold">{current.telemetry.powerDraw}</div>
              </div>
              <div className="bg-white dark:bg-[#1A1614]/90 p-2.5 rounded-lg border border-black/5 dark:border-white/8">
                <div className="text-zinc-500 dark:text-zinc-400 text-[10px]">Core Temp</div>
                <div className="text-zinc-950 dark:text-white font-bold">{current.telemetry.temp}</div>
              </div>
              <div className="bg-white dark:bg-[#1A1614]/90 p-2.5 rounded-lg border border-black/5 dark:border-white/8">
                <div className="text-zinc-500 dark:text-zinc-400 text-[10px]">Ear Canal State</div>
                <div className="text-[#059669] dark:text-[#30D158] font-bold">{current.telemetry.earCanal}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
