import React from 'react';

interface ReticleCornerProps {
  className?: string;
  size?: number;
}

// In Apple Design, remove artificial decorative reticle corners to keep the interface calm and focused on content
export const ReticleCorner: React.FC<ReticleCornerProps> = () => {
  return null;
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
  color = 'orange'
}) => {
  const isOrange = color === 'orange' || color === 'amber';
  const dotColor = isOrange 
    ? 'bg-[#FF5500] dark:bg-[#FF9E8C] dark:shadow-[0_0_8px_rgba(255,158,140,0.5)]' 
    : color === 'emerald' 
    ? 'bg-[#00B368] dark:bg-[#30D158] dark:shadow-[0_0_8px_rgba(48,209,88,0.5)]' 
    : 'bg-[#0088CC] dark:bg-[#70D6FF] dark:shadow-[0_0_8px_rgba(112,214,255,0.5)]';
  
  const textColor = isOrange
    ? 'text-zinc-800 dark:text-[#FFD2C8]'
    : color === 'emerald'
    ? 'text-zinc-800 dark:text-[#A7F3BE]'
    : 'text-zinc-800 dark:text-[#D1F2FF]';

  const displayLabel = label || text || '';

  return (
    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/10 dark:border-white/12 bg-black/[0.03] dark:bg-white/[0.06] dark:backdrop-blur-md text-xs font-medium tracking-wide ${textColor}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
      <span>{displayLabel}</span>
    </div>
  );
};
