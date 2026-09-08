import React, { useState } from 'react';
import {
  runRouletteStrategySim,
  MonteCarloSimulationResult,
  RouletteVariant
} from '../../utils/rouletteEngine';
import { sounds } from '../../utils/soundEffects';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart2,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap
} from 'lucide-react';

interface RouletteMonteCarloLabProps {
  variant: RouletteVariant;
}

export const RouletteMonteCarloLab: React.FC<RouletteMonteCarloLabProps> = ({ variant }) => {
  const [strategy, setStrategy] = useState<
    'FLAT' | 'MARTINGALE' | 'REVERSE_MARTINGALE' | 'DALEMBERT' | 'FIBONACCI'
  >('MARTINGALE');
  const [spinsCount, setSpinsCount] = useState<number>(500);
  const [initialBankroll, setInitialBankroll] = useState<number>(1000);
  const [baseUnit, setBaseUnit] = useState<number>(10);
  const [tableLimit, setTableLimit] = useState<number>(1000);

  const [simResult, setSimResult] = useState<MonteCarloSimulationResult | null>(() =>
    runRouletteStrategySim('MARTINGALE', variant, 500, 1000, 10, 1000)
  );

  const handleRunSim = () => {
    sounds.playChip();
    const result = runRouletteStrategySim(
      strategy,
      variant,
      spinsCount,
      initialBankroll,
      baseUnit,
      tableLimit
    );
    setSimResult(result);
  };

  // Helper to render an SVG line path for bankroll
  const renderTrajectoryChart = () => {
    if (!simResult || simResult.history.length < 2) return null;

    const data = simResult.history;
    const maxVal = Math.max(initialBankroll * 1.5, simResult.peakBalance);
    const minVal = Math.min(0, simResult.minBalance);
    const range = maxVal - minVal || 1;

    const width = 600;
    const height = 180;
    const padding = 20;

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const normalizedY = (d.balance - minVal) / range;
      const y = height - padding - normalizedY * (height - 2 * padding);
      return `${x},${y}`;
    });

    const isProfitable = simResult.endBalance >= simResult.startBalance;
    const strokeColor = isProfitable ? '#34d399' : '#f87171';

    // Baseline (starting balance line)
    const baselineNorm = (initialBankroll - minVal) / range;
    const baseY = height - padding - baselineNorm * (height - 2 * padding);

    return (
      <div className="w-full overflow-hidden rounded-2xl bg-[#090F1A] border border-[#1E293B] p-3">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-arcade text-slate-400">BANKROLL TRAJECTORY (SPINS 1 - {data.length})</span>
          <div className="flex items-center gap-3 font-mono-telemetry font-bold">
            <span className="text-slate-400">Peak: <strong className="text-emerald-400">${simResult.peakBalance}</strong></span>
            <span className="text-slate-400">Max DD: <strong className="text-rose-400">-${simResult.maxDrawdown}</strong></span>
          </div>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          {/* Baseline Dash */}
          <line
            x1={padding}
            y1={baseY}
            x2={width - padding}
            y2={baseY}
            stroke="#64748b"
            strokeDasharray="4,4"
            strokeWidth="1"
          />
          <text x={padding + 4} y={baseY - 4} fill="#94a3b8" fontSize="9" fontFamily="monospace">
            Start: ${initialBankroll}
          </text>

          {/* Trajectory Polyline */}
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points.join(' ')}
          />

          {/* Bankruptcy Marker if happened */}
          {simResult.bankruptcyIndex && (
            <circle
              cx={points[simResult.bankruptcyIndex - 1]?.split(',')[0]}
              cy={points[simResult.bankruptcyIndex - 1]?.split(',')[1]}
              r="5"
              fill="#ef4444"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-4 font-sans-arcade">
      {/* Simulation Controls */}
      <div className="p-4 rounded-2xl bg-[#0B1322] border border-[#20304D] shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1C2A44] pb-3">
          <div>
            <h3 className="font-arcade font-bold text-sm text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Monte Carlo Betting Systems Stress-Tester
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate up to 2,500 consecutive spins to expose how progression traps hit table limits
            </p>
          </div>
          <button
            onClick={handleRunSim}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-arcade font-bold text-xs tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <Play className="w-4 h-4 fill-current" /> RUN SIMULATION
          </button>
        </div>

        {/* Strategy Pickers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            { id: 'MARTINGALE', label: 'Martingale (2x on loss)' },
            { id: 'FLAT', label: 'Flat (Fixed $10)' },
            { id: 'REVERSE_MARTINGALE', label: 'Paroli (2x on win)' },
            { id: 'DALEMBERT', label: "D'Alembert (+/- 1 unit)" },
            { id: 'FIBONACCI', label: 'Fibonacci Sequence' },
          ].map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setStrategy(s.id as unknown as typeof strategy)}
              className={`min-h-[44px] p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center ${
                idx === 4 ? 'col-span-2 sm:col-span-1' : ''
              } ${
                strategy === s.id
                  ? 'bg-[#15233D] border-amber-400/80 text-amber-300 font-bold shadow-md ring-1 ring-amber-400/30'
                  : 'bg-[#0E1729] hover:bg-[#131F36] border-[#223352] text-slate-400'
              }`}
            >
              <span className="text-[11px] font-arcade block">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Parameters: Spins, Bankroll, Table Limit */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-[#090F1A] border border-[#1C2A44]">
            <label className="text-[10px] text-slate-400 font-arcade block mb-1">
              SPINS COUNT
            </label>
            <select
              value={spinsCount}
              onChange={e => setSpinsCount(Number(e.target.value))}
              className="w-full bg-[#121E33] border border-[#2B3E60] rounded-lg px-2 py-1 text-white font-mono-telemetry font-bold focus:outline-none"
            >
              <option value={100}>100 Spins</option>
              <option value={500}>500 Spins</option>
              <option value={1000}>1,000 Spins</option>
              <option value={2500}>2,500 Spins</option>
            </select>
          </div>

          <div className="p-2.5 rounded-xl bg-[#090F1A] border border-[#1C2A44]">
            <label className="text-[10px] text-slate-400 font-arcade block mb-1">
              STARTING STACK
            </label>
            <input
              type="number"
              value={initialBankroll}
              onChange={e => setInitialBankroll(Math.max(100, Number(e.target.value)))}
              className="w-full bg-[#121E33] border border-[#2B3E60] rounded-lg px-2 py-1 text-white font-mono-telemetry font-bold focus:outline-none"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-[#090F1A] border border-[#1C2A44]">
            <label className="text-[10px] text-slate-400 font-arcade block mb-1">
              BASE BET UNIT
            </label>
            <input
              type="number"
              value={baseUnit}
              onChange={e => setBaseUnit(Math.max(1, Number(e.target.value)))}
              className="w-full bg-[#121E33] border border-[#2B3E60] rounded-lg px-2 py-1 text-white font-mono-telemetry font-bold focus:outline-none"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-[#090F1A] border border-[#1C2A44]">
            <label className="text-[10px] text-slate-400 font-arcade block mb-1">
              TABLE MAX LIMIT
            </label>
            <input
              type="number"
              value={tableLimit}
              onChange={e => setTableLimit(Math.max(100, Number(e.target.value)))}
              className="w-full bg-[#121E33] border border-[#2B3E60] rounded-lg px-2 py-1 text-white font-mono-telemetry font-bold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Trajectory Visualizer */}
      {renderTrajectoryChart()}

      {/* Numerical Telemetry Summary */}
      {simResult && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-3 rounded-2xl bg-[#0E1729] border border-[#223352]">
            <span className="text-[10px] text-slate-400 font-arcade uppercase block">
              FINAL BANKROLL
            </span>
            <div className={`text-xl font-bold font-mono-telemetry ${
              simResult.endBalance >= simResult.startBalance ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              ${simResult.endBalance}
            </div>
            <span className="text-[10px] text-slate-400">
              Net: {simResult.endBalance - simResult.startBalance >= 0 ? '+' : ''}
              ${simResult.endBalance - simResult.startBalance}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#0E1729] border border-[#223352]">
            <span className="text-[10px] text-slate-400 font-arcade uppercase block">
              BANKRUPTCY STATS
            </span>
            <div className="text-xl font-bold font-mono-telemetry text-amber-300">
              {simResult.bankruptcyIndex ? (
                <span className="text-rose-400">Spin #{simResult.bankruptcyIndex}</span>
              ) : (
                <span className="text-emerald-400">Survived</span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">
              {simResult.bankruptcyIndex ? '100% Capital Wipeout' : 'Did not bust out'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#0E1729] border border-[#223352]">
            <span className="text-[10px] text-slate-400 font-arcade uppercase block">
              MAX DRAWDOWNS
            </span>
            <div className="text-xl font-bold font-mono-telemetry text-rose-400">
              -${simResult.maxDrawdown}
            </div>
            <span className="text-[10px] text-slate-400">Deepest trough from peak</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#0E1729] border border-[#223352]">
            <span className="text-[10px] text-slate-400 font-arcade uppercase block">
              HOUSE EDGE DRAG
            </span>
            <div className="text-xl font-bold font-mono-telemetry text-slate-200">
              {variant === 'FRENCH' ? '-1.35%' : variant === 'EUROPEAN' ? '-2.70%' : '-5.26%'}
            </div>
            <span className="text-[10px] text-slate-400">Mathematical expectancy per trial</span>
          </div>
        </div>
      )}

      {/* The Math Verdict Callout */}
      <div className="p-3.5 rounded-2xl bg-[#171A24] border border-[#2E3547] text-xs text-slate-300 space-y-1">
        <h4 className="font-arcade font-bold text-amber-300 text-xs flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          MATHEMATICAL REALITY CHECK: WHY PROGRESSIVE BETTING CANNOT BEAT ROULETTE
        </h4>
        <p className="leading-relaxed text-slate-400 text-[11px]">
          By the linearity of expectation, the expected value of a sum of independent negative-EV bets is always negative: <strong className="text-white">E(∑ X_i) = ∑ E(X_i) &lt; 0</strong>. Doubling your wager on a loss (Martingale) produces tiny frequent wins at the cost of catastrophic, exponential tail risk. When you hit 7 or 8 consecutive losses ($10 → $20 → $40 → $80 → $160 → $320 → $640 → $1,280), either the table limit prevents the next bet, or your stack evaporates completely.
        </p>
      </div>
    </div>
  );
};
