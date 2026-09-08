/**
 * Quantitative Platform Architecture Core Data Schema
 * Compliant with mathematical specification for multi-seat game & massive slot state machine.
 */

export type CardRank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';
export type CardSuit = 'h' | 'd' | 'c' | 's';

export interface CardBitfield {
  readonly rank: CardRank;
  readonly suit: CardSuit;
  readonly primeValue: number;
  readonly bitmask: bigint;
}

export interface PlayerSeatState {
  readonly seatIndex: number;
  readonly isOccupied: boolean;
  readonly stackDepthBB: number;
  readonly currentWager: number;
  readonly activeCards: CardBitfield[];
  readonly assignedRangeId: string | null;
  readonly isHero: boolean;
  readonly positionName: string; // UTG, MP, HJ, CO, BTN, SB, BB
  readonly vpip: number;
  readonly pfr: number;
  readonly threeBet: number;
}

export interface SlotSymbolDefinition {
  readonly id: number;
  readonly name: string;
  readonly symbol: string;
  readonly baseMultiplier: number[]; // Index maps to cluster size or match count
  readonly isScatter: boolean;
  readonly isWild: boolean;
  readonly colorHex: string;
}

export interface SlotGridConfig {
  readonly rows: number;            // 3 to 40
  readonly cols: number;            // 3 to 40
  readonly payMechanism: 'CLUSTER' | 'SCATTER_ANYWHERE' | 'PAYLINES';
  readonly minClusterSize: number;  // Default: 5
  readonly symbols: SlotSymbolDefinition[];
  readonly progressiveCap?: number;
  readonly progressiveCurrent?: number;
  readonly meterContributionRate?: number;
  readonly baseRTP: number;
}

export interface SlotWinningCluster {
  readonly symbolId: number;
  readonly symbolName: string;
  readonly nodeCoordinates: [number, number][];
  readonly payoutMultiplier: number;
  readonly payoutAmount: number;
}

export interface SlotSpinCycleResult {
  readonly initialGrid: number[][]; // [row][col] symbol IDs (up to 40x40)
  readonly finalGrid: number[][];
  readonly winningClusters: SlotWinningCluster[];
  readonly cascadeDepth: number;
  readonly totalMultiplier: number;
  readonly progressiveWon: boolean;
  readonly progressivePayout: number;
}

export interface ShoeState {
  readonly initialDecks: number;
  readonly cardsRemaining: number;
  readonly runningCount: number;
  readonly trueCount: number;
  readonly penetration: number; // 0.0 to 1.0
  readonly rankFrequencies: Record<CardRank, number>;
}

export interface TableStatePayload {
  readonly gameType: 'TEXAS_HOLDEM' | 'OMAHA' | 'BLACKJACK' | 'CRAPS' | 'BACCARAT' | 'SLOTS_GRID';
  readonly variantParameters: Record<string, number | boolean | string>;
  readonly activeShoe?: ShoeState;
  readonly slotConfig?: SlotGridConfig;
  readonly tableSeats: PlayerSeatState[];
  readonly communityBoard?: CardBitfield[];
  readonly aggregatePot: number;
  readonly activeActionSeat: number;
  readonly calculationTimestamp: number;
}

export interface DecisionAdvice {
  readonly primaryAction: string;
  readonly actionType: 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT' | 'SURRENDER' | 'FOLD' | 'CALL' | 'RAISE' | 'CHECK';
  readonly ev: number;
  readonly isDeviation: boolean;
  readonly deviationReason?: string;
  readonly basicStrategyAction?: string;
  readonly gtoFrequencies?: { action: string; frequency: number; ev: number }[];
  readonly mdf?: number;
  readonly potOdds?: number;
  readonly playerAdvantage: number; // percentage, e.g. +1.2%
}

export interface KellyBetRecommendation {
  readonly trueCount: number;
  readonly playerAdvantage: number;
  readonly optimalKellyFraction: number;
  readonly suggestedBetAmount: number;
  readonly chipUnits: number;
  readonly isSitOut: boolean;
}

export interface DrawdownSimulationPoint {
  readonly hour: number;
  readonly median: number;
  readonly upper1Sigma: number;
  readonly lower1Sigma: number;
  readonly upper2Sigma: number;
  readonly lower2Sigma: number;
}

export interface DrillQuestion {
  readonly id: string;
  readonly category: 'TRUE_COUNT' | 'STRATEGY_DEVIATION' | 'MHB_BREAKEVEN' | 'RANGE_MDF' | 'LEAK_DETECTION';
  readonly title: string;
  readonly scenarioText: string;
  readonly timeLimitSeconds: number;
  readonly options: { id: string; label: string; isCorrect: boolean; evDelta?: number }[];
  readonly explanation: string;
  readonly telemetryContext?: Record<string, string | number>;
}

export interface SessionHistoryItem {
  readonly id: string;
  readonly timestamp: number;
  readonly gameType: string;
  readonly decisionTaken: string;
  readonly optimalDecision: string;
  readonly evDelta: number; // in $ or BB
  readonly errorCategory: 'Index Violation' | 'Basic Strategy Mistake' | 'MDF Over-Fold' | 'Sub-Optimal MHB Slot Entry' | 'Improper Bet Sizing' | 'None (Optimal)';
  readonly notes: string;
  readonly wasOptimal: boolean;
}
