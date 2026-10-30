import { testScreeningScoring } from './unit/screening.test.ts';
import { testSafetyTriage } from './unit/safetyTriage.test.ts';
import { testEngagementService } from './unit/engagement.test.ts';
import { testBookingAndSafetyLifecycle } from './integration/bookingAndSafety.test.ts';

async function runAllTests() {
  console.log("==================================================");
  console.log("🚀 MINDBRIDGE AI - AUTOMATED TEST SUITE");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  const testCases = [
    { name: "Screening Scoring Unit Test", fn: testScreeningScoring },
    { name: "Safety Triage Unit Test", fn: testSafetyTriage },
    { name: "Inactivity Engagement Unit Test", fn: testEngagementService },
    { name: "Booking & Safety Integration Test", fn: testBookingAndSafetyLifecycle }
  ];

  for (const t of testCases) {
    try {
      t.fn();
      passed++;
    } catch (e: any) {
      console.error(`❌ FAILED: ${t.name}:`, e?.message);
      failed++;
    }
  }

  console.log("==================================================");
  console.log(`📊 RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();
