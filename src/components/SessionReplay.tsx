import React, { useState } from 'react';
import { SessionHistoryItem } from '../types';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  DollarSign,
  Filter,
  History,
  Info,
  Layers,
  Sparkles,
  TrendingDown,
  XCircle
} from 'lucide-react';

const SAMPLE_SESSION_LOGS: SessionHistoryItem[] = [
  {
    id: 's1',
    timestamp: Date.now() - 1000 * 60 * 18,
    gameType: 'Blackjack (6-Deck S17)',
    decisionTaken: 'Hit 16 vs Dealer 10',
    optimalDecision: 'Stand (TC = +1.2)',
    evDelta: -0.05,
    errorCategory: 'Index Violation',
    notes: 'Failed to apply Illustrious 18 index. At TC ≥ 0, 16 vs 10 is a Stand.',
    wasOptimal: false
  },
  {
    id: 's2',
    timestamp: Date.now() - 1000 * 60 * 14,
    gameType: 'Texas Hold’em 6-Max',
    decisionTaken: 'Folded Turn to $40 Bet',
    optimalDecision: 'Call (Pot Odds 25%, Equity 32%)',
    evDelta: -1.20,
    errorCategory: 'MDF Over-Fold',
    notes: 'MDF required defending top 66.7% of range. Folded nut gutshot + 2 overcards.',
    wasOptimal: false
  },
  {
    id: 's3',
    timestamp: Date.now() - 1000 * 60 * 11,
    gameType: 'Blackjack (6-Deck S17)',
    decisionTaken: 'Double 11 vs Dealer Ace',
    optimalDecision: 'Double (TC = +1.8 ≥ +1)',
    evDelta: 0.0,
    errorCategory: 'None (Optimal)',
    notes: 'Flawless Illustrious 18 execution.',
    wasOptimal: true
  },
  {
    id: 's4',
    timestamp: Date.now() - 1000 * 60 * 8,
    gameType: 'Massive Grid Slots (40x40)',
    decisionTaken: 'Coin-In $200 at Meter $430 (Cap $500)',
    optimalDecision: 'Wait for Breakeven ($468.50)',
    evDelta: -24.00,
    errorCategory: 'Sub-Optimal MHB Slot Entry',
    notes: 'Entered MHB machine when current meter had not yet breached break-even threshold.',
    wasOptimal: false
  },
  {
    id: 's5',
    timestamp: Date.now() - 1000 * 60 * 4,
    gameType: 'Blackjack (6-Deck S17)',
    decisionTaken: 'Split 10s vs Dealer 5 at TC = +5.2',
    optimalDecision: 'Split 10s (TC ≥ +5)',
    evDelta: 0.0,
    errorCategory: 'None (Optimal)',
    notes: 'Bold and mathematically certified Illustrious 18 split.',
    wasOptimal: true
  },
  {
    id: 's6',
    timestamp: Date.now() - 1000 * 60 * 1,
    gameType: 'Blackjack (6-Deck S17)',
    decisionTaken: 'Wagered 1 Unit at TC = +4.0',
    optimalDecision: 'Wager 4 Units ($100)',
    evDelta: -0.75,
    errorCategory: 'Improper Bet Sizing',
    notes: 'Under-spread on high positive count. Missed Kelly allocation.',
    wasOptimal: false
  }
];

interface SessionReplayProps {
  onOpenGuide?: () => void;
}

