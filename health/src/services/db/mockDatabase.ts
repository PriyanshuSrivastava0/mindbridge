import {
  User,
  Therapist,
  Appointment,
  MoodEntry,
  JournalEntry,
  ScreeningResult,
  SafetyCase,
  InstitutionAnalytics,
  Conversation,
  CommunityPost,
  DailyProgressSnapshot,
  EmergencyHelper
} from '../../types';

const INITIAL_USERS: User[] = [
  {
    id: 'usr-student-01',
    email: 'alex.chen@university.edu',
    name: 'Alex Chen',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    preferredLanguage: 'en',
    institutionId: 'inst-delhi-univ',
    institutionName: 'Apex Institute of Technology',
    createdAt: '2026-09-01T10:00:00Z',
    isVerified: true,
    emergencyContact: {
      id: 'tc-01',
      name: 'Rohan Chen',
      relationship: 'Older Brother',
      phone: '+91 98765 43210',
      email: 'rohan.chen@example.com',
      isVerified: true,
      consentGranted: true,
      canReceiveEmergencyAlerts: true,
      lastVerifiedAt: '2026-09-15T12:00:00Z'
    },
    emergencyHelper: {
      name: 'Rohan Chen',
      relationship: 'Older Brother',
      phone: '+91 98765 43210',
      helperMessage: 'Emergency safeguard: Please check on me if my mental health status reports sudden severe distress or decline.',
      notifyOnDeterioration: true,
      alertSentCount: 0,
      lastAlertSentAt: undefined
    },
    consentSettings: {
      analyticsConsent: true,
      emergencyEscalationConsent: true,
      institutionalAggregatedConsent: true,
      aiConversationMemoryConsent: true,
      thirdPartySharingConsent: false,
      version: 'v2.1-DPDPA-2023',
      lastUpdatedAt: '2026-10-01T09:00:00Z'
    }
  },
  {
    id: 'usr-therapist-01',
    email: 'dr.sarah.patel@mindbridge.care',
    name: 'Dr. Sarah Patel, Psy.D.',
    role: 'THERAPIST',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    preferredLanguage: 'en',
    createdAt: '2025-06-15T08:30:00Z',
    isVerified: true
  },
  {
    id: 'usr-safety-01',
    email: 'safety.officer@university.edu',
    name: 'Officer Priya Sharma',
    role: 'INSTITUTION_SAFETY_OFFICER',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    preferredLanguage: 'en',
    institutionId: 'inst-delhi-univ',
    institutionName: 'Apex Institute of Technology',
    createdAt: '2025-08-01T09:00:00Z',
    isVerified: true
  },
  {
    id: 'usr-admin-01',
    email: 'admin@mindbridge.care',
    name: 'Marcus Vance',
    role: 'PLATFORM_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    preferredLanguage: 'en',
    createdAt: '2025-01-01T00:00:00Z',
    isVerified: true
  }
];

