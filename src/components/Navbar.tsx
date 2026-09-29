import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Menu, X, Cpu, Sun, Moon, ArrowUp, Music, Volume2, VolumeX } from 'lucide-react';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';
import { useTheme } from '../context/ThemeContext';
import { useMusic } from '../context/MusicContext';

// Dotted Arrow / Brand Mark matching Antimetal reference
const DottedArrowIcon: React.FC<{ className?: string }> = ({ className = "text-zinc-950 dark:text-white" }) => (
  <svg
    viewBox="0 0 24 22"
    className={`w-4 h-4 shrink-0 transition-transform ${className}`}
    fill="currentColor"
    aria-hidden="true"
  >
    {/* Row 0: Top dot */}
    <circle cx="12" cy="4" r="1.3" />
    {/* Row 1: 3 dots */}
    <circle cx="9.2" cy="7.8" r="1.3" />
    <circle cx="12" cy="7.8" r="1.3" />
    <circle cx="14.8" cy="7.8" r="1.3" />
    {/* Row 2: 4 dots */}
    <circle cx="6.4" cy="11.6" r="1.3" />
    <circle cx="9.2" cy="11.6" r="1.3" />
    <circle cx="14.8" cy="11.6" r="1.3" />
    <circle cx="17.6" cy="11.6" r="1.3" />
    {/* Row 3: 2 dots at base */}
    <circle cx="6.4" cy="15.4" r="1.3" />
    <circle cx="17.6" cy="15.4" r="1.3" />
  </svg>
);

interface NavbarProps {
  highContrast: boolean;
  onToggleHighContrast: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  highContrast,
  onToggleHighContrast
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const trackPathRef = useRef<SVGPathElement | null>(null);
  const strokePathRef = useRef<SVGPathElement | null>(null);
  const beadCircleRef = useRef<SVGCircleElement | null>(null);
  const { theme, toggleTheme } = useTheme();
  const { isPlaying, toggleMusic } = useMusic();

