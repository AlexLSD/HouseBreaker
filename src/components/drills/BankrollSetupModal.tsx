import React, { useState } from 'react';
import { ArrowLeft, Coins, ShieldAlert, X, Zap } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { useLanguage } from '../../i18n/LanguageContext';

interface BankrollSetupModalProps {
  isOpen: boolean;
  onConfirm: (startingCredits: number) => void;
  onClose?: () => void;
  onNavigateTab?: (tabId: string) => void;
}

const PRESET_CREDITS = [500, 1000, 2500, 5000, 10000];

export const BankrollSetupModal: React.FC<BankrollSetupModalProps> = ({
  isOpen,
  onConfirm,
  onClose,
  onNavigateTab
}) => {
  const { t } = useLanguage();
  const [selectedCredits, setSelectedCredits] = useState<number>(1000);
  const [customInput, setCustomInput] = useState<string>('1000');

  if (!isOpen) return null;

  const handleSelectPreset = (amount: number) => {
    sounds.playChip();
    setSelectedCredits(amount);
    setCustomInput(amount.toString());
  };

  const handleCustomChange = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ''), 10) || 0;
    setCustomInput(val);
    setSelectedCredits(Math.max(10, Math.min(100000, num)));
  };

  const handleStart = () => {
    sounds.playChip();
    onConfirm(selectedCredits);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#131B2A] via-[#0E1522] to-[#090D17] border-2 border-amber-500/40 p-5 sm:p-6 shadow-2xl shadow-amber-500/10 space-y-4 sm:space-y-5 font-sans-arcade max-h-[92vh] overflow-y-auto">
        {/* Close Button Top Right */}
        {onClose && (
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl bg-[#141F33] hover:bg-[#1E2F4C] border border-[#2D3F5E] text-slate-400 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95 z-10"
            title={t.closeBtn}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-1">
            <Coins className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black font-arcade text-white uppercase tracking-wider">
            {t.bankrollSetupTitle}
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {t.bankrollSetupSub}
          </p>
        </div>

        {/* Selected Bankroll Visual */}
        <div className="p-4 rounded-2xl bg-[#070B14] border-2 border-[#1E2E48] text-center space-y-1">
          <span className="text-[11px] font-arcade text-amber-300 uppercase tracking-widest block">
            {t.bankrollStackLabel}
          </span>
          <div className="text-4xl font-mono-telemetry font-black text-amber-400 drop-shadow-md">
            {selectedCredits.toLocaleString()} <span className="text-xl">{t.bankrollCreditsUnit}</span>
          </div>
          <span className="text-[11px] text-slate-400 block font-mono-telemetry">
            {t.bankrollEquates} {Math.floor(selectedCredits / 25)} {t.bankrollStdBets}
          </span>
        </div>

        {/* Preset Chips Grid */}
        <div className="space-y-2">
          <span className="text-xs font-arcade text-slate-300 block">
            {t.bankrollSelectPreset}
          </span>
          <div className="grid grid-cols-5 gap-2">
            {PRESET_CREDITS.map(amount => (
              <button
                key={amount}
                onClick={() => handleSelectPreset(amount)}
                className={`py-2.5 px-1 rounded-xl font-mono-telemetry font-bold text-xs transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                  selectedCredits === amount
                    ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 ring-2 ring-white scale-105 shadow-lg'
                    : 'bg-[#152033] hover:bg-[#1E2E48] text-slate-200 border border-[#2A3C5C]'
                }`}
              >
                <span>🪙</span>
                <span>{amount >= 1000 ? `${amount / 1000}k` : amount}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#09111D] border border-[#20314A]">
          <span className="text-xs font-arcade text-slate-400 whitespace-nowrap">
            {t.bankrollCustomAmount}
          </span>
          <input
            type="number"
            min="50"
            max="100000"
            step="50"
            value={customInput}
            onChange={(e) => handleCustomChange(e.target.value)}
            className="w-full bg-transparent font-mono-telemetry font-bold text-sm text-amber-300 focus:outline-none text-right px-2"
          />
          <span className="text-xs font-mono-telemetry text-slate-400">CR</span>
        </div>

        {/* Rules Highlight */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 font-arcade text-amber-300 font-bold">
            <ShieldAlert className="w-4 h-4" /> {t.bankrollRulesTitle}
          </div>
          <ul className="list-disc pl-4 space-y-0.5 text-slate-400 text-[10px]">
            <li>{t.bankrollRule1}</li>
            <li>{t.bankrollRule2}</li>
            <li>{t.bankrollRule3}</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleStart}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-arcade font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 active:scale-98 cursor-pointer transition-all"
          >
            <Zap className="w-5 h-5" />
            {t.bankrollStartBtn} {selectedCredits.toLocaleString()} CR
          </button>

          <div className="flex items-center gap-2">
            {onClose && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#141F33] hover:bg-[#1E2F4C] border border-[#2D3F5E] text-slate-300 hover:text-white font-arcade text-xs text-center transition-all cursor-pointer"
              >
                {t.bankrollCancel}
              </button>
            )}

            {onNavigateTab && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onNavigateTab('command-center');
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#181528] hover:bg-[#251E3E] border border-purple-500/30 text-purple-300 hover:text-purple-200 font-arcade text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t.bankrollReturnHub}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
