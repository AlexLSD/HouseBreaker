export type DrillGameType = 'BLACKJACK' | 'POKER' | 'ROULETTE' | 'SLOTS';

export interface ProfileRoundRecord {
  id: string;
  timestamp: number;
  game: DrillGameType;
  outcome: 'WIN' | 'LOSS' | 'PUSH';
  wager: number;
  payout: number;
  netChange: number; // positive for win, negative for loss
  runningBankroll: number;
  description: string;
}

export interface ProfileMistakeRecord {
  id: string;
  timestamp: number;
  game: DrillGameType;
  scenarioName: string;
  userDecision: string;
  expectedDecision: string;
  cost: number;
  explanation: string;
}

export interface GameProficiency {
  game: DrillGameType;
  roundsPlayed: number;
  wins: number;
  losses: number;
  pushes: number;
  correctDecisions: number;
  mistakesCount: number;
  totalWagered: number;
  totalPayout: number;
  netProfit: number;
  accuracyRate: number; // percentage
  winRate: number; // percentage
  score: number; // calculated composite strength score 0-100
}

export interface UserProfileData {
  nickname: string;
  onboardingCompleted: boolean;
  preferredLanguage?: string;
  createdAt: number;
  lastActive: number;
  initialBankroll: number;
  currentBankroll: number;
  totalWagered: number;
  totalWon: number;
  totalLost: number;
  netProfit: number;
  roundsPlayed: number;
  winCount: number;
  lossCount: number;
  pushCount: number;
  history: ProfileRoundRecord[];
  mistakes: ProfileMistakeRecord[];
}

const STORAGE_KEY = 'housebreaker_user_profile_v2';

// Clean initial profile without fictional data
const createInitialProfile = (): UserProfileData => {
  const now = Date.now();
  return {
    nickname: '',
    onboardingCompleted: false,
    createdAt: now,
    lastActive: now,
    initialBankroll: 2500,
    currentBankroll: 2500,
    totalWagered: 0,
    totalWon: 0,
    totalLost: 0,
    netProfit: 0,
    roundsPlayed: 0,
    winCount: 0,
    lossCount: 0,
    pushCount: 0,
    history: [],
    mistakes: []
  };
};

export function updateUserNickname(nickname: string, lang?: string): UserProfileData {
  const profile = loadUserProfile();
  profile.nickname = nickname.trim() || 'Player 1';
  profile.onboardingCompleted = true;
  if (lang) {
    profile.preferredLanguage = lang;
  }
  saveUserProfile(profile);
  return profile;
}

export function loadUserProfile(): UserProfileData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.history) && Array.isArray(parsed.mistakes)) {
        // Strip out any previous fictional mock records that start with 'init-'
        const cleanedHistory: ProfileRoundRecord[] = parsed.history.filter(
          (h: ProfileRoundRecord) => h && h.id && !h.id.startsWith('init-')
        );
        const cleanedMistakes: ProfileMistakeRecord[] = parsed.mistakes.filter(
          (m: ProfileMistakeRecord) => m && m.id && !m.id.startsWith('mistake-init-')
        );

        // If history contained mock entries, recalculate genuine metrics without destroying user identity
        if (cleanedHistory.length === 0) {
          const fresh = createInitialProfile();
          fresh.nickname = typeof parsed.nickname === 'string' ? parsed.nickname : '';
          fresh.onboardingCompleted = Boolean(parsed.onboardingCompleted);
          fresh.preferredLanguage = parsed.preferredLanguage || 'en';
          fresh.initialBankroll = typeof parsed.initialBankroll === 'number' && parsed.initialBankroll > 0 ? parsed.initialBankroll : 2500;
          fresh.currentBankroll = fresh.initialBankroll;
          saveUserProfile(fresh);
          return fresh;
        }

        parsed.nickname = typeof parsed.nickname === 'string' ? parsed.nickname : '';
        parsed.onboardingCompleted = Boolean(parsed.onboardingCompleted);
        parsed.preferredLanguage = parsed.preferredLanguage || 'en';
        parsed.history = cleanedHistory;
        parsed.mistakes = cleanedMistakes;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to read user profile from storage', err);
  }

  const initial = createInitialProfile();
  saveUserProfile(initial);
  return initial;
}

export function saveUserProfile(data: UserProfileData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to write user profile to storage', err);
  }
}

export function recordProfileRound(
  game: DrillGameType,
  outcome: 'WIN' | 'LOSS' | 'PUSH',
  wager: number,
  payout: number,
  description: string
): UserProfileData {
  const profile = loadUserProfile();
  const netChange = outcome === 'WIN' ? payout - wager : outcome === 'LOSS' ? -wager : 0;
  const nextBankroll = Math.max(0, profile.currentBankroll + netChange);

  const newRecord: ProfileRoundRecord = {
    id: `round-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: Date.now(),
    game,
    outcome,
    wager,
    payout,
    netChange,
    runningBankroll: nextBankroll,
    description
  };

  profile.lastActive = Date.now();
  profile.currentBankroll = nextBankroll;
  profile.totalWagered += wager;
  profile.roundsPlayed += 1;

  if (outcome === 'WIN') {
    profile.winCount += 1;
    profile.totalWon += (payout - wager);
    profile.netProfit += (payout - wager);
  } else if (outcome === 'LOSS') {
    profile.lossCount += 1;
    profile.totalLost += wager;
    profile.netProfit -= wager;
  } else {
    profile.pushCount += 1;
  }

  // Keep last 150 rounds
  profile.history = [newRecord, ...profile.history].slice(0, 150);

  saveUserProfile(profile);
  return profile;
}

export function recordProfileMistake(
  game: DrillGameType,
  scenarioName: string,
  userDecision: string,
  expectedDecision: string,
  cost: number,
  explanation: string
): UserProfileData {
  const profile = loadUserProfile();

  const newMistake: ProfileMistakeRecord = {
    id: `mistake-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: Date.now(),
    game,
    scenarioName,
    userDecision,
    expectedDecision,
    cost,
    explanation
  };

  profile.lastActive = Date.now();
  profile.mistakes = [newMistake, ...profile.mistakes].slice(0, 100);

  saveUserProfile(profile);
  return profile;
}

