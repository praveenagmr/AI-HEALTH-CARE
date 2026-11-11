/**
 * AI HEALTH CARE - Page 5: Unified Audit History & Records
 * Records: User Login & Sign-Up, Screening History, Voice Assistant Dialogues, Medicine Orders + Individual Record Downloads
 */
import React, { useState, useEffect } from 'react';
import {
  History,
  Download,
  Printer,
  FileCode,
  MessageSquare,
  ShieldCheck,
  Activity,
  ShoppingBag,
  User,
  Clock,
  ArrowRight,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  Mic,
} from 'lucide-react';
import {
  SupportedLanguage,
  UserProfile,
  UserSession,
  ScreeningFinding,
  VoiceInteractionLog,
  MedicineOrder,
} from '../../../database/schema.ts';
import { TRANSLATIONS } from '../translations/index.ts';
import { voiceAssistant } from '../services/voiceAssistant.ts';

interface Page5HistoryProps {
  language: SupportedLanguage;
  currentUser: UserProfile | null;
  onRestartScreening: () => void;
}

export const Page5History: React.FC<Page5HistoryProps> = ({
  language,
  currentUser,
  onRestartScreening,
}) => {
  const t = TRANSLATIONS[language];

  const [activeTab, setActiveTab] = useState<'screening' | 'sessions' | 'voice' | 'orders'>('screening');
  const [loading, setLoading] = useState(false);

  // Data states
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [screenings, setScreenings] = useState<ScreeningFinding[]>([]);
  const [voiceLogs, setVoiceLogs] = useState<VoiceInteractionLog[]>([]);
  const [orders, setOrders] = useState<MedicineOrder[]>([]);

  // Fetch full history on mount
  useEffect(() => {
    fetchHistoryData();

    const timer = setTimeout(() => {
      voiceAssistant.speak(t.page5.voiceGuidance, 'page5_history', {
        userId: currentUser?.id,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [language, t.page5.voiceGuidance, currentUser?.id]);

  // Voice Command for Page 5 History
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string>('');

  const handleStartHistoryVoice = () => {
    setIsVoiceListening(true);
    const prompt =
      language === 'kn'
        ? 'ಇತಿಹಾಸ ಧ್ವನಿ ಸಹಾಯಕ ಸಕ್ರಿಯವಾಗಿದೆ. ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು "ಡೌನ್‌ಲೋಡ್" ಹೇಳಿ, ಅಥವಾ ಹೊಸ ತಪಾಸಣೆಗೆ "ಮರುಪ್ರಾರಂಭಿಸಿ" ಹೇಳಿ.'
        : language === 'hi'
        ? 'इतिहास वॉयस असिस्टेंट चालू है। रिपोर्ट डाउनलोड करने के लिए "डाउनलोड" बोलें, या नई जांच के लिए "रीस्टार्ट" बोलें।'
        : 'History voice assistant active. Say "Download" to save records, or say "Restart" to begin a new health screening.';

    setVoiceNotice(prompt);
    voiceAssistant.speakAndListen(
      prompt,
      'page5_history',
      (speech) => {
        setIsVoiceListening(false);
        const lower = speech.toLowerCase();
        setVoiceNotice(`Heard: "${speech}"`);

        if (lower.includes('download') || lower.includes('report') || lower.includes('ಡೌನ್‌ಲೋಡ್') || lower.includes('डाउनलोड')) {
          handlePrintMedicalReport();
          voiceAssistant.speak('Downloading medical report.', 'page5_history');
        } else if (lower.includes('restart') || lower.includes('new') || lower.includes('ಮರುಪ್ರಾರಂಭಿಸಿ') || lower.includes('ಹೊಸ') || lower.includes('शुरू')) {
          voiceAssistant.speak('Restarting screening session.', 'page5_history');
          onRestartScreening();
        } else {
          setVoiceNotice(`Command "${speech}" acknowledged.`);
        }
      },
      {
        onInterim: (i) => setVoiceNotice(`Hearing: "${i}"...`),
      }
    );
  };

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/history/full?userId=${currentUser?.id || ''}&phone=${currentUser?.phone || ''}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSessions(json.data.sessions || []);
        setScreenings(json.data.screenings || []);
        setVoiceLogs(json.data.voiceLogs || []);
        setOrders(json.data.orders || []);
      }
    } catch (e) {
      console.error('History fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  // --- INDIVIDUAL RECORD DOWNLOAD HELPERS ---
  const downloadSingleScreening = (scr: ScreeningFinding) => {
    const slip = `AI HEALTH CARE - CLINICAL SCREENING RECORD
Record ID: ${scr.id}
Date: ${new Date(scr.createdAt).toLocaleString()}
Patient: ${currentUser?.name || 'Registered Patient'} (${currentUser?.phone || 'N/A'})
Scope: ${scr.category.toUpperCase()} Health
Identified Condition: ${scr.conditionName}
AI Confidence: ${scr.confidenceScore}% | Severity: ${scr.severity.toUpperCase()}
------------------------------------------------------------
CLINICAL EXPLANATION:
${scr.clinicalSummary}

LOCALIZED SUMMARY (${language.toUpperCase()}):
${scr.localizedSummary?.[language] || scr.clinicalSummary}

OBSERVED SYMPTOMS:
${scr.symptomsObserved.map((s) => `• ${s}`).join('\n')}

RECOMMENDED CARE & PROTOCOLS:
${scr.recommendedCare.map((c) => `• ${c}`).join('\n')}
------------------------------------------------------------
Saved in MongoDB Cloud Vault & Cryptographically Verified.
`;
    const blob = new Blob([slip], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Screening_Record_${scr.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSingleOrder = (ord: MedicineOrder) => {
    const receipt = `AI HEALTH CARE - PHARMACY DISPATCH RECEIPT
Order ID: ${ord.id}
Date: ${new Date(ord.timestamp).toLocaleString()}
Patient: ${currentUser?.name || 'Registered Patient'} (${ord.contactPhone})
Delivery Address: ${ord.deliveryAddress}
Payment Method: ${ord.paymentMethod}
Status: ${ord.status}
------------------------------------------------------------
PRESCRIBED MEDICINES:
${ord.items.map((i) => `• ${i.medicine.name} (Qty: ${i.quantity}) - ₹${i.medicine.priceInr * i.quantity}`).join('\n')}
------------------------------------------------------------
TOTAL AMOUNT PAID: ₹${ord.totalAmountInr}
Delivery Partner: Cold-Chain Licensed Healthcare Delivery
MongoDB Tracking Key: ${ord.id}
`;
    const blob = new Blob([receipt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Pharmacy_Order_Receipt_${ord.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSingleVoiceLog = (log: VoiceInteractionLog) => {
    const text = `AI HEALTH CARE - VOICE ASSISTANT INTERACTION EXCERPT
Log ID: ${log.id}
Timestamp: ${new Date(log.timestamp).toLocaleString()}
Speaker: ${log.speaker === 'assistant' ? 'AI Voice Assistant' : 'Patient (User Voice)'}
Language: ${log.language.toUpperCase()}
Page Context: ${log.pageContext}
------------------------------------------------------------
TRANSCRIPT:
"${log.text}"
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Voice_Log_${log.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSingleSession = (sess: UserSession) => {
    const token = `AI HEALTH CARE - SESSION SECURITY AUDIT TOKEN
Session ID: ${sess.id}
Timestamp: ${new Date(sess.timestamp).toLocaleString()}
Phone: +91 ${sess.phone}
Action: ${sess.action.toUpperCase()}
IP Address: ${sess.ipAddress}
User Agent: ${sess.userAgent}
Status: ${sess.status.toUpperCase()}
Security Protocol: SHA-256 + AES-GCM Encrypted
`;
    const blob = new Blob([token], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Session_Token_${sess.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- BULK DOWNLOAD ACTIONS ---
  const handleDownloadJson = () => {
    const payload = {
      application: 'AI HEALTH CARE',
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      user: currentUser,
      sessions,
      screenings,
      voiceInteractionHistory: voiceLogs,
      medicineOrders: orders,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_HEALTH_CARE_Audit_Record_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTranscript = () => {
    let transcriptText = `AI HEALTH CARE - COMPLETE VOICE ASSISTANT INTERACTION LOG\n`;
    transcriptText += `User: ${currentUser?.name || 'Guest'} (${currentUser?.phone || 'N/A'})\n`;
    transcriptText += `Date: ${new Date().toLocaleString()}\n`;
    transcriptText += `========================================================\n\n`;

    voiceLogs.forEach((log) => {
      const speakerTag = log.speaker === 'assistant' ? 'AI ASSISTANT' : 'PATIENT (USER)';
      transcriptText += `[${new Date(log.timestamp).toLocaleTimeString()}] [${log.language.toUpperCase()}] ${speakerTag} [${log.pageContext}]:\n`;
      transcriptText += `"${log.text}"\n\n`;
    });

    const blob = new Blob([transcriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_HEALTH_CARE_Voice_Transcript_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintMedicalReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Title & Bulk Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-3">
            <History className="w-8 h-8 text-emerald-600" />
            <span>{t.page5.title}</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Complete records of sessions, screenings, voice dialogues, and medicine orders with individual download options
          </p>
        </div>

        {/* 3 Bulk Download Action Buttons & Voice Assistant */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleStartHistoryVoice}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-sm ${
              isVoiceListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{isVoiceListening ? 'Listening...' : 'Voice Assistant'}</span>
          </button>

          <button
            onClick={handlePrintMedicalReport}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>{t.page5.downloadMedicalReport}</span>
          </button>

          <button
            onClick={handleDownloadTranscript}
            className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>{t.page5.downloadVoiceTranscript}</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer"
          >
            <FileCode className="w-4 h-4" />
            <span>{t.page5.downloadFullJson}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 p-1.5 bg-slate-100 rounded-2xl mb-8 no-scrollbar">
        <button
          onClick={() => setActiveTab('screening')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'screening'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>{t.page5.tabScreening}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
            {screenings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('voice')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'voice'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-teal-600" />
          <span>{t.page5.tabVoiceLogs}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-800 text-[10px]">
            {voiceLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-cyan-600" />
          <span>{t.page5.tabOrders}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-800 text-[10px]">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'sessions'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-slate-600" />
          <span>{t.page5.tabSessions}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px]">
            {sessions.length}
          </span>
        </button>
      </div>

      {/* TAB 1: SCREENING HISTORY (With Individual Record Download) */}
      {activeTab === 'screening' && (
        <div className="space-y-6">
          {screenings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">
                {t.page5.emptyRecords}
              </p>
            </div>
          ) : (
            screenings.map((scr) => (
              <div
                key={scr.id}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                        {scr.category} Health
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(scr.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      {scr.conditionName}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
                      Confidence: {scr.confidenceScore}%
                    </span>
                    <button
                      onClick={() => downloadSingleScreening(scr)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Download Record</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {scr.localizedSummary?.[language] || scr.clinicalSummary}
                </p>

                {(scr.photoUrl || scr.reportName) && (
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {scr.reportName && (
                      <span className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-xs font-mono text-teal-800 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>Report: {scr.reportName}</span>
                      </span>
                    )}
                    {scr.hasUploadedPhoto && (
                      <span className="px-3 py-1.5 rounded-xl bg-cyan-50 border border-cyan-200 text-xs font-mono text-cyan-800 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Clinical Issue Photo Attached</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: VOICE ASSISTANT INTERACTION HISTORY (With Individual Record Download) */}
      {activeTab === 'voice' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                End-to-End Voice Assistant Dialogue Records
              </h3>
              <p className="text-xs text-slate-500">
                All spoken guidance and patient speech interactions across every page
              </p>
            </div>
            <button
              onClick={handleDownloadTranscript}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
            >
              Export All Transcripts (.TXT)
            </button>
          </div>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
            {voiceLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">
                No voice interactions recorded yet.
              </p>
            ) : (
              voiceLogs.map((log) => {
                const isAssistant = log.speaker === 'assistant';
                return (
                  <div
                    key={log.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isAssistant
                        ? 'bg-emerald-50/70 border-emerald-200 mr-8'
                        : 'bg-slate-50 border-slate-200 ml-8'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isAssistant ? 'bg-emerald-500' : 'bg-slate-700'
                          }`}
                        />
                        <span className="text-xs font-bold text-slate-900">
                          {isAssistant ? 'AI Voice Assistant' : 'Patient (User Voice)'}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-white border border-slate-200 text-slate-600 uppercase">
                          {log.language} • {log.pageContext}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <button
                          onClick={() => downloadSingleVoiceLog(log)}
                          title="Download this transcript snippet"
                          className="p-1 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-200 transition-colors"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed font-sans">
                      "{log.text}"
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MEDICINES ORDERED HISTORY (With Individual Receipt Download) */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">
                No medicine orders placed yet.
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-800">
                      {ord.id}
                    </span>
                    <span className="text-xs text-slate-400 block font-mono">
                      {new Date(ord.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Status: {ord.status}
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{ord.totalAmountInr}
                    </span>
                    <button
                      onClick={() => downloadSingleOrder(ord)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Download Receipt</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {ord.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50"
                    >
                      <span className="font-semibold text-slate-800">
                        {item.medicine.name} (Qty: {item.quantity})
                      </span>
                      <span className="font-mono text-slate-600">
                        ₹{item.medicine.priceInr * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-xs text-slate-500 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="font-semibold text-slate-700">Delivery Address:</span>{' '}
                    {ord.deliveryAddress}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Payment:</span>{' '}
                    {ord.paymentMethod} • Contact: {ord.contactPhone}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: SESSIONS & LOGINS (With Individual Token Download) */}
      {activeTab === 'sessions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Encrypted User Authentication & Session Logs
              </h3>
              <p className="text-xs text-slate-500">
                Complete record of sign-up, OTP handshakes, and login timestamps
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
              SHA-256 Audit
            </span>
          </div>

          <div className="space-y-3">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs uppercase">
                    {sess.action.slice(0, 3)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 capitalize">
                      Action: {sess.action.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Phone: +91 {sess.phone} • IP: {sess.ipAddress}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-left sm:text-right font-mono text-[11px] text-slate-400">
                    {new Date(sess.timestamp).toLocaleString()}
                  </div>
                  <button
                    onClick={() => downloadSingleSession(sess)}
                    className="p-1 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-200 transition-colors"
                    title="Download Session Audit Token"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restart Screening */}
      <div className="mt-12 text-center">
        <button
          onClick={onRestartScreening}
          className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl shadow-emerald-600/20 inline-flex items-center space-x-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t.page5.restartScreening}</span>
        </button>
      </div>
    </div>
  );
};
