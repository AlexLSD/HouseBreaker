import React, { useState, useEffect } from 'react';
import { BlackjackGameDrill } from './drills/BlackjackGameDrill';
import { SlotMachineGameDrill } from './drills/SlotMachineGameDrill';
import { PokerTableGameDrill } from './drills/PokerTableGameDrill';
import { RouletteGameDrill } from './drills/RouletteGameDrill';
import { BankrollSetupModal } from './drills/BankrollSetupModal';
import { DrillSummaryModal } from './drills/DrillSummaryModal';
import {
  DrillGameMode,
  DrillMistake,
  DrillEarning,
  GamePerformanceMetric,
  SessionSummaryData
} from '../types/drillTypes';
import { sounds } from '../utils/soundEffects';
import { recordProfileRound, recordProfileMistake } from '../utils/userProfileStorage';
import { useLanguage } from '../i18n/LanguageContext';
import {
  ArrowLeft,
  Award,
  Coins,
  DollarSign,
  Flame,
  Info,
  Layers,
  RotateCcw,
  Shield,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Zap
} from 'lucide-react';

interface DrillArenaProps {
  onOpenGuide?: () => void;
  onNavigateTab?: (tabId: string) => void;
}

const DEFAULT_METRIC = (): GamePerformanceMetric => ({
  handsPlayed: 0,
  correctDecisions: 0,
  creditsWagered: 0,
  creditsWon: 0,
  creditsLost: 0,
  netCredits: 0
});

