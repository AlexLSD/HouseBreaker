export type RouletteVariant = 'EUROPEAN' | 'FRENCH' | 'AMERICAN';

export type RoulettePocket = number | '00';

export interface PocketInfo {
  readonly value: RoulettePocket;
  readonly color: 'red' | 'black' | 'green';
  readonly isEven?: boolean;
  readonly isHigh?: boolean; // 19-36
  readonly dozen?: 1 | 2 | 3;
  readonly column?: 1 | 2 | 3;
}

export const EUROPEAN_WHEEL_ORDER: RoulettePocket[] = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

export const AMERICAN_WHEEL_ORDER: RoulettePocket[] = [
  0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, '00', 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2
];

export const RED_NUMBERS = new Set<number>([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
]);

export function getPocketInfo(pocket: RoulettePocket): PocketInfo {
  if (pocket === 0 || pocket === '00') {
    return {
      value: pocket,
      color: 'green'
    };
  }

  const num = Number(pocket);
  const color = RED_NUMBERS.has(num) ? 'red' : 'black';
  const isEven = num % 2 === 0;
  const isHigh = num >= 19;
  const dozen = num <= 12 ? 1 : num <= 24 ? 2 : 3;
  const column = ((num - 1) % 3 + 1) as 1 | 2 | 3;

  return {
    value: pocket,
    color,
    isEven,
    isHigh,
    dozen,
    column
  };
}

export type BetType =
  | 'STRAIGHT_UP'
  | 'SPLIT'
  | 'STREET'
  | 'CORNER'
  | 'SIX_LINE'
  | 'DOZEN'
  | 'COLUMN'
  | 'RED'
  | 'BLACK'
  | 'EVEN'
  | 'ODD'
  | 'LOW'
  | 'HIGH'
  | 'BASKET';

export interface RouletteBet {
  readonly id: string;
  readonly type: BetType;
  readonly label: string;
  readonly amount: number;
  readonly coveredNumbers: RoulettePocket[];
  readonly payoutRatio: number; // e.g. 35 for 35:1
}

export interface SpinResult {
  readonly winningPocket: PocketInfo;
  readonly totalWagered: number;
  readonly totalPayout: number;
  readonly netProfit: number;
  readonly winningBets: { bet: RouletteBet; winAmount: number }[];
  readonly laPartageRefund: number;
}

export function evaluateSpin(
  winningPocket: RoulettePocket,
  bets: RouletteBet[],
  variant: RouletteVariant = 'EUROPEAN'
): SpinResult {
  const pocketInfo = getPocketInfo(winningPocket);
  let totalWagered = 0;
  let totalPayout = 0;
  let laPartageRefund = 0;
  const winningBets: { bet: RouletteBet; winAmount: number }[] = [];

  bets.forEach(bet => {
    totalWagered += bet.amount;
    const isWinner = bet.coveredNumbers.includes(winningPocket);

    if (isWinner) {
      // Payout is original wager returned + profit (payoutRatio * wager)
      const winProfit = bet.amount * bet.payoutRatio;
      const returnedAmount = bet.amount + winProfit;
      totalPayout += returnedAmount;
      winningBets.push({ bet, winAmount: returnedAmount });
    } else {
      // Check French La Partage: even money bets get 50% refund when 0 hits
      if (
        variant === 'FRENCH' &&
        winningPocket === 0 &&
        ['RED', 'BLACK', 'EVEN', 'ODD', 'LOW', 'HIGH'].includes(bet.type)
      ) {
        const refund = Math.floor(bet.amount * 0.5);
        laPartageRefund += refund;
        totalPayout += refund;
      }
    }
  });

  return {
    winningPocket: pocketInfo,
    totalWagered,
    totalPayout,
    netProfit: totalPayout - totalWagered,
    winningBets,
    laPartageRefund
  };
}

export interface MonteCarloSpinHistory {
  readonly spinIndex: number;
  readonly winningNumber: RoulettePocket;
  readonly betAmount: number;
  readonly balance: number;
}

