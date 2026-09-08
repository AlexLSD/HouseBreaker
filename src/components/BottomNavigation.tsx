import React from 'react';
import {
  Calculator,
  CircleDot,
  Coins,
  Flame,
  Grid,
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

  const navItems = [
    { id: 'command-center', label: t.navHub, icon: Trophy },
    { id: 'roulette', label: t.navRoulette, icon: CircleDot },
    { id: 'massive-slots', label: t.navSlots, icon: Grid },
    { id: 'range-lab', label: t.navPoker, icon: Calculator },
    { id: 'risk-lab', label: t.navKelly, icon: Coins },
    { id: 'drills', label: t.navDrills, icon: Flame },
    { id: 'profile', label: t.navProfile, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-[#0B0F17]/95 backdrop-blur-xl border-t border-[#2A344A] px-1 sm:px-2 pt-1.5 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))] select-none shadow-2xl">
      <div className="max-w-md sm:max-w-3xl mx-auto flex items-center justify-between gap-0.5 sm:gap-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 min-w-0 min-h-[44px] sm:min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#F59E0B] font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 sm:p-1.5 rounded-lg transition-transform ${
                  isActive
                    ? 'bg-gradient-to-b from-[#F59E0B]/25 to-[#F59E0B]/5 border border-[#F59E0B]/40 shadow-sm scale-105'
                    : 'hover:bg-[#1A2333]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#FBBF24] drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]' : 'text-slate-400'
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
