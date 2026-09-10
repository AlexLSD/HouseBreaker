import React from 'react';
import {
  Calculator,
  CircleDot,
  Coins,
  Flame,
  Grid,
  Spade,
  Trophy,
  User
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface BottomNavigationProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onSelectTab }) => {
  const { t } = useLanguage();

  // 3 tabs left + 1 prominent center hero button (Drills) + 3 tabs right = 7 perfectly centered tabs
  const leftItems = [
    { id: 'command-center', label: t.navHub, icon: Trophy },
    { id: 'blackjack', label: t.navBlackjack, icon: Spade },
    { id: 'roulette', label: t.navRoulette, icon: CircleDot },
  ];

  const rightItems = [
    { id: 'massive-slots', label: t.navSlots, icon: Grid },
    { id: 'range-lab', label: t.navPoker, icon: Calculator },
    { id: 'risk-lab', label: t.navKelly, icon: Coins },
  ];

  const isDrillActive = activeTab === 'drills';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-[#0B0F17]/95 backdrop-blur-xl border-t border-[#2A344A] px-1 sm:px-2 pt-1 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))] select-none shadow-2xl">
      <div className="max-w-md sm:max-w-2xl mx-auto flex items-end justify-between gap-1">
        {/* Left Side Items */}
        {leftItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 min-w-0 min-h-[44px] sm:min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 sm:p-1.5 rounded-lg transition-transform ${
                  isActive
                    ? 'bg-amber-400/20 border border-amber-400/40 shadow-sm scale-105'
                    : 'hover:bg-[#1A2333]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]' : 'text-slate-400'
                  }`}
                />
              </div>
              <span className="text-[9px] xs:text-[10px] font-sans-arcade tracking-tight mt-0.5 whitespace-nowrap truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Center Hero: Drill Button (Prominent, Larger, Distinctive Accent Color) */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-3.5 sm:-mt-4 shrink-0">
          <button
            onClick={() => onSelectTab('drills')}
            className={`group relative flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 ${
              isDrillActive ? 'scale-105' : 'hover:scale-105'
            }`}
            aria-label={t.navDrills}
          >
            {/* Ambient Glow */}
            <div className={`absolute -inset-1 rounded-full blur-sm transition-opacity ${
              isDrillActive
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-orange-500 opacity-90'
                : 'bg-gradient-to-r from-amber-500/50 to-orange-500/50 opacity-50 group-hover:opacity-80'
            }`} />

            {/* Circular Distinctive Button Container */}
            <div
              className={`relative w-12 h-12 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center shadow-2xl border-2 transition-all ${
                isDrillActive
                  ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 border-amber-200 text-slate-950 shadow-orange-500/50 ring-2 ring-amber-300'
                  : 'bg-gradient-to-br from-[#2D160E] via-[#24120B] to-[#180A05] border-amber-500/60 text-amber-400 shadow-amber-900/40'
              }`}
            >
              <Flame
                className={`w-6 h-6 transition-transform ${
                  isDrillActive
                    ? 'text-slate-950 fill-slate-950 scale-110 animate-pulse'
                    : 'text-amber-400 fill-amber-500/40 group-hover:scale-110'
                }`}
              />
            </div>

            <span className={`text-[9px] xs:text-[10px] font-arcade font-bold tracking-tight mt-1 whitespace-nowrap ${
              isDrillActive ? 'text-amber-300 drop-shadow' : 'text-amber-400/90'
            }`}>
              {t.navDrills}
            </span>
          </button>
        </div>

        {/* Right Side Items */}
        {rightItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 min-w-0 min-h-[44px] sm:min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 sm:p-1.5 rounded-lg transition-transform ${
                  isActive
                    ? 'bg-amber-400/20 border border-amber-400/40 shadow-sm scale-105'
                    : 'hover:bg-[#1A2333]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]' : 'text-slate-400'
                  }`}
                />
              </div>
              <span className="text-[9px] xs:text-[10px] font-sans-arcade tracking-tight mt-0.5 whitespace-nowrap truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
