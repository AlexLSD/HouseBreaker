import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  RouletteVariant,
  RoulettePocket,
  RouletteBet,
  BetType,
  PocketInfo,
  getPocketInfo,
  evaluateSpin,
  SpinResult,
  EUROPEAN_WHEEL_ORDER,
  AMERICAN_WHEEL_ORDER
} from '../utils/rouletteEngine';
import { RouletteWheel } from './roulette/RouletteWheel';
import { RouletteTableFelt } from './roulette/RouletteTableFelt';
import { RouletteOddsAndTips } from './roulette/RouletteOddsAndTips';
import { RouletteDrill } from './roulette/RouletteDrill';
import { RouletteMonteCarloLab } from './roulette/RouletteMonteCarloLab';
import { RouletteGuide } from './roulette/RouletteGuide';
import { sounds } from '../utils/soundEffects';
import {
  AlertCircle,
  Award,
  BookOpen,
  CircleDot,
  Dices,
  Flame,
  HelpCircle,
  History,
  Info,
  Play,
  RotateCcw,
  Shield,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Zap
} from 'lucide-react';

interface RouletteLabProps {
  onOpenGuide?: () => void;
}

export const RouletteLab: React.FC<RouletteLabProps> = ({ onOpenGuide }) => {
  const { t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<
    'SIMULATOR' | 'ODDS_TIPS' | 'DRILL' | 'MONTE_CARLO' | 'GUIDE'
  >('SIMULATOR');

  const [variant, setVariant] = useState<RouletteVariant>('EUROPEAN');
  const [credits, setCredits] = useState<number>(2500);
  const [bets, setBets] = useState<RouletteBet[]>([]);
  const [activeChip, setActiveChip] = useState<number>(25);

  // Wheel animation states
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winningPocket, setWinningPocket] = useState<PocketInfo | null>(null);
  const [lastSpinResult, setLastSpinResult] = useState<SpinResult | null>(null);
  const [history, setHistory] = useState<PocketInfo[]>([]);

  // Total current wager on the felt
  const totalWager = bets.reduce((sum, b) => sum + b.amount, 0);

  // Handle placing or adding to a bet
  const handlePlaceBet = (
    type: BetType,
    label: string,
    numbers: RoulettePocket[],
    payoutRatio: number,
    betIdParam?: string
  ) => {
    if (credits < activeChip) {
      sounds.playLoss();
      return;
    }

    setCredits(prev => prev - activeChip);

    const betId = betIdParam || `${type}_${label}`;
    setBets(prev => {
      const existing = prev.find(b => b.id === betId);
      if (existing) {
        return prev.map(b =>
          b.id === betId ? { ...b, amount: b.amount + activeChip } : b
        );
      }
      return [
        ...prev,
        {
          id: betId,
          type,
          label,
          amount: activeChip,
          coveredNumbers: numbers,
          payoutRatio
        }
      ];
    });
  };

  const handleClearBets = () => {
    // Refund placed bets back to player credits
    setCredits(prev => prev + totalWager);
    setBets([]);
  };

  const handleDoubleBets = () => {
    if (credits < totalWager) return;
    setCredits(prev => prev - totalWager);
    setBets(prev => prev.map(b => ({ ...b, amount: b.amount * 2 })));
  };

  const handleSpin = () => {
    if (bets.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setLastSpinResult(null);

    // Determine random winning pocket
    const wheel = variant === 'AMERICAN' ? AMERICAN_WHEEL_ORDER : EUROPEAN_WHEEL_ORDER;
    const randomPocket = wheel[Math.floor(Math.random() * wheel.length)];
    const pocketInfo = getPocketInfo(randomPocket);
    setWinningPocket(pocketInfo);
  };

  const handleSpinComplete = () => {
    setIsSpinning(false);
    if (!winningPocket) return;

    // Evaluate payouts
    const result = evaluateSpin(winningPocket.value, bets, variant);
    setLastSpinResult(result);

    // Update player balance with total payout
    if (result.totalPayout > 0) {
      sounds.playWin();
      setCredits(prev => prev + result.totalPayout);
    } else {
      sounds.playLoss();
    }

    // Add to history (max 15)
    setHistory(prev => [winningPocket, ...prev.slice(0, 14)]);

    // Retain bets for convenience or clear
    // In standard casino, losing chips are swept, but keep felt ready
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 font-sans-arcade pb-12">
      {/* Top Header Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#0C1524] via-[#09111E] to-[#060B14] border-2 border-[#20304D] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-arcade text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
              <CircleDot className="w-3 h-3 text-amber-400" />
              CASINO ROULETTE SUITE
            </span>
            <span className="text-[11px] font-mono-telemetry text-emerald-400 font-bold">
              PHYSICS & PROBABILITY ENGINE
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold font-arcade text-white tracking-wide">
            {t.rouletteTitle}
          </h1>
          <p className="text-xs text-slate-400">
            {t.rouletteSubtitle}
          </p>
        </div>

        {/* Bankroll & Variant Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-start md:self-auto">
          {/* Variant Selector */}
          <div className="p-2 rounded-2xl bg-[#0B1322] border border-[#1E2E48]">
            <span className="text-[9px] text-slate-400 font-arcade uppercase block mb-1">
              {t.navRoulette}
            </span>
            <div className="flex items-center gap-1">
              {(['EUROPEAN', 'FRENCH', 'AMERICAN'] as RouletteVariant[]).map(v => (
                <button
                  key={v}
                  onClick={() => {
                    sounds.playClick();
                    setVariant(v);
                  }}
                  disabled={isSpinning}
                  className={`min-h-[32px] px-2 sm:px-2.5 py-1 rounded-lg text-[10px] font-arcade font-bold transition-all cursor-pointer ${
                    variant === v
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-[#15233A] text-slate-400 hover:text-white'
                  }`}
                >
                  {v === 'EUROPEAN' ? t.europeanVariant : v === 'FRENCH' ? t.frenchVariant : t.americanVariant}
                </button>
              ))}
            </div>
          </div>

          {/* Credits Counter */}
          <div className="p-2 sm:p-2.5 px-3 sm:px-4 rounded-2xl bg-[#091524] border border-[#1C3252] shadow-inner text-right">
            <span className="text-[9px] text-slate-400 font-arcade uppercase block">
              BANKROLL CREDITS
            </span>
            <span className="font-mono-telemetry font-black text-base sm:text-lg text-amber-300">
              ${credits}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs (Responsive grid on mobile & desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 p-1.5 rounded-2xl bg-[#0A101C] border border-[#1C283C] text-xs">
        {[
          { id: 'SIMULATOR', label: '🎰 Simulator' },
          { id: 'ODDS_TIPS', label: '💡 Odds & Tips' },
          { id: 'DRILL', label: '⚡ Speed Drill' },
          { id: 'MONTE_CARLO', label: '📊 Monte Carlo' },
          { id: 'GUIDE', label: '📚 Codex' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              sounds.playClick();
              setActiveSubTab(tab.id as unknown as typeof activeSubTab);
            }}
            className={`min-h-[42px] py-2 px-2 sm:px-3 rounded-xl font-arcade text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center ${
              activeSubTab === tab.id
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-Tab 1: ANIMATED SIMULATOR */}
      {activeSubTab === 'SIMULATOR' && (
        <div className="space-y-4">
          {/* Split Layout: Wheel on Left/Top, History & Controls on Right/Top */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* The Animated Wheel */}
            <div className="lg:col-span-5 p-4 rounded-3xl bg-[#0A101C] border border-[#1C2B42] shadow-xl flex flex-col items-center justify-center">
              <div className="w-full flex items-center justify-between text-xs px-2 mb-1">
                <span className="font-arcade text-slate-400 uppercase">
                  {variant} WHEEL CYLINDER
                </span>
                <span className="font-mono-telemetry text-amber-300 font-bold text-[11px]">
                  {variant === 'AMERICAN' ? '38 POCKETS (0 & 00)' : '37 POCKETS (SINGLE 0)'}
                </span>
              </div>

              <RouletteWheel
                variant={variant}
                winningPocket={winningPocket}
                isSpinning={isSpinning}
                onSpinComplete={handleSpinComplete}
              />
            </div>

            {/* Spin Panel, Telemetry & History */}
            <div className="lg:col-span-7 flex flex-col justify-between p-4 rounded-3xl bg-[#0A101C] border border-[#1C2B42] shadow-xl space-y-4">
              {/* History Ribbon */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-arcade text-slate-400 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-amber-400" />
                    {t.recentSpins}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono-telemetry">
                    15
                  </span>
                </div>

                <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-[#060B12] border border-[#162234] overflow-x-auto min-h-[44px]">
                  {history.length === 0 ? (
                    <span className="text-slate-600 text-xs italic px-2 font-mono-telemetry">
                      No spins recorded yet. Place your bets and spin the wheel!
                    </span>
                  ) : (
                    history.map((h, i) => (
                      <span
                        key={i}
                        className={`w-7 h-7 rounded-lg font-mono-telemetry font-bold text-xs flex items-center justify-center text-white shrink-0 shadow-sm animate-pop-in ${
                          h.color === 'red'
                            ? 'bg-red-600'
                            : h.color === 'black'
                            ? 'bg-slate-900 border border-slate-700'
                            : 'bg-emerald-600'
                        }`}
                      >
                        {h.value}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Current Bet Summary Banner */}
              <div className="p-3 rounded-2xl bg-[#0E1726] border border-[#20304C] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-arcade">STAKED WAGERS</span>
                  <span className="font-mono-telemetry font-bold text-amber-300 text-sm">
                    {bets.length} Positions (${totalWager})
                  </span>
                </div>

                {/* Placed bets chips pill list */}
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
                  {bets.length === 0 ? (
                    <span className="text-slate-600 text-[11px] italic font-arcade">
                      Tap any numbers or outside boxes on the felt below to place chips.
                    </span>
                  ) : (
                    bets.map(b => (
                      <span
                        key={b.id}
                        className="px-2 py-0.5 rounded-lg bg-black/40 border border-amber-400/30 text-amber-200 text-[10px] font-mono-telemetry flex items-center gap-1"
                      >
                        <strong>{b.label}:</strong> ${b.amount} ({b.payoutRatio}:1)
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Spin Resolution Banner */}
              {lastSpinResult && (
                <div
                  className={`p-3 rounded-2xl border text-xs space-y-1 animate-fade-in ${
                    lastSpinResult.netProfit > 0
                      ? 'bg-[#071F14] border-emerald-500/50 text-emerald-200'
                      : lastSpinResult.laPartageRefund > 0
                      ? 'bg-[#1C1608] border-amber-500/50 text-amber-200'
                      : 'bg-[#210D12] border-rose-500/50 text-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold font-arcade">
                    <span>
                      {lastSpinResult.netProfit > 0
                        ? `🎉 YOU WON $${lastSpinResult.totalPayout}!`
                        : lastSpinResult.laPartageRefund > 0
                        ? `🛡️ LA PARTAGE REFUND: $${lastSpinResult.laPartageRefund}`
                        : `HOUSE COLLECTS $${lastSpinResult.totalWagered}`}
                    </span>
                    <span className="font-mono-telemetry text-sm">
                      {lastSpinResult.netProfit >= 0 ? '+' : ''}
                      ${lastSpinResult.netProfit} Net
                    </span>
                  </div>
                  {lastSpinResult.winningBets.length > 0 && (
                    <p className="text-[10px] text-slate-300">
                      Hit on: {lastSpinResult.winningBets.map(w => w.bet.label).join(', ')}
                    </p>
                  )}
                </div>
              )}

              {/* Big Action Spin Button */}
              <button
                onClick={handleSpin}
                disabled={isSpinning || bets.length === 0}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-arcade font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 active:scale-98 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5 fill-current" />
                {isSpinning ? 'BALL IS IN MOTION...' : `SPIN WHEEL ($${totalWager} AT RISK)`}
              </button>
            </div>
          </div>

          {/* Live Odds, Chances of Winning & Tips Display */}
          <RouletteOddsAndTips variant={variant} bets={bets} />

          {/* Complete Interactive Felt */}
          <RouletteTableFelt
            variant={variant}
            bets={bets}
            onPlaceBet={handlePlaceBet}
            onClearBets={handleClearBets}
            onDoubleBets={handleDoubleBets}
            activeChip={activeChip}
            onSelectChip={setActiveChip}
            disabled={isSpinning}
          />
        </div>
      )}

      {/* Sub-Tab 2: ODDS, CHANCES & TIPS DEDICATED CENTER */}
      {activeSubTab === 'ODDS_TIPS' && (
        <div className="space-y-4">
          <RouletteOddsAndTips variant={variant} bets={bets} />

          <div className="p-4 rounded-3xl bg-[#0B121E] border border-[#1E2E44] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-amber-300 font-arcade">
                  Interactive Strategy Layout Felt
                </h4>
                <p className="text-xs text-slate-400">
                  Place bets on the felt below to immediately test win percentages, coverage, and EV calculations above
                </p>
              </div>
              <span className="text-xs font-mono-telemetry text-emerald-400 font-bold">
                {bets.length} Bets Placed (${totalWager})
              </span>
            </div>

            <RouletteTableFelt
              variant={variant}
              bets={bets}
              onPlaceBet={handlePlaceBet}
              onClearBets={handleClearBets}
              onDoubleBets={handleDoubleBets}
              activeChip={activeChip}
              onSelectChip={setActiveChip}
              disabled={isSpinning}
            />
          </div>
        </div>
      )}

      {/* Sub-Tab 3: SPEED DRILL */}
      {activeSubTab === 'DRILL' && <RouletteDrill />}

      {/* Sub-Tab 4: MONTE CARLO LAB */}
      {activeSubTab === 'MONTE_CARLO' && <RouletteMonteCarloLab variant={variant} />}

      {/* Sub-Tab 5: ADVANTAGE CODEX GUIDE */}
      {activeSubTab === 'GUIDE' && <RouletteGuide />}
    </div>
  );
};
