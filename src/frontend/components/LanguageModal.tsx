/**
 * AI HEALTH CARE - Initial Language Selection Modal & Welcoming Voice Assistant
 */
import React, { useEffect, useState } from 'react';
import { Volume2, Mic, Sparkles, Check, Globe } from 'lucide-react';
import { SupportedLanguage } from '../../../database/schema.ts';
import { voiceAssistant } from '../services/voiceAssistant.ts';
import { TRANSLATIONS } from '../translations/index.ts';

interface LanguageModalProps {
  isOpen: boolean;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  currentLanguage: SupportedLanguage;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onSelectLanguage,
  currentLanguage,
}) => {
  const [hasSpokenPrompt, setHasSpokenPrompt] = useState(false);
  const [isListeningForLang, setIsListeningForLang] = useState(false);

  useEffect(() => {
    if (isOpen && !hasSpokenPrompt) {
      // Small timeout to allow user interaction / DOM readiness
      const timer = setTimeout(() => {
        voiceAssistant.speak(
          'Welcome to AI HEALTH CARE. Please select your preferred language: Kannada, Hindi, or English. AI ಹೆಲ್ತ್ ಕೇರ್ ಗೆ ಸ್ವಾಗತ! ದಯವಿಟ್ಟು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
          'language_selection_modal'
        );
        setHasSpokenPrompt(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen, hasSpokenPrompt]);

  const handleSpeakSelection = () => {
    setIsListeningForLang(true);
    voiceAssistant.listen({
      pageContext: 'language_selection_modal',
      onResult: (text) => {
        setIsListeningForLang(false);
        const lower = text.toLowerCase();
        if (lower.includes('kannada') || lower.includes('ಕನ್ನಡ')) {
          onSelectLanguage('kn');
        } else if (lower.includes('hindi') || lower.includes('हिंदी')) {
          onSelectLanguage('hi');
        } else {
          onSelectLanguage('en');
        }
      },
      onError: () => setIsListeningForLang(false),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        {/* AI Assistant Avatar & Speech Wave Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-xs">
              <Volume2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI HEALTH CARE
          </h2>
          <p className="text-sm font-semibold text-emerald-700 mt-1">
            AI Multilingual Clinical Screening Assistant
          </p>

          {/* Tri-Lingual Prompt Text */}
          <div className="mt-3 p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-1 w-full text-center">
            <p className="font-medium text-emerald-900">
              🔊 <span className="font-bold">ಕನ್ನಡ:</span> ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ
            </p>
            <p className="font-medium text-emerald-900">
              🔊 <span className="font-bold">हिंदी:</span> कृपया अपनी पसंदीदा भाषा का चयन करें
            </p>
            <p className="font-medium text-emerald-900">
              🔊 <span className="font-bold">English:</span> Please select your preferred language to proceed
            </p>
          </div>
        </div>

        {/* 3 Main Language Choice Cards */}
        <div className="space-y-3 mb-6">
          {/* Kannada */}
          <button
            onClick={() => onSelectLanguage('kn')}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
              currentLanguage === 'kn'
                ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">🌿</span>
              <div>
                <div className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  ಕನ್ನಡ (Kannada)
                </div>
                <div className="text-xs text-slate-500">
                  ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ಭಾಷೆ - ಪೂರ್ಣ ಧ್ವನಿ ಮತ್ತು ಲಿಖಿತ ಸಹಾಯ
                </div>
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                currentLanguage === 'kn'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'border-slate-300 group-hover:border-emerald-400'
              }`}
            >
              {currentLanguage === 'kn' && <Check className="w-4 h-4" />}
            </div>
          </button>

          {/* Hindi */}
          <button
            onClick={() => onSelectLanguage('hi')}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
              currentLanguage === 'hi'
                ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">🪷</span>
              <div>
                <div className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  हिंदी (Hindi)
                </div>
                <div className="text-xs text-slate-500">
                  संपूर्ण वॉयस असिस्टेंट और मेडिकल स्क्रीनिंग
                </div>
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                currentLanguage === 'hi'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'border-slate-300 group-hover:border-emerald-400'
              }`}
            >
              {currentLanguage === 'hi' && <Check className="w-4 h-4" />}
            </div>
          </button>

          {/* English */}
          <button
            onClick={() => onSelectLanguage('en')}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
              currentLanguage === 'en'
                ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">🌐</span>
              <div>
                <div className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  English (International)
                </div>
                <div className="text-xs text-slate-500">
                  Standard clinical terminology and voice guidance
                </div>
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                currentLanguage === 'en'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'border-slate-300 group-hover:border-emerald-400'
              }`}
            >
              {currentLanguage === 'en' && <Check className="w-4 h-4" />}
            </div>
          </button>
        </div>

        {/* Or Speak Language Name */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            Or say <span className="font-semibold text-slate-700">"Kannada"</span>,{' '}
            <span className="font-semibold text-slate-700">"Hindi"</span>, or{' '}
            <span className="font-semibold text-slate-700">"English"</span>
          </p>

          <button
            onClick={handleSpeakSelection}
            disabled={isListeningForLang}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isListeningForLang
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{isListeningForLang ? 'Listening...' : 'Speak Language'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
