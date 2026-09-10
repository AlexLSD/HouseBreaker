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
  navBlackjack: string;
  navRoulette: string;
  navSlots: string;
  navPoker: string;
  navKelly: string;
  navDrills: string;
  navProfile: string;
  howToPlay: string;
  btnHowToPlay: string;
  rulesAndMath: string;

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
  financialLedger: string;
  statTotalWonLedger: string;
  statTotalLostLedger: string;
  profitFactorLabel: string;
  scoreLabel: string;
  winRateLabel: string;
  accuracyLabel: string;
  roundsLabel: string;
  unlockedBadge: string;
  startDrillCTA: string;
  inspectTelemetry: string;
  selectedPoint: string;
  authenticDataNotice: string;

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

  // Onboarding & Zero to Hero
  alphaBadge: string;
  onboardingTitle: string;
  onboardingSubtitle: string;
  nicknameLabel: string;
  nicknamePlaceholder: string;
  defaultLanguageLabel: string;
  startExploringBtn: string;
  editProfileBtn: string;
  zeroToHeroGuide: string;
  howItWorks: string;
  kellyDeepDive: string;
  hiloDeepDive: string;

  // Compliance Modal
  complianceHeader: string;
  complianceSub: string;
  complianceStatuteTitle: string;
  complianceStatuteBody: string;
  complianceCertTitle: string;
  complianceCertItem1: string;
  complianceCertItem2: string;
  complianceCertItem3: string;
  complianceMathTitle: string;
  complianceMathMemorylessTitle: string;
  complianceMathMemorylessBody: string;
  complianceMathDependentTitle: string;
  complianceMathDependentBody: string;
  complianceAckBtn: string;

  // Feature Guide Modal
  guideHeader: string;
  guideSub: string;
  guideSearchPlaceholder: string;
  guideSearchClear: string;
  guideCatAll: string;
  guideCatBlackjack: string;
  guideCatRoulette: string;
  guideCatSlots: string;
  guideCatPoker: string;
  guideCatKelly: string;
  guideCatDrills: string;
  guideCatRouletteSys: string;
  guideCatHub: string;
  guideCollapse: string;
  guideDetails: string;
  guideWhatItDoes: string;
  guideHowToUse: string;
  guideMathPrinciple: string;
  guideExactProof: string;
  guideProAdvice: string;
  guideOpenFeature: string;
  guideDoneReading: string;
  guideOfflineNotice: string;
  guideNoMatches: string;
  guideTrySearching: string;

  // Bankroll Setup Modal
  bankrollSetupTitle: string;
  bankrollSetupSub: string;
  bankrollStackLabel: string;
  bankrollCreditsUnit: string;
  bankrollEquates: string;
  bankrollStdBets: string;
  bankrollSelectPreset: string;
  bankrollCustomAmount: string;
  bankrollRulesTitle: string;
  bankrollRule1: string;
  bankrollRule2: string;
  bankrollRule3: string;
  bankrollStartBtn: string;
  bankrollCancel: string;
  bankrollReturnHub: string;

  // Drill Summary Modal
  summaryBusted: string;
  summaryCashedOut: string;
  summaryStart: string;
  summaryEnd: string;
  summaryRoi: string;
  summaryTier: string;
  summaryLostMost: string;
  summaryWonMost: string;
  summaryAutopsy: string;
  summaryRestart: string;
  summaryBackHub: string;
  summaryAllGames: string;
  summaryNoMistakes: string;

  // Drill Simulation UI
  simLiveRouletteTitle: string;
  simLiveRouletteSub: string;
  simActiveFelt: string;
  simZeroToHeroBtn: string;
  simPhysicsEngine: string;
  simResult: string;
  simZero: string;
  simEven: string;
  simOdd: string;
  simRecentSpins: string;
  simSpinsLogged: string;
  simNoSpinsYet: string;
  simWinningHits: string;
  simSpinWheel: string;
  simClearBets: string;
  simDouble: string;
  simRebet: string;

  // Additional Roulette & Table labels
  advPlayTelemetry: string;
  tableFeltBettingSpot: string;
  clickAnyNumberHelp: string;
  totalWagerLabel: string;
  spinningWheel: string;
  placeBetsToSpin: string;

  // Additional Summary Modal labels
  summaryCreditsSuffix: string;
  summaryLost: string;
  summaryYourAction: string;
  summaryGtoOptimal: string;
  summaryWon: string;
  summaryNoWins: string;
  summaryTelemetryHeader: string;
  summaryRounds: string;
  summaryAccuracy: string;
  summaryAutopsyHeader: string;
  summaryFilterAll: string;
  summaryNoMistakesCat: string;
  summaryStartNewBtn: string;
  summaryResumePlay: string;
  summaryCloseAutopsy: string;
  summaryHub: string;

  // Slot Machine Drill
  gridLabel: string;
  evBreachDetected: string;
  evSubThreshold: string;
  mustHitByCap: string;
  currentProgressiveMeter: string;
  distanceToCap: string;
  breakEvenThresholdLabel: string;
  capLabel: string;
  formatLabel: string;
  reelsRowsFormat: string;
  activePaylinesLabel: string;
  paylineWinLabel: string;
  mustHitByTriggeredLabel: string;
  casinoFloorCall: string;
  betLabel: string;
  attackMachineBtn: string;
  walkAwayPassBtn: string;
  spinGridBtn: string;
  spinningStatus: string;
  scoutBonus: string;
  leakPenalty: string;
  nextMachineBtn: string;
  machineLabel: string;
  scoutingMachineCount: string;

  // Blackjack Lab & Table
  tabCasinoTable: string;
  tabStrategyMatrix: string;
  tabHowItWorks: string;
  hideCountHud: string;
  showCountHud: string;
  advisorOn: string;
  advisorOff: string;
  runningCount: string;
  decksRemaining: string;
  trueCount: string;
  playerEdge: string;
  dealerTotal: string;
  playerTotal: string;
  betToDeal: string;
  clearBet: string;
  dealHand: string;
  doubleBet: string;
  gtoAdvisorRec: string;
  matrixTitle: string;
  matrixSubtitle: string;

  // Card Counting Academy
  countingAcademyTitle: string;
  countingAcademySubtitle: string;
  tabSecret: string;
  tabHiLo: string;
  tabTrueCount: string;
  tabBetSpread: string;
  tabPractice: string;
  whatIsCardTag: string;
  resetShoe: string;
  streakLabel: string;
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
    navBlackjack: 'Blackjack',
    navRoulette: 'Roulette',
    navSlots: 'Slots',
    navPoker: 'Poker',
    navKelly: 'Kelly',
    navDrills: 'Drills',
    navProfile: 'Profile',
    howToPlay: 'How to Play',
    btnHowToPlay: 'How to Play & Guide',
    rulesAndMath: 'Rules & Advantage Math',

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
    floorActionHeader: 'FLOOR ACTION',

    alphaBadge: 'alpha',
    onboardingTitle: 'Welcome to HouseBreaker',
    onboardingSubtitle: 'Configure your tactical advantage profile and language preferences.',
    nicknameLabel: 'Callsign / Operator Nickname',
    nicknamePlaceholder: 'e.g. EdgeMaster, BlackjackAce',
    defaultLanguageLabel: 'Default Language',
    startExploringBtn: 'Initialize HouseBreaker',
    editProfileBtn: 'Edit Profile',
    zeroToHeroGuide: 'Zero to Hero Guide',
    howItWorks: 'How the Game Works',
    kellyDeepDive: 'Kelly Criterion Explained Simply',
    hiloDeepDive: 'Hi-Lo Card Counting Explained',

    // Compliance Modal
    complianceHeader: 'Regulatory Compliance & Statutory Framework',
    complianceSub: 'Nevada NRS 465.075 • Apple App Store 5.3.4 • Research & Simulation Only',
    complianceStatuteTitle: 'Nevada Revised Statutes (NRS) 465.075 & 465.088',
    complianceStatuteBody: 'Under Nevada law, it is a Category B felony (punishable by 1 to 10 years imprisonment and up to $10,000 fines per violation) to use or possess any computerized hardware or software at a licensed gaming establishment to project outcomes, track cards, or calculate playing or betting strategies during live play.',
    complianceCertTitle: 'Platform Certification & Scope',
    complianceCertItem1: 'Zero Real-Money Wagering: Operates strictly on virtual simulation credits. No financial deposits or withdrawals.',
    complianceCertItem2: 'No Real-Time In-Venue Assistance (RTA): All simulation engines are intended for offline study, mathematical audits, and pedagogical training.',
    complianceCertItem3: 'App Store 5.3.4 & Google Play Compliant: Categorized as a Quantitative Gaming Simulator & Statistical Analysis Tool.',
    complianceMathTitle: 'Mathematical Feasibility Breakdown',
    complianceMathMemorylessTitle: 'Memoryless Independent Games:',
    complianceMathMemorylessBody: 'Roulette, Craps, Sic Bo, & Standard Spins. Probability of outcome is identical each round: P(X_t|X_1..X_t-1) = P(X_t). No software can eliminate the house edge.',
    complianceMathDependentTitle: 'Dependent & State-Based Games:',
    complianceMathDependentBody: 'Shoe Blackjack (Hypergeometric sampling without replacement), PvP Poker (CFR+ Game Theory), and Must-Hit-By Progressive Slots have mathematical state thresholds yielding positive expectation (+EV).',
    complianceAckBtn: 'Understood & Acknowledged',

    // Feature Guide Modal
    guideHeader: 'Advantage Play Codex & Mathematical Blueprints',
    guideSub: 'Interactive tactical guides, expected value formulas, and operating procedures.',
    guideSearchPlaceholder: 'Search blueprints (e.g., Hi-Lo, Must-Hit-By, MDF, Kelly)...',
    guideSearchClear: 'Clear',
    guideCatAll: 'All Advantage Tools',
    guideCatBlackjack: 'Blackjack & Hi-Lo',
    guideCatRoulette: 'Roulette & Physics',
    guideCatSlots: 'Slots (Must-Hit-By)',
    guideCatPoker: 'Poker GTO & Pot Odds',
    guideCatKelly: 'Kelly & Bankroll',
    guideCatDrills: 'Live Game Drills',
    guideCatRouletteSys: 'Roulette Systems',
    guideCatHub: 'Hub & Legal Statute',
    guideCollapse: 'Collapse ▲',
    guideDetails: 'Details ▼',
    guideWhatItDoes: 'WHAT THIS UNIQUE FEATURE DOES',
    guideHowToUse: 'HOW TO OPERATE ON THE CASINO FLOOR OR IN PRACTICE',
    guideMathPrinciple: 'MATHEMATICAL PRINCIPLE',
    guideExactProof: 'EXACT PROOF',
    guideProAdvice: 'Pro Advice:',
    guideOpenFeature: 'OPEN FEATURE',
    guideDoneReading: 'Done Reading',
    guideOfflineNotice: 'Strictly offline math trainer • Free from external server dependencies',
    guideNoMatches: 'No matching features found for',
    guideTrySearching: 'Try searching for "Kelly", "MHB", "deviations", or "odds".',

    // Bankroll Setup Modal
    bankrollSetupTitle: 'DRILL BANKROLL SETUP',
    bankrollSetupSub: 'Choose your starting bankroll. Every decision risks real credits on live bets. Win to multiply your stack or run dry and face the mistake autopsy!',
    bankrollStackLabel: 'STARTING DRILL STACK',
    bankrollCreditsUnit: 'CREDITS 🪙',
    bankrollEquates: 'Equates to',
    bankrollStdBets: 'standard $25 bets',
    bankrollSelectPreset: 'Select Starting Credit Preset:',
    bankrollCustomAmount: 'Custom Amount:',
    bankrollRulesTitle: 'DRILL RULES & SURVIVAL:',
    bankrollRule1: 'Each drill deducts credits based on your wager, and pays winnings upon victory.',
    bankrollRule2: 'If you hit 0 credits, the drill halts immediately with a Full Mistake Autopsy.',
    bankrollRule3: 'You can click "Cash Out" at any moment to lock in profit and review your performance.',
    bankrollStartBtn: 'START DRILL WITH',
    bankrollCancel: 'Cancel / Keep Current',
    bankrollReturnHub: 'Return to Hub',

    // Drill Summary Modal
    summaryBusted: 'BANKROLL DEPLETED - BUSTED!',
    summaryCashedOut: 'DRILL CASHED OUT SECURELY',
    summaryStart: 'Start:',
    summaryEnd: 'End:',
    summaryRoi: 'ROI',
    summaryTier: 'PERFORMANCE TIER:',
    summaryLostMost: 'WHERE YOU LOST THE MOST',
    summaryWonMost: 'MOST PROFITABLE ADVANTAGE',
    summaryAutopsy: 'DRILL MISTAKE AUTOPSY',
    summaryRestart: 'Restart Drill',
    summaryBackHub: 'Back to Hub',
    summaryAllGames: 'All Games',
    summaryNoMistakes: 'Flawless session! No sub-optimal EV mistakes recorded.',

    // Drill Simulation UI
    simLiveRouletteTitle: 'Live Roulette Table Simulation',
    simLiveRouletteSub: 'Place real chips on the felt layout, spin the wheel & experience authentic casino physics',
    simActiveFelt: 'ACTIVE FELT',
    simZeroToHeroBtn: 'Zero to Hero Guide',
    simPhysicsEngine: 'PHYSICS WHEEL ENGINE',
    simResult: 'RESULT:',
    simZero: 'ZERO',
    simEven: 'EVEN',
    simOdd: 'ODD',
    simRecentSpins: 'RECENT WHEEL SPINS',
    simSpinsLogged: 'SPINS LOGGED',
    simNoSpinsYet: 'No spins yet. Place bets and press SPIN WHEEL.',
    simWinningHits: 'Winning Hits:',
    simSpinWheel: 'SPIN WHEEL',
    simClearBets: 'CLEAR BETS',
    simDouble: 'DOUBLE',
    simRebet: 'REBET',

    // Additional Roulette & Table labels
    advPlayTelemetry: 'ADVANTAGE PLAY TELEMETRY',
    tableFeltBettingSpot: 'TABLE FELT BETTING SPOT',
    clickAnyNumberHelp: '(Click any number or area to place chips)',
    totalWagerLabel: 'TOTAL WAGER',
    spinningWheel: 'SPINNING WHEEL...',
    placeBetsToSpin: 'PLACE BETS TO SPIN',

    // Additional Summary Modal labels
    summaryCreditsSuffix: 'CREDITS 🪙',
    summaryLost: 'Lost',
    summaryYourAction: 'Your Decision',
    summaryGtoOptimal: 'GTO Optimal',
    summaryWon: 'Won',
    summaryNoWins: 'No significant winning plays logged yet.',
    summaryTelemetryHeader: 'GAME-BY-GAME METRICS & PROFICIENCY',
    summaryRounds: 'rounds',
    summaryAccuracy: 'accuracy',
    summaryAutopsyHeader: 'Mistake Autopsy ({count} leaks identified)',
    summaryFilterAll: 'ALL',
    summaryNoMistakesCat: 'No mistakes in this category!',
    summaryStartNewBtn: 'Start New Drill',
    summaryResumePlay: 'Resume Play',
    summaryCloseAutopsy: 'Close Autopsy',
    summaryHub: 'Hub',

    // Slot Machine Drill
    gridLabel: 'GRID:',
    evBreachDetected: '+EV BREACH DETECTED',
    evSubThreshold: '-EV SUB-THRESHOLD',
    mustHitByCap: 'MUST HIT BY CAP',
    currentProgressiveMeter: 'CURRENT PROGRESSIVE JACKPOT METER',
    distanceToCap: 'Distance to Cap ΔJ',
    breakEvenThresholdLabel: 'Break-Even',
    capLabel: 'Cap',
    formatLabel: 'FORMAT',
    reelsRowsFormat: 'FORMAT: {cols} REELS × {rows} ROWS',
    activePaylinesLabel: 'ACTIVE PAYLINES',
    paylineWinLabel: 'PAYLINE WIN!',
    mustHitByTriggeredLabel: 'MUST-HIT-BY PROGRESSIVE TRIGGERED!',
    casinoFloorCall: 'CASINO FLOOR CALL: Is this slot +EV Advantage or a -EV House Trap?',
    betLabel: 'BET',
    attackMachineBtn: 'ATTACK MACHINE (+EV)',
    walkAwayPassBtn: 'WALK AWAY & PASS (-EV)',
    spinGridBtn: 'SPIN GRID',
    spinningStatus: 'SPINNING...',
    scoutBonus: '+50 CR SCOUT BONUS',
    leakPenalty: '-50 CR LEAK PENALTY',
    nextMachineBtn: 'NEXT MACHINE',
    machineLabel: 'Machine',
    scoutingMachineCount: 'Scouting machine',

    // Blackjack Lab & Table
    tabCasinoTable: 'CASINO TABLE',
    tabStrategyMatrix: 'STRATEGY MATRIX',
    tabHowItWorks: 'HOW IT WORKS',
    hideCountHud: 'HIDE COUNT HUD',
    showCountHud: 'SHOW COUNT HUD',
    advisorOn: 'ADVISOR ON',
    advisorOff: 'ADVISOR OFF',
    runningCount: 'RUNNING COUNT',
    decksRemaining: 'DECKS REMAINING',
    trueCount: 'TRUE COUNT',
    playerEdge: 'PLAYER EDGE',
    dealerTotal: 'DEALER TOTAL',
    playerTotal: 'PLAYER TOTAL',
    betToDeal: 'BET TO DEAL',
    clearBet: 'CLEAR BET',
    dealHand: 'DEAL HAND',
    doubleBet: '2X BET',
    gtoAdvisorRec: 'GTO ADVISOR RECOMMENDATION',
    matrixTitle: '6-Deck S17 Basic Strategy Matrix',
    matrixSubtitle: 'The mathematically proven decision matrix for every combination of player total and dealer upcard.',

    // Card Counting Academy
    countingAcademyTitle: 'Card Counting Academy (Zero to Hero)',
    countingAcademySubtitle: 'Master the exact mathematical counting system that shifts the casino edge in your favor',
    tabSecret: '0. Secret',
    tabHiLo: '1. Hi-Lo',
    tabTrueCount: '2. True Count',
    tabBetSpread: '3. Bet Spread',
    tabPractice: '⚡ Practice',
    whatIsCardTag: 'WHAT IS THE HI-LO VALUE OF THIS CARD?',
    resetShoe: 'Reset Shoe',
    streakLabel: 'Streak'
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
    navBlackjack: 'Блэкджек',
    navRoulette: 'Рулетка',
    navSlots: 'Слоты',
    navPoker: 'Покер',
    navKelly: 'Келли',
    navDrills: 'Тренировки',
    navProfile: 'Профиль',
    howToPlay: 'Как играть',
    btnHowToPlay: 'Как играть и руководство',
    rulesAndMath: 'Правила и математика преимущества',

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
    floorActionHeader: 'ДЕЙСТВИЕ ЗА СТОЛОМ',

    alphaBadge: 'альфа',
    onboardingTitle: 'Добро пожаловать в HouseBreaker',
    onboardingSubtitle: 'Настройте свой тактический профиль и языковые предпочтения.',
    nicknameLabel: 'Позывной / Никнейм оператора',
    nicknamePlaceholder: 'напр. EdgeMaster, BlackjackAce',
    defaultLanguageLabel: 'Язык по умолчанию',
    startExploringBtn: 'Запустить HouseBreaker',
    editProfileBtn: 'Редактировать профиль',
    zeroToHeroGuide: 'Гид: От Нуля до Профи',
    howItWorks: 'Как работает игра',
    kellyDeepDive: 'Критерий Келли: простое объяснение',
    hiloDeepDive: 'Подсчет карт Hi-Lo с нуля',

    // Compliance Modal
    complianceHeader: 'Законодательное регулирование и правовой статус',
    complianceSub: 'Невада NRS 465.075 • Apple App Store 5.3.4 • Исключительно для исследований и обучения',
    complianceStatuteTitle: 'Свод законов Невады (NRS) 465.075 и 465.088',
    complianceStatuteBody: 'По законодательству штата Невада использование или наличие компьютерных устройств либо программного обеспечения в игорных заведениях для прогнозирования исходов, подсчета карт или расчета стратегий ставок во время реальной игры признается тяжким преступлением категории B (наказывается лишением свободы от 1 до 10 лет и штрафом до $10 000 за каждое нарушение).',
    complianceCertTitle: 'Сертификация платформы и область применения',
    complianceCertItem1: 'Без реальных денег: Платформа использует исключительно виртуальные тренировочные кредиты. Финансовые депозиты и выводы невозможны.',
    complianceCertItem2: 'Запрет использования в казино (RTA): Все симуляторы предназначены для автономного математического анализа, аудита вероятностей и тренировки памяти дома.',
    complianceCertItem3: 'Соответствие стандартам App Store 5.3.4 и Google Play: Категория «Тренажер количественного анализа и математической статистики».',
    complianceMathTitle: 'Математическая классификация игр',
    complianceMathMemorylessTitle: 'Игры без памяти (независимые испытания):',
    complianceMathMemorylessBody: 'Рулетка, кости (Craps), Сик Бо и стандартные слоты. Вероятность исхода каждого раунда строго постоянна: P(X_t|X_1..X_t-1) = P(X_t). Никакое ПО не способно устранить преимущество казино.',
    complianceMathDependentTitle: 'Игры с памятью состояний (зависимые испытания):',
    complianceMathDependentBody: 'Блэкджек из шуза (гипергеометрическая выборка без возвращения), PvP Покер (теория игр CFR+) и слоты Must-Hit-By обладают математическими порогами состояний с положительным математическим ожиданием (+EV).',
    complianceAckBtn: 'Ознакомлен и подтверждаю',

    // Feature Guide Modal
    guideHeader: 'Кодекс математического преимущества и тактические схемы',
    guideSub: 'Интерактивные практические руководства, формулы математического ожидания и регламенты действий.',
    guideSearchPlaceholder: 'Поиск по схемам (напр., Hi-Lo, Must-Hit-By, MDF, Келли)...',
    guideSearchClear: 'Очистить',
    guideCatAll: 'Все инструменты',
    guideCatBlackjack: 'Блэкджек и Hi-Lo',
    guideCatRoulette: 'Рулетка и физика',
    guideCatSlots: 'Слоты (Must-Hit-By)',
    guideCatPoker: 'Покер GTO и шансы банка',
    guideCatKelly: 'Келли и банкролл',
    guideCatDrills: 'Тренажер живых игр',
    guideCatRouletteSys: 'Системы рулетки',
    guideCatHub: 'Центр и правовые нормы',
    guideCollapse: 'Свернуть ▲',
    guideDetails: 'Подробнее ▼',
    guideWhatItDoes: 'ЧТО ДЕЛАЕТ ЭТОТ ИНСТРУМЕНТ',
    guideHowToUse: 'ПОРЯДОК ДЕЙСТВИЙ В КАЗИНО ИЛИ НА ТРЕНИРОВКЕ',
    guideMathPrinciple: 'МАТЕМАТИЧЕСКИЙ ПРИНЦИП',
    guideExactProof: 'ТОЧНОЕ ДОКАЗАТЕЛЬСТВО',
    guideProAdvice: 'Совет эксперта:',
    guideOpenFeature: 'ОТКРЫТЬ МОДУЛЬ',
    guideDoneReading: 'Завершить чтение',
    guideOfflineNotice: 'Полностью автономный математический тренажер • Без внешних серверов',
    guideNoMatches: 'Ничего не найдено по запросу',
    guideTrySearching: 'Попробуйте поискать «Келли», «MHB», «отклонения» или «шансы».',

    // Bankroll Setup Modal
    bankrollSetupTitle: 'НАСТРОЙКА БАНКРОЛЛА ДЛЯ ТРЕНИРОВКИ',
    bankrollSetupSub: 'Выберите стартовый баланс. Каждое решение рискует реальными кредитами в ставках. Умножьте стек точной игрой или столкнитесь с полным разбором ошибок при обнулении!',
    bankrollStackLabel: 'СТАРТОВЫЙ ТРЕНИРОВОЧНЫЙ СТЕК',
    bankrollCreditsUnit: 'КРЕДИТОВ 🪙',
    bankrollEquates: 'Эквивалентно',
    bankrollStdBets: 'стандартным ставкам по 25$',
    bankrollSelectPreset: 'Выберите готовый стек кредитов:',
    bankrollCustomAmount: 'Своя сумма:',
    bankrollRulesTitle: 'ПРАВИЛА ТРЕНИРОВКИ И ВЫЖИВАНИЕ:',
    bankrollRule1: 'Каждый раунд списывает кредиты ставки и начисляет выигрыш при победе.',
    bankrollRule2: 'При балансе 0 кредитов тренировка немедленно завершается полным анализом ошибок.',
    bankrollRule3: 'Вы можете нажать «Забрать банк» в любой момент, чтобы зафиксировать прибыль и просмотреть разбор.',
    bankrollStartBtn: 'НАЧАТЬ ТРЕНИРОВКУ С',
    bankrollCancel: 'Отмена / Оставить текущий',
    bankrollReturnHub: 'В главное меню',

    // Drill Summary Modal
    summaryBusted: 'БАНКРОЛЛ ИСЧЕРПАН - ВЫБЫВАНИЕ!',
    summaryCashedOut: 'БАНКРОЛЛ УСПЕШНО ЗАФИКСИРОВАН',
    summaryStart: 'Старт:',
    summaryEnd: 'Финиш:',
    summaryRoi: 'ROI',
    summaryTier: 'УРОВЕНЬ МАСТЕРСТВА:',
    summaryLostMost: 'ГДЕ БЫЛО БОЛЬШЕ ВСЕГО ПОТЕРЬ',
    summaryWonMost: 'САМЫЙ ПРИБЫЛЬНЫЙ ИСТОЧНИК ПРЕИМУЩЕСТВА',
    summaryAutopsy: 'РАЗБОР ОШИБОК И МАТЕМАТИЧЕСКИХ УТЕЧЕК',
    summaryRestart: 'Начать заново',
    summaryBackHub: 'В главное меню',
    summaryAllGames: 'Все игры',
    summaryNoMistakes: 'Безупречная сессия! Ошибок математического ожидания не зафиксировано.',

    // Drill Simulation UI
    simLiveRouletteTitle: 'Симуляция стола рулетки',
    simLiveRouletteSub: 'Размещайте фишки на сукне, запускайте колесо и изучайте аутентичную физику казино',
    simActiveFelt: 'АКТИВНОЕ СУКНО',
    simZeroToHeroBtn: 'Гид: От Нуля до Профи',
    simPhysicsEngine: 'ФИЗИЧЕСКИЙ ДВИЖОК КОЛЕСА',
    simResult: 'РЕЗУЛЬТАТ:',
    simZero: 'ЗЕРО',
    simEven: 'ЧЕТ',
    simOdd: 'НЕЧЕТ',
    simRecentSpins: 'ПОСЛЕДНИЕ СПИНЫ КОЛЕСА',
    simSpinsLogged: 'СПИНОВ В ИСТОРИИ',
    simNoSpinsYet: 'Спинов пока нет. Сделайте ставки и нажмите ВРАЩАТЬ КОЛЕСО.',
    simWinningHits: 'Выигрышные ставки:',
    simSpinWheel: 'ВРАЩАТЬ КОЛЕСО',
    simClearBets: 'ОЧИСТИТЬ СУКНО',
    simDouble: 'УДВОИТЬ',
    simRebet: 'ПОВТОРИТЬ',

    // Additional Roulette & Table labels
    advPlayTelemetry: 'ТЕЛЕМЕТРИЯ ПРЕИМУЩЕСТВА',
    tableFeltBettingSpot: 'ПОЛЕ СТАВОК НА СУКНЕ',
    clickAnyNumberHelp: '(Нажмите на число или зону для ставки)',
    totalWagerLabel: 'ОБЩАЯ СТАВКА',
    spinningWheel: 'КОЛЕСО ВРАЩАЕТСЯ...',
    placeBetsToSpin: 'СДЕЛАЙТЕ СТАВКУ ДЛЯ ВРАЩЕНИЯ',

    // Additional Summary Modal labels
    summaryCreditsSuffix: 'КРЕДИТОВ 🪙',
    summaryLost: 'Потеряно',
    summaryYourAction: 'Ваше решение',
    summaryGtoOptimal: 'Оптимально по GTO',
    summaryWon: 'Выиграно',
    summaryNoWins: 'Значимых выигрышных решений пока нет.',
    summaryTelemetryHeader: 'ПОКАЗАТЕЛИ И ЭФФЕКТИВНОСТЬ ПО ИГРАМ',
    summaryRounds: 'раундов',
    summaryAccuracy: 'точность',
    summaryAutopsyHeader: 'Разбор ошибок (найдено утечек: {count})',
    summaryFilterAll: 'ВСЕ',
    summaryNoMistakesCat: 'В этой категории нет ошибок!',
    summaryStartNewBtn: 'Начать новую тренировку',
    summaryResumePlay: 'Продолжить игру',
    summaryCloseAutopsy: 'Закрыть разбор',
    summaryHub: 'В меню',

    // Slot Machine Drill
    gridLabel: 'СЕТКА:',
    evBreachDetected: '+EV ПОРОГ ПРЕОДОЛЕН',
    evSubThreshold: '-EV НИЖЕ ПОРОГА',
    mustHitByCap: 'ПОТОЛОК MUST-HIT-BY',
    currentProgressiveMeter: 'ТЕКУЩИЙ СЧЕТЧИК ДЖЕКПОТА',
    distanceToCap: 'Дистанция до потолка ΔJ',
    breakEvenThresholdLabel: 'Безубыточность',
    capLabel: 'Потолок',
    formatLabel: 'ФОРМАТ',
    reelsRowsFormat: 'ФОРМАТ: {cols} БАРАБАНОВ × {rows} РЯДОВ',
    activePaylinesLabel: 'АКТИВНЫЕ ЛИНИИ',
    paylineWinLabel: 'ВЫИГРЫШ ПО ЛИНИИ!',
    mustHitByTriggeredLabel: 'ДЖЕКПОТ MUST-HIT-BY ВЫБИТ!',
    casinoFloorCall: 'РЕШЕНИЕ В КАЗИНО: Этот слот дает +EV преимущество или это -EV ловушка?',
    betLabel: 'СТАВКА',
    attackMachineBtn: 'АТАКОВАТЬ СЛОТ (+EV)',
    walkAwayPassBtn: 'ПРОЙТИ МИМО (-EV)',
    spinGridBtn: 'КРУТИТЬ БАРАБАНЫ',
    spinningStatus: 'ВРАЩЕНИЕ...',
    scoutBonus: '+50 КР БОНУС СКАУТА',
    leakPenalty: '-50 КР ШТРАФ ЗА УТЕЧКУ',
    nextMachineBtn: 'СЛЕДУЮЩИЙ АВТОМАТ',
    machineLabel: 'Автомат',
    scoutingMachineCount: 'Осмотр автомата',

    // Blackjack Lab & Table
    tabCasinoTable: 'СТОЛ КАЗИНО',
    tabStrategyMatrix: 'МАТРИЦА СТРАТЕГИИ',
    tabHowItWorks: 'КАК ЭТО РАБОТАЕТ',
    hideCountHud: 'СКРЫТЬ СЧЕТ HUD',
    showCountHud: 'ПОКАЗАТЬ СЧЕТ HUD',
    advisorOn: 'СОВЕТНИК ВКЛ',
    advisorOff: 'СОВЕТНИК ВЫКЛ',
    runningCount: 'ТЕКУЩИЙ СЧЕТ',
    decksRemaining: 'ОСТАЛОСЬ КОЛОД',
    trueCount: 'ИСТИННЫЙ СЧЕТ',
    playerEdge: 'ПРЕИМУЩЕСТВО ИГРОКА',
    dealerTotal: 'СУММА ДИЛЕРА',
    playerTotal: 'СУММА ИГРОКА',
    betToDeal: 'СДЕЛАЙТЕ СТАВКУ',
    clearBet: 'СБРОС СТАВКИ',
    dealHand: 'РАЗДАТЬ КАРТЫ',
    doubleBet: 'СТАВКА 2X',
    gtoAdvisorRec: 'РЕКОМЕНДАЦИЯ GTO СОВЕТНИКА',
    matrixTitle: 'Матрица базовой стратегии (6 колод, S17)',
    matrixSubtitle: 'Математически доказанные решения для любой комбинации карт игрока и дилера.',

    // Card Counting Academy
    countingAcademyTitle: 'Академия счета карт (От нуля до профи)',
    countingAcademySubtitle: 'Освойте точную математическую систему счета, дающую перевес над казино',
    tabSecret: '0. Секрет',
    tabHiLo: '1. Hi-Lo',
    tabTrueCount: '2. Истинный счет',
    tabBetSpread: '3. Спред ставок',
    tabPractice: '⚡ Практика',
    whatIsCardTag: 'КАКОВО ЗНАЧЕНИЕ ЭТОЙ КАРТЫ В HI-LO?',
    resetShoe: 'Сброс башмака',
    streakLabel: 'Серия'
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
    navBlackjack: 'בלאק ג\'ק',
    navRoulette: 'רולטה',
    navSlots: 'מכונות',
    navPoker: 'פוקר',
    navKelly: 'קלי',
    navDrills: 'אימונים',
    navProfile: 'פרופיל',
    howToPlay: 'איך לשחק',
    btnHowToPlay: 'איך לשחק ומדריך',
    rulesAndMath: 'כללים ומתמטיקת יתרון',

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
    floorActionHeader: 'פעולה בשולחן',

    alphaBadge: 'אלפא',
    onboardingTitle: 'ברוכים הבאים ל-HouseBreaker',
    onboardingSubtitle: 'הגדר את פרופיל היתרון הטקטי שלך והעדפות השפה.',
    nicknameLabel: 'כינוי מפעיל',
    nicknamePlaceholder: 'למשל: EdgeMaster, BlackjackAce',
    defaultLanguageLabel: 'שפת ברירת מחדל',
    startExploringBtn: 'הפעל את HouseBreaker',
    editProfileBtn: 'ערוך פרופיל',
    zeroToHeroGuide: 'מדריך: מאפס למקצוען',
    howItWorks: 'איך המשחק עובד',
    kellyDeepDive: 'הסבר פשוט על נוסחת קלי',
    hiloDeepDive: 'הסבר על ספירת קלפים היי-לו',

    // Compliance Modal
    complianceHeader: 'תאימות רגולטורית ומסגרת חוקית',
    complianceSub: 'נבאדה NRS 465.075 • Apple App Store 5.3.4 • למחקר וסימולציה בלבד',
    complianceStatuteTitle: 'חוקי מדינת נבאדה (NRS) 465.075 ו-465.088',
    complianceStatuteBody: 'לפי החוק בנבאדה, שימוש או החזקה של חומרה או תוכנה ממוחשבת במוסד הימורים מורשה לחיזוי תוצאות, ספירת קלפים או חישוב אסטרטגיות משחק והימורים בזמן אמת מהווים עבירה פלילית מסוג B (עונש של 1 עד 10 שנות מאסר וקנס של עד 10,000$ לכל הפרה).',
    complianceCertTitle: 'הסמכת הפלטפורמה ותחום השימוש',
    complianceCertItem1: 'ללא כסף אמיתי: הפלטפורמה פועלת אך ורק על קרדיטים וירטואליים לסימולציה. אין אפשרות להפקדות או משיכות כספיות.',
    complianceCertItem2: 'איסור שימוש בזמן אמת בקזינו (RTA): כל מנועי הסימולציה מיועדים למחקר לא מקוון, ביקורת מתמטית ואימון זיכרון אישי.',
    complianceCertItem3: 'תאימות ל-App Store 5.3.4 ו-Google Play: מסווג כסימולטור משחקים כמותי וכלי לניתוח סטטיסטי.',
    complianceMathTitle: 'סיווג מתמטי של משחקים',
    complianceMathMemorylessTitle: 'משחקים חסרי זיכרון (אירועים בלתי תלויים):',
    complianceMathMemorylessBody: 'רולטה, קראפס, סיק בו ומכונות מזל רגילות. ההסתברות לכל תוצאה זהה לחלוטין בכל סיבוב: P(X_t|X_1..X_t-1) = P(X_t). שום תוכנה לא יכולה להעלים את יתרון הבית.',
    complianceMathDependentTitle: 'משחקים מבוססי מצב וזיכרון (אירועים תלויים):',
    complianceMathDependentBody: 'בלאק ג\'ק מחבילה מרובה (דגימה ללא החזרה), פוקר שחקן נגד שחקן (תורת המשחקים CFR+) ומכונות Must-Hit-By מכילים ספי מצב מתמטיים שמניבים תוחלת חיובית (+EV).',
    complianceAckBtn: 'הבנתי ומאשר/ת',

    // Feature Guide Modal
    guideHeader: 'קודקס היתרון הסטטיסטי ומדריכים מתמטיים',
    guideSub: 'מדריכים טקטיים אינטראקטיביים, נוסחאות תוחלת רווח ונהלי פעולה מדויקים.',
    guideSearchPlaceholder: 'חיפוש מדריכים (למשל: היי-לו, Must-Hit-By, קלי, MDF)...',
    guideSearchClear: 'נקה',
    guideCatAll: 'כל הכלים',
    guideCatBlackjack: 'בלאק ג\'ק והיי-לו',
    guideCatRoulette: 'רולטה ופיזיקה',
    guideCatSlots: 'מכונות (Must-Hit-By)',
    guideCatPoker: 'פוקר GTO וסיכויי קופה',
    guideCatKelly: 'קלי וניהול בנקרוול',
    guideCatDrills: 'אימוני שולחן חיים',
    guideCatRouletteSys: 'מערכות רולטה',
    guideCatHub: 'ראשי ותקנון חוקי',
    guideCollapse: 'כווץ ▲',
    guideDetails: 'פרטים ▼',
    guideWhatItDoes: 'מה הכלי הייחודי הזה עושה',
    guideHowToUse: 'כיצד לפעול בקזינו או באימונים',
    guideMathPrinciple: 'עקרון מתמטי',
    guideExactProof: 'הוכחה מדויקת',
    guideProAdvice: 'טיפ מקצועי:',
    guideOpenFeature: 'פתח כלי',
    guideDoneReading: 'סיימתי לקרוא',
    guideOfflineNotice: 'מאמן מתמטי לא מקוון לחלוטין • ללא תלות בשרתים חיצוניים',
    guideNoMatches: 'לא נמצאו כלים התואמים לחיפוש',
    guideTrySearching: 'נסה לחפש "קלי", "MHB", "סטיות" או "סיכויים".',

    // Bankroll Setup Modal
    bankrollSetupTitle: 'הגדרת בנקרוול לאימון',
    bankrollSetupSub: 'בחר את סכום הפתיחה לאימון. כל החלטה מסכנת קרדיטים אמיתיים בהימורים חיים. הכפל את הערימה בדיוק מתמטי או התמודד עם תחקיר טעויות מלא במקרה של פשיטת רגל!',
    bankrollStackLabel: 'ערימת פתיחה לאימון',
    bankrollCreditsUnit: 'קרדיטים 🪙',
    bankrollEquates: 'שווה ערך ל-',
    bankrollStdBets: 'הימורים רגילים של 25$',
    bankrollSelectPreset: 'בחר סכום פתיחה מוכן:',
    bankrollCustomAmount: 'סכום מותאם אישית:',
    bankrollRulesTitle: 'חוקי אימון והישרדות:',
    bankrollRule1: 'כל אימון מנכה קרדיטים לפי גודל ההימור, ומזכה בזכיות בעת ניצחון.',
    bankrollRule2: 'אם תגיע ל-0 קרדיטים, האימון ייעצר מיד עם תחקיר טעויות מלא.',
    bankrollRule3: 'ניתן ללחוץ על "פדה זכיות" בכל עת כדי לנעול רווחים ולסקור את הביצועים שלך.',
    bankrollStartBtn: 'התחל אימון עם',
    bankrollCancel: 'ביטול / השאר נוכחי',
    bankrollReturnHub: 'חזרה למסך הראשי',

    // Drill Summary Modal
    summaryBusted: 'הבנקרוול אזל - פשיטת רגל!',
    summaryCashedOut: 'האימון נפדה בהצלחה',
    summaryStart: 'התחלה:',
    summaryEnd: 'סיום:',
    summaryRoi: 'תשואה (ROI)',
    summaryTier: 'דירוג מיומנות:',
    summaryLostMost: 'איפה הפסדת הכי הרבה',
    summaryWonMost: 'היתרון הרווחי ביותר',
    summaryAutopsy: 'תחקיר טעויות ודליפות תוחלת (EV)',
    summaryRestart: 'התחל מחדש',
    summaryBackHub: 'חזרה למסך הראשי',
    summaryAllGames: 'כל המשחקים',
    summaryNoMistakes: 'סשן ללא רבב! לא תועדו טעויות תוחלת מתמטיות.',

    // Drill Simulation UI
    simLiveRouletteTitle: 'סימולציית שולחן רולטה חיה',
    simLiveRouletteSub: 'הצב ז\'יטונים אמיתיים על לוח הלבד, סובב את הגלגל והתנסה בפיזיקת קזינו אותנטית',
    simActiveFelt: 'לוח לבד פעיל',
    simZeroToHeroBtn: 'מדריך: מאפס למקצוען',
    simPhysicsEngine: 'מנוע פיזיקת גלגל',
    simResult: 'תוצאה:',
    simZero: 'אפס (ZERO)',
    simEven: 'זוגי',
    simOdd: 'אי-זוגי',
    simRecentSpins: 'סיבובי גלגל אחרונים',
    simSpinsLogged: 'סיבובים מתועדים',
    simNoSpinsYet: 'אין סיבובים עדיין. הצב הימורים ולחץ סובב גלגל.',
    simWinningHits: 'פגיעות זוכות:',
    simSpinWheel: 'סובב גלגל',
    simClearBets: 'נקה הימורים',
    simDouble: 'הכפל',
    simRebet: 'הימור חוזר',

    // Additional Roulette & Table labels
    advPlayTelemetry: 'טלמטריית יתרון סטטיסטי',
    tableFeltBettingSpot: 'אזור הצבת הימורים על הלבד',
    clickAnyNumberHelp: '(לחץ על מספר או אזור להצבת ז\'יטונים)',
    totalWagerLabel: 'סך הכל הימור',
    spinningWheel: 'הגלגל מסתובב...',
    placeBetsToSpin: 'הצב הימורים כדי לסובב',

    // Additional Summary Modal labels
    summaryCreditsSuffix: 'קרדיטים 🪙',
    summaryLost: 'הפסד',
    summaryYourAction: 'החלטה שלך',
    summaryGtoOptimal: 'אופטימלי לפי GTO',
    summaryWon: 'רווח',
    summaryNoWins: 'עדיין לא תועדו מהלכים רווחיים משמעותיים.',
    summaryTelemetryHeader: 'מדדים ומיומנות לפי משחק',
    summaryRounds: 'סיבובים',
    summaryAccuracy: 'דיוק',
    summaryAutopsyHeader: 'תחקיר טעויות (זוהו {count} דליפות)',
    summaryFilterAll: 'הכל',
    summaryNoMistakesCat: 'אין טעויות בקטגוריה זו!',
    summaryStartNewBtn: 'התחל אימון חדש',
    summaryResumePlay: 'המשך משחק',
    summaryCloseAutopsy: 'סגור תחקיר',
    summaryHub: 'ראשי',

    // Slot Machine Drill
    gridLabel: 'רשת:',
    evBreachDetected: 'זוהה יתרון חיובי +EV',
    evSubThreshold: '-EV מתחת לסף הכדאיות',
    mustHitByCap: 'תקרת חובה MUST-HIT-BY',
    currentProgressiveMeter: 'מד ג\'קפוט פרוגרסיבי נוכחי',
    distanceToCap: 'מרחק לתקרה ΔJ',
    breakEvenThresholdLabel: 'סף רווחיות',
    capLabel: 'תקרה',
    formatLabel: 'פורמט',
    reelsRowsFormat: 'פורמט: {cols} גלגלים × {rows} שורות',
    activePaylinesLabel: 'קווי תשלום פעילים',
    paylineWinLabel: 'זכייה בקו תשלום!',
    mustHitByTriggeredLabel: 'ג\'קפוט חובה הופעל!',
    casinoFloorCall: 'החלטת רצפת קזינו: האם למכונה יתרון חיובי (+EV) או מלכודת קזינו (-EV)?',
    betLabel: 'הימור',
    attackMachineBtn: 'תקוף מכונה (+EV)',
    walkAwayPassBtn: 'התרחק ועבור הלאה (-EV)',
    spinGridBtn: 'סובב רשת',
    spinningStatus: 'מסתובב...',
    scoutBonus: '+50 קרדיטים בונוס סריקה',
    leakPenalty: '-50 קרדיטים קנס דליפה',
    nextMachineBtn: 'המכונה הבאה',
    machineLabel: 'מכונה',
    scoutingMachineCount: 'סורק מכונה',

    // Blackjack Lab & Table
    tabCasinoTable: 'שולחן קזינו',
    tabStrategyMatrix: 'מטריצת אסטרטגיה',
    tabHowItWorks: 'איך זה עובד',
    hideCountHud: 'הסתר מד ספירה',
    showCountHud: 'הצג מד ספירה',
    advisorOn: 'יועץ פעיל',
    advisorOff: 'יועץ כבוי',
    runningCount: 'ספירה רצה',
    decksRemaining: 'חפיסות שנותרו',
    trueCount: 'ספירה אמיתית',
    playerEdge: 'יתרון שחקן',
    dealerTotal: 'סך הכל דילר',
    playerTotal: 'סך הכל שחקן',
    betToDeal: 'הימור לחלוקה',
    clearBet: 'נקה הימור',
    dealHand: 'חלק קלפים',
    doubleBet: 'הימור כפול (2X)',
    gtoAdvisorRec: 'המלצת יועץ GTO',
    matrixTitle: 'מטריצת אסטרטגיה בסיסית (6 חפיסות, S17)',
    matrixSubtitle: 'מטריצת ההחלטות המוכחת מתמטית לכל שילוב בין יד השחקן לקלף הדילר.',

    // Card Counting Academy
    countingAcademyTitle: 'אקדמיית ספירת קלפים (מאפס למקצוען)',
    countingAcademySubtitle: 'שלוט במערכת הספירה המתמטית המדויקת שהופכת את יתרון הקזינו לטובתך',
    tabSecret: '0. הסוד',
    tabHiLo: '1. היי-לו',
    tabTrueCount: '2. ספירה אמיתית',
    tabBetSpread: '3. פיזור הימורים',
    tabPractice: '⚡ תרגול מעשי',
    whatIsCardTag: 'מהו ערך היי-לו (Hi-Lo) של קלף זה?',
    resetShoe: 'איפוס סוללה',
    streakLabel: 'רצף'
  }
};
