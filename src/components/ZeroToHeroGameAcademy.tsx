import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ACADEMY_CONTENT, AcademyGameContent } from '../i18n/academyContent';
import { sounds } from '../utils/soundEffects';
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  CircleDot,
  Coins,
  Flame,
  Grid,
  Shield,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react';

interface ZeroToHeroProps {
  initialGame?: 'blackjack' | 'slots' | 'kelly' | 'poker' | 'roulette';
}

const GAME_META = [
  { id: 'kelly', icon: Coins, color: 'text-emerald-400' },
  { id: 'blackjack', icon: Shield, color: 'text-amber-400' },
  { id: 'slots', icon: Grid, color: 'text-cyan-400' },
  { id: 'poker', icon: Calculator, color: 'text-purple-400' },
  { id: 'roulette', icon: CircleDot, color: 'text-rose-400' }
] as const;

export const ZeroToHeroGameAcademy: React.FC<ZeroToHeroProps> = ({
  initialGame = 'kelly'
}) => {
  const { t, language } = useLanguage();
  const [selectedGame, setSelectedGame] = useState<'blackjack' | 'slots' | 'kelly' | 'poker' | 'roulette'>(initialGame);

  const langPack = ACADEMY_CONTENT[language] || ACADEMY_CONTENT.en;
  const content: AcademyGameContent = langPack[selectedGame];

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#0A101C] to-[#060912] border-2 border-[#1E2E48] shadow-2xl space-y-4">
      {/* Academy Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E2E48]">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-arcade font-bold shadow-md shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white font-arcade uppercase tracking-wider">
                {t.zeroToHeroGuide}
              </h2>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono-telemetry font-bold border border-amber-400/40">
                PRO AP ACADEMY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'ru'
                ? 'Пошаговые руководства: правила, как устроены игры и математика реального преимущества.'
                : language === 'he'
                ? 'מדריכים מעשיים צעד אחר צעד: חוקי המשחק, איך זה עובד והמתמטיקה של יתרון סטטיסטי.'
                : 'Clear, step-by-step masterclasses designed to transform complete beginners into mathematically sharp advantage players.'}
            </p>
          </div>
        </div>

        {/* Game Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-xl bg-[#070B14] border border-[#1E2E48]">
          {GAME_META.map(g => {
            const Icon = g.icon;
            const isSelected = selectedGame === g.id;
            const gameData = langPack[g.id];
            return (
              <button
                key={g.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedGame(g.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-arcade font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : g.color}`} />
                <span>{gameData?.tabLabel || g.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Game Content */}
      <div className="space-y-4 animate-fade-in text-xs">
        {/* Friendly Hero Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#111C2E] via-[#0E1624] to-[#080E18] border border-amber-400/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-arcade font-bold text-sm">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{content.heroTitle}</span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono-telemetry font-bold border border-amber-400/30">
              {content.badge}
            </span>
          </div>
          <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
            {content.heroIntro}
          </p>
        </div>

        {/* Two-Card Overview: How to Play & How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Card A: How to Play */}
          <div className="p-3.5 rounded-2xl bg-[#09111D] border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-arcade font-bold text-xs uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{content.howToPlayTitle}</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {content.howToPlayText}
            </p>
          </div>

          {/* Card B: How It Works & Edge Math */}
          <div className="p-3.5 rounded-2xl bg-[#09111D] border border-sky-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-400 font-arcade font-bold text-xs uppercase tracking-wide">
              <Zap className="w-4 h-4 text-sky-400" />
              <span>{content.howItWorksTitle}</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {content.howItWorksText}
            </p>
          </div>
        </div>

        {/* Step-by-Step Mastery Levels */}
        <div className="space-y-3">
          <div className="text-[11px] font-arcade text-amber-300 font-bold uppercase tracking-wider px-1">
            {language === 'ru' ? 'ПОШАГОВЫЕ УРОВНИ МАСТЕРСТВА (ZERO TO HERO)' : language === 'he' ? 'שלבי התקדמות מאפס למקצוען' : 'STEP-BY-STEP ADVANTAGE PROGRESSION'}
          </div>

          {content.levels.map((lvl, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#080E18] border border-[#1A2840] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-arcade font-bold text-[10px]">
                    {lvl.badge}
                  </span>
                  <span className="font-arcade font-bold text-amber-300 text-xs">
                    {lvl.title}
                  </span>
                </div>
              </div>

              <p className="text-slate-300 text-[11px] leading-relaxed">
                {lvl.description}
              </p>

              {lvl.formula && (
                <div className="p-2.5 rounded-xl bg-[#040811] border border-cyan-500/30 font-mono-telemetry text-center text-xs text-cyan-300 font-bold">
                  {lvl.formula}
                </div>
              )}

              {lvl.highlight && (
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-mono-telemetry font-bold text-center">
                  ⚠️ {lvl.highlight}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