export const DrillArena: React.FC<DrillArenaProps> = ({ onOpenGuide, onNavigateTab }) => {
  const { t } = useLanguage();
  const [activeGame, setActiveGame] = useState<DrillGameMode>('BLACKJACK');

  // Session & Bankroll State - Ready immediately without blocking modal
  const [isSessionActive, setIsSessionActive] = useState<boolean>(true);
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const [initialCredits, setInitialCredits] = useState<number>(1000);
  const [currentCredits, setCurrentCredits] = useState<number>(1000);

  // Summary & Cashout Modal State
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<SessionSummaryData | null>(null);

  // Audio mute state
  const [isMuted, setIsMuted] = useState<boolean>(sounds.isMuted());

  // Gamification & Telemetry State
  const [xp, setXp] = useState<number>(0);
  const [consecutiveStreak, setConsecutiveStreak] = useState<number>(0);

  // Mistakes & Earnings History
  const [mistakes, setMistakes] = useState<DrillMistake[]>([]);
  const [earnings, setEarnings] = useState<DrillEarning[]>([]);

  // Per-game Performance Metrics
  const [metrics, setMetrics] = useState<Record<DrillGameMode, GamePerformanceMetric>>({
    BLACKJACK: DEFAULT_METRIC(),
    SLOTS: DEFAULT_METRIC(),
    POKER: DEFAULT_METRIC(),
    ROULETTE: DEFAULT_METRIC()
  });

  const toggleSound = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sounds.playChip();
    }
  };

  // Start / Reset Session with chosen credits
  const handleStartSession = (startingCredits: number) => {
    setInitialCredits(startingCredits);
    setCurrentCredits(startingCredits);
    setIsSessionActive(true);
    setShowSetupModal(false);
    setShowSummaryModal(false);
    setMistakes([]);
    setEarnings([]);
    setConsecutiveStreak(0);
    setMetrics({
      BLACKJACK: DEFAULT_METRIC(),
      SLOTS: DEFAULT_METRIC(),
      POKER: DEFAULT_METRIC(),
      ROULETTE: DEFAULT_METRIC()
    });
  };

  // Bet Deduction Hook
  const handleBet = (amount: number): boolean => {
    if (currentCredits < amount) {
      sounds.playLoss();
      return false;
    }
    setCurrentCredits(prev => {
      const next = prev - amount;
      if (next <= 0) {
        // Trigger Busted check after current event queue finishes
        setTimeout(() => triggerGameOver(0), 150);
      }
      return Math.max(0, next);
    });

    setMetrics(prev => {
      const g = prev[activeGame];
      return {
        ...prev,
        [activeGame]: {
          ...g,
          creditsWagered: g.creditsWagered + amount,
          creditsLost: g.creditsLost + amount,
          netCredits: g.netCredits - amount,
          handsPlayed: g.handsPlayed + 1
        }
      };
    });
    return true;
  };

  // Win Payout Hook
  const handleWin = (amount: number, reason: string) => {
    setCurrentCredits(prev => prev + amount);
    setConsecutiveStreak(s => s + 1);
    setXp(x => x + 35);

    // Save to user profile storage
    recordProfileRound(activeGame, 'WIN', Math.max(25, Math.round(amount / 2)), amount, reason);

    setMetrics(prev => {
      const g = prev[activeGame];
      return {
        ...prev,
        [activeGame]: {
          ...g,
          creditsWon: g.creditsWon + amount,
          netCredits: g.netCredits + amount,
          correctDecisions: g.correctDecisions + 1
        }
      };
    });
  };

  // Push / Refund Hook
  const handlePush = (amount: number, reason: string) => {
    setCurrentCredits(prev => prev + amount);
    recordProfileRound(activeGame, 'PUSH', amount, amount, reason);

    setMetrics(prev => {
      const g = prev[activeGame];
      return {
        ...prev,
        [activeGame]: {
          ...g,
          creditsLost: Math.max(0, g.creditsLost - amount),
          netCredits: g.netCredits + amount
        }
      };
    });
  };

  // Explicit Loss Hook
  const handleLoss = (amount: number, reason: string) => {
    setConsecutiveStreak(0);
    recordProfileRound(activeGame, 'LOSS', amount, 0, reason);

    // Note: The wager was already deducted when placed via handleBet.
    // Check if player is completely out of credits.
    if (currentCredits <= 0) {
      setTimeout(() => triggerGameOver(0), 150);
    }
  };

  // Telemetry: Record Mistake
  const handleRecordMistake = (
    scenarioName: string,
    userDecision: string,
    expectedDecision: string,
    cost: number,
    explanation: string
  ) => {
    // Record to user profile persistence
    recordProfileMistake(
      activeGame,
      scenarioName,
      userDecision,
      expectedDecision,
      cost,
      explanation
    );

    const newMistake: DrillMistake = {
      id: `mistake-${Date.now()}-${Math.random()}`,
      game: activeGame,
      scenarioName,
      userDecision,
      expectedDecision,
      creditsLost: cost,
      explanation,
      timestamp: Date.now()
    };
    setMistakes(prev => [newMistake, ...prev]);
  };

  // Telemetry: Record Earning
  const handleRecordEarning = (scenarioName: string, won: number, reason: string) => {
    const newEarning: DrillEarning = {
      id: `earning-${Date.now()}-${Math.random()}`,
      game: activeGame,
      scenarioName,
      creditsWon: won,
      reason,
      timestamp: Date.now()
    };
    setEarnings(prev => [newEarning, ...prev]);
  };

  // Compute skill tier
  const calculateSkillRank = (accuracy: number, net: number) => {
    if (accuracy >= 85 && net > 0) {
      return {
        grade: 'S-TIER',
        title: 'Master AP Shark',
        badgeColor: 'bg-amber-400 text-slate-950 font-bold',
        description: 'Pristine execution across card counting and progressive slot scouting.'
      };
    } else if (accuracy >= 70) {
      return {
        grade: 'A-TIER',
        title: 'Disciplined Advantage Player',
        badgeColor: 'bg-emerald-500 text-slate-950 font-bold',
        description: 'Strong mathematical discipline with minimal negative-EV leaks.'
      };
    } else if (accuracy >= 50) {
      return {
        grade: 'B-TIER',
        title: 'Break-Even Grinder',
        badgeColor: 'bg-sky-500 text-slate-950 font-bold',
        description: 'Solid foundation, but occasional mistakes allow house edge to creep in.'
      };
    } else {
      return {
        grade: 'D-TIER',
        title: 'Reckless Gambler',
        badgeColor: 'bg-rose-500 text-white font-bold',
        description: 'Heavy tactical leaks and sub-threshold plays drained your bankroll.'
      };
    }
  };

  // Compile Session Summary
  const compileSummaryData = (finalBalance: number, isBusted: boolean): SessionSummaryData => {
    const netCredits = finalBalance - initialCredits;
    let totalHandsOrSpins = 0;
    let totalCorrect = 0;

    let worstLoss = 0;
    let worstGame: DrillGameMode | null = null;
    let highestProfit = 0;
    let bestGame: DrillGameMode | null = null;

    (['BLACKJACK', 'SLOTS', 'POKER'] as DrillGameMode[]).forEach(g => {
      const m = metrics[g];
      totalHandsOrSpins += m.handsPlayed;
      totalCorrect += m.correctDecisions;
      const net = m.creditsWon - m.creditsLost;
      if (net < worstLoss) {
        worstLoss = net;
        worstGame = g;
      }
      if (net > highestProfit) {
        highestProfit = net;
        bestGame = g;
      }
    });

    const overallAccuracy =
      totalHandsOrSpins > 0 ? Math.round((totalCorrect / totalHandsOrSpins) * 100) : 100;

    // Single worst mistake by credit cost
    const sortedMistakes = [...mistakes].sort((a, b) => b.creditsLost - a.creditsLost);
    const worstSingleMistake = sortedMistakes[0] || null;

    return {
      initialCredits,
      finalCredits: finalBalance,
      netCredits,
      totalHandsOrSpins,
      totalCorrect,
      overallAccuracy,
      isBusted,
      gameMetrics: metrics,
      mistakes,
      earnings,
      worstLeakGame: worstGame || (worstSingleMistake ? worstSingleMistake.game : null),
      worstSingleMistake,
      mostProfitableGame: bestGame,
      skillRank: calculateSkillRank(overallAccuracy, netCredits)
    };
  };

  // Trigger Busted Game Over
  const triggerGameOver = (finalBal: number) => {
    const summary = compileSummaryData(finalBal, true);
    setSummaryData(summary);
    setShowSummaryModal(true);
  };

  // Cash Out
  const handleCashOut = () => {
    sounds.playCashOut();
    const summary = compileSummaryData(currentCredits, false);
    setSummaryData(summary);
    setShowSummaryModal(true);
  };

  // Aggregate totals
  const totalRounds =
    metrics.BLACKJACK.handsPlayed + metrics.SLOTS.handsPlayed + metrics.POKER.handsPlayed;
  const totalWins =
    metrics.BLACKJACK.correctDecisions +
    metrics.SLOTS.correctDecisions +
    metrics.POKER.correctDecisions;
  const overallAcc = totalRounds > 0 ? Math.round((totalWins / totalRounds) * 100) : 100;
  const netProfit = currentCredits - initialCredits;

  return (
    <div className="space-y-3.5 pb-20 animate-fade-in max-w-4xl mx-auto font-sans-arcade">
      {/* Starting Bankroll Modal */}
      <BankrollSetupModal
        isOpen={showSetupModal}
        onConfirm={handleStartSession}
        onClose={() => setShowSetupModal(false)}
        onNavigateTab={onNavigateTab}
      />

      {/* Cash Out & Mistake Autopsy Summary Modal */}
      <DrillSummaryModal
        isOpen={showSummaryModal}
        summary={summaryData}
        onRestart={() => {
          setShowSummaryModal(false);
          setShowSetupModal(true);
        }}
        onClose={() => setShowSummaryModal(false)}
        onNavigateTab={onNavigateTab}
      />

      {/* Top Universal Quick Navigation & Exit Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 px-3 rounded-2xl bg-gradient-to-r from-[#0C121E] via-[#0A0F1A] to-[#070B14] border border-[#1E2D44] shadow-md text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onNavigateTab && (
            <button
              onClick={() => {
                sounds.playClick();
                onNavigateTab('command-center');
              }}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#172236] hover:bg-[#22334F] text-purple-300 hover:text-purple-100 font-arcade text-[11px] font-bold border border-purple-500/40 transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Return to Main Hub / Overview"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.hubMenu}</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 font-arcade">
            <span className="text-slate-500">{t.switchLab}:</span>
            <button
              onClick={() => onNavigateTab?.('roulette')}
              className="px-2 py-1 rounded-lg bg-[#111927] hover:bg-[#1C283E] text-slate-300 hover:text-amber-300 border border-slate-700/50 transition-all cursor-pointer"
            >
              🎯 {t.navRoulette}
            </button>
            <button
              onClick={() => onNavigateTab?.('massive-slots')}
              className="px-2 py-1 rounded-lg bg-[#111927] hover:bg-[#1C283E] text-slate-300 hover:text-amber-300 border border-slate-700/50 transition-all cursor-pointer"
            >
              🎰 {t.navSlots}
            </button>
            <button
              onClick={() => onNavigateTab?.('range-lab')}
              className="px-2 py-1 rounded-lg bg-[#111927] hover:bg-[#1C283E] text-slate-300 hover:text-amber-300 border border-slate-700/50 transition-all cursor-pointer"
            >
              ♠️ {t.navPoker}
            </button>
            <button
              onClick={() => onNavigateTab?.('risk-lab')}
              className="px-2 py-1 rounded-lg bg-[#111927] hover:bg-[#1C283E] text-slate-300 hover:text-amber-300 border border-slate-700/50 transition-all cursor-pointer"
            >
              🪙 {t.navKelly}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto text-[11px]">
          <button
            onClick={() => {
              sounds.playClick();
              setShowSetupModal(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#142236] hover:bg-[#1C3250] border border-amber-500/40 text-amber-300 hover:text-white font-arcade transition-all cursor-pointer active:scale-95 shadow-sm"
            title="Adjust your starting bankroll for this drill session"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.bankrollBtn}</span>
          </button>
        </div>
      </div>

      {/* Top Arcade Marquee Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#121826] to-[#0F1420] border-2 border-[#2A3750] rounded-2xl p-3 sm:p-3.5 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-arcade uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
              {t.liveDrillTitle}
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-telemetry border border-amber-500/40">
                {t.liveWagers}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {t.liveDrillSub}
            </p>
          </div>
        </div>

        {/* Controls, Telemetry & Cash Out */}
        <div className="flex items-center gap-2.5 text-xs">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-[#141F33] hover:bg-[#1E2F4C] border border-[#2D3F5E] text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#141F33] hover:bg-[#1E2F4C] border border-sky-500/40 text-sky-300 hover:text-white text-xs font-arcade transition-all cursor-pointer shadow-sm active:scale-95"
              title="Explain Game Drills and math principles"
            >
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden xs:inline">{t.guide}</span>
            </button>
          )}

          {/* Cash Out Button */}
          <button
            onClick={handleCashOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-arcade font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95 ring-1 ring-amber-300"
            title="Cash out and see your complete strengths and mistakes autopsy"
          >
            <Coins className="w-3.5 h-3.5 text-slate-950" />
            {t.cashOutBtn}
          </button>
        </div>
      </div>

      {/* Gamified Live Credits & Telemetry Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Live Credit Stack */}
        <div className="p-3 rounded-2xl bg-gradient-to-b from-[#141C2A] to-[#0A101A] border-2 border-amber-500/40 shadow-lg flex flex-col justify-between">
          <span className="text-[10px] text-amber-300 font-arcade uppercase tracking-wider block">
            {t.currentCredits}
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono-telemetry text-amber-400 flex items-center gap-1">
            <span>🪙 {currentCredits.toLocaleString()}</span>
          </div>
          <span className={`text-[10px] font-mono-telemetry font-bold ${
            netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {netProfit >= 0 ? `+${netProfit}` : netProfit} {t.netPL}
          </span>
        </div>

        {/* Accuracy */}
        <div className="p-3 rounded-2xl bg-[#0E1524] border border-[#202E46] flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-arcade uppercase tracking-wider block">
            {t.gtoAccuracy}
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono-telemetry text-emerald-400">
            {overallAcc}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono-telemetry">
            {totalWins} / {totalRounds} {t.optimalPlays}
          </span>
        </div>

        {/* Hot Streak Multiplier */}
        <div className="p-3 rounded-2xl bg-[#0E1524] border border-[#202E46] flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-arcade uppercase tracking-wider block">
            {t.hotStreak}
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono-telemetry text-orange-400 flex items-center gap-1">
            <Flame className="w-5 h-5 text-orange-500" />
            {consecutiveStreak}X
          </div>
          <span className="text-[10px] text-slate-400 font-mono-telemetry">
            {consecutiveStreak >= 3 ? '🔥 Hot Streak Active' : 'Consistent AP Play'}
          </span>
        </div>

        {/* Reset Bankroll Button */}
        <div className="p-3 rounded-2xl bg-[#0E1524] border border-[#202E46] flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-arcade uppercase tracking-wider block">
            {t.sessionStack}
          </span>
          <div className="text-xs font-mono-telemetry text-slate-300">
            Start: <strong>{initialCredits.toLocaleString()} CR</strong>
          </div>
          <button
            onClick={() => setShowSetupModal(true)}
            className="w-full py-1 rounded-lg bg-[#182338] hover:bg-[#22324E] border border-[#314464] text-[10px] font-arcade text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            {t.adjustStack}
          </button>
        </div>
      </div>

      {/* Game Selector Arcade Tabs - Responsive on mobile & desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveGame('BLACKJACK');
          }}
          className={`min-h-[56px] p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98] ${
            activeGame === 'BLACKJACK'
              ? 'bg-gradient-to-b from-[#182A20] to-[#0F1E16] border-emerald-500/80 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/40'
              : 'bg-[#0E1524] hover:bg-[#152034] border-[#223048] text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-base sm:text-lg">🃏</span>
            <span className={`text-[9px] sm:text-[10px] font-mono-telemetry font-bold px-1.5 py-0.5 rounded ${
              activeGame === 'BLACKJACK' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-500'
            }`}>
              {t.game1}
            </span>
          </div>
          <span className="text-xs font-arcade font-bold text-white block truncate">{t.bjTable}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{t.bjTableSub}</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveGame('SLOTS');
          }}
          className={`min-h-[56px] p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98] ${
            activeGame === 'SLOTS'
              ? 'bg-gradient-to-b from-[#2A2214] to-[#1E170C] border-amber-500/80 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/40'
              : 'bg-[#0E1524] hover:bg-[#152034] border-[#223048] text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-base sm:text-lg">🎰</span>
            <span className={`text-[9px] sm:text-[10px] font-mono-telemetry font-bold px-1.5 py-0.5 rounded ${
              activeGame === 'SLOTS' ? 'bg-amber-500/30 text-amber-300' : 'text-slate-500'
            }`}>
              {t.game2}
            </span>
          </div>
          <span className="text-xs font-arcade font-bold text-white block truncate">{t.slotsTable}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{t.slotsTableSub}</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveGame('POKER');
          }}
          className={`min-h-[56px] p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98] ${
            activeGame === 'POKER'
              ? 'bg-gradient-to-b from-[#182333] to-[#0F1826] border-sky-500/80 shadow-lg shadow-sky-950/40 ring-1 ring-sky-500/40'
              : 'bg-[#0E1524] hover:bg-[#152034] border-[#223048] text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-base sm:text-lg">♠️</span>
            <span className={`text-[9px] sm:text-[10px] font-mono-telemetry font-bold px-1.5 py-0.5 rounded ${
              activeGame === 'POKER' ? 'bg-sky-500/30 text-sky-300' : 'text-slate-500'
            }`}>
              {t.game3}
            </span>
          </div>
          <span className="text-xs font-arcade font-bold text-white block truncate">{t.pokerTable}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{t.pokerTableSub}</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveGame('ROULETTE');
          }}
          className={`min-h-[56px] p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98] ${
            activeGame === 'ROULETTE'
              ? 'bg-gradient-to-b from-[#2B1720] to-[#1D0F16] border-rose-500/80 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/40'
              : 'bg-[#0E1524] hover:bg-[#152034] border-[#223048] text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-base sm:text-lg">🎯</span>
            <span className={`text-[9px] sm:text-[10px] font-mono-telemetry font-bold px-1.5 py-0.5 rounded ${
              activeGame === 'ROULETTE' ? 'bg-rose-500/30 text-rose-300' : 'text-slate-500'
            }`}>
              {t.game4}
            </span>
          </div>
          <span className="text-xs font-arcade font-bold text-white block truncate">{t.rouletteTable}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{t.rouletteTableSub}</span>
        </button>
      </div>

      {/* Active Playable Drill Arena Container */}
      <div className="bg-[#0A0F1A] border-2 border-[#202E46] rounded-3xl p-4 sm:p-5 shadow-2xl">
        {activeGame === 'BLACKJACK' && (
          <BlackjackGameDrill
            credits={currentCredits}
            onBet={handleBet}
            onWin={handleWin}
            onLoss={handleLoss}
            onPush={handlePush}
            onRecordMistake={handleRecordMistake}
            onRecordEarning={handleRecordEarning}
          />
        )}
        {activeGame === 'SLOTS' && (
          <SlotMachineGameDrill
            credits={currentCredits}
            onBet={handleBet}
            onWin={handleWin}
            onLoss={handleLoss}
            onRecordMistake={handleRecordMistake}
            onRecordEarning={handleRecordEarning}
          />
        )}
        {activeGame === 'POKER' && (
          <PokerTableGameDrill
            credits={currentCredits}
            onBet={handleBet}
            onWin={handleWin}
            onLoss={handleLoss}
            onRecordMistake={handleRecordMistake}
            onRecordEarning={handleRecordEarning}
          />
        )}
        {activeGame === 'ROULETTE' && (
          <RouletteGameDrill
            currentCredits={currentCredits}
            onBet={handleBet}
            onWin={handleWin}
            onMistake={handleRecordMistake}
            onCorrect={() => {
              setConsecutiveStreak(s => s + 1);
              setXp(x => x + 40);
            }}
          />
        )}
      </div>
    </div>
  );
};
