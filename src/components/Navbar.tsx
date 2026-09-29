import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Cpu, Sun, Moon } from 'lucide-react';
import { ReticleCorner, TechnicalBadge } from './ReticleCorner';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  highContrast: boolean;
  onToggleHighContrast: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  highContrast,
  onToggleHighContrast
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
          
          {/* Brand Pill (Left) */}
          <div className="pointer-events-auto relative">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 rounded-full glass-surface border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all group shadow-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500] dark:bg-[#FF7733] shadow-[0_0_10px_#FF5500] dark:shadow-[0_0_10px_#FF7733] group-hover:scale-125 transition-transform" />
              <span className="font-semibold text-sm tracking-tight text-zinc-950 dark:text-white">BeepVision</span>
              <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 dark:text-zinc-400 pl-2 border-l border-black/10 dark:border-white/10 uppercase tracking-widest">
                <Cpu className="w-3 h-3 text-[#FF5500] dark:text-[#FF7733]" />
                26 TOPS NPU
              </span>
            </a>
          </div>

          {/* Desktop Nav Items (Center Pill) */}
          <nav className="pointer-events-auto hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full glass-surface border border-black/10 dark:border-white/10 shadow-lg">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="px-3 py-1.5 text-xs font-mono tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-150 uppercase rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.05] cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Actions Pill (Right) */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Light / Dark Mode Toggle Switch Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full glass-surface border border-black/10 dark:border-white/10 text-xs font-mono transition-all flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:border-black/25 dark:hover:border-white/25 hover:text-black dark:hover:text-white group"
              title={theme === 'dark' ? "Switch to Antimetal Light Mode" : "Switch to Obsidian Dark Mode"}
              aria-label="Toggle Light / Dark Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#FF7733] transition-transform group-hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-[#FF5500] transition-transform group-hover:-rotate-12" />
              )}
              <span className="hidden sm:inline text-[11px] font-mono uppercase tracking-wider font-semibold">
                {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </button>

            {/* High Contrast Mode Toggle */}
            <button
              onClick={onToggleHighContrast}
              className={`p-2.5 rounded-full glass-surface border text-xs font-mono transition-all flex items-center gap-1.5 ${
                highContrast
                  ? 'bg-[#FF5500] dark:bg-[#FF7733] text-white dark:text-black border-[#FF5500] font-bold'
                  : 'border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-black/25 dark:hover:border-white/25 hover:text-black dark:hover:text-white'
              }`}
              title="Toggle WCAG AAA High-Contrast Mode"
              aria-label="Toggle High Contrast"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px] font-mono uppercase tracking-wider">
                {highContrast ? 'AAA Active' : 'Contrast'}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full glass-surface border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white"
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
                  className="px-3 py-2 text-xs font-mono uppercase text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-black/5 dark:border-white/5 text-left cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
            </div>
            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-end">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#FF7733]" /> : <Moon className="w-3.5 h-3.5 text-[#FF5500]" />}
                <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
