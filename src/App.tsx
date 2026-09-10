/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HeaderTelemetry } from './components/HeaderTelemetry';
import { CommandCenter } from './components/CommandCenter';
import { RouletteLab } from './components/RouletteLab';
import { BlackjackLab } from './components/BlackjackLab';
import { RangeMonteCarloLab } from './components/RangeMonteCarloLab';
import { MassiveGridSlots } from './components/MassiveGridSlots';
import { RiskLaboratory } from './components/RiskLaboratory';
import { DrillArena } from './components/DrillArena';
import { UserProfile } from './components/UserProfile';
import { BottomNavigation } from './components/BottomNavigation';
import { ComplianceModal } from './components/ComplianceModal';
import { FeatureGuideModal } from './components/FeatureGuideModal';
import { OnboardingModal } from './components/OnboardingModal';
import { LanguageProvider } from './i18n/LanguageContext';
import { loadUserProfile } from './utils/userProfileStorage';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('command-center');
  const [isComplianceOpen, setIsComplianceOpen] = useState<boolean>(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState<boolean>(false);
  const [featureCategory, setFeatureCategory] = useState<string>('all');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    const p = loadUserProfile();
    return !p.onboardingCompleted;
  });
  const [userProfileData, setUserProfileData] = useState(() => loadUserProfile());

  const openGuide = (category = 'all') => {
    setFeatureCategory(category);
    setIsFeaturesOpen(true);
  };

  const handleOnboardingComplete = () => {
    setUserProfileData(loadUserProfile());
    setIsOnboardingOpen(false);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col antialiased selection:bg-[#F59E0B]/30 selection:text-white">
        {/* Top Telemetry, Profile Access, Language Switcher & Compliance */}
        <HeaderTelemetry
          onOpenCompliance={() => setIsComplianceOpen(true)}
          onOpenProfile={() => setActiveTab('profile')}
          activeTab={activeTab}
        />

        {/* Main Viewport Container with safe area & bottom nav clearance */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-2.5 sm:px-4 py-3 sm:py-4 pb-28 sm:pb-24">
          {activeTab === 'command-center' && (
            <CommandCenter
              onNavigateTab={setActiveTab}
              onOpenCompliance={() => setIsComplianceOpen(true)}
              onOpenFeaturesGuide={openGuide}
            />
          )}

          {activeTab === 'blackjack' && <BlackjackLab onOpenGuide={() => openGuide('blackjack')} />}

          {activeTab === 'roulette' && <RouletteLab onOpenGuide={() => openGuide('roulette')} />}

          {activeTab === 'range-lab' && <RangeMonteCarloLab onOpenGuide={() => openGuide('poker')} />}

          {activeTab === 'massive-slots' && <MassiveGridSlots onOpenGuide={() => openGuide('slots')} />}

          {activeTab === 'risk-lab' && <RiskLaboratory onOpenGuide={() => openGuide('bankroll')} />}

          {activeTab === 'drills' && (
            <DrillArena
              onOpenGuide={() => openGuide('drills')}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'profile' && (
            <UserProfile
              key={userProfileData.nickname + userProfileData.preferredLanguage}
              onNavigateTab={setActiveTab}
              onEditProfile={() => setIsOnboardingOpen(true)}
            />
          )}
        </main>

        {/* Mobile-First Sticky Bottom Navigation */}
        <BottomNavigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Tactical Onboarding Modal for Nickname and Language Setup */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          initialNickname={userProfileData.nickname}
          onComplete={handleOnboardingComplete}
        />

        {/* Comprehensive Feature & Advantage Guide Modal */}
        <FeatureGuideModal
          isOpen={isFeaturesOpen}
          onClose={() => setIsFeaturesOpen(false)}
          onNavigateTab={setActiveTab}
          initialCategory={featureCategory}
        />

        {/* Regulatory & Statutory Framework Modal */}
        <ComplianceModal
          isOpen={isComplianceOpen}
          onClose={() => setIsComplianceOpen(false)}
        />
      </div>
    </LanguageProvider>
  );
}
