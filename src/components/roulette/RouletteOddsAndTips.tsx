import React, { useState } from 'react';
import {
  RouletteVariant,
  RouletteBet,
  RoulettePocket,
  RED_NUMBERS
} from '../../utils/rouletteEngine';
import { sounds } from '../../utils/soundEffects';
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Coins,
  Dices,
  HelpCircle,
  Info,
  Lightbulb,
  Percent,
  PieChart,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap
} from 'lucide-react';

interface RouletteOddsAndTipsProps {
  variant: RouletteVariant;
  bets: RouletteBet[];
}

interface BetOddsRow {
  name: string;
  type: string;
  numbersCovered: number;
  payout: string;
  payoutRatio: number;
  euChance: number; // percentage e.g. 48.65
  usChance: number; // percentage e.g. 47.37
  houseEdgeEU: number;
  houseEdgeUS: number;
  example: string;
}

const ODDS_REFERENCE_DATA: BetOddsRow[] = [
  {
    name: 'Even-Money (Red / Black, Even / Odd, 1-18 / 19-36)',
    type: 'Outside',
    numbersCovered: 18,
    payout: '1 to 1',
    payoutRatio: 1,
    euChance: (18 / 37) * 100, // 48.65%
    usChance: (18 / 38) * 100, // 47.37%
    houseEdgeEU: 2.70, // 1.35% with French La Partage
    houseEdgeUS: 5.26,
    example: 'Red, Black, Even, Odd, Low (1-18), High (19-36)'
  },
  {
    name: 'Dozens & Columns',
    type: 'Outside',
    numbersCovered: 12,
    payout: '2 to 1',
    payoutRatio: 2,
    euChance: (12 / 37) * 100, // 32.43%
    usChance: (12 / 38) * 100, // 31.58%
    houseEdgeEU: 2.70,
    houseEdgeUS: 5.26,
    example: '1st 12 (1-12), 2nd 12 (13-24), 3rd 12 (25-36), 2to1 Columns'
  },
  {
    name: 'Six Line (Double Street)',
    type: 'Inside',
    numbersCovered: 6,
    payout: '5 to 1',
    payoutRatio: 5,
    euChance: (6 / 37) * 100, // 16.22%
    usChance: (6 / 38) * 100, // 15.79%
    houseEdgeEU: 2.70,
    houseEdgeUS: 5.26,
    example: 'Any 6 consecutive numbers (e.g. 1 through 6, 19 through 24)'
  },
  {
    name: 'First Five / Basket (US Only)',
    type: 'Inside',
    numbersCovered: 5,
    payout: '6 to 1',
    payoutRatio: 6,
    euChance: 0, // Not applicable on single zero
    usChance: (5 / 38) * 100, // 13.16%
    houseEdgeEU: 0,
    houseEdgeUS: 7.89, // Worst bet in casino!
    example: 'Pockets 0, 00, 1, 2, 3 (The Sucker Bet)'
  },
  {
    name: 'Corner / Square (Carré)',
    type: 'Inside',
    numbersCovered: 4,
    payout: '8 to 1',
    payoutRatio: 8,
    euChance: (4 / 37) * 100, // 10.81%
    usChance: (4 / 38) * 100, // 10.53%
    houseEdgeEU: 2.70,
    houseEdgeUS: 5.26,
    example: 'Intersection of 4 numbers (e.g. 16, 17, 19, 20)'
  },
  {
    name: 'Street / Trio (Transversale)',
    type: 'Inside',
    numbersCovered: 3,
    payout: '11 to 1',
    payoutRatio: 11,
    euChance: (3 / 37) * 100, // 8.11%
    usChance: (3 / 38) * 100, // 7.89%
    houseEdgeEU: 2.70,
    houseEdgeUS: 5.26,
    example: 'Any horizontal row of 3 (e.g. 1-2-3 or 10-11-12)'
  },
  {
    name: 'Split (Cheval)',
    type: 'Inside',
    numbersCovered: 2,
    payout: '17 to 1',
    payoutRatio: 17,
    euChance: (2 / 37) * 100, // 5.41%
    usChance: (2 / 38) * 100, // 5.26%
    houseEdgeEU: 2.70,
    houseEdgeUS: 5.26,
    example: 'Line between any two adjacent numbers (e.g. 17 & 20)'
  },
  {
    name: 'Straight-Up (En Plein)',
    type: 'Inside',
    numbersCovered: 1,
    payout: '35 to 1',
    payoutRatio: 35,
    euChance: (1 / 37) * 100, // 2.70%
    usChance: (1 / 38) * 100, // 2.63%
    houseEdgeEU: 2.70,
    houseEdgeUS: 5.26,
    example: 'Any single number from 0 to 36 (or 00)'
  }
];