export interface MonteCarloSimulationResult {
  readonly strategyName: string;
  readonly totalSpins: number;
  readonly startBalance: number;
  readonly endBalance: number;
  readonly peakBalance: number;
  readonly minBalance: number;
  readonly maxDrawdown: number;
  readonly bankruptcyIndex: number | null;
  readonly history: MonteCarloSpinHistory[];
}

export function runRouletteStrategySim(
  strategy: 'FLAT' | 'MARTINGALE' | 'REVERSE_MARTINGALE' | 'DALEMBERT' | 'FIBONACCI',
  variant: RouletteVariant = 'EUROPEAN',
  numSpins: number = 500,
  initialBankroll: number = 1000,
  baseUnit: number = 10,
  tableLimit: number = 1000
): MonteCarloSimulationResult {
  const wheel = variant === 'AMERICAN' ? AMERICAN_WHEEL_ORDER : EUROPEAN_WHEEL_ORDER;
  let currentBalance = initialBankroll;
  let peakBalance = initialBankroll;
  let minBalance = initialBankroll;
  let maxDrawdown = 0;
  let bankruptcyIndex: number | null = null;

  const history: MonteCarloSpinHistory[] = [];

  // Betting state
  let currentBet = baseUnit;
  const fibSequence = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377];
  let fibIndex = 0;

  for (let i = 1; i <= numSpins; i++) {
    if (currentBalance <= 0) {
      if (bankruptcyIndex === null) bankruptcyIndex = i;
      break;
    }

    // Cap bet at table limit and available balance
    let betAmount = Math.min(currentBet, tableLimit, currentBalance);
    if (betAmount <= 0) {
      if (bankruptcyIndex === null) bankruptcyIndex = i;
      break;
    }

    currentBalance -= betAmount;

    // Random spin
    const winningPocket = wheel[Math.floor(Math.random() * wheel.length)];
    const pocketInfo = getPocketInfo(winningPocket);

    // Standard even money test on RED
    const isWin = pocketInfo.color === 'red';
    let isRefund = false;

    if (isWin) {
      currentBalance += betAmount * 2;
    } else if (variant === 'FRENCH' && winningPocket === 0) {
      // La Partage refund
      currentBalance += Math.floor(betAmount * 0.5);
      isRefund = true;
    }

    // Update drawdown
    if (currentBalance > peakBalance) peakBalance = currentBalance;
    if (currentBalance < minBalance) minBalance = currentBalance;
    const dd = peakBalance - currentBalance;
    if (dd > maxDrawdown) maxDrawdown = dd;

    history.push({
      spinIndex: i,
      winningNumber: winningPocket,
      betAmount,
      balance: currentBalance
    });

    // Progression logic
    if (strategy === 'FLAT') {
      currentBet = baseUnit;
    } else if (strategy === 'MARTINGALE') {
      if (isWin) {
        currentBet = baseUnit;
      } else {
        currentBet = isRefund ? currentBet : currentBet * 2;
      }
    } else if (strategy === 'REVERSE_MARTINGALE') {
      if (isWin) {
        currentBet = Math.min(currentBet * 2, baseUnit * 8); // Reset after 3 consecutive wins
      } else {
        currentBet = baseUnit;
      }
    } else if (strategy === 'DALEMBERT') {
      if (isWin) {
        currentBet = Math.max(baseUnit, currentBet - baseUnit);
      } else {
        currentBet = currentBet + baseUnit;
      }
    } else if (strategy === 'FIBONACCI') {
      if (isWin) {
        fibIndex = Math.max(0, fibIndex - 2);
        currentBet = baseUnit * fibSequence[fibIndex];
      } else {
        fibIndex = Math.min(fibSequence.length - 1, fibIndex + 1);
        currentBet = baseUnit * fibSequence[fibIndex];
      }
    }
  }

  return {
    strategyName: strategy,
    totalSpins: history.length,
    startBalance: initialBankroll,
    endBalance: currentBalance,
    peakBalance,
    minBalance,
    maxDrawdown,
    bankruptcyIndex,
    history
  };
}
