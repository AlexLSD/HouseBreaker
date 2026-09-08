import React, { useState, useEffect, useRef } from 'react';
import { computeMustHitByAdvantage } from '../../utils/mathEngine';
import { sounds } from '../../utils/soundEffects';
import { CasinoChipStack } from '../CasinoChipStack';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  ChevronRight,
  Coins,
  DollarSign,
  Flame,
  Grid,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Zap
} from 'lucide-react';

export interface SlotFloorScenario {
  id: string;
  name: string;
  machineTitle: string;
  cap: number;
  currentMeter: number;
  meterRate: number; // 0.02 = 2%
  baseRtp: number;   // 0.88 = 88%
  expectedIsPositiveEV: boolean;
  explanation: string;
}

const SLOT_SCENARIOS: SlotFloorScenario[] = [
  {
    id: 'mhb-488',
    name: 'Floor Scout #1: Diamond Royale $500 Cap',
    machineTitle: 'Diamond Royale Progressive',
    cap: 500.0,
    currentMeter: 488.50,
    meterRate: 0.02,
    baseRtp: 0.88,
    expectedIsPositiveEV: true,
    explanation: 'ΔJ is only $11.50 ($500 - $488.50). Required coin-in is $11.50 / (2 * 0.02) = $287.50. Base game loss is $287.50 * 12% = $34.50. Expected payout is $494.25. Net expected return is +$459.75 (Massive +EV Advantage Breach)!'
  },
  {
    id: 'mhb-420',
    name: 'Floor Scout #2: Lucky Neon $500 Cap Trap',
    machineTitle: 'Lucky Neon 7s',
    cap: 500.0,
    currentMeter: 420.00,
    meterRate: 0.02,
    baseRtp: 0.88,
    expectedIsPositiveEV: false,
    explanation: 'Break-even threshold for a $500 cap with 2% meter and 88% RTP is $473.68. At $420.00, ΔJ is $80. Expected coin-in needed is $2,000! Base house edge drains $240, far exceeding the jackpot value. This is a negative EV trap!'
  },
  {
    id: 'mhb-982',
    name: 'Floor Scout #3: High-Limit Dragon $1,000 Cap',
    machineTitle: 'Golden Dragon High-Limit',
    cap: 1000.0,
    currentMeter: 982.00,
    meterRate: 0.025,
    baseRtp: 0.90,
    expectedIsPositiveEV: true,
    explanation: 'With ΔJ at only $18.00 and a 2.5% meter rate, expected coin-in is only $360.00. High RTP (90%) leaves only $36.00 in expected base loss to claim a ~$991 average jackpot. Extreme positive expectation!'
  },
  {
    id: 'mhb-890',
    name: 'Floor Scout #4: Mega Bucks $1,000 Sub-Threshold',
    machineTitle: 'Mega Bucks Lightning',
    cap: 1000.0,
    currentMeter: 890.00,
    meterRate: 0.02,
    baseRtp: 0.86,
    expectedIsPositiveEV: false,
    explanation: 'With 86% base RTP, the house edge is 14%. At $890 on a $1,000 cap, expected coin-in is $2,750, yielding a $385 base loss. The break-even threshold is $947.37. Walking away is the mathematically optimal choice!'
  }
];

const SLOT_SYMBOLS = ['💎', '7️⃣', '🔔', '🍒', '🍀', '⚡', '🎰', '👑'];

export interface SlotGridDimension {
  cols: number;
  rows: number;
  label: string;
  paylines: number;
}

const GRID_PRESETS: SlotGridDimension[] = [
  { cols: 3, rows: 3, label: '3x3 Classic', paylines: 5 },
  { cols: 5, rows: 3, label: '5x3 Video', paylines: 20 },
  { cols: 5, rows: 4, label: '5x4 Mega', paylines: 40 }
];

interface SlotMachineGameDrillProps {
  credits: number;
  onBet: (amount: number) => boolean;
  onWin: (amount: number, reason: string) => void;
  onLoss: (amount: number, reason: string) => void;
  onRecordMistake: (
    scenarioName: string,
    userDecision: string,
    expectedDecision: string,
    cost: number,
    explanation: string
  ) => void;
  onRecordEarning: (scenarioName: string, won: number, reason: string) => void;
}

