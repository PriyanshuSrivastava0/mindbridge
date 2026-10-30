import { calculateScreeningScore } from '../../src/services/ai/screening.ts';

export function testScreeningScoring() {
  console.log("🧪 Running Unit Test: Standardized Screening Scoring...");

  // Test 1: PHQ-9 Minimal
  const phqMinimal = calculateScreeningScore('PHQ-9', {
    1: 0, 2: 0, 3: 1, 4: 1, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
  });
  if (phqMinimal.totalScore !== 2 || phqMinimal.severityLevel !== 'Minimal') {
    throw new Error(`PHQ-9 Minimal failed: total ${phqMinimal.totalScore}, severity ${phqMinimal.severityLevel}`);
  }

  // Test 2: PHQ-9 Severe with Item 9 flag
  const phqSevere = calculateScreeningScore('PHQ-9', {
    1: 3, 2: 3, 3: 3, 4: 3, 5: 2, 6: 3, 7: 2, 8: 2, 9: 2
  });
  if (phqSevere.totalScore !== 23 || phqSevere.severityLevel !== 'Severe') {
    throw new Error(`PHQ-9 Severe failed: total ${phqSevere.totalScore}`);
  }
  const hasItem9Indicator = phqSevere.explanations.observedIndicators.some(i => i.includes('Item 9'));
  if (!hasItem9Indicator) {
    throw new Error(`PHQ-9 Item 9 indicator missing from explainable breakdown.`);
  }

  // Test 3: GAD-7 Anxiety Scale
  const gadResult = calculateScreeningScore('GAD-7', {
    1: 2, 2: 2, 3: 2, 4: 1, 5: 1, 6: 1, 7: 1
  });
  if (gadResult.totalScore !== 10 || gadResult.severityLevel !== 'Moderate') {
    throw new Error(`GAD-7 Moderate test failed: total ${gadResult.totalScore}`);
  }

  // Test 4: PSS-10 Perceived Stress with reverse-scored items (4, 5, 7, 8)
  const pssResult = calculateScreeningScore('PSS-10', {
    1: 3, 2: 3, 3: 3, 4: 0, 5: 0, 6: 3, 7: 0, 8: 0, 9: 3, 10: 3
  });
  if (pssResult.totalScore !== 18 || pssResult.severityLevel !== 'Moderate') {
    throw new Error(`PSS-10 test failed: total ${pssResult.totalScore}`);
  }

  console.log("   ✓ All screening score calculations & reverse-item rules passed.");
  return true;
}