const INITIAL_THERAPISTS: Therapist[] = [
  {
    id: 'th-01',
    name: 'Dr. Sarah Patel, Psy.D.',
    title: 'Licensed Clinical Psychologist & Cognitive Behavioral Specialist',
    qualifications: ['Psy.D. Clinical Psychology (Columbia Univ)', 'Licensed Clinical Psychologist #CP-8921'],
    licenseNumber: 'RCI-CP-8921-ND',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
    bio: 'Over 12 years of clinical practice specializing in university student transitions, performance anxiety, academic burnout, and trauma-informed cognitive behavioral therapy (CBT).',
    specializations: ['Academic Burnout', 'Generalized Anxiety', 'Depression', 'CBT', 'Mindfulness'],
    languages: ['English', 'Hindi', 'Gujarati'],
    sessionFee: 1500,
    currency: 'INR',
    sessionDurationMinutes: 50,
    rating: 4.95,
    reviewsCount: 142,
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM']
  },
  {
    id: 'th-02',
    name: 'Dr. Rajesh Menon, MD',
    title: 'Consultant Neuropsychiatrist & Adolescent Mental Health Lead',
    qualifications: ['MD Psychiatry (NIMHANS)', 'MBBS', 'Fellowship in Adolescent Mental Health'],
    licenseNumber: 'MCI-REG-44910',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    bio: 'Former consultant at NIMHANS with deep expertise in neurodevelopmental health, severe affective disorders, insomnia, and holistic stress de-escalation for high-achieving young professionals.',
    specializations: ['Severe Anxiety', 'Sleep Disorders', 'Bipolar Spectrum', 'Psychotherapy'],
    languages: ['English', 'Hindi', 'Malayalam'],
    sessionFee: 2000,
    currency: 'INR',
    sessionDurationMinutes: 50,
    rating: 4.92,
    reviewsCount: 98,
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableSlots: ['09:00 AM', '01:00 PM', '03:30 PM', '05:00 PM']
  },
  {
    id: 'th-03',
    name: 'Elena Rostova, LCSW',
    title: 'Licensed Mental Health Counsellor & Somatic Therapist',
    qualifications: ['MSW Clinical Social Work', 'Certified Somatic Experiencing Practitioner'],
    licenseNumber: 'LCSW-NY-90214',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80',
    bio: 'Compassionate therapist with expertise in nervous system regulation, somatic grounding, multicultural identity navigation, and relational boundaries.',
    specializations: ['Somatic Experiencing', 'Relationship Stress', 'Cultural Transitions', 'Self-Esteem'],
    languages: ['English', 'Spanish'],
    sessionFee: 1800,
    currency: 'INR',
    sessionDurationMinutes: 50,
    rating: 4.88,
    reviewsCount: 76,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    availableSlots: ['11:00 AM', '02:30 PM', '04:00 PM', '07:00 PM']
  },
  {
    id: 'th-04',
    name: 'Dr. Aarav Mehta, Ph.D.',
    title: 'Integrative Psychotherapist & Acceptance and Commitment Therapy (ACT) Lead',
    qualifications: ['Ph.D. Counseling Psychology', 'ACT Certified Practitioner'],
    licenseNumber: 'RCI-CP-11029',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
    bio: 'Specialized in values-clarity work, psychological resilience, imposter syndrome in STEM fields, and executive stress recovery.',
    specializations: ['Imposter Syndrome', 'ACT Therapy', 'Career Burnout', 'Mindfulness'],
    languages: ['English', 'Hindi', 'Hinglish'],
    sessionFee: 1600,
    currency: 'INR',
    sessionDurationMinutes: 50,
    rating: 4.97,
    reviewsCount: 115,
    availableDays: ['Wednesday', 'Thursday', 'Saturday', 'Sunday'],
    availableSlots: ['10:30 AM', '01:30 PM', '03:00 PM', '06:30 PM']
  }
];

const INITIAL_MOOD_ENTRIES: MoodEntry[] = [
  {
    id: 'md-01',
    userId: 'usr-student-01',
    score: 4,
    label: 'Good',
    emoji: '😊',
    energyLevel: 7,
    stressLevel: 4,
    sleepHours: 7.5,
    triggers: ['Completed assignment', 'Morning run'],
    notes: 'Felt productive and light after getting some fresh air.',
    createdAt: '2026-10-18T19:30:00Z'
  },
  {
    id: 'md-02',
    userId: 'usr-student-01',
    score: 3,
    label: 'Okay',
    emoji: '😐',
    energyLevel: 5,
    stressLevel: 6,
    sleepHours: 6.0,
    triggers: ['Midterm prep', 'Late night study'],
    notes: 'A bit stretched for time, but managing.',
    createdAt: '2026-10-21T20:15:00Z'
  },
  {
    id: 'md-03',
    userId: 'usr-student-01',
    score: 2,
    label: 'Low',
    emoji: '😔',
    energyLevel: 3,
    stressLevel: 8,
    sleepHours: 4.5,
    triggers: ['Exam pressure', 'Lack of sleep'],
    notes: 'Feeling exhausted. Hard to focus on reading.',
    createdAt: '2026-10-24T21:00:00Z'
  },
  {
    id: 'md-04',
    userId: 'usr-student-01',
    score: 3,
    label: 'Reflective',
    emoji: '🌱',
    energyLevel: 6,
    stressLevel: 5,
    sleepHours: 8.0,
    triggers: ['Talked with friend', 'Breathing practice'],
    notes: 'Tried the 4-7-8 breathing exercise. Heart rate slowed down noticeably.',
    createdAt: '2026-10-27T18:45:00Z'
  },
  {
    id: 'md-05',
    userId: 'usr-student-01',
    score: 4,
    label: 'Calm & Focused',
    emoji: '✨',
    energyLevel: 7,
    stressLevel: 3,
    sleepHours: 7.5,
    triggers: ['Balanced schedule', 'Walk in park'],
    notes: 'Mind feels much clearer today.',
    createdAt: '2026-10-29T09:30:00Z'
  }
];

