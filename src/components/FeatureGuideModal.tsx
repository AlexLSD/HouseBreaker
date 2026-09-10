import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  CircleDot,
  Coins,
  Compass,
  Cpu,
  Flame,
  Gamepad2,
  Grid,
  HelpCircle,
  History,
  Info,
  Layers,
  Percent,
  Search,
  Shield,
  Sparkles,
  Trophy,
  X,
  Zap
} from 'lucide-react';

interface FeatureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
  initialCategory?: string;
}

interface FeatureItem {
  id: string;
  tabId: string;
  category: 'blackjack' | 'roulette' | 'slots' | 'poker' | 'bankroll' | 'drills' | 'general';
  title: string;
  tagline: string;
  edgeRating: string;
  edgeType: 'positive' | 'protection' | 'training';
  icon: React.ComponentType<{ className?: string }>;
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

const UNIQUE_FEATURES: FeatureItem[] = [
  {
    id: 'f-blackjack',
    tabId: 'blackjack',
    category: 'blackjack',
    title: 'Blackjack Strategy Matrix & Hi-Lo Counting Lab',
    tagline: 'Interactive felt table, shoe penetration telemetry, Hi-Lo running/true count HUD, and Illustrious 18 deviation engine.',
    edgeRating: '+1.5% to +2.5% Player Edge',
    edgeType: 'positive',
    icon: Shield,
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
    icon: CircleDot,
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
    icon: Grid,
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
    icon: Calculator,
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
    icon: Coins,
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
    icon: Flame,
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
    icon: Compass,
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
    icon: Trophy,
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
    icon: Shield,
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
];

export const FeatureGuideModal: React.FC<FeatureGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  initialCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>('f-roulette');

  if (!isOpen) return null;

  // Filter features
  const filteredFeatures = UNIQUE_FEATURES.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.whatItDoes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mathPrinciple.formulaName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Modules (8)' },
    { id: 'blackjack', label: 'Blackjack & Counting' },
    { id: 'roulette', label: 'Roulette Suite & Systems' },
    { id: 'slots', label: 'Slot Break-Even' },
    { id: 'poker', label: 'Poker Odds & GTO' },
    { id: 'bankroll', label: 'Kelly Bankroll' },
    { id: 'drills', label: 'Reflex Drills' },
    { id: 'general', label: 'Hub & Legal' }
  ];

  const handleLaunch = (tabId: string) => {
    onNavigateTab(tabId);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feature-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#03060A]/85 backdrop-blur-md animate-fade-in font-sans-arcade"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0A0E17] border-2 border-[#F59E0B]/50 rounded-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-[#121826] via-[#172033] to-[#0F1420] border-b-2 border-[#24334C] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="feature-guide-title" className="text-base sm:text-lg font-bold font-arcade tracking-wider text-white">
                  HouseBreaker Feature & Advantage Guide
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono-telemetry border border-amber-500/40 font-bold hidden sm:inline">
                  OFFICIAL MANUAL
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Comprehensive explanation of all unique advantage play tools, formulas, and floor usage.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#141E30] hover:bg-[#1E2D4A] text-slate-300 hover:text-white transition-colors cursor-pointer border border-[#253655]"
            title="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-3 sm:p-4 bg-[#070A12] border-b border-[#1E2C44] space-y-2.5 shrink-0">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search features (e.g., 'deviation', 'true count', 'Kelly', 'MHB break-even', 'pot odds')..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0E1524] border border-[#23334E] text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-amber-400/80 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-arcade scrollbar-thin">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#0A0D14] font-bold shadow-md'
                    : 'bg-[#121B2B] text-slate-300 hover:bg-[#1A263C] border border-[#22314A]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Feature Cards Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {filteredFeatures.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-slate-400">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto opacity-60" />
              <p className="text-sm font-arcade">No matching features found for "{searchQuery}".</p>
              <p className="text-xs text-slate-500">Try searching for "Kelly", "MHB", "deviations", or "odds".</p>
            </div>
          ) : (
            filteredFeatures.map(feat => {
              const Icon = feat.icon;
              const isExpanded = expandedFeatureId === feat.id;

              return (
                <div
                  key={feat.id}
                  className="rounded-2xl bg-[#0E1524] border-2 border-[#22324E] hover:border-[#354B74] transition-all shadow-lg overflow-hidden"
                >
                  {/* Summary Bar */}
                  <div
                    onClick={() => setExpandedFeatureId(isExpanded ? null : feat.id)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-[#131C30] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl border shrink-0 ${feat.accentColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold font-arcade tracking-wide text-white">
                            {feat.title}
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#182338] text-amber-300 border border-[#2B3C5C] font-mono-telemetry font-semibold">
                            {feat.badgeText}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {feat.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1C273C]">
                      <span className={`text-[11px] font-bold font-mono-telemetry px-2.5 py-1 rounded-lg border ${
                        feat.edgeType === 'positive'
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                          : 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40'
                      }`}>
                        {feat.edgeRating}
                      </span>
                      <span className="text-xs text-slate-400 font-arcade">
                        {isExpanded ? 'Collapse ▲' : 'Details ▼'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Detailed Breakdown */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-[#080D17] border-t-2 border-[#1C2A40] space-y-4 text-xs animate-fade-in">
                      {/* What It Does */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold font-arcade text-amber-300 uppercase tracking-wider block">
                          WHAT THIS UNIQUE FEATURE DOES
                        </span>
                        <p className="text-slate-200 text-xs sm:text-[13px] leading-relaxed font-sans-arcade">
                          {feat.whatItDoes}
                        </p>
                      </div>

                      {/* Step-by-Step Practical Usage */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold font-arcade text-amber-300 uppercase tracking-wider block">
                          HOW TO OPERATE ON THE CASINO FLOOR OR IN PRACTICE
                        </span>
                        <div className="space-y-1.5">
                          {feat.howToUse.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-slate-300 leading-relaxed">
                              <span className="w-5 h-5 rounded-full bg-[#172236] border border-[#283854] text-amber-400 font-bold font-mono-telemetry flex items-center justify-center shrink-0 text-[10px]">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* The Mathematical Principle / Formula */}
                      <div className="p-3.5 rounded-2xl bg-[#0E1524] border border-[#243552] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold font-arcade text-cyan-300 uppercase tracking-wider">
                            MATHEMATICAL PRINCIPLE: {feat.mathPrinciple.formulaName}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono-telemetry font-bold">EXACT PROOF</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-[#060A12] border border-[#1E2B42] text-amber-300 font-mono-telemetry text-xs font-bold">
                          {feat.mathPrinciple.formula}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed pt-0.5">
                          {feat.mathPrinciple.explanation}
                        </p>
                      </div>

                      {/* Pro Tip & Direct Action */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#1C273C]">
                        <div className="flex items-start gap-2 text-[11px] text-amber-200/90 leading-relaxed">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span><strong>Pro Advice:</strong> {feat.proTip}</span>
                        </div>

                        <button
                          onClick={() => handleLaunch(feat.tabId)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] text-[#0A0D14] font-arcade font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
                        >
                          OPEN FEATURE <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-3 sm:p-4 bg-[#070A12] border-t-2 border-[#1E2C44] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px]">Strictly offline math trainer • Free from external server dependencies</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#141F32] hover:bg-[#1E2F4C] text-slate-200 text-xs font-arcade font-semibold transition-colors cursor-pointer border border-[#253655] self-end sm:self-auto"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
};
