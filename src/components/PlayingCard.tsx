import React from 'react';
import { CardBitfield } from '../types';
import { Crown, Sparkles, Shield, Award, Gem, Flame } from 'lucide-react';

interface PlayingCardProps {
  card?: CardBitfield;
  rank?: string;
  suit?: 'h' | 'd' | 'c' | 's';
  size?: 'sm' | 'md' | 'lg';
  isFaceDown?: boolean;
  faceDown?: boolean;
  className?: string;
}

export const PlayingCard: React.FC<PlayingCardProps> = ({
  card,
  rank: propRank,
  suit: propSuit,
  size = 'md',
  isFaceDown = false,
  faceDown = false,
  className = ''
}) => {
  const isCardFaceDown = isFaceDown || faceDown;
  const rank = (card ? card.rank : propRank || 'A').toUpperCase();
  const suit = card ? card.suit : propSuit || 's';
  const isRed = suit === 'h' || suit === 'd';

  // Suit symbols
  const suitSymbol = suit === 'h' ? '♥' : suit === 'd' ? '♦' : suit === 'c' ? '♣' : '♠';

  if (isCardFaceDown) {
    const sizeClasses =
      size === 'sm'
        ? 'w-12 h-18'
        : size === 'lg'
        ? 'w-16 h-24 sm:w-20 sm:h-28'
        : 'w-14 h-20 sm:w-16 sm:h-24';

    return (
      <div
        className={`${sizeClasses} rounded-xl border-2 border-[#1E3A2B] bg-gradient-to-br from-[#0C2417] via-[#081B11] to-[#040E09] shadow-xl flex flex-col items-center justify-center text-amber-400/80 font-arcade select-none ${className}`}
      >
        <span className="text-xl">🂠</span>
        <span className="text-[7px] text-emerald-400/80 font-mono-telemetry mt-0.5 tracking-wider font-bold">
          HOLE
        </span>
      </div>
    );
  }

  // Dimensions
  const sizeClasses =
    size === 'sm'
      ? 'w-12 h-18 p-1 text-[11px]'
      : size === 'lg'
      ? 'w-16 h-24 sm:w-20 sm:h-28 p-2 text-sm'
      : 'w-14 h-20 sm:w-16 sm:h-24 p-1.5 text-xs sm:text-sm';

  // Render royal figure / emblem in the center for J, Q, K, A
  const renderRoyalFigure = () => {
    const isSm = size === 'sm';
    const isLg = size === 'lg';
    const figureBoxSize = isSm ? 'w-8 h-10' : isLg ? 'w-12 h-16' : 'w-10 h-13';

    switch (rank) {
      case 'K':
        return (
          <div className="flex flex-col items-center justify-center leading-none text-center select-none">
            {/* King Vector Figure */}
            <div className={`${figureBoxSize} rounded-md bg-gradient-to-b ${isRed ? 'from-red-50 to-amber-50 border border-red-300/80' : 'from-slate-100 to-amber-50 border border-slate-300'} flex flex-col items-center justify-center p-0.5 shadow-inner`}>
              <svg viewBox="0 0 36 44" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Crown */}
                <path d="M7 14L11 8L18 12L25 8L29 14L28 17H8L7 14Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="18" cy="7" r="1.5" fill="#EF4444"/>
                <circle cx="11" cy="6" r="1.2" fill="#3B82F6"/>
                <circle cx="25" cy="6" r="1.2" fill="#3B82F6"/>
                {/* King Head & Beard */}
                <circle cx="18" cy="20" r="4.5" fill="#FDE68A"/>
                {/* Eyes */}
                <circle cx="16.5" cy="19.5" r="0.7" fill="#1E293B"/>
                <circle cx="19.5" cy="19.5" r="0.7" fill="#1E293B"/>
                {/* Mustache & Beard */}
                <path d="M15 22C16 23 20 23 21 22C21 25 19.5 26.5 18 26.5C16.5 26.5 15 25 15 22Z" fill="#D97706"/>
                {/* Robe / Mantle */}
                <path d="M8 26C10 24 14 24 18 24C22 24 26 24 28 26L30 40H6L8 26Z" fill={isRed ? "#DC2626" : "#1E293B"} stroke="#94A3B8" strokeWidth="1"/>
                <path d="M14 25L18 33L22 25" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="18" cy="35" r="1.5" fill="#F59E0B"/>
              </svg>
            </div>
            <span className={`text-[7.5px] sm:text-[8.5px] font-bold font-arcade tracking-tight mt-0.5 ${isRed ? 'text-red-700' : 'text-slate-800'}`}>
              KING
            </span>
          </div>
        );
      case 'Q':
        return (
          <div className="flex flex-col items-center justify-center leading-none text-center select-none">
            {/* Queen Vector Figure */}
            <div className={`${figureBoxSize} rounded-md bg-gradient-to-b ${isRed ? 'from-rose-50 to-pink-50 border border-rose-300/80' : 'from-slate-100 to-purple-50 border border-slate-300'} flex flex-col items-center justify-center p-0.5 shadow-inner`}>
              <svg viewBox="0 0 36 44" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Queen Tiara */}
                <path d="M9 13L13 9L18 7L23 9L27 13L25 15H11L9 13Z" fill="#F43F5E" stroke="#BE123C" strokeWidth="1.2" strokeLinejoin="round"/>
                <circle cx="18" cy="5" r="1.5" fill="#F59E0B"/>
                <circle cx="13" cy="7" r="1.2" fill="#E0E7FF"/>
                <circle cx="23" cy="7" r="1.2" fill="#E0E7FF"/>
                {/* Hair */}
                <path d="M11 16C10 21 11 26 12 28M25 16C26 21 25 26 24 28" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round"/>
                {/* Face */}
                <circle cx="18" cy="19.5" r="4.5" fill="#FDE68A"/>
                {/* Eyes & Lashes */}
                <path d="M15.5 19C16 18.5 17 19 17 19.5" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round"/>
                <path d="M19 19.5C19 19 20 18.5 20.5 19" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round"/>
                {/* Lips */}
                <path d="M17 22.5Q18 23.5 19 22.5" stroke="#E11D48" strokeWidth="1" strokeLinecap="round"/>
                {/* Queen Gown */}
                <path d="M9 27C12 25 15 25 18 25C21 25 24 25 27 27L29 40H7L9 27Z" fill={isRed ? "#BE123C" : "#4338CA"} stroke="#F472B6" strokeWidth="1"/>
                {/* Pearl Necklace */}
                <path d="M14 27Q18 30 22 27" stroke="#FDF2F8" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1 1.5"/>
              </svg>
            </div>
            <span className={`text-[7.5px] sm:text-[8.5px] font-bold font-arcade tracking-tight mt-0.5 ${isRed ? 'text-red-700' : 'text-slate-800'}`}>
              QUEEN
            </span>
          </div>
        );
      case 'J':
        return (
          <div className="flex flex-col items-center justify-center leading-none text-center select-none">
            {/* Jester / Jack Vector Figure */}
            <div className={`${figureBoxSize} rounded-md bg-gradient-to-b ${isRed ? 'from-amber-50 to-orange-50 border border-amber-300/80' : 'from-slate-100 to-sky-50 border border-slate-300'} flex flex-col items-center justify-center p-0.5 shadow-inner`}>
              <svg viewBox="0 0 36 44" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 3-Point Jester Hat with Bells */}
                <path d="M18 13L10 6L8 9L13 14M18 13L18 4L20 4L19 13M18 13L26 6L28 9L23 14" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Bells */}
                <circle cx="8" cy="7" r="1.6" fill="#FBBF24" stroke="#B45309" strokeWidth="0.8"/>
                <circle cx="19" cy="3.5" r="1.6" fill="#FBBF24" stroke="#B45309" strokeWidth="0.8"/>
                <circle cx="28" cy="7" r="1.6" fill="#FBBF24" stroke="#B45309" strokeWidth="0.8"/>
                {/* Hat base */}
                <path d="M12 14Q18 16 24 14L22 17H14L12 14Z" fill="#10B981"/>
                {/* Face */}
                <circle cx="18" cy="20" r="4.5" fill="#FED7AA"/>
                {/* Mischievous smile */}
                <path d="M15.5 22Q18 24.5 20.5 22" stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round"/>
                {/* Eyes */}
                <circle cx="16.5" cy="19" r="0.7" fill="#0F172A"/>
                <circle cx="19.5" cy="19" r="0.7" fill="#0F172A"/>
                {/* Jester Collar / Ruff */}
                <path d="M9 25L13 29L18 25L23 29L27 25L29 40H7L9 25Z" fill={isRed ? "#EA580C" : "#0284C7"} stroke="#FCD34D" strokeWidth="1"/>
                <circle cx="13" cy="29" r="1" fill="#FBBF24"/>
                <circle cx="18" cy="27" r="1" fill="#FBBF24"/>
                <circle cx="23" cy="29" r="1" fill="#FBBF24"/>
              </svg>
            </div>
            <span className={`text-[7.5px] sm:text-[8.5px] font-bold font-arcade tracking-tight mt-0.5 ${isRed ? 'text-red-700' : 'text-slate-800'}`}>
              JESTER
            </span>
          </div>
        );
      case 'A':
        return (
          <div className="flex flex-col items-center justify-center leading-none text-center select-none">
            {/* Ace Grand Emblem with Laurel & Star */}
            <div className={`${figureBoxSize} rounded-md bg-gradient-to-b ${isRed ? 'from-red-50 via-white to-amber-50 border border-red-300/80' : 'from-slate-50 via-white to-amber-50 border border-slate-300'} flex flex-col items-center justify-center p-0.5 shadow-inner`}>
              <svg viewBox="0 0 36 44" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Laurel Leaves left */}
                <path d="M10 32C8 28 8 20 12 14C12 18 10 24 12 28" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M10 22C8 20 7 16 10 14" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round"/>
                {/* Laurel Leaves right */}
                <path d="M26 32C28 28 28 20 24 14C24 18 26 24 24 28" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M26 22C28 20 29 16 26 14" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round"/>
                {/* Center Star Emblem */}
                <path d="M18 8L19.5 12L24 12L20.5 14.5L22 19L18 16.5L14 19L15.5 14.5L12 12L16.5 12L18 8Z" fill="#F59E0B" stroke="#D97706" strokeWidth="0.8"/>
                {/* Large Center Suit Symbol */}
                <text x="18" y="31" textAnchor="middle" fontSize="16" fontWeight="bold" fill={isRed ? "#DC2626" : "#0F172A"} fontFamily="serif">
                  {suitSymbol}
                </text>
                {/* Bottom Ribbon */}
                <path d="M12 36Q18 38 24 36" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className={`text-[7.5px] sm:text-[8.5px] font-bold font-arcade tracking-tight mt-0.5 ${isRed ? 'text-red-700' : 'text-slate-800'}`}>
              ACE
            </span>
          </div>
        );
      default:
        // Number cards (2-10)
        return (
          <div className="flex flex-col items-center justify-center">
            <span className={`text-xl sm:text-2xl leading-none ${isRed ? 'text-red-600' : 'text-slate-950'}`}>
              {suitSymbol}
            </span>
          </div>
        );
    }
  };

  return (
    <div
      className={`${sizeClasses} rounded-xl bg-white border-2 border-amber-300/90 flex flex-col justify-between font-bold font-mono shadow-xl relative select-none overflow-hidden transition-transform ${className}`}
    >
      {/* Top Left Rank + Suit */}
      <div className="flex items-center gap-0.5 leading-none z-10">
        <span className={`${isRed ? 'text-red-600' : 'text-slate-950'} font-bold`}>
          {rank === 'T' ? '10' : rank}
        </span>
        <span className={`text-[10px] leading-none ${isRed ? 'text-red-600' : 'text-slate-950'}`}>
          {suitSymbol}
        </span>
      </div>

      {/* Center Figure / Icon & Suit */}
      <div className="self-center my-auto z-10">
        {renderRoyalFigure()}
      </div>

      {/* Bottom Right Rank + Suit (Rotated 180) */}
      <div className="flex items-center gap-0.5 leading-none self-end rotate-180 z-10">
        <span className={`${isRed ? 'text-red-600' : 'text-slate-950'} font-bold`}>
          {rank === 'T' ? '10' : rank}
        </span>
        <span className={`text-[10px] leading-none ${isRed ? 'text-red-600' : 'text-slate-950'}`}>
          {suitSymbol}
        </span>
      </div>

      {/* Subtle Background Watermark on face cards */}
      {(rank === 'K' || rank === 'Q' || rank === 'J' || rank === 'A') && (
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-4xl text-slate-950">
          {suitSymbol}
        </div>
      )}
    </div>
  );
};