const INITIAL_SCREENING_RESULTS: ScreeningResult[] = [
  {
    id: 'scr-init-01',
    userId: 'usr-student-01',
    screeningType: 'PHQ-9',
    totalScore: 7,
    maxScore: 27,
    severityLevel: 'Mild',
    concernIndex: 26,
    confidence: 1.0,
    completedAt: '2026-10-15T14:20:00Z',
    responses: { 1: 1, 2: 1, 3: 2, 4: 2, 5: 0, 6: 1, 7: 0, 8: 0, 9: 0 },
    explanations: {
      observedIndicators: ['Sleep latency issues', 'Mid-day fatigue'],
      whatItMeans: 'Your score reflects mild situational stress and sleep disruption common during university milestones.',
      whatItDoesNotMean: 'This is not a clinical depressive disorder diagnosis.',
      recommendationReason: 'Targeted sleep hygiene and daily breathing intervals are indicated.',
      recommendedActions: ['Engage in evening wind-down routine', 'Try guided parasympathetic breathing']
    }
  },
  {
    id: 'scr-init-02',
    userId: 'usr-student-01',
    screeningType: 'GAD-7',
    totalScore: 8,
    maxScore: 21,
    severityLevel: 'Mild',
    concernIndex: 38,
    confidence: 1.0,
    completedAt: '2026-10-25T11:15:00Z',
    responses: { 1: 2, 2: 1, 3: 2, 4: 1, 5: 1, 6: 1, 7: 0 },
    explanations: {
      observedIndicators: ['Slight nervous tension', 'Worrying over academic workload'],
      whatItMeans: 'Mild generalized anxiety indicators with manageable daily functioning.',
      whatItDoesNotMean: 'Does not indicate an anxiety disorder requiring emergency intervention.',
      recommendationReason: 'Mindfulness grounding exercises reduce baseline sympathetic tone.',
      recommendedActions: ['Practice 5-4-3-2-1 sensory grounding', 'Explore consultation with Dr. Sarah Patel']
    }
  }
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-01',
    userId: 'usr-student-01',
    userName: 'Alex Chen',
    therapistId: 'th-01',
    therapistName: 'Dr. Sarah Patel, Psy.D.',
    therapistTitle: 'Licensed Clinical Psychologist',
    dateTime: '2026-10-31T15:30:00Z',
    durationMinutes: 50,
    type: 'VIDEO',
    status: 'CONFIRMED',
    fee: 1500,
    isPaid: true,
    meetingLink: '/consultation/apt-01',
    clinicalNotes: 'Initial intake scheduled. Patient reported university workload stress and mild sleep disruption.',
    createdAt: '2026-10-28T10:00:00Z'
  }
];

const INITIAL_SAFETY_CASES: SafetyCase[] = [
  {
    id: 'sc-8801',
    userId: 'usr-synthetic-901',
    userDisplayName: 'Student User #841',
    institutionId: 'inst-delhi-univ',
    riskCategory: 'ELEVATED_CONCERN',
    status: 'ACKNOWLEDGED',
    detectedAt: '2026-10-28T14:10:00Z',
    reviewedBy: 'Officer Priya Sharma',
    reviewedAt: '2026-10-28T14:25:00Z',
    reviewerNotes: 'Spoke with university wellness liaison. Student connected with campus on-duty counsellor. Immediate safety verified.',
    escalationRequired: false,
    auditLogs: [
      {
        timestamp: '2026-10-28T14:10:00Z',
        action: 'SAFETY_SIGNAL_FLAGGED',
        actor: 'AI_SAFETY_TRIAGE_ENGINE',
        details: 'Elevated distress keywords detected in optional chat interaction. Priority Case generated.'
      },
      {
        timestamp: '2026-10-28T14:25:00Z',
        action: 'HUMAN_REVIEW_CONDUCTED',
        actor: 'Officer Priya Sharma (Safety Officer)',
        details: 'Review conducted. User contacted voluntarily via campus portal. Case status updated to ACKNOWLEDGED.'
      }
    ]
  }
];

