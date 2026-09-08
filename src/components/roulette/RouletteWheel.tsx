import React, { useState, useEffect, useRef } from 'react';
import {
  RoulettePocket,
  PocketInfo,
  getPocketInfo,
  EUROPEAN_WHEEL_ORDER,
  AMERICAN_WHEEL_ORDER,
  RouletteVariant
} from '../../utils/rouletteEngine';
import { sounds } from '../../utils/soundEffects';

interface RouletteWheelProps {
  variant: RouletteVariant;
  winningPocket: PocketInfo | null;
  isSpinning: boolean;
  onSpinComplete?: () => void;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  variant,
  winningPocket,
  isSpinning,
  onSpinComplete
}) => {
  const wheelOrder = variant === 'AMERICAN' ? AMERICAN_WHEEL_ORDER : EUROPEAN_WHEEL_ORDER;
  const pocketCount = wheelOrder.length;
  const sliceAngle = 360 / pocketCount;

  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [ballRotation, setBallRotation] = useState<number>(0);
  const [ballRadius, setBallRadius] = useState<number>(140); // outer ball track
  const [animating, setAnimating] = useState<boolean>(false);

  const prevWinningRef = useRef<RoulettePocket | null>(null);

  useEffect(() => {
    if (isSpinning && winningPocket) {
      setAnimating(true);
      sounds.playRouletteSpin();

      // Find index of winning pocket in wheel
      const targetIdx = wheelOrder.indexOf(winningPocket.value);
      const pocketAngle = targetIdx >= 0 ? targetIdx * sliceAngle : 0;

      // Wheel spins clockwise ~4 to 6 full turns
      const extraWheelTurns = (4 + Math.floor(Math.random() * 2)) * 360;
      // Target wheel rotation so the winning pocket lands at top (0 deg / 270 deg)
      // When wheel rotates by R, pocket at angle A is now at (A + R) % 360
      // We want winning pocket to land at top indicator (-90 deg or 270 deg)
      const targetWheelAngle = extraWheelTurns + (360 - pocketAngle);

      setWheelRotation(prev => prev + targetWheelAngle);

      // Ball spins counter-clockwise ~7 to 9 full turns on the outer rim
      const extraBallTurns = (7 + Math.floor(Math.random() * 3)) * 360;
      setBallRadius(140); // outer rim track
      setBallRotation(prev => prev - extraBallTurns);

      // After 3.2s, ball drops into pocket track with clatter sounds
      const dropTimer = setTimeout(() => {
        sounds.playBallDrop();
        setBallRadius(108); // inner pocket radius
      }, 2800);

      // Animation finishes at 3.8s
      const completeTimer = setTimeout(() => {
        setAnimating(false);
        onSpinComplete?.();
      }, 3800);

      return () => {
        clearTimeout(dropTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isSpinning, winningPocket, sliceAngle, wheelOrder, onSpinComplete]);

  return (
    <div className="relative flex flex-col items-center justify-center p-3 select-none">
      {/* Outer Wooden Bezel & Indicator */}
      <div className="relative w-60 h-60 xs:w-72 xs:h-72 sm:w-80 sm:h-80 md:w-[330px] md:h-[330px] max-w-full aspect-square rounded-full p-2 sm:p-2.5 bg-gradient-to-b from-[#4a2e18] via-[#2d1b0c] to-[#1a0f07] border-4 border-[#c29b38] shadow-[0_12px_40px_rgba(0,0,0,0.8),inset_0_2px_8px_rgba(255,215,0,0.3)] flex items-center justify-center overflow-hidden">
        {/* Brass Deflector Pegs on Track */}
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#d4af37]/30 pointer-events-none" />

        {/* Top Winning Indicator Arrow */}
        <div className="absolute top-1 z-30 flex flex-col items-center pointer-events-none">
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
        </div>

        {/* The Rotating Wheel SVG */}
        <div
          className="w-full h-full rounded-full transition-transform duration-[3800ms] ease-[cubic-bezier(0.12,0.8,0.22,1)]"
          style={{ transform: `rotate(${wheelRotation}deg)` }}
        >
          <svg viewBox="-160 -160 320 320" className="w-full h-full drop-shadow-lg">
            <defs>
              {/* Gold gradients for wheel accents */}
              <radialGradient id="brassHub" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffe082" />
                <stop offset="50%" stopColor="#c29b38" />
                <stop offset="100%" stopColor="#684e1b" />
              </radialGradient>
              <linearGradient id="metalRim" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="50%" stopColor="#7a5d1b" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
            </defs>

            {/* Outer metallic track */}
            <circle cx="0" cy="0" r="150" fill="#1b221d" stroke="url(#metalRim)" strokeWidth="6" />

            {/* Pockets & Segments */}
            {wheelOrder.map((pocket, idx) => {
              const startAngle = (idx * sliceAngle - sliceAngle / 2) * (Math.PI / 180);
              const endAngle = (idx * sliceAngle + sliceAngle / 2) * (Math.PI / 180);
              const r1 = 80;
              const r2 = 142;

              const x1 = Math.sin(startAngle) * r1;
              const y1 = -Math.cos(startAngle) * r1;
              const x2 = Math.sin(endAngle) * r1;
              const y2 = -Math.cos(endAngle) * r1;
              const x3 = Math.sin(endAngle) * r2;
              const y3 = -Math.cos(endAngle) * r2;
              const x4 = Math.sin(startAngle) * r2;
              const y4 = -Math.cos(startAngle) * r2;

              const pathData = `M ${x1} ${y1} L ${x4} ${y4} A ${r2} ${r2} 0 0 1 ${x3} ${y3} L ${x2} ${y2} A ${r1} ${r1} 0 0 0 ${x1} ${y1} Z`;

              const pInfo = getPocketInfo(pocket);
              const fill =
                pInfo.color === 'green' ? '#107c41' : pInfo.color === 'red' ? '#b91c1c' : '#111827';

              // Text position
              const textAngle = idx * sliceAngle * (Math.PI / 180);
              const textR = 120;
              const tx = Math.sin(textAngle) * textR;
              const ty = -Math.cos(textAngle) * textR;

              return (
                <g key={idx}>
                  <path
                    d={pathData}
                    fill={fill}
                    stroke="#c29b38"
                    strokeWidth="0.8"
                    className="transition-colors"
                  />
                  <text
                    x={tx}
                    y={ty}
                    fill="#fef08a"
                    fontSize={pocketCount > 37 ? '8.5' : '9.5'}
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${idx * sliceAngle}, ${tx}, ${ty})`}
                  >
                    {pocket}
                  </text>
                </g>
              );
            })}

            {/* Inner Brass Turret / Cone Hub */}
            <circle cx="0" cy="0" r="76" fill="url(#brassHub)" stroke="#523c13" strokeWidth="3" />
            <circle cx="0" cy="0" r="42" fill="#2d1b0c" stroke="#ffe082" strokeWidth="2" />
            <circle cx="0" cy="0" r="18" fill="url(#brassHub)" />

            {/* Four classic turret crossbars */}
            <line x1="-36" y1="0" x2="36" y2="0" stroke="#ffe082" strokeWidth="3" strokeLinecap="round" />
            <line x1="0" y1="-36" x2="0" y2="36" stroke="#ffe082" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Orbiting Ivory Ball (SVG-scaled for mathematical alignment across all screens) */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-[3800ms] ease-[cubic-bezier(0.18,0.85,0.25,1)]"
          style={{ transform: `rotate(${ballRotation}deg)` }}
        >
          <svg viewBox="-160 -160 320 320" className="w-full h-full overflow-visible">
            <defs>
              <radialGradient id="ivoryBallGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#f3f4f6" />
                <stop offset="100%" stopColor="#d1d5db" />
              </radialGradient>
            </defs>
            <circle
              cx="0"
              cy={-ballRadius}
              r="7"
              fill="url(#ivoryBallGrad)"
              stroke="#9ca3af"
              strokeWidth="0.8"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
              className="transition-all duration-700 ease-out"
            />
          </svg>
        </div>
      </div>

      {/* Winning Pocket Result Badge */}
      {winningPocket && !animating && (
        <div className="mt-3 py-1.5 px-3 sm:px-4 rounded-xl bg-[#0F172A] border border-[#334155] shadow-xl flex flex-wrap items-center justify-center gap-2 animate-fade-in max-w-full">
          <span className="text-xs text-slate-400 font-arcade uppercase whitespace-nowrap">WINNING RESULT:</span>
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-sm text-white shadow-md shrink-0 ${
                winningPocket.color === 'red'
                  ? 'bg-red-600'
                  : winningPocket.color === 'black'
                  ? 'bg-slate-900 border border-slate-700'
                  : 'bg-emerald-600'
              }`}
            >
              {winningPocket.value}
            </span>
            <div className="text-[11px] font-arcade flex flex-wrap items-center gap-1.5 text-slate-300">
              <span className="uppercase text-amber-300 font-bold">{winningPocket.color}</span>
              {winningPocket.value !== 0 && winningPocket.value !== '00' && (
                <>
                  <span>•</span>
                  <span>{winningPocket.isEven ? 'EVEN' : 'ODD'}</span>
                  <span>•</span>
                  <span>{winningPocket.isHigh ? '19-36' : '1-18'}</span>
                  <span>•</span>
                  <span>D{winningPocket.dozen}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