export const RouletteOddsAndTips: React.FC<RouletteOddsAndTipsProps> = ({
  variant,
  bets
}) => {
  const [showMatrix, setShowMatrix] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);

  const totalPockets = variant === 'AMERICAN' ? 38 : 37;

  // Compute union of covered pockets across all placed bets
  const coveredSet = new Set<RoulettePocket>();
  let totalWager = 0;

  bets.forEach(b => {
    totalWager += b.amount;
    b.coveredNumbers.forEach(n => coveredSet.add(n));
  });

  const coveredCount = coveredSet.size;
  const winProbability = totalPockets > 0 ? (coveredCount / totalPockets) * 100 : 0;
  const coveragePercent = totalPockets > 0 ? (coveredCount / totalPockets) * 100 : 0;

  // Calculate Best-case potential payout and Expected Value
  const allWheelPockets: RoulettePocket[] =
    variant === 'AMERICAN'
      ? [0, '00', ...Array.from({ length: 36 }, (_, i) => i + 1)]
      : [0, ...Array.from({ length: 36 }, (_, i) => i + 1)];

  let maxNetProfit = totalWager > 0 ? -totalWager : 0;
  let sumNetProfitAcrossPockets = 0;

  if (bets.length > 0) {
    allWheelPockets.forEach(pocket => {
      let pocketPayout = 0;
      bets.forEach(bet => {
        if (bet.coveredNumbers.includes(pocket)) {
          pocketPayout += bet.amount + bet.amount * bet.payoutRatio;
        } else if (
          variant === 'FRENCH' &&
          pocket === 0 &&
          ['RED', 'BLACK', 'EVEN', 'ODD', 'LOW', 'HIGH'].includes(bet.type)
        ) {
          pocketPayout += Math.floor(bet.amount * 0.5);
        }
      });
      const net = pocketPayout - totalWager;
      if (net > maxNetProfit) {
        maxNetProfit = net;
      }
      sumNetProfitAcrossPockets += net;
    });
  }

  const expectedValuePerSpin =
    bets.length > 0 ? sumNetProfitAcrossPockets / totalPockets : 0;
  const overallHouseEdgePct =
    totalWager > 0
      ? (Math.abs(expectedValuePerSpin) / totalWager) * 100
      : variant === 'AMERICAN'
      ? 5.26
      : variant === 'FRENCH'
      ? 1.35
      : 2.70;

  // Dynamic Contextual Pro Tips
  const getContextualTips = () => {
    const tips: { title: string; text: string; icon: string; badge: string; color: string }[] = [];

    // 1. Variant tip
    if (variant === 'AMERICAN') {
      tips.push({
        title: 'American Double-Zero Penalty',
        text: 'The extra "00" pocket nearly doubles the casino house edge from 2.70% to 5.26% without increasing single-number payouts (both pay 35:1). Whenever possible, switch to European or French roulette!',
        icon: '⚠️',
        badge: '5.26% House Edge',
        color: 'border-rose-500/40 bg-rose-950/20 text-rose-200'
      });
    } else if (variant === 'FRENCH') {
      tips.push({
        title: 'French "La Partage" Advantage',
        text: 'When betting even-money propositions (Red, Black, Even, Odd, 1-18, 19-36), landing on 0 triggers a 50% refund on your stake! This cuts the house edge in half to just 1.35%, the best odds in roulette.',
        icon: '🛡️',
        badge: '1.35% House Edge',
        color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
      });
    } else {
      tips.push({
        title: 'European Single-Zero Baseline',
        text: 'Single-zero European roulette features 37 pockets with a fixed 2.70% house edge across all standard bets. This is significantly more player-friendly than American wheels (5.26%).',
        icon: '✨',
        badge: '2.70% House Edge',
        color: 'border-sky-500/40 bg-sky-950/20 text-sky-200'
      });
    }

    // 2. Bet-specific analysis
    const hasRed = bets.some(b => b.type === 'RED');
    const hasBlack = bets.some(b => b.type === 'BLACK');
    const hasBasket = bets.some(b => b.type === 'BASKET');
    const dozenBets = bets.filter(b => b.type === 'DOZEN');
    const straightBets = bets.filter(b => b.type === 'STRAIGHT_UP');

    if (hasBasket && variant === 'AMERICAN') {
      tips.push({
        title: 'Critical Warning: 5-Number Basket Bet',
        text: 'The 0-00-1-2-3 basket bet is mathematically the worst bet in the entire casino! It carries a punitive 7.89% house edge because it only pays 6:1 on a 5-in-38 probability (true odds 6.6:1). Never place this bet.',
        icon: '🚨',
        badge: '7.89% Toxic Edge',
        color: 'border-red-500/60 bg-red-950/40 text-red-200 font-bold'
      });
    }

    if (hasRed && hasBlack) {
      tips.push({
        title: 'Hedging Fallacy (Red + Black)',
        text: 'Betting both Red and Black does not lower your risk or generate a winning edge. When the ball lands on 0 (or 00), you lose BOTH bets. You pay the house edge twice without any upside.',
        icon: '⚠️',
        badge: 'Hedging Trap',
        color: 'border-amber-500/40 bg-amber-950/20 text-amber-200'
      });
    }

    if (dozenBets.length === 2) {
      tips.push({
        title: '2-Dozen Coverage Strategy',
        text: 'Covering 2 Dozens (or 2 Columns) hits 24 of 37 pockets (64.86% win chance). A winning spin nets +1 unit profit (pays 2:1 on the winner minus 1 unit lost on the other). However, a miss on the 3rd dozen or zero loses both units (-2 units).',
        icon: '📐',
        badge: '64.9% Coverage',
        color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-200'
      });
    }

    if (straightBets.length > 0 && dozenBets.length === 0 && !hasRed && !hasBlack) {
      tips.push({
        title: 'Straight-Up High Volatility Notice',
        text: 'Single number straight-up bets offer the highest rush (35:1 payout) but have only a 2.70% hit chance (1 in 37). You will routinely experience 50+ spin dry spells. Ensure your bankroll has 100+ betting units.',
        icon: '🎯',
        badge: 'High Variance (35:1)',
        color: 'border-purple-500/40 bg-purple-950/20 text-purple-200'
      });
    }

    if (bets.length === 0) {
      tips.push({
        title: 'Pro Starting Advice: Outside Bets for Longevity',
        text: 'To protect your bankroll and practice disciplined advantage play, start with Outside Bets (Red/Black, Odd/Even, 1-18/19-36). They yield a 48.65% win probability (EU) with 1:1 payouts and smooth variance.',
        icon: '💡',
        badge: 'Bankroll Preservation',
        color: 'border-teal-500/40 bg-teal-950/20 text-teal-200'
      });
    }

    return tips;
  };

  const currentTips = getContextualTips();

  return (
    <div className="space-y-3 font-sans-arcade">
      {/* Live Chances of Winning & Expected Value Card */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-b from-[#0F1726] to-[#090E17] border-2 border-[#22334D] shadow-xl space-y-3">
        {/* Header Title with quick toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white font-arcade uppercase tracking-wider flex items-center gap-1.5">
                Chances of Winning & Table Odds
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-telemetry border border-emerald-500/40">
                  LIVE CALCULATOR
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Calculated dynamically across active bets on the {variant.toLowerCase()} cylinder
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sounds.playClick();
                setShowMatrix(!showMatrix);
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-arcade font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                showMatrix
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                  : 'bg-[#152033] hover:bg-[#1E2E48] text-amber-300 border-amber-500/30'
              }`}
            >
              <Dices className="w-3.5 h-3.5" />
              <span>{showMatrix ? 'Hide Odds Matrix' : 'View All Odds Matrix'}</span>
              {showMatrix ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setShowRules(!showRules);
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-arcade font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                showRules
                  ? 'bg-sky-400 text-slate-950 border-sky-300 shadow-sm'
                  : 'bg-[#152033] hover:bg-[#1E2E48] text-sky-300 border-sky-500/30'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showRules ? 'Hide Rules' : 'Advantage Rules'}</span>
              {showRules ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Real-time Math Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Chance of Winning on This Spin */}
          <div className="p-2.5 rounded-2xl bg-[#09111D] border border-[#1C2C44] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-arcade uppercase tracking-wider block">
              SPIN WIN CHANCE
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono-telemetry text-emerald-400">
              {winProbability.toFixed(1)}%
            </div>
            <span className="text-[10px] text-slate-400 font-mono-telemetry">
              {coveredCount} of {totalPockets} pockets covered
            </span>
          </div>

          {/* Wheel Coverage */}
          <div className="p-2.5 rounded-2xl bg-[#09111D] border border-[#1C2C44] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-arcade uppercase tracking-wider block">
              WHEEL COVERAGE
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono-telemetry text-amber-300">
              {coveragePercent.toFixed(1)}%
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
              <div
                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, coveragePercent)}%` }}
              />
            </div>
          </div>

          {/* Max Net Potential Payout */}
          <div className="p-2.5 rounded-2xl bg-[#09111D] border border-[#1C2C44] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-arcade uppercase tracking-wider block">
              MAX POTENTIAL WIN
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono-telemetry text-sky-400">
              {maxNetProfit > 0 ? `+$${maxNetProfit}` : `$${maxNetProfit}`}
            </div>
            <span className="text-[10px] text-slate-400 font-mono-telemetry">
              {totalWager > 0 ? `$${totalWager} staked at risk` : 'No wagers on table'}
            </span>
          </div>

          {/* Expected Value & House Edge */}
          <div className="p-2.5 rounded-2xl bg-[#09111D] border border-[#1C2C44] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-arcade uppercase tracking-wider block">
              HOUSE EDGE
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono-telemetry text-rose-400">
              {overallHouseEdgePct.toFixed(2)}%
            </div>
            <span className="text-[10px] text-slate-400 font-mono-telemetry">
              EV: {expectedValuePerSpin >= 0 ? `+$${expectedValuePerSpin.toFixed(2)}` : `-$${Math.abs(expectedValuePerSpin).toFixed(2)}`} / spin
            </span>
          </div>
        </div>

        {/* Contextual Smart Tips Stream */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-arcade">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>LIVE STRATEGY TIPS & INSIGHTS:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentTips.map((tip, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-xs space-y-1.5 transition-all ${tip.color}`}
              >
                <div className="flex items-center justify-between font-arcade font-bold">
                  <span className="flex items-center gap-1.5">
                    <span>{tip.icon}</span>
                    <span>{tip.title}</span>
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-black/40 font-mono-telemetry border border-white/10">
                    {tip.badge}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {tip.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Collapsible Section 1: Complete Chances of Winning Reference Matrix */}
        {showMatrix && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#070C16] border border-[#1A2840] space-y-3 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#1A2840] pb-2">
              <h4 className="text-xs font-arcade font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Dices className="w-4 h-4" />
                Complete Roulette Odds & Chances Reference Table
              </h4>
              <span className="text-[10px] text-slate-400 font-mono-telemetry">
                Standard Casino Rules
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-telemetry">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-arcade text-slate-400">
                    <th className="pb-2 pr-2">BET NAME</th>
                    <th className="pb-2 px-2 text-center">NUMBERS</th>
                    <th className="pb-2 px-2 text-center">PAYOUT</th>
                    <th className="pb-2 px-2 text-center text-emerald-300">
                      EUROPEAN WIN %
                    </th>
                    <th className="pb-2 px-2 text-center text-amber-300">
                      AMERICAN WIN %
                    </th>
                    <th className="pb-2 px-2 text-right">HOUSE EDGE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {ODDS_REFERENCE_DATA.map((row, i) => {
                    const isAmericanSpecific = row.numbersCovered === 5;
                    return (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 pr-2">
                          <span className="font-arcade text-slate-200 block text-xs">
                            {row.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-sans block">
                            {row.example}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-slate-300">
                          {row.numbersCovered}
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-amber-400">
                          {row.payout}
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-emerald-400">
                          {isAmericanSpecific ? 'N/A' : `${row.euChance.toFixed(2)}%`}
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-amber-300">
                          {row.usChance.toFixed(2)}%
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-rose-400">
                          {isAmericanSpecific
                            ? '7.89% (US)'
                            : `${row.houseEdgeEU.toFixed(2)}% (EU) / ${row.houseEdgeUS.toFixed(2)}% (US)`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-500 italic pt-1">
              * Note: On French Roulette wheels, even-money bets with La Partage carry only a 1.35% house edge because half the wager is refunded if 0 hits.
            </p>
          </div>
        )}

        {/* Collapsible Section 2: 4 Cardinal Mathematical Truths of Roulette */}
        {showRules && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#070C16] border border-[#1A2840] space-y-3 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#1A2840] pb-2">
              <h4 className="text-xs font-arcade font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                The 4 Cardinal Mathematical Laws of Roulette
              </h4>
              <span className="text-[10px] text-slate-400 font-mono-telemetry">
                Advantage Play Codex
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#0C1524] border border-[#1E2E48] space-y-1">
                <span className="font-arcade text-amber-300 font-bold block">
                  1. The Law of Independent Trials (No "Due" Spins)
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  The wheel and ball have no memory. Even after 10 consecutive Red spins, the probability of Red on the next spin remains identically 48.65% (EU) or 47.37% (US). Never bet larger assuming a streak is "due" to snap.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0C1524] border border-[#1E2E48] space-y-1">
                <span className="font-arcade text-rose-300 font-bold block">
                  2. Betting Systems Never Beat the House Edge
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Progression systems like Martingale (doubling after losses), D'Alembert, or Fibonacci merely alter the variance profile. They produce frequent tiny wins while exposing the player to catastrophic wipeout when table maximums are reached.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0C1524] border border-[#1E2E48] space-y-1">
                <span className="font-arcade text-emerald-300 font-bold block">
                  3. Always Favor Single-Zero & French Rules
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Switching from American to European cuts the casino profit in half (5.26% down to 2.70%). Playing French roulette with La Partage cuts it further to 1.35% on even-money bets, maximizing expected player bankroll longevity.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0C1524] border border-[#1E2E48] space-y-1">
                <span className="font-arcade text-purple-300 font-bold block">
                  4. Kelly Criterion & Bankroll Preservation
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Because standard roulette has a negative expectation, optimal mathematical bet sizing advises keeping individual wagers under 1-2% of total session bankroll, avoiding high-house-edge traps like the 5-number basket (7.89%).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
