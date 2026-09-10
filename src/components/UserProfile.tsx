import React, { useState, useEffect, useMemo } from 'react';
import {
  UserProfileData,
  loadUserProfile,
  computeGameProficiencies,
  computeFrequentMistakes,
  clearUserProfile,
  DrillGameType,
  GameProficiency
} from '../utils/userProfileStorage';
import { useLanguage } from '../i18n/LanguageContext';
import { sounds } from '../utils/soundEffects';
import {
  AlertTriangle,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Coins,
  Download,
  Flame,
  LineChart,
  PieChart,
  RefreshCw,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
  XCircle,
  Zap
} from 'lucide-react';

interface UserProfileProps {
  onNavigateTab: (tabId: string) => void;
  onEditProfile?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onNavigateTab, onEditProfile }) => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfileData>(() => loadUserProfile());
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'history' | 'mistakes' | 'strengths' | 'financials'>('overview');
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('ALL');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  // Reload profile when tab activates
  useEffect(() => {
    setProfile(loadUserProfile());
  }, []);

  const proficiencies = useMemo(() => computeGameProficiencies(profile), [profile]);
  const frequentMistakes = useMemo(() => computeFrequentMistakes(profile.mistakes), [profile.mistakes]);

  // Determine strongest and weakest games
  const { strongest, weakest } = useMemo(() => {
    const list = (Object.values(proficiencies) as GameProficiency[]).filter(p => p.roundsPlayed > 0);
    if (list.length === 0) {
      return { strongest: null, weakest: null };
    }
    const sorted = [...list].sort((a, b) => b.score - a.score);
    return {
      strongest: sorted[0],
      weakest: sorted[sorted.length - 1]
    };
  }, [proficiencies]);

  // Filtered history
  const filteredHistory = useMemo(() => {
    if (selectedGameFilter === 'ALL') return profile.history;
    return profile.history.filter(h => h.game === selectedGameFilter);
  }, [profile.history, selectedGameFilter]);

  // Overall calculations
  const totalDecisions = profile.roundsPlayed + profile.mistakes.length;
  const overallAccuracy = totalDecisions > 0
    ? Math.round((Math.max(0, profile.roundsPlayed) / totalDecisions) * 100)
    : 100;
  const overallWinRate = profile.roundsPlayed > 0
    ? Math.round((profile.winCount / profile.roundsPlayed) * 100)
    : 0;
  const profitFactor = profile.totalLost > 0
    ? (profile.totalWon / profile.totalLost).toFixed(2)
    : profile.totalWon > 0
    ? '∞'
    : '0.00';

  const handleResetData = () => {
    sounds.playLoss();
    const fresh = clearUserProfile();
    setProfile(fresh);
    setShowResetConfirm(false);
  };

  const handleExportData = () => {
    sounds.playChip();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `housebreaker_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Generate Bankroll Performance SVG Chart points
  const chartData = useMemo(() => {
    const startAmount = Number(profile.initialBankroll) || 2500;
    const basePoint = {
      index: 0,
      roundNumber: 0,
      label: 'Start',
      bankroll: startAmount,
      netChange: 0,
      date: 'Baseline',
      outcome: 'BASE',
      game: 'Initial Stack'
    };

    if (!profile.history || profile.history.length === 0) {
      return [basePoint];
    }

    // Oldest to newest
    const chronological = [...profile.history].reverse();
    const points = chronological.map((h, i) => ({
      index: i + 1,
      roundNumber: i + 1,
      label: `R${i + 1}`,
      bankroll: Number(h.runningBankroll) || startAmount,
      netChange: Number(h.netChange) || 0,
      date: new Date(h.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      outcome: h.outcome || 'PUSH',
      game: h.game || 'DRILL'
    }));

    return [basePoint, ...points];
  }, [profile.history, profile.initialBankroll]);

  // SVG dimensions for Bankroll chart
  const svgWidth = 680;
  const svgHeight = 230;
  const paddingLeft = 56;
  const paddingRight = 32;
  const paddingTop = 26;
  const paddingBottom = 34;

  const chartCoordinates = useMemo(() => {
    const startAmount = Number(profile.initialBankroll) || 2500;
    const innerWidth = svgWidth - paddingLeft - paddingRight;
    const innerHeight = svgHeight - paddingTop - paddingBottom;

    if (!chartData || chartData.length === 0) {
      return {
        path: '',
        area: '',
        points: [],
        minB: 2000,
        maxB: 3000,
        baselineY: paddingTop + innerHeight / 2,
        ticks: [
          { val: 3000, y: paddingTop },
          { val: 2500, y: paddingTop + innerHeight / 2 },
          { val: 2000, y: paddingTop + innerHeight }
        ]
      };
    }

    const bankrolls = chartData.map(d => Number(d.bankroll) || startAmount);
    const minVal = Math.min(...bankrolls, startAmount - 100);
    const maxVal = Math.max(...bankrolls, startAmount + 100);
    const safeMinVal = isFinite(minVal) ? minVal : startAmount - 100;
    const safeMaxVal = isFinite(maxVal) ? maxVal : startAmount + 100;
    const margin = Math.max(50, Math.ceil((safeMaxVal - safeMinVal) * 0.1));
    const minB = Math.floor((safeMinVal - margin) / 50) * 50;
    const maxB = Math.ceil((safeMaxVal + margin) / 50) * 50;
    const range = (maxB - minB) > 0 ? (maxB - minB) : 1;

    const points = chartData.map((d, i) => {
      const denom = Math.max(1, chartData.length - 1);
      const rawX = paddingLeft + (i / denom) * innerWidth;
      const bVal = Number(d.bankroll) || startAmount;
      const rawY = paddingTop + (1 - (bVal - minB) / range) * innerHeight;
      const x = isFinite(rawX) ? rawX : paddingLeft;
      const y = isFinite(rawY) ? rawY : paddingTop + innerHeight / 2;
      return { ...d, x, y };
    });

    const path = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');
    const lastPt = points[points.length - 1];
    const firstPt = points[0];
    const area = points.length > 0 && lastPt && firstPt
      ? `${path} L ${lastPt.x.toFixed(1)} ${(paddingTop + innerHeight).toFixed(1)} L ${firstPt.x.toFixed(1)} ${(paddingTop + innerHeight).toFixed(1)} Z`
      : '';

    const rawBaselineY = paddingTop + (1 - (startAmount - minB) / range) * innerHeight;
    const baselineY = isFinite(rawBaselineY) ? rawBaselineY : paddingTop + innerHeight / 2;

    const ticks = [
      { val: maxB, y: paddingTop },
      { val: Math.round((maxB + minB) / 2), y: paddingTop + innerHeight / 2 },
      { val: minB, y: paddingTop + innerHeight }
    ].map(t => ({
      val: isFinite(t.val) ? t.val : 0,
      y: isFinite(t.y) ? t.y : paddingTop + innerHeight / 2
    }));

    return { path, area, points, minB, maxB, baselineY, ticks };
  }, [chartData, profile.initialBankroll]);

  // Badges Earned
  const badges = [
    {
      id: 'b1',
      name: 'Blackjack Basic Strategist',
      desc: 'Achieved >80% accuracy in Blackjack drills',
      unlocked: proficiencies.BLACKJACK.accuracyRate >= 80,
      icon: Shield
    },
    {
      id: 'b2',
      name: 'Pot Odds Calculator',
      desc: 'Executed positive expectation Texas Hold\'em calls',
      unlocked: proficiencies.POKER.roundsPlayed >= 2,
      icon: Trophy
    },
    {
      id: 'b3',
      name: 'Wheel Disciplinarian',
      desc: 'Avoided the American 5-number basket trap',
      unlocked: proficiencies.ROULETTE.roundsPlayed >= 2,
      icon: Award
    },
    {
      id: 'b4',
      name: 'Bankroll Guardian',
      desc: 'Maintained a positive Net P&L across session rounds',
      unlocked: profile.netProfit > 0,
      icon: Flame
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner & Operator Credentials */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#0C1524] via-[#0E1A2E] to-[#0A111E] border-2 border-[#1E2E48] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-300 shadow-lg flex items-center justify-center text-slate-950 font-arcade font-bold text-xl shrink-0">
            {profile.nickname ? profile.nickname.trim().slice(0, 2).toUpperCase() : 'AP'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-white font-arcade uppercase tracking-wider">
                {profile.nickname ? profile.nickname : t.profileTitle}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono-telemetry text-[10px] font-bold border border-amber-400/40">
                ACTIVE OPERATOR
              </span>
              {onEditProfile && (
                <button
                  onClick={onEditProfile}
                  className="px-2 py-0.5 rounded-lg bg-[#142136] hover:bg-[#1E304E] border border-sky-500/40 text-sky-300 font-arcade text-[10px] transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {t.editProfileBtn || 'Edit Profile'}
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 font-sans-arcade mt-0.5">
              {profile.nickname ? `${t.profileSubtitle} • Callsign: ${profile.nickname}` : t.profileSubtitle}
            </p>
          </div>
        </div>

        {/* Action buttons: Export & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            className="px-3 py-1.5 rounded-xl bg-[#142136] hover:bg-[#1E304E] border border-sky-500/40 text-sky-300 font-arcade text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportData}</span>
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1.5 rounded-xl bg-[#2B1519] hover:bg-[#3D1D23] border border-rose-500/40 text-rose-300 font-arcade text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.resetStats}</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-5 rounded-3xl bg-[#0F1726] border-2 border-rose-500/50 shadow-2xl space-y-3 animate-fade-in">
            <div className="flex items-center gap-2.5 text-rose-400 font-arcade text-sm font-bold">
              <AlertTriangle className="w-5 h-5" />
              <span>{t.resetStats}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.resetConfirm}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/60">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-arcade font-bold hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-arcade font-bold cursor-pointer shadow-md"
              >
                Erase Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 High-Impact KPI Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Net P&L */}
        <div className="p-3.5 rounded-2xl bg-[#0A1220] border border-[#1E2E48] shadow-md">
          <span className="text-[10px] font-arcade text-slate-400 uppercase tracking-wider block">
            {t.statNetProfit}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            {profile.netProfit >= 0 ? (
              <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <TrendingDown className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span
              className={`text-lg sm:text-xl font-bold font-mono-telemetry ${
                profile.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {profile.netProfit >= 0 ? `+$${profile.netProfit}` : `-$${Math.abs(profile.netProfit)}`}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono-telemetry mt-1 block">
            Profit Factor: {profitFactor}
          </span>
        </div>

        {/* Win Rate */}
        <div className="p-3.5 rounded-2xl bg-[#0A1220] border border-[#1E2E48] shadow-md">
          <span className="text-[10px] font-arcade text-slate-400 uppercase tracking-wider block">
            {t.statWinRate}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-lg sm:text-xl font-bold font-mono-telemetry text-amber-300">
              {overallWinRate}%
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono-telemetry mt-1 block">
            {profile.winCount} Wins / {profile.lossCount} Losses
          </span>
        </div>

        {/* Strategy Accuracy Rate */}
        <div className="p-3.5 rounded-2xl bg-[#0A1220] border border-[#1E2E48] shadow-md">
          <span className="text-[10px] font-arcade text-slate-400 uppercase tracking-wider block">
            {t.statAccuracyRate}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
            <span className="text-lg sm:text-xl font-bold font-mono-telemetry text-sky-300">
              {overallAccuracy}%
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono-telemetry mt-1 block">
            {profile.mistakes.length} Leaks Recorded
          </span>
        </div>

        {/* Total Capital Wagered */}
        <div className="p-3.5 rounded-2xl bg-[#0A1220] border border-[#1E2E48] shadow-md">
          <span className="text-[10px] font-arcade text-slate-400 uppercase tracking-wider block">
            {t.statTotalWagered}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <Coins className="w-5 h-5 text-purple-400 shrink-0" />
            <span className="text-lg sm:text-xl font-bold font-mono-telemetry text-purple-300">
              ${profile.totalWagered}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono-telemetry mt-1 block">
            {profile.roundsPlayed} Rounds Executed
          </span>
        </div>
      </div>

      {/* Sub-Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-[#080E18] border border-[#1A283E]">
        {[
          { id: 'overview', label: t.tabOverview, icon: BarChart3 },
          { id: 'history', label: t.tabHistory, icon: LineChart },
          { id: 'mistakes', label: t.tabMistakes, icon: AlertTriangle },
          { id: 'strengths', label: t.tabStrengths, icon: Shield },
          { id: 'financials', label: t.tabFinancials, icon: Coins }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveSubTab(tab.id as any);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-arcade transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-[#101B2B] text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4">
          {/* Bankroll Chart */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#09111D] border border-[#1B293E] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-arcade font-bold text-white uppercase tracking-wider">
                  {t.winLossChartTitle}
                </h3>
              </div>
              <span className="text-[10px] font-mono-telemetry text-emerald-400 font-bold">
                Bankroll: ${profile.currentBankroll}
              </span>
            </div>

            {profile.history.length === 0 ? (
              <div className="py-8 px-4 rounded-2xl bg-[#060B12] border border-[#172338] flex flex-col items-center justify-center text-center space-y-3">
                <LineChart className="w-8 h-8 text-amber-400/60" />
                <div className="max-w-md space-y-1">
                  <p className="text-xs font-arcade font-bold text-slate-200">
                    {t.noHistoryYet}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {t.authenticDataNotice}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('drills')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-arcade font-bold text-xs tracking-wider cursor-pointer shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{t.startDrillCTA}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Active/Hovered Point Telemetry HUD */}
                {selectedPointIndex !== null && chartCoordinates.points[selectedPointIndex] ? (
                  <div className="p-3 rounded-2xl bg-[#060B12] border border-sky-500/40 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-telemetry animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                        {chartCoordinates.points[selectedPointIndex].label}
                      </span>
                      <span className="text-slate-300 font-bold">
                        {chartCoordinates.points[selectedPointIndex].game}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-bold ${
                          chartCoordinates.points[selectedPointIndex].outcome === 'WIN'
                            ? 'text-emerald-400'
                            : chartCoordinates.points[selectedPointIndex].outcome === 'LOSS'
                            ? 'text-rose-400'
                            : 'text-amber-300'
                        }`}
                      >
                        {chartCoordinates.points[selectedPointIndex].outcome}{' '}
                        {chartCoordinates.points[selectedPointIndex].netChange > 0
                          ? `(+$${chartCoordinates.points[selectedPointIndex].netChange})`
                          : chartCoordinates.points[selectedPointIndex].netChange < 0
                          ? `(-$${Math.abs(chartCoordinates.points[selectedPointIndex].netChange)})`
                          : '($0)'}
                      </span>
                      <span className="text-emerald-300 font-bold">
                        Bankroll: ${chartCoordinates.points[selectedPointIndex].bankroll}
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        {chartCoordinates.points[selectedPointIndex].date}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] font-mono-telemetry text-slate-400 px-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> {t.roundAxisLabel}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {chartCoordinates.points.length - 1} rounds logged • click/hover points for telemetry
                    </span>
                  </div>
                )}

                <div className="relative w-full overflow-x-auto rounded-2xl bg-[#060B12] p-2 border border-[#162338]">
                  <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="w-full min-w-[540px] h-52 sm:h-60 select-none"
                  >
                    <defs>
                      <linearGradient id="bankrollGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.30" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Y-Axis Gridlines & Value Labels */}
                    {chartCoordinates.ticks.map((tick, idx) => {
                      const safeY = isFinite(tick.y) ? tick.y : 0;
                      return (
                        <g key={idx}>
                          <line
                            x1={paddingLeft}
                            y1={safeY}
                            x2={svgWidth - paddingRight}
                            y2={safeY}
                            stroke="#1A2A42"
                            strokeDasharray="3 3"
                            strokeWidth="1"
                          />
                          <text
                            x={paddingLeft - 6}
                            y={safeY + 4}
                            textAnchor="end"
                            className="fill-slate-500 text-[10px] font-mono-telemetry"
                          >
                            ${tick.val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Starting Baseline Indicator ($2,500) */}
                    {(() => {
                      const safeBaselineY = isFinite(chartCoordinates.baselineY) ? chartCoordinates.baselineY : 0;
                      return (
                        <>
                          <line
                            x1={paddingLeft}
                            y1={safeBaselineY}
                            x2={svgWidth - paddingRight}
                            y2={safeBaselineY}
                            stroke="#F59E0B"
                            strokeDasharray="5 5"
                            strokeWidth="1.5"
                            opacity="0.65"
                          />
                          <text
                            x={svgWidth - paddingRight - 4}
                            y={safeBaselineY - 5}
                            textAnchor="end"
                            className="fill-amber-400 text-[9px] font-mono-telemetry font-bold"
                          >
                            {t.baselineBankroll}
                          </text>
                        </>
                      );
                    })()}

                    {/* Gradient Area Fill */}
                    {chartCoordinates.area && <path d={chartCoordinates.area} fill="url(#bankrollGrad)" />}

                    {/* Performance Trajectory Line */}
                    {chartCoordinates.path && (
                      <path
                        d={chartCoordinates.path}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* X-Axis Round Labels along the bottom */}
                    {chartCoordinates.points.map((pt, idx) => {
                      // Only show subset if many points to prevent label collision
                      const showLabel =
                        chartCoordinates.points.length <= 12 ||
                        idx === 0 ||
                        idx === chartCoordinates.points.length - 1 ||
                        idx % Math.ceil(chartCoordinates.points.length / 8) === 0;

                      if (!showLabel) return null;
                      const safeX = isFinite(pt.x) ? pt.x : 0;

                      return (
                        <text
                          key={`xlabel-${idx}`}
                          x={safeX}
                          y={svgHeight - 10}
                          textAnchor="middle"
                          className="fill-slate-400 text-[9px] font-mono-telemetry"
                        >
                          {pt.label}
                        </text>
                      );
                    })}

                    {/* Data Points with interactive hover/click and color coding */}
                    {chartCoordinates.points.map((pt, idx) => {
                      const isSelected = selectedPointIndex === idx;
                      const safeX = isFinite(pt.x) ? pt.x : 0;
                      const safeY = isFinite(pt.y) ? pt.y : 0;
                      return (
                        <g key={`pt-${idx}`}>
                          {isSelected && (
                            <circle
                              cx={safeX}
                              cy={safeY}
                              r="9"
                              className="fill-sky-400/20 stroke-sky-400 stroke-2 animate-pulse"
                            />
                          )}
                          <circle
                            cx={safeX}
                            cy={safeY}
                            r={isSelected ? '6' : '4.5'}
                            onMouseEnter={() => setSelectedPointIndex(idx)}
                            onClick={() => setSelectedPointIndex(idx)}
                            className={`transition-all cursor-pointer ${
                              pt.outcome === 'WIN'
                                ? 'fill-emerald-400 stroke-slate-950 stroke-2 hover:fill-emerald-300'
                                : pt.outcome === 'LOSS'
                                ? 'fill-rose-500 stroke-slate-950 stroke-2 hover:fill-rose-400'
                                : pt.outcome === 'BASE'
                                ? 'fill-sky-400 stroke-slate-950 stroke-2 hover:fill-sky-300'
                                : 'fill-amber-400 stroke-slate-950 stroke-2 hover:fill-amber-300'
                            }`}
                          >
                            <title>{`${pt.label}: ${pt.game} - ${pt.outcome} ($${pt.bankroll})`}</title>
                          </circle>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Strongest & Weakest Callout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {strongest && (
              <div className="p-4 rounded-2xl bg-[#091D14] border border-emerald-500/40 shadow-md flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-arcade text-emerald-300 uppercase tracking-wider block">
                    {t.strongestGame}
                  </span>
                  <span className="text-sm font-bold text-white font-arcade">
                    {strongest.game} ({strongest.accuracyRate}% Strategy Accuracy)
                  </span>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    +{strongest.netProfit >= 0 ? `$${strongest.netProfit}` : `-$${Math.abs(strongest.netProfit)}`} net earnings across {strongest.roundsPlayed} rounds
                  </p>
                </div>
              </div>
            )}

            {weakest && (
              <div className="p-4 rounded-2xl bg-[#221015] border border-rose-500/40 shadow-md flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-arcade text-rose-300 uppercase tracking-wider block">
                    {t.weakestGame}
                  </span>
                  <span className="text-sm font-bold text-white font-arcade">
                    {weakest.game} ({weakest.mistakesCount} Leaks Logged)
                  </span>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Focus on this game's strategy deviations to plug negative-EV leaks
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: P&L HISTORY */}
      {activeSubTab === 'history' && (
        <div className="space-y-3">
          {/* Game filter */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#0B1320] border border-[#1E2E48] text-xs">
            <span className="text-[11px] font-arcade text-slate-400 uppercase">
              Filter by game:
            </span>
            <div className="flex items-center gap-1">
              {['ALL', 'BLACKJACK', 'POKER', 'ROULETTE', 'SLOTS'].map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGameFilter(g)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-arcade font-bold cursor-pointer transition-all ${
                    selectedGameFilter === g
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'bg-[#142033] text-slate-300 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* History list */}
          {filteredHistory.length === 0 ? (
            <div className="p-6 text-center text-slate-500 font-mono-telemetry text-xs rounded-2xl bg-[#09111D] border border-[#1B293E]">
              {t.noHistoryYet}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredHistory.map(h => (
                <div
                  key={h.id}
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#0A1220] border border-[#1E2D44] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        h.outcome === 'WIN'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : h.outcome === 'LOSS'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {h.outcome === 'WIN' ? 'W' : h.outcome === 'LOSS' ? 'L' : 'P'}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-arcade font-bold text-white uppercase text-[11px]">
                          {h.game}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono-telemetry">
                          {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-sm sm:max-w-md">
                        {h.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono-telemetry">
                    <span
                      className={`font-bold text-sm block ${
                        h.netChange > 0
                          ? 'text-emerald-400'
                          : h.netChange < 0
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {h.netChange > 0 ? `+$${h.netChange}` : h.netChange < 0 ? `-$${Math.abs(h.netChange)}` : '$0'}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      Bankroll: ${h.runningBankroll}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FREQUENT MISTAKES GRAPH & LEAK JOURNAL */}
      {activeSubTab === 'mistakes' && (
        <div className="space-y-4">
          {/* Frequent Mistakes Bar Graph */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#09111D] border border-[#1B293E] shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-arcade font-bold text-white uppercase tracking-wider">
                {t.frequentMistakesTitle}
              </h3>
            </div>

            {frequentMistakes.length === 0 ? (
              <div className="p-6 text-center text-slate-500 font-mono-telemetry text-xs">
                {t.noMistakesYet}
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {frequentMistakes.slice(0, 6).map((fm, idx) => {
                  const maxCount = Math.max(...frequentMistakes.map(m => m.count), 1);
                  const barWidth = Math.max(12, Math.round((fm.count / maxCount) * 100));

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-arcade font-bold text-slate-200 truncate max-w-[280px] sm:max-w-md">
                          {idx + 1}. {fm.scenarioName}
                        </span>
                        <div className="flex items-center gap-2 font-mono-telemetry shrink-0 text-[11px]">
                          <span className="text-amber-400 font-bold">{fm.count}× occurred</span>
                          <span className="text-rose-400 font-bold">-${fm.totalCost} EV</span>
                        </div>
                      </div>

                      {/* Bar visualization */}
                      <div className="h-3 w-full bg-[#050B12] rounded-full overflow-hidden border border-[#1A293E] p-0.5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-rose-600 via-amber-500 to-yellow-400 transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-telemetry">
                        <span>Played: <strong className="text-rose-300">{fm.userDecision}</strong></span>
                        <span>Optimal: <strong className="text-emerald-300">{fm.expectedDecision}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Full Mistakes Journal */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#09111D] border border-[#1B293E] shadow-xl space-y-3">
            <h3 className="text-xs font-arcade font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              {t.allMistakesJournal} ({profile.mistakes.length})
            </h3>

            {profile.mistakes.length === 0 ? (
              <div className="p-4 text-center text-slate-500 font-mono-telemetry text-xs">
                {t.noMistakesYet}
              </div>
            ) : (
              <div className="space-y-2.5">
                {profile.mistakes.map(m => (
                  <div
                    key={m.id}
                    className="p-3 rounded-2xl bg-[#1A0E13] border border-rose-500/30 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-arcade font-bold">
                      <span className="text-rose-300 text-[11px]">{m.scenarioName}</span>
                      <span className="text-rose-400 font-mono-telemetry text-xs">-${m.cost} CR</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono-telemetry">
                      <span className="text-slate-400">
                        {t.yourMove}: <strong className="text-rose-300">{m.userDecision}</strong>
                      </span>
                      <span className="text-slate-400">
                        {t.correctMove}: <strong className="text-emerald-300">{m.expectedDecision}</strong>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans-arcade pt-1 border-t border-rose-500/20">
                      {m.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: GAME STRENGTHS */}
      {activeSubTab === 'strengths' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-[#09111D] border border-[#1B293E] shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-arcade font-bold text-white uppercase tracking-wider">
                {t.gameProficiencyTitle}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['BLACKJACK', 'POKER', 'ROULETTE', 'SLOTS'] as DrillGameType[]).map(gameKey => {
                const prof = proficiencies[gameKey];
                return (
                  <div
                    key={gameKey}
                    className="p-4 rounded-2xl bg-[#0A1322] border border-[#1E2E48] space-y-2.5 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-arcade font-bold text-white text-xs tracking-wider">
                          {gameKey}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono-telemetry font-bold border border-sky-500/30">
                          {t.scoreLabel}: {prof.score}/100
                        </span>
                      </div>
                      <span
                        className={`text-xs font-mono-telemetry font-bold ${
                          prof.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {prof.netProfit >= 0 ? `+$${prof.netProfit}` : `-$${Math.abs(prof.netProfit)}`}
                      </span>
                    </div>

                    {/* Progress Bar for Strength */}
                    <div className="h-2 w-full bg-[#050A10] rounded-full overflow-hidden border border-[#1A2638]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400"
                        style={{ width: `${prof.score}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-1 border-t border-[#162338] text-[10px] font-mono-telemetry text-center">
                      <div>
                        <span className="text-slate-500 block">{t.winRateLabel}</span>
                        <span className="text-amber-300 font-bold">{prof.winRate}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{t.accuracyLabel}</span>
                        <span className="text-sky-300 font-bold">{prof.accuracyRate}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{t.roundsLabel}</span>
                        <span className="text-slate-200 font-bold">{prof.roundsPlayed}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FINANCIALS & BADGES */}
      {activeSubTab === 'financials' && (
        <div className="space-y-4">
          {/* Financials Overview */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#09111D] border border-[#1B293E] shadow-xl space-y-3">
            <h3 className="text-xs font-arcade font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              {t.financialLedger}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#0A1322] border border-[#1E2E48]">
                <span className="text-[10px] text-slate-400 font-arcade uppercase block">{t.statTotalWonLedger}</span>
                <span className="text-base font-bold font-mono-telemetry text-emerald-400">+${profile.totalWon}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0A1322] border border-[#1E2E48]">
                <span className="text-[10px] text-slate-400 font-arcade uppercase block">{t.statTotalLostLedger}</span>
                <span className="text-base font-bold font-mono-telemetry text-rose-400">-${profile.totalLost}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0A1322] border border-[#1E2E48]">
                <span className="text-[10px] text-slate-400 font-arcade uppercase block">{t.profitFactorLabel}</span>
                <span className="text-base font-bold font-mono-telemetry text-amber-300">{profitFactor}</span>
              </div>
            </div>
          </div>

          {/* Advantage Mastery Badges */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#09111D] border border-[#1B293E] shadow-xl space-y-3">
            <h3 className="text-xs font-arcade font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              {t.badgesTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {badges.map(b => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                      b.unlocked
                        ? 'bg-[#101F18] border-emerald-500/50 text-emerald-100 shadow-md'
                        : 'bg-[#0A101A] border-[#1A2638] text-slate-500 opacity-60'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl border shrink-0 ${
                        b.unlocked
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-arcade font-bold text-white">
                          {b.name}
                        </span>
                        {b.unlocked && (
                          <span className="text-[8px] px-1 rounded bg-emerald-400/20 text-emerald-300 font-mono-telemetry font-bold">
                            {t.unlockedBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
