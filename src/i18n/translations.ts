export type Language = 'en' | 'ru' | 'he';

export interface Translations {
  // Brand & General
  appName: string;
  appSubtitle: string;
  proBadge: string;
  offline: string;
  legalStatute: string;
  profile: string;
  tokens: string;
  apEdge: string;

  // Tabs / Navigation
  navHub: string;
  navRoulette: string;
  navSlots: string;
  navPoker: string;
  navKelly: string;
  navDrills: string;
  navProfile: string;

  // Command Center / Hub
  arcadeTitle: string;
  arcadeBadge: string;
  activeAdvantageReady: string;
  arcadeSubtitle: string;
  btnExploreLabs: string;
  btnApDrills: string;
  btnStatuteLaw: string;
  btnFeatureGuide: string;

  // Quick Tools
  potOddsTitle: string;
  potOddsSub: string;
  potSize: string;
  betFacing: string;
  outsCount: string;
  potOddsRatio: string;
  mdfRatio: string;
  ruleOf4: string;
  profitableCall: string;
  unprofitableFold: string;

  mhbRadarTitle: string;
  mhbRadarSub: string;
  mhbThreshold: string;
  currentMeter: string;
  deltaJ: string;
  breakEvenCap: string;
  statusAttackZone: string;
  statusColdZone: string;

  hiloTrainerTitle: string;
  hiloTrainerSub: string;
  hiloScore: string;
  hiloHighCard: string;
  hiloNeutralCard: string;
  hiloLowCard: string;

  modulesTitle: string;
  modulesSubtitle: string;
  modRouletteTitle: string;
  modRouletteDesc: string;
  modSlotsTitle: string;
  modSlotsDesc: string;
  modPokerTitle: string;
  modPokerDesc: string;
  modKellyTitle: string;
  modKellyDesc: string;
  modDrillsTitle: string;
  modDrillsDesc: string;
  btnLaunchModule: string;

  // Blackjack
  bjTitle: string;
  bjSubtitle: string;
  hit: string;
  stand: string;
  double: string;
  split: string;
  surrender: string;
  dealCards: string;
  placeBetToDeal: string;
  yourHand: string;
  dealerUpcard: string;
  dealerHand: string;
  wager: string;
  soft: string;
  pair: string;
  placeChips: string;
  tapToStack: string;
  doubleChips: string;
  resetBet: string;
  nextHand: string;
  splitHand1: string;
  splitHand2: string;
  playingSplit1: string;
  playingSplit2: string;
  splitResolved: string;
  busted: string;
  dealerBusted: string;
  playerWins: string;
  dealerWins: string;
  push: string;

  // Drill Categories
  allHands: string;
  illustrious18: string;
  softHands: string;
  pairSplits: string;

  // Drill Arena
  drillArenaTitle: string;
  drillArenaSubtitle: string;
  activeSession: string;
  endSession: string;
  startSession: string;
  streak: string;
  xpEarned: string;
  accuracy: string;
  sessionCompleted: string;
  continueDrilling: string;
  viewProfileTelemetry: string;
  selectStartingBankroll: string;
  startTrainingBtn: string;
  trainingTargetNotice: string;
  blackjackGame: string;
  slotsGame: string;
  pokerGame: string;
  rouletteGame: string;

  // Poker
  pokerTitle: string;
  pokerSubtitle: string;
  communityBoard: string;
  heroHoleCards: string;
  villainHand: string;
  fold: string;
  call: string;
  raise: string;
  postAnte: string;
  simulatingEquity: string;
  matchBet: string;

  // Roulette
  rouletteTitle: string;
  rouletteSubtitle: string;
  spinWheel: string;
  clearFelt: string;
  doubleFelt: string;
  rebet: string;
  houseEdge: string;
  recentSpins: string;
  totalWager: string;
  europeanVariant: string;
  frenchVariant: string;
  americanVariant: string;

  // Slots
  slotsTitle: string;
  spinSlot: string;
  mustHitBy: string;
  currentPot: string;
  attackMode: string;

  // Profile Tab
  profileTitle: string;
  profileSubtitle: string;
  statTotalWagered: string;
  statTotalWon: string;
  statTotalLost: string;
  statNetProfit: string;
  statWinRate: string;
  statAccuracyRate: string;
  statRoundsPlayed: string;
  statTotalMistakes: string;
  tabOverview: string;
  tabHistory: string;
  tabMistakes: string;
  tabStrengths: string;
  tabFinancials: string;
  winLossChartTitle: string;
  frequentMistakesTitle: string;
  gameProficiencyTitle: string;
  strongestGame: string;
  weakestGame: string;
  allMistakesJournal: string;
  scenario: string;
  yourMove: string;
  correctMove: string;
  evCost: string;
  whyExplanation: string;
  noMistakesYet: string;
  noHistoryYet: string;
  startFirstDrillPrompt: string;
  baselineBankroll: string;
  roundAxisLabel: string;
  bankrollAxisLabel: string;
  filterByGame: string;
  resetStats: string;
  resetConfirm: string;
  exportData: string;
  badgesTitle: string;
  timeFilterAll: string;
  timeFilterRecent: string;

  // Language selector
  language: string;

  // Common Navigation / Actions
  hubMenu: string;
  switchLab: string;
  bankrollBtn: string;
  guide: string;
  closeBtn: string;
  cancelBtn: string;
  confirmBtn: string;

  // Drill Arena Extended
  liveDrillTitle: string;
  liveWagers: string;
  liveDrillSub: string;
  currentCredits: string;
  gtoAccuracy: string;
  hotStreak: string;
  sessionStack: string;
  adjustStack: string;
  optimalPlays: string;
  cashOutBtn: string;
  bjTable: string;
  bjTableSub: string;
  slotsTable: string;
  slotsTableSub: string;
  pokerTable: string;
  pokerTableSub: string;
  rouletteTable: string;
  rouletteTableSub: string;
  game1: string;
  game2: string;
  game3: string;
  game4: string;
  netPL: string;

  // Additional Labs
  slotsRadarTitle: string;
  slotsRadarSub: string;
  pokerLabTitle: string;
  pokerLabSub: string;
  kellyLabTitle: string;
  kellyLabSub: string;
  complianceModalTitle: string;
  guideModalTitle: string;

  // Granular Lab Localizations
  slotsClassic: string;
  slotsArcade: string;
  slotsCluster: string;
  slotsExtreme: string;
  slotsRadarEdge: string;
  playNowAdvantage: string;
  walkAwayNegative: string;
  currentMeter: string;
  mustHitDistance: string;
  breakevenPoint: string;
  expectedNetEdge: string;
  triggerEv: string;
  hitFrequency: string;
  cumulativeWin: string;
  spinSlotBtn: string;
  simulatingSpins: string;

  pokerMatrixBadge: string;
  gtoOpenPreset: string;
  tightUtgPreset: string;
  looseBtnPreset: string;
  pairsBroadwaysPreset: string;
  runEquitySimBtn: string;
  callProfitable: string;
  foldRecommendation: string;

  rouletteSimulatorTab: string;
  rouletteOddsTipsTab: string;
  rouletteDrillTab: string;
  rouletteMonteCarloTab: string;
  rouletteCodexTab: string;