export function clearUserProfile(): UserProfileData {
  const fresh: UserProfileData = {
    nickname: 'HouseBreakerPro',
    onboardingCompleted: true,
    preferredLanguage: 'en',
    createdAt: Date.now(),
    lastActive: Date.now(),
    initialBankroll: 2500,
    currentBankroll: 2500,
    totalWagered: 0,
    totalWon: 0,
    totalLost: 0,
    netProfit: 0,
    roundsPlayed: 0,
    winCount: 0,
    lossCount: 0,
    pushCount: 0,
    history: [],
    mistakes: []
  };
  saveUserProfile(fresh);
  return fresh;
}

export function computeGameProficiencies(profile: UserProfileData): Record<DrillGameType, GameProficiency> {
  const games: DrillGameType[] = ['BLACKJACK', 'POKER', 'ROULETTE', 'SLOTS'];
  const res: Record<DrillGameType, GameProficiency> = {
    BLACKJACK: {
      game: 'BLACKJACK',
      roundsPlayed: 0,
      wins: 0,
      losses: 0,
      pushes: 0,
      correctDecisions: 0,
      mistakesCount: 0,
      totalWagered: 0,
      totalPayout: 0,
      netProfit: 0,
      accuracyRate: 0,
      winRate: 0,
      score: 0
    },
    POKER: {
      game: 'POKER',
      roundsPlayed: 0,
      wins: 0,
      losses: 0,
      pushes: 0,
      correctDecisions: 0,
      mistakesCount: 0,
      totalWagered: 0,
      totalPayout: 0,
      netProfit: 0,
      accuracyRate: 0,
      winRate: 0,
      score: 0
    },
    ROULETTE: {
      game: 'ROULETTE',
      roundsPlayed: 0,
      wins: 0,
      losses: 0,
      pushes: 0,
      correctDecisions: 0,
      mistakesCount: 0,
      totalWagered: 0,
      totalPayout: 0,
      netProfit: 0,
      accuracyRate: 0,
      winRate: 0,
      score: 0
    },
    SLOTS: {
      game: 'SLOTS',
      roundsPlayed: 0,
      wins: 0,
      losses: 0,
      pushes: 0,
      correctDecisions: 0,
      mistakesCount: 0,
      totalWagered: 0,
      totalPayout: 0,
      netProfit: 0,
      accuracyRate: 0,
      winRate: 0,
      score: 0
    }
  };

  // Aggregate rounds
  for (const r of profile.history) {
    const p = res[r.game];
    if (!p) continue;
    p.roundsPlayed++;
    p.totalWagered += r.wager;
    p.totalPayout += r.payout;
    p.netProfit += r.netChange;
    if (r.outcome === 'WIN') p.wins++;
    else if (r.outcome === 'LOSS') p.losses++;
    else p.pushes++;
  }

  // Aggregate mistakes
  for (const m of profile.mistakes) {
    const p = res[m.game];
    if (p) {
      p.mistakesCount++;
    }
  }

  // Compute rates & scores
  for (const g of games) {
    const p = res[g];
    if (p.roundsPlayed > 0) {
      p.winRate = Math.round((p.wins / p.roundsPlayed) * 100);
      const totalEvaluated = p.roundsPlayed + p.mistakesCount;
      p.correctDecisions = Math.max(0, p.roundsPlayed - p.mistakesCount);
      p.accuracyRate = totalEvaluated > 0 ? Math.round((p.correctDecisions / totalEvaluated) * 100) : 100;

      // Composite score weighting accuracy (60%) and win rate (40%)
      p.score = Math.min(100, Math.max(10, Math.round(p.accuracyRate * 0.6 + p.winRate * 0.4)));
    } else {
      p.score = 50; // default baseline
      p.accuracyRate = 100;
    }
  }

  return res;
}

export interface FrequentMistakeAggregation {
  scenarioName: string;
  game: DrillGameType;
  count: number;
  totalCost: number;
  sampleExplanation: string;
  userDecision: string;
  expectedDecision: string;
}

export function computeFrequentMistakes(mistakes: ProfileMistakeRecord[]): FrequentMistakeAggregation[] {
  const map = new Map<string, FrequentMistakeAggregation>();

  for (const m of mistakes) {
    const key = `${m.game}::${m.scenarioName}`;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      existing.totalCost += m.cost;
    } else {
      map.set(key, {
        scenarioName: m.scenarioName,
        game: m.game,
        count: 1,
        totalCost: m.cost,
        sampleExplanation: m.explanation,
        userDecision: m.userDecision,
        expectedDecision: m.expectedDecision
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count || b.totalCost - a.totalCost);
}
