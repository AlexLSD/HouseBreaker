import React, { useState, useRef, useEffect } from 'react';
import { Coins, Flame, Shield, User, Languages, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';
import { sounds } from '../utils/soundEffects';

interface HeaderTelemetryProps {
  onOpenCompliance: () => void;
  onOpenProfile: () => void;
  activeTab: string;
}

const LANGUAGE_OPTIONS: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' }
];

export const HeaderTelemetry: React.FC<HeaderTelemetryProps> = ({
  onOpenCompliance,
  onOpenProfile,
  activeTab
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const handleLangSelect = (newLang: Language) => {
    sounds.playClick();
    setLanguage(newLang);
    setIsLangMenuOpen(false);
  };

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };

    if (isLangMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A0D14]/95 backdrop-blur-md border-b border-[#2A344A] px-2.5 sm:px-4 py-2 text-xs select-none shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#1E273A] to-[#141B28] border border-[#F59E0B]/40 shadow-inner shrink-0">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]"></span>
            </span>
            <span className="font-arcade font-bold tracking-wider text-amber-300 text-xs sm:text-sm drop-shadow truncate">
              HOUSE<span className="text-white">BREAKER</span>
            </span>
            <span className="text-[9px] px-1 sm:px-1.5 py-0.5 rounded bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30 font-mono-telemetry font-bold">
              {t.proBadge}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141B28] border border-[#273349] text-slate-300 text-[11px] font-sans-arcade">
            <Coins className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="text-slate-400">{t.tokens}:</span>
            <span className="text-amber-400 font-bold font-mono-telemetry">2,450</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0F231A] border border-[#10B981]/40 text-emerald-300 text-[11px] font-sans-arcade">
            <Flame className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-emerald-400 font-semibold font-mono-telemetry">{t.apEdge}</span>
          </div>
        </div>

        {/* Right: Icon-Only Controls for Languages, Profile & Legal Statute */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Selector (Icon Only with Dropdown Menu) */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => {
                sounds.playClick();
                setIsLangMenuOpen((prev) => !prev);
              }}
              className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border transition-all cursor-pointer active:scale-95 shadow-sm ${
                isLangMenuOpen
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-900/30'
                  : 'bg-[#101724] hover:bg-[#1A253A] border-[#22334F] text-slate-300 hover:text-white'
              }`}
              aria-label="Select Language"
              title="Change Language (English / Русский / עברית)"
            >
              <Languages className="w-4 h-4 shrink-0" />
            </button>

            {/* Language Selection Popover */}
            {isLangMenuOpen && (
              <div className="absolute end-0 mt-2 w-36 py-1 bg-[#0D1422] border border-[#243550] rounded-xl shadow-2xl z-50 animate-fade-in backdrop-blur-xl">
                {LANGUAGE_OPTIONS.map((opt) => {
                  const isSelected = language === opt.code;
                  return (
                    <button
                      key={opt.code}
                      onClick={() => handleLangSelect(opt.code)}
                      className={`w-full px-3 py-2 flex items-center justify-between ltr:text-left rtl:text-right text-xs font-arcade transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400/20 text-amber-300 font-bold'
                          : 'text-slate-300 hover:bg-[#162238] hover:text-white'
                      }`}
                    >
                      <span className="truncate">{opt.nativeName}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Profile Button (Icon Only) */}
          <button
            onClick={onOpenProfile}
            className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border transition-all cursor-pointer active:scale-95 shadow-sm ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-amber-900/30 ring-1 ring-amber-300'
                : 'bg-gradient-to-r from-[#141F32] to-[#0E1726] hover:from-[#1E2E48] hover:to-[#141F32] border-sky-500/50 text-sky-300 hover:text-white'
            }`}
            aria-label={t.profile}
            title={`${t.profile} - Advantage Play Telemetry & Performance`}
          >
            <User className="w-4 h-4 shrink-0" />
          </button>

          {/* Legal Statute / Law Button (Icon Only) */}
          <button
            onClick={onOpenCompliance}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-[#281812] to-[#1C120E] hover:from-[#352018] hover:to-[#281812] border border-[#F59E0B]/50 text-[#FBBF24] transition-all cursor-pointer active:scale-95 shadow-sm"
            aria-label={t.legalStatute}
            title="Nevada NRS 465.075 & Statutory Framework (Legal Compliance)"
          >
            <Shield className="w-4 h-4 text-[#F59E0B] shrink-0" />
          </button>
        </div>
      </div>
    </header>
  );
};
