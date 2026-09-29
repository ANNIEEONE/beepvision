import React from 'react';

interface ReticleCornerProps {
  className?: string;
  size?: number;
}

export const ReticleCorner: React.FC<ReticleCornerProps> = ({ className = '', size = 8 }) => {
  return (
    <>
      {/* Top Left */}
      <span aria-hidden="true" className={`absolute -top-[1px] -left-[1px] pointer-events-none z-10 text-zinc-700/40 dark:text-white/30 ${className}`}>
        <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
          <path d="M 1.25 10 L 1.25 1.25 L 10 1.25" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
      {/* Top Right */}
      <span aria-hidden="true" className={`absolute -top-[1px] -right-[1px] pointer-events-none z-10 text-zinc-700/40 dark:text-white/30 ${className}`}>
        <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
          <path d="M 0 1.25 L 8.75 1.25 L 8.75 10" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
      {/* Bottom Left */}
      <span aria-hidden="true" className={`absolute -bottom-[1px] -left-[1px] pointer-events-none z-10 text-zinc-700/40 dark:text-white/30 ${className}`}>
        <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
          <path d="M 1.25 0 L 1.25 8.75 L 10 8.75" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
      {/* Bottom Right */}
      <span aria-hidden="true" className={`absolute -bottom-[1px] -right-[1px] pointer-events-none z-10 text-zinc-700/40 dark:text-white/30 ${className}`}>
        <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
          <path d="M 0 8.75 L 8.75 8.75 L 8.75 0" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
    </>
  );
};

export const TechnicalBadge: React.FC<{
  label?: string;
  text?: string;
  number?: string;
  code?: string;
  color?: 'orange' | 'amber' | 'emerald' | 'cyan';
}> = ({
  label,
  text,
  number,
  code,
  color = 'orange'
}) => {
  const isOrange = color === 'orange' || color === 'amber';
  const dotColor = isOrange ? 'bg-[#FF5500] dark:bg-[#FF7733]' : color === 'emerald' ? 'bg-[#00B368] dark:bg-[#00F5A0]' : 'bg-[#0088CC] dark:bg-[#00D2FF]';
  const glowShadow = isOrange ? 'shadow-[0_0_8px_#FF5500] dark:shadow-[0_0_8px_#FF7733]' : color === 'emerald' ? 'shadow-[0_0_8px_#00B368] dark:shadow-[0_0_8px_#00F5A0]' : 'shadow-[0_0_8px_#0088CC] dark:shadow-[0_0_8px_#00D2FF]';
  const displayLabel = label || text || '';
  const displayNumber = number || code || '';

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.04] backdrop-blur-md font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-zinc-800 dark:text-zinc-300">
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${glowShadow} animate-pulse`} />
      {displayNumber && <span className="text-zinc-500">{displayNumber} //</span>}
      <span>{displayLabel}</span>
    </div>
  );
};
