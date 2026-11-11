/**
 * AI HEALTH CARE - Navigation Bar & Global Controls
 */
import React from 'react';
import {
  Activity,
  Globe,
  Volume2,
  VolumeX,
  LogOut,
  User,
  ShieldCheck,
  CheckCircle2,
  Info,
  Lock,
} from 'lucide-react';
import { SupportedLanguage, UserProfile } from '../../../database/schema.ts';
import { TRANSLATIONS } from '../translations/index.ts';

interface NavbarProps {
  currentPage: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  onNavigate: (page: 1 | 2 | 3 | 4 | 5 | 6 | 7) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  language,
  onLanguageChange,
  isMuted,
  onToggleMute,
  currentUser,
  onLogout,
}) => {
  const t = TRANSLATIONS[language];

  // Steps definition: Page 1-5, Page 6 (About Us), Page 7 (Admin Control - only if role === 'admin')
  const baseSteps = [
    { num: 1 as const, label: t.nav.page1 },
    { num: 2 as const, label: t.nav.page2 },
    { num: 3 as const, label: t.nav.page3 },
    { num: 4 as const, label: t.nav.page4 },
    { num: 5 as const, label: t.nav.page5 },
    { num: 6 as const, label: t.nav.page6 },
  ];

  const steps = currentUser?.role === 'admin'
    ? [...baseSteps, { num: 7 as const, label: t.nav.page7 }]
    : baseSteps;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate(currentUser ? 2 : 1)}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent">
                  {t.appName}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="w-3 h-3 mr-0.5" />
                  AI v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Multilingual Clinical Screening Engine
              </p>
            </div>
          </div>

          {/* Stepper Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {steps.map((step) => {
              const isActive = currentPage === step.num;
              const isPast = currentPage > step.num;
              const canClick = currentUser ? true : (step.num === 1 || step.num === 6);
              const isAdminTab = step.num === 7;

              return (
                <button
                  key={step.num}
                  disabled={!canClick}
                  onClick={() => onNavigate(step.num)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? isAdminTab
                        ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-400'
                        : 'bg-emerald-600 text-white shadow-xs'
                      : isAdminTab
                      ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold border border-rose-200'
                      : isPast
                      ? 'text-emerald-700 hover:bg-emerald-50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  } ${!canClick ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      isActive
                        ? 'bg-white text-slate-900'
                        : isAdminTab
                        ? 'bg-rose-200 text-rose-800'
                        : isPast
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isAdminTab ? '★' : isPast ? <CheckCircle2 className="w-3 h-3" /> : step.num}
                  </span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Tools: Language, Sound, User */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Selector Dropdown */}
            <div className="relative flex items-center">
              <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                aria-label={t.selectLanguage}
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                className="pl-8 pr-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-colors"
              >
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="en">English (US)</option>
              </select>
            </div>

            {/* Voice Sound Toggle */}
            <button
              onClick={onToggleMute}
              title={isMuted ? t.nav.unmute : t.nav.mute}
              className={`p-2 rounded-lg border transition-all ${
                isMuted
                  ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4 animate-bounce" />
              )}
            </button>

            {/* User Session Profile Badge */}
            {currentUser ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <div className="hidden sm:flex flex-col text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <span className="text-xs font-semibold text-slate-800 truncate max-w-[110px]">
                      {currentUser.name}
                    </span>
                    {currentUser.role === 'admin' && (
                      <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        Admin
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    +91 {currentUser.phone.slice(0, 5)}...
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title={t.nav.logout}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate(1)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.page1.tabLogin}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Stepper Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-100 space-x-2 no-scrollbar">
          {steps.map((step) => {
            const isActive = currentPage === step.num;
            return (
              <button
                key={step.num}
                onClick={() => onNavigate(step.num)}
                className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {step.num}. {step.label.split('.')[1] || step.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
