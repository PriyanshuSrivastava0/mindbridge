import { WellnessIntervention } from '../../types';

export const WELLNESS_INTERVENTIONS: WellnessIntervention[] = [
  {
    id: 'int-breathing',
    title: '4-7-8 Parasympathetic Breathing',
    category: 'BREATHING',
    description: 'Inhale for 4s, hold for 7s, exhale slowly for 8s to calm the autonomic nervous system and reduce acute anxiety.',
    estimatedMinutes: 4,
    difficulty: 'Easy',
    intendedBenefit: 'Decreases heart rate, regulates cortisol levels, and brings acute physiological calm.',
    iconName: 'Wind'
  },
  {
    id: 'int-grounding',
    title: '5-4-3-2-1 Sensory Grounding',
    category: 'GROUNDING',
    description: 'Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste to break panic spirals.',
    estimatedMinutes: 5,
    difficulty: 'Easy',
    intendedBenefit: 'Anchors awareness firmly in the present moment, dissipating dissociative anxiety.',
    iconName: 'Compass'
  },
  {
    id: 'int-reframe',
    title: 'Cognitive Thought Reframing',
    category: 'COGNITIVE',
    description: 'Identify unhelpful catastrophic thinking styles and gently construct evidence-based balanced perspectives.',
    estimatedMinutes: 8,
    difficulty: 'Moderate',
    intendedBenefit: 'Diminishes black-and-white cognitive distortions and encourages mental flexibility.',
    iconName: 'Sparkles'
  },
  {
    id: 'int-sleep',
    title: 'Sleep Wind-Down Ritual',
    category: 'SLEEP',
    description: 'Digital detox check, progressive muscle relaxation, and temperature preparation for restorative deep rest.',
    estimatedMinutes: 10,
    difficulty: 'Easy',
    intendedBenefit: 'Signals melatonin synthesis and reduces pre-sleep cognitive arousal.',
    iconName: 'Moon'
  },
  {
    id: 'int-workload',
    title: 'Academic & Burnout Workload Slicer',
    category: 'WORKLOAD',
    description: 'Decompose overwhelming university or work assignments into low-friction, high-clarity 15-minute micro-tasks.',
    estimatedMinutes: 6,
    difficulty: 'Easy',
    intendedBenefit: 'Overcomes executive dysfunction paralysis through structured cognitive chunking.',
    iconName: 'CheckSquare'
  }
];

export function getRecommendedInterventions(
  recentConcernIndex: number,
  reportedTags: string[] = []
): WellnessIntervention[] {
  if (recentConcernIndex >= 60 || reportedTags.includes('panic') || reportedTags.includes('anxiety')) {
    return [
      WELLNESS_INTERVENTIONS[0], // 4-7-8 Breathing
      WELLNESS_INTERVENTIONS[1], // Grounding
      WELLNESS_INTERVENTIONS[2]  // Reframe
    ];
  }

  if (reportedTags.includes('burnout') || reportedTags.includes('exam') || reportedTags.includes('study')) {
    return [
      WELLNESS_INTERVENTIONS[4], // Workload Slicer
      WELLNESS_INTERVENTIONS[0], // Breathing
      WELLNESS_INTERVENTIONS[3]  // Sleep
    ];
  }

  return [
    WELLNESS_INTERVENTIONS[0],
    WELLNESS_INTERVENTIONS[1],
    WELLNESS_INTERVENTIONS[3]
  ];
}