const INITIAL_INSTITUTION_ANALYTICS: InstitutionAnalytics = {
  institutionName: 'Apex Institute of Technology',
  enrolledUsersCount: 4250,
  activeUsersMonthly: 1840,
  voluntaryParticipationRate: 43.3,
  averageWellnessScore: 74.2,
  stressDistribution: {
    low: 58,
    moderate: 31,
    elevated: 11
  },
  monthlyTrends: [
    { month: 'Jun', avgMood: 3.8, checkInVolume: 1200, counselorBookings: 64 },
    { month: 'Jul', avgMood: 3.7, checkInVolume: 1450, counselorBookings: 72 },
    { month: 'Aug', avgMood: 3.6, checkInVolume: 1800, counselorBookings: 95 },
    { month: 'Sep', avgMood: 3.4, checkInVolume: 2400, counselorBookings: 140 },
    { month: 'Oct', avgMood: 3.5, checkInVolume: 2900, counselorBookings: 155 }
  ],
  activeSafetyCasesCount: 1,
  resolvedSafetyCasesCount: 14,
  kAnonymityApplied: true
};

const INITIAL_CONVERSATION: Conversation = {
  id: 'conv-01',
  userId: 'usr-student-01',
  title: 'Welcome & Gentle Reflection',
  createdAt: '2026-10-29T10:00:00Z',
  updatedAt: '2026-10-29T10:05:00Z',
  inactivityPromptEnabled: true,
  lastInteractionAt: '2026-10-29T10:05:00Z',
  messages: [
    {
      id: 'msg-01',
      conversationId: 'conv-01',
      sender: 'assistant',
      content: "Hey, I'm here with you. How has your day been going?",
      timestamp: '2026-10-29T10:00:00Z',
      isCrisis: false,
      suggestedInterventions: ['BREATHING', 'GROUNDING'],
      approvedForCounsellor: false
    }
  ]
};

