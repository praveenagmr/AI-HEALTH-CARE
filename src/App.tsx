/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './frontend/components/Navbar.tsx';
import { LanguageModal } from './frontend/components/LanguageModal.tsx';
import { VoiceAssistantFloatingBar } from './frontend/components/VoiceAssistantFloatingBar.tsx';
import { Page1Auth } from './frontend/components/Page1Auth.tsx';
import { Page2Upload, UploadedSourceState } from './frontend/components/Page2Upload.tsx';
import { Page3Screening } from './frontend/components/Page3Screening.tsx';
import { Page4Medicines } from './frontend/components/Page4Medicines.tsx';
import { Page5History } from './frontend/components/Page5History.tsx';
import { Page6AboutUs } from './frontend/components/Page6AboutUs.tsx';
import { Page7AdminControl } from './frontend/components/Page7AdminControl.tsx';

import {
  SupportedLanguage,
  UserProfile,
  ScreeningFinding,
  MedicineOrder,
} from '../database/schema.ts';
import { voiceAssistant } from './frontend/services/voiceAssistant.ts';
import { TRANSLATIONS } from './frontend/translations/index.ts';

export default function App() {
  // Language & Modal State
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  // As requested: before the user interacts the voice assistant should speak and ask user to select their language
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(true);

  // Navigation & User State
  const [currentPage, setCurrentPage] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Uploaded Source (Page 2)
  const [uploadedState, setUploadedState] = useState<UploadedSourceState>({
    reportFile: null,
    photoFile: null,
    selectedCategory: 'skin',
  });

  // Screening Finding (Page 3)
  const [activeScreening, setActiveScreening] = useState<ScreeningFinding | null>(null);

  // Medicine Orders (Page 4)
  const [lastOrder, setLastOrder] = useState<MedicineOrder | null>(null);

  // Synchronize audio state
  useEffect(() => {
    const unsub = voiceAssistant.subscribe(() => {
      setIsMuted(voiceAssistant.getIsMuted());
    });
    return () => {
      unsub();
    };
  }, []);

  // Handle Language Selection from modal or navbar
  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    voiceAssistant.setLanguage(lang);
    setIsLanguageModalOpen(false);

    // Speak immediate personalized welcome in selected language
    const welcome =
      lang === 'kn'
        ? 'AI ಹೆಲ್ತ್ ಕೇರ್ ಗೆ ಸ್ವಾಗತ! ನೀವು ಲಾಗಿನ್ ಅಥವಾ ನೋಂದಣಿ ಮಾಡಬಹುದು. ಮೈಕ್ರೊಫೋನ್ ಒತ್ತಿ ಮಾತನಾಡಿ ವಿವರಗಳನ್ನು ಸ್ವಯಂ ಭರ್ತಿ ಮಾಡಿಕೊಳ್ಳಿ.'
        : lang === 'hi'
        ? 'AI हेल्थ केयर में आपका स्वागत है! आप लॉगिन या पंजीकरण कर सकते हैं। माइक दबाकर अपना विवरण बोलें।'
        : 'Welcome to AI HEALTH CARE! You can sign up or log in. Tap the mic to speak and auto-fill your details.';

    voiceAssistant.speak(welcome, 'page1_auth');
  };

  // Auth Success Handlers
  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.preferredLanguage) {
      setLanguage(user.preferredLanguage);
      voiceAssistant.setLanguage(user.preferredLanguage);
    }
    // Advance to Page 2
    setCurrentPage(2);
  };

  // Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage(1);
    voiceAssistant.speak(
      language === 'kn'
        ? 'ನೀವು ಯಶಸ್ವಿಯಾಗಿ ನಿರ್ಗಮಿಸಿದ್ದೀರಿ.'
        : language === 'hi'
        ? 'आप सफलतापूर्वक लॉगआउट हो गए हैं।'
        : 'You have been logged out.',
      'app'
    );
  };

  // Restart Screening from Page 5
  const handleRestartScreening = () => {
    setUploadedState({
      reportFile: null,
      photoFile: null,
      selectedCategory: 'skin',
    });
    setActiveScreening(null);
    setCurrentPage(2);
  };

  // Get current guidance text for floating assistant
  const getCurrentGuidance = (): string => {
    const t = TRANSLATIONS[language];
    switch (currentPage) {
      case 1:
        return t.page1.voiceGuidancePrompt;
      case 2:
        return t.page2.voiceGuidance;
      case 3:
        return activeScreening
          ? activeScreening.localizedSummary?.[language] || activeScreening.clinicalSummary
          : t.page3.voiceModeSubtitle;
      case 4:
        return t.page4.voiceGuidance;
      case 5:
        return t.page5.voiceGuidance;
      case 6:
        return t.page6.voiceGuidance;
      case 7:
        return t.page7.voiceGuidance;
      default:
        return '';
    }
  };

  // Global voice command handler across every page
  const handleGlobalVoiceCommand = (text: string) => {
    const lower = text.toLowerCase();

    // Language switching commands
    if (lower.includes('kannada') || lower.includes('ಕನ್ನಡ')) {
      handleSelectLanguage('kn');
      return;
    }
    if (lower.includes('hindi') || lower.includes('हिंदी')) {
      handleSelectLanguage('hi');
      return;
    }
    if (lower.includes('english') || lower.includes('ಇಂಗ್ಲಿಷ್') || lower.includes('इंग्लिश')) {
      handleSelectLanguage('en');
      return;
    }

    // Page navigation commands across every single page
    if (lower.includes('login') || lower.includes('sign in') || lower.includes('sign up') || lower.includes('page 1') || lower.includes('ಲಾಗಿನ್') || lower.includes('लॉगिन')) {
      setCurrentPage(1);
    } else if (lower.includes('upload') || lower.includes('photo') || lower.includes('report') || lower.includes('page 2') || lower.includes('ಅಪ್ಲೋಡ್') || lower.includes('अपलोड')) {
      setCurrentPage(2);
    } else if (lower.includes('screening') || lower.includes('assessment') || lower.includes('page 3') || lower.includes('ತಪಾಸಣೆ') || lower.includes('स्क्रीनिंग')) {
      setCurrentPage(3);
    } else if (lower.includes('medicine') || lower.includes('order') || lower.includes('page 4') || lower.includes('ಔಷಧ') || lower.includes('दवा')) {
      setCurrentPage(4);
    } else if (lower.includes('history') || lower.includes('records') || lower.includes('page 5') || lower.includes('ಇತಿಹಾಸ') || lower.includes('इतिहास')) {
      setCurrentPage(5);
    } else if (lower.includes('about') || lower.includes('page 6') || lower.includes('ನಮ್ಮ ಬಗ್ಗೆ') || lower.includes('ಬಗ್ಗೆ')) {
      setCurrentPage(6);
    } else if (lower.includes('admin') || lower.includes('page 7') || lower.includes('ಅಡ್ಮಿನ್') || lower.includes('एडमिन')) {
      if (currentUser?.role === 'admin') {
        setCurrentPage(7);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(p) => setCurrentPage(p)}
        language={language}
        onLanguageChange={handleSelectLanguage}
        isMuted={isMuted}
        onToggleMute={() => voiceAssistant.setMute(!isMuted)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Multi-Page Container */}
      <main className="flex-1 pb-24">
        {currentPage === 1 && (
          <Page1Auth
            language={language}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {currentPage === 2 && (
          <Page2Upload
            language={language}
            currentUser={currentUser}
            uploadedState={uploadedState}
            onUpdateUploadedState={setUploadedState}
            onProceedToPage3={() => setCurrentPage(3)}
          />
        )}

        {currentPage === 3 && (
          <Page3Screening
            language={language}
            currentUser={currentUser}
            uploadedState={uploadedState}
            activeScreening={activeScreening}
            onSetScreening={setActiveScreening}
            onProceedToPage4={() => setCurrentPage(4)}
          />
        )}

        {currentPage === 4 && (
          <Page4Medicines
            language={language}
            currentUser={currentUser}
            activeScreening={activeScreening}
            onOrderCompleted={(ord) => setLastOrder(ord)}
            onProceedToPage5={() => setCurrentPage(5)}
          />
        )}

        {currentPage === 5 && (
          <Page5History
            language={language}
            currentUser={currentUser}
            onRestartScreening={handleRestartScreening}
          />
        )}

        {currentPage === 6 && (
          <Page6AboutUs
            language={language}
          />
        )}

        {currentPage === 7 && (
          <Page7AdminControl
            language={language}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Persistent Floating AI Voice Assistant Widget */}
      <VoiceAssistantFloatingBar
        language={language}
        pageContext={`page${currentPage}`}
        guidanceText={getCurrentGuidance()}
        onVoiceResult={handleGlobalVoiceCommand}
        userId={currentUser?.id}
      />

      {/* Initial Language Selection Modal with Voice Greeting */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onSelectLanguage={handleSelectLanguage}
        currentLanguage={language}
      />
    </div>
  );
}