  dedicatedBankroll: string;
  baseTableUnit: string;
  expectedWinRate: string;
  riskOfRuinLabel: string;
  floorChipSheet: string;
  trueCountHeader: string;
  playerAdvantageHeader: string;
  betSizeHeader: string;
  unitsHeader: string;
  floorActionHeader: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'HOUSEBREAKER',
    appSubtitle: 'Professional Advantage Play Training Platform',
    proBadge: 'PRO',
    offline: 'OFFLINE',
    legalStatute: 'LEGAL STATUTE',
    profile: 'PROFILE',
    tokens: 'Tokens',
    apEdge: '+1.85% AP EDGE',

    navHub: 'Hub',
    navRoulette: 'Roulette',
    navSlots: 'Slots',
    navPoker: 'Poker',
    navKelly: 'Kelly',
    navDrills: 'Drills',
    navProfile: 'Profile',

    arcadeTitle: 'CASINO ADVANTAGE ARCADE',
    arcadeBadge: 'ACTIVE ADVANTAGE READY',
    activeAdvantageReady: 'ACTIVE ADVANTAGE READY',
    arcadeSubtitle: 'Turn probability into profit with real mathematics, card counting drills, and progressive slot radar.',
    btnExploreLabs: 'EXPLORE LABS',
    btnApDrills: 'AP DRILLS',
    btnStatuteLaw: 'STATUTE LAW',
    btnFeatureGuide: 'FEATURE GUIDE',

    potOddsTitle: 'POT ODDS & MDF CALCULATOR',
    potOddsSub: 'Calculate exact equity hurdles and minimum defense frequencies',
    potSize: 'Pot Size ($)',
    betFacing: 'Bet Facing ($)',
    outsCount: 'Outs Count',
    potOddsRatio: 'Pot Odds Ratio',
    mdfRatio: 'Min Defense Freq (MDF)',
    ruleOf4: 'Turn + River Equity (Rule of 4)',
    profitableCall: 'MATHEMATICALLY PROFITABLE CALL (+EV)',
    unprofitableFold: 'NEGATIVE EXPECTATION FOLD (-EV)',

    mhbRadarTitle: 'MUST-HIT-BY RADAR',
    mhbRadarSub: 'Monitor progressive triggers and calculate the exact breakeven point',
    mhbThreshold: 'Must-Hit Threshold ($)',
    currentMeter: 'Current Pot ($)',
    deltaJ: 'Distance to Cap (ΔJ)',
    breakEvenCap: 'Estimated Break-even Point',
    statusAttackZone: 'IN AP ATTACK ZONE (+EV)',
    statusColdZone: 'COLD METER: AWAIT ACCUMULATION',

    hiloTrainerTitle: 'HI-LO CARD COUNT SPEED TRAINER',
    hiloTrainerSub: 'Train running count reflexes at high speed',
    hiloScore: 'Count Score',
    hiloHighCard: 'High Card (10-A) [-1]',
    hiloNeutralCard: 'Neutral (7-9) [0]',
    hiloLowCard: 'Low Card (2-6) [+1]',

    modulesTitle: 'ADVANTAGE PLAY DISCIPLINES',
    modulesSubtitle: 'Master statistical analysis, edge identification, and bankroll preservation',
    modRouletteTitle: 'Physical Roulette Lab',
    modRouletteDesc: 'European en-prison rules, wheel physics, and visual tracking analysis.',
    modSlotsTitle: 'Progressive Slots Radar',
    modSlotsDesc: 'Must-hit-by math engine, meter drift velocity, and break-even calculations.',
    modPokerTitle: 'Texas Hold\'em Matrix',
    modPokerDesc: '169-hand range visualization, pot odds, and Monte Carlo equity modeling.',
    modKellyTitle: 'Kelly Criterion Lab',
    modKellyDesc: 'Optimal fractional Kelly betting, risk of ruin formulas, and variance curves.',
    modDrillsTitle: 'Advantage Drill Arena',
    modDrillsDesc: 'Interactive trainer for Blackjack deviations, pairs, poker pots, and slots.',
    btnLaunchModule: 'LAUNCH LAB',

    bjTitle: 'Blackjack Basic Strategy & Deviations',
    bjSubtitle: 'Train Illustrious 18, pair splits, and soft doubles with instant EV feedback',
    hit: 'HIT',
    stand: 'STAND',
    double: 'DOUBLE',
    split: 'SPLIT',
    surrender: 'SURRENDER',
    dealCards: 'DEAL CARDS',
    placeBetToDeal: 'PLACE BET & DEAL',
    yourHand: 'YOUR HAND',
    dealerUpcard: 'DEALER UPCARD',
    dealerHand: 'DEALER HAND',
    wager: 'WAGER',
    soft: 'SOFT',
    pair: 'PAIR',
    placeChips: 'PLACE CHIPS:',
    tapToStack: '+ TAP TO STACK',
    doubleChips: '2× DOUBLE',
    resetBet: 'RESET $25',
    nextHand: 'NEXT HAND',
    splitHand1: 'HAND 1',
    splitHand2: 'HAND 2',
    playingSplit1: 'PLAYING HAND 1',
    playingSplit2: 'PLAYING HAND 2',
    splitResolved: 'SPLIT COMPLETED',
    busted: 'BUSTED',
    dealerBusted: 'DEALER BUSTED',
    playerWins: 'PLAYER WINS',
    dealerWins: 'DEALER WINS',
    push: 'PUSH (TIE)',

    allHands: 'All Hands',
    illustrious18: '⚡ Illustrious 18',
    softHands: '💎 Soft Hands',
    pairSplits: '✂️ Pair Splits',

    drillArenaTitle: 'ADVANTAGE PLAY DRILL ARENA',
    drillArenaSubtitle: 'Live interactive drills with real bankroll tracking and leak detection',
    activeSession: 'Session Active',
    endSession: 'End Session',
    startSession: 'Start Session',
    streak: 'Streak',
    xpEarned: 'XP Earned',
    accuracy: 'Accuracy',
    sessionCompleted: 'Session Completed',
    continueDrilling: 'Continue Drilling',
    viewProfileTelemetry: 'View Telemetry Profile',
    selectStartingBankroll: 'Select Starting Drill Bankroll',
    startTrainingBtn: 'Start Drill Session',
    trainingTargetNotice: 'Practice optimal play with no real-money risk. Every decision updates your operator profile.',
    blackjackGame: 'Blackjack',
    slotsGame: 'MHB Slots',
    pokerGame: 'Hold\'em Poker',
    rouletteGame: 'Roulette',

    pokerTitle: 'Texas Hold\'em Table Simulation',
    pokerSubtitle: 'Train pre-flop and post-flop pot odds vs villain ranges',
    communityBoard: 'COMMUNITY BOARD',
    heroHoleCards: 'HERO HOLE CARDS',
    villainHand: 'VILLAIN POSITION',
    fold: 'FOLD',
    call: 'CALL',
    raise: 'RAISE',
    postAnte: 'POST ANTE & DEAL',
    simulatingEquity: 'SIMULATING EQUITY...',
    matchBet: 'MATCH BET',

