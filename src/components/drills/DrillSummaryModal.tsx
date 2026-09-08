import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronRight,
  Coins,
  DollarSign,
  Flame,
  RotateCcw,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
  X,
  Zap
} from 'lucide-react';
import { SessionSummaryData, DrillGameMode } from '../../types/drillTypes';
import { sounds } from '../../utils/soundEffects';

interface DrillSummaryModalProps {
  isOpen: boolean;
  summary: SessionSummaryData | null;
  onRestart: () => void;
  onClose: () => void;
  onNavigateTab?: (tabId: string) => void;
}

export const DrillSummaryModal: React.FC<DrillSummaryModalProps> = ({
  isOpen,
  summary,
  onRestart,
  onClose,
  onNavigateTab
}) => {
  const [filterGame, setFilterGame] = useState<'ALL' | DrillGameMode>('ALL');

  useEffect(() => {
    if (isOpen && summary) {
      if (summary.isBusted) {
        sounds.playGameOver();
      } else {
        sounds.playCashOut();
      }
    }
  }, [isOpen, summary]);

  if (!isOpen || !summary) return null;

  const isProfit = summary.netCredits >= 0;
  const roiPct = summary.initialCredits > 0
    ? ((summary.netCredits / summary.initialCredits) * 100).toFixed(1)
    : '0';

  const filteredMistakes = filterGame === 'ALL'
    ? summary.mistakes
    : summary.mistakes.filter(m => m.game === filterGame);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-fade-in font-sans-arcade"
    >
      <div className="relative w-full max-w-2xl my-auto rounded-3xl bg-gradient-to-b from-[#131A29] via-[#0E1522] to-[#080D16] border-2 border-[#263750] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button Top Right */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#141F33] hover:bg-[#1E2F4C] border border-[#2D3F5E] text-slate-400 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95 z-10"
          title="Close summary"
        >
          <X className="w-4 h-4" />
        </button>
        {/* Banner Header */}
        <div className={`p-4 rounded-2xl border-2 text-center space-y-1.5 ${
          summary.isBusted
            ? 'bg-gradient-to-b from-[#250D12] to-[#140609] border-rose-500/70 shadow-lg shadow-rose-950/50'
            : isProfit
            ? 'bg-gradient-to-b from-[#0B2516] to-[#06140B] border-emerald-500/70 shadow-lg shadow-emerald-950/50'
            : 'bg-gradient-to-b from-[#1F1C0D] to-[#121006] border-amber-500/70 shadow-lg shadow-amber-950/50'
        }`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-arcade font-bold uppercase tracking-wider bg-black/40 border border-white/10">
            {summary.isBusted ? (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="text-rose-300">BANKROLL DEPLETED - BUSTED!</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">DRILL CASHED OUT SECURELY</span>
              </>
            )}
          </div>

          <div className="py-1">
            <h2 className="text-2xl sm:text-3xl font-black font-mono-telemetry tracking-wide text-white">
              {summary.netCredits >= 0 ? `+${summary.netCredits.toLocaleString()}` : summary.netCredits.toLocaleString()}{' '}
              <span className="text-lg text-amber-300">CREDITS</span>
            </h2>
            <div className="flex items-center justify-center gap-3 text-xs font-mono-telemetry mt-1 text-slate-300">
              <span>Start: {summary.initialCredits.toLocaleString()}</span>
              <span>→</span>
              <span>End: {summary.finalCredits.toLocaleString()}</span>
              <span className={`px-2 py-0.5 rounded font-bold ${
                isProfit ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {isProfit ? `+${roiPct}% ROI` : `${roiPct}% ROI`}
              </span>
            </div>
          </div>

          {/* Skill Grade Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 border border-amber-500/30">
            <span className="text-xs text-slate-400 font-arcade">PERFORMANCE TIER:</span>
            <span className={`font-mono-telemetry font-black text-sm px-2 py-0.5 rounded ${summary.skillRank.badgeColor}`}>
              {summary.skillRank.grade} • {summary.skillRank.title}
            </span>
          </div>
        </div>

        {/* Highlight Cards: Where He Lost The Most & Where He Won The Most */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Where Lost The Most */}
          <div className="p-3.5 rounded-2xl bg-[#1C0D11] border-2 border-rose-500/40 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-arcade text-rose-300">
              <span className="flex items-center gap-1.5 font-bold">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                WHERE YOU LOST THE MOST
              </span>
              {summary.worstLeakGame && (
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30 text-[10px]">
                  {summary.worstLeakGame}
                </span>
              )}
            </div>

            {summary.worstSingleMistake ? (
              <div className="text-xs space-y-1">
                <p className="text-white font-bold font-arcade">
                  {summary.worstSingleMistake.scenarioName}
                </p>
                <div className="text-[11px] font-mono-telemetry text-rose-300">
                  Cost: <strong>-{summary.worstSingleMistake.creditsLost} credits</strong> | Action: {summary.worstSingleMistake.userDecision} (Expected: {summary.worstSingleMistake.expectedDecision})
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {summary.worstSingleMistake.explanation}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Zero critical mistakes recorded! You navigated all drill scenarios accurately without major leaks.
              </p>
            )}
          </div>

          {/* Where Won The Most */}
          <div className="p-3.5 rounded-2xl bg-[#0B1E13] border-2 border-emerald-500/40 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-arcade text-emerald-300">
              <span className="flex items-center gap-1.5 font-bold">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                WHERE YOU WON THE MOST
              </span>
              {summary.mostProfitableGame && (
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px]">
                  {summary.mostProfitableGame}
                </span>
              )}
            </div>

            {summary.earnings.length > 0 ? (
              <div className="text-xs space-y-1">
                <p className="text-white font-bold font-arcade">
                  {summary.earnings[0].scenarioName}
                </p>
                <div className="text-[11px] font-mono-telemetry text-emerald-300">
                  Payout: <strong>+{summary.earnings[0].creditsWon} credits</strong>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {summary.earnings[0].reason}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                No winning hands or spins locked in this run. Re-enter and capitalize on positive EV edges!
              </p>
            )}
          </div>
        </div>

        {/* Game By Game Ledger Breakdown */}
        <div className="p-3.5 rounded-2xl bg-[#0A101C] border border-[#1E2E48] space-y-2">
          <span className="text-xs font-arcade text-slate-300 uppercase tracking-wide block">
            GAME-BY-GAME PERFORMANCE TELEMETRY
          </span>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {(['BLACKJACK', 'SLOTS', 'POKER'] as DrillGameMode[]).map(game => {
              const m = summary.gameMetrics[game];
              const net = m.creditsWon - m.creditsLost;
              return (
                <div key={game} className="p-2.5 rounded-xl bg-[#121A2A] border border-[#23334E] space-y-1">
                  <span className="text-[10px] font-arcade text-slate-400 block">{game}</span>
                  <div className={`font-mono-telemetry font-bold text-sm ${
                    net >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {net >= 0 ? `+${net}` : net} CR
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono-telemetry">
                    Won: +{m.creditsWon} | Lost: -{m.creditsLost}
                  </div>
                  <div className="text-[9px] text-slate-500 font-arcade">
                    {m.handsPlayed} rounds • {m.handsPlayed > 0 ? Math.round((m.correctDecisions / m.handsPlayed) * 100) : 0}% acc
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Itemized Mistakes Autopsy List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-arcade text-slate-300 uppercase flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              MISTAKES AUTOPSY ({summary.mistakes.length} LEAKS DETECTED)
            </span>

            <div className="flex items-center gap-1">
              {(['ALL', 'BLACKJACK', 'SLOTS', 'POKER'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilterGame(f)}
                  className={`px-2 py-0.5 rounded text-[10px] font-arcade transition-all cursor-pointer ${
                    filterGame === f
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-[#121A28] text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {filteredMistakes.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#091512] border border-emerald-500/30 text-center text-xs text-emerald-300 font-arcade">
                ✨ No mistakes recorded in this category! Pristine tactical execution.
              </div>
            ) : (
              filteredMistakes.map(m => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-[#140C12] border border-rose-500/30 text-xs space-y-1 hover:border-rose-500/60 transition-all"
                >
                  <div className="flex items-center justify-between font-arcade">
                    <span className="text-white font-bold">{m.scenarioName}</span>
                    <span className="text-rose-400 font-mono-telemetry font-bold">
                      -{m.creditsLost} CR
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono-telemetry text-slate-300">
                    <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
                      Your Action: {m.userDecision}
                    </span>
                    <span>→</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      GTO Optimal: {m.expectedDecision}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-0.5">
                    {m.explanation}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 border-t border-[#233148]">
          <button
            onClick={onRestart}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-arcade font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-98 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            START NEW DRILL SESSION
          </button>

          {!summary.isBusted ? (
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-[#172236] hover:bg-[#202E48] text-slate-300 hover:text-white border border-[#2D3F5E] font-arcade font-bold text-xs tracking-wider cursor-pointer active:scale-98"
            >
              RESUME PLAY
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-2xl bg-[#172236] hover:bg-[#202E48] text-slate-300 hover:text-white border border-[#2D3F5E] font-arcade font-bold text-xs tracking-wider cursor-pointer active:scale-98"
            >
              CLOSE AUTOPSY
            </button>
          )}

          {onNavigateTab && (
            <button
              onClick={() => {
                onClose();
                onNavigateTab('command-center');
              }}
              className="px-4 py-3 rounded-2xl bg-[#181528] hover:bg-[#251E3E] text-purple-300 hover:text-purple-200 border border-purple-500/30 font-arcade font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              HUB
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
