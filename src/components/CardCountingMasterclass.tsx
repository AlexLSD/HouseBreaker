import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { PlayingCard } from './PlayingCard';
import { sounds } from '../utils/soundEffects';
import {
  Award,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Flame,
  HelpCircle,
  Layers,
  RotateCcw,
  Shield,
  Sparkles,
  Trophy,
  Zap
} from 'lucide-react';

interface CardSample {
  rank: string;
  suit: 'h' | 'd' | 'c' | 's';
  val: number; // +1, 0, -1
  category: 'LOW' | 'NEUTRAL' | 'HIGH';
  desc: string;
}

const DECK_SAMPLES: CardSample[] = [
  { rank: '5', suit: 'h', val: +1, category: 'LOW', desc: 'Low card (2-6): +1 Tag. Good when removed from deck.' },
  { rank: 'K', suit: 's', val: -1, category: 'HIGH', desc: 'King / Face card (10-A): -1 Tag. Surplus of these makes player +EV.' },
  { rank: '8', suit: 'c', val: 0, category: 'NEUTRAL', desc: 'Neutral card (7-9): 0 Tag. Does not shift the player edge.' },
  { rank: '2', suit: 'd', val: +1, category: 'LOW', desc: 'Low card (2-6): +1 Tag. Increases player advantage when depleted.' },
  { rank: 'Q', suit: 'h', val: -1, category: 'HIGH', desc: 'Queen (10-A): -1 Tag. Face card that produces 20s and Blackjacks.' },
  { rank: 'A', suit: 's', val: -1, category: 'HIGH', desc: 'Ace: -1 Tag. Essential for 3:2 payout natural Blackjacks.' },
  { rank: '4', suit: 'c', val: +1, category: 'LOW', desc: 'Low card: +1 Tag. Leaves higher ratio of 10-value cards.' },
  { rank: '7', suit: 'd', val: 0, category: 'NEUTRAL', desc: 'Neutral card: 0 Tag. Has negligible effect on advantage.' },
  { rank: 'J', suit: 'c', val: -1, category: 'HIGH', desc: 'Jack / Jester: -1 Tag. High card value.' },
  { rank: '6', suit: 's', val: +1, category: 'LOW', desc: 'Low card: +1 Tag. Dealer bust engine.' }
];

