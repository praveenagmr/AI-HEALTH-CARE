/**
 * AI HEALTH CARE - Page 3: Health Screening Results & Real-Time Hospital / Pharmacy Map Guidance
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  MapPin,
  Navigation,
  Phone,
  Clock,
  Star,
  Hospital,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import L from 'leaflet';
import {
  SupportedLanguage,
  UserProfile,
  ScreeningFinding,
  NearbyMedicalFacility,
} from '../../../database/schema.ts';
import { TRANSLATIONS } from '../translations/index.ts';
import { voiceAssistant } from '../services/voiceAssistant.ts';
import { UploadedSourceState } from './Page2Upload.tsx';

interface Page3ScreeningProps {
  language: SupportedLanguage;
  currentUser: UserProfile | null;
  uploadedState: UploadedSourceState;
  activeScreening: ScreeningFinding | null;
  onSetScreening: (finding: ScreeningFinding) => void;
  onProceedToPage4: () => void;
}

export const Page3Screening: React.FC<Page3ScreeningProps> = ({
  language,
  currentUser,
  uploadedState,
  activeScreening,
  onSetScreening,
  onProceedToPage4,
}) => {
  const t = TRANSLATIONS[language];

  const hasUploadedSource = Boolean(
    uploadedState.reportFile || uploadedState.photoFile
  );

  const [loading, setLoading] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  // Nearby Hospitals & Pharmacies State
  const [nearbyFacilities, setNearbyFacilities] = useState<NearbyMedicalFacility[]>([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState<'all' | 'hospital' | 'pharmacy'>('all');
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Voice Assessment Questionnaire State (Mode B: when no source uploaded)
  const [voiceAnswers, setVoiceAnswers] = useState({
    symptomArea: '',
    durationDays: '',
    painLevel: '',
    triggers: '',
  });
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [isListeningForQuestion, setIsListeningForQuestion] = useState(false);

  const userLat = currentUser?.location?.latitude || 12.9716;
  const userLng = currentUser?.location?.longitude || 77.5946;

  // On mount: if source exists and no active screening yet, run analysis
  useEffect(() => {
    if (hasUploadedSource && !activeScreening) {
      runSourceAnalysis();
    } else if (!hasUploadedSource && !activeScreening) {
      // Announce voice screening mode
      const prompt =
        language === 'kn'
          ? 'ನೀವು ಯಾವುದೇ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿಲ್ಲ. ನಾನು ನಿಮ್ಮ ಆರೋಗ್ಯ ತಪಾಸಣೆಯನ್ನು ಧ್ವನಿ ಮೂಲಕ ನಡೆಸುತ್ತೇನೆ. ದಯವಿಟ್ಟು ಮೊದಲ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಿ: ನಿಮ್ಮ ಸಮಸ್ಯೆ ದೇಹದ ಯಾವ ಭಾಗದಲ್ಲಿದೆ?'
          : language === 'hi'
          ? 'आपने कोई फाइल अपलोड नहीं की है। मैं वॉयस असिस्टेंट द्वारा आपकी स्वास्थ्य जांच करूँगा। कृपया बताएं कि समस्या शरीर के किस हिस्से में है?'
          : 'No uploaded source detected. I will conduct an automatic voice health screening. Please speak: what area of your body is affected?';

      voiceAssistant.speak(prompt, 'page3_screening', {
        userId: currentUser?.id,
        onEnd: () => {
          handleVoiceAnswerQuestion(0);
        },
      });
    }
  }, [hasUploadedSource]);

  // Fetch Nearby Facilities when activeScreening is available
  useEffect(() => {
    if (activeScreening) {
      fetchNearbyFacilities();
    }
  }, [activeScreening]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (nearbyFacilities.length > 0 && mapContainerRef.current && !mapInstanceRef.current) {
      try {
        const map = L.map(mapContainerRef.current).setView([userLat, userLng], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Custom User Location Pin
        const userIcon = L.divIcon({
          className: 'custom-user-pin',
          html: `<div style="background-color: #059669; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(5,150,105,0.8);"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        L.marker([userLat, userLng], { icon: userIcon })
          .addTo(map)
          .bindPopup(`<b>Your Current Location</b><br/>${currentUser?.location?.city || 'Bangalore'}`)
          .openPopup();

        // Add Facility Markers
        nearbyFacilities.forEach((fac) => {
          const isHosp = fac.type === 'hospital' || fac.type === 'clinic';
          const facIcon = L.divIcon({
            className: 'custom-fac-pin',
            html: `<div style="background-color: ${isHosp ? '#e11d48' : '#0284c7'}; width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">${isHosp ? 'H' : 'Rx'}</div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });

          L.marker([fac.latitude, fac.longitude], { icon: facIcon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: sans-serif; font-size: 12px;">
                <b style="font-size: 13px; color: #0f172a;">${fac.name}</b><br/>
                <span style="color: #059669; font-weight: bold;">${fac.distanceKm} km away</span> • Rating: ${fac.rating} ★<br/>
                <span style="color: #64748b;">${fac.address}</span><br/>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${fac.latitude},${fac.longitude}" target="_blank" style="color: #0284c7; font-weight: bold; text-decoration: underline; display: inline-block; margin-top: 4px;">Get Directions ↗</a>
              </div>
            `);
        });

        mapInstanceRef.current = map;
      } catch (err) {
        console.warn('Leaflet map initialization notice:', err);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [nearbyFacilities]);

  const fetchNearbyFacilities = async () => {
    try {
      const res = await fetch(
        `/api/screening/nearby-facilities?lat=${userLat}&lng=${userLng}&category=${activeScreening?.category || 'skin'}`
      );
      const data = await res.json();
      if (data.success && data.facilities) {
        setNearbyFacilities(data.facilities);
      }
    } catch (err) {
      console.warn('Nearby facilities fetch error:', err);
    }
  };

  // Run Multimodal Analysis from Uploaded Source (Mode A)
  const runSourceAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/screening/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id || 'usr-guest',
          categoryHint: uploadedState.selectedCategory,
          photoBase64: uploadedState.photoFile?.dataUrl,
          photoName: uploadedState.photoFile?.name,
          reportText: uploadedState.reportFile?.content,
          reportName: uploadedState.reportFile?.name,
          userPreferredLanguage: language,
        }),
      });

      const data = await res.json();
      if (data.success && data.screening) {
        onSetScreening(data.screening);

        // Speak the resulting screened info out loud to the user
        const spokenResult =
          data.screening.localizedSummary?.[language] ||
          data.screening.clinicalSummary;

        setIsReadingAloud(true);
        voiceAssistant.speak(spokenResult, 'page3_screening', {
          userId: currentUser?.id,
          onEnd: () => setIsReadingAloud(false),
        });
      }
    } catch (e) {
      console.error('Screening analysis failed:', e);
    } finally {
      setLoading(false);
    }
  };

  // Voice Questionnaire Auto-Fill (No Manual Typing Required)
  const handleVoiceAnswerQuestion = (qIndex: number) => {
    setActiveQuestionIdx(qIndex);
    setIsListeningForQuestion(true);

    voiceAssistant.listen({
      pageContext: 'page3_screening',
      userId: currentUser?.id,
      onResult: async (text) => {
        setIsListeningForQuestion(false);

        // Update answers automatically
        const newAnswers = { ...voiceAnswers };
        if (qIndex === 0) newAnswers.symptomArea = text;
        else if (qIndex === 1) newAnswers.durationDays = text;
        else if (qIndex === 2) newAnswers.painLevel = text;
        else if (qIndex === 3) newAnswers.triggers = text;

        setVoiceAnswers(newAnswers);

        // Directly prompt next question or auto-submit
        if (qIndex < 3) {
          const nextQuestions = [
            t.page3.voiceQuestionnaire.question1,
            t.page3.voiceQuestionnaire.question2,
            t.page3.voiceQuestionnaire.question3,
            t.page3.voiceQuestionnaire.question4,
          ];
          setActiveQuestionIdx(qIndex + 1);
          voiceAssistant.speak(nextQuestions[qIndex + 1], 'page3_screening', {
            onEnd: () => {
              // Seamlessly auto-listen for next answer without user having to click
              handleVoiceAnswerQuestion(qIndex + 1);
            },
          });
        } else {
          // As requested: "after filling the question of the required health issues by voice assistant it should directly submit the voice assessment"
          voiceAssistant.speak(
            language === 'kn'
              ? 'ಧನ್ಯವಾದಗಳು! ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಪಡೆದುಕೊಂಡಿದ್ದೇನೆ. ತಪಾಸಣೆಯನ್ನು ನೇರವಾಗಿ ಸಲ್ಲಿಸುತ್ತಿದ್ದೇನೆ.'
              : language === 'hi'
              ? 'धन्यवाद! सभी विवरण प्राप्त हो गए हैं। स्वास्थ्य जांच सीधे सबमिट की जा रही है।'
              : 'Thank you! Details recorded. Submitting your voice assessment directly.',
            'page3_screening',
            {
              onEnd: () => {
                handleSubmitVoiceAssessment(newAnswers);
              },
            }
          );
        }
      },
      onError: () => setIsListeningForQuestion(false),
    });
  };

  // Submit Voice Assessment
  const handleSubmitVoiceAssessment = async (answers = voiceAnswers) => {
    setLoading(true);
    try {
      const res = await fetch('/api/screening/voice-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id || 'usr-guest',
          category: uploadedState.selectedCategory || 'skin',
          userPreferredLanguage: language,
          answers,
        }),
      });

      const data = await res.json();
      if (data.success && data.screening) {
        onSetScreening(data.screening);

        const spokenResult =
          data.screening.localizedSummary?.[language] ||
          data.screening.clinicalSummary;

        setIsReadingAloud(true);
        voiceAssistant.speak(spokenResult, 'page3_screening', {
          userId: currentUser?.id,
          onEnd: () => {
            setIsReadingAloud(false);
            // Announce voice command to proceed
            setTimeout(() => {
              const proceedHint =
                language === 'kn'
                  ? 'ಔಷಧಿಗಳನ್ನು ವೀಕ್ಷಿಸಲು "ಮುಂದೆ" ಎಂದು ಹೇಳಿ ಅಥವಾ ಬಟನ್ ಒತ್ತಿ.'
                  : language === 'hi'
                  ? 'दवाएं देखने के लिए "आगे" बोलें या बटन दबाएं।'
                  : 'Say "Proceed" or tap the button to view recommended medicines.';
              voiceAssistant.speak(proceedHint, 'page3_screening');
            }, 500);
          },
        });
      }
    } catch (e) {
      console.error('Voice assessment submit error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Voice Command for Page 3 Screen
  const handleStartPage3Voice = () => {
    const prompt =
      language === 'kn'
        ? 'ತಪಾಸಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ. ಶಿಫಾರಸು ಮಾಡಿದ ಔಷಧಿಗಳನ್ನು ನೋಡಲು "ಮುಂದೆ" ಹೇಳಿ.'
        : language === 'hi'
        ? 'जांच पूरी हो गई है। सुझाई गई दवाएं देखने के लिए "आगे" बोलें।'
        : 'Say "Medicines" or "Proceed" to continue to medicines and order.';

    voiceAssistant.speakAndListen(prompt, 'page3_screening', (speech) => {
      const lower = speech.toLowerCase();
      if (
        lower.includes('medicine') ||
        lower.includes('proceed') ||
        lower.includes('next') ||
        lower.includes('ಮುಂದೆ') ||
        lower.includes('ಔಷಧ') ||
        lower.includes('दवा') ||
        lower.includes('आगे')
      ) {
        onProceedToPage4();
      }
    });
  };

  const filteredFacilities = nearbyFacilities.filter((f) => {
    if (selectedFacilityType === 'all') return true;
    if (selectedFacilityType === 'hospital') return f.type === 'hospital' || f.type === 'clinic';
    if (selectedFacilityType === 'pharmacy') return f.type === 'pharmacy';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.page3.title}
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          {t.page3.subtitle}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-slate-200 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <Activity className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            AI Multilingual Clinical Screening in Progress...
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Analyzing symptoms, medical references, and geolocated hospital recommendations.
          </p>
        </div>
      )}

      {/* SCREENING RESULT DISPLAY */}
      {!loading && activeScreening && (
        <div className="space-y-8">
          {/* Voice Reading Out Indicator Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <Volume2 className={`w-5 h-5 ${isReadingAloud ? 'animate-bounce text-emerald-400' : ''}`} />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  {isReadingAloud ? t.page3.voiceReadingOut : 'Voice Assistant Spoken Briefing'}
                </span>
                <span className="text-xs text-slate-300">
                  Spoken in {language === 'kn' ? 'ಕನ್ನಡ' : language === 'hi' ? 'हिंदी' : 'English'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const spoken =
                  activeScreening.localizedSummary?.[language] ||
                  activeScreening.clinicalSummary;
                setIsReadingAloud(true);
                voiceAssistant.speak(spoken, 'page3_screening', {
                  userId: currentUser?.id,
                  onEnd: () => setIsReadingAloud(false),
                });
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Listen Again</span>
            </button>
          </div>

          {/* Main Clinical Finding Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Target Scope: {activeScreening.category} Health
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {activeScreening.conditionName}
                </h2>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Severity: {activeScreening.severity.toUpperCase()}
                </span>
                <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
                  Confidence: {activeScreening.confidenceScore}%
                </div>
              </div>
            </div>

            {/* Localized Spoken Explanation Box */}
            <div className="my-6 p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>
                  {language === 'kn'
                    ? 'ಧ್ವನಿ ಸಹಾಯಕಿಯ ವಿವರಣೆ (ಕನ್ನಡ)'
                    : language === 'hi'
                    ? 'वॉयस असिस्टेंट का विवरण (हिंदी)'
                    : 'Voice Assistant Briefing (English)'}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">
                {activeScreening.localizedSummary?.[language] || activeScreening.clinicalSummary}
              </p>
            </div>

            {/* Symptoms & Recommended Care */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  {t.page3.symptomsObserved}
                </h3>
                <ul className="space-y-2">
                  {activeScreening.symptomsObserved.map((symptom, i) => (
                    <li
                      key={i}
                      className="flex items-center space-x-2.5 text-xs font-medium text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  {t.page3.recommendedCare}
                </h3>
                <ul className="space-y-2">
                  {activeScreening.recommendedCare.map((care, i) => (
                    <li
                      key={i}
                      className="flex items-center space-x-2.5 text-xs font-medium text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{care}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* NEAREST HOSPITALS & MEDICINE STORES WITH REAL MAP GUIDANCE */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <Hospital className="w-5 h-5 text-rose-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Nearest Hospitals & Medicine Stores with Live Map Guidance
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time GPS geolocated facilities around {currentUser?.location?.city || 'your area'}
                </p>
              </div>

              {/* Filter Tabs: All, Hospitals, Pharmacies */}
              <div className="flex p-1 bg-slate-100 rounded-xl space-x-1">
                <button
                  onClick={() => setSelectedFacilityType('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedFacilityType === 'all'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Facilities ({nearbyFacilities.length})
                </button>
                <button
                  onClick={() => setSelectedFacilityType('hospital')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedFacilityType === 'hospital'
                      ? 'bg-white text-rose-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hospitals
                </button>
                <button
                  onClick={() => setSelectedFacilityType('pharmacy')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedFacilityType === 'pharmacy'
                      ? 'bg-white text-blue-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pharmacies (24/7)
                </button>
              </div>
            </div>

            {/* Interactive Leaflet Map Viewport */}
            <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
              <div
                ref={mapContainerRef}
                className="w-full h-72 sm:h-80 bg-slate-100"
              />
            </div>

            {/* Facility Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFacilities.map((fac) => {
                const isHospital = fac.type === 'hospital' || fac.type === 'clinic';
                return (
                  <div
                    key={fac.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all bg-slate-50/60 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 font-bold text-xs ${
                              isHospital ? 'bg-rose-600' : 'bg-sky-600'
                            }`}
                          >
                            {isHospital ? <Hospital className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              {fac.name}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {fac.specialty}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                          {fac.distanceKm} km
                        </span>
                      </div>

                      <div className="mt-3 space-y-1 text-[11px] text-slate-600">
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{fac.address}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{fac.openHours}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a href={`tel:${fac.phone}`} className="text-emerald-700 font-bold hover:underline">
                            {fac.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Action link: Google Maps Directions */}
                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-amber-600 font-bold flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{fac.rating} / 5.0</span>
                      </span>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${fac.latitude},${fac.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center space-x-1"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Directions ↗</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Proceed Action Button (Directly Moves to Page 4) */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Screening ID: {activeScreening.id} (Saved to MongoDB and Audit Records)
              </span>

              <button
                onClick={onProceedToPage4}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center justify-center space-x-3 transition-all cursor-pointer shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95"
              >
                <span>{t.page3.proceedToMedicines}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE B: INTERACTIVE AI VOICE QUESTIONNAIRE (No manual typing required) */}
      {!loading && !activeScreening && !hasUploadedSource && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {t.page3.voiceModeTitle}
              </h2>
              <p className="text-xs text-slate-500">
                100% Voice Auto-Filled Health Screening (No manual typing needed)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Question 1 */}
            <div className={`p-4 rounded-2xl border transition-all ${
              activeQuestionIdx === 0
                ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">
                  {t.page3.voiceQuestionnaire.question1}
                </span>
                <button
                  type="button"
                  onClick={() => handleVoiceAnswerQuestion(0)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    isListeningForQuestion && activeQuestionIdx === 0
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>
                    {isListeningForQuestion && activeQuestionIdx === 0
                      ? 'Listening...'
                      : 'Speak Answer'}
                  </span>
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={voiceAnswers.symptomArea}
                placeholder="Voice auto-filled: Speak your symptom location"
                className="w-full px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium cursor-not-allowed"
              />
            </div>

            {/* Question 2 */}
            <div className={`p-4 rounded-2xl border transition-all ${
              activeQuestionIdx === 1
                ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">
                  {t.page3.voiceQuestionnaire.question2}
                </span>
                <button
                  type="button"
                  onClick={() => handleVoiceAnswerQuestion(1)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    isListeningForQuestion && activeQuestionIdx === 1
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>
                    {isListeningForQuestion && activeQuestionIdx === 1
                      ? 'Listening...'
                      : 'Speak Answer'}
                  </span>
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={voiceAnswers.durationDays}
                placeholder="Voice auto-filled: Speak how many days"
                className="w-full px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium cursor-not-allowed"
              />
            </div>

            {/* Question 3 */}
            <div className={`p-4 rounded-2xl border transition-all ${
              activeQuestionIdx === 2
                ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">
                  {t.page3.voiceQuestionnaire.question3}
                </span>
                <button
                  type="button"
                  onClick={() => handleVoiceAnswerQuestion(2)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    isListeningForQuestion && activeQuestionIdx === 2
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>
                    {isListeningForQuestion && activeQuestionIdx === 2
                      ? 'Listening...'
                      : 'Speak Answer'}
                  </span>
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={voiceAnswers.painLevel}
                placeholder="Voice auto-filled: Speak pain or itch intensity"
                className="w-full px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium cursor-not-allowed"
              />
            </div>

            {/* Question 4 */}
            <div className={`p-4 rounded-2xl border transition-all ${
              activeQuestionIdx === 3
                ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">
                  {t.page3.voiceQuestionnaire.question4}
                </span>
                <button
                  type="button"
                  onClick={() => handleVoiceAnswerQuestion(3)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    isListeningForQuestion && activeQuestionIdx === 3
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>
                    {isListeningForQuestion && activeQuestionIdx === 3
                      ? 'Listening...'
                      : 'Speak Answer'}
                  </span>
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={voiceAnswers.triggers}
                placeholder="Voice auto-filled: Speak any medications or allergies"
                className="w-full px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
