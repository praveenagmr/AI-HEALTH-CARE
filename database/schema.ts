/**
 * AI HEALTH CARE - Database Schema & Data Models
 */

export type SupportedLanguage = 'kn' | 'hi' | 'en';

export type HealthCategory = 'skin' | 'hair' | 'dental' | 'eye' | 'other';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'unspecified';
  passwordHash?: string;
  role: 'admin' | 'user';
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    address?: string;
  };
  preferredLanguage: SupportedLanguage;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface UserSession {
  id: string;
  userId: string;
  phone: string;
  action: 'login' | 'signup' | 'otp_request' | 'otp_verify';
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
}

export interface OtpRecord {
  phone: string;
  otp: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
  isVerified: boolean;
}

export interface ScreeningFinding {
  id: string;
  userId: string;
  category: HealthCategory;
  conditionName: string;
  confidenceScore: number; // 0 to 100
  severity: 'mild' | 'moderate' | 'attention_needed' | 'urgent';
  symptomsObserved: string[];
  clinicalSummary: string;
  localizedSummary: {
    kn: string;
    hi: string;
    en: string;
  };
  hasUploadedPhoto: boolean;
  photoUrl?: string;
  photoName?: string;
  hasUploadedReport: boolean;
  reportName?: string;
  reportSummary?: string;
  voiceScreeningConducted: boolean;
  questionnaireAnswers?: {
    symptomArea?: string;
    durationDays?: string;
    painLevel?: string;
    triggers?: string;
    otherDetails?: string;
  };
  recommendedCare: string[];
  createdAt: string;
}

export interface VoiceInteractionLog {
  id: string;
  userId: string;
  timestamp: string;
  speaker: 'assistant' | 'user';
  language: SupportedLanguage;
  pageContext: 'page1_auth' | 'page2_upload' | 'page3_screening' | 'page4_medicines' | 'page5_history' | 'page6_about' | 'page7_admin';
  text: string;
  audioGenerated?: boolean;
}

export interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  category: HealthCategory;
  indication: string;
  dosage: string;
  timing: string;
  priceInr: number;
  requiresPrescription: boolean;
  stockStatus: 'in_stock' | 'low_stock';
  precautions: string;
  imageUrl?: string;
}

export interface MedicineOrder {
  id: string;
  userId: string;
  screeningId?: string;
  timestamp: string;
  items: Array<{
    medicine: MedicineItem;
    quantity: number;
  }>;
  totalAmountInr: number;
  deliveryAddress: string;
  contactPhone: string;
  deliveryLocation?: {
    latitude: number;
    longitude: number;
    city?: string;
  };
  trackingStatus?: {
    step: 1 | 2 | 3 | 4;
    label: string;
    updatedAt: string;
    etaMinutes: number;
  };
  paymentMethod: 'Cash on Delivery' | 'UPI / Online' | 'Medical Insurance' | 'Card Payment';
  status: 'Confirmed' | 'Processing' | 'Out for Delivery' | 'Delivered';
  orderedVia: 'voice_assistant' | 'manual_cart';
}

export interface NearbyMedicalFacility {
  id: string;
  name: string;
  type: 'hospital' | 'pharmacy' | 'clinic';
  specialty: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  openHours: string;
  rating: number;
  emergency24x7: boolean;
}
