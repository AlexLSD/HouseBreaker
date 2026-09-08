import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Calculator,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Coins,
  Compass,
  Flame,
  Gamepad2,
  Grid,
  Info,
  Layers,
  Percent,
  Play,
  RotateCcw,
  Shield,
  Sparkles,
  Trophy,
  Zap
} from 'lucide-react';

interface CommandCenterProps {
  onNavigateTab: (tabId: string) => void;
  onOpenCompliance: () => void;
  onOpenFeaturesGuide?: (category?: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  onNavigateTab,
  onOpenCompliance,
  onOpenFeaturesGuide
}) => {
  const { t } = useLanguage();

  // Quick Pot Odds Calculator State
  const [quickPot, setQuickPot] = useState<number>(100);
  const [quickBet, setQuickBet] = useState<number>(40);
  const [quickOuts, setQuickOuts] = useState<number>(9); // default flush draw (9 outs)

  // Pot odds calculation
  const potOddsPct = Math.round((quickBet / (quickPot + quickBet * 2)) * 100);
  const mdfPct = Math.round((quickPot / (quickPot + quickBet)) * 100);
  const equityTurnRiver = Math.min(100, Math.round(quickOuts * 4)); // Rule of 4
  const isCallProfitable = equityTurnRiver >= potOddsPct;

  // Quick MHB Radar State
  const [mhbCap, setMhbCap] = useState<number>(500);
  const [mhbCurrent, setMhbCurrent] = useState<number>(478);
  const deltaJ = Math.max(0, mhbCap - mhbCurrent);
  const isMhbPositiveEV = mhbCurrent >= (mhbCap - 32); // rough break-even threshold for $500 cap

  // Quick Card Counter Flash Trainer
  const FLASH_CARDS = [
    { card: 'K♠', val: -1, label: 'Face Card (10-A)' },
    { card: '5♥', val: +1, label: 'Low Card (2-6)' },
    { card: '8♣', val: 0, label: 'Neutral Card (7-9)' },
    { card: 'A♦', val: -1, label: 'Ace (10-A)' },
    { card: '3♠', val: +1, label: 'Low Card (2-6)' },
    { card: '9♦', val: 0, label: 'Neutral Card (7-9)' },
  ];
  const [cardIdx, setCardIdx] = useState<number>(0);
  const [countScore, setCountScore] = useState<number>(0);
  const [flashFeedback, setFlashFeedback] = useState<string | null>(null);

  const handleCardCountGuess = (userVal: number) => {
    const current = FLASH_CARDS[cardIdx];
    if (userVal === current.val) {
      setCountScore(s => s + 1);
      setFlashFeedback('CORRECT! +1 TOKEN 🪙');
    } else {
      setFlashFeedback(`MISS: ${current.val > 0 ? '+1' : current.val < 0 ? '-1' : '0'}`);
    }
    setTimeout(() => {
      setCardIdx(i => (i + 1) % FLASH_CARDS.length);
      setFlashFeedback(null);
    }, 600);
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans-arcade">
      {/* Elegant Arcade Marquee Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#121826] via-[#1A2234] to-[#0F1420] border-2 border-[#F59E0B]/40 p-4 sm:p-5 shadow-2xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider font-arcade bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/50 flex items-center gap-1 shadow-sm">
                <Trophy className="w-3 h-3 text-[#FBBF24]" />
                {t.arcadeTitle}
              </span>
              <span className="text-[11px] text-emerald-400 font-mono-telemetry font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {t.activeAdvantageReady}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-arcade tracking-wide text-white drop-shadow-sm flex items-center gap-2">
              HOUSE<span className="text-amber-400">BREAKER</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
              {t.arcadeSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('roulette')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] text-[#0A0D14] font-arcade font-bold text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-[#F59E0B]/25 transition-all cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              {t.btnExploreLabs}
            </button>
            <button
              onClick={() => onNavigateTab('drills')}
              className="px-3.5 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#27354A] border border-[#334155] text-slate-200 font-sans-arcade text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              {t.btnApDrills}
            </button>
          </div>
        </div>

        {/* Practical Quick Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-[#2A364F] text-xs">
          <div className="p-2 rounded-xl bg-[#0A0E17]/80 border border-[#232D42]">
            <span className="text-[10px] text-slate-400 font-sans-arcade block">{t.navRoulette}</span>
            <div className="text-white font-bold font-mono-telemetry text-sm mt-0.5 text-amber-400">
              European 2.7% & French 1.35%
            </div>
            <span className="text-[10px] text-emerald-400">{t.rouletteSubtitle}</span>
          </div>

          <div className="p-2 rounded-xl bg-[#0A0E17]/80 border border-[#232D42]">
            <span className="text-[10px] text-slate-400 font-sans-arcade block">{t.navSlots}</span>
            <div className="text-white font-bold font-mono-telemetry text-sm mt-0.5 text-amber-400">
              Must-Hit-By $500
            </div>
            <span className="text-[10px] text-cyan-400">{t.mhbRadarTitle}</span>
          </div>

          <div className="p-2 rounded-xl bg-[#0A0E17]/80 border border-[#232D42]">
            <span className="text-[10px] text-slate-400 font-sans-arcade block">{t.navKelly}</span>
            <div className="text-white font-bold font-mono-telemetry text-sm mt-0.5 text-emerald-400">
              Half Kelly (0.50φ)
            </div>
            <span className="text-[10px] text-slate-400">1.8% Risk of Ruin</span>
          </div>

          <div className="p-2 rounded-xl bg-[#0A0E17]/80 border border-[#232D42]">
            <span className="text-[10px] text-slate-400 font-sans-arcade block">{t.legalStatute}</span>
            <div className="text-white font-bold font-mono-telemetry text-sm mt-0.5 text-slate-200 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              NRS 465.075
            </div>
            <button
              onClick={onOpenCompliance}
              className="text-[10px] text-amber-400 hover:underline cursor-pointer"
            >
              {t.btnStatuteLaw} &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Guide Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#0C1526] via-[#101D36] to-[#0A111F] border border-[#2B4168] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold font-arcade tracking-wide text-white">
                {t.modulesTitle}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono-telemetry font-bold border border-sky-500/40">
                PRO AP GUIDE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {t.modulesSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenFeaturesGuide?.('all')}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-arcade font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Info className="w-4 h-4 text-slate-950" />
          {t.btnFeatureGuide}
        </button>
      </div>

      {/* 5 Core Disciplines Matrix */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-xs font-bold font-arcade tracking-wider text-amber-300 uppercase flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-400" />
            {t.modulesTitle}
          </h2>
          <span className="text-[11px] text-slate-400">{t.modulesSubtitle}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Card 1: Roulette */}
          <div
            onClick={() => onNavigateTab('roulette')}
            className="group p-4 rounded-2xl bg-[#0E131F] hover:bg-[#141B2C] border border-[#243048] hover:border-[#F59E0B]/60 transition-all duration-200 cursor-pointer shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 group-hover:scale-110 transition-transform">
                  <CircleDot className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFeaturesGuide?.('roulette');
                    }}
                    className="p-1 rounded-lg bg-[#141F33] hover:bg-[#1F2F4C] border border-[#2B3E60] text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono-telemetry font-bold px-2 py-0.5 rounded bg-rose-950/70 border border-rose-500/40 text-rose-300">
                    {t.navRoulette}
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors font-arcade">
                {t.modRouletteTitle}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {t.modRouletteDesc}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#1C263B] flex items-center justify-between text-xs text-rose-400 font-semibold">
              <span>{t.btnLaunchModule}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Slots */}
          <div
            onClick={() => onNavigateTab('massive-slots')}
            className="group p-4 rounded-2xl bg-[#0E131F] hover:bg-[#141B2C] border border-[#243048] hover:border-[#F59E0B]/60 transition-all duration-200 cursor-pointer shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Grid className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFeaturesGuide?.('slots');
                    }}
                    className="p-1 rounded-lg bg-[#141F33] hover:bg-[#1F2F4C] border border-[#2B3E60] text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono-telemetry font-bold px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
                    {t.navSlots}
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors font-arcade">
                {t.modSlotsTitle}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {t.modSlotsDesc}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#1C263B] flex items-center justify-between text-xs text-cyan-400 font-semibold">
              <span>{t.btnLaunchModule}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Poker */}
          <div
            onClick={() => onNavigateTab('range-lab')}
            className="group p-4 rounded-2xl bg-[#0E131F] hover:bg-[#141B2C] border border-[#243048] hover:border-[#F59E0B]/60 transition-all duration-200 cursor-pointer shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 group-hover:scale-110 transition-transform">
                  <Calculator className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFeaturesGuide?.('poker');
                    }}
                    className="p-1 rounded-lg bg-[#141F33] hover:bg-[#1F2F4C] border border-[#2B3E60] text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono-telemetry font-bold px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/40 text-purple-300">
                    {t.navPoker}
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors font-arcade">
                {t.modPokerTitle}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {t.modPokerDesc}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#1C263B] flex items-center justify-between text-xs text-purple-400 font-semibold">
              <span>{t.btnLaunchModule}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Kelly */}
          <div
            onClick={() => onNavigateTab('risk-lab')}
            className="group p-4 rounded-2xl bg-[#0E131F] hover:bg-[#141B2C] border border-[#243048] hover:border-[#F59E0B]/60 transition-all duration-200 cursor-pointer shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Coins className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFeaturesGuide?.('bankroll');
                    }}
                    className="p-1 rounded-lg bg-[#141F33] hover:bg-[#1F2F4C] border border-[#2B3E60] text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono-telemetry font-bold px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
                    {t.navKelly}
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors font-arcade">
                {t.modKellyTitle}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {t.modKellyDesc}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#1C263B] flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span>{t.btnLaunchModule}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Drills */}
          <div
            onClick={() => onNavigateTab('drills')}
            className="group p-4 rounded-2xl bg-[#0E131F] hover:bg-[#141B2C] border border-[#243048] hover:border-[#F59E0B]/60 transition-all duration-200 cursor-pointer shadow-md flex flex-col justify-between sm:col-span-2 lg:col-span-2"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 group-hover:scale-110 transition-transform">
                  <Flame className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFeaturesGuide?.('drills');
                    }}
                    className="p-1 rounded-lg bg-[#141F33] hover:bg-[#1F2F4C] border border-[#2B3E60] text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono-telemetry font-bold px-2 py-0.5 rounded bg-rose-950/70 border border-rose-500/40 text-rose-300">
                    {t.navDrills}
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors font-arcade">
                {t.modDrillsTitle}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {t.modDrillsDesc}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#1C263B] flex items-center justify-between text-xs text-rose-400 font-semibold">
              <span>{t.btnLaunchModule}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Interactive Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {/* Quick Widget 1: Pot Odds */}
        <div className="p-4 rounded-2xl bg-[#0D121D] border border-[#25324A] shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold font-arcade tracking-wider text-white uppercase">
                {t.potOddsTitle}
              </h3>
            </div>
            <span className="text-[10px] font-mono-telemetry text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
              {t.navPoker}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">{t.potSize}</label>
              <input
                type="number"
                value={quickPot}
                onChange={e => setQuickPot(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-2 py-1.5 rounded-lg bg-[#070A10] border border-[#25324A] text-white font-mono-telemetry font-bold text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">{t.betFacing}</label>
              <input
                type="number"
                value={quickBet}
                onChange={e => setQuickBet(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-2 py-1.5 rounded-lg bg-[#070A10] border border-[#25324A] text-white font-mono-telemetry font-bold text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">{t.outsCount}</label>
              <select
                value={quickOuts}
                onChange={e => setQuickOuts(parseInt(e.target.value))}
                className="w-full px-2 py-1.5 rounded-lg bg-[#070A10] border border-[#25324A] text-white font-mono-telemetry font-bold text-xs"
              >
                <option value={9}>9 Outs (Flush)</option>
                <option value={8}>8 Outs (Straight)</option>
                <option value={4}>4 Outs (Gutshot)</option>
                <option value={15}>15 Outs (Combo)</option>
                <option value={6}>6 Outs (Overcards)</option>
              </select>
            </div>
          </div>

          {/* Quick Output Callout */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            isCallProfitable ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}>
            <div>
              <span className="text-[10px] font-mono-telemetry uppercase tracking-wider block">
                {t.potOddsRatio}: {potOddsPct}% • {t.ruleOf4}: {equityTurnRiver}%
              </span>
              <span className="text-sm font-bold font-arcade tracking-wide">
                {isCallProfitable ? t.profitableCall : t.unprofitableFold}
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('range-lab')}
              className="px-2.5 py-1 rounded bg-[#1C263B] text-slate-200 hover:text-white text-[11px] font-semibold cursor-pointer"
            >
              {t.navPoker} &rarr;
            </button>
          </div>
        </div>

        {/* Quick Widget 2: Hi-Lo Count Flash Reflex */}
        <div className="p-4 rounded-2xl bg-[#0D121D] border border-[#25324A] shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold font-arcade tracking-wider text-white uppercase">
                {t.hiloTrainerTitle}
              </h3>
            </div>
            <span className="text-[10px] font-mono-telemetry text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              {t.hiloScore}: {countScore} 🪙
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#070A10] p-3 rounded-xl border border-[#1E293F]">
            {/* Playing Card Render */}
            <div className="w-16 h-22 rounded-xl bg-white text-slate-900 border-2 border-amber-400/80 shadow-md flex flex-col justify-between p-1.5 select-none font-bold">
              <span className={`text-xs ${FLASH_CARDS[cardIdx].card.includes('♥') || FLASH_CARDS[cardIdx].card.includes('♦') ? 'text-red-600' : 'text-slate-900'}`}>
                {FLASH_CARDS[cardIdx].card}
              </span>
              <span className={`text-center text-lg font-mono-telemetry font-bold ${FLASH_CARDS[cardIdx].card.includes('♥') || FLASH_CARDS[cardIdx].card.includes('♦') ? 'text-red-600' : 'text-slate-900'}`}>
                {FLASH_CARDS[cardIdx].card}
              </span>
              <span className="text-right text-[9px] text-slate-400">Hi-Lo</span>
            </div>

            <div className="flex-1 pl-4 space-y-2">
              <div className="text-xs text-slate-300 font-sans-arcade">
                {t.hiloTrainerSub}
                {flashFeedback && (
                  <span className={`block font-bold text-xs mt-0.5 ${flashFeedback.includes('CORRECT') ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {flashFeedback}
                  </span>
                )}
              </div>

              {/* Tap buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCardCountGuess(+1)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-[#14231E] hover:bg-[#1E362F] border border-emerald-500/50 text-emerald-400 font-bold font-mono-telemetry text-xs transition-colors cursor-pointer active:scale-95"
                >
                  +1
                </button>
                <button
                  onClick={() => handleCardCountGuess(0)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-[#1E2638] hover:bg-[#28334A] border border-slate-500/50 text-slate-300 font-bold font-mono-telemetry text-xs transition-colors cursor-pointer active:scale-95"
                >
                  0
                </button>
                <button
                  onClick={() => handleCardCountGuess(-1)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-[#2A1719] hover:bg-[#3D2024] border border-rose-500/50 text-rose-400 font-bold font-mono-telemetry text-xs transition-colors cursor-pointer active:scale-95"
                >
                  -1
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
