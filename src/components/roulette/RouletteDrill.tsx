import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  ChevronRight,
  Flame,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Timer,
  Trophy,
  Zap
} from 'lucide-react';

export interface RouletteDrillScenario {
  id: string;
  title: string;
  category: 'PAYOUT_MATH' | 'HOUSE_EDGE' | 'FALLACY_TRAPS' | 'ADVANTAGE_PLAY';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  ruleTag: string;
}

const DRILL_SCENARIOS: RouletteDrillScenario[] = [
  {
    id: 'rd-1-corner-payout',
    title: 'Corner Bet Payout Calculation',
    category: 'PAYOUT_MATH',
    question:
      'You place a $15 bet on a 4-number Corner (Square). The ball lands on one of your numbers. What is the total cash returned to you (profit + stake)?',
    options: [
      '$120 (profit only)',
      '$135 ($120 profit + $15 stake)',
      '$150 ($135 profit + $15 stake)',
      '$90 (6 to 1 ratio)'
    ],
    correctIndex: 1,
    explanation:
      'A Corner bet pays 8 to 1. The profit is 8 × $15 = $120. When paid, your original $15 wager is also returned, yielding a total return of $135 ($120 profit + $15 original).',
    ruleTag: 'CORNER 8:1'
  },
  {
    id: 'rd-2-basket-trap',
    title: 'The Deadliest Roulette Bet',
    category: 'HOUSE_EDGE',
    question:
      'Which of the following roulette wagers carries the absolute worst mathematical house edge in a casino?',
    options: [
      'European Straight Up (2.70%)',
      'American Red or Black (5.26%)',
      'American 5-Number Basket Bet on 0-00-1-2-3 (7.89%)',
      'French 1st Dozen (2.70%)'
    ],
    correctIndex: 2,
    explanation:
      'The American 5-number "Basket Bet" (0, 00, 1, 2, 3) pays 6 to 1. The expected return is (5/38 × 7) - 1 = -0.0789 or 7.89% house edge! It is the only bet in roulette that deviates from the standard wheel edge.',
    ruleTag: 'BASKET 7.89%'
  },
  {
    id: 'rd-3-fallacy-streak',
    title: 'The Monte Carlo Fallacy',
    category: 'FALLACY_TRAPS',
    question:
      'On a fair European roulette wheel, the ball has landed on BLACK 8 consecutive times. What is the probability that RED hits on the 9th spin?',
    options: [
      'Over 80% because Red is overdue',
      'Exactly 48.65% (18/37)',
      'Exactly 50.00%',
      'Under 20% because Black is on a hot streak'
    ],
    correctIndex: 1,
    explanation:
      'The wheel has no memory. Past independent trials cannot physically influence future mechanical spins. P(Red) remains 18/37 = 48.65%. Believing Red is "due" is the classic Gambler’s Fallacy.',
    ruleTag: 'MEMORYLESS'
  },
  {
    id: 'rd-4-la-partage',
    title: 'French Roulette La Partage Advantage',
    category: 'ADVANTAGE_PLAY',
    question:
      'You wager $100 on Even. The ball lands on green zero (0) at a French roulette table featuring the "La Partage" rule. What happens to your bet?',
    options: [
      'You lose the entire $100 wager',
      'You receive a $50 refund (50% returned)',
      'The bet is imprisoned for 3 spins',
      'The house pays you 1:1 automatically'
    ],
    correctIndex: 1,
    explanation:
      'Under La Partage, whenever Zero hits, players with active even-money bets receive a 50% refund ($50). This cuts the house edge from 2.70% to 1.35%, making French Roulette the most player-favorable variant.',
    ruleTag: 'LA PARTAGE 1.35%'
  },
  {
    id: 'rd-5-martingale-tail-risk',
    title: 'Martingale Exponential Explosion',
    category: 'FALLACY_TRAPS',
    question:
      'A player uses the Martingale system, starting with a $10 base bet on Red. After losing 6 consecutive spins, how much must they wager on the 7th spin?',
    options: ['$70', '$320', '$640', '$1,280'],
    correctIndex: 2,
    explanation:
      'Martingale doubles every loss: Spin 1: $10 (L) -> Spin 2: $20 (L) -> Spin 3: $40 (L) -> Spin 4: $80 (L) -> Spin 5: $160 (L) -> Spin 6: $320 (L) -> Spin 7 requires $640! All this risk just to win a measly $10 profit.',
    ruleTag: 'MARTINGALE'
  },
  {
    id: 'rd-6-split-payout',
    title: 'Split Bet Profit Calculation',
    category: 'PAYOUT_MATH',
    question:
      'You place a $25 Split bet on numbers 17 & 20. Number 17 hits. What is your net profit (excluding the returned original stake)?',
    options: ['$425', '$375', '$875', '$200'],
    correctIndex: 0,
    explanation:
      'A Split bet covers 2 adjacent numbers and pays 17 to 1. The net profit is 17 × $25 = $425 (plus the original $25 wager returned for a total of $450).',
    ruleTag: 'SPLIT 17:1'
  },
  {
    id: 'rd-7-street-coverage',
    title: 'Street Bet Geometry & Odds',
    category: 'PAYOUT_MATH',
    question:
      'How many numbers are covered by a Street bet (horizontal row across the felt), and what are its payout odds?',
    options: [
      '3 numbers, paying 11 to 1',
      '6 numbers, paying 5 to 1',
      '4 numbers, paying 8 to 1',
      '2 numbers, paying 17 to 1'
    ],
    correctIndex: 0,
    explanation:
      'A Street bet covers a 3-number horizontal row (e.g. 1-2-3 or 10-11-12) and pays 11 to 1 (win probability is 3/37 = 8.11% in European).',
    ruleTag: 'STREET 11:1'
  },
  {
    id: 'rd-8-table-limits',
    title: 'The Purpose of Table Limits',
    category: 'HOUSE_EDGE',
    question:
      'Why do casino table limits (e.g. $10 min / $1,000 max) exist on roulette games?',
    options: [
      'To prevent card counters from joining',
      'To cap player variance and neutralize progressive doubling systems',
      'To adhere to state currency restrictions',
      'Because wheel dealers cannot count chips above $1,000'
    ],
    correctIndex: 1,
    explanation:
      'Table limits exist to protect the casino from massive single-spin liability and to cap progression systems like Martingale, ensuring players cannot double their bets indefinitely after loss streaks.',
    ruleTag: 'TABLE LIMITS'
  }
];

