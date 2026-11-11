/**
 * AI HEALTH CARE - Multilingual Translations (Kannada, Hindi, English)
 */
import { SupportedLanguage } from '../../../database/schema.ts';

export interface TranslationDictionary {
  appName: string;
  selectLanguage: string;
  selectLanguagePrompt: string;
  languages: {
    kn: string;
    hi: string;
    en: string;
  };
  welcomeSpokenIntro: string;
  nav: {
    page1: string;
    page2: string;
    page3: string;
    page4: string;
    page5: string;
    page6: string;
    page7: string;
    logout: string;
    speakAssistance: string;
    mute: string;
    unmute: string;
  };
  page1: {
    title: string;
    subtitle: string;
    tabLogin: string;
    tabSignup: string;
    voiceBannerTitle: string;
    voiceBannerDesc: string;
    voiceButtonActive: string;
    voiceButtonIdle: string;
    voiceGuidancePrompt: string;
    fullName: string;
    mobileNumber: string;
    emailAddress: string;
    age: string;
    gender: string;
    genderMale: string;
    genderFemale: string;
    genderOther: string;
    password: string;
    otpCode: string;
    sendOtp: string;
    resendOtp: string;
    verifyOtp: string;
    otpSentSuccess: string;
    otpCountdown: string;
    loginWithPassword: string;
    loginWithOtp: string;
    loginButton: string;
    signupButton: string;
    dontHaveAccount: string;
    alreadyHaveAccount: string;
    encryptionBadge: string;
  };
  page2: {
    title: string;
    subtitle: string;
    voiceGuidance: string;
    leftTitle: string;
    leftSubtitle: string;
    rightTitle: string;
    rightSubtitle: string;
    supportedFormats: string;
    uploadReportBtn: string;
    uploadPhotoBtn: string;
    orChooseSample: string;
    sampleReports: string;
    samplePhotos: string;
    selectedCategory: string;
    categories: {
      skin: string;
      hair: string;
      dental: string;
      eye: string;
      other: string;
    };
    categoryDesc: {
      skin: string;
      hair: string;
      dental: string;
      eye: string;
      other: string;
    };
    removeUploaded: string;
    proceedToScreening: string;
    noUploadVoiceNotice: string;
  };
  page3: {
    title: string;
    subtitle: string;
    voiceReadingOut: string;
    sourceModeTitle: string;
    voiceModeTitle: string;
    voiceModeSubtitle: string;
    conditionIdentified: string;
    confidenceScore: string;
    severityLabel: string;
    severityLevels: {
      mild: string;
      moderate: string;
      attention_needed: string;
      urgent: string;
    };
    symptomsObserved: string;
    clinicalExplanation: string;
    recommendedCare: string;
    voiceQuestionnaire: {
      question1: string;
      question2: string;
      question3: string;
      question4: string;
      answer1Placeholder: string;
      answer2Placeholder: string;
      answer3Placeholder: string;
      answer4Placeholder: string;
      speakAnswer: string;
      submitVoiceAssessment: string;
    };
    proceedToMedicines: string;
    reAnalyze: string;
  };
  page4: {
    title: string;
    subtitle: string;
    voiceGuidance: string;
    recommendedMeds: string;
    voiceOrderNotice: string;
    voiceOrderSample: string;
    speakToOrder: string;
    cartSummary: string;
    emptyCart: string;
    dosage: string;
    timing: string;
    precautions: string;
    addToCart: string;
    quantity: string;
    totalAmount: string;
    deliveryDetails: string;
    addressLabel: string;
    phoneLabel: string;
    paymentMethod: string;
    placeOrderBtn: string;
    orderSuccessTitle: string;
    orderSuccessDesc: string;
    proceedToHistory: string;
  };
  page5: {
    title: string;
    subtitle: string;
    voiceGuidance: string;
    tabSessions: string;
    tabScreening: string;
    tabVoiceLogs: string;
    tabOrders: string;
    downloadMedicalReport: string;
    downloadFullJson: string;
    downloadVoiceTranscript: string;
    emptyRecords: string;
    restartScreening: string;
  };
  page6: {
    title: string;
    subtitle: string;
    voiceGuidance: string;
    missionTitle: string;
    missionDesc: string;
    featuresTitle: string;
    features: Array<{
      title: string;
      desc: string;
    }>;
  };
  page7: {
    title: string;
    subtitle: string;
    voiceGuidance: string;
    tabUsers: string;
    tabScreenings: string;
    tabOrders: string;
    tabVoice: string;
    databaseStatus: string;
    editAction: string;
    deleteAction: string;
    saveAction: string;
    cancelAction: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  // 1. Kannada (ಕನ್ನಡ)
  kn: {
    appName: 'AI ಹೆಲ್ತ್ ಕೇರ್',
    selectLanguage: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    selectLanguagePrompt: 'AI ಹೆಲ್ತ್ ಕೇರ್ ಗೆ ಸ್ವಾಗತ! ದಯವಿಟ್ಟು ಮುಂದುವರಿಯಲು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    languages: {
      kn: 'ಕನ್ನಡ (Kannada)',
      hi: 'हिंदी (Hindi)',
      en: 'English (English)',
    },
    welcomeSpokenIntro: 'ನಮಸ್ಕಾರ! AI ಹೆಲ್ತ್ ಕೇರ್ ಗೆ ಸ್ವಾಗತ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ. ನಂತರ ನಾನು ನಿಮಗೆ ಧ್ವನಿ ಮೂಲಕ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತೇನೆ.',
    nav: {
      page1: '1. ಲಾಗಿನ್ & ನೋಂದಣಿ',
      page2: '2. ವರದಿ & ಫೋಟೋ ಅಪ್‌ಲೋಡ್',
      page3: '3. ಆರೋಗ್ಯ ತಪಾಸಣೆ',
      page4: '4. ಔಷಧಿಗಳು & ಆರ್ಡರ್',
      page5: '5. ಇತಿಹಾಸ & ದಾಖಲೆಗಳು',
      page6: '6. ನಮ್ಮ ಬಗ್ಗೆ',
      page7: '7. ಅಡ್ಮಿನ್ ನಿಯಂತ್ರಣ',
      logout: 'ನಿರ್ಗಮಿಸಿ',
      speakAssistance: 'ಧ್ವನಿ ಸಹಾಯಕಿ',
      mute: 'ಮ್ಯೂಟ್',
      unmute: 'ಧ್ವನಿ ಆನ್',
    },
    page1: {
      title: 'ಸುರಕ್ಷಿತ ಲಾಗಿನ್ ಮತ್ತು ನೋಂದಣಿ',
      subtitle: 'ನೈಜ ಸಮಯದ OTP ಮತ್ತು AI ಧ್ವನಿ ಸ್ವಯಂ-ತುಂಬುವಿಕೆ (Auto-Fill) ಸೌಲಭ್ಯದೊಂದಿಗೆ',
      tabLogin: 'ಲಾಗಿನ್',
      tabSignup: 'ಹೊಸ ನೋಂದಣಿ',
      voiceBannerTitle: 'AI ಧ್ವನಿ ಸ್ವಯಂ-ತುಂಬುವಿಕೆ ಸಹಾಯಕ',
      voiceBannerDesc: 'ಮೈಕ್ರೊಫೋನ್ ಒತ್ತಿ ನಿಮ್ಮ ಹೆಸರು, ವಯಸ್ಸು, ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ. AI ತಾನಾಗಿಯೇ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡುತ್ತದೆ!',
      voiceButtonActive: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ... ಮಾತನಾಡಿ',
      voiceButtonIdle: 'ಮಾತನಾಡಿ ವಿವರ ತುಂಬಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
      voiceGuidancePrompt: 'ಸ್ವಾಗತ! ನೀವು ಲಾಗಿನ್ ಅಥವಾ ನೋಂದಣಿ ಮಾಡಬಹುದು. ಮೈಕ್ರೊಫೋನ್ ಒತ್ತಿ ನಿಮ್ಮ ಹೆಸರು, ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಮತ್ತು ವಿವರಗಳನ್ನು ಮಾತನಾಡಿ.',
      fullName: 'ಪೂರ್ಣ ಹೆಸರು',
      mobileNumber: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (10 ಅಂಕಿಗಳು)',
      emailAddress: 'ಇಮೇಲ್ ವಿಳಾಸ (ಐಚ್ಛಿಕ)',
      age: 'ವಯಸ್ಸು',
      gender: 'ಲಿಂಗ',
      genderMale: 'ಪುರುಷ',
      genderFemale: 'ಮಹಿಳೆ',
      genderOther: 'ಇತರ',
      password: 'ಪಾಸ್‌ವರ್ಡ್',
      otpCode: '6-ಅಂಕಿಯ OTP ಕೋಡ್',
      sendOtp: 'OTP ಕಳುಹಿಸಿ',
      resendOtp: 'ಮತ್ತೆ OTP ಕಳುಹಿಸಿ',
      verifyOtp: 'OTP ದೃಢೀಕರಿಸಿ',
      otpSentSuccess: 'ನೈಜ-ಸಮಯದ OTP ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಕಳುಹಿಸಲಾಗಿದೆ!',
      otpCountdown: 'ಸೆಕೆಂಡುಗಳು ಬಾಕಿ',
      loginWithPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮೂಲಕ ಲಾಗಿನ್',
      loginWithOtp: 'ಮೊಬೈಲ್ OTP ಮೂಲಕ ಲಾಗಿನ್',
      loginButton: 'ಸುರಕ್ಷಿತವಾಗಿ ಲಾಗಿನ್ ಆಗಿ',
      signupButton: 'ಖಾತೆಯನ್ನು ರಚಿಸಿ',
      dontHaveAccount: 'ಖಾತೆ ಇಲ್ಲವೇ? ಇಲ್ಲಿ ನೋಂದಾಯಿಸಿ',
      alreadyHaveAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ? ಲಾಗಿನ್ ಆಗಿ',
      encryptionBadge: '256-ಬಿಟ್ ಎನ್‌ಕ್ರಿಪ್ಶನ್ ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿದೆ',
    },
    page2: {
      title: 'ಆರೋಗ್ಯ ವರದಿ ಮತ್ತು ಸಮಸ್ಯೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್',
      subtitle: 'ಎಡಭಾಗದಲ್ಲಿ ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ವರದಿ ಮತ್ತು ಬಲಭಾಗದಲ್ಲಿ ಸಮಸ್ಯೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      voiceGuidance: 'ಪುಟ ಎರಡಕ್ಕೆ ಸ್ವಾಗತ! ಎಡಭಾಗದಲ್ಲಿ ನಿಮ್ಮ ಇತ್ತೀಚಿನ ಆರೋಗ್ಯ ವರದಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ, ಬಲಭಾಗದಲ್ಲಿ ಚರ್ಮ, ಕೂದಲು, ಹಲ್ಲು ಅಥವಾ ಕಣ್ಣಿನ ಸಮಸ್ಯೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
      leftTitle: 'ಎಡಭಾಗ: ಇತ್ತೀಚಿನ ಆರೋಗ್ಯ ವರದಿ',
      leftSubtitle: 'ರಕ್ತ ಪರೀಕ್ಷೆ, ಲ್ಯಾಬ್ ವರದಿ ಅಥವಾ ವೈದ್ಯಕೀಯ ದಾಖಲೆ (PDF, DOCX, TXT ಅಥವಾ ಸ್ಕ್ಯಾನ್)',
      rightTitle: 'ಬಲಭಾಗ: ಸಮಸ್ಯೆಯ ಫೋಟೋ',
      rightSubtitle: 'ಚರ್ಮ, ಕೂದಲು, ಹಲ್ಲು, ಕಣ್ಣು ಅಥವಾ ಇತರ ಸಮಸ್ಯೆಯ ಸ್ಪಷ್ಟ ಛಾಯಾಚಿತ್ರ',
      supportedFormats: 'PDF, DOCX, TXT, JPG, PNG ಫಾರ್ಮ್ಯಾಟ್‌ಗಳು ಲಭ್ಯ',
      uploadReportBtn: 'ವರದಿ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ',
      uploadPhotoBtn: 'ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ / ಕ್ಯಾಮೆರಾ',
      orChooseSample: 'ಅಥವಾ ತ್ವರಿತ ಪರೀಕ್ಷೆಗೆ ಮಾದರಿ ಆಯ್ಕೆಮಾಡಿ:',
      sampleReports: 'ಮಾದರಿ ವರದಿಗಳು',
      samplePhotos: 'ಮಾದರಿ ಫೋಟೋಗಳು',
      selectedCategory: 'ಆರೋಗ್ಯ ವಿಭಾಗ',
      categories: {
        skin: 'ಚರ್ಮದ ಸಮಸ್ಯೆಗಳು',
        hair: 'ಕೂದಲು & ನೆತ್ತಿ',
        dental: 'ಹಲ್ಲು & ಒಸಡು',
        eye: 'ಕಣ್ಣಿನ ತೊಂದರೆ',
        other: 'ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ',
      },
      categoryDesc: {
        skin: 'ದದ್ದು, ತುರಿಕೆ, ಅಲರ್ಜಿ, ಮೊಡವೆ',
        hair: 'ತಲೆಹೊಟ್ಟು, ಕೂದಲು ಉದುರುವಿಕೆ',
        dental: 'ಹಲ್ಲುನೋವು, ಒಸಡು ಊತ, ಸೆನ್ಸಿಟಿವಿಟಿ',
        eye: 'ಕೆಂಪಾಗುವಿಕೆ, ನೀರು ಬರುವುದು, ಆಯಾಸ',
        other: 'ಜ್ವರ, ಗಂಟಲು ನೋವು, ನಿಶ್ಯಕ್ತಿ',
      },
      removeUploaded: 'ತೆಗೆದುಹಾಕಿ',
      proceedToScreening: 'ಮುಂದಿನ ತಪಾಸಣೆಗೆ ಮುಂದುವರಿಯಿರಿ',
      noUploadVoiceNotice: 'ನೀವು ಯಾವುದೇ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡದಿದ್ದರೆ, ಮುಂದಿನ ಪುಟದಲ್ಲಿ ಧ್ವನಿ ಸಹಾಯಕಿ ನೇರವಾಗಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ ತಪಾಸಣೆ ಮಾಡುತ್ತದೆ.',
    },
    page3: {
      title: 'AI ಆರೋಗ್ಯ ತಪಾಸಣಾ ಫಲಿತಾಂಶಗಳು',
      subtitle: 'ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಮೂಲದ ವಿಶ್ಲೇಷಣೆ ಅಥವಾ ಧ್ವನಿ ಸಹಾಯಕಿಯ ನೇರ ತಪಾಸಣೆ',
      voiceReadingOut: 'ಧ್ವನಿ ಸಹಾಯಕಿ ಫಲಿತಾಂಶವನ್ನು ವಿವರಿಸುತ್ತಿದೆ...',
      sourceModeTitle: 'ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಮೂಲದಿಂದ ತಪಾಸಣಾ ಫಲಿತಾಂಶ',
      voiceModeTitle: 'ಧ್ವನಿ ಆಧಾರಿತ ಸಂವಾದಾತ್ಮಕ ಆರೋಗ್ಯ ತಪಾಸಣೆ',
      voiceModeSubtitle: 'ನೀವು ಯಾವುದೇ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿಲ್ಲ. ದಯವಿಟ್ಟು ಧ್ವನಿ ಸಹಾಯಕಿ ಕೇಳುವ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ.',
      conditionIdentified: 'ಗುರುತಿಸಲಾದ ಆರೋಗ್ಯ ಸ್ಥಿತಿ',
      confidenceScore: 'AI ನಿಖರತೆ ಸ್ಕೋರ್',
      severityLabel: 'ತೀವ್ರತೆಯ ಮಟ್ಟ',
      severityLevels: {
        mild: 'ಸೌಮ್ಯ (Mild)',
        moderate: 'ಮಧ್ಯಮ (Moderate)',
        attention_needed: 'ಗಮನ ಅಗತ್ಯ (Attention Needed)',
        urgent: 'ತುರ್ತು ವೈದ್ಯಕೀಯ ಭೇಟಿ (Urgent)',
      },
      symptomsObserved: 'ಕಂಡುಬಂದ ಲಕ್ಷಣಗಳು',
      clinicalExplanation: 'ವೈದ್ಯಕೀಯ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಸಾರಾಂಶ',
      recommendedCare: 'ಮನೆಯ ಆರೈಕೆ ಮತ್ತು ಸಲಹೆಗಳು',
      voiceQuestionnaire: {
        question1: '1. ನಿಮ್ಮ ಸಮಸ್ಯೆ ದೇಹದ ಯಾವ ಭಾಗದಲ್ಲಿದೆ? (ಚರ್ಮ, ಕೂದಲು, ಹಲ್ಲು, ಕಣ್ಣು)',
        question2: '2. ಈ ತೊಂದರೆ ಎಷ್ಟು ದಿನಗಳಿಂದ ಇದೆ?',
        question3: '3. ನೋವು ಅಥವಾ ತುರಿಕೆಯ ತೀವ್ರತೆ ಎಷ್ಟಿದೆ?',
        question4: '4. ಯಾವುದೇ ಹಿಂದಿನ ಔಷಧಿ ಅಥವಾ ಅಲರ್ಜಿ ಇದೆಯೇ?',
        answer1Placeholder: 'ಉದಾ: ಮುಖದ ಮೇಲೆ ಚರ್ಮದ ದದ್ದು ಮತ್ತು ತುರಿಕೆ',
        answer2Placeholder: 'ಉದಾ: 4 ದಿನಗಳಿಂದ ಇದೆ',
        answer3Placeholder: 'ಉದಾ: ಮಧ್ಯಮ ನೋವು ಮತ್ತು ಕಿರಿಕಿರಿ',
        answer4Placeholder: 'ಉದಾ: ಪ್ಯಾರಸಿಟಮಾಲ್ ತೆಗೆದುಕೊಂಡಿದ್ದೆ',
        speakAnswer: 'ಮಾತನಾಡಿ ಉತ್ತರಿಸಿ',
        submitVoiceAssessment: 'ಧ್ವನಿ ತಪಾಸಣೆ ಪೂರ್ಣಗೊಳಿಸಿ',
      },
      proceedToMedicines: 'ಔಷಧಿಗಳ ಶಿಫಾರಸು & ಆರ್ಡರ್ ಪುಟಕ್ಕೆ ಹೋಗಿ',
      reAnalyze: 'ಮತ್ತೆ ತಪಾಸಣೆ ನಡೆಸಿ',
    },
    page4: {
      title: 'ಔಷಧಿಗಳ ಮಾಹಿತಿ ಮತ್ತು ಧ್ವನಿ ಆಧಾರಿತ ಆರ್ಡರ್',
      subtitle: 'ನಿಮ್ಮ ತಪಾಸಣೆಗೆ ಅನುಗುಣವಾಗಿ ಶಿಫಾರಸು ಮಾಡಿದ ಔಷಧಿಗಳು ಮತ್ತು ಧ್ವನಿ ಆರ್ಡರ್',
      voiceGuidance: 'ಪುಟ ನಾಲ್ಕಕ್ಕೆ ಸ್ವಾಗತ! ನಿಮ್ಮ ತಪಾಸಣೆಗೆ ಸೂಕ್ತವಾದ ಔಷಧಿಗಳನ್ನು ಇಲ್ಲಿ ತೋರಿಸಲಾಗಿದೆ. ನೀವು ಧ್ವನಿ ಆಜ್ಞೆ ನೀಡಿ ಅಥವಾ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಆರ್ಡರ್ ಮಾಡಬಹುದು.',
      recommendedMeds: 'ಶಿಫಾರಸು ಮಾಡಿದ ಔಷಧಿಗಳು',
      voiceOrderNotice: 'ಧ್ವನಿ ಮೂಲಕ ಆರ್ಡರ್ ಮಾಡಲು ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ:',
      voiceOrderSample: 'ಉದಾಹರಣೆಗೆ: "ಎಲ್ಲಾ ಔಷಧಿಗಳನ್ನು ಆರ್ಡರ್ ಮಾಡಿ" ಅಥವಾ "ಕ್ರೀಮ್ ಬುಕ್ ಮಾಡಿ"',
      speakToOrder: 'ಧ್ವನಿ ಮೂಲಕ ಆರ್ಡರ್ ಮಾಡಿ',
      cartSummary: 'ಆರ್ಡರ್ ಬುಟ್ಟಿ (Cart)',
      emptyCart: 'ಬುಟ್ಟಿ ಖಾಲಿಯಾಗಿದೆ. ಔಷಧಿಗಳನ್ನು ಸೇರಿಸಿ.',
      dosage: 'ಡೋಸೇಜ್',
      timing: 'ಸಮಯ',
      precautions: 'ಮುನ್ನೆಚ್ಚರಿಕೆ',
      addToCart: 'ಬುಟ್ಟಿಗೆ ಸೇರಿಸಿ',
      quantity: 'ಪ್ರಮಾಣ',
      totalAmount: 'ಒಟ್ಟು ಮೊತ್ತ',
      deliveryDetails: 'ವಿತರಣಾ ವಿವರಗಳು',
      addressLabel: 'ವಿತರಣಾ ವಿಳಾಸ',
      phoneLabel: 'ಸಂಪರ್ಕ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      paymentMethod: 'ಪಾವತಿ ವಿಧಾನ',
      placeOrderBtn: 'ಔಷಧಿಗಳನ್ನು ಆರ್ಡರ್ ಮಾಡಿ',
      orderSuccessTitle: 'ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿದೆ!',
      orderSuccessDesc: 'ನಿಮ್ಮ ಔಷಧಿಗಳ ಆರ್ಡರ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ. ಆರ್ಡರ್ ಐಡಿ:',
      proceedToHistory: 'ಸಂಪೂರ್ಣ ಇತಿಹಾಸ ಪುಟಕ್ಕೆ ಹೋಗಿ',
    },
    page5: {
      title: 'ಸಂಪೂರ್ಣ ಇತಿಹಾಸ ಮತ್ತು ದಾಖಲೆಗಳು',
      subtitle: 'ಲಾಗಿನ್, ತಪಾಸಣೆ, ಧ್ವನಿ ಸಂಭಾಷಣೆ ಮತ್ತು ಔಷಧಿಗಳ ವಿವರವಾದ ದಾಖಲೆಗಳು',
      voiceGuidance: 'ಇದು ಇತಿಹಾಸ ಪುಟ. ನಿಮ್ಮ ಎಲ್ಲಾ ಲಾಗಿನ್ ದಾಖಲೆಗಳು, ತಪಾಸಣಾ ವರದಿಗಳು, ಧ್ವನಿ ಸಂಭಾಷಣೆಗಳು ಮತ್ತು ಔಷಧಿ ಆರ್ಡರ್‌ಗಳನ್ನು ಇಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿಕೊಳ್ಳಬಹುದು.',
      tabSessions: 'ಲಾಗಿನ್ & ನೋಂದಣಿ ದಾಖಲೆ',
      tabScreening: 'ಆರೋಗ್ಯ ತಪಾಸಣಾ ಇತಿಹಾಸ',
      tabVoiceLogs: 'ಧ್ವನಿ ಸಹಾಯಕ ಸಂಭಾಷಣೆ ಲಾಗ್',
      tabOrders: 'ಔಷಧಿ ಆರ್ಡರ್ ಇತಿಹಾಸ',
      downloadMedicalReport: 'ವೈದ್ಯಕೀಯ ವರದಿ ಡೌನ್‌ಲೋಡ್ (PDF / Print)',
      downloadFullJson: 'ಸಂಪೂರ್ಣ ಡೇಟಾ ಡೌನ್‌ಲೋಡ್ (JSON)',
      downloadVoiceTranscript: 'ಧ್ವನಿ ಸಂಭಾಷಣೆ ಡೌನ್‌ಲೋಡ್ (TXT)',
      emptyRecords: 'ಇನ್ನೂ ಯಾವುದೇ ದಾಖಲೆಗಳು ಲಭ್ಯವಿಲ್ಲ.',
      restartScreening: 'ಹೊಸ ತಪಾಸಣೆ ಪ್ರಾರಂಭಿಸಿ',
    },
    page6: {
      title: 'ನಮ್ಮ ಬಗ್ಗೆ (About AI HEALTH CARE)',
      subtitle: 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಆಧಾರಿತ ಸುಧಾರಿತ ವೈದ್ಯಕೀಯ ತಪಾಸಣೆ ಮತ್ತು ಬಹುಭಾಷಾ ಧ್ವನಿ ವೇದಿಕೆ',
      voiceGuidance: 'ನಮ್ಮ ಬಗ್ಗೆ ಪುಟಕ್ಕೆ ಸ್ವಾಗತ! AI HEALTH CARE ಅತ್ಯಾಧುನಿಕ ಧ್ವನಿ ಸಹಾಯಕ, ಮಲ್ಟಿಮೋಡಲ್ ಸ್ಕ್ರೀನಿಂಗ್ ಮತ್ತು ಸಮೀಪದ ಆಸ್ಪತ್ರೆ ಮಾರ್ಗದರ್ಶನ ಒದಗಿಸುತ್ತದೆ.',
      missionTitle: 'ನಮ್ಮ ಧ್ಯೇಯ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ',
      missionDesc: 'ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕರಿಗೂ ಅವರ ಮಾತೃಭಾಷೆಯಲ್ಲೇ (ಕನ್ನಡ, ಹಿಂದಿ, ಇಂಗ್ಲಿಷ್) ತ್ವರಿತ, ನಿಖರ ಮತ್ತು ಸುಲಭವಾದ ಆರೋಗ್ಯ ತಪಾಸಣೆ, ಸೂಕ್ತ ಔಷಧ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಸಮೀಪದ ವೈದ್ಯಕೀಯ ನೆರವು ಒದಗಿಸುವುದು ನಮ್ಮ ಗುರಿ.',
      featuresTitle: 'ಸುಧಾರಿತ ಸೌಲಭ್ಯಗಳು (Advanced Capabilities)',
      features: [
        { title: 'ಮೂರು ಭಾಷೆಗಳ AI ಧ್ವನಿ ಸಹಾಯಕ', desc: 'ಕನ್ನಡ, ಹಿಂದಿ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಭಾಷೆಗಳಲ್ಲಿ ಧ್ವನಿ ಮೂಲಕ ನಮೂನೆ ಭರ್ತಿ ಮತ್ತು ಸಂವಾದಾತ್ಮಕ ತಪಾಸಣೆ.' },
        { title: 'ಮಲ್ಟಿಮೋಡಲ್ ಕ್ಲಿನಿಕಲ್ ಸ್ಕ್ಯಾನಿಂಗ್', desc: 'ಚರ್ಮ, ಕೂದಲು, ಹಲ್ಲು, ಕಣ್ಣಿನ ಸಮಸ್ಯೆಗಳು ಹಾಗೂ ವೈದ್ಯಕೀಯ ವರದಿಗಳ ತ್ವರಿತ AI ವಿಶ್ಲೇಷಣೆ.' },
        { title: 'ಸ್ವಯಂಚಾಲಿತ ಸ್ಥಳ ಗುರುತಿಸುವಿಕೆ & ಆಸ್ಪತ್ರೆ ನಕ್ಷೆ', desc: 'ಬಳಕೆದಾರರ ಜಿಪಿಎಸ್ ಸ್ಥಳದ ಆಧಾರದ ಮೇಲೆ ಸಮೀಪದ ಆಸ್ಪತ್ರೆಗಳು ಮತ್ತು ಔಷಧಿ ಅಂಗಡಿಗಳ ನೈಜ ನಕ್ಷೆ ಮಾರ್ಗದರ್ಶನ.' },
        { title: 'ನೈಜ-ಸಮಯದ OTP & ಎನ್‌ಕ್ರಿಪ್ಶನ್', desc: 'SHA-256 ಮತ್ತು ಮೊಬೈಲ್ OTP ಮೂಲಕ ಸುರಕ್ಷಿತ ಖಾತೆ ರಕ್ಷಣೆ.' },
        { title: 'MongoDB ಡೇಟಾಬೇಸ್ ಕ್ಲೌಡ್ ಸಿಂಕ್', desc: 'ಎಲ್ಲಾ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು, ಆರ್ಡರ್‌ಗಳು ಮತ್ತು ಧ್ವನಿ ಇತಿಹಾಸದ ಶಾಶ್ವತ ಸುರಕ್ಷಿತ ಸಂಗ್ರಹಣೆ.' },
      ],
    },
    page7: {
      title: 'ಅಡ್ಮಿನ್ ನಿಯಂತ್ರಣ ಕೇಂದ್ರ (Admin Control Panel)',
      subtitle: 'ಬಳಕೆದಾರರ ವಿವರಗಳು, ತಪಾಸಣಾ ದಾಖಲೆಗಳು, ಔಷಧಿ ಆರ್ಡರ್‌ಗಳು ಮತ್ತು ಧ್ವನಿ ಲಾಗ್‌ಗಳ ಸಂಪೂರ್ಣ ನಿರ್ವಹಣೆ',
      voiceGuidance: 'ಅಡ್ಮಿನ್ ನಿಯಂತ್ರಣ ಪುಟಕ್ಕೆ ಸ್ವಾಗತ. ಇಲ್ಲಿ ನೀವು ಬಳಕೆದಾರರ ಎಲ್ಲಾ ದಾಖಲೆಗಳನ್ನು ವೀಕ್ಷಿಸಬಹುದು, ತಿದ್ದುಪಡಿ ಮಾಡಬಹುದು ಅಥವಾ ಅಳಿಸಬಹುದು.',
      tabUsers: 'ಬಳಕೆದಾರರ ದಾಖಲೆಗಳು',
      tabScreenings: 'ತಪಾಸಣಾ ಫಲಿತಾಂಶಗಳು',
      tabOrders: 'ಔಷಧಿ ಆರ್ಡರ್‌ಗಳು',
      tabVoice: 'ಧ್ವನಿ ಸಂಭಾಷಣೆ ಲಾಗ್‌ಗಳು',
      databaseStatus: 'MongoDB ಡೇಟಾಬೇಸ್ ಸ್ಥಿತಿ',
      editAction: 'ತಿದ್ದುಪಡಿ (Edit)',
      deleteAction: 'ಅಳಿಸಿ (Delete)',
      saveAction: 'ಉಳಿಸಿ (Save)',
      cancelAction: 'ರದ್ದುಮಾಡಿ (Cancel)',
    },
  },

