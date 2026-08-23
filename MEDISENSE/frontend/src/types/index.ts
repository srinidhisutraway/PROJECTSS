export interface OnboardingData {
  completed?: boolean;
  ageGroup?: string;
  gender?: string;
  skinType?: string;
  mainConcerns?: string[];
  acneHistory?: string;
  allergies?: string[];
  currentRoutine?: string;
  productsUsed?: string[];
  sunscreenUsage?: string;
  waterIntakeLiters?: number;
  sleepHours?: number;
  dietHabits?: string;
  smokingAlcohol?: string;
  dermatologistVisits?: string;
  medications?: string[];
  familyHistory?: string[];
  occupation?: string;
  dailySunExposureHours?: number;
  cosmeticTreatments?: string[];
  existingConditions?: string[];
  wantsReminders?: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: { url: string; publicId: string };
  authProvider: 'local' | 'google';
  isEmailVerified: boolean;
  hasCompletedOnboarding: boolean;
  onboarding?: OnboardingData;
  createdAt: string;
}

export interface Prediction {
  condition: string;
  label?: string;
  confidence: number;
}

export interface HydrationAnalysis {
  hydrationLevel: number;
  oiliness: number;
  textureScore: number;
  rednessScore: number;
  drynessScore: number;
  recommendation: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export type Severity = 'mild' | 'moderate' | 'severe' | 'unknown';
export type ConsultationUrgency = 'routine' | 'soon' | 'urgent';

export interface SkinAnalysis {
  _id: string;
  image: { url: string; publicId: string };
  predictions: Prediction[];
  topCondition: string;
  topConfidence: number;
  severity: Severity;
  affectedRegion?: string;
  explanation: string;
  possibleCauses: string[];
  symptoms: string[];
  precautions: string[];
  recommendedRoutine: string[];
  dos: string[];
  donts: string[];
  consultationUrgency: ConsultationUrgency;
  faqs: FAQ[];
  hydrationAnalysis: HydrationAnalysis;
  grayscaleImage?: string;
  highlightedImage?: string;
  keyIndicators?: string[];
  modelVersion: string;
  notes?: string;
  createdAt: string;
}

export interface MedicalReport {
  _id: string;
  title: string;
  type: 'prescription' | 'lab-report' | 'dermatologist-note' | 'other';
  file: { url: string; publicId: string; format?: string };
  notes?: string;
  reportDate?: string;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

export interface ChatConversation {
  _id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
  createdAt: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  readTimeMinutes: number;
  isTrending: boolean;
  publishedAt: string;
  viewCount: number;
}

export interface QuizSummary {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  badgeAwarded?: string;
  questionCount: number;
}

export interface QuizQuestion {
  _id: string;
  question: string;
  options: string[];
  points: number;
}

// Clinic shape sourced from free OpenStreetMap/Overpass data (no billing,
// no API key). No star ratings exist in OSM the way Google Places has
// them — instead we rank by dermatology-relevance and distance.
export interface Clinic {
  placeId: string;
  name: string;
  address?: string | null;
  location?: { lat: number; lng: number };
  phone?: string | null;
  website?: string | null;
  category?: string;
  isDermatologyFocused?: boolean;
  distanceKm?: number;
}

export interface ConditionSummary {
  slug: string;
  label: string;
  category: string;
  explanation: string;
  keywords: string[];
}

export interface ConditionDetail extends ConditionSummary {
  symptoms: string[];
  possibleCauses: string[];
  dos: string[];
  donts: string[];
}

export interface PaginatedResponse<T> {
  results: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}
