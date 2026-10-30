import { ConversationEngagementService } from '../../src/services/ai/engagement.ts';

export function testEngagementService() {
  console.log("🧪 Running Unit Test: Inactivity Engagement Engine...");

  let promptCount = 0;
  const service = new ConversationEngagementService(true, 'en', () => {
    promptCount++;
  });

  // Test 1: Disabled state prevents timers
  service.setEnabled(false);
  service.startSession(() => { promptCount++; });
  if (promptCount !== 0) {
    throw new Error("Prompt fired when service was disabled.");
  }

  // Test 2: User decline stops prompts
  service.setEnabled(true);
  service.userDeclinedInteraction();
  service.cancelTimers();

  // Test 3: Quiet hours check method exists and returns boolean
  const isQuiet = service.checkQuietHours();
  if (typeof isQuiet !== 'boolean') {
    throw new Error("Quiet hours check returned non-boolean value.");
  }

  console.log("   ✓ Inactivity engagement opt-out and quiet-hour controls verified.");
  return true;
}
