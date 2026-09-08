import React from 'react';

export interface CasinoChipStackProps {
  amount: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showCount?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  animationState?: 'idle' | 'win' | 'burn';
}

// Casino chip styling definitions
interface ChipTheme {
  primary: string; // main body color
  accent: string;  // edge spot stripe color
  rim: string;     // border color
  text: string;    // text color
  name: string;
}

function getChipTheme(amount: number): ChipTheme {
  if (amount >= 500) {
    return {
      primary: '#581c87', // deep purple
      accent: '#f59e0b',  // gold
      rim: '#c084fc',
      text: '#faf5ff',
      name: 'purple'
    };
  }
  if (amount >= 100) {
    return {
      primary: '#090d16', // obsidian black
      accent: '#eab308',  // golden yellow
      rim: '#ca8a04',
      text: '#fef08a',
      name: 'black'
    };
  }
  if (amount >= 25) {
    return {
      primary: '#065f46', // emerald green
      accent: '#f3f4f6',  // white
      rim: '#34d399',
      text: '#ecfdf5',
      name: 'green'
    };
  }
  if (amount >= 5) {
    return {
      primary: '#991b1b', // ruby red
      accent: '#f3f4f6',  // white
      rim: '#f87171',
      text: '#fff1f2',
      name: 'red'
    };
  }
  return {
    primary: '#1e40af', // sapphire blue
    accent: '#ffffff',
    rim: '#60a5fa',
    text: '#eff6ff',
    name: 'blue'
  };
}

