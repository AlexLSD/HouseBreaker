import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { CardBitfield, CardRank } from '../types';
import {
  createCard,
  createShoe,
  computeBlackjackHandValue,
  getBlackjackAdvice,
  computeShoeTelemetry,
  getHiLoWeight
} from '../utils/mathEngine';
import { sounds } from '../utils/soundEffects';
import { PlayingCard } from './PlayingCard';
import { CasinoChipStack } from './CasinoChipStack';
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Coins,
  DollarSign,
  Eye,
  EyeOff,
  Flame,
  HelpCircle,
  Info,
  Layers,
  RotateCcw,
  Scissors,
  Shield,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Zap
} from 'lucide-react';

interface BlackjackLabProps {
  onOpenGuide?: () => void;
}

type RoundOutcome =
  | 'BETTING'
  | 'PLAYER_TURN'
  | 'SPLIT_TURN_1'
  | 'SPLIT_TURN_2'
  | 'DEALER_TURN'
  | 'PLAYER_BLACKJACK'
  | 'DEALER_BLACKJACK'
  | 'PLAYER_BUST'
  | 'DEALER_BUST'
  | 'PLAYER_WIN'
  | 'DEALER_WIN'
  | 'PUSH'
  | 'SURRENDER';

export const BlackjackLab: React.FC<BlackjackLabProps> = ({ onOpenGuide }) => {
  const { t, language } = useLanguage();

  // Active Sub-Tab
  const [activeTab, setActiveTab] = useState<'TABLE' | 'MATRIX' | 'HOW_TO_PLAY'>('TABLE');

  // Shoe & Deck State (6 Decks, S17)
  const [shoe, setShoe] = useState<CardBitfield[]>(() => createShoe(6));
  const [exposedCards, setExposedCards] = useState<CardBitfield[]>([]);

  // Bankroll & Bet State
  const [bankroll, setBankroll] = useState<number>(2500);
  const [currentBet, setCurrentBet] = useState<number>(50);
  const [activeChipDenom, setActiveChipDenom] = useState<number>(25);

  // Round State
  const [outcome, setOutcome] = useState<RoundOutcome>('BETTING');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Cards in play
  const [playerCards, setPlayerCards] = useState<CardBitfield[]>([]);
  const [dealerCards, setDealerCards] = useState<CardBitfield[]>([]);
  const [dealerHoleHidden, setDealerHoleHidden] = useState<boolean>(true);

  // Split state
  const [isSplit, setIsSplit] = useState<boolean>(false);
  const [splitHand1, setSplitHand1] = useState<CardBitfield[]>([]);
  const [splitHand2, setSplitHand2] = useState<CardBitfield[]>([]);
  const [activeSplitIdx, setActiveSplitIdx] = useState<1 | 2>(1);
  const [splitOutcome1, setSplitOutcome1] = useState<string | null>(null);
  const [splitOutcome2, setSplitOutcome2] = useState<string | null>(null);

  // Telemetry HUD Toggles
  const [showCountingHUD, setShowCountingHUD] = useState<boolean>(true);
  const [showAdvisor, setShowAdvisor] = useState<boolean>(true);
  const [showRulesDrawer, setShowRulesDrawer] = useState<boolean>(false);

  // Calculate shoe telemetry
  const telemetry = useMemo(() => {
    return computeShoeTelemetry(6, exposedCards);
  }, [exposedCards]);

  // Current hands values
  const playerVal = useMemo(() => computeBlackjackHandValue(playerCards), [playerCards]);
  const dealerVal = useMemo(() => {
    if (dealerHoleHidden && dealerCards.length > 0) {
      return computeBlackjackHandValue([dealerCards[0]]);
    }
    return computeBlackjackHandValue(dealerCards);
  }, [dealerCards, dealerHoleHidden]);

  // Split hands values
  const split1Val = useMemo(() => computeBlackjackHandValue(splitHand1), [splitHand1]);
  const split2Val = useMemo(() => computeBlackjackHandValue(splitHand2), [splitHand2]);

  // Basic Strategy & Count Deviation Advice
  const strategyAdvice = useMemo(() => {
    if (outcome !== 'PLAYER_TURN' && outcome !== 'SPLIT_TURN_1' && outcome !== 'SPLIT_TURN_2') {
      return null;
    }
    const currentHand = isSplit ? (activeSplitIdx === 1 ? splitHand1 : splitHand2) : playerCards;
    if (currentHand.length === 0 || dealerCards.length === 0) return null;
    return getBlackjackAdvice(currentHand, dealerCards[0], telemetry.trueCount);
  }, [outcome, isSplit, activeSplitIdx, splitHand1, splitHand2, playerCards, dealerCards, telemetry.trueCount]);

  // Reshuffle shoe if penetration > 75%
  const checkShoe = (currentShoe: CardBitfield[]) => {
    if (currentShoe.length < 52) {
      const freshShoe = createShoe(6);
      setShoe(freshShoe);
      setExposedCards([]);
      sounds.playShuffle();
      return freshShoe;
    }
    return currentShoe;
  };

  // Deal Initial Cards
  const handleDeal = () => {
    if (currentBet <= 0) return;
    if (bankroll < currentBet) {
      sounds.playBust();
      return;
    }

    const workingShoe = checkShoe(shoe);
    sounds.playChip();
    setBankroll(prev => prev - currentBet);

    // Pop 2 cards for player, 2 cards for dealer
    const p1 = workingShoe[0];
    const d1 = workingShoe[1];
    const p2 = workingShoe[2];
    const d2 = workingShoe[3];
    const nextShoe = workingShoe.slice(4);

    setShoe(nextShoe);
    setPlayerCards([p1, p2]);
    setDealerCards([d1, d2]);
    setDealerHoleHidden(true);
    setIsSplit(false);
    setSplitHand1([]);
    setSplitHand2([]);
    setSplitOutcome1(null);
    setSplitOutcome2(null);

    // Register exposed cards (dealer hole card remains unexposed to count until revealed)
    setExposedCards(prev => [...prev, p1, d1, p2]);
    sounds.playCard();

    // Check for player or dealer naturals
    const pVal = computeBlackjackHandValue([p1, p2]);
    const dVal = computeBlackjackHandValue([d1, d2]);

    if (pVal.total === 21) {
      setDealerHoleHidden(false);
      setExposedCards(prev => [...prev, d2]);
      if (dVal.total === 21) {
        setOutcome('PUSH');
        setStatusMessage('Both Player and Dealer have Natural Blackjack! Push.');
        setBankroll(prev => prev + currentBet);
        sounds.playPush();
      } else {
        setOutcome('PLAYER_BLACKJACK');
        setStatusMessage('BLACKJACK! Natural 21 pays 3 to 2 (+150%)!');
        const winAmount = Math.floor(currentBet * 2.5);
        setBankroll(prev => prev + winAmount);
        sounds.playJackpot();
      }
    } else {
      setOutcome('PLAYER_TURN');
      setStatusMessage('Choose your action: Hit, Stand, Double, or Split.');
    }
  };

  // Player Hit
  const handleHit = () => {
    if (outcome !== 'PLAYER_TURN' && outcome !== 'SPLIT_TURN_1' && outcome !== 'SPLIT_TURN_2') return;

    sounds.playCard();
    const nextCard = shoe[0];
    const nextShoe = shoe.slice(1);
    setShoe(nextShoe);
    setExposedCards(prev => [...prev, nextCard]);

    if (isSplit) {
      if (activeSplitIdx === 1) {
        const nextHand = [...splitHand1, nextCard];
        setSplitHand1(nextHand);
        const val = computeBlackjackHandValue(nextHand);
        if (val.total > 21) {
          sounds.playBust();
          setSplitOutcome1('BUST');
          setActiveSplitIdx(2);
          setOutcome('SPLIT_TURN_2');
        }
      } else {
        const nextHand = [...splitHand2, nextCard];
        setSplitHand2(nextHand);
        const val = computeBlackjackHandValue(nextHand);
        if (val.total > 21) {
          sounds.playBust();
          setSplitOutcome2('BUST');
          // Both split hands concluded, proceed to dealer
          concludeDealerTurn(splitHand1, nextHand);
        }
      }
    } else {
      const nextHand = [...playerCards, nextCard];
      setPlayerCards(nextHand);
      const val = computeBlackjackHandValue(nextHand);
      if (val.total > 21) {
        setDealerHoleHidden(false);
        setExposedCards(prev => [...prev, dealerCards[1]]);
        setOutcome('PLAYER_BUST');
        setStatusMessage(`Bust with ${val.total}! Dealer wins.`);
        sounds.playBust();
      }
    }
  };

  // Player Stand
  const handleStand = () => {
    if (outcome !== 'PLAYER_TURN' && outcome !== 'SPLIT_TURN_1' && outcome !== 'SPLIT_TURN_2') return;

    sounds.playClick();
    if (isSplit && activeSplitIdx === 1) {
      setActiveSplitIdx(2);
      setOutcome('SPLIT_TURN_2');
      setStatusMessage('Playing Hand 2...');
    } else {
      concludeDealerTurn(isSplit ? splitHand1 : playerCards, isSplit ? splitHand2 : null);
    }
  };

  // Player Double Down
  const handleDouble = () => {
    if (outcome !== 'PLAYER_TURN') return;
    if (bankroll < currentBet) {
      sounds.playBust();
      return;
    }

    sounds.playChip();
    setBankroll(prev => prev - currentBet);
    setCurrentBet(prev => prev * 2);

    const nextCard = shoe[0];
    const nextShoe = shoe.slice(1);
    setShoe(nextShoe);
    setExposedCards(prev => [...prev, nextCard]);
    sounds.playCard();

    const nextHand = [...playerCards, nextCard];
    setPlayerCards(nextHand);
    const val = computeBlackjackHandValue(nextHand);

    if (val.total > 21) {
      setDealerHoleHidden(false);
      setExposedCards(prev => [...prev, dealerCards[1]]);
      setOutcome('PLAYER_BUST');
      setStatusMessage(`Double down busted with ${val.total}!`);
      sounds.playBust();
    } else {
      concludeDealerTurn(nextHand, null, currentBet * 2);
    }
  };

  // Player Split
  const handleSplit = () => {
    if (outcome !== 'PLAYER_TURN' || playerCards.length !== 2) return;
    if (bankroll < currentBet) {
      sounds.playBust();
      return;
    }

    sounds.playChip();
    setBankroll(prev => prev - currentBet);
    setIsSplit(true);

    const card1 = playerCards[0];
    const card2 = playerCards[1];
    const deal1 = shoe[0];
    const deal2 = shoe[1];
    const nextShoe = shoe.slice(2);
    setShoe(nextShoe);
    setExposedCards(prev => [...prev, deal1, deal2]);

    setSplitHand1([card1, deal1]);
    setSplitHand2([card2, deal2]);
    setActiveSplitIdx(1);
    setOutcome('SPLIT_TURN_1');
    setStatusMessage('Playing Split Hand 1...');
    sounds.playCard();
  };

  // Player Surrender
  const handleSurrender = () => {
    if (outcome !== 'PLAYER_TURN' || playerCards.length !== 2) return;

    sounds.playClick();
    setDealerHoleHidden(false);
    setExposedCards(prev => [...prev, dealerCards[1]]);
    setOutcome('SURRENDER');
    const returned = Math.floor(currentBet / 2);
    setBankroll(prev => prev + returned);
    setStatusMessage(`Surrendered hand. Returned 50% ($${returned}) of your bet.`);
  };

  // Dealer Turn Execution (Dealer stands on all 17s - S17)
  const concludeDealerTurn = (
    finalHand1: CardBitfield[],
    finalHand2: CardBitfield[] | null,
    totalHandBet: number = currentBet
  ) => {
    setDealerHoleHidden(false);
    setExposedCards(prev => [...prev, dealerCards[1]]);

    let currentDealerHand = [...dealerCards];
    let workingShoe = [...shoe];
    let dVal = computeBlackjackHandValue(currentDealerHand);

    // Dealer draws to 17
    while (dVal.total < 17) {
      const drawCard = workingShoe[0];
      workingShoe = workingShoe.slice(1);
      currentDealerHand.push(drawCard);
      setExposedCards(prev => [...prev, drawCard]);
      dVal = computeBlackjackHandValue(currentDealerHand);
    }

    setShoe(workingShoe);
    setDealerCards(currentDealerHand);

    // Evaluate single or split hands
    if (!isSplit) {
      const pTotal = computeBlackjackHandValue(finalHand1).total;
      if (dVal.total > 21) {
        setOutcome('DEALER_BUST');
        setStatusMessage(`Dealer busted with ${dVal.total}! Player wins!`);
        setBankroll(prev => prev + totalHandBet * 2);
        sounds.playWin();
      } else if (pTotal > dVal.total) {
        setOutcome('PLAYER_WIN');
        setStatusMessage(`Player ${pTotal} beats Dealer ${dVal.total}!`);
        setBankroll(prev => prev + totalHandBet * 2);
        sounds.playWin();
      } else if (pTotal === dVal.total) {
        setOutcome('PUSH');
        setStatusMessage(`Push! Both have ${pTotal}.`);
        setBankroll(prev => prev + totalHandBet);
        sounds.playPush();
      } else {
        setOutcome('DEALER_WIN');
        setStatusMessage(`Dealer ${dVal.total} beats Player ${pTotal}.`);
        sounds.playBust();
      }
    } else {
      // Split hand resolution
      const h1Total = computeBlackjackHandValue(finalHand1).total;
      const h2Total = finalHand2 ? computeBlackjackHandValue(finalHand2).total : 0;
      let totalReturned = 0;

      // Hand 1 eval
      if (h1Total <= 21) {
        if (dVal.total > 21 || h1Total > dVal.total) {
          totalReturned += currentBet * 2;
          setSplitOutcome1('WIN');
        } else if (h1Total === dVal.total) {
          totalReturned += currentBet;
          setSplitOutcome1('PUSH');
        } else {
          setSplitOutcome1('LOSS');
        }
      }

      // Hand 2 eval
      if (h2Total <= 21) {
        if (dVal.total > 21 || h2Total > dVal.total) {
          totalReturned += currentBet * 2;
          setSplitOutcome2('WIN');
        } else if (h2Total === dVal.total) {
          totalReturned += currentBet;
          setSplitOutcome2('PUSH');
        } else {
          setSplitOutcome2('LOSS');
        }
      }

      setBankroll(prev => prev + totalReturned);
      setOutcome('DEALER_WIN');
      setStatusMessage(`Split round resolved. Dealer finished with ${dVal.total}.`);
      if (totalReturned > currentBet * 2) {
        sounds.playWin();
      } else {
        sounds.playClick();
      }
    }
  };

  // Reset for next hand
  const handleResetForNextHand = () => {
    setOutcome('BETTING');
    setPlayerCards([]);
    setDealerCards([]);
    setDealerHoleHidden(true);
    setIsSplit(false);
    setSplitHand1([]);
    setSplitHand2([]);
    setStatusMessage('');
  };

  // Chip adding logic
  const handleAddChip = (denom: number) => {
    if (outcome !== 'BETTING') return;
    if (bankroll >= currentBet + denom) {
      setCurrentBet(prev => prev + denom);
      sounds.playChip();
    }
  };

  const handleClearBet = () => {
    if (outcome !== 'BETTING') return;
    setCurrentBet(0);
    sounds.playClick();
  };

  const isRoundActive = outcome !== 'BETTING' &&
    outcome !== 'PLAYER_BLACKJACK' &&
    outcome !== 'DEALER_BLACKJACK' &&
    outcome !== 'PLAYER_BUST' &&
    outcome !== 'DEALER_BUST' &&
    outcome !== 'PLAYER_WIN' &&
    outcome !== 'DEALER_WIN' &&
    outcome !== 'PUSH' &&
    outcome !== 'SURRENDER';

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Header & Telemetry Bar */}
      <div className="p-4 rounded-3xl bg-[#090F1B] border-2 border-[#1B2942] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-arcade font-bold shadow-lg shadow-amber-500/20 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white font-arcade uppercase tracking-wider">
                {t.navBlackjack} AP Laboratory
              </h1>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono-telemetry font-bold border border-emerald-500/30">
                6-DECK S17 (3:2)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive casino table with Hi-Lo card counting, true count conversion, and strategy deviation analytics.
            </p>
          </div>
        </div>

        {/* View Switcher & Zero-to-Hero Button */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          <button
            type="button"
            onClick={() => setShowRulesDrawer(s => !s)}
            className="px-3 py-1.5 rounded-xl bg-[#132035] hover:bg-[#1A2C49] border border-amber-400/40 text-amber-300 font-arcade text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.btnHowToPlay}</span>
          </button>

          <div className="p-1 rounded-xl bg-[#070B14] border border-[#172338] flex items-center gap-1">
            <button
              onClick={() => setActiveTab('TABLE')}
              className={`px-3 py-1 rounded-lg text-xs font-arcade font-bold transition-all cursor-pointer ${
                activeTab === 'TABLE' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              CASINO TABLE
            </button>
            <button
              onClick={() => setActiveTab('MATRIX')}
              className={`px-3 py-1 rounded-lg text-xs font-arcade font-bold transition-all cursor-pointer ${
                activeTab === 'MATRIX' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              STRATEGY MATRIX
            </button>
            <button
              onClick={() => setActiveTab('HOW_TO_PLAY')}
              className={`px-3 py-1 rounded-lg text-xs font-arcade font-bold transition-all cursor-pointer ${
                activeTab === 'HOW_TO_PLAY' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              HOW IT WORKS
            </button>
          </div>
        </div>
      </div>

      {/* Multilingual How to Play Drawer (Zero to Hero) */}
      {showRulesDrawer && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#0D1627] via-[#09101C] to-[#050912] border-2 border-amber-400/40 shadow-2xl text-xs space-y-4 animate-fade-in text-slate-200">
          <div className="flex items-center justify-between border-b border-[#1E2E48] pb-2">
            <div className="flex items-center gap-2 text-amber-300 font-arcade font-bold uppercase text-sm">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{t.navBlackjack}: {t.howToPlay} & {t.rulesAndMath}</span>
            </div>
            <button
              onClick={() => setShowRulesDrawer(false)}
              className="text-slate-400 hover:text-white px-2 py-1 rounded bg-[#111A2E] text-xs font-arcade cursor-pointer"
            >
              ✕ CLOSE
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-[#070D18] border border-[#1A2840] space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-300 font-arcade font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px]">1</span>
                <span>{language === 'ru' ? 'Цель и подсчет очков' : language === 'he' ? 'המטרה וערכי הקלפים' : 'Goal & Card Values'}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {language === 'ru'
                  ? 'Ваша цель — победить дилера, набрав сумму ближе к 21, но не более 21. Карты 2-10 = номинал, картинки (J, Q, K) = 10, Туз (A) = 1 или 11.'
                  : language === 'he'
                  ? 'המטרה אינה להגיע ל-21 אלא לנצח את הדילר מבלי לעבור את 21. קלפים 2-10 שווים את ערכם, נסיך/מלכה/מלך = 10, ואס שווה 1 או 11.'
                  : 'Your goal is to beat the dealer without exceeding 21. Cards 2-10 count as face value, face cards (J, Q, K) count as 10, and Aces count as 1 or 11.'}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#070D18] border border-[#1A2840] space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-300 font-arcade font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[10px]">2</span>
                <span>{language === 'ru' ? 'Выплаты 3:2 и ловушка 6:5' : language === 'he' ? 'תשלום 3:2 ומלכודת 6:5' : '3:2 Payout & The 6:5 Trap'}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {language === 'ru'
                  ? 'Настоящий блэкджек платит 3:2 (ставка $100 выигрывает $150). Избегайте столов 6:5 — они увеличивают преимущество казино на +1.4%, убивая математику!'
                  : language === 'he'
                  ? 'בלאק ג\'ק אמיתי משלם 3:2 (הימור של 100$ מרוויח 150$). לעולם אל תשחק בשולחנות של 6:5 - זה מעלה את יתרון הבית ב-1.4%!'
                  : 'Natural Blackjack pays 3:2 ($100 bet wins $150). Avoid predatory 6:5 tables at all costs—they inflate house edge by +1.4%, destroying player advantage!'}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#070D18] border border-[#1A2840] space-y-1.5">
              <div className="flex items-center gap-1.5 text-sky-300 font-arcade font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center text-[10px]">3</span>
                <span>{language === 'ru' ? 'Счет карт Hi-Lo' : language === 'he' ? 'ספירת קלפים היי-לו' : 'Hi-Lo Card Counting (+EV)'}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {language === 'ru'
                  ? 'Карты 2-6 дают +1, 7-9 дают 0, 10-A дают -1. Истинный счет (TC) = Текущий счет / оставшиеся колоды. При TC ≥ +2 вы получаете перевес над казино!'
                  : language === 'he'
                  ? 'קלפים 2-6 שווים 1+, 7-9 שווים 0, ו-10-A שווים 1-. ספירה אמיתית (TC) = ספירה רצה חלקי חפיסות שנותרו. כאשר TC שווה 2+, השחקן ביתרון!'
                  : 'Cards 2-6 = +1, 7-9 = 0, 10-A = -1. True Count = Running Count / Decks remaining. When TC ≥ +2, the mathematical advantage flips to YOU!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 1: CASINO TABLE VIEW */}
      {activeTab === 'TABLE' && (
        <div className="space-y-3">
          {/* Card Counting Telemetry Ribbon */}
          <div className="p-3 rounded-2xl bg-[#0A101D] border border-[#18263E] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowCountingHUD(s => !s)}
                className="px-2.5 py-1 rounded-lg bg-[#111A2B] hover:bg-[#18263E] text-slate-300 flex items-center gap-1.5 font-arcade cursor-pointer text-[10px]"
              >
                {showCountingHUD ? <EyeOff className="w-3 h-3 text-amber-400" /> : <Eye className="w-3 h-3 text-slate-400" />}
                <span>{showCountingHUD ? 'HIDE COUNT HUD' : 'SHOW COUNT HUD'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAdvisor(s => !s)}
                className="px-2.5 py-1 rounded-lg bg-[#111A2B] hover:bg-[#18263E] text-slate-300 flex items-center gap-1.5 font-arcade cursor-pointer text-[10px]"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{showAdvisor ? 'ADVISOR ON' : 'ADVISOR OFF'}</span>
              </button>
            </div>

            {showCountingHUD ? (
              <div className="flex flex-wrap items-center gap-3 font-mono-telemetry text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] font-arcade">RUNNING COUNT:</span>
                  <span className={`font-bold ml-1.5 px-1.5 py-0.5 rounded ${
                    telemetry.runningCount > 0 ? 'text-emerald-300 bg-emerald-500/20' : telemetry.runningCount < 0 ? 'text-rose-400 bg-rose-500/20' : 'text-slate-300 bg-slate-800'
                  }`}>
                    {telemetry.runningCount > 0 ? `+${telemetry.runningCount}` : telemetry.runningCount}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-arcade">DECKS REMAINING:</span>
                  <span className="font-bold ml-1.5 text-sky-300">{telemetry.decksRemaining}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-arcade">TRUE COUNT:</span>
                  <span className={`font-bold ml-1.5 px-2 py-0.5 rounded text-xs ${
                    telemetry.trueCount >= 2 ? 'text-amber-300 bg-amber-500/20 border border-amber-400/40' : 'text-slate-200 bg-slate-800'
                  }`}>
                    {telemetry.trueCount > 0 ? `+${telemetry.trueCount}` : telemetry.trueCount}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-arcade">PLAYER EDGE:</span>
                  <span className={`font-bold ml-1.5 ${
                    telemetry.trueCount >= 2 ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    {(-0.5 + 0.5 * telemetry.trueCount).toFixed(1)}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 font-mono-telemetry italic">
                Counting HUD hidden (Test your raw memory skills)
              </div>
            )}
          </div>

          {/* Strategy Advisor Prompt (If enabled) */}
          {showAdvisor && strategyAdvice && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#172033] to-[#0E1524] border border-amber-400/40 flex items-center justify-between gap-3 text-xs animate-fade-in shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-amber-300 font-arcade font-bold block text-xs">
                    GTO ADVISOR RECOMMENDATION: {strategyAdvice.primaryAction}
                  </span>
                  <span className="text-slate-300 text-[11px]">
                    {strategyAdvice.isDeviation
                      ? `Deviation alert: ${strategyAdvice.deviationReason}`
                      : `Standard Basic Strategy dictates ${strategyAdvice.primaryAction} against dealer ${dealerCards[0]?.rank}`}
                  </span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono-telemetry font-bold shrink-0">
                EV: {(strategyAdvice.ev * 100).toFixed(1)}%
              </span>
            </div>
          )}

          {/* Oval Green Blackjack Table Felt */}
          <div className="rounded-3xl bg-gradient-to-b from-[#0A331E] via-[#062414] to-[#04150C] border-4 border-[#245233] p-5 sm:p-7 relative shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between select-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

            {/* Table Rules Felt Stamping */}
            <div className="text-center space-y-0.5 pointer-events-none opacity-40">
              <div className="text-[11px] sm:text-xs font-arcade tracking-widest text-amber-200">
                BLACKJACK PAYS 3 TO 2 • DEALER MUST STAND ON ALL 17s
              </div>
              <div className="text-[9px] font-mono-telemetry text-emerald-300 tracking-wider">
                INSURANCE PAYS 2 TO 1 • DOUBLE ON ANY TWO CARDS • PAIRS MAY BE SPLIT
              </div>
            </div>

            {/* DEALER SECTION */}
            <div className="flex flex-col items-center space-y-2 py-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-arcade font-bold text-slate-300 tracking-wider">
                  DEALER TOTAL:
                </span>
                <span className="font-mono-telemetry font-bold text-amber-300 text-sm px-2 py-0.5 rounded bg-slate-950/60 border border-emerald-500/30">
                  {dealerCards.length === 0 ? '--' : dealerHoleHidden ? `${dealerVal.total} (+?)` : dealerVal.total}
                </span>
              </div>

              {/* Dealer Cards Stack */}
              <div className="flex items-center justify-center gap-2 min-h-[96px]">
                {dealerCards.length === 0 ? (
                  <div className="w-16 sm:w-20 h-24 sm:h-28 rounded-xl border-2 border-dashed border-emerald-500/30 flex items-center justify-center text-emerald-500/40 text-xs font-arcade">
                    DEALER
                  </div>
                ) : (
                  dealerCards.map((card, idx) => (
                    <div key={idx} className="transition-all transform hover:-translate-y-1">
                      <PlayingCard
                        card={card}
                        faceDown={idx === 1 && dealerHoleHidden}
                        size="md"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* STATUS / OUTCOME BANNER */}
            {statusMessage && (
              <div className="my-2 p-2.5 rounded-xl bg-slate-950/80 border border-amber-400/40 text-center font-arcade text-xs text-amber-300 tracking-wide animate-fade-in shadow-xl max-w-md mx-auto">
                {statusMessage}
              </div>
            )}

            {/* PLAYER SECTION */}
            <div className="flex flex-col items-center space-y-2 py-2">
              {!isSplit ? (
                /* Single Hand View */
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-arcade font-bold text-slate-300 tracking-wider">
                      PLAYER TOTAL:
                    </span>
                    <span className="font-mono-telemetry font-bold text-white text-sm px-2 py-0.5 rounded bg-slate-950/60 border border-emerald-500/30">
                      {playerCards.length === 0 ? '--' : `${playerVal.total} ${playerVal.isSoft ? '(SOFT)' : ''}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 min-h-[96px]">
                    {playerCards.length === 0 ? (
                      <div className="w-16 sm:w-20 h-24 sm:h-28 rounded-xl border-2 border-dashed border-emerald-500/30 flex items-center justify-center text-emerald-500/40 text-xs font-arcade">
                        BET TO DEAL
                      </div>
                    ) : (
                      playerCards.map((card, idx) => (
                        <div key={idx} className="transition-all transform hover:-translate-y-1">
                          <PlayingCard card={card} size="md" />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                /* Split Hands View */
                <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                  {/* Split Hand 1 */}
                  <div className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center ${
                    activeSplitIdx === 1 ? 'bg-amber-400/10 border-amber-400' : 'bg-slate-950/40 border-slate-800'
                  }`}>
                    <span className="text-[10px] font-arcade text-amber-300">
                      HAND 1: {split1Val.total} {splitOutcome1 ? `(${splitOutcome1})` : ''}
                    </span>
                    <div className="flex items-center justify-center gap-1.5 mt-1.5">
                      {splitHand1.map((c, i) => (
                        <PlayingCard key={i} card={c} size="sm" />
                      ))}
                    </div>
                  </div>

                  {/* Split Hand 2 */}
                  <div className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center ${
                    activeSplitIdx === 2 ? 'bg-amber-400/10 border-amber-400' : 'bg-slate-950/40 border-slate-800'
                  }`}>
                    <span className="text-[10px] font-arcade text-amber-300">
                      HAND 2: {split2Val.total} {splitOutcome2 ? `(${splitOutcome2})` : ''}
                    </span>
                    <div className="flex items-center justify-center gap-1.5 mt-1.5">
                      {splitHand2.map((c, i) => (
                        <PlayingCard key={i} card={c} size="sm" />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TABLE CONTROLS & BETTING DOCK */}
          <div className="p-4 rounded-3xl bg-[#090F1C] border border-[#18263D] shadow-2xl space-y-3">
            {/* Action Buttons: Deal or Turn Actions */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {!isRoundActive ? (
                <>
                  <button
                    onClick={handleClearBet}
                    disabled={currentBet === 0}
                    className="px-4 py-2.5 rounded-xl bg-[#141F33] hover:bg-[#1B2942] disabled:opacity-40 text-slate-300 font-arcade text-xs cursor-pointer"
                  >
                    CLEAR BET
                  </button>

                  <button
                    onClick={handleDeal}
                    disabled={currentBet <= 0 || bankroll < currentBet}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-arcade font-bold text-sm shadow-lg shadow-amber-500/30 cursor-pointer disabled:opacity-40 flex items-center gap-2"
                  >
                    <Flame className="w-4 h-4 fill-slate-950" />
                    <span>DEAL HAND (${currentBet})</span>
                  </button>

                  <button
                    onClick={() => {
                      if (bankroll >= currentBet * 2) {
                        setCurrentBet(prev => prev * 2);
                        sounds.playChip();
                      }
                    }}
                    disabled={bankroll < currentBet * 2}
                    className="px-4 py-2.5 rounded-xl bg-[#141F33] hover:bg-[#1B2942] disabled:opacity-40 text-amber-300 font-arcade text-xs cursor-pointer"
                  >
                    2X BET
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleHit}
                    className="flex-1 min-w-[90px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-arcade font-bold text-xs shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
                  >
                    HIT
                  </button>

                  <button
                    onClick={handleStand}
                    className="flex-1 min-w-[90px] py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-arcade font-bold text-xs shadow-lg shadow-rose-600/30 cursor-pointer active:scale-95"
                  >
                    STAND
                  </button>

                  <button
                    onClick={handleDouble}
                    disabled={playerCards.length !== 2 || isSplit || bankroll < currentBet}
                    className="flex-1 min-w-[90px] py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-arcade font-bold text-xs shadow-lg shadow-amber-500/30 cursor-pointer active:scale-95"
                  >
                    DOUBLE (2X)
                  </button>

                  <button
                    onClick={handleSplit}
                    disabled={playerCards.length !== 2 || isSplit || !playerVal.isPair || bankroll < currentBet}
                    className="flex-1 min-w-[90px] py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-arcade font-bold text-xs shadow-lg shadow-purple-600/30 cursor-pointer active:scale-95"
                  >
                    SPLIT
                  </button>

                  <button
                    onClick={handleSurrender}
                    disabled={playerCards.length !== 2 || isSplit}
                    className="px-3 py-2.5 rounded-xl bg-[#1A263D] hover:bg-[#233350] disabled:opacity-40 text-slate-300 font-arcade text-xs cursor-pointer"
                  >
                    SURRENDER
                  </button>
                </>
              )}
            </div>

            {/* Chip Stack Selector & Bankroll Indicator */}
            <div className="pt-2 border-t border-[#18263D] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-mono-telemetry">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-400 font-arcade">BANKROLL:</span>
                  <span className="font-bold text-white text-sm">${bankroll}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono-telemetry">
                  <span className="text-slate-400 font-arcade">WAGER:</span>
                  <span className="font-bold text-amber-300 text-sm">${currentBet}</span>
                </div>
              </div>

              {/* Casino Chip Palette */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-arcade uppercase">Chips:</span>
                {[5, 25, 100, 500].map(denom => (
                  <button
                    key={denom}
                    onClick={() => handleAddChip(denom)}
                    disabled={outcome !== 'BETTING'}
                    className={`w-9 h-9 rounded-full font-mono-telemetry font-bold text-xs flex items-center justify-center border-2 shadow-md cursor-pointer transition-transform active:scale-90 ${
                      denom === 5
                        ? 'bg-rose-700 border-rose-400 text-white'
                        : denom === 25
                        ? 'bg-emerald-700 border-emerald-400 text-white'
                        : denom === 100
                        ? 'bg-slate-900 border-amber-400 text-amber-300'
                        : 'bg-purple-700 border-purple-400 text-white'
                    }`}
                  >
                    ${denom}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: BASIC STRATEGY MATRIX */}
      {activeTab === 'MATRIX' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-[#090F1C] border border-[#18263D] shadow-2xl space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-[#18263D] pb-3">
            <div>
              <h2 className="text-sm font-arcade font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>6-Deck S17 Basic Strategy Matrix</span>
              </h2>
              <p className="text-slate-400 text-xs">
                The mathematically proven decision matrix for every combination of player total and dealer upcard.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono-telemetry text-[11px]">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">H: Hit</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">S: Stand</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">D: Double</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">P: Split</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#18263D]">
            <table className="w-full text-center font-mono-telemetry text-xs">
              <thead className="bg-[#0D1525] text-amber-300 text-[10px] uppercase font-arcade border-b border-[#18263D]">
                <tr>
                  <th className="p-2 text-left">Your Hand</th>
                  <th className="p-2">2</th>
                  <th className="p-2">3</th>
                  <th className="p-2">4</th>
                  <th className="p-2">5</th>
                  <th className="p-2">6</th>
                  <th className="p-2">7</th>
                  <th className="p-2">8</th>
                  <th className="p-2">9</th>
                  <th className="p-2">10</th>
                  <th className="p-2">A</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#131D2E] text-[11px]">
                <tr>
                  <td className="p-2 text-left font-bold text-white">Hard 17-20</td>
                  {Array(10).fill('S').map((act, i) => (
                    <td key={i} className="p-2 bg-rose-950/30 text-rose-300 font-bold">{act}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 text-left font-bold text-white">Hard 16</td>
                  {['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'].map((act, i) => (
                    <td key={i} className={`p-2 font-bold ${act === 'S' ? 'bg-rose-950/30 text-rose-300' : 'bg-emerald-950/30 text-emerald-300'}`}>{act}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 text-left font-bold text-white">Hard 15</td>
                  {['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'].map((act, i) => (
                    <td key={i} className={`p-2 font-bold ${act === 'S' ? 'bg-rose-950/30 text-rose-300' : 'bg-emerald-950/30 text-emerald-300'}`}>{act}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 text-left font-bold text-white">Hard 13-14</td>
                  {['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'].map((act, i) => (
                    <td key={i} className={`p-2 font-bold ${act === 'S' ? 'bg-rose-950/30 text-rose-300' : 'bg-emerald-950/30 text-emerald-300'}`}>{act}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 text-left font-bold text-white">Hard 12</td>
                  {['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'].map((act, i) => (
                    <td key={i} className={`p-2 font-bold ${act === 'S' ? 'bg-rose-950/30 text-rose-300' : 'bg-emerald-950/30 text-emerald-300'}`}>{act}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 text-left font-bold text-white">Hard 11</td>
                  {Array(10).fill('D').map((act, i) => (
                    <td key={i} className="p-2 bg-amber-950/30 text-amber-300 font-bold">{act}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 text-left font-bold text-white">Hard 10</td>
                  {['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'].map((act, i) => (
                    <td key={i} className={`p-2 font-bold ${act === 'D' ? 'bg-amber-950/30 text-amber-300' : 'bg-emerald-950/30 text-emerald-300'}`}>{act}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 text-left font-bold text-white">Hard 9</td>
                  {['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'].map((act, i) => (
                    <td key={i} className={`p-2 font-bold ${act === 'D' ? 'bg-amber-950/30 text-amber-300' : 'bg-emerald-950/30 text-emerald-300'}`}>{act}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 text-left font-bold text-white">Pair A,A & 8,8</td>
                  {Array(10).fill('P').map((act, i) => (
                    <td key={i} className="p-2 bg-purple-950/30 text-purple-300 font-bold">{act}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: HOW IT WORKS & COMPLETE MASTERCLASS */}
      {activeTab === 'HOW_TO_PLAY' && (
        <div className="p-4 sm:p-6 rounded-3xl bg-[#090F1C] border border-[#18263D] shadow-2xl space-y-5 text-xs text-slate-200">
          <div className="flex items-center gap-3 border-b border-[#18263D] pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-arcade font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-arcade font-bold text-white uppercase tracking-wider">
                {t.navBlackjack}: {t.howToPlay} & {t.rulesAndMath}
              </h2>
              <p className="text-xs text-slate-400">
                A complete, step-by-step masterclass covering game mechanics, mathematical edge, and card counting.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-[#0D1525] border border-[#1A2840] space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-arcade text-xs font-bold uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[10px]">1</span>
                <span>{language === 'ru' ? 'Правила и цель игры' : language === 'he' ? 'חוקי המשחק והמטרה' : 'Rules & Core Objective'}</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {language === 'ru'
                  ? 'В блэкджеке вы играете исключительно против дилера. Цель — набрать руку, превышающую руку дилера по очкам, не превышая 21. Если ваша рука превышает 21, вы "сгораете" (bust) и мгновенно проигрываете ставку, даже если дилер позже тоже сгорит.'
                  : language === 'he'
                  ? 'בבלאק ג\'ק אתה משחק אך ורק נגד הדילר. המטרה היא לקבל סכום קלפים גבוה מזה של הדילר, מבלי לעבור את 21. אם עברת את 21 (Bust), הפסדת מיד - גם אם הדילר ייפסל בהמשך.'
                  : 'In Blackjack, you play strictly against the dealer. The goal is to obtain a hand total higher than the dealer’s total without exceeding 21. If you exceed 21, you bust and automatically forfeit your bet, even if the dealer subsequently busts.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-[#0D1525] border border-[#1A2840] space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-arcade text-xs font-bold uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-[10px]">2</span>
                <span>{language === 'ru' ? 'Действия игрока за столом' : language === 'he' ? 'פעולות השחקן בשולחן' : 'Player Decisions (Hit, Stand, Double, Split, Surrender)'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <strong className="text-emerald-300 block font-arcade">HIT (Еще):</strong>
                  <span>Взять дополнительную карту для увеличения счета.</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <strong className="text-rose-300 block font-arcade">STAND (Хватит):</strong>
                  <span>Зафиксировать текущий счет и завершить ход.</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <strong className="text-amber-300 block font-arcade">DOUBLE DOWN (Удвоение):</strong>
                  <span>Удвоить ставку за получение ровно одной дополнительной карты.</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <strong className="text-purple-300 block font-arcade">SPLIT (Разделение):</strong>
                  <span>Разделить одинаковые карты на две независимые руки с равными ставками.</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-[#0D1525] border border-[#1A2840] space-y-2">
              <div className="flex items-center gap-2 text-sky-300 font-arcade text-xs font-bold uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center font-bold text-[10px]">3</span>
                <span>{language === 'ru' ? 'Как счет карт дает вам преимущество' : language === 'he' ? 'איך ספירת קלפים יוצרת יתרון' : 'How Card Counting Generates Advantage (+EV)'}</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {language === 'ru'
                  ? 'Когда из колоды выходят мелкие карты (2-6), в башмаке остается больше десяток и тузов. Это дает игроку больше блэкджеков (оплачиваемых 3:2), увеличивает вероятность перебора у дилера при обязательной доборной игре до 17, и делает удвоения значительно прибыльнее!'
                  : language === 'he'
                  ? 'כאשר קלפים נמוכים (2-6) יוצאים מהחפיסה, נותרים יותר קלפי 10 ואסים. זה מגדיל את הסיכוי של השחקן לקבל בלאק ג\'ק (3:2), גורם לדילר להיפסל יותר, והופך את פעולת ה-Double לרווחית ביותר!'
                  : 'When low cards (2-6) are dealt, the remaining shoe is enriched with 10s and Aces. This increases the player frequency of natural 3:2 Blackjacks, forces dealer bust rates higher on stiff upcards, and makes double-downs vastly more profitable!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
