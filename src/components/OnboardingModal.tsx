import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';
import { updateUserNickname, loadUserProfile } from '../utils/userProfileStorage';
import { sounds } from '../utils/soundEffects';
import { Shield, Sparkles, User, Globe, ArrowRight, Check } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (nickname: string, language: Language) => void;
  initialNickname?: string;
}

const LANGUAGE_SELECTIONS: { code: Language; name: string; flag: string; native: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', native: 'Русский' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', native: 'עברית' }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  initialNickname = ''
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [nickname, setNickname] = useState<string>(initialNickname || '');
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nickname.trim();
    if (!cleanName) {
      setErrorMsg(selectedLang === 'ru' ? 'Пожалуйста, введите ваш никнейм' : selectedLang === 'he' ? 'אנא הזן כינוי' : 'Please enter your nickname');
      return;
    }

    sounds.playWin();
    updateUserNickname(cleanName, selectedLang);
    setLanguage(selectedLang);
    onComplete(cleanName, selectedLang);
  };

  const handleLangChange = (code: Language) => {
    sounds.playClick();
    setSelectedLang(code);
    setLanguage(code); // Update live preview of strings in the modal
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#0D1424] to-[#070B14] border-2 border-amber-400/50 p-5 sm:p-7 shadow-2xl space-y-5 text-slate-100">
        {/* Glow effect */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-20 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header with App Identity */}
        <div className="text-center space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>HOUSEBREAKER</span>
            <span className="text-[10px] lowercase text-amber-400 font-sans font-medium px-1 rounded bg-amber-400/20">alpha</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold font-arcade uppercase tracking-wide text-white">
            {t.onboardingTitle || 'Welcome to HouseBreaker'}
          </h2>
          <p className="text-xs text-slate-300 font-sans-arcade">
            {t.onboardingSubtitle || 'Set up your advantage operator credentials and language.'}
          </p>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Nickname Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-arcade text-slate-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.nicknameLabel || 'Operator Nickname / Callsign'}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                maxLength={24}
                placeholder={t.nicknamePlaceholder || 'e.g. EdgeMaster, BlackjackAce'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D18] border border-[#233550] text-white font-mono-telemetry text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-slate-500"
                autoFocus
              />
            </div>
            {errorMsg && (
              <p className="text-[11px] text-rose-400 font-mono-telemetry">{errorMsg}</p>
            )}
            <p className="text-[10px] text-slate-400 font-sans-arcade">
              {selectedLang === 'ru'
                ? 'Этот никнейм будет отображаться в вашем профиле и отчетах о результатах.'
                : selectedLang === 'he'
                ? 'כינוי זה יוצג בפרופיל ובדוחות הביצועים שלך.'
                : 'This name will be displayed on your tactical profile and performance telemetry.'}
            </p>
          </div>

          {/* Default Language Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-arcade text-slate-200 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.defaultLanguageLabel || 'Default Language'}</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {LANGUAGE_SELECTIONS.map((item) => {
                const isSelected = selectedLang === item.code;
                return (
                  <button
                    type="button"
                    key={item.code}
                    onClick={() => handleLangChange(item.code)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-md shadow-amber-950/40 ring-1 ring-amber-400'
                        : 'bg-[#090F1B] border-[#1C2C44] text-slate-300 hover:bg-[#131F33] hover:text-white'
                    }`}
                  >
                    <span className="text-base">{item.flag}</span>
                    <span className="text-xs font-arcade font-bold">{item.native}</span>
                    {isSelected && (
                      <Check className="w-3 h-3 text-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-arcade font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>{t.startExploringBtn || 'Initialize HouseBreaker'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security / Offline Notice */}
        <div className="pt-2 border-t border-[#1C2A40] flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-mono-telemetry text-center">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>Local Advantage Suite • Nevada NRS 465.075 Compliant</span>
        </div>
      </div>
    </div>
  );
};
