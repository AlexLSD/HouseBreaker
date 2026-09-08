import React, { useState, useEffect } from 'react';
import { CardBitfield, CardRank, CardSuit } from '../../types';
import {
  createCard,
  calculateMDF,
  calculatePotOdds,
  runMonteCarloEquitySim
} from '../../utils/mathEngine';
import { sounds } from '../../utils/soundEffects';
import { CasinoChipStack } from '../CasinoChipStack';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  ChevronRight,
  Coins,
  Flame,
  HelpCircle,
  Plus,
  RotateCcw,
  Sparkles,
  Timer,
  Trophy,
  Zap
} from 'lucide-react';

export interface PokerHandScenario {
  id: string;
  name: string;
  heroCards: CardBitfield[];
  boardCards: CardBitfield[];
  street: 'FLOP' | 'TURN' | 'RIVER';
  potSize: number;
  villainBet: number;
  expectedAction: 'FOLD' | 'CALL' | 'RAISE';
  outsCount: number;
  outsDescription: string;
  explanation: string;
}

const POKER_SCENARIOS: PokerHandScenario[] = [
  {
    id: 'p1-flush-draw',
    name: 'Turn Nut Flush Draw vs Half-Pot Bet',
    heroCards: [createCard('A', 's'), createCard('Q', 's')],
    boardCards: [createCard('K', 's'), createCard('8', 's'), createCard('4', 'd'), createCard('2', 'c')],
    street: 'TURN',
    potSize: 100,
    villainBet: 50,
    expectedAction: 'CALL',
    outsCount: 9,
    outsDescription: '9 Spades remaining to hit Nut Flush (18% direct river equity + implied odds)',
    explanation: 'Villain bets $50 into $100. Total pot becomes $150. You must call $50. Pot odds are 50 / (150 + 50) = 25%. You hold 9 flush outs (approx 19.6% direct card equity). With high implied odds against villain stack, calling is clearly +EV!'
  },
  {
    id: 'p2-gutshot-overbet',
    name: 'Turn Gutshot Draw vs 1.5x Pot Overbet',
    heroCards: [createCard('9', 'h'), createCard('8', 'h')],
    boardCards: [createCard('K', 'c'), createCard('J', 'd'), createCard('5', 's'), createCard('2', 'c')],
    street: 'TURN',
    potSize: 80,
    villainBet: 120,
    expectedAction: 'FOLD',
    outsCount: 4,
    outsDescription: 'Only 4 Tens for Gutshot (8.7% equity vs 37.5% required pot odds)',
    explanation: 'Villain overbets $120 into $80 pot. Pot odds required: 120 / (80 + 120 + 120) = 37.5%. With only 4 outs to an inside straight, your direct equity is under 9%. Calling an overbet with a weak gutshot is an expensive -EV leak!'
  },
  {
    id: 'p3-top-set-checkraise',
    name: 'Flop Top Set on Wet Drawy Board',
    heroCards: [createCard('Q', 'd'), createCard('Q', 'c')],
    boardCards: [createCard('Q', 's'), createCard('J', 's'), createCard('T', 'c')],
    street: 'FLOP',
    potSize: 60,
    villainBet: 40,
    expectedAction: 'RAISE',
    outsCount: 10,
    outsDescription: 'Top Set with 72% equity vs broadway draws. Needs protection.',
    explanation: 'You hold Top Set (QQ) on a dangerous Q-J-10 board. Villain bets $40. Calling allows gutshots and flush draws to peel cheaply. Fast-playing with a RAISE charges drawing ranges maximum price to continue!'
  },
  {
    id: 'p4-river-bluffcatcher',
    name: 'River Bluff-Catcher vs 1/3 Pot Value/Bluff',
    heroCards: [createCard('A', 'c'), createCard('T', 'd')],
    boardCards: [createCard('T', 's'), createCard('7', 'h'), createCard('2', 'c'), createCard('5', 'd'), createCard('K', 's')],
    street: 'RIVER',
    potSize: 150,
    villainBet: 50,
    expectedAction: 'CALL',
    outsCount: 0,
    outsDescription: 'River complete: Second pair top kicker. Pot odds 20%.',
    explanation: 'Villain fires a small 1/3 pot bet of $50 into $150. You only need to be right 50 / (150 + 50) = 25% of the time! According to GTO Minimum Defense Frequency (MDF = 75%), AT is high enough in your range to be a mandatory call.'
  }
];

