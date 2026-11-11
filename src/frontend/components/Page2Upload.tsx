/**
 * AI HEALTH CARE - Page 2: Multimodal Health Source Uploading
 * Left Side: Patient Recent Health Report | Right Side: Health Issue Photo with Direct Live Camera Option
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Camera,
  Upload,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Info,
  Sparkles,
  Eye,
  Scissors,
  Smile,
  X,
  RotateCw,
  Video,
  Mic,
} from 'lucide-react';
import {
  SupportedLanguage,
  HealthCategory,
  UserProfile,
} from '../../../database/schema.ts';
import { TRANSLATIONS } from '../translations/index.ts';
import { voiceAssistant } from '../services/voiceAssistant.ts';
import { SAMPLE_REPORTS, SAMPLE_PHOTOS } from '../../../database/seedData.ts';

export interface UploadedSourceState {
  reportFile: {
    name: string;
    type: string;
    content: string;
  } | null;
  photoFile: {
    name: string;
    dataUrl: string;
    category: HealthCategory;
  } | null;
  selectedCategory: HealthCategory;
}

interface Page2UploadProps {
  language: SupportedLanguage;
  currentUser: UserProfile | null;
  uploadedState: UploadedSourceState;
  onUpdateUploadedState: (state: UploadedSourceState) => void;
  onProceedToPage3: () => void;
}

export const Page2Upload: React.FC<Page2UploadProps> = ({
  language,
  currentUser,
  uploadedState,
  onUpdateUploadedState,
  onProceedToPage3,
}) => {
  const t = TRANSLATIONS[language];

  const [selectedCategory, setSelectedCategory] = useState<HealthCategory>(
    uploadedState.selectedCategory || 'skin'
  );
  const [reportFile, setReportFile] = useState(uploadedState.reportFile);
  const [photoFile, setPhotoFile] = useState(uploadedState.photoFile);

  // Live Camera Stream State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Voice Assistant Command State
  const [isVoiceCommandActive, setIsVoiceCommandActive] = useState(false);
  const [voiceCommandFeedback, setVoiceCommandFeedback] = useState<string>('');

  // Spoken voice guidance upon loading Page 2
  useEffect(() => {
    const timer = setTimeout(() => {
      voiceAssistant.speak(
        t.page2.voiceGuidance,
        'page2_upload',
        { userId: currentUser?.id }
      );
    }, 400);

    return () => {
      clearTimeout(timer);
      stopCameraStream();
    };
  }, [language, t.page2.voiceGuidance, currentUser?.id]);

  // Voice Command Dispatcher for Page 2
  const handleStartVoiceCommands = () => {
    setIsVoiceCommandActive(true);
    const prompt =
      language === 'kn'
        ? 'ಧ್ವನಿ ನಿಯಂತ್ರಣ ಸಕ್ರಿಯವಾಗಿದೆ. ಫೋಟೋ ತೆಗೆಯಲು "ಕ್ಯಾಮೆರಾ" ಅಥವಾ "ಕ್ಯಾಪ್ಚರ್" ಹೇಳಿ, ಅಥವಾ ಮುಂದುವರಿಯಲು "ಮುಂದೆ" ಹೇಳಿ.'
        : language === 'hi'
        ? 'वॉयस कंट्रोल चालू है। फोटो लेने के लिए "कैमरा" या "खींचो" बोलें, या आगे जाने के लिए "आगे" बोलें।'
        : 'Voice assistant active. Say "Camera" to take a photo, "Report" for documents, or "Proceed" to continue.';

    setVoiceCommandFeedback(prompt);
    voiceAssistant.speakAndListen(
      prompt,
      'page2_upload',
      (speech) => {
        setIsVoiceCommandActive(false);
        const lower = speech.toLowerCase();
        setVoiceCommandFeedback(`Heard: "${speech}"`);

        if (lower.includes('camera') || lower.includes('photo') || lower.includes('ಕ್ಯಾಮೆರಾ') || lower.includes('ಫೋಟೋ') || lower.includes('फोटो') || lower.includes('कैमरा')) {
          startCameraStream();
        } else if (lower.includes('capture') || lower.includes('snap') || lower.includes('ಕ್ಲಿಕ್') || lower.includes('ತೆಗೆಯಿರಿ') || lower.includes('खींचो')) {
          capturePhotoFromCamera();
        } else if (lower.includes('skin') || lower.includes('ಚರ್ಮ') || lower.includes('त्वचा')) {
          handleCategorySelect('skin');
        } else if (lower.includes('hair') || lower.includes('ಕೂದಲು') || lower.includes('बाल')) {
          handleCategorySelect('hair');
        } else if (lower.includes('dental') || lower.includes('teeth') || lower.includes('ಹಲ್ಲು') || lower.includes('दांत')) {
          handleCategorySelect('dental');
        } else if (lower.includes('eye') || lower.includes('ಕಣ್ಣು') || lower.includes('आंख')) {
          handleCategorySelect('eye');
        } else if (lower.includes('report') || lower.includes('document') || lower.includes('ವರದಿ') || lower.includes('ದಾಖಲೆ') || lower.includes('रिपोर्ट')) {
          handleSelectSampleReport(SAMPLE_REPORTS[0]);
        } else if (lower.includes('proceed') || lower.includes('next') || lower.includes('ಮುಂದೆ') || lower.includes('आगे') || lower.includes('screen')) {
          onProceedToPage3();
        } else {
          setVoiceCommandFeedback(`Command received: "${speech}". Action ready.`);
        }
      },
      {
        onInterim: (i) => setVoiceCommandFeedback(`Hearing: "${i}"...`),
      }
    );
  };

  // Sync state upward
  const syncState = (
    newRep = reportFile,
    newPhoto = photoFile,
    newCat = selectedCategory
  ) => {
    onUpdateUploadedState({
      reportFile: newRep,
      photoFile: newPhoto,
      selectedCategory: newCat,
    });
  };

  // Open Direct Camera Stream
  const startCameraStream = async (facing = cameraFacing) => {
    setCameraError(null);
    stopCameraStream();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      setIsCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(console.error);
        }
      }, 200);

      voiceAssistant.speak(
        language === 'kn'
          ? 'ಕ್ಯಾಮೆರಾ ಆನ್ ಆಗಿದೆ. ಸ್ಪಷ್ಟ ಫೋಟೋ ತೆಗೆಯಿರಿ.'
          : language === 'hi'
          ? 'कैमरा चालू हो गया है। कृपया साफ फोटो लें।'
          : 'Live camera active. Position the issue and snap a photo.',
        'page2_upload'
      );
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(err.message || 'Unable to open camera. Please check permissions or choose from device.');
    }
  };

  // Stop camera stream cleanly
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Switch between front & back camera
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);
    startCameraStream(nextFacing);
  };

  // Capture Snapshot from Camera Canvas
  const capturePhotoFromCamera = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    stopCameraStream();

    const p = {
      name: `Camera_Capture_${Date.now()}.jpg`,
      dataUrl,
      category: selectedCategory,
    };

    setPhotoFile(p);
    syncState(reportFile, p, selectedCategory);

    voiceAssistant.speak(
      language === 'kn'
        ? 'ಫೋಟೋ ಸೆರೆಹಿಡಿಯಲಾಗಿದೆ! ನೇರವಾಗಿ ತಪಾಸಣಾ ಫಲಿತಾಂಶಕ್ಕೆ ಮುಂದುವರಿಯುತ್ತಿದ್ದೇವೆ.'
        : language === 'hi'
        ? 'फोटो खींच ली गई है! सीधे जांच पेज पर जा रहे हैं।'
        : 'Photo captured! Moving directly to health screening results.',
      'page2_upload',
      { userId: currentUser?.id }
    );

    // Directly appear in third page as requested
    setTimeout(() => {
      onProceedToPage3();
    }, 1200);
  };

  // Handle Report File Upload
  const handleReportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      reader.onload = () => {
        const rep = {
          name: file.name,
          type: file.type || 'text/plain',
          content: reader.result as string,
        };
        setReportFile(rep);
        syncState(rep, photoFile, selectedCategory);
      };
      reader.readAsText(file);
    } else {
      reader.onload = () => {
        const rep = {
          name: file.name,
          type: file.type || 'application/pdf',
          content: `[Uploaded Clinical Document: ${file.name} - Size: ${(file.size / 1024).toFixed(1)} KB]`,
        };
        setReportFile(rep);
        syncState(rep, photoFile, selectedCategory);
      };
      reader.readAsDataURL(file);
    }

    voiceAssistant.speak(
      language === 'kn'
        ? `ವರದಿ ${file.name} ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ. ತಪಾಸಣೆಗೆ ತೆರಳುತ್ತಿದ್ದೇವೆ.`
        : language === 'hi'
        ? `रिपोर्ट ${file.name} अपलोड हो गई है। जांच पेज पर जा रहे हैं।`
        : `Health report ${file.name} uploaded. Advancing to screening.`,
      'page2_upload',
      { userId: currentUser?.id }
    );

    // Directly advance to page 3
    setTimeout(() => {
      onProceedToPage3();
    }, 1200);
  };

  // Handle Photo File Upload from Device
  const handlePhotoUploadFromDevice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const p = {
        name: file.name,
        dataUrl: reader.result as string,
        category: selectedCategory,
      };
      setPhotoFile(p);
      syncState(reportFile, p, selectedCategory);

      voiceAssistant.speak(
        language === 'kn'
          ? `ಫೋಟೋ ${file.name} ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ! ನೇರವಾಗಿ ತಪಾಸಣಾ ಫಲಿತಾಂಶಕ್ಕೆ ಮುಂದುವರಿಯುತ್ತಿದ್ದೇವೆ.`
          : language === 'hi'
          ? `फोटो ${file.name} चुन ली गई है। सीधे जांच पेज पर जा रहे हैं।`
          : `Photo selected! Moving directly to health screening.`,
        'page2_upload',
        { userId: currentUser?.id }
      );

      // Directly appear in third page as requested
      setTimeout(() => {
        onProceedToPage3();
      }, 1200);
    };
    reader.readAsDataURL(file);
  };

  // Select Sample Report
  const handleSelectSampleReport = (sample: typeof SAMPLE_REPORTS[0]) => {
    const rep = {
      name: sample.fileName,
      type: sample.type,
      content: sample.content,
    };
    setReportFile(rep);
    setSelectedCategory(sample.category as HealthCategory);
    syncState(rep, photoFile, sample.category as HealthCategory);

    voiceAssistant.speak(
      language === 'kn'
        ? `ಮಾದರಿ ವರದಿ ${sample.title} ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ. ತಪಾಸಣೆಗೆ ಹೋಗುತ್ತಿದ್ದೇವೆ.`
        : language === 'hi'
        ? `नमूना रिपोर्ट ${sample.title} चुनी गई। जांच पेज पर जा रहे हैं।`
        : `Sample report loaded: ${sample.title}. Proceeding to screening.`,
      'page2_upload',
      { userId: currentUser?.id }
    );

    setTimeout(() => onProceedToPage3(), 1000);
  };

  // Select Sample Photo
  const handleSelectSamplePhoto = (sample: typeof SAMPLE_PHOTOS[0]) => {
    const p = {
      name: `${sample.title}.png`,
      dataUrl: sample.dataUrl,
      category: sample.category as HealthCategory,
    };
    setPhotoFile(p);
    setSelectedCategory(sample.category as HealthCategory);
    syncState(reportFile, p, sample.category as HealthCategory);

    voiceAssistant.speak(
      language === 'kn'
        ? `ಮಾದರಿ ಫೋಟೋ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ. ತಪಾಸಣೆಗೆ ತೆರಳುತ್ತಿದ್ದೇವೆ.`
        : language === 'hi'
        ? `नमूना फोटो चुनी गई। जांच पेज पर जा रहे हैं।`
        : `Sample clinical photo selected. Proceeding to screening.`,
      'page2_upload',
      { userId: currentUser?.id }
    );

    setTimeout(() => onProceedToPage3(), 1000);
  };

  const handleCategorySelect = (cat: HealthCategory) => {
    setSelectedCategory(cat);
    syncState(reportFile, photoFile, cat);
  };

  const categories = [
    { key: 'skin' as HealthCategory, label: t.page2.categories.skin, icon: Sparkles },
    { key: 'hair' as HealthCategory, label: t.page2.categories.hair, icon: Scissors },
    { key: 'dental' as HealthCategory, label: t.page2.categories.dental, icon: Smile },
    { key: 'eye' as HealthCategory, label: t.page2.categories.eye, icon: Eye },
    { key: 'other' as HealthCategory, label: t.page2.categories.other, icon: Info },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Page Title & Scope Selector */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.page2.title}
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          {t.page2.subtitle}
        </p>

        {/* Category Scope Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleCategorySelect(cat.key)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-400 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Hands-Free Voice Assistant Bar for Page 2 */}
        <div className="mt-5 max-w-xl mx-auto p-3.5 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex items-center justify-between gap-3 shadow-md border border-emerald-500/30">
          <div className="flex items-center space-x-2.5 text-left">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-300 block">Voice Command Assistant</span>
              <span className="text-[11px] text-slate-300">
                {voiceCommandFeedback || 'Say "Camera" to snap, "Report" to upload, or "Proceed"'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleStartVoiceCommands}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              isVoiceCommandActive
                ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-400'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isVoiceCommandActive ? 'Listening...' : 'Speak Command'}</span>
          </button>
        </div>
      </div>

      {/* DUAL-PANEL LAYOUT (LEFT: Report Upload | RIGHT: Photo Upload with Device / Camera) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* LEFT PANEL: PATIENT RECENT HEALTH REPORT */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {t.page2.leftTitle}
                </h2>
                <p className="text-xs text-slate-500">
                  {t.page2.leftSubtitle}
                </p>
              </div>
            </div>

            {/* Current Report State / File Upload */}
            {reportFile ? (
              <div className="p-4 rounded-2xl bg-teal-50/70 border-2 border-teal-300 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block truncate max-w-xs">
                        {reportFile.name}
                      </span>
                      <span className="text-[11px] text-teal-700 font-mono">
                        {reportFile.type}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setReportFile(null);
                      syncState(null, photoFile, selectedCategory);
                    }}
                    title={t.page2.removeUploaded}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 p-2.5 bg-white rounded-xl text-[11px] text-slate-600 font-mono line-clamp-3 border border-teal-100">
                  {reportFile.content}
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50/60 hover:bg-teal-50/30 transition-all text-center mb-6 group">
                <Upload className="w-10 h-10 text-slate-400 group-hover:text-teal-600 transition-colors mb-2" />
                <span className="text-sm font-bold text-slate-800 group-hover:text-teal-800">
                  {t.page2.uploadReportBtn}
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  Supports PDF, DOCX, TXT, or Scanned Documents
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,image/*"
                  onChange={handleReportUpload}
                  className="hidden"
                />
              </label>
            )}

            {/* Quick Sample Reports */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                {t.page2.orChooseSample}
              </p>
              <div className="space-y-2">
                {SAMPLE_REPORTS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSampleReport(sample)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 flex items-center justify-between text-left text-xs transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                      <span className="font-semibold text-slate-800 group-hover:text-teal-800 truncate">
                        {sample.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                      {sample.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: HEALTH ISSUE PHOTO (DEVICE OR LIVE CAMERA) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shadow-xs">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {t.page2.rightTitle}
                </h2>
                <p className="text-xs text-slate-500">
                  Choose photo from device or use live camera
                </p>
              </div>
            </div>

            {/* Current Photo Preview */}
            {photoFile ? (
              <div className="p-4 rounded-2xl bg-cyan-50/70 border-2 border-cyan-300 mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block truncate max-w-xs">
                        {photoFile.name}
                      </span>
                      <span className="text-[11px] text-cyan-700 font-medium capitalize">
                        Target: {photoFile.category} Issue
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setPhotoFile(null);
                      syncState(reportFile, null, selectedCategory);
                    }}
                    title={t.page2.removeUploaded}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden border border-cyan-200 max-h-48 flex items-center justify-center bg-black/5">
                  <img
                    src={photoFile.dataUrl}
                    alt="Uploaded health issue"
                    className="max-h-48 w-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {/* Option A: Direct Camera Live Stream Trigger */}
                <button
                  type="button"
                  onClick={() => startCameraStream()}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-cyan-600/20 flex items-center justify-center space-x-3 transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <Camera className="w-5 h-5" />
                  <span>Take Photo with Live Camera</span>
                </button>

                {/* Option B: Choose Photo from Device */}
                <label className="border-2 border-dashed border-slate-300 hover:border-cyan-500 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer bg-slate-50/60 hover:bg-cyan-50/30 transition-all text-center group">
                  <Upload className="w-7 h-7 text-slate-400 group-hover:text-cyan-600 transition-colors mb-1.5" />
                  <span className="text-xs font-bold text-slate-800 group-hover:text-cyan-800">
                    Choose Photo from Device Files / Gallery
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    JPG, PNG, WEBP, or Saved Photos
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUploadFromDevice}
                    className="hidden"
                  />
                </label>

                {cameraError && (
                  <p className="text-xs text-rose-600 font-medium text-center">
                    {cameraError}
                  </p>
                )}
              </div>
            )}

            {/* Quick Sample Photos */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                {t.page2.samplePhotos} (1-Click Test)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_PHOTOS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSamplePhoto(sample)}
                    className="p-2 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 flex items-center space-x-2 text-left text-xs transition-colors cursor-pointer group"
                  >
                    <img
                      src={sample.dataUrl}
                      alt={sample.title}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <span className="font-semibold text-slate-800 group-hover:text-cyan-800 text-[11px] truncate">
                      {sample.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE CAMERA MODAL OVERLAY */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            {/* Header */}
            <div className="p-4 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-rose-500 animate-pulse" />
                <span className="text-sm font-bold">Live Clinical Camera</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleCameraFacing}
                  title="Switch front/back camera"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={stopCameraStream}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Viewport with Targeting Overlay */}
            <div className="relative aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                playsInline
                autoPlay
                className="w-full h-full object-cover"
              />
              {/* Clinical Framing Guide Box */}
              <div className="absolute inset-8 border-2 border-dashed border-emerald-400/70 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="bg-black/60 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full">
                  Align skin, hair, tooth or eye inside box
                </span>
              </div>
            </div>

            {/* Shutter Button */}
            <div className="p-5 flex items-center justify-center bg-slate-950">
              <button
                type="button"
                onClick={capturePhotoFromCamera}
                className="w-16 h-16 rounded-full bg-white hover:bg-slate-200 border-4 border-emerald-500 shadow-lg flex items-center justify-center group active:scale-90 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-600 group-hover:bg-emerald-500 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Notice & Proceed Action Button */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start space-x-3 max-w-2xl">
          <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {reportFile || photoFile
              ? `Ready for screening with ${[reportFile ? 'Medical Report' : '', photoFile ? 'Clinical Photo' : ''].filter(Boolean).join(' and ')}.`
              : t.page2.noUploadVoiceNotice}
          </p>
        </div>

        <button
          onClick={onProceedToPage3}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center justify-center space-x-3 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
        >
          <span>{t.page2.proceedToScreening}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
