import { SafetyCase } from '../../types';

export interface CrisisResource {
  id: string;
  name: string;
  region: string;
  contact: string;
  type: 'PHONE' | 'TEXT' | 'ONLINE';
  availability: string;
  isTollFree: boolean;
  description: string;
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    id: 'tele-manas',
    name: 'Tele-MANAS (Govt of India)',
    region: 'India',
    contact: '14416 / 1800-891-4416',
    type: 'PHONE',
    availability: '24/7 Toll-Free (Multi-language)',
    isTollFree: true,
    description: 'National Tele Mental Health Programme of India offering free, 24/7 psychological support in 20+ languages.'
  },
  {
    id: 'kiran',
    name: 'KIRAN Mental Health Helpline',
    region: 'India',
    contact: '1800-599-0019',
    type: 'PHONE',
    availability: '24/7 Toll-Free',
    isTollFree: true,
    description: 'Government mental health helpline providing early screening, first aid, psychological support, and distress management.'
  },
  {
    id: 'vandrevala',
    name: 'Vandrevala Foundation',
    region: 'India & Global',
    contact: '+91 9999 666 555',
    type: 'PHONE',
    availability: '24/7 Free & Confidential',
    isTollFree: false,
    description: 'Experienced mental health professionals providing immediate crisis intervention and emotional counselling.'
  },
  {
    id: '988-us',
    name: '988 Suicide & Crisis Lifeline',
    region: 'United States & Canada',
    contact: '988',
    type: 'PHONE',
    availability: '24/7 Free & Confidential',
    isTollFree: true,
    description: 'Immediate 24/7 support for anyone experiencing mental health distress or substance-related emergencies.'
  },
  {
    id: 'crisis-text-line',
    name: 'Crisis Text Line',
    region: 'Global / US / UK',
    contact: 'Text HOME to 741741',
    type: 'TEXT',
    availability: '24/7',
    isTollFree: true,
    description: 'Free, 24/7 crisis support via SMS with a trained volunteer crisis responder.'
  },
  {
    id: 'emergency-112',
    name: 'National Emergency Services (India)',
    region: 'India',
    contact: '112',
    type: 'PHONE',
    availability: '24/7 Immediate Dispatch',
    isTollFree: true,
    description: 'Universal emergency response number for immediate medical, ambulance, or police intervention.'
  }
];

export interface SafetyEvaluationResult {
  isImmediateCrisis: boolean;
  category: 'HIGH_RISK_IMMEDIATE' | 'ELEVATED_CONCERN' | 'MODERATE_CONCERN' | 'AMBIGUOUS_DISTRESS' | 'SAFE';
  confidenceScore: number;
  matchedIndicators: string[];
  recommendedSafetyAction: 'IMMEDIATE_HOTLINE_AND_HUMAN_REVIEW' | 'WARM_CHECKIN_AND_WELLNESS' | 'STANDARD_SUPPORT';
  rationale: string;
}

// Rigorous explicit intent patterns
const EXPLICIT_HARM_REGEX = [
  /\b(kill\s+(my\s*self|me)|end\s+(it\s+all|my\s+life)|suicide|want\s+to\s+die|hang\s+myself|slit\s+my\s+wrists|overdose|jump\s+off)\b/i,
  /\b(mar\s+jaana\s+chahta|jaan\s+de\s+doonga|zindagi\s+khatam\s+karna|khatam\s+kar\s+lena)\b/i
];

const AMBIGUOUS_DISTRESS_REGEX = [
  /\b(can't\s+take\s+this\s+anymore|exhausted|so\s+done|hate\s+everything|broken|crying\s+all\s+day|lost\s+hope)\b/i,
  /\b(bohot\s+thak\s+gaya|sab\s+kuch\s+kharab\s+hai|mann\s+nahi\s+lagta)\b/i
];

export function evaluateSafetyRisk(message: string): SafetyEvaluationResult {
  const trimmed = message.trim();
  if (!trimmed) {
    return {
      isImmediateCrisis: false,
      category: 'SAFE',
      confidenceScore: 0.99,
      matchedIndicators: [],
      recommendedSafetyAction: 'STANDARD_SUPPORT',
      rationale: 'Empty or silence message. Silence alone is never treated as evidence of danger.'
    };
  }

  // Check explicit high-risk intent
  for (const regex of EXPLICIT_HARM_REGEX) {
    if (regex.test(trimmed)) {
      return {
        isImmediateCrisis: true,
        category: 'HIGH_RISK_IMMEDIATE',
        confidenceScore: 0.95,
        matchedIndicators: ['Explicit expression of self-harm or life-ending intent'],
        recommendedSafetyAction: 'IMMEDIATE_HOTLINE_AND_HUMAN_REVIEW',
        rationale: 'Explicit self-harm intent detected requiring immediate crisis support presentation and safety case creation.'
      };
    }
  }

  // Check ambiguous distress
  for (const regex of AMBIGUOUS_DISTRESS_REGEX) {
    if (regex.test(trimmed)) {
      return {
        isImmediateCrisis: false,
        category: 'ELEVATED_CONCERN',
        confidenceScore: 0.75,
        matchedIndicators: ['Elevated emotional distress / fatigue expression'],
        recommendedSafetyAction: 'WARM_CHECKIN_AND_WELLNESS',
        rationale: 'Distress markers present without explicit self-harm intent. Prioritizing empathetic inquiry and self-care resources.'
      };
    }
  }

  return {
    isImmediateCrisis: false,
    category: 'SAFE',
    confidenceScore: 0.90,
    matchedIndicators: [],
    recommendedSafetyAction: 'STANDARD_SUPPORT',
    rationale: 'Standard conversational or wellness query with no crisis indicators detected.'
  };
}

export function formatEmergencyNotificationPayload(
  safetyCase: SafetyCase,
  contactName: string
): {
  recipient: string;
  messageText: string;
  deliveryPolicy: string;
} {
  // CRITICAL PRIVACY & SAFETY PRINCIPLE:
  // Never disclose chat transcripts, questionnaire answers, or diagnoses in notifications.
  return {
    recipient: contactName,
    messageText: `Urgent wellbeing alert: MindBridge AI has recorded an urgent safety concern regarding a person who has authorized you as an emergency contact. Please follow your agreed safety plan or check on them directly. For immediate medical danger, please call 112 (India) or your local emergency line.`,
    deliveryPolicy: 'MINIMUM_NECESSARY_INFORMATION_ONLY_NO_DIAGNOSES_NO_TRANSCRIPTS'
  };
}

