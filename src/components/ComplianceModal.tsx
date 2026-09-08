import React from 'react';
import { X, ShieldAlert, Scale, AlertTriangle, BookOpen, CheckCircle2 } from 'lucide-react';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-[#0D111A] border border-[#1E2638] p-5 text-slate-200 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1E2638] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#FF1744]/10 border border-[#FF1744]/30 text-[#FF1744]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono-telemetry">
                Regulatory Compliance & Statutory Framework
              </h2>
              <p className="text-xs text-slate-400">
                Nevada NRS 465.075 • Apple App Store 5.3.4 • Research & Simulation Only
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E2638] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          {/* Statutory warning */}
          <div className="p-3 rounded-lg bg-[#2A1215] border border-[#FF1744]/40 text-[#FF8080]">
            <div className="flex items-center gap-2 font-bold font-mono-telemetry uppercase text-[11px] mb-1 text-[#FF5252]">
              <AlertTriangle className="w-4 h-4 text-[#FF1744]" />
              Nevada Revised Statutes (NRS) 465.075 & 465.088
            </div>
            <p>
              Under Nevada law, it is a <strong>Category B felony</strong> (punishable by 1 to 10 years imprisonment and up to $10,000 fines per violation) to use or possess any computerized hardware or software at a licensed gaming establishment to project outcomes, track cards, or calculate playing or betting strategies during live play.
            </p>
          </div>

          {/* Product Purpose */}
          <div className="p-3 rounded-lg bg-[#121620] border border-[#1E2638]">
            <div className="flex items-center gap-2 font-bold font-mono-telemetry uppercase text-[11px] mb-1.5 text-[#00F2FE]">
              <Scale className="w-4 h-4 text-[#00F2FE]" />
              Platform Certification & Scope
            </div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li><strong>Zero Real-Money Wagering:</strong> Operates strictly on virtual simulation credits. No financial deposits or withdrawals.</li>
              <li><strong>No Real-Time In-Venue Assistance (RTA):</strong> All simulation engines are intended for offline study, mathematical audits, and pedagogical training.</li>
              <li><strong>App Store 5.3.4 & Google Play Compliant:</strong> Categorized as a Quantitative Gaming Simulator & Statistical Analysis Tool.</li>
            </ul>
          </div>

          {/* Mathematical feasibility comparison */}
          <div className="p-3 rounded-lg bg-[#121620] border border-[#1E2638]">
            <div className="flex items-center gap-2 font-bold font-mono-telemetry uppercase text-[11px] mb-2 text-[#00E676]">
              <BookOpen className="w-4 h-4 text-[#00E676]" />
              Mathematical Feasibility Breakdown
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-[#07090E] border border-red-900/40">
                <span className="font-semibold text-red-400 block mb-1">Memoryless Independent Games:</span>
                <p className="text-slate-400">
                  Roulette, Craps, Sic Bo, & Standard Spins. Probability of outcome is identical each round: <span className="font-mono text-slate-300">P(X_t|X_1..X_t-1) = P(X_t)</span>. No software can eliminate the house edge.
                </p>
              </div>
              <div className="p-2 rounded bg-[#07090E] border border-emerald-900/40">
                <span className="font-semibold text-emerald-400 block mb-1">Dependent & State-Based Games:</span>
                <p className="text-slate-400">
                  Shoe Blackjack (Hypergeometric sampling without replacement), PvP Poker (CFR+ Game Theory), and Must-Hit-By Progressive Slots have mathematical state thresholds yielding positive expectation (+EV).
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#1E2638] flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00F2FE] hover:bg-[#00d8e4] text-[#07090E] font-bold text-xs uppercase tracking-wider font-mono-telemetry transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Understood & Acknowledged
          </button>
        </div>
      </div>
    </div>
  );
};