    rouletteTitle: 'Live Roulette Table Simulation',
    rouletteSubtitle: 'Place real chips on the felt layout, spin the wheel & experience authentic casino physics',
    spinWheel: 'SPIN WHEEL',
    clearFelt: 'CLEAR FELT',
    doubleFelt: 'DOUBLE (2X)',
    rebet: 'REBET',
    houseEdge: 'HOUSE EDGE',
    recentSpins: 'RECENT WHEEL SPINS',
    totalWager: 'TOTAL WAGER',
    europeanVariant: 'EU (2.7%)',
    frenchVariant: 'FR (1.35%)',
    americanVariant: 'US (5.26%)',

    slotsTitle: 'Must-Hit-By Progressive Slot Simulation',
    spinSlot: 'SPIN SLOT',
    mustHitBy: 'MUST-HIT-BY THRESHOLD',
    currentPot: 'CURRENT JACKPOT',
    attackMode: 'AP ATTACK ZONE',

    profileTitle: 'Operator Profile & Analytics',
    profileSubtitle: 'Telemetry history, leak detection, frequent mistake charts, and skill metrics',
    statTotalWagered: 'Total Wagered',
    statTotalWon: 'Total Won',
    statTotalLost: 'Total Lost',
    statNetProfit: 'Net P&L',
    statWinRate: 'Win Rate',
    statAccuracyRate: 'Strategy Accuracy',
    statRoundsPlayed: 'Rounds Played',
    statTotalMistakes: 'Leaks Detected',
    tabOverview: 'Overview',
    tabHistory: 'P&L History',
    tabMistakes: 'Mistakes Graph',
    tabStrengths: 'Game Strengths',
    tabFinancials: 'Financials',
    winLossChartTitle: 'Cumulative Bankroll Performance Over Time',
    frequentMistakesTitle: 'Most Frequent Strategy Leaks (-EV Graph)',
    gameProficiencyTitle: 'Skill & Profitability Matrix by Game',
    strongestGame: 'Strongest Discipline',
    weakestGame: 'Discipline Needing Focus',
    allMistakesJournal: 'Strategic Mistake Journal',
    scenario: 'Scenario',
    yourMove: 'Your Move',
    correctMove: 'Optimal Move',
    evCost: 'EV Cost',
    whyExplanation: 'Mathematical Reason',
    noMistakesYet: 'Zero mistakes logged! Pristine execution so far.',
    noHistoryYet: 'No session rounds recorded yet.',
    startFirstDrillPrompt: 'Play any drill in the Drill Arena to record authentic bankroll history and mistake logs.',
    baselineBankroll: 'Initial Baseline ($2,500)',
    roundAxisLabel: 'Round / Decision Timeline',
    bankrollAxisLabel: 'Bankroll ($)',
    filterByGame: 'Filter by Game:',
    resetStats: 'Reset Profile Data',
    resetConfirm: 'Are you sure you want to erase all stored drill history and mistakes?',
    exportData: 'Export Telemetry (JSON)',
    badgesTitle: 'Advantage Mastery Badges',
    timeFilterAll: 'All Time',
    timeFilterRecent: 'Recent 50 Rounds',
    financialLedger: 'Comprehensive Financial Ledger',
    statTotalWonLedger: 'Total Payouts Won',
    statTotalLostLedger: 'Total Burn / Losses',
    profitFactorLabel: 'Profit Factor',
    scoreLabel: 'SCORE',
    winRateLabel: 'WIN RATE',
    accuracyLabel: 'ACCURACY',
    roundsLabel: 'ROUNDS',
    unlockedBadge: 'UNLOCKED',
    startDrillCTA: 'LAUNCH LIVE DRILL',
    inspectTelemetry: 'INSPECT POINT',
    selectedPoint: 'Selected Point Telemetry',
    authenticDataNotice: 'Real Telemetry Mode: Zero simulated rounds. Complete a drill to start plotting your live bankroll trajectory.',

    language: 'Language',

    hubMenu: 'HUB MENU',
    switchLab: 'SWITCH LAB:',
    bankrollBtn: 'Bankroll',
    guide: 'Guide',
    closeBtn: 'Close',
    cancelBtn: 'Cancel',
    confirmBtn: 'Confirm',

    liveDrillTitle: 'Live Game Drill Arena',
    liveWagers: 'LIVE BANKROLL WAGERS',
    liveDrillSub: 'Real bets, genuine credits & instant GTO math coaching across playable casino games',
    currentCredits: 'CURRENT CREDITS',
    gtoAccuracy: 'GTO ACCURACY',
    hotStreak: 'HOT STREAK',
    sessionStack: 'SESSION STACK',
    adjustStack: 'Adjust Starting Stack',
    optimalPlays: 'optimal plays',
    cashOutBtn: 'CASH OUT',
    bjTable: 'Blackjack Table',
    bjTableSub: 'Illustrious 18',
    slotsTable: 'Must-Hit-By Slots',
    slotsTableSub: 'Multi-Row Scout',
    pokerTable: 'Poker River Defense',
    pokerTableSub: 'Pot Odds & Ranges',
    rouletteTable: 'Roulette Advantage',
    rouletteTableSub: 'Odds & Traps',
    game1: 'GAME 1',
    game2: 'GAME 2',
    game3: 'GAME 3',
    game4: 'GAME 4',
    netPL: 'Net P/L',

    slotsRadarTitle: 'Progressive Slots Radar',
    slotsRadarSub: 'Must-hit-by math engine, meter drift velocity, and break-even calculations',
    pokerLabTitle: 'HouseBreaker Poker Range Lab',
    pokerLabSub: 'GTO hand classes, Monte Carlo equity rollouts & live pot-odds breakeven solver',
    kellyLabTitle: 'Kelly Criterion & Risk Management',
    kellyLabSub: 'Optimal fractional betting, bankroll risk-of-ruin formulas and variance curves',
    complianceModalTitle: 'Nevada NRS 465.075 & Statutory Framework',
    guideModalTitle: 'Advantage Play Master Guide',

    slotsClassic: '5x3 Classic',
    slotsArcade: '7x7 Arcade',
    slotsCluster: '10x10 Cluster',
    slotsExtreme: '20x20 Extreme',
    slotsRadarEdge: 'CASINO FLOOR MUST-HIT-BY ADVANTAGE RADAR',
    playNowAdvantage: '★ PLAY NOW (+EV POSITIVE EDGE)',
    walkAwayNegative: 'WALK AWAY (-EV SUB-THRESHOLD)',
    currentMeter: 'Current Meter',
    mustHitDistance: 'Must-Hit Distance',
    breakevenPoint: 'Breakeven Point',
    expectedNetEdge: 'EXPECTED NET EDGE',
    triggerEv: 'Trigger +EV',
    hitFrequency: 'Hit Frequency',
    cumulativeWin: 'Session Payout',
    spinSlotBtn: 'SPIN SLOT',
    simulatingSpins: 'Spinning...',

