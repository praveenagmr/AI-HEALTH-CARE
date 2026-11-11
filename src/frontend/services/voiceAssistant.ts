/**
 * AI HEALTH CARE - Multilingual Voice Assistant Engine
 * Seamless Speech Synthesis (TTS) & Speech Recognition (STT) for Kannada, Hindi, and English
 */
import { SupportedLanguage } from '../../../database/schema.ts';

export interface VoiceLogEntry {
  id: string;
  speaker: 'assistant' | 'user';
  language: SupportedLanguage;
  text: string;
  timestamp: string;
  pageContext: string;
}

class VoiceAssistantService {
  private isMuted: boolean = false;
  private isSpeaking: boolean = false;
  private isListening: boolean = false;
  private currentLanguage: SupportedLanguage = 'en';
  private recognition: any = null;
  private logs: VoiceLogEntry[] = [];
  private listeners: Set<() => void> = new Set();
  private audioContext: AudioContext | null = null;

  constructor() {
    this.initRecognition();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded
      };
    }
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      } catch (e) {
        console.warn('SpeechRecognition initialization failed:', e);
      }
    }
  }

  public subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public setLanguage(lang: SupportedLanguage) {
    this.currentLanguage = lang;
    this.notify();
  }

  public getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted && typeof window !== 'undefined') {
      window.speechSynthesis?.cancel();
      this.isSpeaking = false;
    }
    this.notify();
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public getLogs(): VoiceLogEntry[] {
    return this.logs;
  }

  /**
   * Log an interaction locally and synchronize to backend
   */
  public logInteraction(
    speaker: 'assistant' | 'user',
    text: string,
    pageContext: string,
    userId: string = 'usr-current'
  ) {
    const entry: VoiceLogEntry = {
      id: `vlog-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      speaker,
      language: this.currentLanguage,
      text,
      timestamp: new Date().toISOString(),
      pageContext,
    };
    this.logs.unshift(entry);
    this.notify();

    // Sync to backend API
    fetch('/api/history/voice-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        speaker,
        language: this.currentLanguage,
        pageContext,
        text,
      }),
    }).catch((err) => console.warn('Failed to sync voice log to server:', err));
  }

  /**
   * Play a pleasant synthesized medical audio chime
   */
  private playMedicalChime(freq1 = 520, freq2 = 660) {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq1, now);
      osc.frequency.exponentialRampToValueAtTime(freq2, now + 0.15);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      // Audio context might be blocked by autoplay policies
    }
  }

  /**
   * Speak text in user's language using Web Speech API with fallback voice matching
   */
  public speak(
    text: string,
    pageContext: string = 'app',
    options?: { onStart?: () => void; onEnd?: () => void; userId?: string }
  ) {
    if (this.isMuted || typeof window === 'undefined' || !window.speechSynthesis) {
      options?.onEnd?.();
      return;
    }

    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    // Play subtle audio cue
    this.playMedicalChime(580, 780);

    const langCode =
      this.currentLanguage === 'kn'
        ? 'kn-IN'
        : this.currentLanguage === 'hi'
        ? 'hi-IN'
        : 'en-US';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = this.currentLanguage === 'kn' ? 0.92 : 0.96;
    utterance.pitch = 1.05;

    // Try finding the best available voice for this language
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) =>
        v.lang === langCode ||
        v.lang.startsWith(this.currentLanguage) ||
        (this.currentLanguage === 'kn' && (v.name.includes('Kannada') || v.lang.includes('kn') || v.lang === 'hi-IN')) ||
        (this.currentLanguage === 'hi' && (v.name.includes('Hindi') || v.lang.includes('hi')))
    );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.notify();
      options?.onStart?.();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.notify();
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.isSpeaking = false;
      this.notify();
      options?.onEnd?.();
    };

    // Log the spoken prompt
    this.logInteraction('assistant', text, pageContext, options?.userId);

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Start Speech-To-Text Recognition in the selected language
   */
  public listen(options: {
    pageContext: string;
    userId?: string;
    onInterim?: (text: string) => void;
    onResult: (finalText: string) => void;
    onError?: (err: any) => void;
  }): () => void {
    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      console.warn('SpeechRecognition is not supported by current browser.');
      options.onError?.('SpeechRecognition not supported');
      return () => {};
    }

    const langCode =
      this.currentLanguage === 'kn'
        ? 'kn-IN'
        : this.currentLanguage === 'hi'
        ? 'hi-IN'
        : 'en-US';

    this.recognition.lang = langCode;

    this.playMedicalChime(440, 560);
    this.isListening = true;
    this.notify();

    let finalTranscript = '';

    this.recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (interim && options.onInterim) {
        options.onInterim(interim);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.notify();
      if (finalTranscript.trim()) {
        this.logInteraction('user', finalTranscript.trim(), options.pageContext, options.userId);
        options.onResult(finalTranscript.trim());
      }
    };

    this.recognition.onerror = (event: any) => {
      console.warn('SpeechRecognition error:', event.error);
      this.isListening = false;
      this.notify();
      options.onError?.(event.error);
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('SpeechRecognition start failed or already active:', e);
    }

    // Return stop callback
    return () => {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
      this.notify();
    };
  }

  /**
   * Speak prompt and immediately activate speech recognition when speaking ends
   * Enables seamless conversational voice turns with zero manual typing
   */
  public speakAndListen(
    text: string,
    pageContext: string,
    onResult: (finalText: string) => void,
    options?: {
      userId?: string;
      onInterim?: (text: string) => void;
      onError?: (err: any) => void;
    }
  ): () => void {
    let cancelListen: (() => void) | null = null;
    this.speak(text, pageContext, {
      userId: options?.userId,
      onEnd: () => {
        setTimeout(() => {
          if (!this.isMuted) {
            cancelListen = this.listen({
              pageContext,
              userId: options?.userId,
              onInterim: options?.onInterim,
              onResult,
              onError: options?.onError,
            });
          }
        }, 200);
      },
    });

    return () => {
      this.stopSpeaking();
      if (cancelListen) cancelListen();
      this.stopListening();
    };
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
      this.notify();
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.notify();
    }
  }
}

export const voiceAssistant = new VoiceAssistantService();
