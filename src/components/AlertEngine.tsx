import React, { useState } from 'react';
import { ShieldAlert, Volume2, Radio, Play, CheckCircle2, XCircle, ArrowRight, Zap } from 'lucide-react';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';

interface Hazard {
  id: string;
  name: string;
  distance: number;
  direction: 'left' | 'center' | 'right';
  speed: string;
  urgencyScore: number;
  status: 'critical' | 'suppressed' | 'ignored';
  voiceCue?: string;
  hapticZone?: 'left' | 'right' | 'front' | 'back';
}

export const AlertEngine: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('vehicle');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const scenarios: Record<string, { title: string; desc: string; hazards: Hazard[]; voiceAlert: string; freq: number }> = {
    vehicle: {
      title: "Fast Approaching Vehicle at Crosswalk",
      desc: "An electric car turns rapidly toward the user's crossing path while multiple stationary obstacles surround the user.",
      voiceAlert: "Car, left, close!",
      freq: 1760,
      hazards: [
        {
          id: 'h1',
          name: 'Silent Electric Sedan',
          distance: 1.2,
          direction: 'left',
          speed: '+4.5 m/s closing',
          urgencyScore: 98,
          status: 'critical',
          voiceCue: "Car, left, close!",
          hapticZone: 'left'
        },
        {
          id: 'h2',
          name: 'Traffic Signal Pole',
          distance: 2.1,
          direction: 'center',
          speed: '0.0 m/s static',
          urgencyScore: 42,
          status: 'suppressed'
        },
        {
          id: 'h3',
          name: 'Waiting Pedestrian',
          distance: 3.4,
          direction: 'right',
          speed: '+0.2 m/s slow',
          urgencyScore: 28,
          status: 'suppressed'
        },
        {
          id: 'h4',
          name: 'Parked Vehicle',
          distance: 5.2,
          direction: 'right',
          speed: '0.0 m/s static',
          urgencyScore: 12,
          status: 'ignored'
        }
      ]
    },
    branch: {
      title: "Overhead Tree Branch on Sidewalk",
      desc: "User walks forward toward a low-hanging tree branch at forehead level while other pedestrians stroll nearby.",
      voiceAlert: "Branch ahead, 1.8 meters.",
      freq: 880,
      hazards: [
        {
          id: 'h1',
          name: 'Low Tree Branch',
          distance: 1.8,
          direction: 'center',
          speed: '+1.1 m/s (walking pace)',
          urgencyScore: 88,
          status: 'critical',
          voiceCue: "Branch ahead, 1.8 meters.",
          hapticZone: 'front'
        },
        {
          id: 'h2',
          name: 'Sidewalk Curb',
          distance: 2.5,
          direction: 'right',
          speed: '+1.1 m/s',
          urgencyScore: 35,
          status: 'suppressed'
        },
        {
          id: 'h3',
          name: 'Oncoming Walker',
          distance: 4.0,
          direction: 'left',
          speed: '+0.8 m/s',
          urgencyScore: 22,
          status: 'ignored'
        }
      ]
    },
    crowd: {
      title: "Crowded Train Concourse",
      desc: "Multiple walking pedestrians moving at varied angles. The engine filters out lateral strollers and isolates a head-on collision vector.",
      voiceAlert: "Person approaching directly, 2 meters.",
      freq: 880,
      hazards: [
        {
          id: 'h1',
          name: 'Head-On Commuter',
          distance: 2.0,
          direction: 'center',
          speed: '+1.4 m/s closing',
          urgencyScore: 78,
          status: 'critical',
          voiceCue: "Person ahead, 2 meters.",
          hapticZone: 'front'
        },
        {
          id: 'h2',
          name: 'Luggage Roller Left',
          distance: 2.3,
          direction: 'left',
          speed: '+0.4 m/s lateral',
          urgencyScore: 38,
          status: 'suppressed'
        },
        {
          id: 'h3',
          name: 'Ticketing Kiosk',
          distance: 3.8,
          direction: 'right',
          speed: '0.0 m/s static',
          urgencyScore: 19,
          status: 'ignored'
        }
      ]
    }
  };

  const current = scenarios[selectedScenario] || scenarios.vehicle;
  const criticalHazard = current.hazards.find((h) => h.status === 'critical') || current.hazards[0];

  // Web Audio API Synthesizer for Bone Conduction Simulation
  const playAlertTone = (freq: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // AudioContext policy fallback
    }
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    playAlertTone(current.freq);

    setTimeout(() => {
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <section id="alert-engine" className="scroll-mt-28 py-24 bg-[#F8F9FA] dark:bg-[#030406] border-t border-dashed border-black/10 dark:border-white/10 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left mb-16 space-y-4">
          <TechnicalBadge number="06" label="REAL-TIME THREAT ARBITRATION" color="orange" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-zinc-950 dark:text-white tracking-[-0.03em] leading-[1.05]">
            ONE CRITICAL WARNING.<br />
            <span className="text-[#FF5500] dark:text-[#FF7733]">ZERO SENSORY OVERLOAD.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
            If an assistive device beeps at 10 obstacles simultaneously, the user is blinded by sound.
            BeepVision’s Alert Urgency Engine calculates threat vectors continuously, suppresses secondary hazards,
            and delivers dual-channel bone-conduction and directional haptic guidance.
          </p>
        </div>

        {/* Mathematical Formula Card (Antimetal Blueprint Style) */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#06080D] border border-dashed border-black/10 dark:border-white/15 relative shadow-md dark:shadow-xl text-left transition-colors">
          <ReticleCorner size={10} className="text-[#059669] dark:text-[#00F5A0]" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-4 mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#059669] dark:text-[#00F5A0]">
                ALGORITHMIC FORMULATION
              </span>
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-white tracking-tight mt-0.5">
                Dynamic Urgency Score Formulation
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full border border-black/10 dark:border-white/10 uppercase tracking-wider">
              ISO 26262 ADAS Logic
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#F4F5F7] dark:bg-black/50 border border-black/10 dark:border-white/10 space-y-1">
              <span className="text-[#FF5500] dark:text-[#FF7733] font-bold">1. Proximity Term</span>
              <p className="text-zinc-800 dark:text-zinc-300 font-normal">w_dist × (1 / max(d, 0.1))</p>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block pt-1">Scales hyperbolically as objects get closer</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F5F7] dark:bg-black/50 border border-black/10 dark:border-white/10 space-y-1">
              <span className="text-[#059669] dark:text-[#00F5A0] font-bold">2. Velocity Term</span>
              <p className="text-zinc-800 dark:text-zinc-300 font-normal">w_speed × max(0, -v_rel)</p>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block pt-1">Heavily penalizes closing velocity (e.g. oncoming cars)</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F5F7] dark:bg-black/50 border border-black/10 dark:border-white/10 space-y-1">
              <span className="text-[#0284C7] dark:text-[#00D2FF] font-bold">3. Threat Severity</span>
              <p className="text-zinc-800 dark:text-zinc-300 font-normal">w_threat × C_class</p>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block pt-1">Vehicles (1.0) &gt; Low Branches (0.8) &gt; Curbs (0.3)</span>
            </div>
          </div>
        </div>

        {/* Live Simulation Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Environmental Hazards in Field of View */}
          <div className="lg:col-span-7 bg-white dark:bg-[#06080D] border border-dashed border-black/10 dark:border-white/15 rounded-2xl p-6 sm:p-8 text-left space-y-6 relative shadow-lg dark:shadow-2xl transition-colors">
            <ReticleCorner size={10} className="text-[#FF5500] dark:text-[#FF7733]" />

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#FF5500] dark:text-[#FF7733] uppercase tracking-[0.14em]">
                  RADAR FIELD OF VIEW // SENSORY TRACKS
                </span>
                <h4 className="text-base font-semibold text-zinc-950 dark:text-white tracking-tight mt-0.5">{current.title}</h4>
              </div>

              {/* Scenario Pills */}
              <div className="flex items-center gap-1.5">
                {Object.entries(scenarios).map(([key, sc]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedScenario(key)}
                    className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                      selectedScenario === key
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-bold shadow-md'
                        : 'bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-black/10 dark:border-white/5'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Tracked Hazards */}
            <div className="space-y-3">
              {current.hazards.map((h) => {
                const isCritical = h.status === 'critical';
                const isSuppressed = h.status === 'suppressed';
                return (
                  <div
                    key={h.id}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                      isCritical
                        ? 'bg-red-50 dark:bg-red-950/30 border-red-500/50 shadow-md dark:shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                        : isSuppressed
                        ? 'bg-black/[0.02] dark:bg-white/[0.02] border-black/10 dark:border-white/5 opacity-80'
                        : 'bg-black/[0.04] dark:bg-black/30 border-transparent opacity-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                            isCritical
                              ? 'bg-red-500 text-white animate-pulse'
                              : isSuppressed
                              ? 'bg-black/10 dark:bg-white/10 text-zinc-700 dark:text-zinc-400'
                              : 'bg-black/5 dark:bg-white/5 text-zinc-500 dark:text-zinc-600'
                          }`}
                        >
                          {h.status === 'critical' ? 'CRITICAL ALERT' : h.status === 'suppressed' ? 'SUPPRESSED' : 'BACKGROUND'}
                        </span>
                        <h4 className="text-sm font-semibold text-zinc-950 dark:text-white tracking-tight">{h.name}</h4>
                      </div>
                      <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 flex items-center gap-3">
                        <span>Range: <b className="text-zinc-950 dark:text-white">{h.distance}m</b></span>
                        <span>Vector: <b className="text-[#FF5500] dark:text-[#FF7733]">{h.speed}</b></span>
                        <span>Bearing: <b className="uppercase text-[#0284C7] dark:text-[#00D2FF]">{h.direction}</b></span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase block tracking-wider">Urgency</span>
                      <span className={`text-lg font-mono font-bold ${isCritical ? 'text-red-500 dark:text-red-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
                        {h.urgencyScore}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Test Simulation Trigger Button */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 dark:border-white/10">
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                Click to synthesize real bone conduction tone & haptic command:
              </span>
              <button
                onClick={handleSimulate}
                disabled={isSimulating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#FF6611] dark:bg-[#FF7733] dark:hover:bg-[#FF9900] text-white dark:text-black font-bold text-xs font-mono tracking-wider uppercase transition-all shadow-md dark:shadow-[0_0_15px_rgba(255,119,51,0.4)] disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSimulating ? 'TRANSMITTING...' : 'SIMULATE AUDIO ALERT'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: User Perception Dual-Channel Delivery */}
          <div className="lg:col-span-5 bg-white dark:bg-[#06080D] border border-dashed border-black/10 dark:border-white/15 rounded-2xl p-6 sm:p-8 text-left space-y-6 relative shadow-lg dark:shadow-2xl transition-colors">
            <ReticleCorner size={10} className="text-[#0284C7] dark:text-[#00D2FF]" />

            <div className="border-b border-black/10 dark:border-white/10 pb-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#0284C7] dark:text-[#00D2FF]">
                DUAL-CHANNEL USER DELIVERY
              </span>
              <h4 className="text-lg font-semibold text-zinc-950 dark:text-white tracking-tight mt-0.5">
                Bone Conduction & 4-Zone Matrix
              </h4>
            </div>

            {/* Channel 1: Open-Ear Bone Conduction */}
            <div className="bg-[#F4F5F7] dark:bg-[#030406] border border-black/10 dark:border-[#00D2FF]/20 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#0284C7] dark:text-[#00D2FF] font-semibold flex items-center gap-1.5 uppercase tracking-wider">
                  <Volume2 className="w-4 h-4" /> Channel 1: Bone Conduction
                </span>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">{current.freq} Hz Tone</span>
              </div>

              <div className={`p-3 rounded-lg border transition-all ${isSimulating ? 'bg-[#0284C7]/20 border-[#0284C7] shadow-md dark:bg-[#00D2FF]/20 dark:border-[#00D2FF]' : 'bg-white dark:bg-white/[0.03] border-black/10 dark:border-white/5'}`}>
                <div className="text-base font-bold text-zinc-950 dark:text-white font-mono">
                  "{criticalHazard.voiceCue}"
                </div>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-1 block">
                  Temporal bone transducer leaves ear canals 100% open for ambient city traffic awareness.
                </span>
              </div>
            </div>

            {/* Channel 2: 4-Zone Directional Haptics */}
            <div className="bg-[#F4F5F7] dark:bg-[#030406] border border-black/10 dark:border-[#FF7733]/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#FF5500] dark:text-[#FF7733] font-semibold flex items-center gap-1.5 uppercase tracking-wider">
                  <Radio className="w-4 h-4" /> Channel 2: 4-Zone Haptics
                </span>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">PWM Matrix</span>
              </div>

              {/* Haptic Target Grid Visual */}
              <div className="relative w-40 h-40 mx-auto border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-black/60 flex items-center justify-center">
                <div className="w-10 h-14 rounded-lg bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 flex items-center justify-center">
                  <span className="text-[8px] font-mono text-zinc-500 dark:text-zinc-400">CHEST</span>
                </div>

                {/* Top Motor */}
                <div
                  className={`absolute top-2 w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-mono ${
                    criticalHazard.hapticZone === 'front' && isSimulating
                      ? 'bg-[#FF5500] border-[#FF5500] text-white font-bold animate-ping'
                      : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  U
                </div>

                {/* Left Motor */}
                <div
                  className={`absolute left-2 w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-mono ${
                    criticalHazard.hapticZone === 'left' && isSimulating
                      ? 'bg-red-500 border-red-300 text-white font-bold animate-ping'
                      : criticalHazard.hapticZone === 'left'
                      ? 'bg-red-100 dark:bg-red-950 border-red-500/40 text-red-600 dark:text-red-300'
                      : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  L
                </div>

                {/* Right Motor */}
                <div
                  className={`absolute right-2 w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-mono ${
                    criticalHazard.hapticZone === 'right' && isSimulating
                      ? 'bg-[#FF5500] border-[#FF5500] text-white font-bold animate-ping'
                      : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  R
                </div>

                {/* Bottom Motor */}
                <div
                  className={`absolute bottom-2 w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-mono ${
                    criticalHazard.hapticZone === 'back' && isSimulating
                      ? 'bg-[#FF5500] border-[#FF5500] text-white font-bold animate-ping'
                      : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  D
                </div>
              </div>

              <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 text-center">
                Bearing: <b className="text-zinc-950 dark:text-white uppercase">{criticalHazard.hapticZone} ZONE ACTIVE</b> · 100% PWM
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
