import { Language } from './translations';

export interface AcademyLevel {
  badge: string;
  title: string;
  description: string;
  formula?: string;
  details?: string;
  highlight?: string;
}

export interface AcademyGameContent {
  id: 'kelly' | 'blackjack' | 'slots' | 'poker' | 'roulette';
  tabLabel: string;
  badge: string;
  heroTitle: string;
  heroIntro: string;
  howToPlayTitle: string;
  howToPlayText: string;
  howItWorksTitle: string;
  howItWorksText: string;
  levels: AcademyLevel[];
}

export const ACADEMY_CONTENT: Record<Language, Record<'kelly' | 'blackjack' | 'slots' | 'poker' | 'roulette', AcademyGameContent>> = {
  en: {
    kelly: {
      id: 'kelly',
      tabLabel: 'Kelly System (Risk)',
      badge: 'BANKROLL PROTOCOL',
      heroTitle: 'THE KELLY SYSTEM IN PLAIN ENGLISH: WHY IT MATTERS',
      heroIntro: 'Many gamblers lose money even when they have a genuine advantage because they bet the wrong amount. Bet too little, and you make almost nothing. Bet too much, and normal bad variance bankrupts you. Kelly calculates the exact perfect bet size to compound your bankroll as fast as mathematically possible while protecting you from ruin.',
      howToPlayTitle: 'HOW TO USE IT IN CASINOS & BETTING',
      howToPlayText: 'Estimate your true advantage (Edge, e.g. +2% in blackjack) and payout odds. Calculate your Kelly fraction f* = Edge / Odds. If your bankroll is $10,000 and f* is 1%, bet $100. Never increase bet size when losing.',
      howItWorksTitle: 'THE MATHEMATICAL PROOF (GEOMETRIC COMPOUNDING)',
      howItWorksText: 'Flat betting increases your wealth linearly (arithmetic growth). Kelly betting compounds your wealth exponentially (logarithmic utility). It guarantees that in the long run, your bankroll will strictly exceed any other betting strategy with probability 1.',
      levels: [
        {
          badge: 'LEVEL 0',
          title: 'THE COIN FLIP RIDDLE (CORE INTUITION)',
          description: 'Imagine a coin that lands on Heads 60% of the time, paying 1:1. You start with $1,000. If you bet $1,000 on one flip, you have a 40% chance of immediate bankruptcy (Tails = $0). If you bet $5 (0.5%), you make almost nothing. Kelly proves that betting exactly 20% ($200) compounds faster than any other number.',
        },
        {
          badge: 'LEVEL 1',
          title: 'THE CORE FORMULA',
          description: 'For even money bets (1:1 payout): Fraction f* = Probability of Winning - Probability of Losing = (p - q). In a 60% win-rate coin flip: f* = 0.60 - 0.40 = 0.20 (20% of your bankroll).',
          formula: 'f* = (b × p - q) ÷ b   |   For 1:1 bets: f* = p - q'
        },
        {
          badge: 'LEVEL 2',
          title: 'THE OVERBETTING CLIFF (THE 2X TRAP)',
          description: 'If you bet double the Kelly amount (2 × Kelly), your long-term expected growth drops to EXACTLY ZERO! If you bet more than 2x Kelly, your math is NEGATIVE and bankruptcy is 100% guaranteed, even with a huge edge!',
          highlight: 'Betting 2x Kelly produces 0% growth. Betting >2x Kelly guarantees bankruptcy!'
        },
        {
          badge: 'LEVEL 3',
          title: 'WHY PROS PLAY "HALF-KELLY" (0.50 f*)',
          description: 'Advantage players bet Half-Kelly (0.50 fraction). Why? Half-Kelly gives you 75% of the maximum possible compounding speed, but cuts your bankroll swings (volatility) by 50% and reduces your Risk of Ruin to under 1.8%!',
        }
      ]
    },
    blackjack: {
      id: 'blackjack',
      tabLabel: 'Blackjack & Hi-Lo',
      badge: 'AP FOUNDATION',
      heroTitle: 'BLACKJACK ZERO TO HERO: FROM CASINO CHUMP TO MATH SHARK',
      heroIntro: 'Blackjack is the only table game in the casino where player decisions alter the deck composition for future rounds. Using Basic Strategy and Hi-Lo Card Counting, you can flip the house edge from -0.5% into a +1.5% to +2.5% player advantage!',
      howToPlayTitle: 'HOW TO PLAY & BASIC RULES',
      howToPlayText: 'Beat the dealer by holding a hand total higher than the dealer without busting over 21. Cards 2-10 are face value, J/Q/K are 10, Ace is 1 or 11. Blackjack pays 3:2. The dealer must draw to 16 and stand on 17.',
      howItWorksTitle: 'WHERE THE ADVANTAGE COMES FROM',
      howItWorksText: 'The casino house edge exists solely because the player must act first; if you bust, you lose your wager even if the dealer later busts. Card counting balances this by tracking the ratio of high cards (10s and Aces) to low cards (2-6).',
      levels: [
        {
          badge: 'LEVEL 0',
          title: 'BEAT THE DEALER, NOT 21',
          description: 'Your goal is NOT to get 21. Your goal is to beat the dealer. When the dealer shows a 4, 5, or 6, they have a ~42% chance of busting. Stand on weak totals (12-16) and let the dealer break!',
        },
        {
          badge: 'LEVEL 1',
          title: 'BASIC STRATEGY IS MATHEMATICAL LAW',
          description: 'Basic Strategy was solved on mainframe computers in 1956. Always split Aces and 8s. Never split 10s or 5s. Double down on 11 against any dealer card lower than an Ace. This reduces the house edge to ~0.5%.',
        },
        {
          badge: 'LEVEL 2',
          title: 'THE HI-LO CARD COUNTING ENGINE',
          description: 'Tag each card: 2, 3, 4, 5, 6 = +1; 7, 8, 9 = 0; 10, J, Q, K, A = -1. When small cards leave the deck, the count goes UP. A high count means high cards remain, producing more 3:2 Blackjacks and dealer busts.',
        },
        {
          badge: 'LEVEL 3',
          title: 'TRUE COUNT & BET SPREAD',
          description: 'True Count (TC) = Running Count ÷ Decks Remaining. When TC ≥ +2, the player holds the edge! Raise your bet from 1 unit up to 8-12 units. When TC ≤ +1, keep bets at table minimum.',
          formula: 'True Count (TC) = Running Count (RC) ÷ Decks Remaining'
        }
      ]
    },
    slots: {
      id: 'slots',
      tabLabel: 'Must-Hit-By Slots',
      badge: 'PROGRESSIVE RADAR',
      heroTitle: 'MUST-HIT-BY SLOTS: HOW PROS BEAT THE CASINO MACHINES',
      heroIntro: 'Standard slot machines are unbeatable long-term due to an 88% to 92% base Return to Player (RTP). However, progressive slots equipped with a guaranteed "Must Hit By" ceiling turn mathematically positive (+EV) when the jackpot meter approaches the cap!',
      howToPlayTitle: 'HOW MUST-HIT-BY MACHINES OPERATE',
      howToPlayText: 'Insert money and spin the reels. Each spin deducts your bet and triggers the random reel strips. Simultaneously, 2% to 4% of every dollar wagered is added to the progressive jackpot meter. The jackpot MUST trigger at or before reaching the specified cap (e.g., $500.00).',
      howItWorksTitle: 'THE +EV ADVANTAGE PLAY BREAK-EVEN MATH',
      howItWorksText: 'When the progressive meter is reset, the RNG secretly selects a winning number between reset and the cap. If you scout a machine where the meter has climbed within striking distance of the cap, the expected jackpot payout exceeds the expected base game loss!',
      levels: [
        {
          badge: 'LEVEL 0',
          title: 'THE SECRET TRIGGER NUMBER',
          description: 'The moment a jackpot resets (e.g., at $250 with a $500 cap), the machine RNG generates a secret trigger between $250.00 and $500.00. The player whose spin ticks the meter to that secret number wins the entire jackpot instantly.',
        },
        {
          badge: 'LEVEL 1',
          title: 'DISTANCE TO CAP (ΔJ)',
          description: 'Distance ΔJ = Cap - Current Meter. If a $500 cap machine is showing $492.50, ΔJ is only $7.50! The jackpot is mathematically guaranteed to trigger within $7.50 of meter growth.',
        },
        {
          badge: 'LEVEL 2',
          title: 'THE EXACT BREAK-EVEN FORMULA',
          description: 'For an 88% RTP machine with 3% meter contribution, the break-even meter J_b is roughly Cap - [Cap × (1 - Base RTP) ÷ (2 × Meter Rate)]. On a $500 cap machine, any meter above $470 is positive expectation (+EV)!',
          formula: 'Break-Even Point = Cap - [Cap × (1 - Base RTP)] ÷ (2 × Meter Rate)'
        }
      ]
    },
    poker: {
      id: 'poker',
      tabLabel: 'Poker & Pot Odds',
      badge: 'GAME THEORY OPTIMAL',
      heroTitle: 'POKER & POT ODDS ZERO TO HERO: THE SCIENCE OF EQUITY',
      heroIntro: 'Poker is not gambling; it is a game of incomplete information governed by combinatorics and game theory. By calculating Pot Odds and comparing them to your Card Equity, every decision becomes a clear mathematical calculation.',
      howToPlayTitle: 'HOW TO PLAY TEXAS HOLD\'EM',
      howToPlayText: 'Each player receives 2 private hole cards. Five community cards are dealt on the board: Flop (3 cards), Turn (1 card), and River (1 card). Combine your cards with board cards to make the best 5-card hand. Bet, Call, Raise, or Fold.',
      howItWorksTitle: 'POT ODDS & EXPECTED VALUE (+EV)',
      howItWorksText: 'Pot odds represent the price the pot is offering you to call. If the pot offers you 4 to 1 (20% equity needed) and your hand has a 35% chance of hitting the winning card, calling is mathematically guaranteed to generate long-term profit.',
      levels: [
        {
          badge: 'LEVEL 0',
          title: 'POT ODDS: THE PRICE TO CALL',
          description: 'Pot Odds = Bet Faced ÷ (Current Pot + Bet Faced + Your Call). If there is $100 in the pot and villain bets $50, you must pay $50 to win a total pot of $200. Your pot odds are $50 / $200 = 25%.',
          formula: 'Required Equity = Bet Faced ÷ (Current Pot + Bet Faced + Your Call)'
        },
        {
          badge: 'LEVEL 1',
          title: 'THE RULE OF 2 AND 4 (OUTS TO EQUITY)',
          description: 'Count unseen winning cards (Outs). On the Flop (with 2 cards to come), multiply outs by 4 to get approximate percentage equity. On the Turn (1 card to come), multiply outs by 2. Example: 9 flush outs on Turn = 9 × 2 = ~18% equity.',
        },
        {
          badge: 'LEVEL 2',
          title: 'THE GOLDEN +EV CALLING RULE',
          description: 'Compare your Equity to Pot Odds: If Hand Equity ≥ Pot Odds, calling is PROFITABLE (+EV). If Hand Equity < Pot Odds, calling is an EV LEAK that will bleed your bankroll over time!',
        },
        {
          badge: 'LEVEL 3',
          title: 'MINIMUM DEFENSE FREQUENCY (MDF)',
          description: 'MDF = Pot ÷ (Pot + Bet). If villain bets 50% of the pot, MDF is 66.7%. You must continue with at least 66.7% of your range so your opponent cannot automatically profit by bluffing with any two random cards.',
          formula: 'MDF = Pot Size ÷ (Pot Size + Bet Faced)'
        }
      ]
    },
    roulette: {
      id: 'roulette',
      tabLabel: 'Roulette & House Edge',
      badge: 'PHYSICS & PROBABILITY',
      heroTitle: 'ROULETTE & THE GAMBLER\'S FALLACY: EXPOSING CASINO TRAPS',
      heroIntro: 'Roulette is mechanically immutable. Understanding where the casino\'s mathematical edge originates protects your bankroll from dangerous progressive betting traps like the Martingale system.',
      howToPlayTitle: 'HOW TO PLAY ROULETTE',
      howToPlayText: 'Place chips on numbers (1-36), colors (Red/Black), odd/even, dozens, or columns. The croupier spins the wheel in one direction and launches a ball in the opposite direction. When the ball settles into a pocket, winning bets are paid.',
      howItWorksTitle: 'WHY THE CASINO ALWAYS WINS (THE GREEN ZERO)',
      howItWorksText: 'On a European wheel, there are 37 pockets (1-36 and green 0). A single number bet pays 35:1, but the true mathematical probability is 1 in 37! That 1 missing pocket creates an inescapable 2.70% house edge.',
      levels: [
        {
          badge: 'LEVEL 0',
          title: 'EUROPEAN VS AMERICAN WHEELS',
          description: 'European wheels have 1 green zero (2.70% house edge). American wheels add a green double-zero 00 (38 pockets), which almost DOUBLES the house edge to 5.26%! Never play American roulette if a European wheel is available.',
        },
        {
          badge: 'LEVEL 1',
          title: 'FRENCH ROULETTE & LA PARTAGE (1.35% EDGE)',
          description: 'Under French rules with "La Partage", when the ball lands on 0, players only lose 50% of even-money wagers (Red/Black, Odd/Even, 1-18/19-36). This cuts the house edge in half to 1.35%, making it the best roulette game in the world.',
        },
        {
          badge: 'LEVEL 2',
          title: 'THE GAMBLER\'S FALLACY DEBUNKED',
          description: '"Red hit 8 times in a row, so Black is due!" — 100% FALSE. The wheel has no memory, no consciousness, and no karma. On the 9th spin, the chance of Red is still exactly 18/37 (48.65%), identical to every previous spin.',
        },
        {
          badge: 'LEVEL 3',
          title: 'WHY MARTINGALE GUARANTEES RUIN',
          description: 'Doubling your bet after every loss ($10, $20, $40, $80, $160, $320, $640, $1280...) looks fool-proof to amateurs. But after 8 losses in a row, you must risk $2,560 just to win $10! Table limits ($500-$2000) will cap your bet, wiping out months of profits in a single catastrophic spin.',
        }
      ]
    }
  },
  ru: {
    kelly: {
      id: 'kelly',
      tabLabel: 'Критерий Келли',
      badge: 'ПРОТОКОЛ БАНКРОЛЛА',
      heroTitle: 'СИСТЕМА КЕЛЛИ ПРОСТЫМИ СЛОВАМИ: ПОЧЕМУ ЭТО ВАЖНО',
      heroIntro: 'Многие игроки проигрывают деньги, даже обладая реальным математическим перевесом, потому что ставят неправильные суммы. Ставите слишком мало — топчетесь на месте. Ставите слишком много — нормальная дисперсия приводит к банкротству. Формула Келли рассчитывает идеальный размер ставки для максимально быстрого роста банкролла при защите от разорения.',
      howToPlayTitle: 'КАК ИСПОЛЬЗОВАТЬ В ИГРЕ И СТАВКАХ',
      howToPlayText: 'Оцените ваш реальный перевес (например, +2% в блэкджеке) и коэффициент выплаты. Рассчитайте долю f* = Перевес / Коэффициент. Если банкролл $10,000, а f* = 1%, ставьте $100. Никогда не увеличивайте ставку при проигрыше.',
      howItWorksTitle: 'МАТЕМАТИЧЕСКОЕ ДОКАЗАТЕЛЬСТВО',
      howItWorksText: 'Фиксированная ставка увеличивает баланс линейно. Ставки по Келли разгоняют баланс экспоненциально за счет сложного геометрического процента. На дистанции этот метод превосходит любую другую стратегию в мире с вероятностью 1.',
      levels: [
        {
          badge: 'УРОВЕНЬ 0',
          title: 'ЗАГАДКА С МОНЕТОЙ (ИНТУИЦИЯ КЕЛЛИ)',
          description: 'Представьте монету, которая выпадает орлом в 60% случаев с выплатой 1:1. У вас $1,000. Если поставить все $1,000, при первом же выпадении решки (40% шанс) вы банкрот. Если ставить по $5, вы почти ничего не заработаете. Келли доказывает: ровно 20% ($200) дают максимальный рост.',
        },
        {
          badge: 'УРОВЕНЬ 1',
          title: 'ОСНОВНАЯ ФОРМУЛА',
          description: 'Для ставок с выплатой 1:1: Доля f* = Вероятность выигрыша - Вероятность проигрыша = (p - q). При 60% шансе на победу: f* = 0.60 - 0.40 = 0.20 (20% от текущего банка).',
          formula: 'f* = (b × p - q) ÷ b   |   Для выплат 1:1: f* = p - q'
        },
        {
          badge: 'УРОВЕНЬ 2',
          title: 'ЛОВУШКА 2X КЕЛЛИ (ОБРЫВ ПЕРЕСТАВКИ)',
          description: 'Если вы поставите в два раза больше рекомендованного размера Келли (2 × Келли), долгосрочный прирост упадет ровно до НУЛЯ! Если ставить более 2x Келли, банкротство математически неизбежно (100%), даже при огромном перевесе!',
          highlight: 'Ставка 2x Келли дает 0% роста. Ставка >2x Келли гарантирует полное банкротство!'
        },
        {
          badge: 'УРОВЕНЬ 3',
          title: 'ПОЧЕМУ ПРОФЕССИОНАЛЫ СТАВЯТ ПОЛОВИНУ КЕЛЛИ (0.50 f*)',
          description: 'Профессионалы ставят "Half-Kelly" (50% от формулы). Это обеспечивает 75% от максимальной скорости роста банка, снижает колебания (просадку) на 50% и уменьшает риск разорения до ничтожных 1.8%!',
        }
      ]
    },
    blackjack: {
      id: 'blackjack',
      tabLabel: 'Блэкджек и Hi-Lo',
      badge: 'БАЗА ПРЕИМУЩЕСТВА',
      heroTitle: 'БЛЭКДЖЕК: ОТ НОВИЧКА ДО МАСТЕРА МАТЕМАТИКИ',
      heroIntro: 'Блэкджек — единственная настольная игра в казино, где решения игрока меняют состав колоды для будущих раундов. Базовая стратегия и счет карт Hi-Lo превращают преимущество казино -0.5% в преимущество игрока от +1.5% до +2.5%!',
      howToPlayTitle: 'КАК ИГРАТЬ И ПРАВИЛА',
      howToPlayText: 'Победите дилера, набрав сумму очков ближе к 21, чем у дилера, не превышая 21. Карты 2-10 = номинал, картинки = 10, Туз = 1 или 11. Натуральный блэкджек оплачивается 3:2. Дилер обязан добирать до 16 и останавливаться на 17.',
      howItWorksTitle: 'ОТКУДА БЕРЕТСЯ ПРЕИМУЩЕСТВО',
      howItWorksText: 'Казино имеет перевес только потому, что игрок ходит первым: если вы перебрали, вы сразу теряете ставку, даже если дилер тоже сгорит. Счет карт компенсирует это, отслеживая выход мелких карт (2-6), оставляя колоду насыщенной десятками и тузами.',
      levels: [
        {
          badge: 'УРОВЕНЬ 0',
          title: 'ЦЕЛЬ — ПОБЕДИТЬ ДИЛЕРА, А НЕ НАБРАТЬ 21',
          description: 'Не стремитесь во что бы то ни стало набрать 21. Если у дилера открыта карта 4, 5 или 6, вероятность его перебора составляет ~42%. Останавливайтесь на жестких 12-16 и дайте дилеру сгореть!',
        },
        {
          badge: 'УРОВЕНЬ 1',
          title: 'БАЗОВАЯ СТРАТЕГИЯ — ЭТО ЗАКОН',
          description: 'Базовая стратегия рассчитана компьютерами в 1956 году. Всегда разделяйте Тузов и восьмерки. Никогда не разделяйте десятки и пятерки. Удваивайте на 11 против карт дилера слабее Туза. Это снижает преимущество казино до 0.5%.',
        },
        {
          badge: 'УРОВЕНЬ 2',
          title: 'СИСТЕМА СЧЕТА КАРТ HI-LO',
          description: 'Мелкие карты 2-6 дают +1; нейтральные 7-9 дают 0; крупные 10, J, Q, K, A дают -1. Когда выходят мелкие карты, счет растет. Высокий счет означает избыток десяток, приносящих выплаты 3:2 и переборы у дилера.',
        },
        {
          badge: 'УРОВЕНЬ 3',
          title: 'ИСТИННЫЙ СЧЕТ (TRUE COUNT) И РАЗМЕР СТАВОК',
          description: 'Истинный счет = Текущий счет / Количество оставшихся колод. Когда TC ≥ +2, перевес переходит к вам! Поднимайте ставку с 1 базовой единицы до 8-12 единиц. При счете TC ≤ +1 ставьте минимум.',
          formula: 'Истинный счет (TC) = Текущий счет (RC) ÷ Оставшиеся колоды'
        }
      ]
    },
    slots: {
      id: 'slots',
      tabLabel: 'Слоты Must-Hit-By',
      badge: 'ПРОГРЕССИВНЫЙ РАДАР',
      heroTitle: 'СЛОТЫ С ФИКСИРОВАННЫМ ДЖЕКПОТОМ: КАК ОБЫГРЫВАТЬ АВТОМАТЫ',
      heroIntro: 'Обычные игровые автоматы невозможно обыграть на дистанции из-за отдачи 88-92% (RTP). Однако слоты с гарантированным порогом "Must Hit By" становятся математически плюсовыми (+EV), когда джекпот подходит близко к лимиту!',
      howToPlayTitle: 'КАК РАБОТАЮТ АВТОМАТЫ MUST-HIT-BY',
      howToPlayText: 'Опускаете монеты и вращаете барабаны. Каждое вращение отчисляет 2-4% от вашей ставки в прогрессивный счетчик джекпота. Автомат ОБЯЗАН выдать джекпот до достижения указанной суммы (например, до $500.00).',
      howItWorksTitle: 'МАТЕМАТИКА БЕЗУБЫТОЧНОСТИ И ПРЕИМУЩЕСТВА',
      howItWorksText: 'При сбросе джекпота ГСЧ секретно выбирает число между минимумом и максимумом. Если счетчик уже подошел вплотную к потолку, ожидаемый выигрыш джекпота превосходит все потери базовой игры!',
      levels: [
        {
          badge: 'УРОВЕНЬ 0',
          title: 'СЕКРЕТНОЕ СЛУЧАЙНОЕ ЧИСЛО ТРИГГЕРА',
          description: 'Когда джекпот сбрасывается на $250 с лимитом $500, чип ГСЧ в автомате выбирает тайное число между $250.00 и $500.00. Тот, кто своим спином доведет счетчик до этого числа, сразу забирает весь джекпот.',
        },
        {
          badge: 'УРОВЕНЬ 1',
          title: 'ДИСТАНЦИЯ ДО ПОТОЛКА (ΔJ)',
          description: 'Дистанция ΔJ = Лимит - Текущий счетчик. Если на автомате с лимитом $500 счетчик показывает $492.50, дистанция всего $7.50! Джекпот гарантированно выпадет в пределах роста на $7.50.',
        },
        {
          badge: 'УРОВЕНЬ 2',
          title: 'ТОЧНАЯ ФОРМУЛА БЕЗУБЫТОЧНОСТИ',
          description: 'Для автомата с базовой отдачей 88% и взносом 3% порог безубыточности составляет около $470. Все значения счетчика выше $470 обеспечивают положительное математическое ожидание (+EV)!',
          formula: 'Порог безубыточности = Лимит - [Лимит × (1 - Базовый RTP)] ÷ (2 × Доля взноса)'
        }
      ]
    },
    poker: {
      id: 'poker',
      tabLabel: 'Покер и шансы банка',
      badge: 'ТЕОРИЯ ИГР (GTO)',
      heroTitle: 'ПОКЕР И ШАНСЫ БАНКА: ТОЧНАЯ НАУКА ЭКВИТИ',
      heroIntro: 'Покер — это не игра наугад, а математика неполной информации. Сравнивая шансы банка (Pot Odds) с эквити вашей руки, вы принимаете строго обоснованные плюсовые решения.',
      howToPlayTitle: 'ПРАВИЛА ТЕХАССКОГО ХОЛДЕМА',
      howToPlayText: 'Каждый игрок получает 2 карманные карты. На стол выкладываются 5 общих карт: Флоп (3 карты), Терн (1 карта) и Ривер (1 карта). Составьте лучшую комбинацию из 5 карт. Действия: Чек, Бет, Колл, Рейз, Фолд.',
      howItWorksTitle: 'ШАНСЫ БАНКА И МАТЕМАТИЧЕСКОЕ ОЖИДАНИЕ (+EV)',
      howItWorksText: 'Шансы банка — это "цена" продолжения игры. Если банк предлагает отношение 4 к 1 (нужно 20% шансов), а вероятность собрать победную карту равна 35%, колл приносит гарантированную прибыль на дистанции.',
      levels: [
        {
          badge: 'УРОВЕНЬ 0',
          title: 'ШАНСЫ БАНКА: ЦЕНА КОЛЛА',
          description: 'Шансы банка = Размер ставки / (Текущий банк + Ставка оппонента + Ваш колл). Если в банке $100 и оппонент ставит $50, вы рискуете $50 ради банка $200. Ваша цена колла: $50 / $200 = 25%.',
          formula: 'Необходимое эквити = Ставка оппонента ÷ (Банк + Ставка + Колл)'
        },
        {
          badge: 'УРОВЕНЬ 1',
          title: 'ПРАВИЛО 2 И 4 (АУТЫ В ПРОЦЕНТЫ)',
          description: 'Посчитайте победные карты (ауты). На флопе умножьте количество аутов на 4, чтобы узнать шанс выигрыша к риверу. На терне умножьте на 2. Например: 9 аутов на флеш на терне = 9 × 2 = ~18% эквити.',
        },
        {
          badge: 'УРОВЕНЬ 2',
          title: 'ЗОЛОТОЕ ПРАВИЛО ПЛЮСОВОГО КОЛЛА (+EV)',
          description: 'Сравните эквити с шансами банка: если Эквити руки ≥ Шансы банка, колл прибылен (+EV). Если Эквити < Шансы банка, это ошибка, которая опустошит ваш стек на дистанции!',
        },
        {
          badge: 'УРОВЕНЬ 3',
          title: 'МИНИМАЛЬНАЯ ЧАСТОТА ЗАЩИТЫ (MDF)',
          description: 'MDF = Банк / (Банк + Ставка). Если оппонент ставит полбанка, MDF составляет 66.7%. Вы обязаны продолжать с 66.7% своих рук, чтобы оппонент не мог блефовать вслепую с любой картой с авто-прибылью.',
          formula: 'MDF = Размер банка ÷ (Размер банка + Ставка)'
        }
      ]
    },
    roulette: {
      id: 'roulette',
      tabLabel: 'Рулетка и перевес',
      badge: 'ФИЗИКА И ТЕОРИЯ ВЕРОЯТНОСТЕЙ',
      heroTitle: 'РУЛЕТКА И ОШИБКА ИГРОКА: РАЗОБЛАЧЕНИЕ МИФОВ',
      heroIntro: 'Колесо рулетки подчиняется законам механики. Понимание источника математического преимущества казино защищает вас от катастрофических систем ставок, таких как Мартингейл.',
      howToPlayTitle: 'КАК ИГРАТЬ В РУЛЕТКУ',
      howToPlayText: 'Делайте ставки на числа (1-36), цвета (Красное/Черное), чет/нечет, дюжины или колонки. Крупье запускает колесо и шарик в противоположных направлениях. Сектор, в который упадет шарик, определяет выигрыш.',
      howItWorksTitle: 'ПОЧЕМУ КАЗИНО ВСЕГДА В ВЫИГРЫШЕ (ЗЕЛЕНОЕ ЗЕРО)',
      howItWorksText: 'На европейской рулетке 37 ячеек (1-36 и зеленое 0). Выплата за точное число составляет 35:1, но реальный шанс выпадения — 1 из 37! Эта недостающая единица создает неустранимое преимущество казино 2.70%.',
      levels: [
        {
          badge: 'УРОВЕНЬ 0',
          title: 'ЕВРОПЕЙСКАЯ И АМЕРИКАНСКАЯ РУЛЕТКА',
          description: 'В европейской рулетке одно зеро 0 (перевес 2.70%). В американской добавлено двойное зеро 00 (38 секторов), что удваивает перевес казино до 5.26%! Никогда не играйте в американскую рулетку при наличии европейской.',
        },
        {
          badge: 'УРОВЕНЬ 1',
          title: 'ФРАНЦУЗСКОЕ ПРАВИЛО LA PARTAGE (1.35%)',
          description: 'По французским правилам "La Partage", если шарик падает на 0, игроки теряют только 50% от ставок на равные шансы (Красное/Черное). Это снижает перевес казино вдвое — до 1.35%!',
        },
        {
          badge: 'УРОВЕНЬ 2',
          title: 'ОШИБКА ИГРОКА (GAMBLER\'S FALLACY)',
          description: '"Красное выпало 8 раз подряд, значит сейчас точно выпадет Черное!" — ЛОЖЬ. У колеса нет памяти. Вероятность выпадения Красного на 9-м спине остается ровно 18/37 (48.65%), как и всегда.',
        },
        {
          badge: 'УРОВЕНЬ 3',
          title: 'ПОЧЕМУ МАРТИНГЕЙЛ ГАРАНТИРУЕТ КРАХ',
          description: 'Удвоение ставки после каждого проигрыша ($10, $20, $40, $80, $160, $320, $640, $1280...) кажется надежным новичкам. Но после 8 проигрышей подряд вам придется рискнуть $2,560 ради выигрыша всего $10! Лимит стола заблокирует ставку и уничтожит весь банкролл.',
        }
      ]
    }
  },
  he: {
    kelly: {
      id: 'kelly',
      tabLabel: 'קריטריון קלי',
      badge: 'ניהול בנקרוול',
      heroTitle: 'מערכת קלי בשפה פשוטה: למה זה קריטי לרווח',
      heroIntro: 'שחקנים רבים מפסידים כסף גם כאשר יש להם יתרון מתמטי אמיתי, פשוט כי הם מהמרים בסכום שגוי. הימור קטן מדי לא מניב רווח; הימור גדול מדי מוביל לפשיטת רגל בגלל תנודתיות רגילה. נוסחת קלי מחשבת את גודל ההימור המושלם לצמיחה מקסימלית והגנה מפני הפסד מוחלט.',
      howToPlayTitle: 'איך ליישם במשחקים ובהימורים',
      howToPlayText: 'הערך את היתרון האמיתי שלך (למשל 2%+ בבלאק ג\'ק) ואת יחס התשלום. חשב את היחס f* = יתרון / יחס תשלום. אם הבנקרוול הוא 10,000$ ו-f* הוא 1%, הימר על 100$. לעולם אל תעלה את ההימור לאחר הפסד.',
      howItWorksTitle: 'ההוכחה המתמטית (צמיחה גאומטרית)',
      howItWorksText: 'הימור קבוע מייצר צמיחה ליניארית אטית. הימורי קלי מנצלים ריבית דריבית מעריכית ומבטיחים שלאורך זמן הבנקרוול שלך יעקוף כל אסטרטגיית הימורים אחרת בעולם בהסתברות 1.',
      levels: [
        {
          badge: 'רמה 0',
          title: 'חידת הטלת המטבע (האינטואיציה הבסיסית)',
          description: 'דמיין מטבע שנוחת על "עץ" ב-60% מהמקרים ומשלם 1:1. יש לך 1,000$. אם תהמר על כל ה-1,000$ בהטלה אחת, יש סיכוי של 40% לפשיטת רגל מידית. אם תהמר על 5$, בקושי תרוויח. קלי מוכיח שהימור על בדיוק 20% (200$) מייצר את הצמיחה הגבוהה ביותר.',
        },
        {
          badge: 'רמה 1',
          title: 'הנוסחה המרכזית',
          description: 'עבור הימורים ביחס 1:1: חלק הבנקרוול f* = סיכוי לנצח - סיכוי להפסיד = (p - q). במטבע עם 60% הצלחה: f* = 0.60 - 0.40 = 0.20 (20% מגודל הבנקרוול).',
          formula: 'f* = (b × p - q) ÷ b   |   עבור 1:1: f* = p - q'
        },
        {
          badge: 'רמה 2',
          title: 'מלכודת ה-2X (הימור יתר קטלני)',
          description: 'אם תהמר כפול מהמלצת קלי (2 × קלי), קצב הצמיחה לטווח ארוך יורד בדיוק לאפס! אם תהמר יותר מפי 2 מקלי, התוחלת הופכת לשלילית ופשיטת רגל מובטחת ב-100%, גם אם יש לך יתרון עצום!',
          highlight: 'הימור פי 2 מקלי מניב 0% צמיחה. הימור מעל פי 2 מבטיח פשיטת רגל מלאה!'
        },
        {
          badge: 'רמה 3',
          title: 'למה מקצוענים מהמרים על "חצי קלי" (0.50 f*)',
          description: 'שחקני יתרון מקצועיים מהמרים על חצי קלי. הסיבה: חצי קלי מעניק 75% מקצב הצמיחה המקסימלי, אך מקצץ את התנודתיות ב-50% ומוריד את הסיכון לפשיטת רגל אל מתחת ל-1.8%!',
        }
      ]
    },
    blackjack: {
      id: 'blackjack',
      tabLabel: 'בלאק ג\'ק וספירה',
      badge: 'יתרון מקצועי',
      heroTitle: 'בלאק ג\'ק מאפס למקצוען: מתמטיקה וספירת קלפים',
      heroIntro: 'בלאק ג\'ק הוא המשחק היחיד בקזינו שבו החלטות השחקן משנות את הרכב החפיסה לסיבובים הבאים. בעזרת אסטרטגיה בסיסית וספירת קלפים בשיטת היי-לו, ניתן להפוך את יתרון הבית מ-0.5%- ליתרון שחקן של 1.5%+ עד 2.5%+!',
      howToPlayTitle: 'איך לשחק וחוקי היסוד',
      howToPlayText: 'נצח את הדילר על ידי השגת סכום קלפים גבוה יותר מבלי לעבור את 21. קלפים 2-10 שווים את ערכם הנקוב, קלפי תמונה שווים 10, ואס שווה 1 או 11. בלאק ג\'ק טבעי משלם 3:2. הדילר מחויב למשוך עד 16 ולעצור ב-17 ומעלה.',
      howItWorksTitle: 'מאיפה נובע היתרון של השחקן',
      howItWorksText: 'יתרון הקזינו נובע אך ורק מכך שהשחקן פועל ראשון: אם נפסלת (Bust), הפסדת מיד, גם אם הדילר ייפסל בהמשך. ספירת קלפים מזהה מתי בחפיסה נותרו יותר קלפי 10 ואסים, מה שמגדיל את הזכיות ב-3:2 ואת שיעור הפסילות של הדילר.',
      levels: [
        {
          badge: 'רמה 0',
          title: 'המטרה היא לנצח את הדילר, לא להגיע ל-21',
          description: 'אל תנסה להגיע ל-21 בכל מחיר. כאשר לדילר יש קלף גלוי של 4, 5 או 6, הסיכוי שלו להיפסל הוא כ-42%. עצור על 12-16 ותן לדילר להיפסל!',
        },
        {
          badge: 'רמה 1',
          title: 'אסטרטגיה בסיסית היא חוק ברזל',
          description: 'האסטרטגיה הבסיסית פותחה במחשבים כבר ב-1956. תמיד פצל אסים ושמיניות. לעולם אל תפצל עשיריות או חמישיות. הכפל הימור (Double) על 11 מול כל קלף נמוך מאס. זה מצמצם את יתרון הבית לכ-0.5%.',
        },
        {
          badge: 'רמה 2',
          title: 'מנוע ספירת הקלפים היי-לו (Hi-Lo)',
          description: 'קלפים נמוכים (2-6) שווים 1+; ניטרליים (7-9) שווים 0; קלפים גבוהים (10, J, Q, K, A) שווים 1-. כשקלפים נמוכים יוצאים, הספירה עולה והחפיסה הנותרת עשירה בקלפים גבוהים ורווחיים.',
        },
        {
          badge: 'רמה 3',
          title: 'ספירה אמיתית (True Count) ופיזור הימורים',
          description: 'ספירה אמיתית = ספירה רצה חלקי מספר החפיסות שנותרו. כאשר TC שווה ל-2+ ומעלה, היתרון אצלך! הגדל את ההימור מיחידה אחת ל-8 עד 12 יחידות. כשהספירה נמוכה, הימר על המינימום.',
          formula: 'ספירה אמיתית (TC) = ספירה רצה (RC) ÷ חפיסות שנותרו'
        }
      ]
    },
    slots: {
      id: 'slots',
      tabLabel: 'מכונות Must-Hit-By',
      badge: 'מכונות מזל',
      heroTitle: 'מכונות מזל עם תקרת ג\'קפוט: איך מקצוענים מנצחים',
      heroIntro: 'מכונות מזל רגילות הן בלתי מנוצחות לאורך זמן בגלל שיעור החזר של 88% עד 92% (RTP). אולם מכונות עם ג\'קפוט מצטבר בעל תקרת חובה ("Must Hit By") הופכות לרווחיות מתמטית (+EV) כשהמד מתקרב לתקרה!',
      howToPlayTitle: 'איך מכונות Must-Hit-By פועלות',
      howToPlayText: 'מכניסים אסימונים ומסובבים את הגלגלים. כל סיבוב מפריש 2% עד 4% מההימור לתוך מד הג\'קפוט. המכונה חייבת לחלק את הפרס לפני או בהגעה לתקרה שנקבעה (למשל עד 500.00$).',
      howItWorksTitle: 'מתמטיקת סף הרווחיות (+EV)',
      howItWorksText: 'כאשר הג\'קפוט מתאפס, שבב ה-RNG בוחר בחשאי מספר זוכה בין המינימום לתקרה. אם אתה מזהה מכונה שבה המד קרוב לתקרה, ערך הזכייה הצפוי עולה על הפסדי הסיבובים הרגילים!',
      levels: [
        {
          badge: 'רמה 0',
          title: 'המספר הסודי שנקבע מראש',
          description: 'ברגע שהג\'קפוט מתאפס (למשל ב-250$ עם תקרה של 500$), המכונה מגרילה בחשאי מספר זוכה. השחקן שהסיבוב שלו יקפיץ את המד למספר הסודי הזה זוכה בכל הקופה מיד.',
        },
        {
          badge: 'רמה 1',
          title: 'המרחק לתקרה (ΔJ)',
          description: 'מרחק לתקרה = תקרה פחות מד נוכחי. אם מכונה עם תקרה של 500$ עומדת על 492.50$, המרחק הוא 7.50$ בלבד! הג\'קפוט מובטח ליפול תוך צמיחה של פחות מ-7.50$.',
        },
        {
          badge: 'רמה 2',
          title: 'נוסחת סף הכדאיות המדויקת',
          description: 'במכונה עם RTP של 88% והפרשה של 3%, סף הכדאיות הוא סביב 470$. כל ערך מעל 470$ מייצר תוחלת חיובית ודאית (+EV)!',
          formula: 'סף כדאיות = תקרה - [תקרה × (1 - RTP בסיסי)] ÷ (2 × שיעור הפרשה)'
        }
      ]
    },
    poker: {
      id: 'poker',
      tabLabel: 'פוקר וסיכויי קופה',
      badge: 'תורת המשחקים',
      heroTitle: 'פוקר וסיכויי קופה: המדע המדויק של איקוויטי',
      heroIntro: 'פוקר אינו הימור עיוור אלא משחק של מידע חלקי הנשלט על ידי קומבינטוריקה ותורת המשחקים. השוואה בין סיכויי הקופה (Pot Odds) לאיקוויטי של היד הופכת כל החלטה למשוואה מדויקת.',
      howToPlayTitle: 'חוקי טקסס הולדם',
      howToPlayText: 'כל שחקן מקבל 2 קלפים מוסתרים. 5 קלפים קהילתיים נפתחים בשולחן: פלופ (3 קלפים), טרן (קלף 1) וריבר (קלף 1). בנה את היד הטובה ביותר מ-5 קלפים. פעולות: צ\'ק, הימור, השוואה (Call), העלאה (Raise), קיפול (Fold).',
      howItWorksTitle: 'סיכויי קופה ותוחלת חיובית (+EV)',
      howItWorksText: 'סיכויי הקופה מייצגים את המחיר שהקופה מציעה לך כדי להישאר במשחק. אם הקופה מציעה יחס של 4 ל-1 (דרוש 20% סיכוי) והיד שלך מחזיקה ב-35% לניצחון, השוואה מבטיחה רווח מצטבר.',
      levels: [
        {
          badge: 'רמה 0',
          title: 'סיכויי קופה: מחיר ההשוואה',
          description: 'סיכויי קופה = סכום ההימור מולך / (סכום הקופה + ההימור מולך + ההשוואה שלך). אם בקופה 100$ והיריב מהמר 50$, אתה מסכן 50$ עבור קופה כוללת של 200$. המחיר הוא 50$ / 200$ = 25%.',
          formula: 'איקוויטי נדרש = הימור מולך ÷ (קופה נוכחית + הימור מולך + השוואה)'
        },
        {
          badge: 'רמה 1',
          title: 'כלל ה-2 וה-4 (מאאוטים לאחוזים)',
          description: 'ספור את הקלפים הנסתרים שמנצחים עבורך (אאוטים). בפלופ הכפל ב-4 כדי לחשב את הסיכוי עד לריבר. בטרן הכפל ב-2. דוגמה: 9 אאוטים לצבע בטרן = 9 × 2 = כ-18% איקוויטי.',
        },
        {
          badge: 'רמה 2',
          title: 'כלל הזהב להשוואה רווחית (+EV)',
          description: 'השווה את האיקוויטי לסיכויי הקופה: אם איקוויטי היד ≥ סיכויי הקופה, השוואה היא רווחית (+EV). אם האיקוויטי נמוך מסיכויי הקופה, זו שגיאה שתדלל את הבנקרוול שלך לאורך זמן!',
        },
        {
          badge: 'רמה 3',
          title: 'תדירות הגנה מינימלית (MDF)',
          description: 'MDF = קופה / (קופה + הימור). אם היריב מהמר חצי קופה, ה-MDF הוא 66.7%. אתה חייב להמשיך עם לפחות 66.7% מטווח הידיים שלך כדי שהיריב לא יוכל להרוויח מבלופים אוטומטיים.',
          formula: 'MDF = גודל הקופה ÷ (גודל הקופה + הימור היריב)'
        }
      ]
    },
    roulette: {
      id: 'roulette',
      tabLabel: 'רולטה ויתרון הבית',
      badge: 'פיזיקה והסתברות',
      heroTitle: 'רולטה וכשל המהמר: חשיפת מלכודות הקזינו',
      heroIntro: 'גלגל הרולטה כפוף לחוקי המכניקה וההסתברות. הבנת המקור ליתרון המתמטי של הקזינו מגינה על הבנקרוול שלך מפני שיטות הימורים מסוכנות כמו מרטינגייל.',
      howToPlayTitle: 'איך לשחק ברולטה',
      howToPlayText: 'מניחים ז\'יטונים על מספרים (1-36), צבעים (אדום/שחור), זוגי/אי-זוגי, תריסרים או עמודות. הדילר מסובב את הגלגל לכיוון אחד ואת הכדור לכיוון הנגדי. התא שבו נוחת הכדור קובע את הזכיות.',
      howItWorksTitle: 'למה הקזינו תמיד מרוויח (האפס הירוק)',
      howItWorksText: 'ברולטה אירופית יש 37 תאים (1-36 ואפס 0 ירוק). זכייה במספר בודד משלמת 35:1, אבל הסיכוי האמיתי הוא 1 ל-37! התא החסר הזה יוצר יתרון בית בלתי נמנע של 2.70%.',
      levels: [
        {
          badge: 'רמה 0',
          title: 'רולטה אירופית מול אמריקאית',
          description: 'ברולטה אירופית יש אפס בודד 0 (יתרון בית של 2.70%). ברולטה אמריקאית הוסיפו אפס כפול 00 (38 תאים), מה שכמעט מכפיל את יתרון הבית ל-5.26%! לעולם אל תשחק ברולטה אמריקאית כשיש אירופית זמינה.',
        },
        {
          badge: 'רמה 1',
          title: 'רולטה צרפתית וכלל La Partage (1.35% בלבד)',
          description: 'ברולטה צרפתית עם כלל "La Partage", כשהכדור נוחת על 0, השחקנים מאבדים רק 50% מההימור על סיכויים שווים (אדום/שחור). זה חותך את יתרון הבית בחצי ל-1.35%!',
        },
        {
          badge: 'רמה 2',
          title: 'הפרכת כשל המהמר (Gambler\'s Fallacy)',
          description: '"אדום יצא 8 פעמים ברצף, לכן שחור חייב לצאת עכשיו!" - שקר מוחלט. לגלגל אין זיכרון. בסיבוב ה-9, הסיכוי לאדום הוא עדיין בדיוק 18/37 (48.65%), בדיוק כמו בכל סיבוב קודם.',
        },
        {
          badge: 'רמה 3',
          title: 'מדוע שיטת מרטינגייל מובילה לקריסה',
          description: 'הכפלת ההימור אחרי כל הפסד (10$, 20$, 40$, 80$, 160$, 320$, 640$, 1280$...) נראית מפתה למתחילים. אך לאחר 8 הפסדים רצופים, תצטרך לסכן 2,560$ כדי להרוויח 10$ בלבד! תקרת השולחן תחסום אותך ותמחק את כל הרווחים ברגע.',
        }
      ]
    }
  }
};