  // Real-time 60fps/120fps live scroll tracking directly via requestAnimationFrame
  useEffect(() => {
    let rafId: number;
    const track = trackPathRef.current;
    const stroke = strokePathRef.current;
    const bead = beadCircleRef.current;
    const totalLen = track ? track.getTotalLength() : 155.38;

    const updateFrame = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight;
      const maxScroll = Math.max(scrollHeight - clientHeight, 1);
      const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

      // Only trigger React state change when shrink boundary flips
      const shouldShrink = scrollTop > 50;
      setIsScrolled((prev) => (prev !== shouldShrink ? shouldShrink : prev));

      // Direct DOM update: 0ms latency, zero lag, stroke connected directly to bead tip
      const drawnLen = progress * totalLen;
      if (stroke) {
        stroke.setAttribute('stroke-dasharray', `${drawnLen} ${totalLen}`);
      }
      if (bead && track) {
        const pt = track.getPointAtLength(drawnLen);
        bead.setAttribute('cx', String(pt.x));
        bead.setAttribute('cy', String(pt.y));
      }

      rafId = requestAnimationFrame(updateFrame);
    };

    rafId = requestAnimationFrame(updateFrame);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Smooth scroll back to top without hash redirection in URL
  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      if ((window as any).__lenis) {
        (window as any).__lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  };

  const navLinks = [
    { name: 'Problem', href: '#problem' },
    { name: 'Senses', href: '#sensors' },
    { name: 'AI Brain', href: '#brain' },
    { name: 'Capabilities', href: '#capabilities' },
    { name: 'Alert Engine', href: '#alert-engine' },
    { name: 'Hardware', href: '#hardware' },
    { name: 'Field Testing', href: '#conditions' },
    { name: 'Safety', href: '#safety' },
    { name: 'Pricing', href: '#pricing' },
  ];

  const scrollToSection = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Skip to Content for Screen Readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-[#FF5500] dark:bg-[#FF7733] text-white dark:text-black px-4 py-2 rounded-full font-mono text-xs font-bold tracking-wider shadow-2xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Antimetal Floating Glass Nav Bar */}
      <header className="sticky top-0 z-50 w-full px-4 pt-4 md:px-8 md:pt-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Brand Pill (Left) - Shrinks on scroll, live loop tracer & converts to Back to Top */}
          <div className="pointer-events-auto relative">
            <button
              type="button"
              onClick={handleScrollToTop}
              className={`relative flex items-center justify-center min-h-[40px] rounded-full glass-surface border border-black/10 dark:border-white/12 hover:border-black/25 dark:hover:border-white/25 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group shadow-xs cursor-pointer select-none ${
                isScrolled
                  ? 'w-[58px] h-[40px] p-0 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.12)]'
                  : 'w-auto px-4 py-2 gap-2.5'
              }`}
              title={isScrolled ? "Live scroll progress — Click to smooth scroll to top" : "BeepVision | 26 TOPS NPU"}
              aria-label={isScrolled ? "Scroll smoothly back to top" : "BeepVision navigation brand pill"}
            >
              {/* Shrunken State: Capsule SVG Loop Track & Travelling Bead (Always in DOM for instant 0ms tracking) */}
              <svg
                className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 ${
                  isScrolled ? 'opacity-100' : 'opacity-0'
                }`}
                viewBox="0 0 60 42"
                style={{ overflow: 'visible' }}
                aria-hidden="true"
              >
                <defs>
                  <filter id="beadGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                {/* Subtle Background Track */}
                <path
                  ref={trackPathRef}
                  d="M 30 2 L 39 2 A 19 19 0 0 1 39 40 L 21 40 A 19 19 0 0 1 21 2 Z"
                  fill="none"
                  className="stroke-black/10 dark:stroke-white/15"
                  strokeWidth="1.5"
                />
                {/* Live Continuous Scroll Progress Stroke */}
                <path
                  ref={strokePathRef}
                  d="M 30 2 L 39 2 A 19 19 0 0 1 39 40 L 21 40 A 19 19 0 0 1 21 2 Z"
                  fill="none"
                  stroke={theme === 'dark' ? '#FFFFFF' : '#18181B'}
                  strokeWidth="1.8"
                  strokeDasharray="0 155.38"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                {/* Live Travelling Bead (Matching Antimetal reference) */}
                <circle
                  ref={beadCircleRef}
                  cx="30"
                  cy="2"
                  r="3.2"
                  fill={theme === 'dark' ? '#FFFFFF' : '#18181B'}
                  filter="url(#beadGlow)"
                />
              </svg>

              {/* Dotted Arrow Up / Brand Mark */}
              <div className="relative z-10 flex items-center justify-center shrink-0">
                <DottedArrowIcon
                  className={`${
                    isScrolled
                      ? 'group-hover:-translate-y-0.5 text-zinc-950 dark:text-white'
                      : 'text-[#FF5500] dark:text-[#FF9E8C]'
                  }`}
                />
              </div>

              {/* Expanded Brand Text & Specs (smoothly collapses when shrunk) */}
              <div
                className={`relative z-10 flex items-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
                  isScrolled
                    ? 'max-w-0 opacity-0 pointer-events-none'
                    : 'max-w-[260px] opacity-100'
                }`}
              >
                <span className="font-semibold text-sm tracking-tight text-zinc-950 dark:text-white whitespace-nowrap pl-1">
                  BeepVision
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-[#30D158] pl-2.5 ml-2.5 border-l border-black/10 dark:border-white/10 tracking-wide whitespace-nowrap">
                  <Cpu className="w-3.5 h-3.5 text-[#FF5500] dark:text-[#30D158]" />
                  26 TOPS NPU
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items (Center Pill) */}
          <nav className="pointer-events-auto hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full glass-surface border border-black/10 dark:border-white/12 shadow-xs">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="px-3.5 py-1.5 text-xs font-medium tracking-wide text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors duration-150 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.08] cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Actions Pill (Right) */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Background Music Toggle Button */}
            <button
              onClick={toggleMusic}
              className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-full glass-surface border text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none group ${
                isPlaying
                  ? 'border-[#30D158]/50 text-[#30D158] dark:text-[#30D158] shadow-[0_0_14px_rgba(48,209,88,0.22)] ring-1 ring-[#30D158]/30 bg-[#30D158]/[0.08]'
                  : 'border-black/10 dark:border-white/12 text-zinc-800 dark:text-zinc-200 hover:border-black/25 dark:hover:border-white/25 hover:text-black dark:hover:text-white'
              }`}
              title={isPlaying ? "Pause background music" : "Play background music (Lo-Fi Ambient)"}
              aria-label={isPlaying ? "Pause background music" : "Play background music"}
            >
              {isPlaying ? (
                <div className="flex items-end gap-[2px] h-3.5 w-3.5 justify-center py-0.5" aria-hidden="true">
                  <span className="w-[2px] bg-[#30D158] rounded-full animate-[musicBar1_0.8s_ease-in-out_infinite]" />
                  <span className="w-[2px] bg-[#30D158] rounded-full animate-[musicBar2_0.8s_ease-in-out_infinite_0.2s]" />
                  <span className="w-[2px] bg-[#30D158] rounded-full animate-[musicBar3_0.8s_ease-in-out_infinite_0.4s]" />
                </div>
              ) : (
                <Music className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
              )}
              <span className="text-xs font-medium tracking-wide">Music</span>
              {isPlaying && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-ping ml-0.5" />
              )}
            </button>

            {/* Light / Dark Mode Toggle Switch Button */}
            <button
              onClick={toggleTheme}
              className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-full glass-surface border border-black/10 dark:border-white/12 text-xs font-medium transition-all flex items-center justify-center gap-1.5 text-zinc-800 dark:text-zinc-200 hover:border-black/25 dark:hover:border-white/25 hover:text-black dark:hover:text-white group"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Light / Dark Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#FF9E8C] transition-transform group-hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-[#FF5500] transition-transform group-hover:-rotate-12" />
              )}
              <span className="hidden sm:inline text-xs font-medium tracking-wide">
                {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </button>

            {/* High Contrast Mode Toggle */}
            <button
              onClick={onToggleHighContrast}
              className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-full glass-surface border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                highContrast
                  ? 'bg-[#FF5500] dark:bg-[#FF9E8C] text-white dark:text-black border-[#FF5500] dark:border-[#FF9E8C] font-bold'
                  : 'border-black/10 dark:border-white/12 text-zinc-800 dark:text-zinc-200 hover:border-black/25 dark:hover:border-white/25 hover:text-black dark:hover:text-white'
              }`}
              title="Toggle High-Contrast Mode"
              aria-label="Toggle High Contrast"
            >
              <ShieldCheck className="w-4 h-4 text-[#FF5500] dark:text-[#30D158]" />
              <span className="hidden sm:inline text-xs font-medium tracking-wide">
                {highContrast ? 'AAA Active' : 'Contrast'}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-full glass-surface border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white flex items-center justify-center"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto lg:hidden mt-3 max-w-7xl mx-auto rounded-2xl glass-surface border border-black/15 dark:border-white/15 p-5 shadow-2xl relative">
            <ReticleCorner />
            <div className="grid grid-cols-2 gap-2 mb-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    scrollToSection(link.href);
                    setMobileMenuOpen(false);
                  }}
                  className="px-3.5 py-2.5 min-h-[44px] text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-black/5 dark:border-white/5 text-left cursor-pointer flex items-center"
                >
                  {link.name}
                </button>
              ))}
            </div>
            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={toggleMusic}
                className="flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl border border-black/10 dark:border-white/10 text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                {isPlaying ? <Volume2 className="w-4 h-4 text-[#30D158]" /> : <Music className="w-4 h-4 text-zinc-500" />}
                <span>{isPlaying ? 'Pause Music' : 'Play Music'}</span>
              </button>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl border border-black/10 dark:border-white/10 text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FF7733]" /> : <Moon className="w-4 h-4 text-[#FF5500]" />}
                <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
