import React, { useState } from 'react';
import { CardBitfield, CardRank } from '../../types';
import {
  createCard,
  computeBlackjackHandValue
} from '../../utils/mathEngine';
import { sounds } from '../../utils/soundEffects';
import { CasinoChipStack } from '../CasinoChipStack';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Flag,
  Sparkles,
  Scissors,
  Shield,
  TrendingUp,
  Zap
} from 'lucide-react';

export interface DrillScenario {
  id: string;
  name: string;
  description: string;
  targetCategory: 'ILLUSTRIOUS_18' | 'STIFF_HANDS' | 'SOFT_DOUBLES' | 'PAIR_SPLITS';
  playerCards: CardBitfield[];
  dealerUpcard: CardBitfield;
  runningCount: number;
  decksRemaining: number;
  trueCount: number;
  expectedAction: 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT' | 'SURRENDER';
  explanation: string;
  isDeviation: boolean;
}

const PRESET_SCENARIOS: DrillScenario[] = [
  {
    id: 'i18-16-10',
    name: 'Illustrious 18 #1: 16 vs Dealer 10',
    description: 'TC sits at +1.2. Basic strategy instructs Hit, but count index threshold is TC ≥ 0.',
    targetCategory: 'ILLUSTRIOUS_18',
    playerCards: [createCard('T', 'h'), createCard('6', 's')],
    dealerUpcard: createCard('T', 'd'),
    runningCount: 3,
    decksRemaining: 2.5,
    trueCount: 1.2,
    expectedAction: 'STAND',
    explanation: 'Under Illustrious 18, Stand on Hard 16 vs Dealer 10 when True Count ≥ 0. Because TC = +1.2 ≥ 0, standing yields superior EV over hitting.',
    isDeviation: true
  },
  {
    id: 'i18-12-3',
    name: 'Illustrious 18 #3: 12 vs Dealer 3',
    description: 'TC sits at +2.5. Basic strategy says Hit, but threshold is TC ≥ +2.',
    targetCategory: 'ILLUSTRIOUS_18',
    playerCards: [createCard('8', 's'), createCard('4', 'd')],
    dealerUpcard: createCard('3', 'c'),
    runningCount: 5,
    decksRemaining: 2.0,
    trueCount: 2.5,
    expectedAction: 'STAND',
    explanation: 'Basic strategy hits 12 vs 3. However, with TC = +2.5 ≥ +2, the surplus of 10s increases dealer bust frequency significantly. The optimal play is STAND.',
    isDeviation: true
  },
  {
    id: 'i18-11-A',
    name: 'Illustrious 18 #6: 11 vs Dealer Ace',
    description: 'TC sits at +1.5. Basic strategy says Hit, but threshold to double is TC ≥ +1.',
    targetCategory: 'ILLUSTRIOUS_18',
    playerCards: [createCard('8', 'h'), createCard('3', 'd')],
    dealerUpcard: createCard('A', 's'),
    runningCount: 3,
    decksRemaining: 2.0,
    trueCount: 1.5,
    expectedAction: 'DOUBLE',
    explanation: 'Against a dealer Ace, basic strategy normally hits 11. But at TC ≥ +1, doubling gains tremendous positive expectation from high card density.',
    isDeviation: true
  },
  {
    id: 'i18-15-10',
    name: 'Illustrious 18 #2: 15 vs Dealer 10',
    description: 'TC sits at +4.0. High count triggers Stand on 15 vs 10.',
    targetCategory: 'ILLUSTRIOUS_18',
    playerCards: [createCard('9', 'c'), createCard('6', 'd')],
    dealerUpcard: createCard('T', 'h'),
    runningCount: 8,
    decksRemaining: 2.0,
    trueCount: 4.0,
    expectedAction: 'STAND',
    explanation: 'Stand on 15 vs 10 when TC ≥ +4.0. The high ratio of tens means hitting results in near-certain bust, while dealer bust chance rises.',
    isDeviation: true
  },
  {
    id: 'soft-A7-9',
    name: 'Soft Hand: Soft 18 (A,7) vs Dealer 9',
    description: 'Dealer shows 9. Do you stand or hit soft 18?',
    targetCategory: 'SOFT_DOUBLES',
    playerCards: [createCard('A', 'd'), createCard('7', 'h')],
    dealerUpcard: createCard('9', 's'),
    runningCount: 0,
    decksRemaining: 3.0,
    trueCount: 0,
    expectedAction: 'HIT',
    explanation: 'Standing on Soft 18 against a 9, 10, or Ace is a common rookie leak! Dealer will likely make 19 or 20. Hitting soft 18 is free of bust risk.',
    isDeviation: false
  },
  {
    id: 'soft-A3-5',
    name: 'Soft Hand: Soft 14 (A,3) vs Dealer 5',
    description: 'Dealer shows 5. Do you hit or double?',
    targetCategory: 'SOFT_DOUBLES',
    playerCards: [createCard('A', 'c'), createCard('3', 's')],
    dealerUpcard: createCard('5', 'd'),
    runningCount: 2,
    decksRemaining: 2.0,
    trueCount: 1.0,
    expectedAction: 'DOUBLE',
    explanation: 'Always double Soft 14 (A,3) against dealer 5 or 6 to maximize profitability while dealer is highly vulnerable to busting.',
    isDeviation: false
  },
  {
    id: 'pair-88-10',
    name: 'Pair Split: 8,8 vs Dealer 10',
    description: 'Do you hit, stand, or split 8s against a dealer 10?',
    targetCategory: 'PAIR_SPLITS',
    playerCards: [createCard('8', 'c'), createCard('8', 'd')],
    dealerUpcard: createCard('T', 's'),
    runningCount: 1,
    decksRemaining: 2.0,
    trueCount: 0.5,
    expectedAction: 'SPLIT',
    explanation: 'Always Split 8s against dealer 10! Playing two starting hands of 8 loses far less money over time than suffering through a single brutal Hard 16.',
    isDeviation: false
  },
  {
    id: 'pair-AA-6',
    name: 'Pair Split: A,A vs Dealer 6',
    description: 'Always split Aces! Splitting yields two potent starting hands of 11.',
    targetCategory: 'PAIR_SPLITS',
    playerCards: [createCard('A', 'h'), createCard('A', 's')],
    dealerUpcard: createCard('6', 'c'),
    runningCount: 0,
    decksRemaining: 2.0,
    trueCount: 0,
    expectedAction: 'SPLIT',
    explanation: 'Splitting Aces gives you two hands starting with 11 with huge positive expectation against dealer bust card 6.',
    isDeviation: false
  },
  {
    id: 'pair-99-7',
    name: 'Pair Split Trap: 9,9 vs Dealer 7',
    description: 'Dealer shows 7. Do you split 9s or Stand with Hard 18?',
    targetCategory: 'PAIR_SPLITS',
    playerCards: [createCard('9', 's'), createCard('9', 'h')],
    dealerUpcard: createCard('7', 'd'),
    runningCount: 1,
    decksRemaining: 2.0,
    trueCount: 0.5,
    expectedAction: 'STAND',
    explanation: 'Stand on 9,9 vs 7! Dealer showing 7 will most frequently finish with 17. Your hard 18 already has the dealer beaten outright.',
    isDeviation: false
  }
];