  // 2. Hindi (हिंदी)
  hi: {
    appName: 'AI हेल्थ केयर',
    selectLanguage: 'भाषा चुनें',
    selectLanguagePrompt: 'AI हेल्थ केयर में आपका स्वागत है! कृपया आगे बढ़ने के लिए अपनी भाषा चुनें।',
    languages: {
      kn: 'ಕನ್ನಡ (Kannada)',
      hi: 'हिंदी (Hindi)',
      en: 'English (English)',
    },
    welcomeSpokenIntro: 'नमस्ते! AI हेल्थ केयर में आपका स्वागत है। कृपया अपनी पसंदीदा भाषा चुनें। इसके बाद मैं आवाज़ द्वारा आपका मार्गदर्शन करूँगा।',
    nav: {
      page1: '1. लॉगिन और पंजीकरण',
      page2: '2. रिपोर्ट और फोटो अपलोड',
      page3: '3. स्वास्थ्य जांच',
      page4: '4. दवाएं और ऑर्डर',
      page5: '5. इतिहास और रिकॉर्ड्स',
      page6: '6. हमारे बारे में',
      page7: '7. एडमिन कंट्रोल',
      logout: 'लॉगआउट',
      speakAssistance: 'ध्वनि सहायक',
      mute: 'म्यूट',
      unmute: 'ध्वनि चालू',
    },
    page1: {
      title: 'सुरक्षित लॉगिन और नया साइन-अप',
      subtitle: 'रीयल-टाइम OTP और AI वॉयस ऑटो-फिलिंग सहायता के साथ',
      tabLogin: 'लॉगिन',
      tabSignup: 'नया पंजीकरण',
      voiceBannerTitle: 'AI वॉयस ऑटो-फिलिंग सहायक',
      voiceBannerDesc: 'माइक दबाएं और हिंदी में अपना नाम, उम्र, मोबाइल नंबर बोलें। AI अपने आप फॉर्म भर देगा!',
      voiceButtonActive: 'सुन रहा हूँ... बोलिए',
      voiceButtonIdle: 'बोलकर फॉर्म भरने के लिए क्लिक करें',
      voiceGuidancePrompt: 'स्वागत है! आप लॉगिन या पंजीकरण कर सकते हैं। माइक दबाकर अपना नाम, मोबाइल नंबर और विवरण बोलें।',
      fullName: 'पूरा नाम',
      mobileNumber: 'मोबाइल नंबर (10 अंक)',
      emailAddress: 'ईमेल आईडी (वैकल्पिक)',
      age: 'उम्र',
      gender: 'लिंग',
      genderMale: 'पुरुष',
      genderFemale: 'महिला',
      genderOther: 'अन्य',
      password: 'पासवर्ड',
      otpCode: '6-अंकों का OTP कोड',
      sendOtp: 'OTP भेजें',
      resendOtp: 'दोबारा OTP भेजें',
      verifyOtp: 'OTP सत्यापित करें',
      otpSentSuccess: 'रीयल-टाइम OTP आपके मोबाइल नंबर पर भेज दिया गया है!',
      otpCountdown: 'सेकंड शेष',
      loginWithPassword: 'पासवर्ड से लॉगिन',
      loginWithOtp: 'मोबाइल OTP से लॉगिन',
      loginButton: 'सुरक्षित लॉगिन करें',
      signupButton: 'खाता बनाएं',
      dontHaveAccount: 'खाता नहीं है? पंजीकरण करें',
      alreadyHaveAccount: 'पहले से खाता है? लॉगिन करें',
      encryptionBadge: '256-बिट एन्क्रिप्शन द्वारा सुरक्षित',
    },
    page2: {
      title: 'स्वास्थ्य रिपोर्ट और समस्या की फोटो अपलोड करें',
      subtitle: 'बाईं ओर मेडिकल रिपोर्ट और दाईं ओर प्रभावित अंग की फोटो अपलोड करें',
      voiceGuidance: 'पेज 2 में स्वागत है! बाईं ओर अपनी हालिया स्वास्थ्य रिपोर्ट अपलोड करें, और दाईं ओर त्वचा, बाल, दांत या आंख की समस्या की फोटो अपलोड करें।',
      leftTitle: 'बाईं ओर: हालिया स्वास्थ्य रिपोर्ट',
      leftSubtitle: 'ब्लड टेस्ट, पैथोलॉजी या क्लिनिकल रिपोर्ट (PDF, DOCX, TXT या स्कैन)',
      rightTitle: 'दाईं ओर: स्वास्थ्य समस्या की फोटो',
      rightSubtitle: 'त्वचा, बाल, दांत, आंख या सामान्य समस्या की स्पष्ट तस्वीर',
      supportedFormats: 'PDF, DOCX, TXT, JPG, PNG समर्थित',
      uploadReportBtn: 'रिपोर्ट फाइल चुनें',
      uploadPhotoBtn: 'फोटो चुनें / कैमरा',
      orChooseSample: 'या तुरंत परीक्षण के लिए नमूना चुनें:',
      sampleReports: 'नमूना रिपोर्ट',
      samplePhotos: 'नमूना फोटो',
      selectedCategory: 'स्वास्थ्य श्रेणी',
      categories: {
        skin: 'त्वचा संबंधी समस्याएं',
        hair: 'बाल और स्कैल्प',
        dental: 'दांत और मसूड़े',
        eye: 'आंखों की परेशानी',
        other: 'सामान्य स्वास्थ्य',
      },
      categoryDesc: {
        skin: 'चकत्ते, खुजली, एलर्जी, दाने',
        hair: 'रूसी, बालों का झड़ना, पतलापन',
        dental: 'दांत दर्द, मसूड़ों में सूजन, संवेदनशीलता',
        eye: 'लालिमा, पानी आना, आंखों की थकान',
        other: 'बुखार, गले में दर्द, कमजोरी',
      },
      removeUploaded: 'हटाएं',
      proceedToScreening: 'जांच के लिए आगे बढ़ें',
      noUploadVoiceNotice: 'यदि आप कोई फाइल अपलोड नहीं करते हैं, तो अगले पेज पर वॉयस असिस्टेंट सीधे आपसे सवाल पूछकर जांच करेगा।',
    },
    page3: {
      title: 'AI स्वास्थ्य जांच परिणाम',
      subtitle: 'अपलोड किए गए स्रोत का विश्लेषण या वॉयस असिस्टेंट द्वारा सीधी जांच',
      voiceReadingOut: 'वॉयस असिस्टेंट परिणाम पढ़कर सुना रहा है...',
      sourceModeTitle: 'अपलोड किए गए स्रोत से जांच परिणाम',
      voiceModeTitle: 'AI वॉयस असिस्टेंट इंटरैक्टिव स्वास्थ्य जांच',
      voiceModeSubtitle: 'आपने कोई फाइल अपलोड नहीं की है। कृपया वॉयस असिस्टेंट के सवालों का जवाब बोलकर दें।',
      conditionIdentified: 'पहचानी गई स्वास्थ्य स्थिति',
      confidenceScore: 'AI सटीकता स्कोर',
      severityLabel: 'गंभीरता का स्तर',
      severityLevels: {
        mild: 'हल्की (Mild)',
        moderate: 'मध्यम (Moderate)',
        attention_needed: 'ध्यान देने योग्य (Attention Needed)',
        urgent: 'तत्काल डॉक्टर से मिलें (Urgent)',
      },
      symptomsObserved: 'देखे गए लक्षण',
      clinicalExplanation: 'क्लिनिकल विश्लेषण एवं सारांश',
      recommendedCare: 'घरेलू देखभाल और परामर्श',
      voiceQuestionnaire: {
        question1: '1. समस्या शरीर के किस हिस्से में है? (त्वचा, बाल, दांत, आंख)',
        question2: '2. यह समस्या कितने दिनों से है?',
        question3: '3. दर्द या खुजली कितनी तेज है?',
        question4: '4. क्या आपने पहले कोई दवा ली है या कोई एलर्जी है?',
        answer1Placeholder: 'उदा: चेहरे पर लाल चकत्ते और खुजली',
        answer2Placeholder: 'उदा: पिछले 3 दिनों से',
        answer3Placeholder: 'उदा: मध्यम खुजली और जलन',
        answer4Placeholder: 'उदा: कोई विशेष दवा नहीं ली',
        speakAnswer: 'बोलकर उत्तर दें',
        submitVoiceAssessment: 'वॉयस जांच पूरी करें',
      },
      proceedToMedicines: 'दवाओं की सिफारिश और ऑर्डर पर जाएं',
      reAnalyze: 'पुनः जांच करें',
    },
    page4: {
      title: 'दवाओं की जानकारी और वॉयस आधारित ऑर्डर',
      subtitle: 'आपकी जांच के आधार पर सुझाई गई दवाएं और आसान वॉयस ऑर्डरिंग',
      voiceGuidance: 'पेज 4 में स्वागत है! आपकी जांच के अनुसार सुझाई गई दवाएं यहां उपलब्ध हैं। आप आवाज से बोलकर या बटन से ऑर्डर कर सकते हैं।',
      recommendedMeds: 'सुझाई गई दवाएं',
      voiceOrderNotice: 'आवाज से ऑर्डर करने के लिए माइक दबाएं:',
      voiceOrderSample: 'जैसे: "सभी दवाएं ऑर्डर करें" या "आई ड्रॉप बुक करें"',
      speakToOrder: 'आवाज से ऑर्डर करें',
      cartSummary: 'ऑर्डर कार्ट',
      emptyCart: 'कार्ट खाली है। दवाएं जोड़ें।',
      dosage: 'खुराक',
      timing: 'समय',
      precautions: 'सावधानी',
      addToCart: 'कार्ट में जोड़ें',
      quantity: 'मात्रा',
      totalAmount: 'कुल राशि',
      deliveryDetails: 'डिलीवरी विवरण',
      addressLabel: 'डिलीवरी का पता',
      phoneLabel: 'संपर्क मोबाइल नंबर',
      paymentMethod: 'भुगतान का तरीका',
      placeOrderBtn: 'दवाओं का ऑर्डर दें',
      orderSuccessTitle: 'ऑर्डर सफलतापूर्वक प्राप्त हुआ!',
      orderSuccessDesc: 'आपका दवाओं का ऑर्डर स्वीकृत हो गया है। ऑर्डर आईडी:',
      proceedToHistory: 'संपूर्ण इतिहास पेज पर जाएं',
    },
    page5: {
      title: 'संपूर्ण इतिहास एवं रिकॉर्ड्स',
      subtitle: 'लॉगिन, जांच, वॉयस बातचीत और दवाओं के ऑर्डर का पूरा रिकॉर्ड',
      voiceGuidance: 'यह इतिहास पेज है। आपके सभी लॉगिन विवरण, जांच परिणाम, वॉयस बातचीत और दवा ऑर्डर यहां सुरक्षित हैं। आप इन्हें डाउनलोड कर सकते हैं।',
      tabSessions: 'लॉगिन एवं साइन-अप रिकॉर्ड',
      tabScreening: 'स्वास्थ्य जांच इतिहास',
      tabVoiceLogs: 'वॉयस असिस्टेंट बातचीत लॉग',
      tabOrders: 'दवा ऑर्डर इतिहास',
      downloadMedicalReport: 'मेडिकल रिपोर्ट डाउनलोड करें (PDF / Print)',
      downloadFullJson: 'पूरा डेटा डाउनलोड करें (JSON)',
      downloadVoiceTranscript: 'वॉयस बातचीत ट्रांसक्रिप्ट (TXT)',
      emptyRecords: 'अभी कोई रिकॉर्ड उपलब्ध नहीं है।',
      restartScreening: 'नई स्वास्थ्य जांच शुरू करें',
    },
    page6: {
      title: 'हमारे बारे में (About AI HEALTH CARE)',
      subtitle: 'आर्टिफिशियल इंटेलिजेंस आधारित उन्नत स्वास्थ्य जांच और बहुभाषी वॉयस प्लेटफॉर्म',
      voiceGuidance: 'हमारे बारे में पेज में स्वागत है! AI HEALTH CARE अत्याधुनिक वॉयस असिस्टेंट, मल्टीमॉडल स्क्रीनिंग और नजदीकी अस्पताल मार्गदर्शन प्रदान करता है।',
      missionTitle: 'हमारा उद्देश्य एवं तकनीकी दृष्टिकोण',
      missionDesc: 'प्रत्येक व्यक्ति को उनकी मातृभाषा (कन्नड़, हिंदी, अंग्रेजी) में त्वरित, सटीक और सुगम स्वास्थ्य परीक्षण, उचित दवा परामर्श और निकटतम चिकित्सा सहायता उपलब्ध कराना हमारा संकल्प है।',
      featuresTitle: 'उन्नत कार्यप्रणाली (Advanced Capabilities)',
      features: [
        { title: 'त्रिभाषी AI वॉयस असिस्टेंट', desc: 'कन्नड़, हिंदी और अंग्रेजी में बोलकर फॉर्म भरना एवं इंटरैक्टिव मौखिक स्वास्थ्य जांच।' },
        { title: 'मल्टीमॉडल क्लिनिकल स्क्रीनिंग', desc: 'त्वचा, बाल, दांत, आंख और मेडिकल रिपोर्टों का उन्नत AI विजन विश्लेषण।' },
        { title: 'ऑटो-लोकेशन एवं अस्पताल मानचित्र', desc: 'उपयोगकर्ता के वास्तविक जीपीएस स्थान के आधार पर नजदीकी अस्पतालों और फार्मेसियों का लाइव मैप नेविगेशन।' },
        { title: 'रीयल-टाइम OTP और सुरक्षा', desc: 'SHA-256 एन्क्रिप्शन और मोबाइल नंबर सत्यापन द्वारा सुरक्षित प्रमाणीकरण।' },
        { title: 'MongoDB डेटाबेस क्लाउड स्टोरेज', desc: 'सभी स्क्रीनिंग रिकॉर्ड, दवा ऑर्डर और वॉयस लॉग्स का निरंतर और सुरक्षित बैकअप।' },
      ],
    },
    page7: {
      title: 'एडमिन कंट्रोल पैनल (Admin Control Panel)',
      subtitle: 'यूजर लॉग्स, स्क्रीनिंग रिकॉर्ड्स, दवा ऑर्डर्स और वॉयस चैट्स का संपूर्ण प्रबंधन',
      voiceGuidance: 'एडमिन कंट्रोल में आपका स्वागत है। यहां आप यूजर्स के सभी रिकॉर्ड्स देख सकते हैं, संपादित कर सकते हैं अथवा हटा सकते हैं।',
      tabUsers: 'यूजर रिकॉर्ड्स',
      tabScreenings: 'स्क्रीनिंग रिकॉर्ड्स',
      tabOrders: 'दवा ऑर्डर्स',
      tabVoice: 'वॉयस बातचीत लॉग्स',
      databaseStatus: 'MongoDB डेटाबेस स्थिति',
      editAction: 'एडिट (Edit)',
      deleteAction: 'डिलीट (Delete)',
      saveAction: 'सेव (Save)',
      cancelAction: 'रद्द करें (Cancel)',
    },
  },

