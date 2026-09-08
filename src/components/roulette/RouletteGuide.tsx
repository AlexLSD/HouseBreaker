import React from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Compass,
  FileText,
  Info,
  Layers,
  Percent,
  Shield,
  Sparkles,
  TrendingDown,
  Zap
} from 'lucide-react';

export const RouletteGuide: React.FC = () => {
  return (
    <div className="space-y-4 font-sans-arcade text-xs text-slate-300">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#121A2B] via-[#0E1524] to-[#0A0F1A] border-2 border-amber-500/30 shadow-xl space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-arcade text-[10px] font-bold border border-amber-500/40 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-amber-400" />
            ADVANTAGE PLAY STRATEGY CODEX
          </span>
          <span className="text-[10px] text-slate-400 font-mono-telemetry">
            MATHEMATICS, WHEEL BIAS & PROGRESSION DEBUNKING
          </span>
        </div>
        <h2 className="text-base font-bold text-white font-arcade">
          The Comprehensive Casino Roulette Advantage Guide
        </h2>
        <p className="text-slate-400 text-xs leading-relaxed">
          Detailed probability breakdowns, comparative house edge matrices, proof against the Gambler's Fallacy, and the only legitimate historical advantage play techniques.
        </p>
      </div>

      {/* Module 1: The Three Variants Compared */}
      <div className="p-4 rounded-2xl bg-[#0C121F] border border-[#1E2B44] space-y-3">
        <h3 className="font-arcade font-bold text-sm text-white flex items-center gap-2">
          <Percent className="w-4 h-4 text-emerald-400" />
          1. The House Edge Triad: European vs American vs French
        </h3>
        <p className="text-slate-300 leading-relaxed text-xs">
          Unlike blackjack, where player decisions alter the composition of remaining cards, every roulette spin is an independent random variable. The house edge originates entirely from the presence of green zero pockets paid at fair-odds minus the zero deduction:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-[#071F14] border border-emerald-500/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-arcade font-bold text-emerald-300 text-xs">French (La Partage)</span>
              <span className="font-mono-telemetry font-bold text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                1.35% EDGE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              37 pockets (Single 0). If the ball lands in Zero, all even-money bets (Red/Black, Even/Odd, High/Low) receive a 50% refund (<em className="text-emerald-300">La Partage</em>). Cuts standard European house edge exactly in half!
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#091526] border border-sky-500/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-arcade font-bold text-sky-300 text-xs">European Standard</span>
              <span className="font-mono-telemetry font-bold text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                2.70% EDGE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              37 pockets (Single 0). 1/37 = 2.7027%. Every single bet on the layout (Straight up, Split, Corner, Red, etc.) shares the exact same expected loss of -2.70% per wager.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#260D12] border border-rose-500/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-arcade font-bold text-rose-300 text-xs">American (0 & 00)</span>
              <span className="font-mono-telemetry font-bold text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                5.26% EDGE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              38 pockets (0 and 00). 2/38 = 5.263%. Almost double the house edge of European! Even worse: the American 5-number "Basket Bet" (0, 00, 1, 2, 3) carries a toxic <strong>7.89%</strong> house edge!
            </p>
          </div>
        </div>
      </div>

      {/* Module 2: Bet Types, True Odds & Payout Matrix */}
      <div className="p-4 rounded-2xl bg-[#0C121F] border border-[#1E2B44] space-y-3">
        <h3 className="font-arcade font-bold text-sm text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          2. Master Payout & True Probability Table (European)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono-telemetry text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-arcade text-[10px] uppercase">
                <th className="py-2 px-3">Bet Classification</th>
                <th className="py-2 px-3">Numbers Covered</th>
                <th className="py-2 px-3">Payout (Profit)</th>
                <th className="py-2 px-3">True Win Probability</th>
                <th className="py-2 px-3">House Edge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              <tr className="hover:bg-white/5">
                <td className="py-2 px-3 font-bold text-amber-300">Straight Up</td>
                <td className="py-2 px-3">1 number</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">35 to 1</td>
                <td className="py-2 px-3">2.70% (1 in 37)</td>
                <td className="py-2 px-3 text-rose-400">-2.70%</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-2 px-3 font-bold text-amber-300">Split</td>
                <td className="py-2 px-3">2 numbers</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">17 to 1</td>
                <td className="py-2 px-3">5.41% (2 in 37)</td>
                <td className="py-2 px-3 text-rose-400">-2.70%</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-2 px-3 font-bold text-amber-300">Street</td>
                <td className="py-2 px-3">3 numbers</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">11 to 1</td>
                <td className="py-2 px-3">8.11% (3 in 37)</td>
                <td className="py-2 px-3 text-rose-400">-2.70%</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-2 px-3 font-bold text-amber-300">Corner / Square</td>
                <td className="py-2 px-3">4 numbers</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">8 to 1</td>
                <td className="py-2 px-3">10.81% (4 in 37)</td>
                <td className="py-2 px-3 text-rose-400">-2.70%</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-2 px-3 font-bold text-amber-300">Six Line / Double Street</td>
                <td className="py-2 px-3">6 numbers</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">5 to 1</td>
                <td className="py-2 px-3">16.22% (6 in 37)</td>
                <td className="py-2 px-3 text-rose-400">-2.70%</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-2 px-3 font-bold text-amber-300">Dozen / Column</td>
                <td className="py-2 px-3">12 numbers</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">2 to 1</td>
                <td className="py-2 px-3">32.43% (12 in 37)</td>
                <td className="py-2 px-3 text-rose-400">-2.70%</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-2 px-3 font-bold text-amber-300">Even Money (Red/Black/Even)</td>
                <td className="py-2 px-3">18 numbers</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">1 to 1</td>
                <td className="py-2 px-3">48.65% (18 in 37)</td>
                <td className="py-2 px-3 text-emerald-300">-1.35% (FR) / -2.70% (EU)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Module 3: Debunking the Gambler's Fallacy */}
      <div className="p-4 rounded-2xl bg-[#0C121F] border border-[#1E2B44] space-y-2.5">
        <h3 className="font-arcade font-bold text-sm text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          3. Exposing the Gambler's Fallacy: The Roulette Wheel Has No Memory
        </h3>
        <p className="text-slate-300 leading-relaxed text-xs">
          On August 18, 1913, at the Casino de Monte-Carlo, the ball landed on <strong className="text-black bg-white/10 px-1 rounded">BLACK</strong> 26 times consecutively. Panicked gamblers lost millions wagering that Red was "overdue".
        </p>
        <div className="p-3 rounded-xl bg-[#1A1215] border border-rose-500/30 text-xs text-rose-200 space-y-1">
          <p className="font-bold">The Mathematical Proof:</p>
          <p className="font-mono text-[11px] text-slate-300">
            P(Red on Spin 27 | Black on spins 1..26) = P(Red) = 18/37 = 48.65%.
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            The wheel is an inanimate mechanical rotor. It does not know or care what happened on previous spins. Electronic scoreboard displays showing "Hot" and "Cold" numbers are marketed by casinos specifically to stimulate gambler's fallacy betting.
          </p>
        </div>
      </div>

      {/* Module 4: Real Advantage Play in Roulette */}
      <div className="p-4 rounded-2xl bg-[#0C121F] border border-[#1E2B44] space-y-3">
        <h3 className="font-arcade font-bold text-sm text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          4. Legitimate Historical Advantage Play: Physical Bias & Visual Ballistics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[#0A1524] border border-[#203352] space-y-1">
            <h4 className="font-arcade font-bold text-sky-300 text-xs">A. Physical Wheel Bias Clocking</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              In 1873, engineer Joseph Jagger hired 6 clerks to record every spin across 6 wheels at Monte Carlo. He identified one wheel with an uneven fret pocket bias, netting £65,000 (worth millions today). In the 1990s, Gonzalo Garcia-Pelayo clocked thousands of spins in Madrid, proving a 15% probability anomaly on specific sectors. Modern casinos combat this with Starburst frets, laser wheel calibration, and daily rotor rotation.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0A1524] border border-[#203352] space-y-1">
            <h4 className="font-arcade font-bold text-sky-300 text-xs">B. Visual Ballistics & Dealer Signature</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              In the 1970s, physics students (The Eudaemons) built a microcomputer concealed inside shoes to measure rotor velocity and ball deceleration via toe-switches, predicting the winning octant before "No more bets" was called. Today, computerized predictive devices are strictly illegal under felony gaming statutes in Nevada and Atlantic City.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
