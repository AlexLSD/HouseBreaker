import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  CircleDot,
  Coins,
  Compass,
  Flame,
  Grid,
  Info,
  Search,
  Shield,
  Sparkles,
  Trophy,
  X
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { FEATURE_GUIDES, LocalizedFeatureItem } from '../data/featureGuides';

interface FeatureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
  initialCategory?: string;
}

const ICON_MAP: Record<LocalizedFeatureItem['iconKey'], React.ComponentType<{ className?: string }>> = {
  Shield,
  CircleDot,
  Grid,
  Calculator,
  Coins,
  Flame,
  Compass,
  Trophy
};

export const FeatureGuideModal: React.FC<FeatureGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  initialCategory
}) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>('f-blackjack');

  if (!isOpen) return null;

  const currentFeatures = FEATURE_GUIDES[language] || FEATURE_GUIDES.en;

  // Filter features
  const filteredFeatures = currentFeatures.filter(item => {
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
    { id: 'all', label: t.guideCatAll },
    { id: 'blackjack', label: t.guideCatBlackjack },
    { id: 'roulette', label: t.guideCatRoulette },
    { id: 'slots', label: t.guideCatSlots },
    { id: 'poker', label: t.guideCatPoker },
    { id: 'bankroll', label: t.guideCatKelly },
    { id: 'drills', label: t.guideCatDrills },
    { id: 'general', label: t.guideCatHub }
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
                  {t.guideHeader}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono-telemetry border border-amber-500/40 font-bold hidden sm:inline">
                  {t.proBadge}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {t.guideSub}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#141E30] hover:bg-[#1E2D4A] text-slate-300 hover:text-white transition-colors cursor-pointer border border-[#253655]"
            title={t.closeBtn}
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
              placeholder={t.guideSearchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0E1524] border border-[#23334E] text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-amber-400/80 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                {t.guideSearchClear}
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
              <p className="text-sm font-arcade">{t.guideNoMatches} "{searchQuery}".</p>
              <p className="text-xs text-slate-500">{t.guideTrySearching}</p>
            </div>
          ) : (
            filteredFeatures.map(feat => {
              const Icon = ICON_MAP[feat.iconKey] || Shield;
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
                        {isExpanded ? t.guideCollapse : t.guideDetails}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Detailed Breakdown */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-[#080D17] border-t-2 border-[#1C2A40] space-y-4 text-xs animate-fade-in">
                      {/* What It Does */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold font-arcade text-amber-300 uppercase tracking-wider block">
                          {t.guideWhatItDoes}
                        </span>
                        <p className="text-slate-200 text-xs sm:text-[13px] leading-relaxed font-sans-arcade">
                          {feat.whatItDoes}
                        </p>
                      </div>

                      {/* Step-by-Step Practical Usage */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold font-arcade text-amber-300 uppercase tracking-wider block">
                          {t.guideHowToUse}
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
                            {t.guideMathPrinciple}: {feat.mathPrinciple.formulaName}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono-telemetry font-bold">{t.guideExactProof}</span>
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
                          <span><strong>{t.guideProAdvice}</strong> {feat.proTip}</span>
                        </div>

                        <button
                          onClick={() => handleLaunch(feat.tabId)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] text-[#0A0D14] font-arcade font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
                        >
                          {t.guideOpenFeature} <ArrowRight className="w-4 h-4" />
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
            <span className="text-[11px]">{t.guideOfflineNotice}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#141F32] hover:bg-[#1E2F4C] text-slate-200 text-xs font-arcade font-semibold transition-colors cursor-pointer border border-[#253655] self-end sm:self-auto"
          >
            {t.guideDoneReading}
          </button>
        </div>
      </div>
    </div>
  );
};
