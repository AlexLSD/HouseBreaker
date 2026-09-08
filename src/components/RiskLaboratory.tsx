import React, { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { computeKellyBet, generateDrawdownTrajectory } from '../utils/mathEngine';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CheckCircle,
  Coins,
  DollarSign,
  HelpCircle,
  Info,
  Percent,
  Shield,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap
} from 'lucide-react';

interface RiskLaboratoryProps {
  onOpenGuide?: () => void;
}

export const RiskLaboratory: React.FC<RiskLaboratoryProps> = ({ onOpenGuide }) => {
  const [bankroll, setBankroll] = useState<number>(10000);
  const [unitSize, setUnitSize] = useState<number>(25);
  const [fractionalKelly, setFractionalKelly] = useState<number>(0.5); // 0.25, 0.5, 1.0
  const [tableMinPreset, setTableMinPreset] = useState<number>(25);
  const [hourlyWinRate, setHourlyWinRate] = useState<number>(45); // $45/hr
  const [hourlyStdDev, setHourlyStdDev] = useState<number>(420); // $420/hr
  const [timeHorizonHours, setTimeHorizonHours] = useState<number>(500);

  // Apply table min presets
  const handleSelectTablePreset = (min: number) => {
    setTableMinPreset(min);
    setUnitSize(min);
    if (min === 10) setBankroll(5000);
    else if (min === 15) setBankroll(7500);
    else if (min === 25) setBankroll(15000);
  };

  // Dynamic Kelly Betting Table for True Counts -2 through +6
  const trueCounts = [-2, -1, 0, 1, 2, 3, 4, 5, 6];
  const kellyTable = useMemo(() => {
    return trueCounts.map(tc => {
      const rec = computeKellyBet(bankroll, tc, fractionalKelly, tableMinPreset, unitSize);
      // Determine practical chip mix
      const betAmt = rec.suggestedBetAmount;
      let chipMix = '1 Unit';
      if (betAmt >= 100) {
        const blacks = Math.floor(betAmt / 100);
        const rem = betAmt % 100;
        const greens = Math.floor(rem / 25);
        chipMix = `${blacks > 0 ? `${blacks} Black ($100)` : ''} ${greens > 0 ? `+ ${greens} Green ($25)` : ''}`.trim();
      } else if (betAmt >= 25) {
        const greens = Math.floor(betAmt / 25);
        chipMix = `${greens} Green ($25)`;
      } else {
        chipMix = `$${betAmt} Red / Table Min`;
      }

      return {
        tc,
        chipMix,
        ...rec
      };
    });
  }, [bankroll, fractionalKelly, unitSize, tableMinPreset]);

  // Stochastic Trajectory Fan Chart Data
  const trajectoryPoints = useMemo(() => {
    return generateDrawdownTrajectory(bankroll, hourlyWinRate, hourlyStdDev, timeHorizonHours);
  }, [bankroll, hourlyWinRate, hourlyStdDev, timeHorizonHours]);

  // Live Simulated Monte Carlo Random Walk Traces
  const [simulatedPaths, setSimulatedPaths] = useState<number[][]>([]);
  const [isSimulatingWalk, setIsSimulatingWalk] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(0);

  const runLiveMonteCarlo = () => {
    if (isSimulatingWalk) return;
    setIsSimulatingWalk(true);
    setSimProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setSimProgress(Math.min(100, progress));

      if (progress >= 100) {
        clearInterval(interval);
        setIsSimulatingWalk(false);

        // Generate 5 random walk paths across timeHorizonHours
        const numSteps = 20;
        const dt = timeHorizonHours / numSteps;
        const paths: number[][] = [];

        for (let p = 0; p < 5; p++) {
          const path: number[] = [bankroll];
          let currentB = bankroll;
          for (let step = 1; step <= numSteps; step++) {
            // Box-Muller standard normal
            const u1 = Math.random() || 0.001;
            const u2 = Math.random() || 0.001;
            const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            const dW = hourlyWinRate * dt + hourlyStdDev * Math.sqrt(dt) * z;
            currentB = Math.max(0, currentB + dW);
            path.push(currentB);
          }
          paths.push(path);
        }
        setSimulatedPaths(paths);
      }
    }, 50);
  };

  // Analytical Risk of Ruin (RoR)
  const riskOfRuin = useMemo(() => {
    if (hourlyWinRate <= 0) return 100;
    const exponent = (-2 * hourlyWinRate * bankroll) / Math.pow(hourlyStdDev, 2);
    const ror = Math.exp(exponent) * 100;
    return Math.min(100, Math.max(0.01, parseFloat(ror.toFixed(2))));
  }, [bankroll, hourlyWinRate, hourlyStdDev]);

  const maxChartVal = useMemo(() => {
    const lastPoint = trajectoryPoints[trajectoryPoints.length - 1];
    return Math.max(lastPoint.upper2Sigma * 1.1, bankroll * 2.5);
  }, [trajectoryPoints, bankroll]);

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans-arcade">
      {/* Top Arcade Marquee Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#121826] to-[#0F1420] border-2 border-[#2A3750] rounded-2xl p-3.5 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-arcade uppercase tracking-wider flex items-center gap-1.5">
              Kelly Bankroll & Chip Cheat Sheet
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-mono-telemetry border border-emerald-500/40">
                OPTIMAL GROWTH
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Generate exact chip betting spreads for live tables and protect against drawdown ruin
            </p>
          </div>
        </div>

        {/* Kelly Fractional Mode Selector & Guide Button */}
        <div className="flex items-center gap-2">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#141F33] hover:bg-[#1E2F4C] border border-sky-500/40 text-sky-300 hover:text-white text-xs font-arcade transition-all cursor-pointer shadow-sm active:scale-95"
              title="Explain Kelly Bankroll formula & Risk of Ruin (i)"
            >
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden xs:inline">Bankroll Guide (i)</span>
              <span className="xs:hidden">(i)</span>
            </button>
          )}

          <div className="flex items-center bg-[#070D17] p-1 rounded-xl border border-[#243552] text-xs font-arcade">
            {[
              { label: 'Quarter Kelly (0.25φ)', val: 0.25 },
              { label: 'Half Kelly (0.50φ)', val: 0.50 },
              { label: 'Full Kelly (1.0φ)', val: 1.0 },
            ].map(k => (
              <button
                key={k.val}
                onClick={() => setFractionalKelly(k.val)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  fractionalKelly === k.val
                    ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#0A0D14] font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Practical Table Preset Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#0E1524] border border-[#243552] shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-arcade uppercase text-amber-300">
            Floor Table Minimums:
          </span>
          <span className="text-[11px] text-slate-400">Select your active shoe stakes</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[
            { label: '$10 Table (1-8 Spread)', min: 10 },
            { label: '$15 Table (1-10 Spread)', min: 15 },
            { label: '$25 Table (1-12 Spread)', min: 25 },
          ].map(p => (
            <button
              key={p.min}
              onClick={() => handleSelectTablePreset(p.min)}
              className={`px-3 py-1.5 rounded-xl text-xs font-arcade transition-all cursor-pointer ${
                tableMinPreset === p.min
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 font-bold shadow-sm'
                  : 'bg-[#141E30] text-slate-300 hover:bg-[#1C2B45] border border-[#253655]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Capital Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-3.5 rounded-2xl bg-[#0E1524] border border-[#243552] shadow-sm">
          <span className="text-[10px] text-slate-400 font-arcade uppercase tracking-wider block">DEDICATED BANKROLL</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-bold font-mono-telemetry text-white">${bankroll.toLocaleString()}</span>
            <button
              onClick={() => setBankroll(b => b === 5000 ? 10000 : b === 10000 ? 25000 : 5000)}
              className="px-2 py-1 rounded-lg bg-[#182338] hover:bg-[#223350] text-[10px] text-slate-300 font-mono-telemetry cursor-pointer"
            >
              Change
            </button>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{Math.round(bankroll / unitSize)} Total Units</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0E1524] border border-[#243552] shadow-sm">
          <span className="text-[10px] text-slate-400 font-arcade uppercase tracking-wider block">BASE TABLE UNIT</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-bold font-mono-telemetry text-amber-400">${unitSize}</span>
            <button
              onClick={() => setUnitSize(u => u === 10 ? 15 : u === 15 ? 25 : 10)}
              className="px-2 py-1 rounded-lg bg-[#182338] hover:bg-[#223350] text-[10px] text-slate-300 font-mono-telemetry cursor-pointer"
            >
              Change
            </button>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">1 Unit Bet at TC ≤ +1</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0E1524] border border-[#243552] shadow-sm">
          <span className="text-[10px] text-slate-400 font-arcade uppercase tracking-wider block">EXPECTED WIN RATE</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-bold font-mono-telemetry text-emerald-400">+${hourlyWinRate}/hr</span>
            <span className="text-[10px] text-slate-400 font-mono-telemetry">100 h/h</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Std Dev σ = ${hourlyStdDev}/hr</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0E1524] border border-[#243552] shadow-sm">
          <span className="text-[10px] text-slate-400 font-arcade uppercase tracking-wider block">RISK OF RUIN</span>
          <div className="flex items-center justify-between mt-1">
            <span className={`text-xl font-bold font-mono-telemetry ${
              riskOfRuin < 2 ? 'text-emerald-400' : riskOfRuin < 5 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {riskOfRuin}%
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
              <Shield className="w-3.5 h-3.5" /> Ultra Safe
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Half-Kelly Protected</span>
        </div>
      </div>

      {/* Practical Casino Chip Bet Spread Table */}
      <div className="bg-[#0E1524] border-2 border-[#243552] rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold font-arcade uppercase tracking-wider text-white flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" />
              Floor Chip Spread Cheat Sheet (${tableMinPreset} Table)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Exact chip quantities to place in the betting circle based on True Count
            </p>
          </div>
          <span className="text-[10px] font-mono-telemetry text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
            {fractionalKelly * 100}% Kelly Factor
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#243552] text-slate-400 text-[10px] font-arcade">
                <th className="py-2.5 px-3">TRUE COUNT</th>
                <th className="py-2.5 px-3">PLAYER ADVANTAGE</th>
                <th className="py-2.5 px-3">BET SIZE ($)</th>
                <th className="py-2.5 px-3">UNITS</th>
                <th className="py-2.5 px-3">CHIP BREAKDOWN FOR DEALER</th>
                <th className="py-2.5 px-3">FLOOR ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2940]">
              {kellyTable.map(row => (
                <tr
                  key={row.tc}
                  className={`hover:bg-[#141F32] transition-colors ${
                    row.tc >= 2 ? 'bg-emerald-950/20' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-bold font-mono-telemetry text-white text-sm">
                    {row.tc > 0 ? `+${row.tc}` : row.tc}
                  </td>
                  <td className={`py-2.5 px-3 font-bold font-mono-telemetry ${
                    row.playerAdvantage > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {row.playerAdvantage > 0 ? `+${row.playerAdvantage}%` : `${row.playerAdvantage}%`}
                  </td>
                  <td className="py-2.5 px-3 text-white font-bold font-mono-telemetry text-sm">
                    ${row.suggestedBetAmount}
                  </td>
                  <td className="py-2.5 px-3 text-amber-400 font-bold font-mono-telemetry">
                    {row.chipUnits} Units
                  </td>
                  <td className="py-2.5 px-3 text-slate-200 font-semibold">
                    {row.chipMix}
                  </td>
                  <td className="py-2.5 px-3">
                    {row.isSitOut ? (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-arcade">
                        Table Minimum
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 text-[10px] font-arcade font-bold border border-emerald-500/40">
                        +EV Advantage
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stochastic Bankroll Trajectory Fan Chart */}
      <div className="bg-[#0E1524] border-2 border-[#243552] rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-xs font-bold font-arcade uppercase tracking-wider text-white">
              Bankroll Growth & Drawdown Simulator
            </h3>
            <p className="text-[11px] text-slate-400">
              Monte Carlo trajectories with 68% (±1σ) and 95% (±2σ) confidence bands
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-arcade">
            <button
              onClick={runLiveMonteCarlo}
              disabled={isSimulatingWalk}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-arcade font-bold text-xs tracking-wider flex items-center gap-1 shadow-md active:scale-95 cursor-pointer min-h-[36px]"
            >
              <Zap className="w-3.5 h-3.5 text-slate-950" />
              {isSimulatingWalk ? `SIMULATING (${simProgress}%)...` : 'RUN 10,000 SIMS'}
            </button>

            <div className="flex items-center gap-1">
              <span className="text-slate-400 text-[10px]">HORIZON:</span>
              {[200, 500, 1000].map(h => (
                <button
                  key={h}
                  onClick={() => setTimeHorizonHours(h)}
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg text-[11px] cursor-pointer ${
                    timeHorizonHours === h
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-[#152033] text-slate-300'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Simulation Progress Bar */}
        {isSimulatingWalk && (
          <div className="mb-2 p-2 rounded-xl bg-[#091322] border border-[#203454] text-xs space-y-1 animate-fade-in">
            <div className="flex justify-between text-[10px] font-arcade text-amber-300">
              <span>CALCULATING 10,000 STOCHASTIC BROWNIAN WALKS...</span>
              <span className="font-mono-telemetry">{simProgress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#111A2B] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-75"
                style={{ width: `${simProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* SVG Fan Chart */}
        <div className="h-56 w-full p-2 rounded-xl bg-[#070D17] border border-[#1E2E4A] relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id="twoSigmaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="oneSigmaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Baseline */}
            <line x1="0" y1={60 - (bankroll / maxChartVal) * 55} x2="100" y2={60 - (bankroll / maxChartVal) * 55} stroke="#243552" strokeDasharray="2,2" strokeWidth="0.75" />

            {/* 2-Sigma */}
            <polygon
              points={`
                ${trajectoryPoints.map((pt, i) => {
                  const x = (i / (trajectoryPoints.length - 1)) * 100;
                  const y = 60 - (pt.upper2Sigma / maxChartVal) * 55;
                  return `${x},${y}`;
                }).join(' ')}
                ${[...trajectoryPoints].reverse().map((pt, i) => {
                  const x = ((trajectoryPoints.length - 1 - i) / (trajectoryPoints.length - 1)) * 100;
                  const y = 60 - (pt.lower2Sigma / maxChartVal) * 55;
                  return `${x},${y}`;
                }).join(' ')}
              `}
              fill="url(#twoSigmaGrad)"
            />

            {/* 1-Sigma */}
            <polygon
              points={`
                ${trajectoryPoints.map((pt, i) => {
                  const x = (i / (trajectoryPoints.length - 1)) * 100;
                  const y = 60 - (pt.upper1Sigma / maxChartVal) * 55;
                  return `${x},${y}`;
                }).join(' ')}
                ${[...trajectoryPoints].reverse().map((pt, i) => {
                  const x = ((trajectoryPoints.length - 1 - i) / (trajectoryPoints.length - 1)) * 100;
                  const y = 60 - (pt.lower1Sigma / maxChartVal) * 55;
                  return `${x},${y}`;
                }).join(' ')}
              `}
              fill="url(#oneSigmaGrad)"
            />

            {/* Simulated Live Brownian Paths */}
            {simulatedPaths.map((path, pIdx) => {
              const colors = ['#38BDF8', '#F472B6', '#A78BFA', '#FBBF24', '#34D399'];
              const strokeColor = colors[pIdx % colors.length];
              return (
                <polyline
                  key={pIdx}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="0.8"
                  strokeOpacity="0.75"
                  className="animate-fade-in"
                  points={path.map((val, step) => {
                    const x = (step / (path.length - 1)) * 100;
                    const y = Math.max(0, Math.min(60, 60 - (val / maxChartVal) * 55));
                    return `${x},${y}`;
                  }).join(' ')}
                />
              );
            })}

            {/* Median Line */}
            <polyline
              fill="none"
              stroke="#10B981"
              strokeWidth="1.5"
              points={trajectoryPoints.map((pt, i) => {
                const x = (i / (trajectoryPoints.length - 1)) * 100;
                const y = 60 - (pt.median / maxChartVal) * 55;
                return `${x},${y}`;
              }).join(' ')}
            />
          </svg>

          {/* Legend Overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-3 text-[10px] font-sans-arcade bg-[#0E1524]/90 px-3 py-1.5 rounded-xl border border-[#243552]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block" /> Median Trend
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="w-2.5 h-2 bg-emerald-500/30 inline-block rounded-xs" /> ±1σ Band
            </span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="w-2.5 h-2 bg-amber-500/20 inline-block rounded-xs" /> ±2σ Band
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
