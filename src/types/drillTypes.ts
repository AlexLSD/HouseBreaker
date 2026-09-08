export type DrillGameMode = 'BLACKJACK' | 'SLOTS' | 'POKER' | 'ROULETTE';

export interface DrillMistake {
  id: string;
  game: DrillGameMode;
  scenarioName: string;
  userDecision: string;
  expectedDecision: string;
  creditsLost: number;
  explanation: string;
  timestamp: number;
}

export interface DrillEarning {
  id: string;
  game: DrillGameMode;
  scenarioName: string;
  creditsWon: number;
  reason: string;
  timestamp: number;
}

export interface GamePerformanceMetric {
  handsPlayed: number;
  correctDecisions: number;
  creditsWagered: number;
  creditsWon: number;
  creditsLost: number;
  netCredits: number;
}

export interface SessionSummaryData {
  initialCredits: number;
  finalCredits: number;
  netCredits: number;
  totalHandsOrSpins: number;
  totalCorrect: number;
  overallAccuracy: number;
  isBusted: boolean;
  gameMetrics: Record<DrillGameMode, GamePerformanceMetric>;
  mistakes: DrillMistake[];
  earnings: DrillEarning[];
  worstLeakGame: DrillGameMode | null;
  worstSingleMistake: DrillMistake | null;
  mostProfitableGame: DrillGameMode | null;
  skillRank: {
    title: string;
    grade: string;
    badgeColor: string;
    description: string;
  };
}
