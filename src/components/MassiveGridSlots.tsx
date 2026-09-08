import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  DEFAULT_SLOT_SYMBOLS,
  executeSpinCycle,
  generateRandomGrid,
  computeMustHitByAdvantage
} from '../utils/mathEngine';
import { SlotGridConfig, SlotSpinCycleResult } from '../types';
import {
  Activity,
  AlertCircle,
  Coins,
  Compass,
  DollarSign,
  Flame,
  Grid,
  Info,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
  Zap,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface MassiveGridSlotsProps {
  onOpenGuide?: () => void;
}

export const MassiveGridSlots: React.FC<MassiveGridSlotsProps> = ({ onOpenGuide }) => {
  const { t } = useLanguage();
  // Grid Dimensions: 5x3, 5x5, 7x7, 10x10, 20x20, 40x40
  const [gridSize, setGridSize] = useState<{ rows: number; cols: number }>({ rows: 7, cols: 7 });
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // Must-Hit-By Progressive Parameters (Casino floor defaults)
  const [progressiveCap, setProgressiveCap] = useState<number>(500);
  const [progressiveCurrent, setProgressiveCurrent] = useState<number>(474);
  const [meterRate, setMeterRate] = useState<number>(0.02); // 2%
  const [baseRTP, setBaseRTP] = useState<number>(0.88);     // 88%

  // Slot Config
  const slotConfig: SlotGridConfig = useMemo(() => ({
    rows: gridSize.rows,
    cols: gridSize.cols,
    payMechanism: 'CLUSTER',
    minClusterSize: gridSize.rows >= 20 ? 8 : 5,
    symbols: DEFAULT_SLOT_SYMBOLS,
    progressiveCap,
    progressiveCurrent,
    meterContributionRate: meterRate,
    baseRTP
  }), [gridSize, progressiveCap, progressiveCurrent, meterRate, baseRTP]);

  // Active Grid & Results
  const [grid, setGrid] = useState<number[][]>(() =>
    generateRandomGrid(gridSize.rows, gridSize.cols, DEFAULT_SLOT_SYMBOLS)
  );
  const [cycleResult, setCycleResult] = useState<SlotSpinCycleResult | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [cumulativeWin, setCumulativeWin] = useState<number>(0);
  const [spinCount, setSpinCount] = useState<number>(142);
  const [winCount, setWinCount] = useState<number>(44);

  // Re-generate grid when dimensions change
  useEffect(() => {
    const newG = generateRandomGrid(gridSize.rows, gridSize.cols, DEFAULT_SLOT_SYMBOLS);
    setGrid(newG);
    setCycleResult(null);
  }, [gridSize]);

  // MHB calculations
  const mhbAdvantage = useMemo(() => {
    return computeMustHitByAdvantage(progressiveCap, progressiveCurrent, meterRate, baseRTP);
  }, [progressiveCap, progressiveCurrent, meterRate, baseRTP]);

  // Spin action
  const handleSpin = () => {
    setIsSpinning(true);
    setSpinCount(c => c + 1);

    // Advance progressive slightly on spin
    setProgressiveCurrent(curr => Math.min(progressiveCap, parseFloat((curr + 0.25).toFixed(2))));

    setTimeout(() => {
      const result = executeSpinCycle(slotConfig, grid);
      setGrid(result.finalGrid);
      setCycleResult(result);
      if (result.totalMultiplier > 0) {
        setWinCount(w => w + 1);
        setCumulativeWin(w => w + result.totalMultiplier * 1.0);
      }
      setIsSpinning(false);
    }, 200);
  };

  // Winning cell coordinates
  const winningCellsSet = useMemo(() => {
    const set = new Set<string>();
    if (cycleResult) {
      for (const cl of cycleResult.winningClusters) {
        for (const [r, c] of cl.nodeCoordinates) {
          set.add(`${r},${c}`);
        }
      }
    }
    return set;
  }, [cycleResult]);

  const hitFrequency = spinCount > 0 ? ((winCount / spinCount) * 100).toFixed(1) : '31.2';

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans-arcade">
      {/* Top Arcade Marquee Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#121826] to-[#0F1420] border-2 border-[#2A3750] rounded-2xl p-3.5 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-arcade uppercase tracking-wider flex items-center gap-1.5">
              {t.slotsRadarTitle}
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-telemetry border border-amber-500/40">
                +EV RADAR
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {t.slotsRadarSub}
            </p>
          </div>
        </div>

        {/* Dimension Selectors & Guide Button */}
        <div className="flex items-center gap-1.5 font-arcade text-xs overflow-x-auto pb-1">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#141F33] hover:bg-[#1E2F4C] border border-sky-500/40 text-sky-300 hover:text-white text-xs font-arcade transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              title="Explain Must-Hit-By Math & Break-Even formula (i)"
            >
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden xs:inline">{t.btnFeatureGuide} (i)</span>
              <span className="xs:hidden">(i)</span>
            </button>
          )}

          {[
            { label: t.slotsClassic, rows: 3, cols: 5 },
            { label: t.slotsArcade, rows: 7, cols: 7 },
            { label: t.slotsCluster, rows: 10, cols: 10 },
            { label: t.slotsExtreme, rows: 20, cols: 20 },
            { label: '40x40 (1,600 Nodes)', rows: 40, cols: 40 },
          ].map(d => (
            <button
              key={`${d.rows}x${d.cols}`}
              onClick={() => setGridSize({ rows: d.rows, cols: d.cols })}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                gridSize.rows === d.rows && gridSize.cols === d.cols
                  ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#0A0D14] font-bold shadow-md'
                  : 'bg-[#182236] text-slate-300 hover:bg-[#23314D] border border-[#2B3B59]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Must-Hit-By Advantage Play Radar Banner */}
      <div className={`rounded-2xl border-2 p-4 transition-all shadow-xl ${
        mhbAdvantage.isPositiveEV
          ? 'bg-gradient-to-r from-emerald-950/70 via-[#0D2418] to-[#0A1620] border-emerald-500/80 shadow-emerald-950/50'
          : 'bg-[#0E1524] border-[#243552]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              mhbAdvantage.isPositiveEV
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-[#182338] text-slate-400 border-[#2A3B5A]'
            }`}>
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold font-arcade uppercase tracking-wider text-slate-300">
                  {t.slotsRadarEdge}
                </span>
                {mhbAdvantage.isPositiveEV ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-[#03100B] font-bold text-[10px] font-arcade tracking-wider animate-pulse shadow-md">
                    {t.playNowAdvantage}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 text-[10px] font-arcade">
                    {t.walkAwayNegative}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 font-mono-telemetry text-xs mt-1">
                <span className="text-white font-bold">
                  {t.currentMeter}: <strong className="text-amber-400">${progressiveCurrent.toFixed(2)}</strong> / Cap: ${progressiveCap}
                </span>
                <span className="text-slate-400">
                  {t.mustHitDistance}: <strong className="text-white">${mhbAdvantage.deltaJ}</strong>
                </span>
                <span className="text-slate-400">
                  {t.breakevenPoint}: <strong className="text-emerald-400">${mhbAdvantage.breakevenThreshold}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Adjust Floor Presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="text-right mr-2">
              <span className="text-[10px] text-slate-400 font-sans-arcade block">{t.expectedNetEdge}</span>
              <span className={`text-base font-bold font-mono-telemetry ${
                mhbAdvantage.expectedProfit >= 0 ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                {mhbAdvantage.expectedProfit >= 0 ? `+$${mhbAdvantage.expectedProfit.toFixed(2)}` : `-$${Math.abs(mhbAdvantage.expectedProfit).toFixed(2)}`}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { setProgressiveCap(500); setProgressiveCurrent(478); }}
                className="px-2.5 py-1.5 rounded-lg bg-[#182338] hover:bg-[#253554] text-slate-200 text-[11px] font-arcade border border-[#2B3B59] cursor-pointer"
              >
                $500 Cap
              </button>
              <button
                onClick={() => { setProgressiveCap(1000); setProgressiveCurrent(965); }}
                className="px-2.5 py-1.5 rounded-lg bg-[#182338] hover:bg-[#253554] text-slate-200 text-[11px] font-arcade border border-[#2B3B59] cursor-pointer"
              >
                $1,000 Cap
              </button>
              <button
                onClick={() => setProgressiveCurrent(mhbAdvantage.breakevenThreshold + 10)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold font-arcade cursor-pointer"
              >
                {t.triggerEv}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Viewport Canvas + Volatility HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Slot Grid Viewport Canvas */}
        <div className="lg:col-span-8 bg-[#0E1524] border-2 border-[#243552] rounded-2xl p-4 shadow-xl flex flex-col justify-between min-h-[420px]">
          {/* Top Bar with Zoom & Dimension Notice */}
          <div className="flex items-center justify-between pb-2 border-b border-[#1E2E4A] text-xs">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold font-arcade">
                GRID: {gridSize.rows} x {gridSize.cols} ({gridSize.rows * gridSize.cols} TILES)
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-amber-400 font-mono-telemetry font-bold">CLUSTER MATCH: {slotConfig.minClusterSize}+</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomLevel(z => Math.max(0.6, z - 0.2))}
                className="p-1.5 rounded-lg bg-[#152033] hover:bg-[#20304D] text-slate-300 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono-telemetry text-slate-300 w-10 text-center font-bold">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(z => Math.min(1.8, z + 0.2))}
                className="p-1.5 rounded-lg bg-[#152033] hover:bg-[#20304D] text-slate-300 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scalable Grid Viewport */}
          <div className="my-3 overflow-auto max-h-[380px] flex items-center justify-center p-3 bg-[#070D17] rounded-xl border border-[#1E2E4A] relative">
            <div
              className="grid gap-1 select-none transition-all duration-200"
              style={{
                gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))`,
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                width: gridSize.cols <= 10 ? '100%' : `${gridSize.cols * 18}px`
              }}
            >
              {grid.map((row, r) =>
                row.map((symId, c) => {
                  const isWinning = winningCellsSet.has(`${r},${c}`);
                  const symDef = DEFAULT_SLOT_SYMBOLS.find(s => s.id === symId) || DEFAULT_SLOT_SYMBOLS[0];

                  // 40x40 High Density: Tiny dot
                  if (gridSize.rows >= 20) {
                    return (
                      <div
                        key={`${r}-${c}`}
                        title={`${symDef.name} [${r},${c}]`}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[2px] transition-all flex items-center justify-center text-[7px] ${
                          isWinning
                            ? 'ring-2 ring-white scale-125 z-10 animate-pulse shadow-lg'
                            : ''
                        }`}
                        style={{
                          backgroundColor: isWinning ? '#10B981' : symDef.colorHex + '80',
                          border: isWinning ? '1px solid #FFFFFF' : '1px solid #243552'
                        }}
                      />
                    );
                  }

                  // Standard / Medium Grids
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 border-2 transition-all duration-200 ${
                        isWinning
                          ? 'bg-emerald-500/30 border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105 z-10'
                          : 'bg-[#121A2A] border-[#223048] hover:border-amber-400/50'
                      }`}
                    >
                      <span className="text-lg sm:text-2xl drop-shadow">{symDef.symbol}</span>
                      {gridSize.rows <= 7 && (
                        <span className="text-[8px] font-arcade text-slate-300 truncate max-w-[44px] leading-tight mt-0.5">
                          {symDef.name.split('-')[0]}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Spin and Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#1E2E4A]">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] disabled:opacity-50 text-[#0A0D14] font-arcade font-bold text-xs tracking-wider flex items-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                {isSpinning ? t.simulatingSpins : t.spinSlotBtn}
              </button>

              <button
                onClick={() => {
                  setGrid(generateRandomGrid(gridSize.rows, gridSize.cols, DEFAULT_SLOT_SYMBOLS));
                  setCycleResult(null);
                }}
                className="p-2.5 rounded-xl bg-[#152033] hover:bg-[#20304D] text-slate-300 border border-[#243552] transition-colors cursor-pointer"
                title="Shuffle Grid"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Cycle Result Telemetry */}
            <div className="flex items-center gap-4 text-xs font-mono-telemetry">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-sans-arcade block">MULTIPLIER</span>
                <span className={`text-base font-bold ${cycleResult && cycleResult.totalMultiplier > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {cycleResult ? `${cycleResult.totalMultiplier}x` : '0x'}
                </span>
              </div>
              <div className="text-right border-l border-[#1E2E4A] pl-4">
                <span className="text-[10px] text-slate-400 font-sans-arcade block">CLUSTERS WON</span>
                <span className="text-white font-bold text-base">
                  {cycleResult ? cycleResult.winningClusters.length : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Volatility & PAR Sheet HUD */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-[#0E1524] border-2 border-[#243552] rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E2E4A] pb-2">
              <span className="text-xs font-bold font-arcade uppercase tracking-wider text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-400" />
                Slot PAR Sheet & Volatility
              </span>
              <span className="text-[10px] text-emerald-400 font-mono-telemetry font-bold">RNG CERTIFIED</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#070D17] border border-[#1E2E4A] flex justify-between items-center">
                <span className="text-slate-400 font-sans-arcade">{t.hitFrequency}</span>
                <span className="text-white font-bold font-mono-telemetry">{hitFrequency}% ({winCount}/{spinCount})</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#070D17] border border-[#1E2E4A] flex justify-between items-center">
                <span className="text-slate-400 font-sans-arcade">BASE GAME RTP</span>
                <span className="text-amber-400 font-bold font-mono-telemetry">{Math.round(baseRTP * 100)}% Paytable</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#070D17] border border-[#1E2E4A] flex justify-between items-center">
                <span className="text-slate-400 font-sans-arcade">METER CONTRIBUTION</span>
                <span className="text-cyan-400 font-bold font-mono-telemetry">{Math.round(meterRate * 100)}% of Coin-In</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#070D17] border border-[#1E2E4A] flex justify-between items-center">
                <span className="text-slate-400 font-sans-arcade">CASCADE MECHANIC</span>
                <span className="text-emerald-400 font-bold font-mono-telemetry">Tumbling Re-spins</span>
              </div>
            </div>

            {/* Clusters Payout Breakdown */}
            {cycleResult && cycleResult.winningClusters.length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-[#070D17] border border-emerald-500/40">
                <span className="text-[10px] text-emerald-400 font-bold font-arcade block mb-1.5">
                  ACTIVE WINNING CLUSTERS:
                </span>
                <div className="space-y-1 max-h-28 overflow-y-auto pr-1 text-xs">
                  {cycleResult.winningClusters.map((cl, i) => (
                    <div key={i} className="flex justify-between text-slate-300 font-mono-telemetry">
                      <span>{cl.symbolName} ({cl.nodeCoordinates.length} connected)</span>
                      <span className="text-emerald-400 font-bold">+{cl.payoutMultiplier}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
