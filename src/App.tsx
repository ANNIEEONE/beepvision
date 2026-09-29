import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { SensorFusion } from './components/SensorFusion';
import { BrainAI } from './components/BrainAI';
import { Capabilities } from './components/Capabilities';
import { AlertEngine } from './components/AlertEngine';
import { HardwareSpecs } from './components/HardwareSpecs';
import { HowItWorks } from './components/HowItWorks';
import { DayInLife } from './components/DayInLife';
import { WeatherConditions } from './components/WeatherConditions';
import { SafetyDesign } from './components/SafetyDesign';
import { CostBreakdown } from './components/CostBreakdown';
import { Roadmap } from './components/Roadmap';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

function MainApp() {
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const { theme } = useTheme();

  // Initialize Lenis 60fps momentum smooth scroll (Antimetal standard)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      className={`min-h-screen bg-[#F8F9FA] dark:bg-[#06070B] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300 relative ${
        highContrast ? 'contrast-125 saturate-150' : ''
      }`}
    >
      {/* Dark Mode Modern Ambient Mesh Gradient Overlay (Rich & Experience-Full) */}
      <div className="fixed inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500 overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[500px] bg-[#FF7733]/[0.08] rounded-full blur-[140px]" />
        <div className="absolute top-[35%] right-[10%] w-[550px] h-[500px] bg-[#6366F1]/[0.06] rounded-full blur-[160px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[450px] bg-[#00F5A0]/[0.05] rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <Navbar
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 w-full flex flex-col relative z-10">
        {/* Section 01: Hero */}
        <Hero />

        {/* Section 02: The Problem (Blindspots & Competitors) */}
        <Problem />

        {/* Section 03: One Device. Multiple Senses. (Sensor Fusion Radar) */}
        <SensorFusion />

        {/* Section 04: The AI Brain (Hailo-8 26 TOPS) */}
        <BrainAI />

        {/* Section 05: What BeepVision Can Do */}
        <Capabilities />

        {/* Section 06: The Alert Engine (Priority Simulation) */}
        <AlertEngine />

        {/* Section 07: Hardware Architecture & Wiring */}
        <HardwareSpecs />

        {/* Section 08: How It Works (Step-by-Step Flow) */}
        <HowItWorks />

        {/* Section 09: A Day With BeepVision */}
        <DayInLife />

        {/* Section 10: Designed For Real Conditions */}
        <WeatherConditions />

        {/* Section 11: Safety By Design (Honest Engineering) */}
        <SafetyDesign />

        {/* Section 12: Prototype Cost Breakdown */}
        <CostBreakdown />

        {/* Section 13: From Prototype to Product (Roadmap, Patents & Grants) */}
        <Roadmap />

        {/* Section 14: Final Call To Action */}
        <FinalCTA />
      </main>

      {/* Accessible Footer */}
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

export default App;
