import { Language } from '../i18n/translations';

export interface LocalizedFeatureItem {
  id: string;
  tabId: string;
  category: 'blackjack' | 'roulette' | 'slots' | 'poker' | 'bankroll' | 'drills' | 'general';
  title: string;
  tagline: string;
  edgeRating: string;
  edgeType: 'positive' | 'protection' | 'training';
  iconKey: 'Shield' | 'CircleDot' | 'Grid' | 'Calculator' | 'Coins' | 'Flame' | 'Compass' | 'Trophy';
  accentColor: string;
  badgeText: string;
  whatItDoes: string;
  howToUse: string[];
  mathPrinciple: {
    formulaName: string;
    formula: string;
    explanation: string;
  };
  proTip: string;
}

export const FEATURE_GUIDES: Record<Language, LocalizedFeatureItem[]> = {
  en: [
    {
      id: 'f-blackjack',
      tabId: 'blackjack',
      category: 'blackjack',
      title: 'Blackjack Strategy Matrix & Hi-Lo Counting Lab',
      tagline: 'Interactive felt table, shoe penetration telemetry, Hi-Lo running/true count HUD, and Illustrious 18 deviation engine.',
      edgeRating: '+1.5% to +2.5% Player Edge',
      edgeType: 'positive',
      iconKey: 'Shield',
      accentColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      badgeText: 'CARD COUNTING LAB',
      whatItDoes:
        'Simulates genuine casino blackjack with a 6-deck shoe, cutting card penetration, and mathematical strategy tracking. Features an interactive Basic Strategy decision matrix, real-time Hi-Lo card counting telemetry (Running Count and True Count), and instant Illustrious 18 deviation alerts.',
      howToUse: [
        'Place bets and deal cards onto the green felt table.',
        'Choose Hit, Stand, Double Down, or Split based on Basic Strategy.',
        'Track the running count (+1 for 2-6, 0 for 7-9, -1 for 10-A) and divide by remaining decks for the True Count.',
        'Open the Basic Strategy Matrix tab to memorize optimal moves against all dealer upcards.'
      ],
      mathPrinciple: {
        formulaName: 'Hi-Lo Card Counting & True Count Formula',
        formula: 'True Count (TC) = Running Count (RC) ÷ Decks Remaining',
        explanation:
          'When low cards leave the shoe, the remaining deck is dense with 10s and Aces. This increases player Blackjacks (paid 3:2), strengthens Double Downs, and increases dealer bust frequency. When TC ≥ +2, the player holds an authentic statistical advantage.'
      },
      proTip:
        'Always use the 1-to-8 or 1-to-12 bet spread based on True Count. When TC is negative or neutral, keep bets at 1 unit ($10). When TC hits +3 or higher, scale up aggressively to 6-10 units.'
    },
    {
      id: 'f-roulette',
      tabId: 'roulette',
      category: 'roulette',
      title: 'Casino Roulette Suite & Animated Physics Cylinder',
      tagline: 'Interactive spinning wheel, ball track deceleration, complete French/European betting grid, and edge decomposition.',
      edgeRating: 'European 2.70% / French 1.35%',
      edgeType: 'protection',
      iconKey: 'CircleDot',
      accentColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
      badgeText: 'ANIMATED WHEEL & FELT',
      whatItDoes:
        'Simulates authentic casino roulette with realistic wheel and ball physics. Provides a full interactive betting board supporting inside bets (Straight, Split, Street, Corner, Line) and outside bets (Red/Black, Even/Odd, High/Low, Dozens, Columns). Demonstrates house edge across European (single-zero 2.70%), French La Partage (1.35% on even-money bets), and American (double-zero 5.26%).',
      howToUse: [
        'Select chip denomination ($5, $25, $100, $500) and place bets across the felt.',
        'Tap "SPIN WHEEL" to initiate ball rotation and deceleration physics.',
        'Compare European single-zero versus American double-zero house edge impact.',
        'Examine the visual wheel rotor highlighting the winning pocket and ball trail.'
      ],
      mathPrinciple: {
        formulaName: 'Roulette House Edge & EV Formula',
        formula: 'EV = (P(Win) · Payout) - P(Loss)',
        explanation:
          'On a European wheel (37 pockets), a single-number bet pays 35:1 with a 1/37 win chance: EV = (1/37 · 35) - (36/37 · 1) = -1/37 = -2.70%. On an American wheel (38 pockets), EV = (1/38 · 35) - (37/38 · 1) = -2/38 = -5.26%.'
      },
      proTip:
        'Always choose single-zero European or French tables over American double-zero. French tables with La Partage cut the house edge on even-money bets down to 1.35%.'
    },
    {
      id: 'f-mhb',
      tabId: 'massive-slots',
      category: 'slots',
      title: 'Must-Hit-By (MHB) Progressive Slot Radar',
      tagline: 'Scouts progressive slot meters to detect mathematically certifiable break-even and +EV states.',
      edgeRating: '+5% to +25% Net EV',
      edgeType: 'positive',
      iconKey: 'Grid',
      accentColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
      badgeText: 'SLOT BREAK-EVEN RADAR',
      whatItDoes:
        'Unlike standard slots which have an immutable negative house edge (e.g., 88% - 92% RTP), Must-Hit-By progressives MUST trigger before or at a rigid cap (such as $500, $1,000, or $10,000). As the jackpot meter creeps near the cap, the expected payout outweighs the cost of coin-in required to hit it, flipping the machine into positive expected value (+EV).',
      howToUse: [
        'Set the advertised Must-Hit-By Cap and the current meter shown on the machine glass.',
        'The radar computes the distance (ΔJ) and instantaneous break-even threshold.',
        'If the meter is above the break-even line, the radar signals "★ PLAY NOW (+EV POSITIVE EDGE)". If below, it tells you to "WALK AWAY".',
        'Test spin dynamics on multi-tile cascading grids from 5x3 up to 40x40 (1,600 nodes).'
      ],
      mathPrinciple: {
        formulaName: 'Must-Hit-By Expected Coin-In & Break-Even Formula',
        formula: 'E(Coin-In) = ΔJ / (2 · r), where ΔJ = Cap - Current, r = Meter Rate',
        explanation:
          'Since the hit point is uniformly distributed between current meter and cap, average cost to trigger is ΔJ / (2r). Base game loss is E(Coin-In) · (1 - Base RTP). When expected jackpot exceeds this loss, the machine has positive EV.'
      },
      proTip:
        'Always scout $500 cap machines with meters at $475+ or $1,000 caps at $960+. Never start a session below the break-even threshold, as base game drain will eat your bankroll.'
    },
    {
      id: 'f-poker',
      tabId: 'range-lab',
      category: 'poker',
      title: 'Poker 13x13 Range Matrix & Pot Odds Lab',
      tagline: 'Interactive 169-hand strategic heatmap, 100,000-sample Monte Carlo equity rollout, and MDF solver.',
      edgeRating: 'GTO Optimal Defense',
      edgeType: 'positive',
      iconKey: 'Calculator',
      accentColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
      badgeText: 'GTO & POT ODDS',
      whatItDoes:
        'Provides a 13x13 visual matrix encompassing all 1,326 Texas Hold’em starting hand combinations (pairs, suited, offsuit). Runs rapid Monte Carlo simulations against selected opponent ranges and compares raw win equity against required pot odds and Minimum Defense Frequency (MDF).',
      howToUse: [
        'Select starting hand presets (GTO Open 18%, Tight UTG 12%, Loose Button 45%, Pairs & Broadways) or customize cell weights.',
        'Input the current pot and incoming bet faced to get instant break-even calling odds.',
        'Review the Rule of 2 and 4 shortcut to convert river/turn outs into equity percentages on the fly.'
      ],
      mathPrinciple: {
        formulaName: 'Pot Odds & Minimum Defense Frequency (MDF)',
        formula: 'Pot Odds = Bet / (Pot + Bet + Call) | MDF = Pot / (Pot + Bet)',
        explanation:
          'If opponent bets $50 into a $100 pot, your required equity to call is 50 / (100 + 50 + 50) = 25%. MDF is 100 / (100 + 50) = 66.7%, meaning you must continue with at least 66.7% of your range to prevent opponent from auto-profiting with bluffs.'
      },
      proTip:
        'When holding a 9-out flush draw on the flop, multiply 9 by 4 (Rule of 4) to estimate ~36% equity to the river. If pot odds require only 28%, a call or semi-bluff raise is mathematically sound.'
    },
    {
      id: 'f-kelly',
      tabId: 'risk-lab',
      category: 'bankroll',
      title: 'Kelly Bankroll Sizer & Casino Chip Breakdown',
      tagline: 'Translates statistical edge into practical chip stacks for $10, $15, and $25 casino tables.',
      edgeRating: '< 1.8% Risk of Ruin',
      edgeType: 'protection',
      iconKey: 'Coins',
      accentColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      badgeText: 'BANKROLL PROTECTION',
      whatItDoes:
        'Calculates mathematically optimal bet sizes that maximize exponential bankroll growth while strictly guarding against catastrophic drawdown. Features pre-computed chip spread cheat sheets so you know exactly how many Red ($5), Green ($25), or Black ($100) chips to slide into the circle without performing mental math under dealer scrutiny.',
      howToUse: [
        'Select your table minimum stakes ($10, $15, or $25 table).',
        'Choose your Kelly safety factor: Half Kelly (0.50φ) is recommended for live table play to eliminate volatility.',
        'Check the Chip Breakdown column at your current True Count to place the exact chip configuration.',
        'Inspect the stochastic drawdown fan chart to see your 68% (±1σ) and 95% (±2σ) bankroll boundaries over 200 to 1,000 hours.'
      ],
      mathPrinciple: {
        formulaName: 'Kelly Criterion & Analytical Risk of Ruin',
        formula: 'f* = (bp - q) / b | RoR = exp(-2 · EV · Bankroll / σ²)',
        explanation:
          'Full Kelly maximizes long-term compound growth rate but experiences deep 50%+ drawdowns. Half-Kelly (f* / 2) achieves 75% of the growth rate with only one-third of the bankroll volatility, keeping Risk of Ruin negligible.'
      },
      proTip:
        'Never play a 1-to-12 bet spread on a $25 table with less than $15,000 bankroll. Downswings of 80 to 100 betting units are statistically inevitable over long shoes.'
    },
    {
      id: 'f-drills',
      tabId: 'drills',
      category: 'drills',
      title: 'Arcade Speed Drill Reflex Arena',
      tagline: '5-second countdown flashcards to cement counting, index deviations, and break-even instincts.',
      edgeRating: 'Reflex Calibration',
      edgeType: 'training',
      iconKey: 'Flame',
      accentColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
      badgeText: 'SPEED DRILLS',
      whatItDoes:
        'In a real casino, dealers and pit bosses do not give you 30 seconds to ponder an equation. The Drill Arena forces split-second decision-making under a 5-second countdown clock. Covers Illustrious 18 deviations, Must-Hit-By calls, pot odds defense, and rapid true-count deck division.',
      howToUse: [
        'Read the scenario and choose the mathematically optimal play before the timer expires.',
        'Earn arcade tokens and maintain win streaks for correct answers.',
        'Review instant coaching explanations detailing the exact EV difference of each option.'
      ],
      mathPrinciple: {
        formulaName: 'Decision Speed & Error Cost',
        formula: 'Session EV = Hand EV - Cumulative Human Friction',
        explanation:
          'A card counter with 98% accuracy makes 2 mistakes every 100 hands. Over a 500-hour year at $50/unit, those 2 mistakes per shoe cost thousands of dollars, completely erasing the card counter’s advantage.'
      },
      proTip:
        'Train until Illustrious 18 hand decisions (like 16 vs 10 and 12 vs 3) feel as automatic and effortless as basic strategy.'
    },
    {
      id: 'f-roulette-systems',
      tabId: 'roulette',
      category: 'roulette',
      title: 'Roulette Systems Lab & Monte Carlo Stress-Tester',
      tagline: 'Stochastic simulations of Martingale, D\'Alembert, and Fibonacci against rigid casino table limits.',
      edgeRating: 'System Fallacy Buster',
      edgeType: 'protection',
      iconKey: 'Compass',
      accentColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      badgeText: 'MONTE CARLO LAB',
      whatItDoes:
        'Runs up to 5,000 rapid Monte Carlo spins testing betting systems against realistic table maximum limits and house edge. Exposes the Gambler\'s Fallacy and mathematically proves why progressive negative betting systems cannot overcome a negative expectation game.',
      howToUse: [
        'Select a betting progression (Martingale, D\'Alembert, Fibonacci, Flat Betting).',
        'Set starting bankroll, base unit, and table maximum bet cap.',
        'Run simulation and observe catastrophic drawdown points when encountering consecutive loss streaks.',
        'Inspect the trajectory graph showing profit spikes followed by total ruin.'
      ],
      mathPrinciple: {
        formulaName: 'Martingale Progression Limit',
        formula: 'Bet_n = Base · 2^(n-1) | P(Loss Streak n) = (19/37)^n',
        explanation:
          'After 8 consecutive losses, a $10 base bet requires a $1,280 wager just to win back $10 profit. Table limits cap the player, resulting in devastating bankroll ruin.'
      },
      proTip:
        'No betting progression can convert a negative expectation game into a positive one without an external physical advantage like wheel bias or ball clocking.'
    },
    {
      id: 'f-hub',
      tabId: 'command-center',
      category: 'general',
      title: 'Arcade Hub & Quick Floor Widgets',
      tagline: 'Executive command center with instant pot odds solver, Hi-Lo flash trainer, and edge telemetry.',
      edgeRating: 'Central Command',
      edgeType: 'positive',
      iconKey: 'Trophy',
      accentColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      badgeText: 'COMMAND CENTER',
      whatItDoes:
        'Serves as the front door to HouseBreaker. Features immediate-access widgets designed for discreet off-table reference: a 3-input Pot Odds solver that gives an instant Call/Fold recommendation, an interactive Hi-Lo card counting flash reflex minigame, and one-tap routing to all advantage modules.',
      howToUse: [
        'Use the Pot Odds Quick Solver during tournament breaks or table pauses to evaluate a tricky hand.',
        'Play the Hi-Lo Flash Reflex widget to warm up your card recognition speed before hitting the casino floor.',
        'Monitor overall edge status and review offline secure status.'
      ],
      mathPrinciple: {
        formulaName: 'Hi-Lo Point System',
        formula: 'Cards 2-6: +1 | Cards 7-9: 0 | Cards 10-A: -1',
        explanation:
          'The removal of small cards (2-6) leaves a deck rich in 10s and Aces, which increases player blackjacks (paid 3:2), strengthens double downs, and causes dealer bust rates to skyrocket.'
      },
      proTip:
        'Bookmark the Arcade Hub as your primary dashboard for pre-session preparation and mid-session calibration.'
    },
    {
      id: 'f-legal',
      tabId: 'command-center',
      category: 'general',
      title: 'Statutory Compliance & Nevada NRS 465.075 Shield',
      tagline: 'Rigorous legal safeguards ensuring 100% compliant off-table cognitive training and offline privacy.',
      edgeRating: 'Full Legal Safety',
      edgeType: 'protection',
      iconKey: 'Shield',
      accentColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      badgeText: 'LEGAL STATUTE',
      whatItDoes:
        'Ensures compliance with Nevada Revised Statute (NRS) 465.075 and international gaming laws prohibiting electronic cheating devices. HouseBreaker explicitly operates as an educational training suite, probability calculator, and off-table study sandbox.',
      howToUse: [
        'Review legal statutory details via the Legal Statute button in the header.',
        'Use HouseBreaker at home, in hotel rooms, or during table breaks to build mental cognitive speed.',
        'Never operate any electronic computing device active at a physical casino gaming table where prohibited by statute.'
      ],
      mathPrinciple: {
        formulaName: 'Statutory Compliance Boundary',
        formula: 'Skill Acquisition (Legal) vs. Active Table Device (Prohibited)',
        explanation:
          'Using your brain and memory to count cards or calculate odds is 100% legal in Nevada and worldwide (upheld by courts). Using an electronic device at the physical gaming table to advise bets is a felony under NRS 465.075.'
      },
      proTip:
        'HouseBreaker is designed specifically to train your human brain to perform all advantage play calculations mentally in under 2 seconds.'
    }
  ],
  ru: [
    {
      id: 'f-blackjack',
      tabId: 'blackjack',
      category: 'blackjack',
      title: 'Матрица базовой стратегии блэкджека и лаборатория Hi-Lo',
      tagline: 'Интерактивный стол с сукном, глубина срезки шуза, HUD текущего и истинного счета Hi-Lo, модуль отклонений Illustrious 18.',
      edgeRating: 'Преимущество игрока +1.5% до +2.5%',
      edgeType: 'positive',
      iconKey: 'Shield',
      accentColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      badgeText: 'ЛАБОРАТОРИЯ ПОДСЧЕТА КАРТ',
      whatItDoes:
        'Симулирует настоящий блэкджек с 6 колодами, срезной картой и контролем математической стратегии. Содержит интерактивную матрицу базовой стратегии, телеметрию подсчета карт Hi-Lo в реальном времени (Running Count и True Count) и моментальные сигналы отклонений Illustrious 18.',
      howToUse: [
        'Делайте ставки и раздавайте карты на зеленое сукно стола.',
        'Выбирайте Еще (Hit), Хватит (Stand), Удвоить (Double) или Разделить (Split) по базовой стратегии.',
        'Отслеживайте текущий счет (+1 для 2-6, 0 для 7-9, -1 для 10-A) и делите на оставшиеся колоды для расчета истинного счета (True Count).',
        'Откройте матрицу базовой стратегии, чтобы закрепить оптимальные ходы против любой открытой карты дилера.'
      ],
      mathPrinciple: {
        formulaName: 'Формула истинного счета Hi-Lo',
        formula: 'Истинный счет (TC) = Текущий счет (RC) ÷ Оставшиеся колоды',
        explanation:
          'Когда младшие карты выходят из игры, колода насыщается десятками и тузами. Это увеличивает частоту блэкджеков у игрока (оплата 3:2), усиливает удвоения и повышает вероятность перебора у дилера. При TC ≥ +2 математическое преимущество переходит на сторону игрока.'
      },
      proTip:
        'Всегда используйте спред ставок 1 к 8 или 1 к 12 в зависимости от истинного счета. При отрицательном или нулевом TC держите минимальную ставку 1 юнит ($10). При TC от +3 резко увеличивайте ставку до 6–10 юнитов.'
    },
    {
      id: 'f-roulette',
      tabId: 'roulette',
      category: 'roulette',
      title: 'Комплекс рулетки и анимационный физический цилиндр',
      tagline: 'Интерактивное колесо, физика замедления шарика, полная сетка французских и европейских ставок, разбор матожидания.',
      edgeRating: 'Европейская 2.70% / Французская 1.35%',
      edgeType: 'protection',
      iconKey: 'CircleDot',
      accentColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
      badgeText: 'АНИМИРОВАННОЕ КОЛЕСО И СУКНО',
      whatItDoes:
        'Моделирует аутентичную рулетку с реалистичной физикой вращения колеса и трека шарика. Включает интерактивное игровое поле с внутренними ставками (число, сплит, стрит, каре, сикслайн) и внешними ставками (красное/черное, чет/нечет, малые/большие, дюжины, колонки). Показывает преимущество казино в европейской (одно зеро 2.70%), французской с правилом La Partage (1.35% на равных шансах) и американской (двойное зеро 5.26%).',
      howToUse: [
        'Выберите номинал фишки ($5, $25, $100, $500) и расставьте ставки на поле.',
        'Нажмите «ВРАЩАТЬ КОЛЕСО», чтобы запустить физику вращения и замедления шарика.',
        'Сравните влияние европейского одного зеро против американского двойного зеро.',
        'Изучите ротор колеса с подсветкой выигрышного сектора и траектории шарика.'
      ],
      mathPrinciple: {
        formulaName: 'Формула математического ожидания в рулетке',
        formula: 'EV = (P(Выигрыш) · Выплата) - P(Проигрыш)',
        explanation:
          'На европейском колесе (37 номеров) ставка на одно число выплачивается 35:1 при вероятности 1/37: EV = (1/37 · 35) - (36/37 · 1) = -1/37 = -2.70%. На американском (38 номеров): EV = (1/38 · 35) - (37/38 · 1) = -2/38 = -5.26%.'
      },
      proTip:
        'Всегда отдавайте предпочтение столам с одним зеро (европейским или французским). Французская рулетка с правилом La Partage снижает преимущество казино на равных шансах всего до 1.35%.'
    },
    {
      id: 'f-mhb',
      tabId: 'massive-slots',
      category: 'slots',
      title: 'Радар прогрессивных слотов Must-Hit-By (MHB)',
      tagline: 'Сканирует счетчики прогрессивных слотов для выявления математически подтвержденной точки безубыточности и +EV.',
      edgeRating: 'Чистое EV +5% до +25%',
      edgeType: 'positive',
      iconKey: 'Grid',
      accentColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
      badgeText: 'РАДАР БЕЗУБЫТОЧНОСТИ СЛОТОВ',
      whatItDoes:
        'В отличие от обычных слотов с постоянным отрицательным ожиданием (RTP 88–92%), слоты Must-Hit-By ОБЯЗАНЫ выплатить джекпот до строгого лимита (например, $500, $1 000 или $10 000). По мере приближения счетчика к лимиту ожидаемая выплата превышает стоимость вращений, превращая игру в положительное математическое ожидание (+EV).',
      howToUse: [
        'Укажите максимальный лимит джекпота (Cap) и текущую сумму на табло автомата.',
        'Радар рассчитает расстояние до сброса (ΔJ) и точную точку безубыточности.',
        'Если счетчик выше точки безубыточности, радар выдает «★ АТАКОВАТЬ (+EV ПРЕИМУЩЕСТВО)». Если ниже — «УХОДИТЬ».',
        'Тестируйте спины на каскадных сетках от 5x3 до 40x40 (1 600 узлов).'
      ],
      mathPrinciple: {
        formulaName: 'Ожидаемый оборот (Coin-In) и безубыточность MHB',
        formula: 'E(Coin-In) = ΔJ / (2 · r), где ΔJ = Лимит - Текущее, r = Скорость счетчика',
        explanation:
          'Поскольку точка выпадения равномерно распределена между текущим значением и лимитом, средний оборот для срыва составляет ΔJ / (2r). Потери базовой игры: E(Coin-In) · (1 - Базовый RTP). Когда джекпот превышает этот убыток, слот становится +EV.'
      },
      proTip:
        'Ищите автоматы с лимитом $500 при счетчике от $475+ или лимитом $1 000 от $960+. Никогда не начинайте сессию ниже точки безубыточности, иначе базовый процент слота уничтожит ваш банкролл.'
    },
    {
      id: 'f-poker',
      tabId: 'range-lab',
      category: 'poker',
      title: 'Матрица диапазонов покера 13x13 и шансы банка',
      tagline: 'Интерактивная тепловая карта 169 рук, симуляция Монте-Карло на 100 000 раздач и решатель MDF.',
      edgeRating: 'Оптимальная GTO защита',
      edgeType: 'positive',
      iconKey: 'Calculator',
      accentColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
      badgeText: 'GTO И ШАНСЫ БАНКА',
      whatItDoes:
        'Визуальная матрица 13x13 охватывает все 1 326 стартовых комбинаций Техасского Холдема (пары, одномастные, разномастные). Проводит мгновенный расчет Монте-Карло против диапазонов оппонента и сопоставляет эквити с требуемыми шансами банка и минимальной частотой защиты (MDF).',
      howToUse: [
        'Выбирайте готовые пресеты диапазонов (GTO Open 18%, Tight UTG 12%, Loose Button 45%, Пары и Бродвеи) или настраивайте вес ячеек вручную.',
        'Введите размер банка и величину ставки соперника для мгновенного расчета безубыточного колла.',
        'Используйте «Правило 2 и 4», чтобы быстро переводить ауты на терне и ривере в проценты эквити прямо во время раздачи.'
      ],
      mathPrinciple: {
        formulaName: 'Шансы банка и минимальная частота защиты (MDF)',
        formula: 'Шансы банка = Ставка / (Банк + Ставка + Колл) | MDF = Банк / (Банк + Ставка)',
        explanation:
          'Если оппонент ставит $50 в банк $100, требуемое эквити для колла: 50 / (100 + 50 + 50) = 25%. MDF составляет 100 / (100 + 50) = 66.7%, то есть вы обязаны продолжать минимум с 66.7% своего диапазона, чтобы блефы оппонента не были автоприбыльными.'
      },
      proTip:
        'При флеш-дро с 9 аутами на флопе умножьте 9 на 4 («Правило 4»), получая ~36% эквити к риверу. Если шансы банка требуют всего 28%, колл или полублеф-рейз математически строго обоснованы.'
    },
    {
      id: 'f-kelly',
      tabId: 'risk-lab',
      category: 'bankroll',
      title: 'Критерий Келли и калькулятор фишек для стола',
      tagline: 'Переводит математическое преимущество в точные стеки фишек для столов $10, $15 и $25.',
      edgeRating: 'Риск разорения < 1.8%',
      edgeType: 'protection',
      iconKey: 'Coins',
      accentColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      badgeText: 'ЗАЩИТА БАНКРОЛЛА',
      whatItDoes:
        'Рассчитывает оптимальный размер ставки для максимального геометрического роста банкролла при строгой защите от просадок. Включает готовые шпаргалки фишек: вы точно знаете, сколько красных ($5), зеленых ($25) или черных ($100) фишек положить в бокс без вычислений в уме под взглядом пит-босса.',
      howToUse: [
        'Укажите минимальный лимит стола ($10, $15 или $25).',
        'Выберите коэффициент осторожности Келли: Half Kelly (0.50φ) рекомендуется для реальной игры для снижения волатильности.',
        'Используйте колонку раскладки фишек при вашем текущем True Count для моментальной точной ставки.',
        'Изучите веерный график стохастической дисперсии с границами 68% (±1σ) и 95% (±2σ) на дистанции до 1 000 часов.'
      ],
      mathPrinciple: {
        formulaName: 'Критерий Келли и аналитический риск разорения (RoR)',
        formula: 'f* = (bp - q) / b | RoR = exp(-2 · EV · Банкролл / σ²)',
        explanation:
          'Полный Келли максимизирует долгосрочный сложный процент, но влечет глубокие просадки свыше 50%. Половинный Келли (f* / 2) дает 75% скорости роста при всего одной трети волатильности, сводя риск разорения к ничтожному минимуму.'
      },
      proTip:
        'Никогда не играйте со спредом 1 к 12 на столе $25 с банкроллом менее $15 000. Просадки в 80–100 ставок математически неизбежны на длинных дистанциях.'
    },
    {
      id: 'f-drills',
      tabId: 'drills',
      category: 'drills',
      title: 'Аркадный рефлекс-тренажер скоростных решений',
      tagline: '5-секундный таймер для закрепления подсчета, отклонений от базовой стратегии и оценки шансов.',
      edgeRating: 'Калибровка реакции',
      edgeType: 'training',
      iconKey: 'Flame',
      accentColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
      badgeText: 'СКОРОСТНЫЕ ТРЕНИРОВКИ',
      whatItDoes:
        'В реальном казино дилеры не дают полминуты на размышления. Тренажер тренирует мгновенное принятие решений в условиях 5-секундного таймера: отклонения Illustrious 18, атака слотов Must-Hit-By, защита по шансам банка и быстрое деление колод.',
      howToUse: [
        'Оцените игровую ситуацию и выберите математически верное действие до истечения таймера.',
        'Зарабатывайте тренировочные жетоны и сохраняйте серию побед за точные решения.',
        'Изучайте мгновенные пояснения тренера с точной разницей в математическом ожидании (EV).'
      ],
      mathPrinciple: {
        formulaName: 'Скорость принятия решений и цена ошибок',
        formula: 'Сессионное EV = Игровое EV - Накопленные ошибки человека',
        explanation:
          'Счетчик карт с точностью 98% совершает 2 ошибки на каждые 100 раздач. При игре 500 часов в год по $50 за ставку эти 2 ошибки на шуз обходятся в тысячи долларов, полностью уничтожая математическое преимущество.'
      },
      proTip:
        'Тренируйтесь до тех пор, пока отклонения Illustrious 18 (например, 16 против 10 и 12 против 3) не станут такими же естественными и автоматическими, как базовые правила.'
    },
    {
      id: 'f-roulette-systems',
      tabId: 'roulette',
      category: 'roulette',
      title: 'Лаборатория систем рулетки и стресс-тест Монте-Карло',
      tagline: 'Стохастическая симуляция Мартингейла, Д’Аламбера и Фибоначчи против жестких лимитов казино.',
      edgeRating: 'Разоблачение мифов',
      edgeType: 'protection',
      iconKey: 'Compass',
      accentColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      badgeText: 'ЛАБОРАТОРИЯ МОНТЕ-КАРЛО',
      whatItDoes:
        'Проводит до 5 000 мгновенных спинов Монте-Карло для проверки прогрессивных систем ставок с учетом максимальных лимитов стола и преимущества казино. Разоблачает «ошибку игрока» и математически доказывает невозможность победить отрицательное матожидание изменением размера ставок.',
      howToUse: [
        'Выберите систему прогрессии (Мартингейл, Д’Аламбер, Фибоначчи, Фиксированная ставка).',
        'Задайте стартовый баланс, базовую ставку и максимальный лимит стола.',
        'Запустите симуляцию и наблюдайте точки катастрофического краха при сериях поражений.',
        'Изучите график динамики: небольшие взлеты прибыли всегда сменяются полным обнулением.'
      ],
      mathPrinciple: {
        formulaName: 'Лимит прогрессии Мартингейла',
        formula: 'Ставка_n = База · 2^(n-1) | P(Серия поражений n) = (19/37)^n',
        explanation:
          'После 8 проигрышей подряд ставка $10 требует риска уже $1 280 ради выигрыша всего $10 прибыли. Лимит стола блокирует игрока, приводя к мгновенному краху банкролла.'
      },
      proTip:
        'Никакая система ставок не превратит игру с отрицательным математическим ожиданием в положительную без физического дефекта колеса или баллистического прогнозирования.'
    },
    {
      id: 'f-hub',
      tabId: 'command-center',
      category: 'general',
      title: 'Центр управления и быстрые виджеты',
      tagline: 'Главный командный пункт с экспресс-калькулятором шансов банка, флеш-тренажером Hi-Lo и телеметрией.',
      edgeRating: 'Центральный пункт',
      edgeType: 'positive',
      iconKey: 'Trophy',
      accentColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      badgeText: 'КОМАНДНЫЙ ПУНКТ',
      whatItDoes:
        'Главный экран HouseBreaker с быстрым доступом к инструментам вне стола: расчет шансов банка за 3 секунды с вердиктом Колл/Фолд, флеш-игра на скорость реакции счета Hi-Lo и моментальный переход ко всем тренировочным лабораториям.',
      howToUse: [
        'Используйте экспресс-калькулятор во время перерывов в турнире для анализа сложной раздачи.',
        'Запускайте флеш-тренажер Hi-Lo для разминки скорости распознавания карт перед походом в казино.',
        'Следите за общим статусом преимущества и локальной сохранностью данных.'
      ],
      mathPrinciple: {
        formulaName: 'Балльная система Hi-Lo',
        formula: 'Карты 2-6: +1 | Карты 7-9: 0 | Карты 10-A: -1',
        explanation:
          'Выход мелких карт (2–6) оставляет колоду богатой десятками и тузами, что резко повышает частоту блэкджеков у игрока, укрепляет даблы и повышает вероятность перебора у дилера.'
      },
      proTip:
        'Используйте Центр управления как стартовый экран перед каждой сессией для психологической настройки и математической калибровки.'
    },
    {
      id: 'f-legal',
      tabId: 'command-center',
      category: 'general',
      title: 'Правовое соответствие и защита по закону Невады NRS 465.075',
      tagline: 'Строгие правовые гарантии 100% легального автономного обучения и полной конфиденциальности.',
      edgeRating: 'Полная законность',
      edgeType: 'protection',
      iconKey: 'Shield',
      accentColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      badgeText: 'ЗАКОНОДАТЕЛЬСТВО',
      whatItDoes:
        'Обеспечивает строгое соответствие закону штата Невада NRS 465.075 и международным нормам, запрещающим электронные устройства подсказок за столом. HouseBreaker работает исключительно как учебный тренажер, калькулятор вероятностей и домашняя лаборатория.',
      howToUse: [
        'Изучите текст правовых актов через кнопку «Законодательство» в шапке.',
        'Используйте HouseBreaker дома, в отеле или на перерывах между сессиями для развития скорости устного счета.',
        'Никогда не используйте электронные устройства подсказок непосредственно за игровым столом казино.'
      ],
      mathPrinciple: {
        formulaName: 'Граница законности',
        formula: 'Развитие интеллекта (Легально) vs. Устройство за столом (Запрещено)',
        explanation:
          'Использование собственной памяти и математических навыков для счета карт или расчета шансов на 100% законно в Неваде и во всем мире (подтверждено судами). Использование электронных подсказчиков за реальным столом является уголовным преступлением по закону NRS 465.075.'
      },
      proTip:
        'HouseBreaker специально тренирует ваш человеческий мозг, чтобы выполнять все вычисления преимущества в уме быстрее чем за 2 секунды.'
    }
  ],
  he: [
    {
      id: 'f-blackjack',
      tabId: 'blackjack',
      category: 'blackjack',
      title: 'מטריצת אסטרטגיה בבלאק ג\'ק ומעבדת ספירת היי-לו',
      tagline: 'שולחן לבד אינטראקטיבי, עומק חיתוך חבילה, תצוגת ספירה רצה ואמיתית, ומנוע סטיות Illustrious 18.',
      edgeRating: '+1.5% עד +2.5% יתרון שחקן',
      edgeType: 'positive',
      iconKey: 'Shield',
      accentColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      badgeText: 'מעבדת ספירת קלפים',
      whatItDoes:
        'מדמה בלאק ג\'ק אותנטי מקזינו עם 6 חבילות קלפים, חיתוך קלפים ובקרה אסטרטגית מתמטית. כולל מטריצת החלטות אינטראקטיבית, טלמטריה בזמן אמת של ספירת היי-לו (ספירה רצה ואמיתית) והתראות מיידיות על סטיות Illustrious 18.',
      howToUse: [
        'הצב הימורים וחלק קלפים על לוח הלבד הירוק.',
        'בחר עוד (Hit), עמוד (Stand), הכפל (Double) או פצל (Split) על פי האסטרטגיה הבסיסית.',
        'עקוב אחר הספירה הרצה (+1 ל-2-6, 0 ל-7-9, -1 ל-10-A) וחלק במספר החבילות שנותרו כדי לקבל את הספירה האמיתית (True Count).',
        'פתח את מטריצת האסטרטגיה הבסיסית כדי לשנן את המהלכים המיטביים מול כל קלף גלוי של הדילר.'
      ],
      mathPrinciple: {
        formulaName: 'נוסחת ספירת קלפים וספירה אמיתית היי-לו',
        formula: 'ספירה אמיתית (TC) = ספירה רצה (RC) ÷ חבילות שנותרו',
        explanation:
          'כאשר קלפים נמוכים יוצאים מהחפיסה, יתרת הקלפים עשירה ב-10 ובאסים. הדבר מגדיל את שכיחות הבלאק ג\'ק של השחקן (תשלום 3:2), מחזק הכפלות ומעלה את שיעור הפסילות של הדילר. כאשר TC ≥ +2, היתרון הסטטיסטי בידי השחקן.'
      },
      proTip:
        'השתמש תמיד בפיזור הימורים של 1 ל-8 או 1 ל-12 על בסיס הספירה האמיתית. בספירה ניטרלית או שלילית שמור על הימור מינימום של יחידה אחת ($10). בספירה של +3 ומעלה, הגדל בחדות ל-6-10 יחידות.'
    },
    {
      id: 'f-roulette',
      tabId: 'roulette',
      category: 'roulette',
      title: 'חבילת רולטה וגלגל פיזיקה מונפש',
      tagline: 'גלגל מסתובב אינטראקטיבי, פיזיקת האטה של הכדור, פריסת הימורים אירופית וצרפתית מלאה, וניתוח תוחלת.',
      edgeRating: 'אירופית 2.70% / צרפתית 1.35%',
      edgeType: 'protection',
      iconKey: 'CircleDot',
      accentColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
      badgeText: 'גלגל ולבד מונפשים',
      whatItDoes:
        'מדמה רולטת קזינו אותנטית עם פיזיקה ריאליסטית של סיבוב הגלגל והכדור. כולל לוח הימורים מלא עם הימורים פנימיים וחיצוניים (אדום/שחור, זוגי/אי-זוגי, עמודות ועוד). ממחיש את יתרון הבית ברולטה אירופית (אפס יחיד 2.70%), צרפתית עם La Partage (1.35%) ואמריקאית (אפס כפול 5.26%).',
      howToUse: [
        'בחר שווי ז\'יטון ($5, $25, $100, $500) והצב הימורים על לוח הלבד.',
        'לחץ על "סובב גלגל" להפעלת פיזיקת התנועה וההאטה של הכדור.',
        'השווה בין ההשפעה של אפס יחיד לאפס כפול על תוחלת הרווח.',
        'בחן את רוטור הגלגל המציג את המשבצת הזוכה ומסלול התנועה.'
      ],
      mathPrinciple: {
        formulaName: 'נוסחת תוחלת רווח (EV) ברולטה',
        formula: 'EV = (P(Win) · Payout) - P(Loss)',
        explanation:
          'ברולטה אירופית (37 משבצות), הימור על מספר בודד משלם 35:1 עם סיכוי 1/37: EV = (1/37 · 35) - (36/37 · 1) = -2.70%. ברולטה אמריקאית (38 משבצות): EV = -5.26%.'
      },
      proTip:
        'בחר תמיד בשולחנות אירופיים או צרפתיים עם אפס יחיד במקום אמריקאי. שולחנות צרפתיים עם כלל La Partage חותכים את יתרון הבית ל-1.35% בהימורים של כסף שווה.'
    },
    {
      id: 'f-mhb',
      tabId: 'massive-slots',
      category: 'slots',
      title: 'מכ"ם מכונות מזל פרוגרסיביות Must-Hit-By',
      tagline: 'מאתר ספי פריצה של מכונות פרוגרסיביות לזיהוי מצב נקודת איזון ויתרון חיובי (+EV).',
      edgeRating: '+5% עד +25% תוחלת נקייה',
      edgeType: 'positive',
      iconKey: 'Grid',
      accentColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
      badgeText: 'מכ"ם נקודת איזון',
      whatItDoes:
        'בניגוד למכונות רגילות שבהן יתרון הבית קבוע ושלילי (RTP של 88-92%), מכונות Must-Hit-By מחויבות לשחרר את הקופה לפני תקרת יעד מוחלטת (כגון 500$, 1,000$ או 10,000$). ככל שהמד מתקרב לתקרה, התמורה הצפויה עולה על עלות ההימורים הדרושה ומעבירה את המשחק לתוחלת חיובית (+EV).',
      howToUse: [
        'הזן את תקרת הפרס של המכונה ואת הסכום הנוכחי במונה.',
        'המכ"ם יחשב את המרחק לתקרה (ΔJ) ואת נקודת האיזון המדויקת.',
        'אם המונה מעל נקודת האיזון, המכ"ם יורה "★ שחק עכשיו (+EV יתרון חיובי)". אם מתחת, ימליץ "התרחק".',
        'בחן סיבובי בדיקה על גבי רשתות מ-5x3 ועד 40x40 (1,600 משבצות).'
      ],
      mathPrinciple: {
        formulaName: 'נוסחת עלות הימור צפויה ונקודת איזון ב-MHB',
        formula: 'E(Coin-In) = ΔJ / (2 · r), כאשר ΔJ = תקרה - נוכחי, r = קצב תרומה למד',
        explanation:
          'מאחר שנקודת הזכייה מפולגת באופן אחיד בין המצב הנוכחי לתקרה, עלות הזכייה הממוצעת היא ΔJ / (2r). הפסד המשחק הבסיסי הוא E(Coin-In) · (1 - RTP בסיס). כשהקופה עולה על הפסד זה, המכונה נמצאת ב-+EV.'
      },
      proTip:
        'חפש מכונות עם תקרת $500 כשהמד עומד על $475 ומעלה, או תקרת $1,000 כשהמד על $960 ומעלה. לעולם אל תתחיל לשחק מתחת לנקודת האיזון.'
    },
    {
      id: 'f-poker',
      tabId: 'range-lab',
      category: 'poker',
      title: 'מטריצת טווחים 13x13 ומחשבון סיכויי קופה בפוקר',
      tagline: 'מפת חום אינטראקטיבית של 169 ידיים, סימולציית מונטה קרלו של 100,000 ידיים ופותר MDF.',
      edgeRating: 'הגנת GTO אופטימלית',
      edgeType: 'positive',
      iconKey: 'Calculator',
      accentColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
      badgeText: 'GTO וסיכויי קופה',
      whatItDoes:
        'מספק מטריצה ויזואלית של 13x13 המקיפה את כל 1,326 צירופי הפתיחה בטקסס הולדם. מריץ סימולציות מונטה קרלו מהירות כנגד טווחי היריב ומשווה סיכויי זכייה ישירים מול סיכויי הקופה הנדרשים ותדירות ההגנה המינימלית (MDF).',
      howToUse: [
        'בחר טווחי פתיחה מוכנים (GTO Open 18%, Tight UTG 12%, Loose Button 45%, זוגות וברודוויי) או התאם משקלים.',
        'הזן את גודל הקופה וההימור שמולו אתה עומד לקבלת סיכויי השוואה מדויקים.',
        'השתמש ב"כלל 2 ו-4" כדי להמיר אאוטים בטרן ובריבר לאחוזי זכייה במהירות תוך כדי משחק.'
      ],
      mathPrinciple: {
        formulaName: 'סיכויי קופה ותדירות הגנה מינימלית (MDF)',
        formula: 'סיכויי קופה = הימור / (קופה + הימור + השוואה) | MDF = קופה / (קופה + הימור)',
        explanation:
          'אם היריב מהמר $50 לתוך קופה של $100, הסיכוי הנדרש להשוואה הוא 50 / (100 + 50 + 50) = 25%. ה-MDF הוא 66.7%, כלומר עליך להמשיך עם לפחות 66.7% מהטווח כדי למנוע מהיריב רווח אוטומטי מבלופים.'
      },
      proTip:
        'כאשר יש לך משיכת צבע של 9 אאוטים בפלופ, הכפל 9 ב-4 (כלל ה-4) לקבלת ~36% סיכוי עד הריבר. אם סיכויי הקופה דורשים רק 28%, השוואה או העלאת חצי-בלוף מוצדקות לחלוטין מתמטית.'
    },
    {
      id: 'f-kelly',
      tabId: 'risk-lab',
      category: 'bankroll',
      title: 'מחשבון בנקרוול לפי קלי וטבלת ז\'יטונים לקזינו',
      tagline: 'מתרגם יתרון סטטיסטי לערימות ז\'יטונים מעשיות לשולחנות של 10$, 15$ ו-25$.',
      edgeRating: 'סיכון לפשיטת רגל < 1.8%',
      edgeType: 'protection',
      iconKey: 'Coins',
      accentColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      badgeText: 'הגנת בנקרוול',
      whatItDoes:
        'מחשב את גודל ההימור האופטימלי שממקסם צמיחה מעריכית תוך שמירה קפדנית מפני מחיקת הבנקרוול. כולל טבלאות פיזור ז\'יטונים מוכנות מראש: תדע בדיוק כמה ז\'יטונים אדומים ($5), ירוקים ($25) או שחורים ($100) להניח מבלי לחשב בראש תחת מבטו של הדילר.',
      howToUse: [
        'בחר את סכום המינימום בשולחן ($10, $15 או $25).',
        'בחר מקדם בטיחות: חצי קלי (0.50φ) מומלץ למשחק חי כדי לחתוך את התנודתיות.',
        'בדוק את עמודת הז\'יטונים בהתאם לספירה האמיתית הנוכחית כדי לבצע את ההימור המדויק.',
        'צפה בתרשים גבולות הסטייה הסטוכסטית ל-200 עד 1,000 שעות משחק.'
      ],
      mathPrinciple: {
        formulaName: 'נוסחת קלי וסיכון לפשיטת רגל (RoR)',
        formula: 'f* = (bp - q) / b | RoR = exp(-2 · EV · Bankroll / σ²)',
        explanation:
          'נוסחת קלי מלאה ממקסמת צמיחה ארוכת טווח אך סובלת מנפילות עמוקות של 50%+. חצי קלי (f* / 2) משיג 75% מקצב הצמיחה עם שליש בלבד מהתנודתיות, ושומר על סיכון פשיטת רגל אפסי.'
      },
      proTip:
        'לעולם אל תשחק בפיזור הימורים של 1 ל-12 בשולחן $25 עם בנקרוול של פחות מ-$15,000. רצפי הפסדים של 80 עד 100 יחידות הימור הם בלתי נמנעים סטטיסטית בטווח הארוך.'
    },
    {
      id: 'f-drills',
      tabId: 'drills',
      category: 'drills',
      title: 'זירת אימוני רפלקס מהירים',
      tagline: 'אימוני הבזק עם שעון ספירה לאחור של 5 שניות להטמעת ספירה, סטיות וקבלת החלטות מהירה.',
      edgeRating: 'כיול רפלקסים',
      edgeType: 'training',
      iconKey: 'Flame',
      accentColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
      badgeText: 'אימונים מהירים',
      whatItDoes:
        'בקזינו אמיתי דילרים ואחראי משמרת לא נותנים לך 30 שניות לחשב משוואות. זירת האימונים מאלצת קבלת החלטות בשבריר שנייה תחת שעון של 5 שניות: סטיות Illustrious 18, זיהוי מכונות Must-Hit-By, הגנה לפי סיכויי קופה וחלוקת חבילות מהירה.',
      howToUse: [
        'קרא את תרחיש המשחק ובחר את הפעולה האופטימלית לפני שהזמן אוזל.',
        'צבור ז\'יטונים ושמור על רצף תשובות נכונות.',
        'סקור הסברים מיידיים המפרטים את ההבדל המדויק בתוחלת הרווח (EV).'
      ],
      mathPrinciple: {
        formulaName: 'מהירות החלטה ועלות טעויות',
        formula: 'תוחלת סשן = תוחלת יד - טעויות אנוש מצטברות',
        explanation:
          'סופר קלפים בדיוק של 98% טועה פעמיים בכל 100 ידיים. על פני 500 שעות בשנה בהימור של $50 ליחידה, 2 הטעויות הללו לכל חפיסה עולות אלפי דולרים ומוחקות לחלוטין את היתרון הסטטיסטי.'
      },
      proTip:
        'התאמן עד שהחלטות Illustrious 18 (כגון 16 מול 10 ו-12 מול 3) יהפכו לאוטומטיות לחלוטין וללא מאמץ.'
    },
    {
      id: 'f-roulette-systems',
      tabId: 'roulette',
      category: 'roulette',
      title: 'מעבדת מערכות רולטה ומבחן מאמץ מונטה קרלו',
      tagline: 'סימולציה סטוכסטית של מרטינגייל, ד\'אלמבר ופיבונאצ\'י מול תקרות הימור קשיחות בקזינו.',
      edgeRating: 'הפרכת מיתוסים',
      edgeType: 'protection',
      iconKey: 'Compass',
      accentColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      badgeText: 'מעבדת מונטה קרלו',
      whatItDoes:
        'מריץ עד 5,000 סיבובי מונטה קרלו מהירים לבדיקת שיטות הימורים מול תקרת שולחן ויתרון בית אמיתיים. חושף את "כשל המהמר" ומוכיח מתמטית מדוע מערכות הימור שלילי פרוגרסיביות אינן יכולות להתגבר על משחק בעל תוחלת שלילית.',
      howToUse: [
        'בחר שיטת הימור (מרטינגייל, ד\'אלמבר, פיבונאצ\'י, הימור שטוח).',
        'הגדר בנקרוול פתיחה, הימור בסיס ותקרת הימור מקסימלית בשולחן.',
        'הרץ סימולציה וצפה בנקודות הקריסה המוחלטת בעת רצף הפסדים.',
        'בחן את גרף המסלול המציג עליות רווח קטנות ולאחריהן קריסה טוטאלית.'
      ],
      mathPrinciple: {
        formulaName: 'מגבלת שיטת מרטינגייל',
        formula: 'הימור_n = בסיס · 2^(n-1) | P(רצף הפסדים n) = (19/37)^n',
        explanation:
          'לאחר 8 הפסדים רצופים, הימור בסיס של $10 דורש לסכן $1,280 רק כדי לזכות ב-$10 רווח. תקרת השולחן עוצרת את השחקן וגורמת לפשיטת רגל מהירה.'
      },
      proTip:
        'שום מערכת הימורים אינה יכולה להפוך משחק בעל תוחלת שלילית למשחק חיובי ללא יתרון פיזי חיצוני כגון הטיה בגלגל או חישוב מהירות כדור.'
    },
    {
      id: 'f-hub',
      tabId: 'command-center',
      category: 'general',
      title: 'מרכז הבקרה ווידג\'טים מהירים',
      tagline: 'מרכז בקרה ראשי עם מחשבון סיכויי קופה מיידי, מאמן הבזק היי-לו וטלמטריית יתרון.',
      edgeRating: 'פיקוד מרכזי',
      edgeType: 'positive',
      iconKey: 'Trophy',
      accentColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      badgeText: 'מרכז בקרה',
      whatItDoes:
        'שער הכניסה הראשי ל-HouseBreaker. כולל וידג\'טים לשימוש מהיר מחוץ לשולחן: מחשבון סיכויי קופה ב-3 שניות הנותן המלצה להשוואה או קיפול, משחקון רפלקס לזיהוי קלפי היי-לו וניווט בלחיצה אחת לכל המעבדות.',
      howToUse: [
        'השתמש במחשבון סיכויי הקופה בהפסקות טורניר לניתוח יד מורכבת.',
        'שחק במשחקון היי-לו לחימום מהירות זיהוי הקלפים לפני כניסה לקזינו.',
        'עקוב אחר סטטוס היתרון הכולל ואבטחת הנתונים הלא מקוונת.'
      ],
      mathPrinciple: {
        formulaName: 'שיטת הנקודות בהיי-לו',
        formula: 'קלפים 2-6: +1 | קלפים 7-9: 0 | קלפים 10-A: -1',
        explanation:
          'יציאת קלפים קטנים (2-6) משאירה את החבילה עשירה ב-10 ובאסים, מה שמקפיץ את שיעור הבלאק ג\'ק של השחקן, מחזק הכפלות ומגביר את תדירות הפסילות של הדילר.'
      },
      proTip:
        'השתמש במרכז הבקרה כלוח המחוונים הראשי שלך לפני כל סשן למטרת כיול מנטלי ומוכנות מתמטית.'
    },
    {
      id: 'f-legal',
      tabId: 'command-center',
      category: 'general',
      title: 'תאימות לחוק והגנת סעיף נבאדה NRS 465.075',
      tagline: 'הגנות משפטיות קפדניות המבטיחות אימון קוגניטיבי מחוץ לשולחן 100% כחוק ופרטיות מוחלטת.',
      edgeRating: 'חוקיות ובטיחות מלאה',
      edgeType: 'protection',
      iconKey: 'Shield',
      accentColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      badgeText: 'תקנון חוקי',
      whatItDoes:
        'מבטיח עמידה מלאה בחוק מדינת נבאדה (NRS) 465.075 ובדיני הימורים בינלאומיים האוסרים על מכשירי עזר אלקטרוניים. HouseBreaker פועל באופן מפורש כחבילת לימוד, מחשבון הסתברויות וארגז חול למחקר ביתי.',
      howToUse: [
        'עיין בפרטי החוק באמצעות כפתור "תקנון וחוק" בסרגל העליון.',
        'השתמש ב-HouseBreaker בבית, במלון או בהפסקות לפיתוח מהירות חישוב מנטלית.',
        'לעולם אל תפעיל מכשיר מחשוב אלקטרוני ליד שולחן משחק פעיל בקזינו במקומות שבהם הדבר אסור על פי חוק.'
      ],
      mathPrinciple: {
        formulaName: 'גבול החוק והתאימות הרגולטורית',
        formula: 'רכישת מיומנות אישית (חוקי לחלוטין) מול מכשיר בשולחן (עבירה פלילית)',
        explanation:
          'שימוש במוחך ובזיכרונך לספירת קלפים או חישוב סיכויים חוקי לחלוטין בנבאדה וברחבי העולם (אושר בפסיקות בתי משפט). שימוש במכשיר אלקטרוני ליד שולחן המשחק הוא עבירה פלילית לפי חוק NRS 465.075.'
      },
      proTip:
        'HouseBreaker נועד במיוחד לאמן את המוח האנושי לבצע את כל חישובי היתרון הסטטיסטי בראש בפחות מ-2 שניות.'
    }
  ]
};
