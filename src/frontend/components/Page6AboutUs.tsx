/**
 * AI HEALTH CARE - Page 6: About Us
 * Detailed insights into the AI Health Care System, Clinical AI Architecture & Advanced Functions
 */
import React, { useEffect } from 'react';
import {
  Activity,
  Sparkles,
  ShieldCheck,
  Globe,
  Database,
  MapPin,
  Mic,
  Camera,
  HeartPulse,
  Award,
  Layers,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { SupportedLanguage } from '../../../database/schema.ts';
import { TRANSLATIONS } from '../translations/index.ts';
import { voiceAssistant } from '../services/voiceAssistant.ts';

interface Page6AboutUsProps {
  language: SupportedLanguage;
}

export const Page6AboutUs: React.FC<Page6AboutUsProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const timer = setTimeout(() => {
      voiceAssistant.speak(t.page6.voiceGuidance, 'page6_about');
    }, 400);
    return () => clearTimeout(timer);
  }, [language, t.page6.voiceGuidance]);

  const advancedCapabilities = [
    {
      icon: Mic,
      color: 'from-emerald-500 to-teal-600',
      title: 'Tri-Lingual Clinical AI Voice Engine',
      desc: 'Seamless speech synthesis and speech recognition natively supporting Kannada (ಕನ್ನಡ), Hindi (हिंदी), and English. Features automated voice form-filling, conversational health screening questionnaires, and voice-assisted medicine ordering.',
    },
    {
      icon: Camera,
      color: 'from-cyan-500 to-blue-600',
      title: 'Multimodal Clinical Vision & Report Intelligence',
      desc: 'Specialized deep neural screening for dermatology (skin), trichology (hair & scalp), dentistry (teeth & gums), ophthalmology (eye redness & strain), and general pathology. Accepts direct live device camera feeds and document uploads (PDF, DOCX, lab test scans).',
    },
    {
      icon: MapPin,
      color: 'from-rose-500 to-amber-600',
      title: 'GPS Auto-Location & Interactive Spatial Map Guidance',
      desc: 'Instant HTML5 Geolocation detection and OpenStreetMap reverse-geocoding, pairing patients with the nearest 24/7 super-specialty hospitals, trauma centers, and cold-chain pharmacies within minutes.',
    },
    {
      icon: ShieldCheck,
      color: 'from-indigo-500 to-purple-600',
      title: 'High-Grade Telecom OTP & Cryptographic Security',
      desc: 'Multi-factor authentication backed by SHA-256 and AES-GCM cipher encryption. Features automated SMS dispatch and session tracking to protect sensitive patient records.',
    },
    {
      icon: Database,
      color: 'from-teal-500 to-emerald-700',
      title: 'Full MongoDB Database Architecture',
      desc: 'Enterprise-grade persistence utilizing MongoDB driver for collections (users, sessions, screenings, voice_logs, and orders) with real-time audit vault synchronization.',
    },
    {
      icon: Layers,
      color: 'from-amber-500 to-orange-600',
      title: 'Real-Time Cold-Chain Order Tracking & Multi-Payment',
      desc: 'Direct ordering with live order tracking (Pharmacy Packed, GPS Driver Out for Delivery, ETA status) supporting UPI QR code generation, Cash on Delivery, Card tokenization, and Medical Insurance.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 border border-emerald-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Healthcare Ecosystem</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.page6.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
          {t.page6.subtitle}
        </p>
      </div>

      {/* Mission & Vision Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-12 relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <h2 className="text-2xl font-bold tracking-tight mb-3 flex items-center space-x-2.5">
            <HeartPulse className="w-6 h-6 text-emerald-400" />
            <span>{t.page6.missionTitle}</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            {t.page6.missionDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
            <div>
              <span className="text-2xl font-black text-emerald-400">100%</span>
              <span className="block text-slate-300 font-medium mt-0.5">Voice Auto-Filled & Screened</span>
            </div>
            <div>
              <span className="text-2xl font-black text-teal-400">3 Languages</span>
              <span className="block text-slate-300 font-medium mt-0.5">Kannada, Hindi & English</span>
            </div>
            <div>
              <span className="text-2xl font-black text-cyan-400">Live GPS</span>
              <span className="block text-slate-300 font-medium mt-0.5">Hospitals & Pharmacy Map</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Capabilities Grid */}
      <div className="mb-12">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {t.page6.featuresTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Engineered with modern frontend components, Express backend APIs, and MongoDB cloud storage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advancedCapabilities.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  <span>Integrated & Active</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compliance & Clinical Disclaimer */}
      <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 text-xs text-slate-600 leading-relaxed">
        <p className="font-bold text-slate-800 mb-1">
          ⚠️ Clinical Advisory & Medical Screening Scope:
        </p>
        <p>
          AI HEALTH CARE is an intelligent preliminary diagnostic screening platform designed to assist patients in identifying non-emergency dermatological, trichological, oral, ophthalmic, and general wellness symptoms. It does not replace emergency medical interventions or formal clinical biopsy examinations. For sudden acute distress, always consult qualified emergency medical professionals or dial national emergency services.
        </p>
      </div>
    </div>
  );
};