export const SessionReplay: React.FC<SessionReplayProps> = ({ onOpenGuide }) => {
  const [selectedItem, setSelectedItem] = useState<SessionHistoryItem>(SAMPLE_SESSION_LOGS[0]);

  const totalEvLoss = SAMPLE_SESSION_LOGS.reduce((acc, curr) => acc + (curr.evDelta < 0 ? Math.abs(curr.evDelta) : 0), 0);
  const annualizedLoss = (totalEvLoss * 500).toFixed(2);

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans-arcade">
      {/* Top Arcade Marquee Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#121826] to-[#0F1420] border-2 border-[#2A3750] rounded-2xl p-3.5 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-arcade uppercase tracking-wider flex items-center gap-1.5">
              Live Session Replay & Leak Auditor
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-telemetry border border-amber-500/40">
                AUDIT LOG
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Chronological round-by-round replay, decision scrutiny, and annual bankroll leak cost
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#141F33] hover:bg-[#1E2F4C] border border-sky-500/40 text-sky-300 hover:text-white text-xs font-arcade transition-all cursor-pointer shadow-sm active:scale-95"
              title="Explain Leak Scrubber and EV variance (i)"
            >
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden xs:inline">Audit Guide (i)</span>
              <span className="xs:hidden">(i)</span>
            </button>
          )}

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-arcade uppercase block">SESSION LEAK COST</span>
            <span className="font-bold font-mono-telemetry text-rose-400 text-sm">-${totalEvLoss.toFixed(2)} EV Loss</span>
          </div>
          <div className="text-right border-l border-[#243552] pl-3">
            <span className="text-[10px] text-slate-400 font-arcade uppercase block">ANNUAL IMPACT</span>
            <span className="font-bold font-mono-telemetry text-amber-400 text-sm">-${annualizedLoss}/yr</span>
          </div>
        </div>
      </div>

      {/* Chronological Decision Scrubber Bar */}
      <div className="bg-[#0E1524] border-2 border-[#243552] rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold font-arcade uppercase tracking-wider text-white">
            Round-by-Round Decision Timeline ({SAMPLE_SESSION_LOGS.length} Rounds Tracked)
          </span>
          <span className="text-[11px] text-slate-400">Tap round to inspect play</span>
        </div>

        {/* Timeline Ribbon */}
        <div className="flex items-center gap-2.5 overflow-x-auto py-2">
          {SAMPLE_SESSION_LOGS.map((item, idx) => {
            const isSelected = selectedItem.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`px-3.5 py-2.5 rounded-xl border-2 text-left shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-amber-400 scale-105 z-10 shadow-lg'
                    : 'opacity-80 hover:opacity-100'
                } ${
                  item.wasOptimal
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/60 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold font-arcade">
                  {item.wasOptimal ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  <span>HAND #{idx + 1}</span>
                  <span className="text-[9px] px-1 rounded bg-black/40">
                    {item.wasOptimal ? 'PERFECT' : 'LEAK'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 mt-1 truncate max-w-[120px] font-sans-arcade">
                  {item.decisionTaken}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Action Deep Inspection */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Inspection Card (7 Cols) */}
        <div className="md:col-span-7 bg-[#0E1524] border-2 border-[#243552] rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#1E2E4A] pb-2">
            <span className="font-bold font-arcade text-white text-xs uppercase tracking-wider">
              Hand #{SAMPLE_SESSION_LOGS.findIndex(s => s.id === selectedItem.id) + 1} Comparison & Diagnosis
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-arcade border ${
              selectedItem.wasOptimal
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
            }`}>
              {selectedItem.errorCategory}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-[#070D17] border border-[#1E2E4A]">
              <span className="text-[10px] text-slate-400 font-arcade uppercase block mb-1">PLAYER ACTION TAKEN</span>
              <span className={`font-bold font-mono-telemetry text-sm ${selectedItem.wasOptimal ? 'text-white' : 'text-rose-400'}`}>
                {selectedItem.decisionTaken}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#070D17] border border-emerald-500/40">
              <span className="text-[10px] text-emerald-400 font-arcade uppercase block mb-1">MATHEMATICALLY OPTIMAL</span>
              <span className="font-bold font-mono-telemetry text-sm text-emerald-400">
                {selectedItem.optimalDecision}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#141F32] border border-[#243552] space-y-1">
            <span className="text-[10px] text-slate-400 font-arcade uppercase block">EXPECTED VALUE IMPACT (ΔEV)</span>
            <div className="text-base font-bold font-mono-telemetry text-white flex items-center gap-2">
              <span className={selectedItem.evDelta < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                {selectedItem.evDelta < 0 ? `${selectedItem.evDelta.toFixed(2)} EV` : '0.00 EV (Zero Leak)'}
              </span>
              <span className="text-xs text-slate-400 font-normal font-sans-arcade">
                {selectedItem.evDelta < 0 ? 'Cost per occurrence' : 'Mathematically certified'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070D17] border border-[#1E2E4A] space-y-1">
            <span className="text-[10px] text-amber-300 font-arcade uppercase block">TACTICAL REASONING & COACH NOTE</span>
            <p className="text-slate-300 font-sans-arcade text-xs leading-relaxed">
              {selectedItem.notes}
            </p>
          </div>
        </div>

        {/* Error Category Tagging & Statistics (5 Cols) */}
        <div className="md:col-span-5 bg-[#0E1524] border-2 border-[#243552] rounded-2xl p-4 shadow-xl space-y-3 text-xs">
          <div className="border-b border-[#1E2E4A] pb-2">
            <span className="font-bold font-arcade text-white uppercase tracking-wider">
              Leak Source Breakdown
            </span>
          </div>

          <div className="space-y-2">
            {[
              { cat: 'Index Violation', count: 1, color: 'text-amber-400', pct: 25 },
              { cat: 'MDF Over-Fold', count: 1, color: 'text-cyan-400', pct: 25 },
              { cat: 'Sub-Optimal MHB Slot Entry', count: 1, color: 'text-purple-400', pct: 25 },
              { cat: 'Improper Bet Sizing', count: 1, color: 'text-rose-400', pct: 25 },
            ].map(err => (
              <div key={err.cat} className="p-2.5 rounded-xl bg-[#070D17] border border-[#1E2E4A] flex items-center justify-between">
                <div>
                  <span className={`font-bold font-arcade block ${err.color}`}>{err.cat}</span>
                  <span className="text-[10px] text-slate-400 font-sans-arcade">{err.count} recorded incident</span>
                </div>
                <span className="font-bold font-mono-telemetry text-white text-sm">{err.pct}%</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#141F32] border border-amber-500/30">
            <span className="text-xs font-bold font-arcade text-amber-300 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" /> Pro Recommendation
            </span>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed font-sans-arcade">
              Focus on 16 vs 10 and 12 vs 3 indices in the Speed Drill Arena to immediately plug 50% of your current table leaks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