  // 3. English
  en: {
    appName: 'AI HEALTH CARE',
    selectLanguage: 'Select Language',
    selectLanguagePrompt: 'Welcome to AI HEALTH CARE! Please select your preferred language to proceed.',
    languages: {
      kn: 'ಕನ್ನಡ (Kannada)',
      hi: 'हिंदी (Hindi)',
      en: 'English (English)',
    },
    welcomeSpokenIntro: 'Hello and welcome to AI HEALTH CARE. Please select your preferred language: Kannada, Hindi, or English. Then I will guide you through voice assistance.',
    nav: {
      page1: '1. Login & Sign-Up',
      page2: '2. Report & Photo Upload',
      page3: '3. Health Screening',
      page4: '4. Medicines & Order',
      page5: '5. History & Audit',
      page6: '6. About Us',
      page7: '7. Admin Control',
      logout: 'Logout',
      speakAssistance: 'Voice Assistant',
      mute: 'Mute',
      unmute: 'Sound On',
    },
    page1: {
      title: 'Encrypted Sign-In & Registration',
      subtitle: 'With real-time OTP mobile verification and AI Voice Auto-Filling Assistant',
      tabLogin: 'Sign In',
      tabSignup: 'Create Account',
      voiceBannerTitle: 'AI Voice Auto-Filling Assistant',
      voiceBannerDesc: 'Tap the mic and speak your name, phone number, age, and details in English, Kannada, or Hindi. The assistant auto-fills the form for you!',
      voiceButtonActive: 'Listening... Please speak',
      voiceButtonIdle: 'Click to Speak & Auto-Fill Form',
      voiceGuidancePrompt: 'Welcome! You can sign up or log in. Tap the microphone and tell me your name, mobile number, and age to auto-fill.',
      fullName: 'Full Name',
      mobileNumber: 'Mobile Number (10 digits)',
      emailAddress: 'Email Address (Optional)',
      age: 'Age',
      gender: 'Gender',
      genderMale: 'Male',
      genderFemale: 'Female',
      genderOther: 'Other',
      password: 'Password',
      otpCode: '6-digit Real-Time OTP',
      sendOtp: 'Send OTP',
      resendOtp: 'Resend OTP',
      verifyOtp: 'Verify OTP',
      otpSentSuccess: 'Real-time OTP has been dispatched to your mobile number!',
      otpCountdown: 'seconds left',
      loginWithPassword: 'Sign In with Password',
      loginWithOtp: 'Sign In with Mobile OTP',
      loginButton: 'Secure Sign In',
      signupButton: 'Create Encrypted Account',
      dontHaveAccount: "Don't have an account? Sign up here",
      alreadyHaveAccount: 'Already have an account? Sign in',
      encryptionBadge: 'Protected by SHA-256 & End-to-End Encryption',
    },
    page2: {
      title: 'Health Report & Issue Photo Upload',
      subtitle: 'Left side: Patient recent health report | Right side: Photo of health issue',
      voiceGuidance: 'Welcome to Page 2. On the left, upload your recent medical health report in any format. On the right, upload a photo of your skin, hair, dental, or eye issue.',
      leftTitle: 'Left Side: Recent Health Report',
      leftSubtitle: 'Blood test, lab report, or clinical summary (PDF, DOCX, TXT, or scan)',
      rightTitle: 'Right Side: Health Issue Photo',
      rightSubtitle: 'Clear photo of skin, hair, dental, eye, or general concern',
      supportedFormats: 'Supports PDF, DOCX, TXT, JPG, PNG',
      uploadReportBtn: 'Select Report Document',
      uploadPhotoBtn: 'Choose Issue Photo / Camera',
      orChooseSample: 'Or select a clinical sample for quick testing:',
      sampleReports: 'Sample Reports',
      samplePhotos: 'Sample Photos',
      selectedCategory: 'Target Health Scope',
      categories: {
        skin: 'Skin Issues',
        hair: 'Hair & Scalp',
        dental: 'Dental & Gums',
        eye: 'Eye & Vision',
        other: 'General Health',
      },
      categoryDesc: {
        skin: 'Rash, hives, eczema, dermatitis, acne',
        hair: 'Dandruff, thinning, hair fall, scalp itch',
        dental: 'Tooth pain, gum bleeding, sensitivity',
        eye: 'Redness, irritation, digital strain, fatigue',
        other: 'Fever, sore throat, dehydration, pain',
      },
      removeUploaded: 'Remove',
      proceedToScreening: 'Proceed to Health Screening',
      noUploadVoiceNotice: 'Note: If you do not upload any file, Page 3 will provide a complete interactive AI voice screening assistant.',
    },
    page3: {
      title: 'AI Health Screening Assessment',
      subtitle: 'Multimodal source diagnostic analysis or voice-guided interactive screening',
      voiceReadingOut: 'Voice Assistant is reading out the clinical findings...',
      sourceModeTitle: 'Screening Findings from Uploaded Sources',
      voiceModeTitle: 'AI-Based Voice Assistant Health Screening',
      voiceModeSubtitle: 'No uploaded source detected. The voice assistant will conduct an interactive diagnostic screening with you.',
      conditionIdentified: 'Identified Health Condition',
      confidenceScore: 'AI Confidence Score',
      severityLabel: 'Severity Level',
      severityLevels: {
        mild: 'Mild',
        moderate: 'Moderate',
        attention_needed: 'Attention Needed',
        urgent: 'Urgent Medical Attention',
      },
      symptomsObserved: 'Observed Symptoms',
      clinicalExplanation: 'Clinical Assessment & Summary',
      recommendedCare: 'Recommended Care & Next Steps',
      voiceQuestionnaire: {
        question1: '1. What area is affected? (Skin, Hair, Dental, Eye, or General)',
        question2: '2. How many days have you had these symptoms?',
        question3: '3. What is the level of pain, itching, or discomfort?',
        question4: '4. Any known triggers, prior medications, or allergies?',
        answer1Placeholder: 'e.g., Red itchy rash on forearm',
        answer2Placeholder: 'e.g., Past 3 days',
        answer3Placeholder: 'e.g., Moderate itching, no pain',
        answer4Placeholder: 'e.g., Used mild moisturizer only',
        speakAnswer: 'Speak Answer',
        submitVoiceAssessment: 'Submit Voice Assessment',
      },
      proceedToMedicines: 'Proceed to Medicines & Recommendations',
      reAnalyze: 'Screen Another Issue',
    },
    page4: {
      title: 'Medicines & AI Voice-Assisted Ordering',
      subtitle: 'Targeted medicines based on your health screening with voice ordering capability',
      voiceGuidance: 'Welcome to Page 4. Based on your health screening, here are the recommended medicines and treatment options. You can order using voice commands or one-click cart.',
      recommendedMeds: 'Recommended Medicines for Your Condition',
      voiceOrderNotice: 'Tap the microphone to order using voice commands:',
      voiceOrderSample: 'e.g., "Order all prescribed medicines" or "Order Hydrocortisone cream"',
      speakToOrder: 'Speak to Order Medicines',
      cartSummary: 'Order Cart Summary',
      emptyCart: 'Your cart is currently empty. Add medicines to order.',
      dosage: 'Dosage',
      timing: 'Timing',
      precautions: 'Precautions',
      addToCart: 'Add to Cart',
      quantity: 'Quantity',
      totalAmount: 'Total Amount',
      deliveryDetails: 'Delivery & Contact Details',
      addressLabel: 'Delivery Address',
      phoneLabel: 'Contact Phone Number',
      paymentMethod: 'Payment Option',
      placeOrderBtn: 'Place Medicine Order',
      orderSuccessTitle: 'Order Placed Successfully!',
      orderSuccessDesc: 'Your medicine order has been dispatched to our network pharmacy. Tracking ID:',
      proceedToHistory: 'Proceed to Complete History Page',
    },
    page5: {
      title: 'Unified Healthcare Audit & History Records',
      subtitle: 'Complete records of user sessions, screenings, voice assistant dialogues, and medicine orders',
      voiceGuidance: 'Welcome to the History page. Here you can inspect your full login sessions, diagnostic screenings, voice assistant communication history, and medicine orders with download options.',
      tabSessions: 'Login & Sign-Up Records',
      tabScreening: 'Screening History',
      tabVoiceLogs: 'Voice Assistant Interaction Logs',
      tabOrders: 'Medicine Orders History',
      downloadMedicalReport: 'Download Medical Summary Report (PDF / Print)',
      downloadFullJson: 'Download Full Audit Data (JSON)',
      downloadVoiceTranscript: 'Download Voice Transcript (TXT)',
      emptyRecords: 'No records recorded yet.',
      restartScreening: 'Start New Health Screening',
    },
    page6: {
      title: 'About AI HEALTH CARE',
      subtitle: 'Advanced Artificial Intelligence Healthcare Diagnostic & Multilingual Voice Platform',
      voiceGuidance: 'Welcome to the About Us page! AI HEALTH CARE provides cutting-edge voice intelligence, multimodal clinical screening, and real-time hospital map navigation.',
      missionTitle: 'Our Vision & Healthcare Mission',
      missionDesc: 'To provide every citizen with instant, accurate, and accessible preliminary health screening, personalized pharmaceutical guidance, and nearest clinical assistance in their native mother tongue (Kannada, Hindi, English).',
      featuresTitle: 'Advanced Architectural Features',
      features: [
        { title: 'Tri-Lingual Clinical Voice Assistant', desc: 'Auto-fills authentication forms, guides interactive diagnosis, and executes voice orders in Kannada, Hindi, and English.' },
        { title: 'Multimodal AI Health Analysis', desc: 'Preliminary screening for Skin, Hair, Dental, Eye, and General symptoms from uploaded photos or lab test reports.' },
        { title: 'Auto-Location & Nearest Hospital Map', desc: 'Real-time GPS geolocation fetching, calculating nearest 24/7 hospitals, clinics, and pharmacies with live map navigation.' },
        { title: 'Real-Time OTP Verification & SHA-256 Security', desc: 'Telecom-grade mobile verification and high-grade cryptographic credential hashing.' },
        { title: 'MongoDB State & Cloud Persistence', desc: 'End-to-end database persistence for patient records, clinical screenings, orders, and conversational audit trails.' },
      ],
    },
    page7: {
      title: 'Admin Control Center (Restricted Access)',
      subtitle: 'Complete Administrative Management: Users, Clinical Screenings, Medicine Orders, and Voice Audit Logs',
      voiceGuidance: 'Welcome to Admin Control. Here you can inspect, edit, or delete any user record, screening result, medicine order, or voice interaction log.',
      tabUsers: 'Registered Users',
      tabScreenings: 'Screening Records',
      tabOrders: 'Medicine Orders',
      tabVoice: 'Voice Interaction Logs',
      databaseStatus: 'MongoDB Database Status',
      editAction: 'Edit Record',
      deleteAction: 'Delete Record',
      saveAction: 'Save Changes',
      cancelAction: 'Cancel',
    },
  },
};