export const RouletteDrill: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(15);
  const [timerActive, setTimerActive] = useState<boolean>(true);

  const scenario = DRILL_SCENARIOS[currentIdx];

  // 15-second countdown per question
  useEffect(() => {
    if (!timerActive || selectedOption !== null) return;

    if (timerSeconds <= 0) {
      // Time expired counts as missed
      handleOptionSelect(-1);
      return;
    }

    const t = setInterval(() => {
      setTimerSeconds(s => s - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [timerSeconds, timerActive, selectedOption]);

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setTimerActive(false);
    setAnsweredCount(c => c + 1);

    const isCorrect = idx === scenario.correctIndex;
    if (isCorrect) {
      sounds.playWin();
      setScore(s => s + 100 + streak * 20);
      setStreak(s => s + 1);
    } else {
      sounds.playLoss();
      setStreak(0);
    }
  };

  const handleNext = () => {
    sounds.playClick();
    setSelectedOption(null);
    setTimerSeconds(15);
    setTimerActive(true);
    setCurrentIdx(i => (i + 1) % DRILL_SCENARIOS.length);
  };

  const handleReset = () => {
    sounds.playClick();
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setStreak(0);
    setAnsweredCount(0);
    setTimerSeconds(15);
    setTimerActive(true);
  };

  return (
    <div className="space-y-4 font-sans-arcade">
      {/* Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#0A101C] border border-[#202E46] text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-arcade text-[10px] font-bold border border-amber-500/30">
            QUESTION {currentIdx + 1} / {DRILL_SCENARIOS.length}
          </span>
          <span className="text-slate-300 font-arcade text-xs font-bold">
            {scenario.title}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono-telemetry">
          <div className="flex items-center gap-1">
            <Timer className={`w-3.5 h-3.5 ${timerSeconds <= 5 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
            <span className={`font-bold ${timerSeconds <= 5 ? 'text-rose-400' : 'text-slate-200'}`}>
              {timerSeconds}s
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-orange-400 font-bold">{streak}X</span>
          </div>

          <div className="flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400 font-bold">{score} PTS</span>
          </div>
        </div>
      </div>

      {/* Drill Question Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#101827] to-[#0A0F1A] border-2 border-[#20304E] shadow-2xl space-y-4">
        {/* Category & Badge */}
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-arcade bg-sky-500/20 text-sky-300 border border-sky-500/30">
            {scenario.category.replace('_', ' ')}
          </span>
          <span className="text-[10px] font-mono-telemetry text-amber-300 font-bold bg-black/40 px-2 py-0.5 rounded border border-white/10">
            {scenario.ruleTag}
          </span>
        </div>

        {/* The Question */}
        <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
          {scenario.question}
        </h3>

        {/* Multiple Choice Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {scenario.options.map((opt, idx) => {
            let btnStyle = 'bg-[#0E1729] hover:bg-[#15233D] border-[#223352] text-slate-200';

            if (selectedOption !== null) {
              if (idx === scenario.correctIndex) {
                btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/50';
              } else if (idx === selectedOption) {
                btnStyle = 'bg-rose-950/80 border-rose-400 text-rose-100 ring-2 ring-rose-400/50';
              } else {
                btnStyle = 'bg-[#0A101C] border-[#1C263A] text-slate-600 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={selectedOption !== null}
                className={`p-3 rounded-2xl border text-left font-mono-telemetry text-xs transition-all cursor-pointer shadow-sm active:scale-98 flex items-start gap-2.5 ${btnStyle}`}
              >
                <span className="w-5 h-5 rounded-full bg-black/40 border border-white/20 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Immediate Explanation Feedback Box */}
        {selectedOption !== null && (
          <div className={`p-4 rounded-2xl border-2 text-xs space-y-2 animate-fade-in ${
            selectedOption === scenario.correctIndex
              ? 'bg-[#071F14] border-emerald-500/60 text-emerald-100'
              : 'bg-[#210D12] border-rose-500/60 text-rose-100'
          }`}>
            <div className="flex items-center justify-between">
              <h4 className="font-arcade font-bold text-xs sm:text-sm flex items-center gap-1.5">
                {selectedOption === scenario.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>CORRECT! +100 PTS</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>INCORRECT OR TIMEOUT</span>
                  </>
                )}
              </h4>
              <span className="font-mono-telemetry font-bold text-[11px] px-2 py-0.5 rounded bg-black/30">
                Rule: {scenario.ruleTag}
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed text-xs">
              {scenario.explanation}
            </p>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-arcade font-bold text-xs tracking-wider flex items-center gap-1 shadow-md active:scale-95 cursor-pointer"
              >
                NEXT DRILL <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
