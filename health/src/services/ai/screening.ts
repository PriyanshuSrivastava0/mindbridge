import { ScreeningQuestion, ScreeningResult, ScreeningType } from '../../types';

export const PHQ9_QUESTIONS: ScreeningQuestion[] = [
  {
    id: 1,
    text: "Little interest or pleasure in doing things?",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 2,
    text: "Feeling down, depressed, or hopeless?",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 3,
    text: "Trouble falling or staying asleep, or sleeping too much?",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 4,
    text: "Feeling tired or having little energy?",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 5,
    text: "Poor appetite or overeating?",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 6,
    text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 7,
    text: "Trouble concentrating on things, such as reading the newspaper or watching television?",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 8,
    text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless?",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 9,
    text: "Thoughts that you would be better off dead, or of hurting yourself in some way?",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  }
];

export const GAD7_QUESTIONS: ScreeningQuestion[] = [
  {
    id: 1,
    text: "Feeling nervous, anxious, or on edge?",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 2,
    text: "Not being able to stop or control worrying?",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 3,
    text: "Worrying too much about different things?",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 4,
    text: "Trouble relaxing?",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 5,
    text: "Being so restless that it's hard to sit still?",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 6,
    text: "Becoming easily annoyed or irritable?",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 7,
    text: "Feeling afraid as if something awful might happen?",
    options: [
      { label: "Not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 }
    ]
  }
];

export const PSS10_QUESTIONS: ScreeningQuestion[] = [
  {
    id: 1,
    text: "In the last month, how often have you been upset because of something that happened unexpectedly?",
    options: [
      { label: "Never", score: 0 },
      { label: "Almost Never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Fairly Often", score: 3 },
      { label: "Very Often", score: 4 }
    ]
  },
  {
    id: 2,
    text: "In the last month, how often have you felt that you were unable to control important things in your life?",
    options: [
      { label: "Never", score: 0 },
      { label: "Almost Never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Fairly Often", score: 3 },
      { label: "Very Often", score: 4 }
    ]
  },
  {
    id: 3,
    text: "In the last month, how often have you felt nervous and 'stressed'?",
    options: [
      { label: "Never", score: 0 },
      { label: "Almost Never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Fairly Often", score: 3 },
      { label: "Very Often", score: 4 }
    ]
  },
  {
    id: 4,
    text: "In the last month, how often have you felt confident about your ability to handle your personal problems? (Positively worded)",
    options: [
      { label: "Never", score: 4 },
      { label: "Almost Never", score: 3 },
      { label: "Sometimes", score: 2 },
      { label: "Fairly Often", score: 1 },
      { label: "Very Often", score: 0 }
    ]
  },
  {
    id: 5,
    text: "In the last month, how often have you felt that things were going your way? (Positively worded)",
    options: [
      { label: "Never", score: 4 },
      { label: "Almost Never", score: 3 },
      { label: "Sometimes", score: 2 },
      { label: "Fairly Often", score: 1 },
      { label: "Very Often", score: 0 }
    ]
  },
  {
    id: 6,
    text: "In the last month, how often have you found that you could not cope with all the things you had to do?",
    options: [
      { label: "Never", score: 0 },
      { label: "Almost Never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Fairly Often", score: 3 },
      { label: "Very Often", score: 4 }
    ]
  },
  {
    id: 7,
    text: "In the last month, how often have you been able to control irritations in your life? (Positively worded)",
    options: [
      { label: "Never", score: 4 },
      { label: "Almost Never", score: 3 },
      { label: "Sometimes", score: 2 },
      { label: "Fairly Often", score: 1 },
      { label: "Very Often", score: 0 }
    ]
  },
  {
    id: 8,
    text: "In the last month, how often have you felt that you were on top of things? (Positively worded)",
    options: [
      { label: "Never", score: 4 },
      { label: "Almost Never", score: 3 },
      { label: "Sometimes", score: 2 },
      { label: "Fairly Often", score: 1 },
      { label: "Very Often", score: 0 }
    ]
  },
  {
    id: 9,
    text: "In the last month, how often have you been angered because of things that happened outside of your control?",
    options: [
      { label: "Never", score: 0 },
      { label: "Almost Never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Fairly Often", score: 3 },
      { label: "Very Often", score: 4 }
    ]
  },
  {
    id: 10,
    text: "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
    options: [
      { label: "Never", score: 0 },
      { label: "Almost Never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Fairly Often", score: 3 },
      { label: "Very Often", score: 4 }
    ]
  }
];

export function calculateScreeningScore(
  type: ScreeningType,
  responses: Record<number, number>
): ScreeningResult {
  const answeredCount = Object.keys(responses).length;
  let totalScore = 0;
  let maxScore = 27;

  if (type === 'PHQ-9') {
    maxScore = 27;
    for (let i = 1; i <= 9; i++) {
      totalScore += responses[i] || 0;
    }
  } else if (type === 'GAD-7') {
    maxScore = 21;
    for (let i = 1; i <= 7; i++) {
      totalScore += responses[i] || 0;
    }
  } else if (type === 'PSS-10') {
    maxScore = 40;
    for (let i = 1; i <= 10; i++) {
      totalScore += responses[i] || 0;
    }
  }

  // Calculate severity
  let severityLevel: ScreeningResult['severityLevel'];
  if (type === 'PHQ-9') {
    if (totalScore <= 4) severityLevel = 'Minimal';
    else if (totalScore <= 9) severityLevel = 'Mild';
    else if (totalScore <= 14) severityLevel = 'Moderate';
    else if (totalScore <= 19) severityLevel = 'Moderately Severe';
    else severityLevel = 'Severe';
  } else if (type === 'GAD-7') {
    if (totalScore <= 4) severityLevel = 'Minimal';
    else if (totalScore <= 9) severityLevel = 'Mild';
    else if (totalScore <= 14) severityLevel = 'Moderate';
    else severityLevel = 'Severe';
  } else {
    if (totalScore <= 13) severityLevel = 'Mild';
    else if (totalScore <= 26) severityLevel = 'Moderate';
    else severityLevel = 'Severe';
  }

  const concernIndex = Math.min(100, Math.round((totalScore / maxScore) * 100));
  const confidence = Math.min(1.0, Number((answeredCount / (type === 'PHQ-9' ? 9 : type === 'GAD-7' ? 7 : 10)).toFixed(2)));

  // Generate explainable insights
  const indicators: string[] = [];
  if (type === 'PHQ-9') {
    if (responses[1] >= 2) indicators.push("Self-reported loss of interest/anhedonia");
    if (responses[2] >= 2) indicators.push("Frequent feelings of low mood or hopelessness");
    if (responses[3] >= 2) indicators.push("Sleep architecture disturbances");
    if (responses[4] >= 2) indicators.push("Persistent cognitive or somatic fatigue");
    if (responses[9] > 0) indicators.push("Affirmative answer on self-harm question (Item 9)");
  } else if (type === 'GAD-7') {
    if (responses[1] >= 2) indicators.push("High frequency of feeling on edge");
    if (responses[2] >= 2) indicators.push("Uncontrollable thought spiral patterns");
    if (responses[4] >= 2) indicators.push("Difficulty with nervous system relaxation");
  } else {
    if (responses[3] >= 2) indicators.push("Heightened subjective nervous stress");
    if (responses[6] >= 2) indicators.push("Feeling over-extended by daily commitments");
  }

  return {
    id: 'scr-' + Math.random().toString(36).substring(2, 9),
    userId: 'current-user',
    screeningType: type,
    totalScore,
    maxScore,
    severityLevel,
    concernIndex,
    confidence,
    completedAt: new Date().toISOString(),
    responses,
    explanations: {
      observedIndicators: indicators.length > 0 ? indicators : ['Responses within standard range'],
      whatItMeans: `Your score of ${totalScore}/${maxScore} reflects a ${severityLevel.toLowerCase()} level of current symptoms over the assessment timeframe based on voluntary self-reporting.`,
      whatItDoesNotMean: "This result is an informational screening checkpoint, NOT a formal clinical psychiatric diagnosis or permanent label.",
      recommendationReason: severityLevel === 'Severe' || severityLevel === 'Moderately Severe'
        ? "Given elevated distress markers, a consultation with a licensed human counsellor is strongly recommended."
        : "Regular self-reflection and proactive relaxation exercises support emotional balance.",
      recommendedActions: severityLevel === 'Severe' || severityLevel === 'Moderately Severe'
        ? ["Schedule a confidential consultation with a licensed counsellor", "Explore guided 4-7-8 breathing exercises", "Review personal safety plan"]
        : ["Continue daily mood reflections", "Practice guided 5-4-3-2-1 sensory grounding", "Maintain regular sleep rhythms"]
    }
  };
}