export const CasinoChipStack: React.FC<CasinoChipStackProps> = ({
  amount,
  size = 'md',
  showCount = true,
  className = '',
  onClick,
  disabled = false,
  animationState = 'idle'
}) => {
  if (amount <= 0) return null;

  const theme = getChipTheme(amount);

  // Size dimensions (diameter in px)
  const sizeMap = {
    xs: { dim: 22, text: 'text-[8px]', fontSm: 'text-[7px]', edgeH: 2, stackOffset: 1.5 },
    sm: { dim: 28, text: 'text-[9px]', fontSm: 'text-[8px]', edgeH: 2.5, stackOffset: 2 },
    md: { dim: 36, text: 'text-[10px]', fontSm: 'text-[9px]', edgeH: 3, stackOffset: 2.5 },
    lg: { dim: 46, text: 'text-xs', fontSm: 'text-[10px]', edgeH: 3.5, stackOffset: 3 },
    xl: { dim: 56, text: 'text-sm', fontSm: 'text-xs', edgeH: 4, stackOffset: 3.5 },
  };

  const currentSize = sizeMap[size];

  // Calculate stack depth (number of visual chip layers)
  // For small bets: 1 chip; 2x base: 2 chips; up to 5 stacked chips
  let stackCount = 1;
  if (amount >= 500) {
    stackCount = Math.min(5, Math.max(2, Math.floor(amount / 500)));
  } else if (amount >= 100) {
    stackCount = Math.min(5, Math.max(1, Math.floor(amount / 100)));
  } else if (amount >= 25) {
    stackCount = Math.min(5, Math.max(1, Math.floor(amount / 25)));
  } else if (amount >= 5) {
    stackCount = Math.min(5, Math.max(1, Math.floor(amount / 5)));
  }

  // Format chip label
  const formattedAmount =
    amount >= 1000000
      ? `$${(amount / 1000000).toFixed(1)}M`
      : amount >= 10000
      ? `$${Math.round(amount / 1000)}k`
      : amount >= 1000
      ? `$${(amount / 1000).toFixed(1)}k`
      : `$${amount}`;

  // Stack layers to render underneath top chip
  const layers = Array.from({ length: stackCount - 1 });

  // Animation container class
  const animClass =
    animationState === 'win'
      ? 'animate-chips-collect z-30'
      : animationState === 'burn'
      ? 'animate-chips-burn z-30'
      : '';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none transition-transform duration-150 ${animClass} ${
        onClick && !disabled ? 'cursor-pointer hover:scale-110 active:scale-95' : 'pointer-events-none'
      } ${className}`}
      style={{
        width: `${currentSize.dim}px`,
        height: `${currentSize.dim + (stackCount - 1) * currentSize.stackOffset}px`
      }}
      title={`Placed Wager: $${amount} (${stackCount} chips)`}
    >
      {/* Visual Burn Flame Effect Overlay */}
      {animationState === 'burn' && (
        <div className="absolute -top-7 sm:-top-8 inset-x-0 flex flex-col items-center justify-center pointer-events-none z-40">
          {/* Dancing fire tongues */}
          <div className="relative w-9 h-10 animate-fire-flicker">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]">
              {/* Outer orange flame */}
              <path
                d="M12 2C10.5 4.5 8 8 8 12C8 14.5 9.5 17 12 18C14.5 17 16 14.5 16 12C16 9 14.5 6 12 2Z"
                fill="#f97316"
              />
              {/* Mid bright yellow flame */}
              <path
                d="M12 5C11 7 9.5 9.5 9.5 12.5C9.5 14.5 10.5 16 12 16.8C13.5 16 14.5 14.5 14.5 12.5C14.5 10.5 13.5 8 12 5Z"
                fill="#facc15"
              />
              {/* Inner white-hot core */}
              <path
                d="M12 9C11.5 10.5 10.5 12 10.5 13.5C10.5 14.8 11.2 15.5 12 15.8C12.8 15.5 13.5 14.8 13.5 13.5C13.5 12 12.5 10.5 12 9Z"
                fill="#ffffff"
              />
            </svg>
          </div>
          {/* Floating rising hot embers */}
          <div className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ember-rise shadow-[0_0_6px_#f59e0b]" />
          <div className="absolute -top-1 -right-2 w-1 h-1 rounded-full bg-red-500 animate-ember-rise shadow-[0_0_6px_#ef4444]" style={{ animationDelay: '0.2s' }} />
          <div className="absolute -top-2 -left-2 w-1.2 h-1.2 rounded-full bg-orange-400 animate-ember-rise shadow-[0_0_6px_#f97316]" style={{ animationDelay: '0.35s' }} />
          <span className="absolute -bottom-2 text-[8px] font-arcade font-black text-rose-400 tracking-wider uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] whitespace-nowrap">
            🔥 BURN
          </span>
        </div>
      )}

      {/* Visual Win Gold Halo & Sparkles */}
      {animationState === 'win' && (
        <div className="absolute -inset-3 rounded-full pointer-events-none z-30 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-amber-400/30 blur-md animate-pulse" />
          <span className="absolute -top-3 px-1 rounded-full bg-amber-400 text-slate-950 font-arcade font-black text-[7px] tracking-wider uppercase border border-amber-300 shadow-md">
            ★ COLLECT
          </span>
        </div>
      )}

      {/* 3D Stack Base Layers (underneath) */}
      {layers.map((_, idx) => {
        const offset = (layers.length - idx) * currentSize.stackOffset;
        return (
          <div
            key={idx}
            className="absolute rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            style={{
              width: `${currentSize.dim}px`,
              height: `${currentSize.dim}px`,
              bottom: `${offset}px`,
              backgroundColor: theme.primary,
              border: `1.5px solid ${theme.rim}`,
              boxShadow: '0 3px 6px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.3)'
            }}
          >
            {/* Striped edge spot markers */}
            <div className="absolute inset-0 rounded-full overflow-hidden opacity-80">
              <div
                className="w-full h-full"
                style={{
                  background: `repeating-conic-gradient(from 0deg, ${theme.primary} 0deg 30deg, ${theme.accent} 30deg 45deg, ${theme.primary} 45deg 75deg)`
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Top Authentic Casino Chip */}
      <div
        className="absolute bottom-0 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all animate-chip-slide"
        style={{
          width: `${currentSize.dim}px`,
          height: `${currentSize.dim}px`,
          backgroundColor: theme.primary,
          border: `2px solid ${theme.rim}`,
          boxShadow: '0 4px 10px rgba(0,0,0,0.75), inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.5)'
        }}
      >
        {/* Edge Spot Stripes (Radial alternating marks) */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div
            className="w-full h-full opacity-90"
            style={{
              background: `repeating-conic-gradient(from 0deg, transparent 0deg 25deg, ${theme.accent} 25deg 35deg, transparent 35deg 60deg)`
            }}
          />
        </div>

        {/* Inner concentric recessed inlay circle */}
        <div
          className="relative rounded-full flex flex-col items-center justify-center font-mono-telemetry font-black z-10"
          style={{
            width: `${currentSize.dim * 0.68}px`,
            height: `${currentSize.dim * 0.68}px`,
            backgroundColor: theme.primary,
            border: `1.5px dashed ${theme.accent}`,
            color: theme.text,
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8), 0 1px 2px rgba(255,255,255,0.3)'
          }}
        >
          {/* Chip Value Text */}
          <span className={`${currentSize.text} leading-none tracking-tighter drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]`}>
            {formattedAmount}
          </span>
        </div>

        {/* Multi-chip Stack Counter Badge (if stackCount > 1) */}
        {showCount && stackCount > 1 && (
          <div
            className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-amber-400 text-slate-950 font-mono-telemetry font-black text-[8px] sm:text-[9px] border border-slate-900 shadow-md flex items-center justify-center z-20"
            style={{ minWidth: '14px', height: '14px' }}
          >
            ×{stackCount}
          </div>
        )}
      </div>
    </div>
  );
};