// 14-Day Day-by-Day Health Progress Track
const INITIAL_DAILY_PROGRESS: DailyProgressSnapshot[] = [
  { date: '2026-10-16', dayLabel: 'Day 1', overallScore: 54, moodScore: 2, stressLevel: 9, sleepHours: 4.8, anxietyScore: 15, mindfulnessMinutes: 0, improvingDayOverDay: false, notes: 'Felt severe exam pressure and restless night.' },
  { date: '2026-10-17', dayLabel: 'Day 2', overallScore: 58, moodScore: 2, stressLevel: 8, sleepHours: 5.5, anxietyScore: 13, mindfulnessMinutes: 5, improvingDayOverDay: true, notes: 'Tried 5-min breathing before bedtime.' },
  { date: '2026-10-18', dayLabel: 'Day 3', overallScore: 61, moodScore: 3, stressLevel: 8, sleepHours: 6.0, anxietyScore: 12, mindfulnessMinutes: 8, improvingDayOverDay: true, notes: 'Journaled feelings after classes.' },
  { date: '2026-10-19', dayLabel: 'Day 4', overallScore: 60, moodScore: 3, stressLevel: 8, sleepHours: 5.8, anxietyScore: 12, mindfulnessMinutes: 5, improvingDayOverDay: false, notes: 'Steady baseline, study load heavy.' },
  { date: '2026-10-20', dayLabel: 'Day 5', overallScore: 66, moodScore: 3, stressLevel: 7, sleepHours: 6.5, anxietyScore: 11, mindfulnessMinutes: 10, improvingDayOverDay: true, notes: 'Took a morning walk outside.' },
  { date: '2026-10-21', dayLabel: 'Day 6', overallScore: 69, moodScore: 3, stressLevel: 6, sleepHours: 6.8, anxietyScore: 10, mindfulnessMinutes: 12, improvingDayOverDay: true, notes: 'Breathing exercises becoming easier.' },
  { date: '2026-10-22', dayLabel: 'Day 7', overallScore: 72, moodScore: 4, stressLevel: 6, sleepHours: 7.0, anxietyScore: 9, mindfulnessMinutes: 15, improvingDayOverDay: true, notes: '7-day milestone: 18pt increase in overall calm.' },
  { date: '2026-10-23', dayLabel: 'Day 8', overallScore: 70, moodScore: 3, stressLevel: 6, sleepHours: 6.5, anxietyScore: 9, mindfulnessMinutes: 10, improvingDayOverDay: false, notes: 'Slight fatigue, but recovered quickly.' },
  { date: '2026-10-24', dayLabel: 'Day 9', overallScore: 75, moodScore: 4, stressLevel: 5, sleepHours: 7.2, anxietyScore: 8, mindfulnessMinutes: 15, improvingDayOverDay: true, notes: 'Spoke with therapist Dr. Patel.' },
  { date: '2026-10-25', dayLabel: 'Day 10', overallScore: 77, moodScore: 4, stressLevel: 4, sleepHours: 7.4, anxietyScore: 8, mindfulnessMinutes: 18, improvingDayOverDay: true, notes: 'Noticeable drop in baseline heart rate.' },
  { date: '2026-10-26', dayLabel: 'Day 11', overallScore: 76, moodScore: 3, stressLevel: 5, sleepHours: 7.0, anxietyScore: 8, mindfulnessMinutes: 12, improvingDayOverDay: false, notes: 'Balanced pace despite quizzes.' },
  { date: '2026-10-27', dayLabel: 'Day 12', overallScore: 80, moodScore: 4, stressLevel: 4, sleepHours: 7.8, anxietyScore: 7, mindfulnessMinutes: 20, improvingDayOverDay: true, notes: 'Consistent 8 hours sleep.' },
  { date: '2026-10-28', dayLabel: 'Day 13', overallScore: 81, moodScore: 4, stressLevel: 4, sleepHours: 7.5, anxietyScore: 7, mindfulnessMinutes: 15, improvingDayOverDay: true, notes: 'Active in Mild Stress peer circle.' },
  { date: '2026-10-29', dayLabel: 'Day 14 (Today)', overallScore: 84, moodScore: 4, stressLevel: 3, sleepHours: 8.0, anxietyScore: 6, mindfulnessMinutes: 20, improvingDayOverDay: true, notes: 'Overall wellness improved +30 pts (+55%) from Day 1 baseline!' }
];