export const SlotMachineGameDrill: React.FC<SlotMachineGameDrillProps> = ({
  credits,
  onBet,
  onWin,
  onLoss,
  onRecordMistake,
  onRecordEarning
}) => {
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState<number>(0);
  const activeScenario = SLOT_SCENARIOS[currentScenarioIdx];

  // Grid Configuration (multiple rows and columns)
  const [selectedGrid, setSelectedGrid] = useState<SlotGridDimension>(GRID_PRESETS[1]); // 5x3 default

  // 2D Array of symbols: grid[row][col]
  const createInitialGrid = (rows: number, cols: number) => {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () =>
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]
      )
    );
  };

  const [grid, setGrid] = useState<string[][]>(() =>
    createInitialGrid(GRID_PRESETS[1].rows, GRID_PRESETS[1].cols)
  );

  // Live progressive meter & spin state
  const [currentMeter, setCurrentMeter] = useState<number>(activeScenario.currentMeter);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinningCols, setSpinningCols] = useState<boolean[]>(
    Array(GRID_PRESETS[1].cols).fill(false)
  );
  const [betSize, setBetSize] = useState<number>(10); // 10 credits
  const [chipAnimState, setChipAnimState] = useState<'idle' | 'win' | 'burn'>('idle');
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [lastWinAmount, setLastWinAmount] = useState<number>(0);
  const [spinCount, setSpinCount] = useState<number>(0);
  const [hasJackpotHit, setHasJackpotHit] = useState<boolean>(false);

  // User Scouting Decision: ATTACK or WALK AWAY
  const [userCall, setUserCall] = useState<'ATTACK' | 'WALK_AWAY' | null>(null);
  const [evaluation, setEvaluation] = useState<{
    isCorrect: boolean;
    title: string;
    text: string;
    mathBreakdown: string;
  } | null>(null);

  // Calculated Advantage
  const advantageMath = computeMustHitByAdvantage(
    activeScenario.cap,
    currentMeter,
    activeScenario.meterRate,
    activeScenario.baseRtp
  );

  const handleGridChange = (newGridConfig: SlotGridDimension) => {
    sounds.playClick();
    setSelectedGrid(newGridConfig);
    setGrid(createInitialGrid(newGridConfig.rows, newGridConfig.cols));
    setSpinningCols(Array(newGridConfig.cols).fill(false));
    setWinningCells([]);
  };

  const loadScenario = (idx: number) => {
    const sc = SLOT_SCENARIOS[idx];
    setCurrentMeter(sc.currentMeter);
    setGrid(createInitialGrid(selectedGrid.rows, selectedGrid.cols));
    setIsSpinning(false);
    setSpinningCols(Array(selectedGrid.cols).fill(false));
    setWinningCells([]);
    setLastWinAmount(0);
    setSpinCount(0);
    setHasJackpotHit(false);
    setUserCall(null);
    setEvaluation(null);
    setChipAnimState('idle');
  };

  const handleDecision = (call: 'ATTACK' | 'WALK_AWAY') => {
    if (userCall) return;
    setUserCall(call);

    const isMatch =
      (call === 'ATTACK' && activeScenario.expectedIsPositiveEV) ||
      (call === 'WALK_AWAY' && !activeScenario.expectedIsPositiveEV);

    if (isMatch) {
      sounds.playWin();
      onRecordEarning(
        activeScenario.name,
        50,
        call === 'ATTACK'
          ? 'Correctly scouted and attacked +EV progressive state'
          : 'Preserved bankroll by avoiding -EV progressive trap'
      );
      // Give scout reward credits
      onWin(50, `Scout Accuracy Bonus: ${call}`);
    } else {
      sounds.playLoss();
      const penalty = call === 'ATTACK' ? 100 : 50;
      onLoss(penalty, `Scout Error: Made -EV call (${call})`);
      onRecordMistake(
        activeScenario.name,
        call === 'ATTACK' ? 'Attacked Negative EV Trap' : 'Passed Positive EV Breach',
        activeScenario.expectedIsPositiveEV ? 'ATTACK' : 'WALK_AWAY',
        penalty,
        activeScenario.explanation
      );
    }

    setEvaluation({
      isCorrect: isMatch,
      title: isMatch
        ? call === 'ATTACK'
          ? '🎯 +EV ADVANTAGE PLAY CONFIRMED!'
          : '🛡️ WISE DISCIPLINED PASS (-EV EVADED)!'
        : call === 'ATTACK'
        ? '⚠️ UNPROFITABLE COIN-IN LEAK (-EV TRAP)!'
        : '⚠️ MISSED ADVANTAGE JACKPOT OPPORTUNITY!',
      text: activeScenario.explanation,
      mathBreakdown: `Break-even threshold sits at $${advantageMath.breakevenThreshold.toFixed(
        2
      )}. Current meter is $${currentMeter.toFixed(2)}. Distance to Cap ΔJ = $${advantageMath.deltaJ.toFixed(2)}.`
    });

    if (call === 'ATTACK') {
      triggerReelSpin();
    }
  };

  // Multi-line and Cluster Evaluation
  const evaluateGridWins = (newGrid: string[][]): { winTotal: number; winningCoords: [number, number][] } => {
    let win = 0;
    const coords: [number, number][] = [];
    const rows = selectedGrid.rows;
    const cols = selectedGrid.cols;

    // 1. Evaluate Horizontal Rows (3+ matching adjacent from left)
    for (let r = 0; r < rows; r++) {
      const firstSymbol = newGrid[r][0];
      let matchCount = 1;
      for (let c = 1; c < cols; c++) {
        if (newGrid[r][c] === firstSymbol) {
          matchCount++;
        } else {
          break;
        }
      }
      if (matchCount >= 3) {
        const mult = matchCount === 5 ? 10 : matchCount === 4 ? 4 : 1.5;
        const linePayout = Math.round(betSize * mult);
        win += linePayout;
        for (let c = 0; c < matchCount; c++) {
          coords.push([r, c]);
        }
      }
    }

    // 2. Evaluate Diagonal V-Lines if cols >= 3
    if (cols >= 3 && rows >= 3) {
      // Top-left to bottom-center to top-right V
      const centerCol = Math.floor(cols / 2);
      if (
        newGrid[0][0] === newGrid[1][centerCol] &&
        newGrid[1][centerCol] === newGrid[0][cols - 1]
      ) {
        win += Math.round(betSize * 2.5);
        coords.push([0, 0], [1, centerCol], [0, cols - 1]);
      }
    }

    // 3. Evaluate Scatter Diamonds anywhere
    let diamondCount = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newGrid[r][c] === '💎') {
          diamondCount++;
          coords.push([r, c]);
        }
      }
    }
    if (diamondCount >= 3) {
      win += Math.round(betSize * diamondCount * 2);
    }

    return { winTotal: win, winningCoords: coords };
  };

  const triggerReelSpin = () => {
    if (isSpinning) return;
    if (credits < betSize) {
      sounds.playLoss();
      return;
    }

    // Deduct bet from credits
    const betSuccess = onBet(betSize);
    if (!betSuccess) return;

    setIsSpinning(true);
    setWinningCells([]);
    setLastWinAmount(0);
    setChipAnimState('idle');
    setSpinCount(c => c + 1);

    // Audio click for spin start
    sounds.playReelClick();

    // Start all columns spinning
    setSpinningCols(Array(selectedGrid.cols).fill(true));

    // Stagger column stops
    const totalSpinTime = 600 + selectedGrid.cols * 120;
    const finalGrid = createInitialGrid(selectedGrid.rows, selectedGrid.cols);

    selectedGrid.cols;
    for (let c = 0; c < selectedGrid.cols; c++) {
      setTimeout(() => {
        sounds.playReelStop();
        setSpinningCols(prev => {
          const next = [...prev];
          next[c] = false;
          return next;
        });
      }, 400 + c * 150);
    }

    // Conclude spin
    setTimeout(() => {
      setGrid(finalGrid);
      setIsSpinning(false);

      // Increment jackpot meter with coin-in contribution ($betSize * meterRate)
      const meterIncrement = betSize * activeScenario.meterRate;
      const newMeter = Math.min(activeScenario.cap, currentMeter + meterIncrement);
      setCurrentMeter(parseFloat(newMeter.toFixed(2)));

      // Evaluate Line Winnings
      const { winTotal, winningCoords } = evaluateGridWins(finalGrid);
      setWinningCells(winningCoords);
      setLastWinAmount(winTotal);

      // Check if jackpot triggered (Must hit by cap threshold)
      const isJackpotTriggered =
        newMeter >= activeScenario.cap ||
        (newMeter >= activeScenario.cap * 0.985 && Math.random() < 0.35);

      if (isJackpotTriggered && !hasJackpotHit) {
        setHasJackpotHit(true);
        sounds.playJackpot();
        sounds.playChipCollect();
        setChipAnimState('win');
        const jackpotWin = Math.round(activeScenario.cap);
        onWin(jackpotWin, `🏆 MUST-HIT-BY JACKPOT HIT! Won $${jackpotWin}`);
        onRecordEarning(
          activeScenario.name,
          jackpotWin,
          `Hit progressive jackpot near cap ($${newMeter.toFixed(2)} / $${activeScenario.cap})`
        );
      } else if (winTotal > 0) {
        sounds.playWin();
        sounds.playChipCollect();
        setChipAnimState('win');
        onWin(winTotal, `Line Win on ${selectedGrid.label}`);
        onRecordEarning(
          activeScenario.name,
          winTotal,
          `Hit matching payline combination on ${selectedGrid.label}`
        );
      } else {
        // No line win
        sounds.playChipsBurn();
        setChipAnimState('burn');
        onLoss(betSize, `No match on ${selectedGrid.label}`);
      }
    }, totalSpinTime);
  };

  const handleNext = () => {
    sounds.playClick();
    const nextIdx = (currentScenarioIdx + 1) % SLOT_SCENARIOS.length;
    setCurrentScenarioIdx(nextIdx);
    loadScenario(nextIdx);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar with Grid Selector and Credits */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#0C121E] border border-[#22314A] text-xs">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Coins className="w-4 h-4" />
          </span>
          <div>
            <h4 className="font-arcade font-bold text-white uppercase text-xs">
              {activeScenario.machineTitle}
            </h4>
            <span className="text-[10px] text-slate-400">
              Scouting machine #{currentScenarioIdx + 1} of {SLOT_SCENARIOS.length}
            </span>
          </div>
        </div>

        {/* Grid Selector (Multiple Rows and Columns) */}
        <div className="flex items-center gap-1.5 bg-[#070B13] p-1 rounded-xl border border-[#1E2C44]">
          <span className="text-[10px] text-slate-400 font-arcade px-1">GRID:</span>
          {GRID_PRESETS.map(preset => (
            <button
              key={preset.label}
              onClick={() => handleGridChange(preset)}
              disabled={isSpinning}
              className={`px-2 py-0.8 rounded-lg text-[10px] font-mono-telemetry font-bold transition-all cursor-pointer ${
                selectedGrid.label === preset.label
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'bg-[#121A28] text-slate-400 hover:text-white'
              }`}
            >
              {preset.label} ({preset.paylines}L)
            </button>
          ))}
        </div>

        {/* Radar Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono-telemetry font-bold px-2 py-0.5 rounded border ${
              advantageMath.isPositiveEV
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 animate-pulse'
                : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
            }`}
          >
            {advantageMath.isPositiveEV ? '+EV BREACH DETECTED' : '-EV SUB-THRESHOLD'}
          </span>
        </div>
      </div>

      {/* Arcade Slot Machine Cabinet */}
      <div className="rounded-3xl bg-gradient-to-b from-[#131A2B] via-[#0E1524] to-[#080D18] border-4 border-[#2A3B58] p-4 sm:p-5 relative shadow-2xl overflow-hidden space-y-3">
        {/* Glow ambient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        {/* LED Digital Progressive Jackpot Marquee */}
        <div
          className={`p-3.5 rounded-2xl border-2 text-center transition-all ${
            advantageMath.isPositiveEV
              ? 'bg-[#081720] border-amber-400 shadow-lg shadow-amber-500/20'
              : 'bg-[#090E17] border-[#1F2C42]'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-arcade text-slate-400 mb-1 px-2">
            <span>MUST HIT BY CAP: ${activeScenario.cap.toFixed(2)}</span>
            <span className="text-amber-400 font-bold">
              RTP: {(activeScenario.baseRtp * 100).toFixed(0)}% • METER: {(activeScenario.meterRate * 100).toFixed(1)}%
            </span>
          </div>

          <div className="py-1">
            <span className="text-[10px] text-amber-300 font-arcade tracking-widest block uppercase">
              CURRENT PROGRESSIVE JACKPOT METER
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono-telemetry tracking-wider text-white drop-shadow-md">
              ${currentMeter.toFixed(2)}
            </div>
            <div className="text-xs font-mono-telemetry mt-0.5 text-slate-300">
              Distance to Cap ΔJ ={' '}
              <strong className="text-amber-300">
                ${(activeScenario.cap - currentMeter).toFixed(2)}
              </strong>
            </div>
          </div>

          {/* Break-Even Radar Bar */}
          <div className="mt-2 pt-2 border-t border-[#1C2A40] text-left px-2">
            <div className="flex items-center justify-between text-[10px] font-mono-telemetry text-slate-400 mb-1">
              <span>$0.00</span>
              <span className="text-amber-300 font-bold">
                Break-Even $J_b$: ${advantageMath.breakevenThreshold.toFixed(2)}
              </span>
              <span>Cap ${activeScenario.cap.toFixed(2)}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#111928] overflow-hidden relative border border-[#202E46]">
              <div
                className="absolute top-0 bottom-0 w-1 bg-amber-400 z-10"
                style={{
                  left: `${(advantageMath.breakevenThreshold / activeScenario.cap) * 100}%`
                }}
                title="Break-even point"
              />
              <div
                className={`h-full transition-all duration-500 ${
                  advantageMath.isPositiveEV
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-400'
                    : 'bg-slate-600'
                }`}
                style={{
                  width: `${Math.min(100, (currentMeter / activeScenario.cap) * 100)}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Multi-Row & Multi-Column Animated Slot Reel Grid */}
        <div className="p-3 bg-[#05080F] rounded-2xl border-2 border-[#1E2B42] shadow-inner space-y-2">
          <div className="flex items-center justify-between px-2 text-[10px] font-mono-telemetry text-slate-400">
            <span>
              FORMAT: <strong>{selectedGrid.cols} REELS × {selectedGrid.rows} ROWS</strong>
            </span>
            <span>ACTIVE PAYLINES: {selectedGrid.paylines}</span>
          </div>

          <div
            className="grid gap-2 select-none"
            style={{
              gridTemplateColumns: `repeat(${selectedGrid.cols}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: selectedGrid.cols }).map((_, colIdx) => (
              <div key={colIdx} className="space-y-2">
                {Array.from({ length: selectedGrid.rows }).map((_, rowIdx) => {
                  const symbol = grid[rowIdx]?.[colIdx] || '💎';
                  const isCellWinning = winningCells.some(
                    ([r, c]) => r === rowIdx && c === colIdx
                  );
                  const isColSpinning = spinningCols[colIdx];

                  return (
                    <div
                      key={rowIdx}
                      className={`h-14 sm:h-18 rounded-xl flex items-center justify-center text-2xl sm:text-3xl border-2 transition-all shadow-md ${
                        isColSpinning
                          ? 'bg-[#151D2D] border-[#2F4060] animate-pulse filter blur-xs'
                          : isCellWinning
                          ? 'bg-gradient-to-b from-amber-500/30 to-emerald-500/30 border-amber-400 ring-2 ring-amber-300 scale-105 shadow-amber-500/40'
                          : 'bg-gradient-to-b from-[#182234] via-[#101726] to-[#0A101C] border-[#2A3B56] text-white'
                      }`}
                    >
                      <span className={isColSpinning ? 'animate-slot-spin' : ''}>
                        {symbol}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Win / Spin Status readout */}
          {lastWinAmount > 0 && (
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-center font-arcade text-xs text-emerald-300 animate-fade-in flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              PAYLINE WIN! +{lastWinAmount} CREDITS WON
            </div>
          )}

          {hasJackpotHit && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-arcade font-bold text-center text-sm shadow-xl animate-bounce">
              🎉 MUST-HIT-BY PROGRESSIVE TRIGGERED! +${activeScenario.cap.toFixed(2)} WON! 🏆
            </div>
          )}
        </div>

        {/* Floor Scout Call: Attack vs Walk Away */}
        <div className="space-y-2 pt-1 border-t border-[#22314A]">
          <div className="flex items-center justify-between text-xs font-arcade">
            <span className="text-slate-300">
              CASINO FLOOR CALL: Is this slot +EV Advantage or a -EV House Trap?
            </span>
            <div className="flex items-center gap-1.5 text-amber-400 font-mono-telemetry">
              <CasinoChipStack amount={betSize} size="xs" animationState={chipAnimState} />
              <span>Bet: {betSize} CR</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDecision('ATTACK')}
              disabled={!!userCall}
              className={`py-3 px-3 rounded-xl font-arcade font-bold text-xs tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 ${
                userCall === 'ATTACK'
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-105'
                  : userCall
                  ? 'bg-[#101824] text-slate-600 border border-slate-700/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 active:scale-95'
              }`}
            >
              <Zap className="w-4 h-4 text-slate-950" />
              ATTACK MACHINE (+EV)
            </button>

            <button
              onClick={() => handleDecision('WALK_AWAY')}
              disabled={!!userCall}
              className={`py-3 px-3 rounded-xl font-arcade font-bold text-xs tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 ${
                userCall === 'WALK_AWAY'
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-105'
                  : userCall
                  ? 'bg-[#101824] text-slate-600 border border-slate-700/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#212E44] to-[#151F30] hover:from-[#2B3B57] hover:to-[#1C2940] text-slate-200 border border-[#344868] active:scale-95'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              WALK AWAY & PASS (-EV)
            </button>
          </div>

          {/* Interactive Play Controls if player decides to attack */}
          {userCall === 'ATTACK' && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1C2A40]">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-arcade">BET:</span>
                <CasinoChipStack amount={betSize} size="xs" animationState={chipAnimState} />
                {[5, 10, 25, 50].map(b => (
                  <button
                    key={b}
                    onClick={() => {
                      sounds.playChip();
                      setBetSize(b);
                    }}
                    disabled={isSpinning}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono-telemetry font-bold transition-all cursor-pointer ${
                      betSize === b
                        ? 'bg-amber-400 text-slate-950 shadow'
                        : 'bg-[#141F32] text-slate-300 hover:text-white'
                    }`}
                  >
                    {b} CR
                  </button>
                ))}
              </div>

              <button
                onClick={triggerReelSpin}
                disabled={isSpinning || credits < betSize}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-slate-950 font-arcade font-bold text-xs tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {isSpinning ? 'SPINNING...' : `SPIN GRID (${betSize} CR)`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Advantage Evaluation Panel */}
      {evaluation && (
        <div
          className={`p-4 rounded-2xl border-2 text-xs space-y-2.5 shadow-xl animate-fade-in ${
            evaluation.isCorrect
              ? 'bg-[#091C14] border-emerald-500/60 text-emerald-100'
              : 'bg-[#210D12] border-rose-500/60 text-rose-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-arcade font-bold text-sm tracking-wide flex items-center gap-1.5">
              {evaluation.isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300">{evaluation.title}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span className="text-rose-300">{evaluation.title}</span>
                </>
              )}
            </h4>
            <span className="px-2 py-0.5 rounded font-mono-telemetry font-bold text-xs bg-black/40 border border-white/10">
              {evaluation.isCorrect ? '+50 CR SCOUT BONUS' : '-50 CR LEAK PENALTY'}
            </span>
          </div>

          <p className="text-slate-300 leading-relaxed font-sans-arcade text-xs">
            {evaluation.text}
          </p>

          <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 font-mono-telemetry text-[11px] text-amber-200">
            {evaluation.mathBreakdown}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-[11px] text-slate-400 font-arcade">
              Machine: <strong className="text-white">{activeScenario.machineTitle}</strong>
            </span>
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-arcade font-bold text-xs tracking-wider flex items-center gap-1 shadow-md active:scale-95 cursor-pointer"
            >
              NEXT MACHINE <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
