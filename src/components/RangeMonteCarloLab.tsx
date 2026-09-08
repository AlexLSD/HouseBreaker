import React, { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { generate13x13Matrix, RangeCell, runMonteCarloEquitySim, createCard } from '../utils/mathEngine';
import { CardBitfield } from '../types';
import {
  Award,
  BarChart2,
  Calculator,
  CheckCircle,
  Coins,
  Cpu,
  Filter,
  Flame,
  Info,
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Zap
} from 'lucide-react';

interface RangeMonteCarloLabProps {
  onOpenGuide?: () => void;
}

export const RangeMonteCarloLab: React.FC<RangeMonteCarloLabProps> = ({ onOpenGuide }) => {
  const { t } = useLanguage();
  const [rangeMatrix, setRangeMatrix] = useState<RangeCell[][]>(() => generate13x13Matrix());
  const [selectedCell, setSelectedCell] = useState<RangeCell | null>(null);
  const [activePreset, setActivePreset] = useState<string>('GTO_OPEN');
  const [simIterations, setSimIterations] = useState<number>(100000);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Practical Pot Odds Comparator State
  const [potSize, setPotSize] = useState<number>(150);
  const [betFaced, setBetFaced] = useState<number>(50);

  // Board Cards
  const [boardCards, setBoardCards] = useState<CardBitfield[]>([
    createCard('A', 's'),
    createCard('K', 'h'),
    createCard('7', 'd')
  ]);

  // Hero hand
  const heroCards: CardBitfield[] = [createCard('A', 'c'), createCard('Q', 's')];

  // Monte Carlo simulation state
  const [simResults, setSimResults] = useState<{
    winEquity: number;
    tieEquity: number;
    lossEquity: number;
    samplesRun: number;
  }>({
    winEquity: 68.4,
    tieEquity: 3.2,
    lossEquity: 28.4,
    samplesRun: 100000
  });

  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    const newMatrix = generate13x13Matrix();

    for (let r = 0; r < 13; r++) {
      for (let c = 0; c < 13; c++) {
        const cell = newMatrix[r][c];
        if (presetKey === 'GTO_OPEN') {
          // Top ~18% range
          if (cell.type === 'PAIR') {
            cell.weight = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7'].includes(cell.rank1) ? 1.0 : 0.4;
          } else if (cell.type === 'SUITED') {
            cell.weight = r <= 2 ? 1.0 : r <= 4 && c <= 8 ? 0.7 : 0.0;
          } else {
            cell.weight = r <= 1 && c <= 3 ? 0.8 : 0.0;
          }
        } else if (presetKey === 'TIGHT_EP') {
          // Top ~12%
          if (cell.type === 'PAIR') {
            cell.weight = ['A', 'K', 'Q', 'J', 'T'].includes(cell.rank1) ? 1.0 : 0.0;
          } else if (cell.type === 'SUITED') {
            cell.weight = r === 0 && c <= 4 ? 1.0 : 0.0;
          } else {
            cell.weight = cell.handKey === 'AKo' ? 1.0 : 0.0;
          }
        } else if (presetKey === 'LOOSE_BTN') {
          // Top ~45%
          cell.weight = Math.min(1.0, cell.weight + 0.4);
        } else if (presetKey === 'PAIRS_BROADWAYS') {
          if (cell.type === 'PAIR') cell.weight = 1.0;
          else if (['A', 'K', 'Q', 'J', 'T'].includes(cell.rank1) && ['A', 'K', 'Q', 'J', 'T'].includes(cell.rank2)) {
            cell.weight = 1.0;
          } else {
            cell.weight = 0.0;
          }
        }
      }
    }
    setRangeMatrix(newMatrix);
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = runMonteCarloEquitySim(heroCards, boardCards, simIterations);
      setSimResults(res);
      setIsSimulating(false);
    }, 250);
  };

  // Calculate total combinations in range
  const totalCombos = useMemo(() => {
    let combos = 0;
    for (const row of rangeMatrix) {
      for (const cell of row) {
        combos += cell.comboCount * cell.weight;
      }
    }
    return Math.round(combos);
  }, [rangeMatrix]);

  const percentageOfAllHands = ((totalCombos / 1326) * 100).toFixed(1);

  // Pot odds needed
  const potOddsRequired = Math.round((betFaced / (potSize + betFaced * 2)) * 100);
  const isCallProfitable = simResults.winEquity >= potOddsRequired;
  const netEvCall = Math.round(((simResults.winEquity / 100) * (potSize + betFaced)) - ((1 - simResults.winEquity / 100) * betFaced));

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans-arcade">
      {/* Header arcade marquee */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#121826] to-[#0F1420] border-2 border-[#2A3750] rounded-2xl p-3.5 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-arcade uppercase tracking-wider flex items-center gap-1.5">
              {t.pokerLabTitle}
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 font-mono-telemetry border border-purple-500/40">
                {t.pokerMatrixBadge}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {t.pokerLabSub}
            </p>
          </div>
        </div>

        {/* Range Presets & Guide Button */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-arcade">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#141F33] hover:bg-[#1E2F4C] border border-sky-500/40 text-sky-300 hover:text-white text-xs font-arcade transition-all cursor-pointer shadow-sm active:scale-95"
              title="Explain Poker GTO Ranges, Pot Odds & MDF (i)"
            >
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden xs:inline">{t.btnFeatureGuide} (i)</span>
              <span className="xs:hidden">(i)</span>
            </button>
          )}

          {[
            { id: 'GTO_OPEN', label: t.gtoOpenPreset },
            { id: 'TIGHT_EP', label: t.tightUtgPreset },
            { id: 'LOOSE_BTN', label: t.looseBtnPreset },
            { id: 'PAIRS_BROADWAYS', label: t.pairsBroadwaysPreset }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                activePreset === p.id
                  ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#0A0D14] font-bold shadow-md'
                  : 'bg-[#182236] text-slate-300 hover:bg-[#23314D] border border-[#2B3B59]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 13x13 Heatmap Range Grid (7 Cols on desktop) */}
        <div className="lg:col-span-7 bg-[#0E1524] border-2 border-[#243552] rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-arcade">
              <span className="text-white font-bold">169 STRATEGIC HANDS</span>
              <span className="text-amber-400 font-mono-telemetry font-bold">{totalCombos} Combos ({percentageOfAllHands}%)</span>
            </div>
            <span className="text-[10px] text-slate-400 font-sans-arcade">Pairs diagonal • Suited top-right • Offsuit bottom-left</span>
          </div>

          {/* Grid Container */}
          <div className="overflow-x-auto pb-1">
            <div className="min-w-[340px] max-w-full grid grid-cols-13 gap-0.5 select-none">
              {rangeMatrix.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  const isPair = cell.type === 'PAIR';
                  const isSuited = cell.type === 'SUITED';
                  const isSelected = selectedCell?.handKey === cell.handKey;

                  // Background heatmap color based on weight
                  let bgStyle = 'bg-[#131C2D] text-slate-500';
                  if (cell.weight > 0.75) {
                    bgStyle = isPair ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : isSuited ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'bg-emerald-500 text-slate-950 font-bold shadow-sm';
                  } else if (cell.weight > 0.3) {
                    bgStyle = isPair ? 'bg-amber-950/70 text-amber-200 border border-amber-600/40' : isSuited ? 'bg-cyan-950/70 text-cyan-200 border border-cyan-600/40' : 'bg-emerald-950/70 text-emerald-200 border border-emerald-600/40';
                  } else if (cell.weight > 0) {
                    bgStyle = 'bg-[#1C283F] text-slate-300';
                  }

                  return (
                    <button
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => {
                        setSelectedCell(cell);
                        const updated = [...rangeMatrix];
                        updated[rIdx][cIdx].weight = cell.weight >= 1 ? 0 : cell.weight === 0 ? 0.5 : 1.0;
                        setRangeMatrix(updated);
                      }}
                      className={`aspect-square flex flex-col items-center justify-center rounded-[3px] text-[8px] sm:text-[9px] font-mono transition-all cursor-pointer ${bgStyle} ${
                        isSelected ? 'ring-2 ring-white scale-110 z-10 shadow-lg' : ''
                      }`}
                    >
                      <span>{cell.handKey}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-[#1E2E4A] text-[11px] font-sans-arcade text-slate-300">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" /> Pocket Pairs
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-cyan-500 inline-block" /> Suited Hand
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Offsuit
              </span>
            </div>
            <span className="text-slate-400">Tap cell to cycle frequency (0%, 50%, 100%)</span>
          </div>
        </div>

        {/* Monte Carlo & Practical Pot Odds Solver (5 Cols on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Simulation Output Card */}
          <div className="bg-[#0E1524] border-2 border-[#243552] rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-arcade uppercase tracking-wider text-white">
                Hero Equity vs Range
              </span>
              <span className="text-[10px] text-amber-400 font-mono-telemetry font-bold">
                100,000 Rollouts
              </span>
            </div>

            {/* Hand vs Board Display */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#070D17] border border-[#1E2E4A]">
              <div>
                <span className="text-[10px] text-slate-400 font-sans-arcade block">HERO HOLDING</span>
                <span className="text-xs font-bold font-arcade text-amber-400">A♣ Q♠</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-sans-arcade block">BOARD FLOP</span>
                <span className="text-xs font-bold font-arcade text-white">A♠ K♥ 7♦</span>
              </div>
            </div>

            {/* Probability Density Curve */}
            <div className="p-3 rounded-xl bg-[#070D17] border border-[#1E2E4A] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-sans-arcade">HERO WIN EQUITY:</span>
                <span className="text-xl font-bold font-mono-telemetry text-emerald-400">{simResults.winEquity}%</span>
              </div>

              {/* Stacked Equity Bar */}
              <div className="w-full h-3.5 rounded-full bg-[#162135] overflow-hidden flex shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${simResults.winEquity}%` }}
                />
                <div
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${simResults.tieEquity}%` }}
                />
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${simResults.lossEquity}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono-telemetry text-slate-300">
                <span className="text-emerald-400 font-bold">Win: {simResults.winEquity}%</span>
                <span className="text-amber-400 font-bold">Tie: {simResults.tieEquity}%</span>
                <span className="text-rose-400 font-bold">Loss: {simResults.lossEquity}%</span>
              </div>
            </div>

            {/* Practical Decision Callout (Equity vs Pot Odds) */}
            <div className="p-3.5 rounded-xl bg-[#070D17] border border-[#1E2E4A] space-y-2.5">
              <span className="text-[10px] text-slate-400 font-arcade uppercase tracking-wider block">
                Live Table Pot Odds Evaluator
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">{t.potSize}</label>
                  <input
                    type="number"
                    value={potSize}
                    onChange={e => setPotSize(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#111A2C] border border-[#243552] text-white font-mono-telemetry font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">{t.betFacing}</label>
                  <input
                    type="number"
                    value={betFaced}
                    onChange={e => setBetFaced(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#111A2C] border border-[#243552] text-white font-mono-telemetry font-bold text-xs"
                  />
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex flex-col gap-1 ${
                isCallProfitable ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-arcade">
                    {isCallProfitable ? t.callProfitable : t.foldRecommendation}
                  </span>
                  <span className="text-[11px] font-mono-telemetry font-bold">
                    {netEvCall >= 0 ? `+$${netEvCall} EV` : `-$${Math.abs(netEvCall)} EV`}
                  </span>
                </div>
                <span className="text-[10px] text-slate-300">
                  Pot Odds required: {potOddsRequired}% | Your actual equity: {simResults.winEquity}%
                </span>
              </div>
            </div>

            {/* Simulation Action Button */}
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] disabled:opacity-50 text-[#0A0D14] font-arcade font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              {isSimulating ? 'Simulating 100,000 Hands...' : t.runEquitySimBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