// Peer Community Circles
const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-01',
    circleId: 'mild-stress',
    circleName: '🌿 Study & Mild Stress Balance Circle',
    authorHandle: 'CalmPebble#42',
    authorMentalHealthLevel: 'Mild',
    content: "Midterms kicked off this morning, but I took 4 minutes to do the 4-7-8 breathing circle right before stepping into the lecture hall. My hands stopped shaking. Anyone else trying somatic breathing before tests?",
    likesCount: 14,
    hasLiked: false,
    createdAt: '2026-10-29T14:30:00Z',
    tags: ['Exams', 'Breathing', 'StudentLife'],
    comments: [
      {
        id: 'c-01',
        authorHandle: 'SilverFern#19',
        content: "Yes! 4-7-8 breathing saved my presentation yesterday. Proud of you for trying it!",
        createdAt: '2026-10-29T15:00:00Z'
      },
      {
        id: 'c-02',
        authorHandle: 'GentleRiver#88',
        content: "Rooting for you! Remember your grades don't define your worth as a human.",
        createdAt: '2026-10-29T15:12:00Z'
      }
    ]
  },
  {
    id: 'post-02',
    circleId: 'anxiety-panic',
    circleName: '🌊 Anxiety & Nervous System Reset Circle',
    authorHandle: 'BraveSparrow#73',
    authorMentalHealthLevel: 'Moderate',
    content: "Had a sudden wave of panic on the metro commute today. I remembered the 5-4-3-2-1 sensory technique from the app. Looked for 5 blue items, touched the fabric of my backpack, listened to the train humming. It helped me stay anchored. You are not weird for feeling this way.",
    likesCount: 28,
    hasLiked: true,
    createdAt: '2026-10-28T18:15:00Z',
    tags: ['Grounding', 'PanicReset', 'Support'],
    comments: [
      {
        id: 'c-03',
        authorHandle: 'QuietPine#11',
        content: "Commuting anxiety is so real. Great job riding the wave instead of fighting it.",
        createdAt: '2026-10-28T18:40:00Z'
      }
    ]
  },
  {
    id: 'post-03',
    circleId: 'burnout',
    circleName: '🌅 Career & Work Fatigue Circle',
    authorHandle: 'SteadyOak#99',
    authorMentalHealthLevel: 'Moderate',
    content: "For anyone feeling like taking rest is 'lazy': rest is not a reward you have to earn after collapsing. It is maintenance required to stay alive. Logged off at 6 PM sharp today.",
    likesCount: 42,
    hasLiked: false,
    createdAt: '2026-10-27T19:00:00Z',
    tags: ['Burnout', 'Boundaries', 'Rest'],
    comments: [
      {
        id: 'c-04',
        authorHandle: 'AmberCloud#64',
        content: "Needed to read this tonight. Thank you.",
        createdAt: '2026-10-27T19:30:00Z'
      }
    ]
  },
  {
    id: 'post-04',
    circleId: 'low-mood',
    circleName: '🌙 Gentle Recovery & Low Mood Circle',
    authorHandle: 'MorningDew#25',
    authorMentalHealthLevel: 'Elevated',
    content: "Celebrated a very tiny win today: I got out of bed, drank a warm cup of water, and sat by the window in the sunlight for 10 minutes. Even if that is all you do today, you showed up.",
    likesCount: 35,
    hasLiked: false,
    createdAt: '2026-10-29T11:20:00Z',
    tags: ['TinyWins', 'GentleRecovery', 'OneStepAtATime'],
    comments: [
      {
        id: 'c-05',
        authorHandle: 'WarmStone#07',
        content: "Showing up is everything. Sending you so much warmth.",
        createdAt: '2026-10-29T11:45:00Z'
      }
    ]
  }
];

// Database state container with LocalStorage hydration
export class MockDatabase {
  private static instance: MockDatabase;

  public users: User[] = INITIAL_USERS;
  public therapists: Therapist[] = INITIAL_THERAPISTS;
  public appointments: Appointment[] = INITIAL_APPOINTMENTS;
  public moodEntries: MoodEntry[] = INITIAL_MOOD_ENTRIES;
  public journalEntries: JournalEntry[] = [];
  public screeningResults: ScreeningResult[] = INITIAL_SCREENING_RESULTS;
  public safetyCases: SafetyCase[] = INITIAL_SAFETY_CASES;
  public institutionAnalytics: InstitutionAnalytics = INITIAL_INSTITUTION_ANALYTICS;
  public conversations: Conversation[] = [INITIAL_CONVERSATION];
  public dailyProgressHistory: DailyProgressSnapshot[] = INITIAL_DAILY_PROGRESS;
  public communityPosts: CommunityPost[] = INITIAL_COMMUNITY_POSTS;
  public currentUser: User = INITIAL_USERS[0];

  private constructor() {
    this.hydrate();
  }

