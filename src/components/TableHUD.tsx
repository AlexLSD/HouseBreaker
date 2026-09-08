import React, { useState, useEffect } from 'react';
import {
  CardBitfield,
  CardRank,
  CardSuit,
  DecisionAdvice,
  PlayerSeatState,
  ShoeState
} from '../types';
import {
  computeBlackjackHandValue,
  computeShoeTelemetry,
  createCard,
  createShoe,
  getBlackjackAdvice,
  calculateMDF,
  calculatePotOdds,
  computeKellyBet
} from '../utils/mathEngine';
import {
  AlertTriangle,
  Award,
  ChevronRight,
  CircleDot,
  Coins,
  Flame,
  Info,
  Layers,
  Plus,
  Minus,
  RotateCcw,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Zap
} from 'lucide-react';

interface TableHUDProps {
  onOpenGuide?: () => void;
}

export const TableHUD: React.FC<TableHUDProps> = ({ onOpenGuide }) => {
  const [activeGame, setActiveGame] = useState<'BLACKJACK' | 'HOLDEM'>('BLACKJACK');

  // --------------------------------------------------------
  // BLACKJACK STATE
  // --------------------------------------------------------
  const [initialDecks] = useState(6);
  const [shoe, setShoe] = useState<CardBitfield[]>([]);
  const [exposedCards, setExposedCards] = useState<CardBitfield[]>([]);
  const [manualCountOffset, setManualCountOffset] = useState<number>(0);
  const [shoeTelemetry, setShoeTelemetry] = useState<ShoeState>({
    initialDecks: 6,
    cardsRemaining: 312,
    runningCount: 0,
    trueCount: 0,
    penetration: 0,
    rankFrequencies: { '2': 24, '3': 24, '4': 24, '5': 24, '6': 24, '7': 24, '8': 24, '9': 24, 'T': 24, 'J': 24, 'Q': 24, 'K': 24, 'A': 24 }
  });

  const [dealerHand, setDealerHand] = useState<CardBitfield[]>([]);
  const [dealerRevealed, setDealerRevealed] = useState(false);
  const [seats, setSeats] = useState<{ id: number; cards: CardBitfield[]; bet: number; isHero: boolean; isDone: boolean }[]>([
    { id: 1, cards: [], bet: 25, isHero: false, isDone: false },
    { id: 2, cards: [], bet: 25, isHero: false, isDone: false },
    { id: 3, cards: [], bet: 100, isHero: true, isDone: false }, // Hero seat
    { id: 4, cards: [], bet: 25, isHero: false, isDone: false },
    { id: 5, cards: [], bet: 50, isHero: false, isDone: false },
    { id: 6, cards: [], bet: 25, isHero: false, isDone: false },
    { id: 7, cards: [], bet: 25, isHero: false, isDone: false },
  ]);
  const [activeSeatIndex, setActiveSeatIndex] = useState(2); // Hero is seat 3 (idx 2)
  const [roundEnded, setRoundEnded] = useState(false);

  // Initialize shoe on mount
  useEffect(() => {
    resetShoe();
  }, []);

  const resetShoe = () => {
    const newShoe = createShoe(initialDecks);
    setShoe(newShoe);
    setExposedCards([]);
    setManualCountOffset(0);
    setShoeTelemetry(computeShoeTelemetry(initialDecks, []));
    dealInitialBlackjackRound(newShoe, []);
  };

  const dealInitialBlackjackRound = (currentShoe = shoe, currentExposed = exposedCards) => {
    let shoeCopy = [...currentShoe];
    let exposedCopy = [...currentExposed];

    // If shoe penetration > 75%, reshuffle
    if (shoeCopy.length < 52 * 1.5) {
      shoeCopy = createShoe(initialDecks);
      exposedCopy = [];
    }

    const newSeats = seats.map(s => ({
      ...s,
      cards: [] as CardBitfield[],
      isDone: false
    }));

    // Deal 2 cards to each seat
    for (let c = 0; c < 2; c++) {
      for (let s = 0; s < newSeats.length; s++) {
        if (shoeCopy.length > 0) {
          const card = shoeCopy.pop()!;
          newSeats[s].cards.push(card);
          exposedCopy.push(card);
        }
      }
    }

    // Deal 2 cards to dealer
    const newDealer: CardBitfield[] = [];
    if (shoeCopy.length >= 2) {
      const upcard = shoeCopy.pop()!;
      const holecard = shoeCopy.pop()!;
      newDealer.push(upcard, holecard);
      exposedCopy.push(upcard); // Hole card not yet counted until revealed
    }

    setShoe(shoeCopy);
    setExposedCards(exposedCopy);
    setSeats(newSeats);
    setDealerHand(newDealer);
    setDealerRevealed(false);
    setRoundEnded(false);
    setActiveSeatIndex(2); // Focus hero
    setShoeTelemetry(computeShoeTelemetry(initialDecks, exposedCopy));
  };

  const handleHeroHit = () => {
    if (roundEnded || shoe.length === 0) return;
    const shoeCopy = [...shoe];
    const card = shoeCopy.pop()!;
    const exposedCopy = [...exposedCards, card];

    const updatedSeats = [...seats];
    updatedSeats[activeSeatIndex].cards.push(card);

    const handVal = computeBlackjackHandValue(updatedSeats[activeSeatIndex].cards);
    if (handVal.total >= 21) {
      updatedSeats[activeSeatIndex].isDone = true;
    }

    setShoe(shoeCopy);
    setExposedCards(exposedCopy);
    setSeats(updatedSeats);
    setShoeTelemetry(computeShoeTelemetry(initialDecks, exposedCopy));
  };

  const handleHeroStand = () => {
    const updatedSeats = [...seats];
    updatedSeats[activeSeatIndex].isDone = true;
    setSeats(updatedSeats);

    // Dealer turn
    revealDealer();
  };

  const handleHeroDouble = () => {
    if (roundEnded || shoe.length === 0) return;
    const shoeCopy = [...shoe];
    const card = shoeCopy.pop()!;
    const exposedCopy = [...exposedCards, card];

    const updatedSeats = [...seats];
    updatedSeats[activeSeatIndex].bet *= 2;
    updatedSeats[activeSeatIndex].cards.push(card);
    updatedSeats[activeSeatIndex].isDone = true;

    setShoe(shoeCopy);
    setExposedCards(exposedCopy);
    setSeats(updatedSeats);
    setShoeTelemetry(computeShoeTelemetry(initialDecks, exposedCopy));
    revealDealer();
  };

  const revealDealer = () => {
    setDealerRevealed(true);
    let dealerCards = [...dealerHand];
    let shoeCopy = [...shoe];
    let exposedCopy = [...exposedCards];

    // Add holecard to exposed if not yet counted
    if (dealerCards[1] && !exposedCopy.includes(dealerCards[1])) {
      exposedCopy.push(dealerCards[1]);
    }

    // Dealer hits to soft 17
    let dVal = computeBlackjackHandValue(dealerCards);
    while (dVal.total < 17 && shoeCopy.length > 0) {
      const c = shoeCopy.pop()!;
      dealerCards.push(c);
      exposedCopy.push(c);
      dVal = computeBlackjackHandValue(dealerCards);
    }

    setDealerHand(dealerCards);
    setShoe(shoeCopy);
    setExposedCards(exposedCopy);
    setRoundEnded(true);
    setShoeTelemetry(computeShoeTelemetry(initialDecks, exposedCopy));
  };

  // Compute effective counts with any manual user adjustment
  const effectiveRunningCount = shoeTelemetry.runningCount + manualCountOffset;
  const decksRemaining = Math.max(0.5, shoeTelemetry.cardsRemaining / 52);
  const effectiveTrueCount = parseFloat((effectiveRunningCount / decksRemaining).toFixed(1));

  // Compute Advice for Hero Seat
  const heroSeat = seats[2];
  const dealerUpCard = dealerHand[0] || createCard('T', 's');
  const advice: DecisionAdvice = heroSeat.cards.length > 0
    ? getBlackjackAdvice(heroSeat.cards, dealerUpCard, effectiveTrueCount)
    : {
        primaryAction: 'DEAL HAND',
        actionType: 'STAND',
        ev: 0,
        isDeviation: false,
        playerAdvantage: 0
      };

  const heroHandVal = computeBlackjackHandValue(heroSeat.cards);
  const dealerVal = computeBlackjackHandValue(dealerHand);
  const kellyRec = computeKellyBet(10000, effectiveTrueCount, 0.5, 25, 25);

  // --------------------------------------------------------
  // POKER 6-MAX STATE
  // --------------------------------------------------------
  const [pokerPot, setPokerPot] = useState(120);
  const [incomingBet, setIncomingBet] = useState(60);
  const [heroStackBB] = useState(100);
  const pokerMDF = calculateMDF(pokerPot, incomingBet);
  const pokerPotOdds = calculatePotOdds(pokerPot, incomingBet);

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans-arcade">
      {/* Top Arcade Navigation & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#121826] to-[#0F1420] border-2 border-[#2A3750] rounded-2xl p-3.5 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-arcade uppercase tracking-wider flex items-center gap-1.5">
              HouseBreaker Table Felt
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#10B981]/20 text-emerald-300 font-mono-telemetry border border-[#10B981]/40">
                PRO AP
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Live shoe counting, Illustrious 18 index deviations & optimal chip spreads
            </p>
          </div>
        </div>

        {/* Game Mode Switcher Buttons & Info Guide */}
        <div className="flex items-center gap-2">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#141F33] hover:bg-[#1E2F4C] border border-sky-500/40 text-sky-300 hover:text-white text-xs font-arcade transition-all cursor-pointer shadow-sm active:scale-95"
              title="Explain Blackjack rules, Hi-Lo counting & Illustrious 18 (i)"
            >
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden xs:inline">Blackjack Guide (i)</span>
              <span className="xs:hidden">(i)</span>
            </button>
          )}

          <div className="flex items-center bg-[#070A10] p-1 rounded-xl border border-[#232F46] text-xs font-arcade">
            <button
              onClick={() => setActiveGame('BLACKJACK')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeGame === 'BLACKJACK'
                  ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#0A0D14] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Blackjack 6-Deck
            </button>
            <button
              onClick={() => setActiveGame('HOLDEM')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeGame === 'HOLDEM'
                  ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#0A0D14] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Texas Hold’em 6-Max
            </button>
          </div>
        </div>
      </div>

      {activeGame === 'BLACKJACK' ? (
        <>
          {/* Card Counter & Floor Practical Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-[#0F1522] border border-[#232F46] shadow-sm">
              <span className="text-[10px] text-slate-400 block font-sans-arcade">RUNNING COUNT (RC)</span>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xl font-bold font-mono-telemetry ${
                  effectiveRunningCount > 0 ? 'text-emerald-400' : effectiveRunningCount < 0 ? 'text-rose-400' : 'text-slate-200'
                }`}>
                  {effectiveRunningCount > 0 ? `+${effectiveRunningCount}` : effectiveRunningCount}
                </span>
                <span className="text-[10px] text-slate-400 font-mono-telemetry">
                  {decksRemaining.toFixed(1)} decks left
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#0F1522] border border-[#232F46] shadow-sm">
              <span className="text-[10px] text-slate-400 block font-sans-arcade">TRUE COUNT (TC)</span>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xl font-bold font-mono-telemetry ${
                  effectiveTrueCount >= 2 ? 'text-emerald-400' : effectiveTrueCount < 0 ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {effectiveTrueCount > 0 ? `+${effectiveTrueCount}` : effectiveTrueCount}
                </span>
                {effectiveTrueCount >= 2 ? (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                    +EV ADVANTAGE
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono-telemetry">Min Bet</span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#0F1522] border border-[#232F46] shadow-sm">
              <span className="text-[10px] text-slate-400 block font-sans-arcade">RECOMMENDED BET</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-bold font-mono-telemetry text-white">
                  ${kellyRec.suggestedBetAmount}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                  {kellyRec.chipUnits} Units
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#0F1522] border border-[#232F46] shadow-sm">
              <span className="text-[10px] text-slate-400 block font-sans-arcade">PLAYER EDGE</span>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xl font-bold font-mono-telemetry ${
                  advice.playerAdvantage > 0 ? 'text-emerald-400' : 'text-slate-300'
                }`}>
                  {advice.playerAdvantage > 0 ? `+${advice.playerAdvantage}%` : `${advice.playerAdvantage}%`}
                </span>
                <span className="text-[10px] text-slate-400 font-mono-telemetry">
                  {Math.round(shoeTelemetry.penetration * 100)}% Shoe Cut
                </span>
              </div>
            </div>
          </div>

          {/* Practical Live Tap-to-Count Controller */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#070A10] border border-[#1E293F] text-xs">
            <span className="text-[11px] text-slate-300 font-arcade flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Manual Tap-Count Sync:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setManualCountOffset(o => o + 1)}
                className="px-2.5 py-1 rounded bg-[#13261F] hover:bg-[#1E3B30] text-emerald-400 font-mono-telemetry font-bold text-xs border border-emerald-500/40 transition-colors cursor-pointer"
                title="Cards 2-6 dealt: +1"
              >
                +1 (2-6)
              </button>
              <button
                onClick={() => {}}
                className="px-2 py-1 rounded bg-[#172030] text-slate-400 font-mono-telemetry font-bold text-xs border border-slate-600/30"
                title="Cards 7-9 dealt: 0 (No change)"
              >
                0 (7-9)
              </button>
              <button
                onClick={() => setManualCountOffset(o => o - 1)}
                className="px-2.5 py-1 rounded bg-[#2D161A] hover:bg-[#422026] text-rose-400 font-mono-telemetry font-bold text-xs border border-rose-500/40 transition-colors cursor-pointer"
                title="Cards 10-A dealt: -1"
              >
                -1 (10-A)
              </button>
              {manualCountOffset !== 0 && (
                <button
                  onClick={() => setManualCountOffset(0)}
                  className="px-2 py-1 rounded bg-[#243048] hover:bg-[#334466] text-amber-300 text-[10px] font-mono-telemetry transition-colors cursor-pointer"
                >
                  Reset Offset ({manualCountOffset > 0 ? `+${manualCountOffset}` : manualCountOffset})
                </button>
              )}
            </div>
          </div>

          {/* Blackjack Felt Table Canvas (Arcade Felt Aesthetic) */}
          <div className="rounded-3xl bg-gradient-to-b from-[#072418] via-[#051A11] to-[#03100B] border-4 border-[#2F4D3D] p-4 sm:p-5 relative shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-between">
            {/* Vintage Casino Table Gold Inscription */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-600/10 via-transparent to-transparent pointer-events-none" />

            {/* Dealer Stage */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-[#030E09]/80 border border-emerald-500/40 text-[11px] text-emerald-300 font-arcade tracking-wider mb-3 shadow-md">
                <span>BLACKJACK PAYS 3 TO 2 • DEALER STANDS ON ALL 17</span>
              </div>

              {/* Dealer Cards */}
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-amber-200/80 font-arcade uppercase tracking-wider mb-1.5">
                  DEALER {dealerRevealed ? `(${dealerVal.total})` : `UPCARD`}
                </span>
                <div className="flex items-center gap-2.5">
                  {dealerHand.map((card, idx) => {
                    const isHidden = idx === 1 && !dealerRevealed;
                    return (
                      <div
                        key={idx}
                        className={`w-14 h-20 sm:w-16 sm:h-24 rounded-xl flex flex-col justify-between p-2 font-bold font-mono border-2 shadow-xl transition-all duration-300 ${
                          idx === 0
                            ? 'animate-deal-card'
                            : isHidden
                            ? 'bg-[#1C2538] border-[#374563] text-slate-500 items-center justify-center'
                            : 'animate-flip-card bg-white border-amber-300/80 shadow-black/50'
                        } ${
                          !isHidden && (card.suit === 'h' || card.suit === 'd')
                            ? 'text-red-600'
                            : !isHidden
                            ? 'text-slate-950'
                            : ''
                        }`}
                      >
                        {isHidden ? (
                          <div className="w-full h-full rounded-lg border-2 border-dashed border-[#374563] flex items-center justify-center text-xl text-amber-400 font-arcade">
                            🂠
                          </div>
                        ) : (
                          <>
                            <div className="text-xs sm:text-sm leading-none">{card.rank}</div>
                            <div className="text-lg sm:text-2xl self-center leading-none">
                              {card.suit === 'h' ? '♥' : card.suit === 'd' ? '♦' : card.suit === 'c' ? '♣' : '♠'}
                            </div>
                            <div className="text-xs sm:text-sm leading-none self-end rotate-180">{card.rank}</div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 7-Seat Curved Table Felt */}
            <div className="relative z-10 grid grid-cols-7 gap-1 sm:gap-2 my-4">
              {seats.map((seat) => {
                const isCurrentActive = seat.id === 3;
                const handValue = computeBlackjackHandValue(seat.cards);
                return (
                  <div
                    key={seat.id}
                    onClick={() => setActiveSeatIndex(seat.id - 1)}
                    className={`flex flex-col items-center justify-between p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                      seat.isHero
                        ? 'bg-gradient-to-b from-[#F59E0B]/20 to-[#F59E0B]/5 border-[#F59E0B] shadow-lg shadow-[#F59E0B]/20 scale-105'
                        : isCurrentActive
                        ? 'bg-[#1E293B] border-slate-400'
                        : 'bg-[#030E09]/80 border-emerald-900/50 opacity-85 hover:opacity-100'
                    }`}
                  >
                    {/* Seat Label */}
                    <div className="text-[10px] font-arcade font-bold tracking-wider text-slate-300">
                      {seat.isHero ? <span className="text-amber-400">YOU (HERO)</span> : `SEAT ${seat.id}`}
                    </div>

                    {/* Cards Pod */}
                    <div className="flex -space-x-4 my-1.5">
                      {seat.cards.map((c, cIdx) => (
                        <div
                          key={cIdx}
                          className={`w-8 h-12 sm:w-9 sm:h-14 rounded-lg bg-white text-slate-900 border border-slate-400 flex flex-col justify-between p-1 shadow-md font-mono text-[10px] font-bold animate-deal-card-fast ${
                            c.suit === 'h' || c.suit === 'd' ? 'text-red-600' : 'text-slate-900'
                          }`}
                          style={{ animationDelay: `${cIdx * 0.05}s` }}
                        >
                          <span>{c.rank}</span>
                          <span className="self-center text-xs">
                            {c.suit === 'h' ? '♥' : c.suit === 'd' ? '♦' : c.suit === 'c' ? '♣' : '♠'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Hand Total & Chip Bet */}
                    <div className="text-center font-mono-telemetry text-[10px]">
                      <span className={`font-bold ${handValue.total > 21 ? 'text-rose-400' : 'text-white'}`}>
                        {handValue.total > 21 ? 'BUST' : handValue.total}
                      </span>
                      <span className="block text-amber-300 text-[9px] font-bold">${seat.bet}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tactical Arcade Action Buttons */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3 border-t-2 border-[#1B3628]">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleHeroHit}
                  disabled={roundEnded || heroHandVal.total >= 21}
                  className="px-4 py-2 rounded-xl bg-gradient-to-b from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] disabled:opacity-30 disabled:cursor-not-allowed text-[#03100B] font-arcade font-bold text-xs tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  HIT
                </button>
                <button
                  onClick={handleHeroStand}
                  disabled={roundEnded}
                  className="px-4 py-2 rounded-xl bg-gradient-to-b from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] disabled:opacity-30 disabled:cursor-not-allowed text-[#0A0D14] font-arcade font-bold text-xs tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  STAND
                </button>
                <button
                  onClick={handleHeroDouble}
                  disabled={roundEnded || heroSeat.cards.length !== 2}
                  className="px-3.5 py-2 rounded-xl bg-[#23334E] hover:bg-[#304568] disabled:opacity-30 disabled:cursor-not-allowed text-amber-300 font-arcade font-bold text-xs tracking-wider transition-all border border-amber-400/40 active:scale-95 cursor-pointer"
                >
                  DOUBLE
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => dealInitialBlackjackRound()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] text-[#0A0D14] font-arcade font-bold text-xs tracking-wider transition-all shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  NEXT DEAL
                </button>
                <button
                  onClick={resetShoe}
                  className="p-2 rounded-xl bg-[#121A28] hover:bg-[#1E2C44] text-slate-300 border border-[#2B3B59] transition-colors cursor-pointer"
                  title="Reshuffle 6-Deck Shoe"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Practical Illustrious 18 & Decision Beacon */}
          <div className="rounded-2xl bg-gradient-to-r from-[#141B2B] via-[#182236] to-[#101624] border-2 border-[#F59E0B]/50 p-4 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold font-arcade uppercase tracking-wider text-amber-300">
                      OPTIMAL DECISION BEACON
                    </span>
                    {advice.isDeviation && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/50 font-mono-telemetry flex items-center gap-1">
                        ★ ILLUSTRIOUS 18 DEVIATION
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-arcade tracking-wide text-white">
                    RECOMMENDED: <span className="text-amber-400 font-black">{advice.primaryAction}</span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono-telemetry">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">EXPECTED VALUE</span>
                  <span className={`font-bold text-sm ${advice.ev >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {advice.ev >= 0 ? `+${advice.ev.toFixed(2)} EV` : `${advice.ev.toFixed(2)} EV`}
                  </span>
                </div>
                <div className="text-right border-l border-[#2B3B59] pl-4">
                  <span className="text-[10px] text-slate-400 block">TRUE COUNT</span>
                  <span className="text-amber-400 font-bold text-sm">TC {effectiveTrueCount}</span>
                </div>
              </div>
            </div>

            {advice.isDeviation && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-sans-arcade flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Advantage Deviation Active:</strong> {advice.deviationReason} (Standard basic strategy without counting would be {advice.basicStrategyAction}).
                </span>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Texas Hold'em 6-Max View */
        <div className="space-y-4">
          {/* Poker Felt Canvas */}
          <div className="rounded-3xl bg-gradient-to-b from-[#101A2C] via-[#0C1524] to-[#070D17] border-4 border-[#243552] p-4 sm:p-5 relative shadow-2xl overflow-hidden min-h-[360px] flex flex-col justify-between">
            {/* Pot and Community Board */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-3 text-xs">
                <span className="px-3.5 py-1 rounded-full bg-[#070D17]/90 border border-[#2B3D5E] text-slate-200 font-arcade">
                  POT: <strong className="text-amber-400 font-mono-telemetry text-sm">${pokerPot}</strong>
                </span>
                <span className="px-3.5 py-1 rounded-full bg-[#070D17]/90 border border-[#2B3D5E] text-slate-200 font-arcade">
                  BET FACED: <strong className="text-rose-400 font-mono-telemetry text-sm">${incomingBet}</strong>
                </span>
              </div>

              {/* 5 Community Cards */}
              <div className="flex items-center gap-2 my-2">
                {[
                  { rank: 'A', suit: 's' },
                  { rank: 'K', suit: 'h' },
                  { rank: '7', suit: 'd' },
                  { rank: '2', suit: 'c' },
                  { rank: 'J', suit: 's' }
                ].map((c, i) => (
                  <div
                    key={i}
                    className={`w-11 h-16 sm:w-14 sm:h-20 rounded-xl bg-white text-slate-900 border-2 border-slate-300 flex flex-col justify-between p-1.5 font-mono font-bold text-xs shadow-lg animate-deal-card ${
                      c.suit === 'h' || c.suit === 'd' ? 'text-red-600' : 'text-slate-950'
                    }`}
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <span>{c.rank}</span>
                    <span className="self-center text-base sm:text-lg">
                      {c.suit === 'h' ? '♥' : c.suit === 'd' ? '♦' : c.suit === 'c' ? '♣' : '♠'}
                    </span>
                    <span className="self-end rotate-180">{c.rank}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6-Max Positional Seats */}
            <div className="relative z-10 grid grid-cols-3 sm:grid-cols-6 gap-2 my-3">
              {[
                { pos: 'UTG', vpip: 18, pfr: 14, threeBet: 6, isHero: false, stack: '100bb' },
                { pos: 'MP', vpip: 21, pfr: 17, threeBet: 7, isHero: false, stack: '120bb' },
                { pos: 'CO', vpip: 27, pfr: 22, threeBet: 9, isHero: false, stack: '95bb' },
                { pos: 'BTN', vpip: 32, pfr: 26, threeBet: 11, isHero: false, stack: '140bb' },
                { pos: 'SB', vpip: 29, pfr: 24, threeBet: 10, isHero: false, stack: '88bb' },
                { pos: 'BB (Hero)', vpip: 24, pfr: 19, threeBet: 8, isHero: true, stack: `${heroStackBB}bb` },
              ].map((p, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    p.isHero
                      ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/15'
                      : 'bg-[#070D17]/80 border-[#243552]'
                  }`}
                >
                  <div className="text-[11px] font-bold font-arcade text-slate-200">
                    {p.pos}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono-telemetry">{p.stack}</div>
                  <div className="mt-1 text-[9px] text-slate-400 font-mono-telemetry">
                    <span>V:{p.vpip} </span>
                    <span>P:{p.pfr} </span>
                    <span>3B:{p.threeBet}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Hero Hole Cards */}
            <div className="relative z-10 flex items-center justify-between pt-3 border-t-2 border-[#1E2E4A]">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <div className="w-10 h-14 rounded-lg bg-white text-slate-900 border border-slate-300 flex flex-col justify-between p-1 font-mono font-bold text-xs shadow-md animate-deal-card">
                    <span>A</span>
                    <span className="self-center text-sm text-slate-950">♠</span>
                  </div>
                  <div className="w-10 h-14 rounded-lg bg-white text-red-600 border border-slate-300 flex flex-col justify-between p-1 font-mono font-bold text-xs shadow-md animate-deal-card" style={{ animationDelay: '0.1s' }}>
                    <span>Q</span>
                    <span className="self-center text-sm">♥</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans-arcade block">HERO HOLDING</span>
                  <span className="text-xs font-bold text-white font-arcade">A♠ Q♥ (Top Pair Good Kicker)</span>
                </div>
              </div>

              {/* Quick Pot Control Simulator */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setPokerPot(p => p + 50); setIncomingBet(50); }}
                  className="px-3 py-1.5 rounded-lg bg-[#1E2B44] hover:bg-[#2A3C5E] text-slate-200 text-xs font-mono-telemetry transition-colors cursor-pointer"
                >
                  +Bet $50
                </button>
                <button
                  onClick={() => { setPokerPot(p => p + 100); setIncomingBet(100); }}
                  className="px-3 py-1.5 rounded-lg bg-[#1E2B44] hover:bg-[#2A3C5E] text-slate-200 text-xs font-mono-telemetry transition-colors cursor-pointer"
                >
                  +Bet $100
                </button>
              </div>
            </div>
          </div>

          {/* Practical Mathematical Defense Ribbon (MDF & Pot Odds) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#0E1524] border border-[#243552] shadow-sm">
              <span className="text-[10px] text-slate-400 font-arcade tracking-wider block">
                MINIMUM DEFENSE FREQUENCY (MDF)
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-bold font-mono-telemetry text-emerald-400">{pokerMDF}%</span>
                <span className="text-[10px] text-slate-400 font-mono-telemetry">Formula: P / (P + B)</span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                You must defend at least <strong>{pokerMDF}%</strong> of your range to prevent opponent from auto-profiting with zero-equity bluffs.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E1524] border border-[#243552] shadow-sm">
              <span className="text-[10px] text-slate-400 font-arcade tracking-wider block">
                REQUIRED POT ODDS TO CALL
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-bold font-mono-telemetry text-amber-400">{pokerPotOdds}%</span>
                <span className="text-[10px] text-slate-400 font-mono-telemetry">Formula: B / (P + B)</span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Your hand needs at least <strong>{pokerPotOdds}%</strong> raw equity against villain's betting range to break even on a flat call.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