    pokerMatrixBadge: '13x13 MATRIX',
    gtoOpenPreset: 'GTO Open 18%',
    tightUtgPreset: 'Tight UTG 12%',
    looseBtnPreset: 'Loose BTN 45%',
    pairsBroadwaysPreset: 'Pairs & Broadways',
    runEquitySimBtn: 'RUN EQUITY SIMULATION',
    callProfitable: 'PROFITABLE CALL (+EV)',
    foldRecommendation: 'FOLD RECOMMENDED (-EV)',

    rouletteSimulatorTab: '🎰 Simulator',
    rouletteOddsTipsTab: '💡 Odds & Tips',
    rouletteDrillTab: '⚡ Speed Drill',
    rouletteMonteCarloTab: '📊 Monte Carlo',
    rouletteCodexTab: '📚 Codex',

    dedicatedBankroll: 'DEDICATED BANKROLL',
    baseTableUnit: 'BASE TABLE UNIT',
    expectedWinRate: 'EXPECTED WIN RATE',
    riskOfRuinLabel: 'RISK OF RUIN',
    floorChipSheet: 'Floor Chip Spread Cheat Sheet',
    trueCountHeader: 'TRUE COUNT',
    playerAdvantageHeader: 'PLAYER ADVANTAGE',
    betSizeHeader: 'BET SIZE ($)',
    unitsHeader: 'UNITS',
    floorActionHeader: 'FLOOR ACTION'
  },
  ru: {
    appName: 'ХАУСБРЕЙКЕР',
    appSubtitle: 'Профессиональный тренажер математического преимущества в казино',
    proBadge: 'ПРО',
    offline: 'АВТОНОМНО',
    legalStatute: 'ЗАКОНОДАТЕЛЬСТВО',
    profile: 'ПРОФИЛЬ',
    tokens: 'Жетоны',
    apEdge: '+1.85% ПРЕИМУЩЕСТВО',

    navHub: 'Центр',
    navRoulette: 'Рулетка',
    navSlots: 'Слоты',
    navPoker: 'Покер',
    navKelly: 'Келли',
    navDrills: 'Тренировки',
    navProfile: 'Профиль',

    arcadeTitle: 'АРКАДА ПРЕИМУЩЕСТВА КАЗИНО',
    arcadeBadge: 'МАТЕМАТИЧЕСКОЕ ПРЕИМУЩЕСТВО',
    activeAdvantageReady: 'АКТИВНОЕ ПРЕИМУЩЕСТВО ГОТОВО',
    arcadeSubtitle: 'Обратите теорию вероятностей в прибыль с реальной математикой, тренировкой счета карт и радаром слотов.',
    btnExploreLabs: 'ЛАБОРАТОРИИ',
    btnApDrills: 'ТРЕНИРОВКИ',
    btnStatuteLaw: 'ЗАКОНОДАТЕЛЬСТВО',
    btnFeatureGuide: 'РУКОВОДСТВО',

    potOddsTitle: 'КАЛЬКУЛЯТОР ШАНСОВ БАНКА И MDF',
    potOddsSub: 'Расчет точного порога эквити и минимальной частоты защиты',
    potSize: 'Размер банка ($)',
    betFacing: 'Ставка оппонента ($)',
    outsCount: 'Количество аутов',
    potOddsRatio: 'Шансы банка (Pot Odds)',
    mdfRatio: 'Мин. частота защиты (MDF)',
    ruleOf4: 'Эквити терн + ривер (Правило 4)',
    profitableCall: 'МАТЕМАТИЧЕСКИ ВЫГОДНЫЙ КОЛЛ (+EV)',
    unprofitableFold: 'ОТРИЦАТЕЛЬНОЕ МАТ. ОЖИДАНИЕ (ФОЛД)',

    mhbRadarTitle: 'РАДАР MUST-HIT-BY СЛОТОВ',
    mhbRadarSub: 'Мониторинг прогрессивных триггеров и расчет точки безубыточности',
    mhbThreshold: 'Порог выпадения ($)',
    currentMeter: 'Текущий джекпот ($)',
    deltaJ: 'Дистанция до максимума (ΔJ)',
    breakEvenCap: 'Точка безубыточности',
    statusAttackZone: 'В ЗОНЕ АТАКИ (+EV)',
    statusColdZone: 'ХОЛОДНЫЙ МЕТР: ЖДИТЕ НАКОПЛЕНИЯ',

    hiloTrainerTitle: 'СКОРОСТНОЙ ТРЕНАЖЕР СЧЕТА HI-LO',
    hiloTrainerSub: 'Тренируйте мгновенное чтение карт и текущего счета',
    hiloScore: 'Очки счета',
    hiloHighCard: 'Старшая карта (10-A) [-1]',
    hiloNeutralCard: 'Нейтральная (7-9) [0]',
    hiloLowCard: 'Младшая карта (2-6) [+1]',

    modulesTitle: 'ДИСЦИПЛИНЫ ПРЕИМУЩЕСТВА',
    modulesSubtitle: 'Освойте статистический анализ, поиск уязвимостей и сохранение банкролла',
    modRouletteTitle: 'Лаборатория физики рулетки',
    modRouletteDesc: 'Европейское правило en-prison, физика колеса и баллистический анализ.',
    modSlotsTitle: 'Радар прогрессивных слотов',
    modSlotsDesc: 'Математика Must-Hit-By, скорость накопления и точка безубыточности.',
    modPokerTitle: 'Матрица Техасского Холдема',
    modPokerDesc: '169 стартовых диапазонов, шансы банка и расчет эквити Монте-Карло.',
    modKellyTitle: 'Критерий Келли и риск банкротства',
    modKellyDesc: 'Оптимальное фракционное беттирование, формулы риска и кривые дисперсии.',
    modDrillsTitle: 'Арена интерактивных тренировок',
    modDrillsDesc: 'Отработка базовой стратегии блэкджека, сплитов, покера и слотов.',
    btnLaunchModule: 'ОТКРЫТЬ',

    bjTitle: 'Блэкджек: Базовая стратегия и отклонения',
    bjSubtitle: 'Отработка Illustrious 18, сплитов и мягких удвоений с анализом мат. ожидания',
    hit: 'ЕЩЁ',
    stand: 'ХВАТИТ',
    double: 'УДВОИТЬ',
    split: 'СПЛИТ',
    surrender: 'СДАТЬСЯ',
    dealCards: 'РАЗДАТЬ КАРТЫ',
    placeBetToDeal: 'ПОСТАВИТЬ И РАЗДАТЬ',
    yourHand: 'ВАША РУКА',
    dealerUpcard: 'ОТКРЫТАЯ КАРТА ДИЛЕРА',
    dealerHand: 'РУКА ДИЛЕРА',
    wager: 'СТАВКА',
    soft: 'МЯГКАЯ',
    pair: 'ПАРА',
    placeChips: 'ФИШКИ В СТАВКУ:',
    tapToStack: '+ НАЖМИТЕ ДЛЯ СТЕКА',
    doubleChips: '2× УДВОИТЬ',
    resetBet: 'СБРОС 25$',
    nextHand: 'СЛЕДУЮЩАЯ РУКА',
    splitHand1: 'РУКА 1',
    splitHand2: 'РУКА 2',
    playingSplit1: 'ИГРА РУКОЙ 1',
    playingSplit2: 'ИГРА РУКОЙ 2',
    splitResolved: 'СПЛИТ ЗАВЕРШЕН',
    busted: 'ПЕРЕБОР',
    dealerBusted: 'ДИЛЕР ПЕРЕБРАЛ',
    playerWins: 'ИГРОК ВЫИГРАЛ',
    dealerWins: 'ДИЛЕР ВЫИГРАЛ',
    push: 'НИЧЬЯ (ПУШ)',

    allHands: 'Все руки',
    illustrious18: '⚡ Illustrious 18',
    softHands: '💎 Мягкие руки',
    pairSplits: '✂️ Сплиты пар',

    drillArenaTitle: 'АРЕНА ТРЕНИРОВКИ ПРЕИМУЩЕСТВА',
    drillArenaSubtitle: 'Интерактивные тренировки с отслеживанием реального банкролла и ошибок',
    activeSession: 'Сессия активна',
    endSession: 'Завершить сессию',
    startSession: 'Начать сессию',
    streak: 'Серия',
    xpEarned: 'Опыт (XP)',
    accuracy: 'Точность',
    sessionCompleted: 'Сессия завершена',
    continueDrilling: 'Продолжить тренировку',
    viewProfileTelemetry: 'Смотреть профиль телеметрии',
    selectStartingBankroll: 'Выберите начальный банкролл',
    startTrainingBtn: 'Начать тренировку',
    trainingTargetNotice: 'Тренируйтесь без риска потери реальных денег. Каждое решение учитывается в профиле.',
    blackjackGame: 'Блэкджек',
    slotsGame: 'Слоты MHB',
    pokerGame: 'Холдем Покер',
    rouletteGame: 'Рулетка',

    pokerTitle: 'Симуляция стола Техасский Холдем',
    pokerSubtitle: 'Расчет шансов банка и эквити против диапазонов соперника',
    communityBoard: 'ОБЩИЕ КАРТЫ СТОЛА',
    heroHoleCards: 'КАРТЫ ИГРОКА',
    villainHand: 'ПОЗИЦИЯ ОППОНЕНТА',
    fold: 'ФОЛД',
    call: 'КОЛЛ',
    raise: 'РЕЙЗ',
    postAnte: 'АНТЕ И РАЗДАТЬ',
    simulatingEquity: 'РАСЧЕТ ЭКВИТИ...',
    matchBet: 'УРАВНЯТЬ',

    rouletteTitle: 'Симуляция стола Рулетки',
    rouletteSubtitle: 'Размещайте фишки на сукне, вращайте колесо с реальной физикой шарика',
    spinWheel: 'ВРАЩАТЬ КОЛЕСО',
    clearFelt: 'ОЧИСТИТЬ СУКНО',
    doubleFelt: 'УДВОИТЬ (2X)',
    rebet: 'ПОВТОРИТЬ',
    houseEdge: 'ПРЕИМУЩЕСТВО КАЗИНО',
    recentSpins: 'ИСТОРИЯ ВРАЩЕНИЙ',
    totalWager: 'ОБЩАЯ СТАВКА',
    europeanVariant: 'ЕВРО (2.7%)',
    frenchVariant: 'ФРАНЦ (1.35%)',
    americanVariant: 'США (5.26%)',

    slotsTitle: 'Прогрессивный слот Must-Hit-By',
    spinSlot: 'КРУТИТЬ СЛОТ',
    mustHitBy: 'ПОРОГ ВЫПАДЕНИЯ',
    currentPot: 'ТЕКУЩИЙ ДЖЕКПОТ',
    attackMode: 'ЗОНА АТАКИ (+EV)',

    profileTitle: 'Профиль игрока и статистика',
    profileSubtitle: 'История банкролла, граф ошибок, сильные стороны и метрики навыков',
    statTotalWagered: 'Всего поставлено',
    statTotalWon: 'Всего выиграно',
    statTotalLost: 'Всего проиграно',
    statNetProfit: 'Чистый доход (P&L)',
    statWinRate: 'Процент побед',
    statAccuracyRate: 'Точность решений',
    statRoundsPlayed: 'Сыграно раундов',
    statTotalMistakes: 'Обнаружено ошибок',
    tabOverview: 'Обзор',
    tabHistory: 'История P&L',
    tabMistakes: 'Граф ошибок',
    tabStrengths: 'Сила по играм',
    tabFinancials: 'Финансы',
    winLossChartTitle: 'График динамики банкролла во времени',
    frequentMistakesTitle: 'Частые стратегические утечки (-EV)',
    gameProficiencyTitle: 'Матрица мастерства и доходности по играм',
    strongestGame: 'Сильнейшая дисциплина',
    weakestGame: 'Дисциплина для доработки',
    allMistakesJournal: 'Журнал стратегических ошибок',
    scenario: 'Сценарий',
    yourMove: 'Ваш ход',
    correctMove: 'Оптимальный ход',
    evCost: 'Потеря EV',
    whyExplanation: 'Математическое объяснение',
    noMistakesYet: 'Ни одной ошибки! Идеальное математическое исполнение.',
    noHistoryYet: 'Нет записей раундов.',
    startFirstDrillPrompt: 'Сыграйте раздачи на вкладке Тренировки, чтобы начать запись реального банкролла и ошибок.',
    baselineBankroll: 'Базовый уровень ($2,500)',
    roundAxisLabel: 'Раунды / Хронология решений',
    bankrollAxisLabel: 'Банкролл ($)',
    filterByGame: 'Фильтр по игре:',
    resetStats: 'Сбросить профиль',
    resetConfirm: 'Вы уверены, что хотите стереть всю сохраненную историю и ошибки?',
    exportData: 'Экспорт данных (JSON)',
    badgesTitle: 'Достижения мастерства',
    timeFilterAll: 'Все время',
    timeFilterRecent: 'Последние 50 раундов',
    financialLedger: 'Финансовый реестр и баланс',
    statTotalWonLedger: 'Всего выплат выиграно',
    statTotalLostLedger: 'Всего проиграно',
    profitFactorLabel: 'Профит-фактор',
    scoreLabel: 'БАЛЛ',
    winRateLabel: 'ВИНРЕЙТ',
    accuracyLabel: 'ТОЧНОСТЬ',
    roundsLabel: 'РАУНДЫ',
    unlockedBadge: 'ОТКРЫТО',
    startDrillCTA: 'НАЧАТЬ ТРЕНИРОВКУ',
    inspectTelemetry: 'ОСМОТР ТОЧКИ',
    selectedPoint: 'Телеметрия выбранной точки',
    authenticDataNotice: 'Режим реальной телеметрии: без симуляций. Сыграйте раунд, чтобы построить график вашего банкролла.',

    language: 'Язык',

    hubMenu: 'МЕНЮ ХАБА',
    switchLab: 'ДРУГАЯ ЛАБ.:',
    bankrollBtn: 'Банкролл',
    guide: 'Гайд',
    closeBtn: 'Закрыть',
    cancelBtn: 'Отмена',
    confirmBtn: 'Подтвердить',

    liveDrillTitle: 'Арена интерактивных тренировок',
    liveWagers: 'СТАВКИ ИЗ БАНКРОЛЛА',
    liveDrillSub: 'Реальные ставки, кредиты и мгновенный математический анализ GTO',
    currentCredits: 'ТЕКУЩИЙ БАЛАНС',
    gtoAccuracy: 'ТОЧНОСТЬ GTO',
    hotStreak: 'СЕРИЯ ПОБЕД',
    sessionStack: 'НАЧАЛЬНЫЙ СТЕК',
    adjustStack: 'Изменить банкролл',
    optimalPlays: 'верных решений',
    cashOutBtn: 'ЗАБРАТЬ КУШ',
    bjTable: 'Стол блэкджека',
    bjTableSub: 'Illustrious 18',
    slotsTable: 'Слоты Must-Hit-By',
    slotsTableSub: 'Поиск перевеса',
    pokerTable: 'Защита ривера в покере',
    pokerTableSub: 'Шансы банка и диапазоны',
    rouletteTable: 'Преимущество в рулетке',
    rouletteTableSub: 'Шансы и ловушки',
    game1: 'ИГРА 1',
    game2: 'ИГРА 2',
    game3: 'ИГРА 3',
    game4: 'ИГРА 4',
    netPL: 'Чистый P/L',

    slotsRadarTitle: 'Радар прогрессивных слотов',
    slotsRadarSub: 'Математика Must-Hit-By, скорость накопления и точки безубыточности',
    pokerLabTitle: 'Лаборатория диапазонов покера',
    pokerLabSub: 'GTO диапазоны, расчет эквити Монте-Карло и калькулятор шансов банка',
    kellyLabTitle: 'Критерий Келли и управление рисками',
    kellyLabSub: 'Оптимальный фракционный беттинг, расчет риска банкротства и дисперсия',
    complianceModalTitle: 'Статут Невады NRS 465.075 и правовая база',
    guideModalTitle: 'Руководство по преимуществу в играх',

    slotsClassic: '5x3 Классика',
    slotsArcade: '7x7 Аркада',
    slotsCluster: '10x10 Кластер',
    slotsExtreme: '20x20 Экстрим',
    slotsRadarEdge: 'РАДАР ПРЕИМУЩЕСТВА В СЛОТАХ MUST-HIT-BY',
    playNowAdvantage: '★ ИГРАЙТЕ СЕЙЧАС (+EV ПЕРЕВЕС)',
    walkAwayNegative: 'УХОДИТЕ (-EV НИЖЕ ПОРОГА)',
    currentMeter: 'Текущий джекпот',
    mustHitDistance: 'Дистанция до порога',
    breakevenPoint: 'Точка безубыточности',
    expectedNetEdge: 'ОЖИДАЕМЫЙ ПЕРЕВЕС',
    triggerEv: 'Включить +EV',
    hitFrequency: 'Частота попаданий',
    cumulativeWin: 'Выплаты за сессию',
    spinSlotBtn: 'КРУТИТЬ СЛОТ',
    simulatingSpins: 'Вращение...',

    pokerMatrixBadge: 'МАТРИЦА 13x13',
    gtoOpenPreset: 'GTO Опен 18%',
    tightUtgPreset: 'Тайт UTG 12%',
    looseBtnPreset: 'Луз BTN 45%',
    pairsBroadwaysPreset: 'Пары и Бродвей',
    runEquitySimBtn: 'ЗАПУСТИТЬ СИМУЛЯЦИЮ ЭКВИТИ',
    callProfitable: 'ВЫГОДНЫЙ КОЛЛ (+EV)',
    foldRecommendation: 'РЕКОМЕНДУЕТСЯ ФОЛД (-EV)',

    rouletteSimulatorTab: '🎰 Симулятор',
    rouletteOddsTipsTab: '💡 Шансы и советы',
    rouletteDrillTab: '⚡ Тренировка скорости',
    rouletteMonteCarloTab: '📊 Монте-Карло',
    rouletteCodexTab: '📚 Кодекс',

    dedicatedBankroll: 'ВЫДЕЛЕННЫЙ БАНКРОЛЛ',
    baseTableUnit: 'БАЗОВАЯ СТАВКА СТОЛА',
    expectedWinRate: 'ОЖИДАЕМЫЙ ВИНРЕЙТ',
    riskOfRuinLabel: 'РИСК БАНКРОТСТВА',
    floorChipSheet: 'Шпаргалка распределения фишек',
    trueCountHeader: 'РЕАЛЬНЫЙ СЧЕТ',
    playerAdvantageHeader: 'ПРЕИМУЩЕСТВО ИГРОКА',
    betSizeHeader: 'РАЗМЕР СТАВКИ ($)',
    unitsHeader: 'ЕДИНИЦЫ',
    floorActionHeader: 'ДЕЙСТВИЕ ЗА СТОЛОМ'
  },
  he: {
    appName: 'האוס-ברייקר',
    appSubtitle: 'פלטפורמת אימונים מקצועית ליתרון סטטיסטי בקזינו',
    proBadge: 'פרו',
    offline: 'לא מקוון',
    legalStatute: 'חוקיות ותקנון',
    profile: 'פרופיל',
    tokens: 'ז\'יטונים',
    apEdge: '+1.85% יתרון סטטיסטי',

    navHub: 'ראשי',
    navRoulette: 'רולטה',
    navSlots: 'מכונות',
    navPoker: 'פוקר',
    navKelly: 'קלי',
    navDrills: 'אימונים',
    navProfile: 'פרופיל',

    arcadeTitle: 'ארקייד יתרון סטטיסטי בקזינו',
    arcadeBadge: 'יתרון מתמטי מוכן',
    activeAdvantageReady: 'יתרון מתמטי פעיל',
    arcadeSubtitle: 'הפוך את תורת ההסתברות לרווח באמצעות מתמטיקה אמיתית, אימון ספירת קלפים ומעקב אחר מכונות מזל.',
    btnExploreLabs: 'מעבדות',
    btnApDrills: 'אימונים',
    btnStatuteLaw: 'תקנון וחוק',
    btnFeatureGuide: 'מדריך פיצ\'רים',

    potOddsTitle: 'מחשבון סיכויי קופה ו-MDF',
    potOddsSub: 'חישוב מדויק של סף האיקוויטי ותדירות ההגנה המינימלית',
    potSize: 'גודל הקופה ($)',
    betFacing: 'הימור מולך ($)',
    outsCount: 'מספר אאוטים',
    potOddsRatio: 'סיכויי קופה (Pot Odds)',
    mdfRatio: 'תדירות הגנה מינימלית (MDF)',
    ruleOf4: 'איקוויטי טרן + ריבר (כלל 4)',
    profitableCall: 'השוואה רווחית מתמטית (+EV)',
    unprofitableFold: 'תוחלת שלילית (קיפול -EV)',

    mhbRadarTitle: 'מכ"ם מכונות מזל פרוגרסיביות',
    mhbRadarSub: 'ניטור גבולות משיכה וחישוב נקודת האיזון המתמטית',
    mhbThreshold: 'סף משיכת חובה ($)',
    currentMeter: 'ג\'קפוט נוכחי ($)',
    deltaJ: 'מרחק מהתקרה (ΔJ)',
    breakEvenCap: 'נקודת איזון מחושבת',
    statusAttackZone: 'באזור תקיפה מתמטי (+EV)',
    statusColdZone: 'מד קר: המתן להצטברות',

    hiloTrainerTitle: 'אימון מהיר לספירת קלפים Hi-Lo',
    hiloTrainerSub: 'תרגל מהירות ספירה רצה ותגובה מהירה לקלפים',
    hiloScore: 'ציון ספירה',
    hiloHighCard: 'קלף גבוה (10-A) [-1]',
    hiloNeutralCard: 'ניטרלי (7-9) [0]',
    hiloLowCard: 'קלף נמוך (2-6) [+1]',

    modulesTitle: 'תחומי התמחות ביתרון סטטיסטי',
    modulesSubtitle: 'שליטה בניתוח סטטיסטי, זיהוי יתרון ושמירה על הבנק',
    modRouletteTitle: 'מעבדת רולטה פיזיקלית',
    modRouletteDesc: 'חוקי En-Prison אירופיים, פיזיקת גלגל וניתוח הטיה.',
    modSlotsTitle: 'מכ"ם מכונות מזל',
    modSlotsDesc: 'מתמטיקת Must-Hit-By, קצב צבירה ונקודות איזון.',
    modPokerTitle: 'מטריצת טקסס הולדם',
    modPokerDesc: 'הדמיית 169 טווחי ידיים, סיכויי קופה ומודל מונטה קרלו.',
    modKellyTitle: 'קריטריון קלי וניהול סיכונים',
    modKellyDesc: 'הימור קלי שברירי אופטימלי, סיכון לפשיטת רגל וגרפי שונות.',
    modDrillsTitle: 'זירת אימונים אינטראקטיבית',
    modDrillsDesc: 'אימון סטיות בלקג\'ק, פיצולים, ידיים בפוקר ומכונות.',
    btnLaunchModule: 'פתח מעבדה',

    bjTitle: 'בלקג\'ק: אסטרטגיה בסיסית וסטיות',
    bjSubtitle: 'אימון על Illustrious 18, פיצולי זוגות והכפלות רכות עם משוב תוחלת מיידי',
    hit: 'הכה',
    stand: 'עמוד',
    double: 'הכפל',
    split: 'פצל',
    surrender: 'היכנע',
    dealCards: 'חלק קלפים',
    placeBetToDeal: 'הנח הימור וחלק',
    yourHand: 'היד שלך',
    dealerUpcard: 'קלף חשוף של הדילר',
    dealerHand: 'יד הדילר',
    wager: 'הימור',
    soft: 'רך',
    pair: 'זוג',
    placeChips: 'הנחת ז\'יטונים:',
    tapToStack: '+ הקש להוספה',
    doubleChips: '2× הכפל הימור',
    resetBet: 'איפוס $25',
    nextHand: 'יד הבאה',
    splitHand1: 'יד 1',
    splitHand2: 'יד 2',
    playingSplit1: 'משחק יד 1',
    playingSplit2: 'משחק יד 2',
    splitResolved: 'פיצול הסתיים',
    busted: 'נשרף',
    dealerBusted: 'דילר נשרף',
    playerWins: 'ניצחון שחקן',
    dealerWins: 'ניצחון דילר',
    push: 'תיקו',

    allHands: 'כל הידיים',
    illustrious18: '⚡ Illustrious 18',
    softHands: '💎 ידיים רכות',
    pairSplits: '✂️ פיצול זוגות',

    drillArenaTitle: 'זירת אימוני יתרון סטטיסטי',
    drillArenaSubtitle: 'אימונים אינטראקטיביים עם מעקב בנקרוֹל אמיתי וזיהוי טעויות',
    activeSession: 'סשן פעיל',
    endSession: 'סיים סשן',
    startSession: 'התחל סשן',
    streak: 'רצף',
    xpEarned: 'נקודות ניסיון',
    accuracy: 'דיוק',
    sessionCompleted: 'הסשן הסתיים',
    continueDrilling: 'המשך להתאמן',
    viewProfileTelemetry: 'צפה בטלמטריית פרופיל',
    selectStartingBankroll: 'בחר בנקרוֹל התחלתי',
    startTrainingBtn: 'התחל אימון',
    trainingTargetNotice: 'התאמן ללא סיכון כספי אמיתי. כל החלטה מעדכנת את פרופיל הביצועים שלך.',
    blackjackGame: 'בלקג\'ק',
    slotsGame: 'מכונות MHB',
    pokerGame: 'טקסס פוקר',
    rouletteGame: 'רולטה',

    pokerTitle: 'סימולציית שולחן טקסס הולדם',
    pokerSubtitle: 'חישוב סיכויי קופה ואיקוויטי מול טווחי יריב',
    communityBoard: 'קלפי שולחן משותפים',
    heroHoleCards: 'קלפי כיס של השחקן',
    villainHand: 'עמדת היריב',
    fold: 'קפל',
    call: 'השווה',
    raise: 'העלה',
    postAnte: 'הנח אנטה וחלק',
    simulatingEquity: 'מחשב איקוויטי...',
    matchBet: 'השווה הימור',

    rouletteTitle: 'סימולציית שולחן רולטה חיה',
    rouletteSubtitle: 'הנח ז\'יטונים אמיתיים על הבד, סובב את הגלגל וחווה פיזיקה אותנטית',
    spinWheel: 'סובב גלגל',
    clearFelt: 'נקה שולחן',
    doubleFelt: 'הכפל (2X)',
    rebet: 'הימור חוזר',
    houseEdge: 'יתרון הקזינו',
    recentSpins: 'סיבובים אחרונים',
    totalWager: 'סך הימור',
    europeanVariant: 'אירופי (2.7%)',
    frenchVariant: 'צרפתי (1.35%)',
    americanVariant: 'אמריקאי (5.26%)',

    slotsTitle: 'סימולציית מכונת מזל פרוגרסיבית',
    spinSlot: 'סובב מכונה',
    mustHitBy: 'סף משיכה חובה',
    currentPot: 'קופה נוכחית',
    attackMode: 'אזור תקיפה',

    profileTitle: 'פרופיל מפעיל ואנליטיקה',
    profileSubtitle: 'היסטוריית טלמטריה, זיהוי דליפות, גרף טעויות שכיחות ומדדי מיומנות',
    statTotalWagered: 'סך הכל הומר',
    statTotalWon: 'סך הכל זכיות',
    statTotalLost: 'סך הכל הפסדים',
    statNetProfit: 'רווח נקי (P&L)',
    statWinRate: 'אחוז ניצחונות',
    statAccuracyRate: 'דיוק אסטרטגי',
    statRoundsPlayed: 'סיבובים ששוחקו',
    statTotalMistakes: 'טעויות שזוהו',
    tabOverview: 'סקירה',
    tabHistory: 'היסטוריית רווח/הפסד',
    tabMistakes: 'גרף טעויות',
    tabStrengths: 'חוזקות לפי משחק',
    tabFinancials: 'פיננסים',
    winLossChartTitle: 'ביצועי בנקרוֹל מצטברים לאורך זמן',
    frequentMistakesTitle: 'דליפות אסטרטגיות שכיחות ביותר (גרף -EV)',
    gameProficiencyTitle: 'מטריצת מיומנות ורווחיות לפי משחק',
    strongestGame: 'תחום חזק ביותר',
    weakestGame: 'תחום הדורש חיזוק',
    allMistakesJournal: 'יומן טעויות אסטרטגיות',
    scenario: 'תרחיש',
    yourMove: 'המהלך שלך',
    correctMove: 'המהלך האופטימלי',
    evCost: 'עלות תוחלת (-EV)',
    whyExplanation: 'הסבר מתמטי',
    noMistakesYet: 'אפס טעויות! ביצוע מתמטי מושלם.',
    noHistoryYet: 'טרם נרשמו סיבובים בסשן.',
    startFirstDrillPrompt: 'שחק ידיים בזירת האימונים כדי להתחיל לתעד היסטוריית בנקרוֹל ויומן טעויות אמיתיים.',
    baselineBankroll: 'בנקרוֹל בסיס ($2,500)',
    roundAxisLabel: 'ציר סיבובים / החלטות',
    bankrollAxisLabel: 'בנקרוֹל ($)',
    filterByGame: 'סנן לפי משחק:',
    resetStats: 'אפס נתוני פרופיל',
    resetConfirm: 'האם אתה בטוח שברצונך למחוק את כל היסטוריית האימונים והטעויות?',
    exportData: 'ייצוא נתונים (JSON)',
    badgesTitle: 'תגי שליטה ביתרון',
    timeFilterAll: 'כל הזמנים',
    timeFilterRecent: '50 סיבובים אחרונים',
    financialLedger: 'ספר חשבונות פיננסי',
    statTotalWonLedger: 'סך זכיות ששולמו',
    statTotalLostLedger: 'סך שריפה / הפסדים',
    profitFactorLabel: 'גורם רווח',
    scoreLabel: 'ציון',
    winRateLabel: 'אחוז ניצחונות',
    accuracyLabel: 'דיוק',
    roundsLabel: 'סיבובים',
    unlockedBadge: 'נפתח',
    startDrillCTA: 'התחל אימון חי',
    inspectTelemetry: 'בדוק נקודה',
    selectedPoint: 'נתוני הנקודה שנבחרה',
    authenticDataNotice: 'מצב טלמטריה אמיתית בלבד: אפס נתונים פיקטיביים. השלם סיבוב אימון כדי לצייר את עקומת הבנקרוֹל בזמן אמת.',

    language: 'שפה',

    hubMenu: 'תפריט ראשי',
    switchLab: 'מעבדה:',
    bankrollBtn: 'בנק',
    guide: 'מדריך',
    closeBtn: 'סגור',
    cancelBtn: 'ביטול',
    confirmBtn: 'אישור',

    liveDrillTitle: 'זירת אימונים חיה',
    liveWagers: 'הימורי בנק חיים',
    liveDrillSub: 'הימורים אמיתיים, קרדיטים וניתוח תוחלת מתמטי מיידי',
    currentCredits: 'יתרת קרדיטים',
    gtoAccuracy: 'דיוק מתמטי',
    hotStreak: 'רצף הצלחות',
    sessionStack: 'קופת סשן',
    adjustStack: 'התאם קופה',
    optimalPlays: 'מהלכים אופטימליים',
    cashOutBtn: 'פדה רווחים',
    bjTable: 'שולחן בלקג\'ק',
    bjTableSub: 'Illustrious 18',
    slotsTable: 'מכונות Must-Hit-By',
    slotsTableSub: 'סריקת שורות',
    pokerTable: 'הגנת ריבר בפוקר',
    pokerTableSub: 'סיכויי קופה וטווחים',
    rouletteTable: 'יתרון ברולטה',
    rouletteTableSub: 'סיכויים ומלכודות',
    game1: 'משחק 1',
    game2: 'משחק 2',
    game3: 'משחק 3',
    game4: 'משחק 4',
    netPL: 'רווח/הפסד נקי',

    slotsRadarTitle: 'מכ"ם מכונות מזל',
    slotsRadarSub: 'מתמטיקת Must-Hit-By, קצב צבירה וחישובי נקודת איזון',
    pokerLabTitle: 'מעבדת טווחי פוקר',
    pokerLabSub: 'מחלקות ידיים GTO, הרצות מונטה קרלו ומחשבון סיכויי קופה',
    kellyLabTitle: 'קריטריון קלי וניהול סיכונים',
    kellyLabSub: 'הימורי קלי שבריריים אופטימליים, נוסחאות סיכון לפשיטת רגל ועקומות שונות',
    complianceModalTitle: 'חוק נבאדה NRS 465.075 ומסגרת משפטית',
    guideModalTitle: 'מדריך מקיף ליתרון על הקזינו',

    slotsClassic: '5x3 קלאסי',
    slotsArcade: '7x7 ארקייד',
    slotsCluster: '10x10 קלאסטר',
    slotsExtreme: '20x20 אקסטרים',
    slotsRadarEdge: 'מכ"ם יתרון סטטיסטי Must-Hit-By',
    playNowAdvantage: '★ שחק עכשיו (+EV יתרון חיובי)',
    walkAwayNegative: 'התרחק (-EV מתחת לסף)',
    currentMeter: 'מד נוכחי',
    mustHitDistance: 'מרחק לסף הזכייה',
    breakevenPoint: 'נקודת איזון',
    expectedNetEdge: 'יתרון נקי צפוי',
    triggerEv: 'הפעל +EV',
    hitFrequency: 'תדירות פגיעות',
    cumulativeWin: 'תשלומי סשן',
    spinSlotBtn: 'סובב מכונה',
    simulatingSpins: 'מסתובב...',

    pokerMatrixBadge: 'מטריצה 13x13',
    gtoOpenPreset: 'פתיחת GTO 18%',
    tightUtgPreset: 'UTG הדוק 12%',
    looseBtnPreset: 'כפתור רחב 45%',
    pairsBroadwaysPreset: 'זוגות וברודוויי',
    runEquitySimBtn: 'הרץ סימולציית איקוויטי',
    callProfitable: 'השוואה רווחית (+EV)',
    foldRecommendation: 'מומלץ לקפל (-EV)',

    rouletteSimulatorTab: '🎰 סימולטור',
    rouletteOddsTipsTab: '💡 סיכויים וטיפים',
    rouletteDrillTab: '⚡ אימון מהירות',
    rouletteMonteCarloTab: '📊 מונטה קרלו',
    rouletteCodexTab: '📚 מדריך',

    dedicatedBankroll: 'בנקרוול ייעודי',
    baseTableUnit: 'יחידת שולחן בסיסית',
    expectedWinRate: 'קצב רווח צפוי',
    riskOfRuinLabel: 'סיכון לפשיטת רגל',
    floorChipSheet: 'טבלת פיזור ז\'יטונים',
    trueCountHeader: 'ספירה אמיתית',
    playerAdvantageHeader: 'יתרון השחקן',
    betSizeHeader: 'גודל הימור ($)',
    unitsHeader: 'יחידות',
    floorActionHeader: 'פעולה בשולחן'
  }
};