interface PokerTableGameDrillProps {
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

export const PokerTableGameDrill: React.FC<PokerTableGameDrillProps> = ({
  credits,
  onBet,
  onWin,
  onLoss,
  onRecordMistake,
  onRecordEarning
}) => {
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState<number>(0);
  const activeScenario = POKER_SCENARIOS[currentScenarioIdx];

  const [userDecision, setUserDecision] = useState<'FOLD' | 'CALL' | 'RAISE' | null>(null);
  const [heroBetChips, setHeroBetChips] = useState<number>(0);
  const [activeHeroChipDenom, setActiveHeroChipDenom] = useState<number>(25);
  const [chipAnimState, setChipAnimState] = useState<'idle' | 'win' | 'burn'>('idle');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(0);
  const [simEquity, setSimEquity] = useState<number>(0);
  const [handOutcomeText, setHandOutcomeText] = useState<string | null>(null);

  const [evaluation, setEvaluation] = useState<{
    isCorrect: boolean;
    title: string;
    text: string;
  } | null>(null);

  const potOdds = calculatePotOdds(
    activeScenario.potSize + activeScenario.villainBet,
    activeScenario.villainBet
  );
  const mdf = calculateMDF(activeScenario.potSize, activeScenario.villainBet);

  const loadScenario = (idx: number) => {
    setCurrentScenarioIdx(idx);
    setUserDecision(null);
    setHeroBetChips(0);
    setIsSimulating(false);
    setSimProgress(0);
    setSimEquity(0);
    setChipAnimState('idle');
    setHandOutcomeText(null);
    setEvaluation(null);
  };

  const handleAddChipToHeroBet = (denom?: number) => {
    if (userDecision) return;
    const addVal = denom || activeHeroChipDenom;
    if (credits < heroBetChips + addVal) {
      sounds.playLoss();
      return;
    }
    sounds.playChip();
    setHeroBetChips(prev => prev + addVal);
  };

  const handleMatchCallChips = () => {
    if (userDecision) return;
    if (credits < activeScenario.villainBet) {
      sounds.playLoss();
      return;
    }
    sounds.playChip();
    setHeroBetChips(activeScenario.villainBet);
  };

  const handleResetHeroChips = () => {
    if (userDecision) return;
    sounds.playClick();
    setHeroBetChips(0);
  };

  const handleDecision = (action: 'FOLD' | 'CALL' | 'RAISE') => {
    if (userDecision) return;

    // Check wager requirement
    let requiredWager = 0;
    if (action === 'CALL') {
      requiredWager = Math.max(activeScenario.villainBet, heroBetChips);
      setHeroBetChips(requiredWager);
    } else if (action === 'RAISE') {
      requiredWager = Math.max(activeScenario.villainBet * 3, heroBetChips);
      setHeroBetChips(requiredWager);
    } else {
      setHeroBetChips(0);
    }

    if (requiredWager > 0 && credits < requiredWager) {
      sounds.playLoss();
      return;
    }

    if (requiredWager > 0) {
      sounds.playChip();
      onBet(requiredWager);
    }

    setUserDecision(action);
    setIsSimulating(true);

    const isMatch = action === activeScenario.expectedAction;

    // Run animated Monte Carlo simulation ticker
    let currentPct = 0;
    const interval = setInterval(() => {
      currentPct += 15;
      setSimProgress(Math.min(100, currentPct));

      if (currentPct >= 100) {
        clearInterval(interval);
        setIsSimulating(false);

        const eqResult = runMonteCarloEquitySim(
          activeScenario.heroCards,
          activeScenario.boardCards
        );
        setSimEquity(eqResult.winEquity);

        if (isMatch) {
          sounds.playWin();
          sounds.playChipCollect();
          setChipAnimState('win');
          if (action === 'CALL') {
            const totalPotAwarded = activeScenario.potSize + activeScenario.villainBet * 2;
            onWin(totalPotAwarded, `Won Pot with ${eqResult.winEquity}% equity!`);
            onRecordEarning(
              activeScenario.name,
              totalPotAwarded - requiredWager,
              `Optimal GTO Call. Swept pot of ${totalPotAwarded} CR.`
            );
            setHandOutcomeText(`🎯 Perfect Call! Swept total pot of ${totalPotAwarded} CR.`);
          } else if (action === 'RAISE') {
            const totalPotAwarded = activeScenario.potSize + requiredWager * 2;
            onWin(totalPotAwarded, `Aggressive Value Raise paid off!`);
            onRecordEarning(
              activeScenario.name,
              totalPotAwarded - requiredWager,
              `Value Raise extracted maximum chips (+${totalPotAwarded - requiredWager} CR).`
            );
            setHandOutcomeText(`💥 Dominant Value Raise! Villain called and surrendered ${totalPotAwarded} CR.`);
          } else {
            // Disciplined fold
            onWin(25, 'Saved Stack by Disciplined GTO Fold');
            onRecordEarning(
              activeScenario.name,
              25,
              'Disciplined Fold: Evaded negative EV bluff-trap.'
            );
            setHandOutcomeText(`🛡️ Disciplined GTO Fold! Saved ${activeScenario.villainBet} CR from a negative-EV trap.`);
          }
        } else {
          sounds.playLoss();
          sounds.playChipsBurn();
          setChipAnimState('burn');
          const lostAmount = requiredWager > 0 ? requiredWager : 40;
          if (requiredWager === 0) {
            onLoss(lostAmount, 'Surrendered Pot by Mistake Fold');
          } else {
            onLoss(lostAmount, `Mistake ${action}: Hand lacked pot odds`);
          }
          onRecordMistake(
            activeScenario.name,
            action,
            activeScenario.expectedAction,
            lostAmount,
            activeScenario.explanation
          );
          setHandOutcomeText(`⚠️ Sub-optimal move! Cost ${lostAmount} CR in EV leak.`);
        }

        setEvaluation({
          isCorrect: isMatch,
          title: isMatch
            ? '🎯 MATHEMATICALLY OPTIMAL POKER DECISION (+EV)!'
            : '⚠️ SUB-OPTIMAL GTO ACTION (-EV LEAK)',
          text: activeScenario.explanation
        });
      }
    }, 40);
  };

  const handleNext = () => {
    sounds.playClick();
    const nextIdx = (currentScenarioIdx + 1) % POKER_SCENARIOS.length;
    loadScenario(nextIdx);
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#0A101C] border border-[#202E46] text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-arcade text-[10px] font-bold">
            {activeScenario.street} DECISION
          </span>
          <span className="font-arcade text-white text-xs font-bold">
            {activeScenario.name}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-arcade">POT ODDS:</span>
            <span className="font-mono-telemetry font-bold text-amber-300 ml-1">
              {potOdds}%
            </span>
          </div>
          <div className="border-l border-slate-700 pl-3">
            <span className="text-[10px] text-slate-400 font-arcade">GTO MDF:</span>
            <span className="font-mono-telemetry font-bold text-emerald-400 ml-1">
              {mdf}%
            </span>
          </div>
        </div>
      </div>

      {/* Oval Green Poker Table Felt */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0B3322] via-[#072418] to-[#04150D] border-4 border-[#2A523A] p-5 sm:p-6 relative shadow-2xl overflow-hidden min-h-[360px] flex flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600/10 via-transparent to-transparent pointer-events-none" />

        {/* Villain Stage & Pot Center */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#05140C]/90 border border-emerald-500/30 text-[11px] text-slate-300 font-arcade">
              <span>VILLAIN (IN POSITION)</span>
              <span className="text-rose-400 font-bold font-mono-telemetry">
                BET: {activeScenario.villainBet} CR
              </span>
            </div>
            {/* Visual Chip Stack for Villain's Bet */}
            <div className="animate-chip-slide flex items-center">
              <CasinoChipStack amount={activeScenario.villainBet} size="sm" />
            </div>
          </div>

          {/* Visual Center Pot with 3D Chips */}
          <div className="flex items-center gap-3 my-1.5 p-2 px-4 rounded-2xl bg-[#040E08]/85 border border-amber-500/40 shadow-xl">
            <CasinoChipStack amount={activeScenario.potSize + activeScenario.villainBet + heroBetChips} size="md" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-amber-400 font-mono-telemetry font-bold text-sm">
                <span>POT: {activeScenario.potSize + activeScenario.villainBet + heroBetChips} CR</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono-telemetry">
                ({activeScenario.potSize} Base + bets on table)
              </div>
            </div>
          </div>
        </div>

        {/* Community Board Cards */}
        <div className="flex flex-col items-center py-2">
          <span className="text-[11px] text-amber-200/90 font-arcade uppercase tracking-widest mb-1.5">
            COMMUNITY BOARD
          </span>
          <div className="flex items-center gap-2 sm:gap-2.5">
            {activeScenario.boardCards.map((card, idx) => {
              const isRed = card.suit === 'h' || card.suit === 'd';
              return (
                <div
                  key={idx}
                  className="w-12 h-18 sm:w-14 sm:h-20 rounded-xl bg-white border-2 border-amber-300 flex flex-col justify-between p-1.5 font-bold font-mono shadow-xl animate-deal-card"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <div className={`text-xs leading-none ${isRed ? 'text-red-600' : 'text-slate-950'}`}>
                    {card.rank}
                  </div>
                  <div className={`text-base sm:text-xl self-center leading-none ${isRed ? 'text-red-600' : 'text-slate-950'}`}>
                    {card.suit === 'h' ? '♥' : card.suit === 'd' ? '♦' : card.suit === 'c' ? '♣' : '♠'}
                  </div>
                  <div className={`text-xs leading-none self-end rotate-180 ${isRed ? 'text-red-600' : 'text-slate-950'}`}>
                    {card.rank}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hand Outcome Banner */}
        {handOutcomeText && (
          <div className="py-1 px-3 rounded-xl bg-black/70 border border-amber-400/40 text-center font-arcade text-xs text-amber-300 animate-fade-in mx-auto">
            {handOutcomeText}
          </div>
        )}

        {/* Hero Interactive Betting Area & Chip Stacking */}
        <div className="flex flex-col items-center justify-center my-1 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Hero Betting Spot */}
            <div className="flex flex-col items-center">
              <div
                onClick={() => handleAddChipToHeroBet()}
                className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full border-2 flex flex-col items-center justify-center transition-all select-none ${
                  !userDecision
                    ? 'cursor-pointer hover:border-amber-300 hover:shadow-lg active:scale-95'
                    : 'cursor-default'
                } ${
                  heroBetChips > 0
                    ? 'border-amber-400/80 bg-black/50 shadow-inner'
                    : 'border-dashed border-emerald-500/40 bg-emerald-950/20'
                }`}
                title={!userDecision ? `Tap to stack another $${activeHeroChipDenom} chip` : `Hero bet: $${heroBetChips}`}
              >
                <div className="absolute inset-1 rounded-full border border-amber-400/30 pointer-events-none" />

                {heroBetChips > 0 ? (
                  <div className="relative flex items-center justify-center animate-chip-slide">
                    <CasinoChipStack amount={heroBetChips} size="lg" animationState={chipAnimState} />
                  </div>
                ) : (
                  <div className="text-center font-arcade text-[9px] text-emerald-300/70 leading-tight pointer-events-none">
                    HERO<br />BET SPOT
                  </div>
                )}

                {!userDecision && heroBetChips > 0 && (
                  <span className="absolute -bottom-2 px-1.5 py-0.2 rounded-full bg-slate-900/90 text-amber-300 text-[8px] font-arcade border border-amber-400/40 shadow-xs pointer-events-none whitespace-nowrap">
                    + TAP TO STACK
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Chip Tray for Hero */}
            {!userDecision && (
              <div className="flex flex-col gap-1 bg-[#05140C]/90 p-1.5 rounded-2xl border border-emerald-500/30 shadow-md">
                <span className="text-[8px] font-arcade text-slate-300 text-center uppercase tracking-wider">
                  PUT CHIPS:
                </span>
                <div className="flex items-center gap-1.5">
                  {[25, 50, 100, 250].map(val => (
                    <button
                      key={val}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHeroChipDenom(val);
                        handleAddChipToHeroBet(val);
                      }}
                      className={`transition-transform cursor-pointer active:scale-90 hover:scale-110 p-0.5 rounded-full ${
                        activeHeroChipDenom === val ? 'ring-2 ring-amber-400 bg-amber-400/20' : ''
                      }`}
                      title={`Put $${val} chip onto table`}
                    >
                      <CasinoChipStack amount={val} size="xs" showCount={false} />
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-1 pt-1 border-t border-emerald-950/60">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMatchCallChips();
                    }}
                    className="px-2 py-0.5 rounded-lg bg-[#14291f] hover:bg-[#1f3f30] border border-[#2b5944] text-emerald-300 font-arcade text-[8px] font-bold cursor-pointer active:scale-95"
                  >
                    MATCH {activeScenario.villainBet}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetHeroChips();
                    }}
                    className="px-2 py-0.5 rounded-lg bg-[#2b1619] hover:bg-[#401f24] border border-[#592b32] text-rose-300 font-arcade text-[8px] font-bold cursor-pointer active:scale-95"
                  >
                    CLEAR
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hero Hole Cards */}
        <div className="flex flex-col items-center py-2">
          <span className="text-[11px] text-white font-arcade uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            HERO HOLE CARDS
            <span className="text-[10px] text-slate-400 font-mono-telemetry">
              ({activeScenario.outsDescription})
            </span>
          </span>
          <div className="flex items-center gap-2.5">
            {activeScenario.heroCards.map((card, idx) => {
              const isRed = card.suit === 'h' || card.suit === 'd';
              return (
                <div
                  key={idx}
                  className="w-14 h-20 sm:w-16 sm:h-24 rounded-xl bg-white border-2 border-amber-300 flex flex-col justify-between p-2 font-bold font-mono shadow-xl animate-deal-card"
                  style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
                >
                  <div className={`text-xs sm:text-sm leading-none ${isRed ? 'text-red-600' : 'text-slate-950'}`}>
                    {card.rank}
                  </div>
                  <div className={`text-lg sm:text-2xl self-center leading-none ${isRed ? 'text-red-600' : 'text-slate-950'}`}>
                    {card.suit === 'h' ? '♥' : card.suit === 'd' ? '♦' : card.suit === 'c' ? '♣' : '♠'}
                  </div>
                  <div className={`text-xs sm:text-sm leading-none self-end rotate-180 ${isRed ? 'text-red-600' : 'text-slate-950'}`}>
                    {card.rank}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Action Buttons (FOLD, CALL, RAISE) */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#2A523A]">
          <button
            onClick={() => handleDecision('FOLD')}
            disabled={!!userDecision}
            className={`py-3 px-3 rounded-xl font-arcade font-bold text-xs tracking-wider transition-all cursor-pointer shadow-lg ${
              userDecision === 'FOLD'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-105'
                : userDecision
                ? 'bg-[#0E1F16] text-slate-600 border border-slate-700/40 cursor-not-allowed opacity-60'
                : 'bg-[#1C2822] hover:bg-[#273830] text-slate-300 border border-[#3C5A48] active:scale-95'
            }`}
          >
            FOLD (SAVE CHIPS)
          </button>

          <button
            onClick={() => handleDecision('CALL')}
            disabled={!!userDecision || credits < activeScenario.villainBet}
            className={`py-3 px-3 rounded-xl font-arcade font-bold text-xs tracking-wider transition-all cursor-pointer shadow-lg ${
              userDecision === 'CALL'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-105'
                : userDecision || credits < activeScenario.villainBet
                ? 'bg-[#0E1F16] text-slate-600 border border-slate-700/40 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 active:scale-95'
            }`}
          >
            CALL {activeScenario.villainBet} CR
          </button>

          <button
            onClick={() => handleDecision('RAISE')}
            disabled={!!userDecision || credits < activeScenario.villainBet * 3}
            className={`py-3 px-3 rounded-xl font-arcade font-bold text-xs tracking-wider transition-all cursor-pointer shadow-lg ${
              userDecision === 'RAISE'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-105'
                : userDecision || credits < activeScenario.villainBet * 3
                ? 'bg-[#0E1F16] text-slate-600 border border-slate-700/40 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 active:scale-95'
            }`}
          >
            RAISE {activeScenario.villainBet * 3} CR
          </button>
        </div>
      </div>

      {/* Animated Monte Carlo Simulation Bar */}
      {isSimulating && (
        <div className="p-3.5 rounded-2xl bg-[#0B1322] border border-[#233552] text-xs space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-[11px] font-arcade text-slate-300">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              RUNNING MONTE CARLO SIMULATION (25,000 COMBINATIONS)...
            </span>
            <span className="font-mono-telemetry font-bold text-emerald-400">{simProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#131D30] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-75"
              style={{ width: `${simProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Advantage Evaluation Panel */}
      {evaluation && (
        <div className={`p-4 rounded-2xl border-2 text-xs space-y-2.5 shadow-xl animate-fade-in ${
          evaluation.isCorrect
            ? 'bg-[#091C14] border-emerald-500/60 text-emerald-100'
            : 'bg-[#210D12] border-rose-500/60 text-rose-100'
        }`}>
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
              {evaluation.isCorrect ? 'PROFITABLE GTO PLAY' : 'SUB-OPTIMAL PLAY'}
            </span>
          </div>

          <p className="text-slate-300 leading-relaxed font-sans-arcade text-xs">
            {evaluation.text}
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-[11px] text-slate-400 font-arcade">
              Scenario: <strong className="text-white">{activeScenario.name}</strong>
            </span>
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-arcade font-bold text-xs tracking-wider flex items-center gap-1 shadow-md active:scale-95 cursor-pointer"
            >
              NEXT HAND <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