export const CardCountingMasterclass: React.FC = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(0); // 0: Concept, 1: Hi-Lo Tags, 2: True Count, 3: Bet Ramping, 4: Practice Lab
  
  // Practice trainer state
  const [sampleIdx, setSampleIdx] = useState<number>(0);
  const [runningCount, setRunningCount] = useState<number>(0);
  const [decksRemaining, setDecksRemaining] = useState<number>(3.0);
  const [userTagGuess, setUserTagGuess] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [practiceStreak, setPracticeStreak] = useState<number>(0);
  const [totalGuessed, setTotalGuessed] = useState<number>(0);

  const currentCard = DECK_SAMPLES[sampleIdx];
  const computedTrueCount = (runningCount / Math.max(0.5, decksRemaining)).toFixed(1);

  const handleTagChoice = (tag: number) => {
    if (userTagGuess !== null) return;
    setUserTagGuess(tag);
    setTotalGuessed(g => g + 1);

    const isMatch = tag === currentCard.val;
    if (isMatch) {
      sounds.playWin();
      setPracticeStreak(s => s + 1);
      setRunningCount(rc => rc + currentCard.val);
      setFeedback({
        isCorrect: true,
        text: `PERFECT! ${currentCard.rank} has tag ${tag > 0 ? '+1' : tag < 0 ? '-1' : '0'}. Running Count updated!`
      });
    } else {
      sounds.playLoss();
      setPracticeStreak(0);
      setFeedback({
        isCorrect: false,
        text: `Incorrect: ${currentCard.rank} has tag ${currentCard.val > 0 ? '+1' : currentCard.val < 0 ? '-1' : '0'}. (${currentCard.desc})`
      });
    }

    setTimeout(() => {
      setUserTagGuess(null);
      setFeedback(null);
      setSampleIdx(prev => (prev + 1) % DECK_SAMPLES.length);
    }, 1200);
  };

  const handleResetTrainer = () => {
    sounds.playClick();
    setRunningCount(0);
    setPracticeStreak(0);
    setFeedback(null);
    setUserTagGuess(null);
    setSampleIdx(0);
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#0C1220] to-[#070B14] border-2 border-[#1E293B] shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#1E293B]">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-arcade font-bold shadow-md shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white font-arcade uppercase tracking-wider">
                Card Counting Academy (Zero to Hero)
              </h2>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono-telemetry font-bold border border-amber-400/40">
                HI-LO AP
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Master the exact mathematical counting system that shifts the casino edge in your favor
            </p>
          </div>
        </div>

        {/* Step Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 rounded-xl bg-[#080D18] border border-[#1E293B]">
          {[
            { id: 0, label: '0. Secret' },
            { id: 1, label: '1. Hi-Lo' },
            { id: 2, label: '2. True Count' },
            { id: 3, label: '3. Bet Spread' },
            { id: 4, label: '⚡ Practice' }
          ].map(step => (
            <button
              key={step.id}
              onClick={() => {
                sounds.playClick();
                setActiveStep(step.id);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-arcade font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeStep === step.id
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 0: THE SECRET OF WHY IT WORKS */}
      {activeStep === 0 && (
        <div className="space-y-3 animate-fade-in text-xs">
          <div className="p-3.5 rounded-2xl bg-[#111C30] border border-sky-500/40 space-y-2">
            <div className="flex items-center gap-2 text-sky-300 font-arcade font-bold text-sm">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>THE MATHEMATICAL TRUTH ABOUT BLACKJACK</span>
            </div>
            <p className="text-slate-200 leading-relaxed">
              Blackjack is <strong>not an independent trial game</strong> like Roulette or Craps. Every card removed from the shoe alters the exact probability distribution of every remaining hand!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#091D14] border border-emerald-500/40 space-y-1.5">
              <span className="text-emerald-300 font-arcade font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                WHEN HIGH CARDS (10, J, Q, K, A) REMAIN IN DECK:
              </span>
              <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1 leading-relaxed">
                <li><strong>3:2 Natural Blackjacks</strong> occur much more frequently (players are paid 3:2, dealer only gets 1:1).</li>
                <li><strong>Dealer Busts Surge:</strong> The dealer MUST draw to 16. A shoe packed with 10s causes the dealer to bust often!</li>
                <li><strong>Doubles & Splits Win:</strong> Player double-downs on 10 or 11 hit 20s and 21s at high frequency.</li>
                <li><strong>Result:</strong> Player has an active <strong className="text-emerald-300">+0.5% to +2.5% advantage</strong> over the casino!</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#221015] border border-rose-500/40 space-y-1.5">
              <span className="text-rose-300 font-arcade font-bold text-xs flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-rose-400" />
                WHEN LOW CARDS (2, 3, 4, 5, 6) REMAIN IN DECK:
              </span>
              <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1 leading-relaxed">
                <li>Dealer makes their hands without busting (e.g. 14 + 5 = 19, 16 + 4 = 20).</li>
                <li>Player hits on stiff hands (12-16) end up weak and lose to dealer totals.</li>
                <li>Doubling down becomes unprofitable.</li>
                <li><strong>Result:</strong> Casino house edge increases up to <strong className="text-rose-400">-2.0% or worse</strong>.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: THE HI-LO TAG SYSTEM */}
      {activeStep === 1 && (
        <div className="space-y-3 animate-fade-in text-xs">
          <div className="p-3.5 rounded-2xl bg-[#111C30] border border-amber-400/40 space-y-1.5">
            <h3 className="text-xs font-arcade font-bold text-amber-300 uppercase tracking-wider">
              HOW HI-LO WORKS (THE CARD TAGS)
            </h3>
            <p className="text-slate-300 leading-relaxed">
              You do <strong>not</strong> need a photographic memory to count cards. In the standard Hi-Lo system (invented by Harvey Dubner in 1963), you simply track a single running number by assigning one of three tags as cards leave the shoe:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Low Cards */}
            <div className="p-3 rounded-2xl bg-[#091D14] border border-emerald-500/50 space-y-2 text-center">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-telemetry text-sm font-bold border border-emerald-500/40 inline-block">
                TAG: +1
              </span>
              <h4 className="text-xs font-arcade font-bold text-white">2, 3, 4, 5, 6</h4>
              <p className="text-[11px] text-slate-300 leading-tight">
                <strong>Low Cards.</strong> Every time one of these is dealt, the shoe becomes richer in tens, so you <strong>ADD 1</strong>.
              </p>
            </div>

            {/* Neutral Cards */}
            <div className="p-3 rounded-2xl bg-[#101826] border border-slate-600/50 space-y-2 text-center">
              <span className="px-2 py-0.5 rounded bg-slate-500/20 text-slate-300 font-mono-telemetry text-sm font-bold border border-slate-500/40 inline-block">
                TAG: 0
              </span>
              <h4 className="text-xs font-arcade font-bold text-white">7, 8, 9</h4>
              <p className="text-[11px] text-slate-300 leading-tight">
                <strong>Neutral Cards.</strong> These have almost zero mathematical shift on player expectation. You <strong>DO NOTHING</strong>.
              </p>
            </div>

            {/* High Cards */}
            <div className="p-3 rounded-2xl bg-[#251016] border border-rose-500/50 space-y-2 text-center">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono-telemetry text-sm font-bold border border-rose-500/40 inline-block">
                TAG: -1
              </span>
              <h4 className="text-xs font-arcade font-bold text-white">10, J, Q, K, A</h4>
              <p className="text-[11px] text-slate-300 leading-tight">
                <strong>High Cards.</strong> A high card leaves the shoe, reducing your ammunition for Blackjacks. You <strong>SUBTRACT 1</strong>.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#080D18] border border-[#1E293B] flex items-center justify-between text-[11px] font-mono-telemetry text-slate-300">
            <span>✨ A fresh 52-card deck is balanced: Total Sum = 0</span>
            <button
              onClick={() => setActiveStep(2)}
              className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-arcade font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              Next: True Count <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: RUNNING COUNT VS TRUE COUNT */}
      {activeStep === 2 && (
        <div className="space-y-3 animate-fade-in text-xs">
          <div className="p-3.5 rounded-2xl bg-[#111C30] border border-amber-400/40 space-y-2">
            <h3 className="text-xs font-arcade font-bold text-amber-300 uppercase tracking-wider">
              RUNNING COUNT VS TRUE COUNT (THE MULTI-DECK KEY)
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Casinos don't use single decks anymore; they use 6-deck or 8-deck shoes. A Running Count of <strong>+6</strong> with 5 decks still remaining is diluted: that is only 1 extra high card per deck! But a Running Count of <strong>+6</strong> with only 1 deck remaining is massive!
            </p>
            <div className="p-3 rounded-xl bg-[#060A14] border border-amber-400/30 text-center font-mono-telemetry text-sm">
              <span className="text-amber-400 font-bold">TRUE COUNT (TC)</span> = <span className="text-emerald-400 font-bold">Running Count (RC)</span> ÷ <span className="text-sky-300 font-bold">Decks Remaining</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-[#0A1220] border border-[#1E2E48]">
              <span className="text-[10px] text-slate-400 block">RC = +6, 6 Decks Left</span>
              <span className="text-sm font-bold text-slate-300 font-mono-telemetry">TC = +1.0</span>
              <span className="text-[9px] text-amber-400 block mt-0.5">Even / Baseline</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0A1220] border border-[#1E2E48]">
              <span className="text-[10px] text-slate-400 block">RC = +6, 3 Decks Left</span>
              <span className="text-sm font-bold text-emerald-400 font-mono-telemetry">TC = +2.0</span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">+0.5% Player Edge</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0A1220] border border-[#1E2E48]">
              <span className="text-[10px] text-slate-400 block">RC = +6, 2 Decks Left</span>
              <span className="text-sm font-bold text-emerald-400 font-mono-telemetry">TC = +3.0</span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">+1.0% Player Edge</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0A1220] border border-[#1E2E48]">
              <span className="text-[10px] text-slate-400 block">RC = +6, 1 Deck Left</span>
              <span className="text-sm font-bold text-amber-300 font-mono-telemetry">TC = +6.0</span>
              <span className="text-[9px] text-amber-300 block mt-0.5">+2.5% Extreme Edge!</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: BET SPREADING & RAMPING */}
      {activeStep === 3 && (
        <div className="space-y-3 animate-fade-in text-xs">
          <div className="p-3.5 rounded-2xl bg-[#111C30] border border-emerald-500/40 space-y-1.5">
            <h3 className="text-xs font-arcade font-bold text-emerald-300 uppercase tracking-wider">
              BET RAMPING: WHERE THE MONEY IS MADE
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Card counting does not win money by playing basic hands differently — it wins money by <strong>betting small when the casino has the edge, and betting big when you have the edge</strong>!
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#1E2B42] bg-[#070B14]">
            <table className="w-full text-left text-xs font-mono-telemetry">
              <thead className="bg-[#0C1422] text-slate-400 border-b border-[#1E2B42] text-[10px] uppercase font-arcade">
                <tr>
                  <th className="p-2.5">True Count</th>
                  <th className="p-2.5">Player Edge</th>
                  <th className="p-2.5">Bet Spread ($10 Table)</th>
                  <th className="p-2.5">Bet Spread ($25 Table)</th>
                  <th className="p-2.5">Floor Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A263C]">
                <tr>
                  <td className="p-2.5 font-bold text-rose-400">TC ≤ +1</td>
                  <td className="p-2.5 text-rose-300">-0.5% (House edge)</td>
                  <td className="p-2.5 font-bold text-white">$10 (1 Unit)</td>
                  <td className="p-2.5 font-bold text-white">$25 (1 Unit)</td>
                  <td className="p-2.5 text-slate-400">Minimum flat bet</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-emerald-400">TC +2</td>
                  <td className="p-2.5 text-emerald-300">+0.5% Player edge</td>
                  <td className="p-2.5 font-bold text-emerald-300">$20 (2 Units)</td>
                  <td className="p-2.5 font-bold text-emerald-300">$50 (2 Units)</td>
                  <td className="p-2.5 text-slate-300">Ramp begins</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-emerald-400">TC +3</td>
                  <td className="p-2.5 text-emerald-300">+1.0% Player edge</td>
                  <td className="p-2.5 font-bold text-emerald-300">$40 (4 Units)</td>
                  <td className="p-2.5 font-bold text-emerald-300">$100 (4 Units)</td>
                  <td className="p-2.5 text-slate-300">Moderate spread</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-amber-300">TC +4</td>
                  <td className="p-2.5 text-amber-300">+1.5% Player edge</td>
                  <td className="p-2.5 font-bold text-amber-300">$80 (8 Units)</td>
                  <td className="p-2.5 font-bold text-amber-300">$200 (8 Units)</td>
                  <td className="p-2.5 text-amber-300 font-bold">Heavy advantage</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-amber-400">TC ≥ +5</td>
                  <td className="p-2.5 text-amber-400">+2.0%+ (Massive)</td>
                  <td className="p-2.5 font-bold text-amber-400">$120 (12 Units)</td>
                  <td className="p-2.5 font-bold text-amber-400">$300+ (12 Units)</td>
                  <td className="p-2.5 text-amber-400 font-bold">MAX BET CIRCLE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STEP 4: INTERACTIVE PRACTICE ARENA */}
      {activeStep === 4 && (
        <div className="space-y-4 animate-fade-in text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#0A1220] border border-[#1E2E48]">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-arcade text-slate-400 uppercase">
                RUNNING COUNT:{' '}
                <strong className={runningCount > 0 ? 'text-emerald-400 font-mono-telemetry text-sm' : runningCount < 0 ? 'text-rose-400 font-mono-telemetry text-sm' : 'text-slate-300 font-mono-telemetry text-sm'}>
                  {runningCount > 0 ? `+${runningCount}` : runningCount}
                </strong>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-arcade text-slate-400 uppercase">
                TRUE COUNT:{' '}
                <strong className={parseFloat(computedTrueCount) > 1 ? 'text-amber-400 font-mono-telemetry text-sm' : 'text-slate-300 font-mono-telemetry text-sm'}>
                  {computedTrueCount}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-telemetry text-emerald-400 font-bold">
                Streak: {practiceStreak} 🔥
              </span>
              <button
                onClick={handleResetTrainer}
                className="px-2.5 py-1 rounded-lg bg-[#142033] hover:bg-[#1E2E48] text-slate-300 font-arcade text-[10px] cursor-pointer"
              >
                Reset Shoe
              </button>
            </div>
          </div>

          {/* Interactive Card Stage */}
          <div className="p-5 rounded-3xl bg-gradient-to-b from-[#06180E] via-[#04100A] to-[#020704] border-2 border-emerald-600/40 flex flex-col items-center justify-center space-y-4 shadow-xl">
            <span className="text-[11px] font-arcade text-emerald-300 uppercase tracking-widest">
              WHAT IS THE HI-LO VALUE OF THIS CARD?
            </span>

            {/* Center Card with Figures (J, Q, K, A) */}
            <div className="animate-deal-card">
              <PlayingCard
                rank={currentCard.rank}
                suit={currentCard.suit}
                size="lg"
              />
            </div>

            {/* Answer Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTagChoice(+1)}
                disabled={userTagGuess !== null}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-arcade font-bold text-sm tracking-wider shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>+1</span>
                <span className="text-[10px] font-mono-telemetry font-normal opacity-90">(Low 2-6)</span>
              </button>

              <button
                onClick={() => handleTagChoice(0)}
                disabled={userTagGuess !== null}
                className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-arcade font-bold text-sm tracking-wider shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>0</span>
                <span className="text-[10px] font-mono-telemetry font-normal opacity-90">(Neutral 7-9)</span>
              </button>

              <button
                onClick={() => handleTagChoice(-1)}
                disabled={userTagGuess !== null}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-arcade font-bold text-sm tracking-wider shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>-1</span>
                <span className="text-[10px] font-mono-telemetry font-normal opacity-90">(High 10-A)</span>
              </button>
            </div>

            {/* Feedback Message */}
            {feedback && (
              <div
                className={`py-1.5 px-3.5 rounded-xl font-arcade text-xs text-center animate-fade-in ${
                  feedback.isCorrect
                    ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                    : 'bg-rose-950/90 text-rose-300 border border-rose-500/50'
                }`}
              >
                {feedback.text}
              </div>
            )}
          </div>

          {/* Decks Remaining Estimator */}
          <div className="p-3 rounded-2xl bg-[#0A1220] border border-[#1E2E48] space-y-1.5">
            <div className="flex items-center justify-between text-slate-300 font-mono-telemetry text-xs">
              <span>Decks remaining in shoe: <strong>{decksRemaining} decks</strong></span>
              <span className="text-amber-400 font-bold">True Count = {computedTrueCount}</span>
            </div>
            <div className="flex items-center gap-2">
              {[5.0, 4.0, 3.0, 2.0, 1.0, 0.5].map(d => (
                <button
                  key={d}
                  onClick={() => setDecksRemaining(d)}
                  className={`flex-1 py-1 rounded-lg text-xs font-mono-telemetry font-bold transition-all cursor-pointer ${
                    decksRemaining === d
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'bg-[#142033] text-slate-400 hover:text-white'
                  }`}
                >
                  {d}D
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
