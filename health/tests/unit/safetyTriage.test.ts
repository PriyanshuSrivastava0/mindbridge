import { evaluateSafetyRisk, formatEmergencyNotificationPayload } from '../../src/services/ai/safetyTriage.ts';
import { SafetyCase } from '../../src/types/index.ts';

export function testSafetyTriage() {
  console.log("🧪 Running Unit Test: Safety Triage & Crisis Classification...");

  // Test 1: Explicit Self-Harm Detection
  const crisisResult = evaluateSafetyRisk("I can't take this pain anymore and I want to kill myself tonight.");
  if (!crisisResult.isImmediateCrisis || crisisResult.category !== 'HIGH_RISK_IMMEDIATE') {
    throw new Error(`Failed to flag explicit self-harm intent.`);
  }

  // Test 2: Hindi/Hinglish Self-Harm Intent Detection
  const hindiCrisis = evaluateSafetyRisk("Main ab nahi reh sakta, mujhe mar jaana chahta hoon.");
  if (!hindiCrisis.isImmediateCrisis) {
    throw new Error(`Failed to flag Hindi explicit self-harm intent.`);
  }

  // Test 3: Ambiguous Distress / Frustration (Must NOT trigger immediate false emergency)
  const stressResult = evaluateSafetyRisk("I have so many exams this week and I'm totally exhausted.");
  if (stressResult.isImmediateCrisis || stressResult.category === 'HIGH_RISK_IMMEDIATE') {
    throw new Error(`False positive: Ambiguous stress was incorrectly flagged as immediate crisis!`);
  }

  // Test 4: Silence / Empty input (Silence alone must NEVER be treated as danger)
  const emptyResult = evaluateSafetyRisk("   ");
  if (emptyResult.isImmediateCrisis || emptyResult.category !== 'SAFE') {
    throw new Error(`Violation: Silence was treated as an emergency!`);
  }

  // Test 5: Notification Payload Privacy Check (Never leak chat transcripts or diagnoses)
  const syntheticCase: SafetyCase = {
    id: 'sc-test-1',
    userId: 'u1',
    userDisplayName: 'Student User',
    riskCategory: 'HIGH_RISK_IMMEDIATE',
    status: 'CONFIRMED_FOR_ESCALATION',
    detectedAt: new Date().toISOString(),
    escalationRequired: true,
    auditLogs: []
  };

  const payload = formatEmergencyNotificationPayload(syntheticCase, 'Emergency Contact');
  if (payload.messageText.includes('kill myself') || payload.messageText.includes('depression') || payload.messageText.includes('suicide')) {
    throw new Error(`Violation: Emergency notification payload leaked sensitive clinical or conversational content!`);
  }

  console.log("   ✓ All safety triage boundary and zero-leakage payload tests passed.");
  return true;
}
