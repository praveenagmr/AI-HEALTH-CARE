/**
 * AI HEALTH CARE - Floating Animated Voice Assistant Widget
 */
import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronUp,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { SupportedLanguage } from '../../../database/schema.ts';
import { voiceAssistant } from '../services/voiceAssistant.ts';
import { TRANSLATIONS } from '../translations/index.ts';

interface VoiceAssistantFloatingBarProps {
  language: SupportedLanguage;
  pageContext: string;
  onVoiceResult?: (text: string) => void;
  guidanceText?: string;
  userId?: string;
}

export const VoiceAssistantFloatingBar: React.FC<VoiceAssistantFloatingBarProps> = ({
  language,
  pageContext,
  onVoiceResult,
  guidanceText,
  userId,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [latestTranscript, setLatestTranscript] = useState<string>('');

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const unsubscribe = voiceAssistant.subscribe(() => {
      setIsSpeaking(voiceAssistant.getIsSpeaking());
      setIsListening(voiceAssistant.getIsListening());
      setIsMuted(voiceAssistant.getIsMuted());

      const logs = voiceAssistant.getLogs();
      if (logs.length > 0) {
        setLatestTranscript(logs[0].text);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggleMic = () => {
    if (isListening) {
      voiceAssistant.stopListening();
    } else {
      voiceAssistant.listen({
        pageContext,
        userId,
        onInterim: (text) => setLatestTranscript(`... ${text}`),
        onResult: (text) => {
          setLatestTranscript(text);
          onVoiceResult?.(text);
        },
      });
    }
  };

  const handleReplayGuidance = () => {
    if (guidanceText) {
      voiceAssistant.speak(guidanceText, pageContext, { userId });
    }
  };

  const handleToggleMute = () => {
    voiceAssistant.setMute(!isMuted);
  };

  const langBadge =
    language === 'kn' ? 'ಕನ್ನಡ' : language === 'hi' ? 'हिंदी' : 'English';

  return (
    <aside
      aria-label="Voice Assistant Controls"
      className="fixed bottom-4 right-4 sm:right-6 z-40 max-w-md w-[calc(100%-2rem)] sm:w-auto"
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-3 sm:p-4 text-white shadow-2xl shadow-emerald-950/40 transition-all">
        {/* Header Bar */}
        <div className="flex items-center justify-between space-x-3">
          <div className="flex items-center space-x-2.5">
            {/* Glowing Pulse Avatar */}
            <div className="relative">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isSpeaking
                    ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/50 scale-105'
                    : isListening
                    ? 'bg-gradient-to-tr from-rose-500 to-amber-400 shadow-lg shadow-rose-500/50 animate-pulse'
                    : 'bg-emerald-800'
                }`}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {(isSpeaking || isListening) && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold tracking-wide text-emerald-400">
                  AI VOICE ASSISTANT
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {langBadge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isListening
                  ? 'Listening in ' + langBadge + '...'
                  : isSpeaking
                  ? 'Speaking clinical guidance...'
                  : 'Ready for voice interaction'}
              </p>
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex items-center space-x-1">
            {guidanceText && (
              <button
                onClick={handleReplayGuidance}
                title="Replay guidance speech"
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleToggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Body */}
        {!isCollapsed && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2.5">
            {/* Audio Waveform Animation when Speaking or Listening */}
            <div className="h-6 flex items-center justify-center space-x-1 bg-slate-950/60 rounded-lg px-3 py-1">
              {[4, 12, 18, 24, 14, 8, 22, 16, 26, 12, 6, 20, 10].map((h, idx) => (
                <span
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isSpeaking
                      ? 'bg-emerald-400'
                      : isListening
                      ? 'bg-rose-400'
                      : 'bg-slate-700'
                  }`}
                  style={{
                    height: isSpeaking || isListening ? `${(h * ((idx % 3) + 1.2)) % 22 + 4}px` : '4px',
                  }}
                />
              ))}
              <span className="text-[10px] text-slate-400 ml-2 font-mono">
                {isSpeaking ? 'VOICE ACTIVE' : isListening ? 'RECORDING' : 'STANDBY'}
              </span>
            </div>

            {/* Live Subtitle Transcript */}
            {latestTranscript && (
              <div className="p-2.5 rounded-xl bg-slate-800/90 text-xs text-slate-200 border border-slate-700/60 flex items-start space-x-2">
                <span className="text-emerald-400 font-bold shrink-0">🔊</span>
                <p className="line-clamp-2 leading-relaxed text-[11px] text-slate-200">
                  {latestTranscript}
                </p>
              </div>
            )}

            {/* Mic Action Trigger Button */}
            <button
              onClick={handleToggleMic}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse shadow-rose-600/30'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-700/30'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Listening... Tap to Complete</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>
                    Speak in {langBadge} ({t.page1.voiceButtonIdle.slice(0, 18)}...)
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
