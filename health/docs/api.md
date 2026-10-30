# MindBridge AI — API Reference (v1)

Base URL: `/api/v1`

All requests accept and return `application/json` unless otherwise specified.

---

## Authentication & Session

- `POST /api/v1/auth/register` — Register student, professional, or staff account.
- `POST /api/v1/auth/login` — Authenticate and generate secure HTTP-only session cookie.
- `POST /api/v1/auth/logout` — Revoke session token.
- `GET /api/v1/auth/session` — Retrieve active authenticated user profile.

---

## AI Conversations & Proactive Engagement

- `GET /api/v1/conversations` — Retrieve user's conversation threads.
- `POST /api/v1/conversations` — Initiate a fresh conversation.
- `GET /api/v1/conversations/:id/messages` — Fetch message history.
- `POST /api/v1/conversations/:id/messages` — Send user message and receive empathetic AI response.
- `POST /api/v1/conversations/:id/stream` — SSE endpoint for real-time token streaming.
- `DELETE /api/v1/conversations/:id` — Irreversibly delete conversation history.

---

## Wellness & Screenings

- `POST /api/v1/mood` — Record daily emotion, energy, stress, and triggers.
- `GET /api/v1/mood/history` — Fetch historical check-ins for trend charts.
- `POST /api/v1/screenings` — Submit completed PHQ-9, GAD-7, or PSS-10 responses.
- `GET /api/v1/screenings/history` — Fetch previous assessment scores and factors.
- `GET /api/v1/recommendations` — Fetch personalized self-help interventions.

---

## Safety & Escalation

- `POST /api/v1/safety/evaluate` — Run automated safety classifier on text snippet.
- `GET /api/v1/safety/cases` — Retrieve authorized safety review cases (Safety Officer only).
- `POST /api/v1/safety/cases/:id/review` — Record safety officer decision and update case status.
- `POST /api/v1/safety/cases/:id/escalate` — Trigger minimum-necessary emergency alert if consent criteria met.
- `GET /api/v1/safety/resources` — List verified country crisis hotlines.

---

## Therapists & Teleconsultation

- `GET /api/v1/therapists` — Search and filter verified therapists (by specialty, language, price).
- `GET /api/v1/therapists/:id` — Retrieve therapist profile and credentials.
- `GET /api/v1/therapists/:id/availability` — Retrieve open time slots.
- `POST /api/v1/appointments` — Confirm consultation booking and generate video room.
- `PATCH /api/v1/appointments/:id` — Reschedule or update appointment.
- `POST /api/v1/appointments/:id/cancel` — Cancel appointment and initiate refund.
- `POST /api/v1/appointments/:id/notes` — Save confidential clinical notes (Therapist only).

---

## Privacy & DPDPA

- `GET /api/v1/privacy/consents` — Retrieve user's active consent record.
- `PATCH /api/v1/privacy/consents` — Update granular consent preferences.
- `POST /api/v1/privacy/export` — Download machine-readable JSON data archive.
- `POST /api/v1/privacy/delete-request` — Log verified account erasure request.