interface BlackjackGameDrillProps {
  credits: number;
  onBet: (amount: number) => boolean;
  onWin: (amount: number, reason: string) => void;
  onLoss: (amount: number, reason: string) => void;
  onPush: (amount: number, reason: string) => void;
  onRecordMistake: (
    scenarioName: string,
    userDecision: string,
    expectedDecision: string,
    cost: number,
    explanation: string
  ) => void;
  onRecordEarning: (scenarioName: string, won: number, reason: string) => void;
}

export const BlackjackGameDrill: React.FC<BlackjackGameDrillProps> = ({
  credits,
  onBet,
  onWin,
  onLoss,
  onPush,
  onRecordMistake,
  onRecordEarning
}) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState<number>(0);

  // Bet Size & Chip State
  const [activeHandBet, setActiveHandBet] = useState<number>(50);
  const [activeChipDenom, setActiveChipDenom] = useState<number>(25);
  const [cardsDealt, setCardsDealt] = useState<boolean>(false);

  // Game state
  const [playerHand, setPlayerHand] = useState<CardBitfield[]>(PRESET_SCENARIOS[0].playerCards);
  const [dealerUpcard, setDealerUpcard] = useState<CardBitfield>(PRESET_SCENARIOS[0].dealerUpcard);
  const [dealerRevealed, setDealerRevealed] = useState<boolean>(false);
  const [dealerFullHand, setDealerFullHand] = useState<CardBitfield[]>([]);

  // Split state
  const [isSplitMode, setIsSplitMode] = useState<boolean>(false);
  const [splitHands, setSplitHands] = useState<{ hand1: CardBitfield[]; hand2: CardBitfield[] } | null>(null);

  // User decision state
  const [userAction, setUserAction] = useState<string | null>(null);
  const [handOutcomeText, setHandOutcomeText] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<{
    isCorrect: boolean;
    feedbackTitle: string;
    feedbackText: string;
    evScore: number;
  } | null>(null);

  const activeScenario = PRESET_SCENARIOS[currentScenarioIdx];
  const playerVal = computeBlackjackHandValue(playerHand);
  const dealerVal = computeBlackjackHandValue(dealerRevealed ? dealerFullHand : [dealerUpcard]);

  // Load scenario
  const loadScenario = (idx: number) => {
    const sc = PRESET_SCENARIOS[idx];
    setPlayerHand(sc.playerCards);
    setDealerUpcard(sc.dealerUpcard);
    const randomHole = createCard(
      ['T', '7', '8', '9', '6'][Math.floor(Math.random() * 5)] as CardRank,
      'c'
    );
    setDealerFullHand([sc.dealerUpcard, randomHole]);
    setDealerRevealed(false);
    setIsSplitMode(false);
    setSplitHands(null);
    setUserAction(null);
    setHandOutcomeText(null);
    setEvaluation(null);
    setCardsDealt(false);
  };

  // Change category and immediately jump to a matching scenario
  const handleSelectCategory = (catId: string) => {
    sounds.playClick();
    setActiveCategory(catId);
    if (catId === 'ALL') {
      loadScenario(0);
      setCurrentScenarioIdx(0);
      return;
    }
    const matchingIdx = PRESET_SCENARIOS.findIndex(s => s.targetCategory === catId);
    if (matchingIdx !== -1) {
      setCurrentScenarioIdx(matchingIdx);
      loadScenario(matchingIdx);
    }
  };

  const handleAddChipToBet = (denom?: number) => {
    if (cardsDealt) return;
    const addAmount = denom || activeChipDenom;
    if (credits < activeHandBet + addAmount) {
      sounds.playLoss();
      return;
    }
    sounds.playChip();
    setActiveHandBet(prev => prev + addAmount);
  };

  const handleClearBetChips = () => {
    if (cardsDealt) return;
    sounds.playClick();
    setActiveHandBet(25);
  };

  const handleDoubleBetChips = () => {
    if (cardsDealt) return;
    if (credits < activeHandBet * 2) {
      sounds.playLoss();
      return;
    }
    sounds.playChip();
    setActiveHandBet(prev => prev * 2);
  };

  const handleDealCards = () => {
    if (cardsDealt) return;
    if (credits < activeHandBet) {
      sounds.playLoss();
      return;
    }
    const placed = onBet(activeHandBet);
    if (!placed) return;

    sounds.playChip();
    sounds.playCardDeal();
    setCardsDealt(true);
    setIsSplitMode(false);
    setSplitHands(null);
    setUserAction(null);
    setHandOutcomeText(null);
    setEvaluation(null);
  };

  // Resolve dealer cards for standard hands
  const playOutDealer = () => {
    setDealerRevealed(true);
    let currentDealerCards = [...dealerFullHand];
    let dVal = computeBlackjackHandValue(currentDealerCards);

    while (dVal.total < 17 && currentDealerCards.length < 5) {
      const drawn = createCard(
        ['T', '4', '5', '6', '3'][Math.floor(Math.random() * 5)] as CardRank,
        'd'
      );
      currentDealerCards.push(drawn);
      dVal = computeBlackjackHandValue(currentDealerCards);
    }
    setDealerFullHand(currentDealerCards);
    return dVal;
  };

  const resolveDealerPlay = (currentPHand: CardBitfield[], finalBet: number, actionName: string) => {
    const dVal = playOutDealer();
    const pVal = computeBlackjackHandValue(currentPHand);

    if (pVal.total > 21) {
      sounds.playLoss();
      sounds.playChipsBurn();
      setHandOutcomeText(`Player Busted with ${pVal.total}! Lost ${finalBet} CR.`);
      onLoss(finalBet, `Busted Hand with ${pVal.total}`);
    } else if (dVal.total > 21) {
      sounds.playWin();
      sounds.playChipCollect();
      const payout = finalBet * 2;
      setHandOutcomeText(`Dealer Busted with ${dVal.total}! Player Wins +${finalBet} CR!`);
      onWin(payout, `Dealer Busted (${dVal.total})`);
      onRecordEarning(activeScenario.name, finalBet, `Dealer busted, paid 1:1 on ${actionName}`);
    } else if (pVal.total > dVal.total) {
      sounds.playWin();
      sounds.playChipCollect();
      const payout = finalBet * 2;
      setHandOutcomeText(`Player Wins ${pVal.total} vs Dealer ${dVal.total}! +${finalBet} CR!`);
      onWin(payout, `Higher Hand: ${pVal.total} vs ${dVal.total}`);
      onRecordEarning(activeScenario.name, finalBet, `Won hand ${pVal.total} vs ${dVal.total}`);
    } else if (pVal.total < dVal.total) {
      sounds.playLoss();
      sounds.playChipsBurn();
      setHandOutcomeText(`Dealer Wins ${dVal.total} vs Player ${pVal.total}. Lost ${finalBet} CR.`);
      onLoss(finalBet, `Dealer higher hand: ${dVal.total} vs ${pVal.total}`);
    } else {
      sounds.playChip();
      setHandOutcomeText(`Push! Both have ${pVal.total}. Bet of ${finalBet} CR returned.`);
      onPush(finalBet, `Push on ${pVal.total}`);
    }
  };

  // Resolve split hands
  const resolveSplitPlay = (h1: CardBitfield[], h2: CardBitfield[], betPerHand: number) => {
    const dVal = playOutDealer();
    const v1 = computeBlackjackHandValue(h1);
    const v2 = computeBlackjackHandValue(h2);

    let netWin = 0;
    const summaries: string[] = [];

    // Hand 1 evaluation
    if (v1.total > 21) {
      onLoss(betPerHand, 'Split Hand 1 Busted');
      summaries.push(`H1: Bust (${v1.total}) -${betPerHand}`);
    } else if (dVal.total > 21 || v1.total > dVal.total) {
      onWin(betPerHand * 2, 'Split Hand 1 Won');
      netWin += betPerHand;
      summaries.push(`H1: Win (${v1.total}) +${betPerHand}`);
    } else if (v1.total === dVal.total) {
      onPush(betPerHand, 'Split Hand 1 Push');
      summaries.push(`H1: Push (${v1.total})`);
    } else {
      onLoss(betPerHand, 'Split Hand 1 Lost');
      summaries.push(`H1: Lost (${v1.total} vs ${dVal.total}) -${betPerHand}`);
    }

    // Hand 2 evaluation
    if (v2.total > 21) {
      onLoss(betPerHand, 'Split Hand 2 Busted');
      summaries.push(`H2: Bust (${v2.total}) -${betPerHand}`);
    } else if (dVal.total > 21 || v2.total > dVal.total) {
      onWin(betPerHand * 2, 'Split Hand 2 Won');
      netWin += betPerHand;
      summaries.push(`H2: Win (${v2.total}) +${betPerHand}`);
    } else if (v2.total === dVal.total) {
      onPush(betPerHand, 'Split Hand 2 Push');
      summaries.push(`H2: Push (${v2.total})`);
    } else {
      onLoss(betPerHand, 'Split Hand 2 Lost');
      summaries.push(`H2: Lost (${v2.total} vs ${dVal.total}) -${betPerHand}`);
    }

    if (netWin > 0) {
      sounds.playWin();
      sounds.playChipCollect();
      onRecordEarning(activeScenario.name, netWin, 'Split hands positive expectation');
    } else if (netWin === 0) {
      sounds.playChip();
    } else {
      sounds.playLoss();
    }

    setHandOutcomeText(`Split Outcome: ${summaries.join(' | ')} (Dealer: ${dVal.total})`);
  };

  const handleAction = (action: 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT' | 'SURRENDER') => {
    if (userAction) return;

    // Auto-deal if the user jumped straight to an action
    if (!cardsDealt) {
      if (credits >= activeHandBet) {
        onBet(activeHandBet);
      }
      sounds.playCardDeal();
      setCardsDealt(true);
      setIsSplitMode(false);
      setSplitHands(null);
      setHandOutcomeText(null);
      setEvaluation(null);
    }

    // If player selected Split on an unequal hand, explain pedagogical rule
    if (action === 'SPLIT' && !isPairHand) {
      setUserAction(action);
      sounds.playLoss();
      sounds.playChipsBurn();
      onRecordMistake(
        activeScenario.name,
        action,
        activeScenario.expectedAction,
        activeHandBet,
        'Cannot split unequal ranks. Splitting is strictly permitted on pairs of identical rank (e.g. 8-8 or A-A).'
      );
      setEvaluation({
        isCorrect: false,
        feedbackTitle: '⚠️ ILLEGAL / SUB-OPTIMAL SPLIT (-EV)',
        feedbackText: `Splitting is only legal on pairs! On this hand (${playerVal.total}), optimal play is ${activeScenario.expectedAction}.`,
        evScore: -1.25
      });
      setHandOutcomeText(`Invalid Split: Hand is not a pair (${playerVal.total}). Correct play: ${activeScenario.expectedAction}.`);
      return;
    }

    setUserAction(action);

    const isMatch = action === activeScenario.expectedAction;
    const isDeviation = activeScenario.isDeviation;
    const ev = isMatch ? 1.25 : -1.25;

    if (!isMatch) {
      onRecordMistake(
        activeScenario.name,
        action,
        activeScenario.expectedAction,
        activeHandBet,
        activeScenario.explanation
      );
    }

    let finalHand = [...playerHand];
    let currentWager = activeHandBet;

    if (action === 'HIT') {
      sounds.playCardDeal();
      const drawnCard = createCard('5', 'd');
      finalHand = [...playerHand, drawnCard];
      setPlayerHand(finalHand);
      const newVal = computeBlackjackHandValue(finalHand);
      if (newVal.total > 21) {
        setDealerRevealed(true);
        sounds.playLoss();
        sounds.playChipsBurn();
        setHandOutcomeText(`Player Busted with ${newVal.total}! Lost ${currentWager} CR.`);
        onLoss(currentWager, `Player Busted on Hit`);
      } else {
        setTimeout(() => resolveDealerPlay(finalHand, currentWager, action), 400);
      }
    } else if (action === 'DOUBLE') {
      sounds.playChip();
      sounds.playCardDeal();
      const extraBet = activeHandBet;
      onBet(extraBet);
      currentWager = activeHandBet * 2;
      setActiveHandBet(currentWager);

      const drawnCard = createCard('T', 's');
      finalHand = [...playerHand, drawnCard];
      setPlayerHand(finalHand);
      setTimeout(() => resolveDealerPlay(finalHand, currentWager, action), 500);
    } else if (action === 'STAND') {
      sounds.playCardDeal();
      setTimeout(() => resolveDealerPlay(finalHand, currentWager, action), 400);
    } else if (action === 'SURRENDER') {
      sounds.playChip();
      sounds.playChipsBurn();
      const refunded = Math.floor(currentWager / 2);
      onPush(refunded, 'Surrender 50% refund');
      setDealerRevealed(true);
      setHandOutcomeText(`Surrendered: Forfeited 50% (${currentWager - refunded} CR), recovered ${refunded} CR.`);
    } else if (action === 'SPLIT') {
      sounds.playChip();
      sounds.playCardDeal();
      // Deduct second bet for split hand if bankroll allows
      if (credits >= activeHandBet) {
        onBet(activeHandBet);
      }

      // Create two separate hands from pair
      const card1 = playerHand[0] || createCard('8', 'c');
      const card2 = playerHand[1] || createCard('8', 'd');
      const drawn1 = createCard(['T', '9', '7', '8', 'J', 'Q'][Math.floor(Math.random() * 6)] as CardRank, 'h');
      const drawn2 = createCard(['T', '9', '6', '7', 'K', 'A'][Math.floor(Math.random() * 6)] as CardRank, 's');

      const h1 = [card1, drawn1];
      const h2 = [card2, drawn2];

      setIsSplitMode(true);
      setSplitHands({ hand1: h1, hand2: h2 });

      setTimeout(() => resolveSplitPlay(h1, h2, activeHandBet), 500);
    }

    setEvaluation({
      isCorrect: isMatch,
      feedbackTitle: isMatch
        ? isDeviation
          ? '🎯 PERFECT ILLUSTRIOUS 18 DEVIATION (+EV)!'
          : '✅ ACCURATE BASIC STRATEGY (+EV)!'
        : '⚠️ SUB-OPTIMAL ACTION (-EV LEAK)',
      feedbackText: activeScenario.explanation,
      evScore: ev
    });
  };

  const handleNextHand = () => {
    sounds.playClick();
    let candidates = PRESET_SCENARIOS;
    if (activeCategory !== 'ALL') {
      candidates = PRESET_SCENARIOS.filter(s => s.targetCategory === activeCategory);
    }
    const currentInFiltered = candidates.findIndex(s => s.id === activeScenario.id);
    const nextInFiltered = (currentInFiltered + 1) % candidates.length;
    const nextScenario = candidates[nextInFiltered];
    const fullIdx = PRESET_SCENARIOS.findIndex(s => s.id === nextScenario.id);
    setCurrentScenarioIdx(fullIdx);
    loadScenario(fullIdx);
  };

  const isPairHand = playerVal.isPair || activeScenario.expectedAction === 'SPLIT';

  return (
    <div className="space-y-4">
      {/* Category selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#0B121E] border border-[#233148] text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-arcade text-amber-400 uppercase font-bold mr-1">
            Drill:
          </span>
          {[
            { id: 'ALL', label: t.allHands },
            { id: 'ILLUSTRIOUS_18', label: t.illustrious18 },
            { id: 'SOFT_DOUBLES', label: t.softHands },
            { id: 'PAIR_SPLITS', label: t.pairSplits }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-arcade transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-[#141E30] text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Count Index Telemetry */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/40 border border-[#1E2B40] text-slate-300 font-mono-telemetry text-[11px]">
          <span>TC: <strong className="text-amber-300">{activeScenario.trueCount > 0 ? `+${activeScenario.trueCount}` : activeScenario.trueCount}</strong></span>
          <span className="text-slate-600">|</span>
          <span>RC: <strong className="text-emerald-300">{activeScenario.runningCount > 0 ? `+${activeScenario.runningCount}` : activeScenario.runningCount}</strong></span>
        </div>
      </div>

      {/* Main Blackjack Felt Table */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#051F14] via-[#04170E] to-[#020D08] border-2 border-emerald-600/40 shadow-2xl relative">
        {/* Outcome banner */}
        {handOutcomeText && (
          <div className="mb-3 px-3.5 py-2 rounded-xl bg-black/80 border border-amber-400/50 text-amber-200 font-arcade text-xs text-center shadow-lg animate-fade-in">
            {handOutcomeText}
          </div>
        )}

        {/* Dealer Stage */}
        <div className="flex flex-col items-center pb-3 border-b border-[#1A3828]">
          <span className="text-[11px] text-amber-200/90 font-arcade uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            {t.dealerHand} {dealerRevealed && `(${dealerVal.total})`}
          </span>

          <div className="flex items-center gap-2.5">
            {/* Dealer Upcard */}
            <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-xl bg-white border-2 border-amber-300 flex flex-col justify-between p-2 font-bold font-mono shadow-xl">
              <div className={`text-xs sm:text-sm leading-none ${dealerUpcard.suit === 'h' || dealerUpcard.suit === 'd' ? 'text-red-600' : 'text-slate-950'}`}>
                {dealerUpcard.rank}
              </div>
              <div className={`text-lg sm:text-2xl self-center leading-none ${dealerUpcard.suit === 'h' || dealerUpcard.suit === 'd' ? 'text-red-600' : 'text-slate-950'}`}>
                {dealerUpcard.suit === 'h' ? '♥' : dealerUpcard.suit === 'd' ? '♦' : dealerUpcard.suit === 'c' ? '♣' : '♠'}
              </div>
              <div className={`text-xs sm:text-sm leading-none self-end rotate-180 ${dealerUpcard.suit === 'h' || dealerUpcard.suit === 'd' ? 'text-red-600' : 'text-slate-950'}`}>
                {dealerUpcard.rank}
              </div>
            </div>

            {/* Dealer Hole Card */}
            {!dealerRevealed ? (
              <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-xl border-2 border-[#2A523A] bg-gradient-to-br from-[#0F2D1F] to-[#071911] shadow-xl flex flex-col items-center justify-center text-xl text-amber-400/80 font-arcade select-none">
                🂠
                <span className="text-[8px] text-emerald-400/70 font-mono-telemetry mt-1">HOLE</span>
              </div>
            ) : (
              dealerFullHand.slice(1).map((card, idx) => (
                <div
                  key={idx}
                  className="w-14 h-20 sm:w-16 sm:h-24 rounded-xl bg-white border-2 border-amber-300 flex flex-col justify-between p-2 font-bold font-mono shadow-xl animate-deal-card"
                >
                  <div className={`text-xs sm:text-sm leading-none ${card.suit === 'h' || card.suit === 'd' ? 'text-red-600' : 'text-slate-950'}`}>
                    {card.rank}
                  </div>
                  <div className={`text-lg sm:text-2xl self-center leading-none ${card.suit === 'h' || card.suit === 'd' ? 'text-red-600' : 'text-slate-950'}`}>
                    {card.suit === 'h' ? '♥' : card.suit === 'd' ? '♦' : card.suit === 'c' ? '♣' : '♠'}
                  </div>
                  <div className={`text-xs sm:text-sm leading-none self-end rotate-180 ${card.suit === 'h' || card.suit === 'd' ? 'text-red-600' : 'text-slate-950'}`}>
                    {card.rank}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Center: Betting Spot & Chip Stacking */}
        <div className="py-2.5 flex flex-col items-center justify-center relative">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div
                onClick={() => handleAddChipToBet()}
                className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full border-2 flex flex-col items-center justify-center transition-all select-none ${
                  !cardsDealt
                    ? 'cursor-pointer hover:border-amber-300 hover:shadow-lg active:scale-95'
                    : 'cursor-default'
                } ${
                  activeHandBet > 0
                    ? 'border-amber-400/80 bg-black/50 shadow-inner'
                    : 'border-dashed border-emerald-500/40 bg-emerald-950/20'
                }`}
                title={!cardsDealt ? `Tap to stack another $${activeChipDenom} chip` : `Wager: $${activeHandBet}`}
              >
                <div className="absolute inset-1 rounded-full border border-amber-400/30 pointer-events-none" />

                {activeHandBet > 0 ? (
                  <CasinoChipStack amount={activeHandBet} size="sm" />
                ) : (
                  <div className="text-center font-arcade text-emerald-400/80 text-[10px] leading-tight">
                    BETTING<br />CIRCLE
                  </div>
                )}

                {!cardsDealt && activeHandBet > 0 && (
                  <span className="absolute -bottom-2 px-1.5 py-0.2 rounded-full bg-slate-900/90 text-amber-300 text-[8px] font-arcade border border-amber-400/40 shadow-xs pointer-events-none whitespace-nowrap">
                    {t.tapToStack}
                  </span>
                )}
              </div>

              {/* Deal Cards Button */}
              {!cardsDealt && (
                <button
                  onClick={handleDealCards}
                  className="mt-2.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-arcade font-bold text-xs tracking-wider shadow-lg flex items-center gap-1.5 active:scale-95 cursor-pointer animate-pulse"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.dealCards} (${activeHandBet})
                </button>
              )}
            </div>

            {/* Chip Tray */}
            {!cardsDealt && (
              <div className="flex flex-col gap-1 bg-[#06120b]/90 p-1.5 rounded-2xl border border-emerald-500/30 shadow-md">
                <span className="text-[8px] font-arcade text-slate-300 text-center uppercase tracking-wider">
                  {t.placeChips}
                </span>
                <div className="flex items-center gap-1.5">
                  {[10, 25, 50, 100, 500].map(val => (
                    <button
                      key={val}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveChipDenom(val);
                        handleAddChipToBet(val);
                      }}
                      className={`transition-transform cursor-pointer active:scale-90 hover:scale-110 p-0.5 rounded-full ${
                        activeChipDenom === val ? 'ring-2 ring-amber-400 bg-amber-400/20' : ''
                      }`}
                    >
                      <CasinoChipStack amount={val} size="xs" showCount={false} />
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-1 pt-1 border-t border-emerald-950/60">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDoubleBetChips();
                    }}
                    className="px-2 py-0.5 rounded-lg bg-[#14291f] hover:bg-[#1f3f30] border border-[#2b5944] text-amber-300 font-arcade text-[8px] font-bold cursor-pointer active:scale-95"
                  >
                    {t.doubleChips}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearBetChips();
                    }}
                    className="px-2 py-0.5 rounded-lg bg-[#2b1619] hover:bg-[#401f24] border border-[#592b32] text-rose-300 font-arcade text-[8px] font-bold cursor-pointer active:scale-95"
                  >
                    {t.resetBet}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Player Hands Display */}
        <div className="flex flex-col items-center py-2">
          {!isSplitMode ? (
            <>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-arcade font-bold text-white uppercase tracking-wider">
                  {t.yourHand}: {!cardsDealt ? t.placeBetToDeal : `TOTAL ${playerVal.total}`}
                </span>
                {cardsDealt && playerVal.isSoft && (
                  <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-mono-telemetry font-bold border border-sky-500/30">
                    {t.soft}
                  </span>
                )}
                {cardsDealt && playerVal.isPair && (
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono-telemetry font-bold border border-purple-500/30">
                    {t.pair}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono-telemetry font-bold border border-amber-500/30">
                  {t.wager}: {activeHandBet} CR
                </span>
              </div>

              {/* Player Cards */}
              <div className="flex items-center gap-2.5">
                {!cardsDealt ? (
                  <>
                    <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-xl border-2 border-dashed border-emerald-500/40 bg-emerald-950/20 shadow-inner flex flex-col items-center justify-center text-xs text-emerald-400 font-arcade select-none">
                      🂠
                      <span className="text-[8px] text-emerald-300/60 font-mono-telemetry mt-1">CARD 1</span>
                    </div>
                    <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-xl border-2 border-dashed border-emerald-500/40 bg-emerald-950/20 shadow-inner flex flex-col items-center justify-center text-xs text-emerald-400 font-arcade select-none">
                      🂠
                      <span className="text-[8px] text-emerald-300/60 font-mono-telemetry mt-1">CARD 2</span>
                    </div>
                  </>
                ) : (
                  playerHand.map((card, idx) => {
                    const isRed = card.suit === 'h' || card.suit === 'd';
                    return (
                      <div
                        key={idx}
                        className="w-14 h-20 sm:w-16 sm:h-24 rounded-xl bg-white border-2 border-amber-300 flex flex-col justify-between p-2 font-bold font-mono shadow-xl animate-deal-card"
                      >
                        <div className={`text-xs sm:text-sm leading-none ${isRed ? 'text-red-600' : 'text-slate-950'}`}>
                          {card.rank}
                        </div>
                        <div className={`text-lg sm:text-2xl self-center leading-none ${isRed ? 'text-red-600' : 'text-slate-950'}`}>
                          {card.suit === 'h' ? '♥' : card.suit === 'd' ? '♦' : card.suit === 'c' ? '♣' : '♠'}
                        </div>
                        <div className={`text-xs sm:text-sm leading-none self-end rotate-180 ${isRed ? 'text-red-600' : 'text-slate-950'}`}>
                          {card.rank}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            /* Split Hands View */
            <div className="w-full flex flex-col items-center gap-2">
              <span className="text-xs font-arcade font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1.5">
                <Scissors className="w-4 h-4 text-purple-400" />
                SPLIT ACTIVE: TWO HANDS (${activeHandBet} EACH)
              </span>

              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                {/* Split Hand 1 */}
                <div className="flex flex-col items-center p-2 rounded-2xl bg-black/40 border border-purple-500/40 shadow-md">
                  <span className="text-[10px] font-arcade text-purple-300 font-bold mb-1">
                    {t.splitHand1} ({computeBlackjackHandValue(splitHands!.hand1).total})
                  </span>
                  <div className="flex items-center gap-1.5">
                    {splitHands!.hand1.map((card, idx) => {
                      const isRed = card.suit === 'h' || card.suit === 'd';
                      return (
                        <div
                          key={idx}
                          className="w-12 h-18 sm:w-14 sm:h-20 rounded-xl bg-white border-2 border-purple-300 flex flex-col justify-between p-1.5 font-bold font-mono shadow-md animate-deal-card"
                        >
                          <div className={`text-xs leading-none ${isRed ? 'text-red-600' : 'text-slate-950'}`}>{card.rank}</div>
                          <div className={`text-base self-center leading-none ${isRed ? 'text-red-600' : 'text-slate-950'}`}>
                            {card.suit === 'h' ? '♥' : card.suit === 'd' ? '♦' : card.suit === 'c' ? '♣' : '♠'}
                          </div>
                          <div className={`text-xs leading-none self-end rotate-180 ${isRed ? 'text-red-600' : 'text-slate-950'}`}>{card.rank}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Split Hand 2 */}
                <div className="flex flex-col items-center p-2 rounded-2xl bg-black/40 border border-purple-500/40 shadow-md">
                  <span className="text-[10px] font-arcade text-purple-300 font-bold mb-1">
                    {t.splitHand2} ({computeBlackjackHandValue(splitHands!.hand2).total})
                  </span>
                  <div className="flex items-center gap-1.5">
                    {splitHands!.hand2.map((card, idx) => {
                      const isRed = card.suit === 'h' || card.suit === 'd';
                      return (
                        <div
                          key={idx}
                          className="w-12 h-18 sm:w-14 sm:h-20 rounded-xl bg-white border-2 border-purple-300 flex flex-col justify-between p-1.5 font-bold font-mono shadow-md animate-deal-card"
                        >
                          <div className={`text-xs leading-none ${isRed ? 'text-red-600' : 'text-slate-950'}`}>{card.rank}</div>
                          <div className={`text-base self-center leading-none ${isRed ? 'text-red-600' : 'text-slate-950'}`}>
                            {card.suit === 'h' ? '♥' : card.suit === 'd' ? '♦' : card.suit === 'c' ? '♣' : '♠'}
                          </div>
                          <div className={`text-xs leading-none self-end rotate-180 ${isRed ? 'text-red-600' : 'text-slate-950'}`}>{card.rank}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Action Buttons - Spacious, ergonomic, responsive with icons and safe text */}
        <div className="pt-3 border-t border-[#254231]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {/* HIT */}
            <button
              onClick={() => handleAction('HIT')}
              disabled={!!userAction}
              className={`min-h-[50px] sm:min-h-[54px] px-3 py-2.5 rounded-2xl font-arcade font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 ${
                userAction === 'HIT'
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-105'
                  : userAction
                  ? 'bg-[#101F18] text-slate-600 border border-slate-700/40 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white active:scale-95'
              }`}
            >
              <Zap className="w-4 h-4 shrink-0 text-amber-300" />
              <span className="whitespace-nowrap">{t.hit}</span>
            </button>

            {/* STAND */}
            <button
              onClick={() => handleAction('STAND')}
              disabled={!!userAction}
              className={`min-h-[50px] sm:min-h-[54px] px-3 py-2.5 rounded-2xl font-arcade font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 ${
                userAction === 'STAND'
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-105'
                  : userAction
                  ? 'bg-[#101F18] text-slate-600 border border-slate-700/40 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white active:scale-95'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0 text-sky-300" />
              <span className="whitespace-nowrap">{t.stand}</span>
            </button>

            {/* DOUBLE */}
            <button
              onClick={() => handleAction('DOUBLE')}
              disabled={!!userAction || (cardsDealt && playerHand.length > 2)}
              className={`min-h-[50px] sm:min-h-[54px] px-3 py-2.5 rounded-2xl font-arcade font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 ${
                userAction === 'DOUBLE'
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-105'
                  : userAction || (cardsDealt && playerHand.length > 2)
                  ? 'bg-[#101F18] text-slate-600 border border-slate-700/40 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 active:scale-95'
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0 text-slate-950" />
              <span className="whitespace-nowrap">{t.double}</span>
            </button>

            {/* SPLIT - Fully Functional & Accessible */}
            <button
              onClick={() => handleAction('SPLIT')}
              disabled={!!userAction}
              className={`min-h-[50px] sm:min-h-[54px] px-3 py-2.5 rounded-2xl font-arcade font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 ${
                userAction === 'SPLIT'
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-105'
                  : userAction
                  ? 'bg-[#101F18] text-slate-600 border border-slate-700/40 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-500 hover:to-violet-600 text-white active:scale-95'
              }`}
              title={isPairHand ? 'Split pair into two independent hands' : 'Split pair (requires matching cards)'}
            >
              <Scissors className="w-4 h-4 shrink-0 text-purple-200" />
              <span className="whitespace-nowrap">{t.split}</span>
            </button>

            {/* SURRENDER */}
            <button
              onClick={() => handleAction('SURRENDER')}
              disabled={!!userAction || (cardsDealt && playerHand.length > 2)}
              className={`col-span-2 sm:col-span-1 min-h-[50px] sm:min-h-[54px] px-3 py-2.5 rounded-2xl font-arcade font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 ${
                userAction === 'SURRENDER'
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-105'
                  : userAction || (cardsDealt && playerHand.length > 2)
                  ? 'bg-[#101F18] text-slate-600 border border-slate-700/40 cursor-not-allowed opacity-50'
                  : 'bg-[#1A2536] hover:bg-[#25354D] text-slate-200 border border-[#3A4E70] active:scale-95'
              }`}
            >
              <Flag className="w-4 h-4 shrink-0 text-slate-300" />
              <span className="whitespace-nowrap">{t.surrender}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Advantage Evaluation Panel */}
      {evaluation && (
        <div className={`p-4 rounded-2xl border-2 text-xs space-y-2.5 shadow-xl animate-fade-in ${
          evaluation.isCorrect
            ? 'bg-[#091C14] border-emerald-500/60 text-emerald-100'
            : 'bg-[#210D12] border-rose-500/60 text-rose-100'
        }`}>
          <div className="flex items-center justify-between">
            <h4 className="font-arcade font-bold text-sm tracking-wide flex items-center gap-1.5">
              {evaluation.isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300">{evaluation.feedbackTitle}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span className="text-rose-300">{evaluation.feedbackTitle}</span>
                </>
              )}
            </h4>
            <span className="px-2 py-0.5 rounded font-mono-telemetry font-bold text-xs bg-black/40 border border-white/10">
              {evaluation.evScore > 0 ? `+${evaluation.evScore.toFixed(2)} EV` : `${evaluation.evScore.toFixed(2)} EV`}
            </span>
          </div>

          <p className="text-slate-300 leading-relaxed font-sans-arcade text-xs">
            {evaluation.feedbackText}
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-[11px] text-slate-400 font-arcade">
              {t.scenario}: <strong className="text-white">{activeScenario.name}</strong>
            </span>
            <button
              onClick={handleNextHand}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-arcade font-bold text-xs tracking-wider flex items-center gap-1 shadow-md active:scale-95 cursor-pointer"
            >
              {t.nextHand} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
