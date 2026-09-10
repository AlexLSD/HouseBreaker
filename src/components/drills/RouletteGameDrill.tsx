import React, { useState } from 'react';
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
} from '../../utils/rouletteEngine';
import { RouletteWheel } from '../roulette/RouletteWheel';
import { RouletteTableFelt } from '../roulette/RouletteTableFelt';
import { CasinoChipStack } from '../CasinoChipStack';
import { sounds } from '../../utils/soundEffects';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  CircleDot,
  Coins,
  Dices,
  Flame,
  HelpCircle,
  History,
  Info,
  Lightbulb,
  Play,
  RotateCcw,
  Shield,
  Sparkles,
  TrendingUp,
  Trophy,
  Zap
} from 'lucide-react';

interface RouletteGameDrillProps {
  currentCredits: number;
  onBet: (amount: number) => boolean;
  onWin: (amount: number, reason: string) => void;
  onMistake: (
    scenarioName: string,
    userChoice: string,
    expected: string,
    loss: number,
    why: string
  ) => void;
  onCorrect: () => void;
}

export const RouletteGameDrill: React.FC<RouletteGameDrillProps> = ({
  currentCredits,
  onBet,
  onWin,
  onMistake,
  onCorrect
}) => {
  const { language } = useLanguage();
  const [variant, setVariant] = useState<RouletteVariant>('EUROPEAN');
  const [bets, setBets] = useState<RouletteBet[]>([]);
  const [lastBets, setLastBets] = useState<RouletteBet[]>([]);
  const [activeChip, setActiveChip] = useState<number>(25);

  // Wheel animation states
  const [showZeroToHero, setShowZeroToHero] = useState<boolean>(false);
  const [isSpinningWheel, setIsSpinningWheel] = useState<boolean>(false);
  const [winningPocket, setWinningPocket] = useState<PocketInfo | null>(null);
  const [lastSpinResult, setLastSpinResult] = useState<SpinResult | null>(null);
  const [history, setHistory] = useState<PocketInfo[]>([]);
  const [spinOutcomeBanner, setSpinOutcomeBanner] = useState<{
    type: 'win' | 'loss';
    title: string;
    amount: number;
  } | null>(null);

  // Total current wager on felt
  const totalWager = bets.reduce((sum, b) => sum + b.amount, 0);

  // Place bet on felt
  const handlePlaceBet = (
    type: BetType,
    label: string,
    numbers: RoulettePocket[],
    payoutRatio: number,
    betIdParam?: string
  ) => {
    if (isSpinningWheel) return;

    if (currentCredits < totalWager + activeChip) {
      sounds.playLoss();
      return;
    }

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
    if (isSpinningWheel) return;
    sounds.playClick();
    setBets([]);
  };

  const handleDoubleBets = () => {
    if (isSpinningWheel || bets.length === 0) return;
    if (currentCredits < totalWager * 2) {
      sounds.playLoss();
      return;
    }
    sounds.playChip();
    setBets(prev => prev.map(b => ({ ...b, amount: b.amount * 2 })));
  };

  const handleRepeatLastBet = () => {
    if (isSpinningWheel || lastBets.length === 0) return;
    const prevWager = lastBets.reduce((sum, b) => sum + b.amount, 0);
    if (currentCredits < prevWager) {
      sounds.playLoss();
      return;
    }
    sounds.playChip();
    setBets(lastBets);
  };

  // Trigger wheel spin
  const handleSpinWheel = () => {
    if (bets.length === 0 || isSpinningWheel) return;

    if (currentCredits < totalWager) {
      sounds.playLoss();
      return;
    }

    // Deduct wager from bankroll
    const placed = onBet(totalWager);
    if (!placed) return;

    setIsSpinningWheel(true);
    setSpinOutcomeBanner(null);
    setLastSpinResult(null);

    // Save for repeat bet option
    setLastBets([...bets]);

    // Check for disadvantage trap bet (American Basket Bet)
    const basketBet = bets.find(b => b.type === 'BASKET');
    if (basketBet) {
      onMistake(
        'American 5-Number Basket Bet Trap',
        'Wagered $ ' + basketBet.amount + ' on 5-number basket (0,00,1,2,3)',
        'Avoid Basket Bet (Stick to 2.7% or 5.26% standard wagers)',
        basketBet.amount,
        'The Basket bet on American roulette extracts a devastating 7.89% house edge—50% worse than any other bet!'
      );
    }

    // Pick random pocket from active wheel order
    const wheel = variant === 'AMERICAN' ? AMERICAN_WHEEL_ORDER : EUROPEAN_WHEEL_ORDER;
    const randomPocket = wheel[Math.floor(Math.random() * wheel.length)];
    const pocketInfo = getPocketInfo(randomPocket);
    setWinningPocket(pocketInfo);
  };

  // Called when wheel animation concludes
  const handleSpinComplete = () => {
    setIsSpinningWheel(false);
    if (!winningPocket) return;

    // Evaluate all bets
    const result = evaluateSpin(winningPocket.value, bets, variant);
    setLastSpinResult(result);

    // Record in history
    setHistory(prev => [winningPocket, ...prev.slice(0, 14)]);

    if (result.totalPayout > 0) {
      sounds.playWin();
      sounds.playChipCollect();
      onWin(
        result.totalPayout,
        `Roulette #${winningPocket.value} (${winningPocket.color.toUpperCase()}): Won $${result.totalPayout}`
      );
      onCorrect();
      setSpinOutcomeBanner({
        type: 'win',
        title: `POCKET #${winningPocket.value} (${winningPocket.color.toUpperCase()}) HIT!`,
        amount: result.totalPayout
      });
    } else {
      sounds.playLoss();
      sounds.playChipsBurn();
      setSpinOutcomeBanner({
        type: 'loss',
        title: `POCKET #${winningPocket.value} (${winningPocket.color.toUpperCase()}) - NO HIT`,
        amount: totalWager
      });
    }

    // Clear felt bets for next spin
    setBets([]);
  };

  // House edge description
  const houseEdgeText =
    variant === 'EUROPEAN'
      ? '2.70% (Single Zero)'
      : variant === 'FRENCH'
      ? '1.35% (La Partage Even Money)'
      : '5.26% (Double Zero 0 & 00)';

  return (
    <div className="space-y-4 font-sans-arcade">
      {/* Top Telemetry & Variant Bar */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0C1524] border-2 border-[#1E2E48] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
            <CircleDot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white font-arcade uppercase tracking-wider">
                Live Roulette Table Simulation
              </h2>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono-telemetry border border-amber-400/40">
                ACTIVE FELT
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Place real chips on the felt layout, spin the wheel & experience authentic casino physics
            </p>
          </div>
        </div>

        {/* Variant Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowZeroToHero(s => !s)}
            className="px-2.5 py-1.5 rounded-xl bg-[#111C2E] hover:bg-[#182842] border border-amber-400/30 text-amber-300 font-arcade text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Zero to Hero Guide</span>
          </button>

          <div className="p-1.5 rounded-xl bg-[#08101A] border border-[#1A2638] flex items-center gap-1">
            {(['EUROPEAN', 'FRENCH', 'AMERICAN'] as RouletteVariant[]).map(v => (
              <button
                key={v}
                onClick={() => {
                  if (isSpinningWheel) return;
                  sounds.playClick();
                  setVariant(v);
                  setBets([]);
                }}
                disabled={isSpinningWheel}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-arcade font-bold transition-all cursor-pointer ${
                  variant === v
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-[#121E30] text-slate-400 hover:text-white'
                }`}
              >
                {v === 'EUROPEAN' ? 'EU (2.7%)' : v === 'FRENCH' ? 'FR (1.35%)' : 'US (5.26%)'}
              </button>
            ))}
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-[#1E2E48] text-right">
            <span className="text-[9px] text-slate-400 font-arcade block">HOUSE EDGE</span>
            <span className="text-[11px] font-mono-telemetry font-bold text-amber-300">
              {houseEdgeText}
            </span>
          </div>
        </div>
      </div>

      {/* Zero to Hero Roulette Explanation Drawer */}
      {showZeroToHero && (
        <div className="p-3.5 rounded-2xl bg-[#09101C] border border-amber-400/40 text-xs space-y-2.5 animate-fade-in shadow-xl text-slate-200">
          <div className="flex items-center justify-between border-b border-[#1E2E48] pb-1.5">
            <span className="font-arcade font-bold text-amber-300 flex items-center gap-1.5 uppercase text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {language === 'ru'
                ? 'Рулетка и преимущество казино: От Новичка До Профессионала'
                : language === 'he'
                ? 'רולטה ויתרון הבית: מדריך מאפס למקצוען'
                : 'Roulette & House Edge: Zero to Hero Demystified'}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono-telemetry font-bold">
              PHYSICS & EDGE PROTOCOL
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] leading-relaxed">
            <div className="p-2.5 rounded-xl bg-[#070D18] border border-[#1C2940] space-y-1">
              <strong className="text-amber-300 font-arcade block">
                {language === 'ru' ? '1. Почему казино побеждает (Зеленый 0)' : language === 'he' ? '1. למה הקזינו מרוויח (ה-0 הירוק)' : '1. Why the Casino Wins (The Green 0)'}
              </strong>
              <p className="text-slate-300">
                {language === 'ru'
                  ? 'В европейском колесе 37 ячеек (1-36 + 0). Выплата за число 35:1 при реальных шансах 36:1! Недостающая 1/37 часть и дает казино математический перевес в 2.70%.'
                  : language === 'he'
                  ? 'ברולטה אירופית 37 תאים (1-36 ועוד 0). תשלום על מספר הוא 35:1 כשהסיכוי האמיתי הוא 36:1! החלק החסר מייצר יתרון בית של 2.70%.'
                  : 'A single-zero wheel has 37 pockets (1-36 + 0). Payout on a single number is 35:1. True odds are 36:1! The missing 1/37 is where the 2.70% house edge comes from.'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070D18] border border-[#1C2940] space-y-1">
              <strong className="text-emerald-300 font-arcade block">
                {language === 'ru' ? '2. Французское правило La Partage (1.35%)' : language === 'he' ? '2. חוק La Partage הצרפתי (1.35%)' : '2. French La Partage (1.35% Edge)'}
              </strong>
              <p className="text-slate-300">
                {language === 'ru'
                  ? 'Во французской рулетке при выпадении 0 возвращается 50% ставки на равные шансы (Красное/Черное, Чет/Нечет). Это снижает перевес казино вдвое — до 1.35%!'
                  : language === 'he'
                  ? 'ברולטה צרפתית, אם הכדור נוחת ב-0, מוחזר 50% מהימורי הסיכוי השווה (אדום/שחור, זוגי/אי-זוגי). זה חותך את יתרון הבית בחצי ל-1.35% בלבד!'
                  : 'On French tables, when the ball lands on 0, you only forfeit 50% of even-money bets (Red/Black, Odd/Even, 1-18/19-36). This cuts the house edge in half to 1.35%!'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070D18] border border-[#1C2940] space-y-1">
              <strong className="text-rose-300 font-arcade block">
                {language === 'ru' ? '3. Ловушка "Ошибки игрока"' : language === 'he' ? '3. מלכודת כשל המהמר' : '3. The Gambler\'s Fallacy Trap'}
              </strong>
              <p className="text-slate-300">
                {language === 'ru'
                  ? '«Красное выпало 5 раз подряд, сейчас точно черное!» — ЛОЖЬ. У колеса нет памяти. Каждый спин абсолютно независим (18/37 = 48.65%).'
                  : language === 'he'
                  ? '"אדום יצא 5 פעמים ברצף, עכשיו חייב לצאת שחור!" - טעות חמורה. לגלגל אין זיכרון. לכל סיבוב הסתברות זהה (48.65%).'
                  : '"Red hit 5 times in a row, Black must hit next!" FALSE. The wheel has no memory. Each spin has the exact same independent probability (18/37 = 48.65%).'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Wheel & History Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        {/* Animated 3D Roulette Wheel */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl bg-gradient-to-b from-[#08130E] via-[#05140C] to-[#040C08] border-2 border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[10px] text-emerald-400 font-arcade">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PHYSICS WHEEL ENGINE</span>
          </div>

          <div className="my-2 scale-90 sm:scale-100">
            <RouletteWheel
              variant={variant}
              winningPocket={winningPocket}
              isSpinning={isSpinningWheel}
              onSpinComplete={handleSpinComplete}
            />
          </div>

          {/* Winning Pocket Result Announcement */}
          {winningPocket && !isSpinningWheel && (
            <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-xl bg-black/80 border border-amber-400/50 animate-fade-in shadow-lg">
              <span className="text-[10px] text-slate-400 font-arcade">RESULT:</span>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-md ${
                  winningPocket.color === 'red'
                    ? 'bg-red-600'
                    : winningPocket.color === 'black'
                    ? 'bg-slate-900 border border-white/30'
                    : 'bg-emerald-600'
                }`}
              >
                {winningPocket.value}
              </span>
              <span className="font-arcade text-xs text-amber-300 font-bold uppercase">
                {winningPocket.color} {winningPocket.value === 0 || winningPocket.value === '00' ? 'ZERO' : winningPocket.isEven ? 'EVEN' : 'ODD'}
              </span>
            </div>
          )}
        </div>

        {/* Right Info: Spin Outcome, Hot/Cold History, Advantage Callout */}
        <div className="lg:col-span-5 space-y-2.5">
          {/* Spin Result Banner */}
          {spinOutcomeBanner && (
            <div
              className={`p-3.5 rounded-2xl border-2 text-xs animate-fade-in shadow-lg ${
                spinOutcomeBanner.type === 'win'
                  ? 'bg-[#091F14] border-emerald-400 text-emerald-100'
                  : 'bg-[#220B10] border-rose-500 text-rose-100'
              }`}
            >
              <div className="flex items-center justify-between font-arcade font-bold">
                <span>{spinOutcomeBanner.title}</span>
                <span className="font-mono-telemetry text-sm">
                  {spinOutcomeBanner.type === 'win' ? `+$${spinOutcomeBanner.amount}` : `-$${spinOutcomeBanner.amount}`}
                </span>
              </div>
              {lastSpinResult && lastSpinResult.winningBets.length > 0 && (
                <div className="mt-2 space-y-1 pt-2 border-t border-emerald-500/30 text-[11px] font-mono-telemetry">
                  <div className="text-emerald-300 font-bold">Winning Hits:</div>
                  {lastSpinResult.winningBets.map((wb, idx) => (
                    <div key={idx} className="flex justify-between text-slate-200">
                      <span>• {wb.bet.label} ({wb.bet.payoutRatio}:1)</span>
                      <span className="text-emerald-400 font-bold">+${wb.winAmount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Live Table History & Streaks */}
          <div className="p-3 rounded-2xl bg-[#0A101C] border border-[#1A2638] text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 font-arcade uppercase flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-amber-400" />
                RECENT WHEEL SPINS
              </span>
              <span className="text-[9px] text-slate-500 font-mono-telemetry">
                {history.length} SPINS LOGGED
              </span>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-2 text-[11px] text-slate-500 font-mono-telemetry">
                No spins yet. Place bets and press SPIN WHEEL.
              </div>
            ) : (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {history.map((h, idx) => (
                  <div
                    key={idx}
                    className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs font-mono text-white shadow-xs ${
                      h.color === 'red'
                        ? 'bg-red-600'
                        : h.color === 'black'
                        ? 'bg-slate-900 border border-slate-700'
                        : 'bg-emerald-600'
                    }`}
                    title={`#${h.value} ${h.color}`}
                  >
                    {h.value}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Advantage Math & EV Tip */}
          <div className="p-3 rounded-2xl bg-[#0C1524] border border-[#1C2C45] text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-arcade text-[11px] font-bold">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>ADVANTAGE PLAY TELEMETRY</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {variant === 'FRENCH' ? (
                <span>
                  <strong className="text-emerald-400">French Roulette (1.35% Edge):</strong> The "La Partage" rule automatically refunds 50% of Even-Money wagers when Zero hits. Always prefer French tables over American.
                </span>
              ) : variant === 'AMERICAN' ? (
                <span>
                  <strong className="text-rose-400">American Double-Zero Trap (5.26% Edge):</strong> The presence of "00" almost doubles the casino tax compared to European single-zero. Avoid the 5-number basket at all costs!
                </span>
              ) : (
                <span>
                  <strong className="text-amber-300">European Single-Zero (2.70% Edge):</strong> 37 total pockets ensure that inside and outside wagers carry identical expected values. The wheel is memoryless—past streaks do not alter future spins.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Main Betting Table Felt */}
      <div className="p-3 sm:p-4 rounded-3xl bg-[#041108] border-2 border-emerald-600/40 shadow-2xl relative">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-arcade font-bold text-emerald-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              TABLE FELT BETTING SPOT
            </span>
            <span className="text-[10px] text-slate-400 font-mono-telemetry">
              (Click any number or area to place chips)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-arcade text-amber-300 font-bold">
              TOTAL WAGER: ${totalWager}
            </span>
            {totalWager > 0 && (
              <CasinoChipStack amount={totalWager} size="xs" />
            )}
          </div>
        </div>

        {/* Betting Felt Component */}
        <RouletteTableFelt
          variant={variant}
          bets={bets}
          onPlaceBet={handlePlaceBet}
          onClearBets={handleClearBets}
          onDoubleBets={handleDoubleBets}
          activeChip={activeChip}
          onSelectChip={setActiveChip}
          disabled={isSpinningWheel}
        />

        {/* Felt Action Buttons & Spin Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-emerald-900/60">
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearBets}
              disabled={isSpinningWheel || bets.length === 0}
              className="px-3 py-1.5 rounded-xl bg-[#1A1215] hover:bg-[#2C1920] border border-rose-500/40 text-rose-300 font-arcade text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              CLEAR FELT
            </button>
            <button
              onClick={handleDoubleBets}
              disabled={isSpinningWheel || bets.length === 0 || currentCredits < totalWager * 2}
              className="px-3 py-1.5 rounded-xl bg-[#14261C] hover:bg-[#1E3A2B] border border-emerald-500/40 text-emerald-300 font-arcade text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              DOUBLE (2X)
            </button>
            {lastBets.length > 0 && bets.length === 0 && (
              <button
                onClick={handleRepeatLastBet}
                disabled={isSpinningWheel}
                className="px-3 py-1.5 rounded-xl bg-[#162234] hover:bg-[#223552] border border-sky-500/40 text-sky-300 font-arcade text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
              >
                REBET
              </button>
            )}
          </div>

          {/* Big Spin Button */}
          <button
            onClick={handleSpinWheel}
            disabled={isSpinningWheel || bets.length === 0 || currentCredits < totalWager}
            className={`px-6 py-2.5 rounded-2xl font-arcade font-bold text-sm tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xl active:scale-95 ${
              isSpinningWheel
                ? 'bg-[#15233A] text-slate-400 cursor-not-allowed border border-slate-700'
                : bets.length === 0
                ? 'bg-[#0E1B15] text-slate-500 border border-emerald-950 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 ring-2 ring-amber-300 shadow-amber-950/50 animate-pulse'
            }`}
          >
            <Play className={`w-4 h-4 ${isSpinningWheel ? 'animate-spin' : 'fill-slate-950'}`} />
            <span>
              {isSpinningWheel
                ? 'SPINNING WHEEL...'
                : bets.length === 0
                ? 'PLACE BETS TO SPIN'
                : `SPIN WHEEL ($${totalWager})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
