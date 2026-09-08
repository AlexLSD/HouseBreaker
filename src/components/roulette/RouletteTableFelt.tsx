import React, { useState } from 'react';
import {
  RoulettePocket,
  RouletteBet,
  BetType,
  RED_NUMBERS,
  RouletteVariant
} from '../../utils/rouletteEngine';
import { sounds } from '../../utils/soundEffects';
import { CasinoChipStack } from '../CasinoChipStack';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface RouletteTableFeltProps {
  variant: RouletteVariant;
  bets: RouletteBet[];
  onPlaceBet: (type: BetType, label: string, numbers: RoulettePocket[], payoutRatio: number, betId?: string) => void;
  onClearBets: () => void;
  onDoubleBets: () => void;
  activeChip: number;
  onSelectChip: (amount: number) => void;
  disabled?: boolean;
}

const CHIP_PRESETS = [
  { value: 5, label: '$5', bg: 'bg-red-700 border-red-400 text-white' },
  { value: 25, label: '$25', bg: 'bg-emerald-700 border-emerald-400 text-white' },
  { value: 100, label: '$100', bg: 'bg-slate-900 border-amber-400 text-amber-300' },
  { value: 500, label: '$500', bg: 'bg-purple-900 border-purple-400 text-purple-200' },
];

export const RouletteTableFelt: React.FC<RouletteTableFeltProps> = ({
  variant,
  bets,
  onPlaceBet,
  onClearBets,
  onDoubleBets,
  activeChip,
  onSelectChip,
  disabled = false
}) => {
  const [showCombos, setShowCombos] = useState(false);

  // Find current amount bet on a specific identifier
  const getBetAmount = (id: string): number => {
    const found = bets.find(b => b.id === id);
    return found ? found.amount : 0;
  };

  const handleBetClick = (
    type: BetType,
    label: string,
    numbers: RoulettePocket[],
    payoutRatio: number,
    betId?: string
  ) => {
    if (disabled) return;
    sounds.playChip();
    onPlaceBet(type, label, numbers, payoutRatio, betId);
  };

  // 3 Rows of Numbers
  const row1 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
  const row2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
  const row3 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];

  // Mathematical win probabilities based on wheel variant
  const evenChance = variant === 'AMERICAN' ? '47.4%' : '48.6%';
  const dozenChance = variant === 'AMERICAN' ? '31.6%' : '32.4%';
  const straightChance = variant === 'AMERICAN' ? '2.63%' : '2.70%';

  // Helper 3D chip stack renderer
  const renderChipStack = (betId: string, size: 'xs' | 'sm' | 'md' = 'sm') => {
    const amount = getBetAmount(betId);
    if (amount <= 0) return null;
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none drop-shadow-lg">
        <CasinoChipStack amount={amount} size={size} showCount={true} />
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-3 font-sans-arcade">
      {/* Chip Selector & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-[#091510] border border-[#1d4331] text-xs shadow-md">
        {/* Chip Denominations */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] sm:text-[11px] text-slate-300 font-arcade uppercase mr-0.5 whitespace-nowrap">
            CHIP:
          </span>
          {CHIP_PRESETS.map(chip => (
            <button
              key={chip.value}
              onClick={() => {
                sounds.playChip();
                onSelectChip(chip.value);
              }}
              disabled={disabled}
              className={`p-0.5 rounded-full transition-all cursor-pointer select-none active:scale-95 ${
                activeChip === chip.value
                  ? 'ring-2 ring-amber-300 ring-offset-2 ring-offset-[#091510] scale-110 shadow-lg'
                  : 'opacity-85 hover:opacity-100'
              }`}
              title={`Select $${chip.value} chip`}
            >
              <CasinoChipStack amount={chip.value} size="sm" showCount={false} />
            </button>
          ))}
        </div>

        {/* Clear & Double Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              onDoubleBets();
            }}
            disabled={disabled || bets.length === 0}
            className="min-h-[40px] px-3 sm:px-4 py-2 rounded-xl bg-[#14291f] hover:bg-[#1f3f30] border border-[#2b5944] text-amber-300 font-arcade font-bold text-[11px] sm:text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95"
          >
            2X DOUBLE
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onClearBets();
            }}
            disabled={disabled || bets.length === 0}
            className="min-h-[40px] px-3 sm:px-4 py-2 rounded-xl bg-[#2b1619] hover:bg-[#401f24] border border-[#592b32] text-rose-300 font-arcade font-bold text-[11px] sm:text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95"
          >
            CLEAR FELT
          </button>
        </div>
      </div>

      {/* Mobile Swipe Guidance Banner (visible on mobile/tablet) */}
      <div className="flex md:hidden items-center justify-between px-3 py-1.5 bg-[#06180f] rounded-xl border border-[#1b3d2a] text-[10px] text-emerald-300 font-mono-telemetry shadow-inner">
        <span className="flex items-center gap-1 font-bold">
          <span>← Swipe felt to view all numbers & columns →</span>
        </span>
        <span className="text-amber-400 font-bold uppercase">36 Pockets</span>
      </div>

      {/* Traditional Green Roulette Felt Grid */}
      <div className="p-3 sm:p-4 rounded-3xl bg-gradient-to-b from-[#08301d] via-[#052415] to-[#03150d] border-4 border-[#255237] shadow-2xl overflow-x-auto scrollbar-thin scrollbar-thumb-emerald-700/60 scrollbar-track-emerald-950/40 touch-pan-x">
        <div className="min-w-[620px] flex flex-col gap-1 select-none">
          {/* Main Board: Zeros + 3 Number Rows + 2to1 Column Bets */}
          <div className="flex gap-1">
            {/* Zero Pockets (Left Wing) */}
            <div className="flex flex-col gap-1 w-14 shrink-0">
              <button
                onClick={() => handleBetClick('STRAIGHT_UP', 'Zero (0)', [0], 35, 'STRAIGHT_UP_0')}
                disabled={disabled}
                className={`relative flex-1 rounded-xl bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 text-white font-mono-telemetry font-bold text-sm sm:text-base flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                  variant === 'AMERICAN' ? 'h-[58px]' : 'h-[120px]'
                }`}
              >
                <span className="relative z-10">0</span>
                {renderChipStack('STRAIGHT_UP_0', 'sm')}
              </button>

              {variant === 'AMERICAN' && (
                <button
                  onClick={() => handleBetClick('STRAIGHT_UP', 'Double Zero (00)', ['00'], 35, 'STRAIGHT_UP_00')}
                  disabled={disabled}
                  className="relative flex-1 rounded-xl bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 text-white font-mono-telemetry font-bold text-sm sm:text-base flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 h-[58px]"
                >
                  <span className="relative z-10">00</span>
                  {renderChipStack('STRAIGHT_UP_00', 'sm')}
                </button>
              )}
            </div>

            {/* 12 Columns of Numbers (3 Rows) */}
            <div className="flex-1 flex flex-col gap-1">
              {/* Row 1 (Top: 3, 6, 9... 36) */}
              <div className="grid grid-cols-12 gap-1">
                {row1.map(n => {
                  const isRed = RED_NUMBERS.has(n);
                  const betId = `STRAIGHT_UP_${n}`;
                  return (
                    <button
                      key={n}
                      onClick={() => handleBetClick('STRAIGHT_UP', `Number ${n}`, [n], 35, betId)}
                      disabled={disabled}
                      className={`relative h-10 rounded-lg border font-mono-telemetry font-bold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 ${
                        isRed
                          ? 'bg-[#c52222] hover:bg-[#dd2929] border-red-500 text-white'
                          : 'bg-[#151c24] hover:bg-[#202b38] border-slate-700 text-white'
                      }`}
                    >
                      <span className="relative z-10">{n}</span>
                      {renderChipStack(betId, 'xs')}
                    </button>
                  );
                })}
              </div>

              {/* Row 2 (Middle: 2, 5, 8... 35) */}
              <div className="grid grid-cols-12 gap-1">
                {row2.map(n => {
                  const isRed = RED_NUMBERS.has(n);
                  const betId = `STRAIGHT_UP_${n}`;
                  return (
                    <button
                      key={n}
                      onClick={() => handleBetClick('STRAIGHT_UP', `Number ${n}`, [n], 35, betId)}
                      disabled={disabled}
                      className={`relative h-10 rounded-lg border font-mono-telemetry font-bold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 ${
                        isRed
                          ? 'bg-[#c52222] hover:bg-[#dd2929] border-red-500 text-white'
                          : 'bg-[#151c24] hover:bg-[#202b38] border-slate-700 text-white'
                      }`}
                    >
                      <span className="relative z-10">{n}</span>
                      {renderChipStack(betId, 'xs')}
                    </button>
                  );
                })}
              </div>

              {/* Row 3 (Bottom: 1, 4, 7... 34) */}
              <div className="grid grid-cols-12 gap-1">
                {row3.map(n => {
                  const isRed = RED_NUMBERS.has(n);
                  const betId = `STRAIGHT_UP_${n}`;
                  return (
                    <button
                      key={n}
                      onClick={() => handleBetClick('STRAIGHT_UP', `Number ${n}`, [n], 35, betId)}
                      disabled={disabled}
                      className={`relative h-10 rounded-lg border font-mono-telemetry font-bold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 ${
                        isRed
                          ? 'bg-[#c52222] hover:bg-[#dd2929] border-red-500 text-white'
                          : 'bg-[#151c24] hover:bg-[#202b38] border-slate-700 text-white'
                      }`}
                    >
                      <span className="relative z-10">{n}</span>
                      {renderChipStack(betId, 'xs')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right End: 2 to 1 Column Bets */}
            <div className="flex flex-col gap-1 w-14 shrink-0">
              <button
                onClick={() => handleBetClick('COLUMN', 'Column 1 (Top)', row1, 2, 'COLUMN_1')}
                disabled={disabled}
                className="relative flex-1 h-10 rounded-lg bg-[#0e271a] hover:bg-[#143926] border border-[#2b5944] text-amber-300 font-arcade text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title={`Column 1 (Pays 2:1 | Win chance: ${dozenChance})`}
              >
                <div className="flex flex-col items-center justify-center leading-none relative z-10">
                  <span>2 to 1</span>
                  <span className="text-[9px] text-amber-400/80 font-mono-telemetry font-normal">{dozenChance}</span>
                </div>
                {renderChipStack('COLUMN_1', 'sm')}
              </button>
              <button
                onClick={() => handleBetClick('COLUMN', 'Column 2 (Mid)', row2, 2, 'COLUMN_2')}
                disabled={disabled}
                className="relative flex-1 h-10 rounded-lg bg-[#0e271a] hover:bg-[#143926] border border-[#2b5944] text-amber-300 font-arcade text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title={`Column 2 (Pays 2:1 | Win chance: ${dozenChance})`}
              >
                <div className="flex flex-col items-center justify-center leading-none relative z-10">
                  <span>2 to 1</span>
                  <span className="text-[9px] text-amber-400/80 font-mono-telemetry font-normal">{dozenChance}</span>
                </div>
                {renderChipStack('COLUMN_2', 'sm')}
              </button>
              <button
                onClick={() => handleBetClick('COLUMN', 'Column 3 (Bot)', row3, 2, 'COLUMN_3')}
                disabled={disabled}
                className="relative flex-1 h-10 rounded-lg bg-[#0e271a] hover:bg-[#143926] border border-[#2b5944] text-amber-300 font-arcade text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title={`Column 3 (Pays 2:1 | Win chance: ${dozenChance})`}
              >
                <div className="flex flex-col items-center justify-center leading-none relative z-10">
                  <span>2 to 1</span>
                  <span className="text-[9px] text-amber-400/80 font-mono-telemetry font-normal">{dozenChance}</span>
                </div>
                {renderChipStack('COLUMN_3', 'sm')}
              </button>
            </div>
          </div>

          {/* Dozen Bets (1st 12, 2nd 12, 3rd 12) */}
          <div className="flex gap-1 pl-15 pr-15">
            <button
              onClick={() =>
                handleBetClick(
                  'DOZEN',
                  '1st Dozen (1-12)',
                  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                  2,
                  'DOZEN_1'
                )
              }
              disabled={disabled}
              className="relative flex-1 h-10 rounded-lg bg-[#0c2217] hover:bg-[#123021] border border-[#244c37] text-white font-arcade font-bold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title={`1st Dozen 1-12 (Pays 2:1 | Win chance: ${dozenChance})`}
            >
              <div className="flex flex-col items-center justify-center leading-none relative z-10">
                <span>1st 12</span>
                <span className="text-[9px] text-amber-300/80 font-mono-telemetry font-normal">{dozenChance}</span>
              </div>
              {renderChipStack('DOZEN_1', 'sm')}
            </button>
            <button
              onClick={() =>
                handleBetClick(
                  'DOZEN',
                  '2nd Dozen (13-24)',
                  [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
                  2,
                  'DOZEN_2'
                )
              }
              disabled={disabled}
              className="relative flex-1 h-10 rounded-lg bg-[#0c2217] hover:bg-[#123021] border border-[#244c37] text-white font-arcade font-bold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title={`2nd Dozen 13-24 (Pays 2:1 | Win chance: ${dozenChance})`}
            >
              <div className="flex flex-col items-center justify-center leading-none relative z-10">
                <span>2nd 12</span>
                <span className="text-[9px] text-amber-300/80 font-mono-telemetry font-normal">{dozenChance}</span>
              </div>
              {renderChipStack('DOZEN_2', 'sm')}
            </button>
            <button
              onClick={() =>
                handleBetClick(
                  'DOZEN',
                  '3rd Dozen (25-36)',
                  [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
                  2,
                  'DOZEN_3'
                )
              }
              disabled={disabled}
              className="relative flex-1 h-10 rounded-lg bg-[#0c2217] hover:bg-[#123021] border border-[#244c37] text-white font-arcade font-bold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title={`3rd Dozen 25-36 (Pays 2:1 | Win chance: ${dozenChance})`}
            >
              <div className="flex flex-col items-center justify-center leading-none relative z-10">
                <span>3rd 12</span>
                <span className="text-[9px] text-amber-300/80 font-mono-telemetry font-normal">{dozenChance}</span>
              </div>
              {renderChipStack('DOZEN_3', 'sm')}
            </button>
          </div>

          {/* Outside Even-Money Bets (1:1) */}
          <div className="flex gap-1 pl-15 pr-15">
            <button
              onClick={() =>
                handleBetClick(
                  'LOW',
                  'Low (1-18)',
                  Array.from({ length: 18 }, (_, i) => i + 1),
                  1,
                  'LOW_1_18'
                )
              }
              disabled={disabled}
              className="relative flex-1 h-10 rounded-lg bg-[#0c2217] hover:bg-[#123021] border border-[#244c37] text-slate-200 font-arcade font-bold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title={`Low 1-18 (Pays 1:1 | Win chance: ${evenChance})`}
            >
              <div className="flex flex-col items-center justify-center leading-none relative z-10">
                <span>1 to 18</span>
                <span className="text-[9px] text-emerald-400 font-mono-telemetry font-normal">{evenChance}</span>
              </div>
              {renderChipStack('LOW_1_18', 'sm')}
            </button>
            <button
              onClick={() =>
                handleBetClick(
                  'EVEN',
                  'Even',
                  Array.from({ length: 18 }, (_, i) => (i + 1) * 2),
                  1,
                  'EVEN'
                )
              }
              disabled={disabled}
              className="relative flex-1 h-10 rounded-lg bg-[#0c2217] hover:bg-[#123021] border border-[#244c37] text-slate-200 font-arcade font-bold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title={`Even Numbers (Pays 1:1 | Win chance: ${evenChance})`}
            >
              <div className="flex flex-col items-center justify-center leading-none relative z-10">
                <span>EVEN</span>
                <span className="text-[9px] text-emerald-400 font-mono-telemetry font-normal">{evenChance}</span>
              </div>
              {renderChipStack('EVEN', 'sm')}
            </button>
            <button
              onClick={() =>
                handleBetClick('RED', 'Red', Array.from(RED_NUMBERS), 1, 'RED')
              }
              disabled={disabled}
              className="relative flex-1 h-10 rounded-lg bg-[#b91c1c] hover:bg-[#dc2626] border border-red-400 text-white font-arcade font-bold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title={`Red Pockets (Pays 1:1 | Win chance: ${evenChance})`}
            >
              <div className="flex flex-col items-center justify-center leading-none relative z-10">
                <span>RED ♦</span>
                <span className="text-[9px] text-red-200 font-mono-telemetry font-normal">{evenChance}</span>
              </div>
              {renderChipStack('RED', 'sm')}
            </button>
            <button
              onClick={() => {
                const blackNums = Array.from({ length: 36 }, (_, i) => i + 1).filter(
                  n => !RED_NUMBERS.has(n)
                );
                handleBetClick('BLACK', 'Black', blackNums, 1, 'BLACK');
              }}
              disabled={disabled}
              className="relative flex-1 h-10 rounded-lg bg-[#111827] hover:bg-[#1f2937] border border-slate-600 text-white font-arcade font-bold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title={`Black Pockets (Pays 1:1 | Win chance: ${evenChance})`}
            >
              <div className="flex flex-col items-center justify-center leading-none relative z-10">
                <span>BLACK ♠</span>
                <span className="text-[9px] text-slate-300 font-mono-telemetry font-normal">{evenChance}</span>
              </div>
              {renderChipStack('BLACK', 'sm')}
            </button>
            <button
              onClick={() =>
                handleBetClick(
                  'ODD',
                  'Odd',
                  Array.from({ length: 18 }, (_, i) => i * 2 + 1),
                  1,
                  'ODD'
                )
              }
              disabled={disabled}
              className="relative flex-1 h-10 rounded-lg bg-[#0c2217] hover:bg-[#123021] border border-[#244c37] text-slate-200 font-arcade font-bold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title={`Odd Numbers (Pays 1:1 | Win chance: ${evenChance})`}
            >
              <div className="flex flex-col items-center justify-center leading-none relative z-10">
                <span>ODD</span>
                <span className="text-[9px] text-emerald-400 font-mono-telemetry font-normal">{evenChance}</span>
              </div>
              {renderChipStack('ODD', 'sm')}
            </button>
            <button
              onClick={() =>
                handleBetClick(
                  'HIGH',
                  'High (19-36)',
                  Array.from({ length: 18 }, (_, i) => i + 19),
                  1,
                  'HIGH_19_36'
                )
              }
              disabled={disabled}
              className="relative flex-1 h-10 rounded-lg bg-[#0c2217] hover:bg-[#123021] border border-[#244c37] text-slate-200 font-arcade font-bold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title={`High 19-36 (Pays 1:1 | Win chance: ${evenChance})`}
            >
              <div className="flex flex-col items-center justify-center leading-none relative z-10">
                <span>19 to 36</span>
                <span className="text-[9px] text-emerald-400 font-mono-telemetry font-normal">{evenChance}</span>
              </div>
              {renderChipStack('HIGH_19_36', 'sm')}
            </button>
          </div>

          {/* Toggle Inside Multi-Bets (Corners, Splits, Basket) */}
          <div className="pt-2 px-15">
            <button
              onClick={() => setShowCombos(!showCombos)}
              className="w-full py-1.5 px-3 rounded-xl bg-[#071d13] hover:bg-[#0c2b1d] border border-[#1f4a35] text-amber-300/90 hover:text-amber-200 font-arcade text-xs flex items-center justify-between cursor-pointer transition-colors shadow-inner"
            >
              <span className="flex items-center gap-1.5 font-bold">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                INSIDE COMBINATION BETS (CORNERS 8:1, SPLITS 17:1, BASKET 6:1)
              </span>
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                {showCombos ? 'HIDE OPTIONS' : 'VIEW OPTIONS & PLACE CHIPS'}
                {showCombos ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            </button>

            {showCombos && (
              <div className="mt-2 p-2.5 rounded-2xl bg-[#05180f] border border-[#1d4331] space-y-2 animate-fade-in">
                {/* Popular Corners (8:1) */}
                <div>
                  <span className="text-[10px] text-slate-400 font-arcade uppercase block mb-1">
                    CORNERS (4 NUMBERS — PAYS 8:1):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {[
                      { id: 'CORNER_1_2_4_5', label: 'Corner 1-2-4-5', nums: [1, 2, 4, 5] },
                      { id: 'CORNER_7_8_10_11', label: 'Corner 7-8-10-11', nums: [7, 8, 10, 11] },
                      { id: 'CORNER_16_17_19_20', label: 'Corner 16-17-19-20', nums: [16, 17, 19, 20] },
                      { id: 'CORNER_25_26_28_29', label: 'Corner 25-26-28-29', nums: [25, 26, 28, 29] },
                      { id: 'CORNER_31_32_34_35', label: 'Corner 31-32-34-35', nums: [31, 32, 34, 35] },
                    ].map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleBetClick('CORNER', c.label, c.nums, 8, c.id)}
                        disabled={disabled}
                        className="relative p-2 rounded-xl bg-[#0c2419] hover:bg-[#133624] border border-[#255239] text-amber-300 font-arcade text-[10px] text-center transition-all cursor-pointer active:scale-95 flex flex-col items-center justify-center min-h-[44px]"
                      >
                        <span className="relative z-10 leading-tight">{c.label}</span>
                        {renderChipStack(c.id, 'xs')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Splits & Basket */}
                <div>
                  <span className="text-[10px] text-slate-400 font-arcade uppercase block mb-1">
                    SPLITS (17:1) & BASKET:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: 'SPLIT_1_2', label: 'Split 1 / 2 (17:1)', nums: [1, 2], ratio: 17 },
                      { id: 'SPLIT_17_20', label: 'Split 17 / 20 (17:1)', nums: [17, 20], ratio: 17 },
                      { id: 'SPLIT_26_27', label: 'Split 26 / 27 (17:1)', nums: [26, 27], ratio: 17 },
                      variant === 'AMERICAN'
                        ? { id: 'BASKET_AMER', label: 'Basket 0-00-1-2-3 (6:1)', nums: [0, '00', 1, 2, 3] as RoulettePocket[], ratio: 6 }
                        : { id: 'BASKET_EURO', label: 'First Four 0-1-2-3 (8:1)', nums: [0, 1, 2, 3] as RoulettePocket[], ratio: 8 }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleBetClick('SPLIT', item.label, item.nums, item.ratio, item.id)}
                        disabled={disabled}
                        className="relative p-2 rounded-xl bg-[#0c2419] hover:bg-[#133624] border border-[#255239] text-emerald-300 font-arcade text-[10px] text-center transition-all cursor-pointer active:scale-95 flex flex-col items-center justify-center min-h-[44px]"
                      >
                        <span className="relative z-10 leading-tight">{item.label}</span>
                        {renderChipStack(item.id, 'xs')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