  public static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  private hydrate() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('mindbridge_db_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.users) this.users = parsed.users;
        if (parsed.therapists) this.therapists = parsed.therapists;
        if (parsed.appointments) this.appointments = parsed.appointments;
        if (parsed.moodEntries) this.moodEntries = parsed.moodEntries;
        if (parsed.journalEntries) this.journalEntries = parsed.journalEntries;
        if (parsed.screeningResults) this.screeningResults = parsed.screeningResults;
        if (parsed.safetyCases) this.safetyCases = parsed.safetyCases;
        if (parsed.conversations) this.conversations = parsed.conversations;
        if (parsed.dailyProgressHistory) this.dailyProgressHistory = parsed.dailyProgressHistory;
        if (parsed.communityPosts) this.communityPosts = parsed.communityPosts;
        if (parsed.currentUserId) {
          const found = this.users.find(u => u.id === parsed.currentUserId);
          if (found) this.currentUser = found;
        }
      }
    } catch (e) {
      console.warn("Failed to hydrate mock database from storage:", e);
    }
  }

  public persist() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('mindbridge_db_v2', JSON.stringify({
        users: this.users,
        therapists: this.therapists,
        appointments: this.appointments,
        moodEntries: this.moodEntries,
        journalEntries: this.journalEntries,
        screeningResults: this.screeningResults,
        safetyCases: this.safetyCases,
        conversations: this.conversations,
        dailyProgressHistory: this.dailyProgressHistory,
        communityPosts: this.communityPosts,
        currentUserId: this.currentUser.id
      }));
    } catch (e) {
      console.warn("Failed to persist mock database to storage:", e);
    }
  }

  public switchUser(userId: string): User {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.currentUser = user;
      this.persist();
      return user;
    }
    return this.currentUser;
  }

  public addMoodEntry(entry: Omit<MoodEntry, 'id' | 'createdAt'>): MoodEntry {
    const newEntry: MoodEntry = {
      ...entry,
      id: 'md-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    this.moodEntries.unshift(newEntry);

    // Update today's progress snapshot
    const todayScore = Math.min(100, Math.round(newEntry.score * 18 + (10 - newEntry.stressLevel) * 2));
    const today = new Date().toISOString().slice(0, 10);
    const existing = this.dailyProgressHistory.find(d => d.date === today);
    if (existing) {
      existing.moodScore = newEntry.score;
      existing.stressLevel = newEntry.stressLevel;
      existing.overallScore = todayScore;
    } else {
      this.dailyProgressHistory.push({
        date: today,
        dayLabel: `Day ${this.dailyProgressHistory.length + 1}`,
        overallScore: todayScore,
        moodScore: newEntry.score,
        stressLevel: newEntry.stressLevel,
        sleepHours: newEntry.sleepHours,
        anxietyScore: 6,
        mindfulnessMinutes: 15,
        improvingDayOverDay: true,
        notes: newEntry.notes || 'Logged via emotion check-in.'
      });
    }

    this.persist();
    return newEntry;
  }

  public addJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'isEncrypted'>): JournalEntry {
    const newEntry: JournalEntry = {
      ...entry,
      id: 'jn-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      isEncrypted: true,
      approvedForCounsellor: false
    };
    this.journalEntries.unshift(newEntry);
    this.persist();
    return newEntry;
  }

  public approveJournalEntryForCounsellor(journalId: string, approved: boolean): boolean {
    const entry = this.journalEntries.find(j => j.id === journalId);
    if (entry) {
      entry.approvedForCounsellor = approved;
      this.persist();
      return true;
    }
    return false;
  }

  public approveChatMessageForCounsellor(messageId: string, approved: boolean): boolean {
    if (this.conversations[0]) {
      const msg = this.conversations[0].messages.find(m => m.id === messageId);
      if (msg) {
        msg.approvedForCounsellor = approved;
        this.persist();
        return true;
      }
    }
    return false;
  }

  public addScreeningResult(result: ScreeningResult): ScreeningResult {
    this.screeningResults.unshift(result);
    this.persist();
    return result;
  }

  public addAppointment(apt: Omit<Appointment, 'id' | 'createdAt'>): Appointment {
    const newApt: Appointment = {
      ...apt,
      id: 'apt-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    this.appointments.unshift(newApt);
    this.persist();
    return newApt;
  }

  public cancelAppointment(id: string): boolean {
    const apt = this.appointments.find(a => a.id === id);
    if (apt) {
      apt.status = 'CANCELLED';
      this.persist();
      return true;
    }
    return false;
  }

  public updateClinicalNotes(appointmentId: string, notes: string): boolean {
    const apt = this.appointments.find(a => a.id === appointmentId);
    if (apt) {
      apt.clinicalNotes = notes;
      this.persist();
      return true;
    }
    return false;
  }

  public addSafetyCase(sc: Omit<SafetyCase, 'id' | 'detectedAt' | 'auditLogs'>): SafetyCase {
    const newCase: SafetyCase = {
      ...sc,
      id: 'sc-' + Math.floor(1000 + Math.random() * 9000),
      detectedAt: new Date().toISOString(),
      auditLogs: [
        {
          timestamp: new Date().toISOString(),
          action: 'SAFETY_CASE_REGISTERED',
          actor: 'AI_SAFETY_TRIAGE_SERVICE',
          details: 'Risk detection triggered priority review case creation.'
        }
      ]
    };
    this.safetyCases.unshift(newCase);
    this.persist();
    return newCase;
  }

  public reviewSafetyCase(caseId: string, reviewerName: string, notes: string, status: SafetyCase['status']): boolean {
    const sc = this.safetyCases.find(c => c.id === caseId);
    if (sc) {
      sc.reviewedBy = reviewerName;
      sc.reviewedAt = new Date().toISOString();
      sc.reviewerNotes = notes;
      sc.status = status;
      sc.auditLogs.push({
        timestamp: new Date().toISOString(),
        action: 'CASE_STATUS_UPDATED',
        actor: reviewerName,
        details: `Case updated to ${status}. Clinician notes: ${notes}`
      });
      this.persist();
      return true;
    }
    return false;
  }

  public updateConsent(settings: Partial<User['consentSettings']>): boolean {
    if (this.currentUser.consentSettings) {
      this.currentUser.consentSettings = {
        ...this.currentUser.consentSettings,
        ...settings,
        lastUpdatedAt: new Date().toISOString()
      };
      this.persist();
      return true;
    }
    return false;
  }

  public updateEmergencyHelper(helper: Partial<EmergencyHelper>): EmergencyHelper {
    if (!this.currentUser.emergencyHelper) {
      this.currentUser.emergencyHelper = {
        name: 'Emergency Helper',
        relationship: 'Family Contact',
        phone: '+91 98765 43210',
        helperMessage: 'Emergency safeguard: Please check on me if my mental health status reports sudden decline.',
        notifyOnDeterioration: true,
        alertSentCount: 0
      };
    }
    this.currentUser.emergencyHelper = {
      ...this.currentUser.emergencyHelper,
      ...helper
    };
    this.persist();
    return this.currentUser.emergencyHelper;
  }

  public triggerEmergencyHelperAlert(deteriorationReason: string): { delivered: boolean; message: string; recipient: string } {
    const helper = this.currentUser.emergencyHelper || {
      name: 'Emergency Contact',
      phone: '+91 98765 43210',
      relationship: 'Family',
      helperMessage: 'Please check on Alex.',
      notifyOnDeterioration: true,
      alertSentCount: 0
    };

    helper.alertSentCount = (helper.alertSentCount || 0) + 1;
    helper.lastAlertSentAt = new Date().toISOString();
    this.currentUser.emergencyHelper = helper;
    this.persist();

    const smsMessage = `⚠️ MindBridge AI Emergency Warning: The health monitoring system has detected an elevated risk score (${deteriorationReason}) for ${this.currentUser.name}. In accordance with their emergency helper authorization, please contact them or check on their safety. For immediate physical danger, dial 112 (India) or 988.`;

    return {
      delivered: true,
      message: smsMessage,
      recipient: `${helper.name} (${helper.phone})`
    };
  }

  public addCommunityPost(post: Omit<CommunityPost, 'id' | 'createdAt' | 'likesCount' | 'comments'>): CommunityPost {
    const newPost: CommunityPost = {
      ...post,
      id: 'post-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      likesCount: 1,
      hasLiked: true,
      comments: []
    };
    this.communityPosts.unshift(newPost);
    this.persist();
    return newPost;
  }

  public toggleLikePost(postId: string): boolean {
    const post = this.communityPosts.find(p => p.id === postId);
    if (post) {
      if (post.hasLiked) {
        post.hasLiked = false;
        post.likesCount = Math.max(0, post.likesCount - 1);
      } else {
        post.hasLiked = true;
        post.likesCount += 1;
      }
      this.persist();
      return true;
    }
    return false;
  }

  public addCommunityComment(postId: string, authorHandle: string, content: string): boolean {
    const post = this.communityPosts.find(p => p.id === postId);
    if (post) {
      post.comments.push({
        id: 'c-' + Math.random().toString(36).substring(2, 9),
        authorHandle,
        content,
        createdAt: new Date().toISOString()
      });
      this.persist();
      return true;
    }
    return false;
  }
}

export const db = MockDatabase.getInstance();
