import { db } from '../../src/services/db/mockDatabase.ts';

export function testBookingAndSafetyLifecycle() {
  console.log("🧪 Running Integration Test: Therapist Booking & Safety Case Desk...");

  // Test 1: Add new appointment
  const initCount = db.appointments.length;
  const newApt = db.addAppointment({
    userId: 'usr-student-01',
    userName: 'Alex Chen',
    therapistId: 'th-01',
    therapistName: 'Dr. Sarah Patel, Psy.D.',
    therapistTitle: 'Licensed Clinical Psychologist',
    dateTime: 'Friday at 02:00 PM',
    durationMinutes: 50,
    type: 'VIDEO',
    status: 'CONFIRMED',
    fee: 1500,
    isPaid: true,
    meetingLink: '/consultation/apt-test-sync',
    clinicalNotes: 'Initial intake test.'
  });

  if (db.appointments.length !== initCount + 1) {
    throw new Error("Appointment was not persisted in database.");
  }

  // Test 2: Update confidential clinical notes
  const updated = db.updateClinicalNotes(newApt.id, "Follow-up notes updated during consultation.");
  if (!updated) {
    throw new Error("Failed to update confidential clinical notes.");
  }

  // Test 3: Safety Case Review Workflow
  const newCase = db.addSafetyCase({
    userId: 'usr-student-01',
    userDisplayName: 'Alex Chen',
    institutionId: 'inst-delhi-univ',
    riskCategory: 'ELEVATED_CONCERN',
    status: 'PENDING_REVIEW',
    escalationRequired: false
  });

  const reviewOk = db.reviewSafetyCase(
    newCase.id,
    'Officer Priya Sharma',
    'Followed up with student wellness department. Safe.',
    'RESOLVED'
  );

  if (!reviewOk) {
    throw new Error("Safety case review failed to update.");
  }

  const foundCase = db.safetyCases.find(c => c.id === newCase.id);
  if (foundCase?.status !== 'RESOLVED' || foundCase.reviewedBy !== 'Officer Priya Sharma') {
    throw new Error("Safety case state incorrect after review.");
  }

  console.log("   ✓ Integration: Booking lifecycle, clinical note boundary, and safety desk verified.");
  return true;
}
