// MindBridge AI - Core Domain Types

export type UserRole = 
  | 'STUDENT'
  | 'USER'
  | 'THERAPIST'
  | 'INSTITUTION_SAFETY_OFFICER'
  | 'INSTITUTION_ADMIN'
  | 'PLATFORM_ADMIN';

export type LanguageCode = 'en' | 'hi' | 'hinglish';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  preferredLanguage: LanguageCode;
  institutionId?: string;
  institutionName?: string;
  createdAt: string;
  isVerified?: boolean;
  emergencyContact?: TrustedContact;
  emergencyHelper?: EmergencyHelper;
  consentSettings?: ConsentSettings;
}

export interface EmergencyHelper {
  name: string;
  relationship: string;
  phone: string;
  helperMessage: string;
  notifyOnDeterioration: boolean;
  alertSentCount: number;
  lastAlertSentAt?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isVerified: boolean;
  consentGranted: boolean;
  canReceiveEmergencyAlerts: boolean;
  lastVerifiedAt?: string;
}

export interface ConsentSettings {
  analyticsConsent: boolean;
  emergencyEscalationConsent: boolean;
  institutionalAggregatedConsent: boolean;
  aiConversationMemoryConsent: boolean;
  thirdPartySharingConsent: boolean;
  version: string;
  lastUpdatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isCrisis?: boolean;
  isMidConvoNudge?: boolean;
  language?: LanguageCode;
  suggestedInterventions?: string[];
  safetyFlags?: SafetyFlag[];
  approvedForCounsellor?: boolean; // User must explicitly approve to share with counsellor!
}

export interface SafetyFlag {
  category: 'SELF_HARM' | 'SUICIDE_IDEATION' | 'EXTREME_DISTRESS' | 'AMBIGUOUS_DISTRESS' | 'SAFE';
  confidence: number;
  explanation: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  inactivityPromptEnabled: boolean;
  lastInteractionAt: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  score: number; // 1 to 5 (1: very low, 5: vibrant)
  label: string;
  emoji: string;
  energyLevel: number; // 1-10
  stressLevel: number; // 1-10
  sleepHours: number;
  triggers: string[];
  notes?: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  aiReflectionPrompt?: string;
  sentiment?: 'positive' | 'neutral' | 'reflective' | 'challenging';
  tags: string[];
  createdAt: string;
  isEncrypted: boolean;
  approvedForCounsellor?: boolean;
}

export type ScreeningType = 'PHQ-9' | 'GAD-7' | 'PSS-10';

export interface ScreeningQuestion {
  id: number;
  text: string;
  options: { label: string; score: number }[];
}

export interface ScreeningResult {
  id: string;
  userId: string;
  screeningType: ScreeningType;
  totalScore: number;
  maxScore: number;
  severityLevel: 'Minimal' | 'Mild' | 'Moderate' | 'Moderately Severe' | 'Severe';
  concernIndex: number; // 0-100 Experimental Wellness Concern Index
  confidence: number; // 0.0 - 1.0
  completedAt: string;
  responses: Record<number, number>;
  explanations: {
    observedIndicators: string[];
    whatItMeans: string;
    whatItDoesNotMean: string;
    recommendationReason: string;
    recommendedActions: string[];
  };
}

export type SafetyCaseStatus = 
  | 'DETECTED'
  | 'PENDING_REVIEW'
  | 'CONFIRMED_FOR_ESCALATION'
  | 'NOTIFICATION_QUEUED'
  | 'DELIVERED'
  | 'ACKNOWLEDGED'
  | 'RESOLVED'
  | 'ESCALATION_FAILED';

export interface SafetyCase {
  id: string;
  userId: string;
  userDisplayName: string;
  institutionId?: string;
  riskCategory: 'HIGH_RISK_IMMEDIATE' | 'ELEVATED_CONCERN' | 'MODERATE_CONCERN' | 'LOW_CONCERN';
  status: SafetyCaseStatus;
  detectedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  escalationRequired: boolean;
  escalationDeliveredTo?: string; // only if user consented
  auditLogs: {
    timestamp: string;
    action: string;
    actor: string;
    details: string;
  }[];
}

export interface Therapist {
  id: string;
  name: string;
  title: string;
  qualifications: string[];
  licenseNumber: string;
  isVerified: boolean;
  avatarUrl: string;
  bio: string;
  specializations: string[];
  languages: string[];
  sessionFee: number;
  currency: string;
  sessionDurationMinutes: number;
  rating: number;
  reviewsCount: number;
  availableDays: string[];
  availableSlots: string[];
}

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  therapistId: string;
  therapistName: string;
  therapistTitle: string;
  dateTime: string;
  durationMinutes: number;
  type: 'VIDEO' | 'AUDIO' | 'CHAT';
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  fee: number;
  isPaid: boolean;
  meetingLink: string;
  clinicalNotes?: string;
  createdAt: string;
}

export interface WellnessIntervention {
  id: string;
  title: string;
  category: 'BREATHING' | 'GROUNDING' | 'MINDFULNESS' | 'SLEEP' | 'COGNITIVE' | 'WORKLOAD';
  description: string;
  estimatedMinutes: number;
  difficulty: 'Easy' | 'Moderate' | 'Deep';
  intendedBenefit: string;
  iconName: string;
}

export interface InstitutionAnalytics {
  institutionName: string;
  enrolledUsersCount: number;
  activeUsersMonthly: number;
  voluntaryParticipationRate: number; // percentage
  averageWellnessScore: number;
  stressDistribution: {
    low: number;
    moderate: number;
    elevated: number;
  };
  monthlyTrends: {
    month: string;
    avgMood: number;
    checkInVolume: number;
    counselorBookings: number;
  }[];
  activeSafetyCasesCount: number;
  resolvedSafetyCasesCount: number;
  kAnonymityApplied: boolean;
}

// ----------------------------------------------------
// COMMUNITY & PEER CIRCLES
// ----------------------------------------------------
export interface CommunityPost {
  id: string;
  circleId: 'mild-stress' | 'anxiety-panic' | 'burnout' | 'low-mood';
  circleName: string;
  authorHandle: string;
  authorMentalHealthLevel: 'Mild' | 'Moderate' | 'Elevated';
  content: string;
  likesCount: number;
  hasLiked?: boolean;
  createdAt: string;
  comments: CommunityComment[];
  tags: string[];
}

export interface CommunityComment {
  id: string;
  authorHandle: string;
  content: string;
  createdAt: string;
}

// ----------------------------------------------------
// DAILY HEALTH RECORD & IMPROVEMENT PROGRESS
// ----------------------------------------------------
export interface DailyProgressSnapshot {
  date: string;
  dayLabel: string;
  overallScore: number; // 0-100
  moodScore: number;    // 1-5
  stressLevel: number;  // 1-10
  sleepHours: number;
  anxietyScore: number; // 0-21 (GAD-7)
  mindfulnessMinutes: number;
  improvingDayOverDay: boolean;
  notes: string;
}
