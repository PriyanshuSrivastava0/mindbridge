# MindBridge AI — Architectural Specification

## 1. System Overview & Philosophy

**MindBridge AI** is an enterprise-grade digital mental health early-support and clinical referral web application. 

### Mission Statement:
Identify early indicators of psychological distress, support users through empathetic AI conversations, recommend personalized wellness interventions, and connect users seamlessly to qualified mental health professionals.

### Foundational Distinction:
MindBridge AI is strictly an **early-support and clinical-referral tool**, not a diagnostic system, emergency dispatch service, or replacement for professional medical/psychiatric care.

---

## 2. Layered Architecture

```
+---------------------------------------------------------------+
|                      Client Presentation                      |
|  React 19 | Tailwind CSS | shadcn/ui | Recharts | CanvasConfetti|
+---------------------------------------------------------------+
                               |
                               v
+---------------------------------------------------------------+
|                    Application Controller                     |
|  Auth Context (Role-Based Access) | Language Context (EN/HI)  |
|  Conversation Engagement Engine (20s / 60s soft check-in)     |
+---------------------------------------------------------------+
                               |
                               v
+---------------------------------------------------------------+
|                   AI Subsystem & Services                     |
|  - Conversational AI (Warm Empathetic Language Layer)         |
|  - Safety Triage (Multi-tier Crisis Risk Classifier)          |
|  - Screening Engine (PHQ-9, GAD-7, PSS-10 Scoring & Factors) |
|  - Personalized Recommendations Engine                        |
|  - Explainable Assessment Generator                           |
|  - Web Speech STT & Gentle Pitch TTS Audio Synthesis          |
+---------------------------------------------------------------+
                               |
                               v
+---------------------------------------------------------------+
|               Isolated Clinical & Safety Data Store           |
|  - Relational Schema (PostgreSQL via Prisma ORM)              |
|  - AES-GCM Encrypted Journal & Clinical Note Isolation       |
|  - Human Safety Officer Review Desk & Immutable Audit Logs    |
|  - DPDPA 2023 / GDPR Article 20 Data Portability & Erasure   |
+---------------------------------------------------------------+
```

---

## 3. UI/UX Color System

The interface adheres to an evidence-backed soothing healthcare SaaS palette:
- **Primary:** Deep Indigo (`#303F70`)
- **Secondary:** Soft Lavender (`#A99CE0`)
- **Accent:** Muted Teal (`#64B6AC`)
- **Background:** `#F7F9FC`
- **Surface:** `#FFFFFF`
- **Main Text:** `#20283D`
- **Muted Text:** `#697386`
- **Urgent / Safety Flag:** `#E5484D`

---

## 4. Distinct Role-Based Dashboards

1. **Student / Individual Dashboard (`/dashboard`):** Daily emoji & stress tracking, 14-day interactive Recharts trend visualizer, last screening factor analysis, upcoming consultation link, quick self-care exercises.
2. **Empathetic AI Chat (`/chat`):** Streaming conversation, speech recognition voice input, text-to-speech read-aloud, non-judgmental multi-lingual dialogue, 20s/60s inactivity engagement engine.
3. **Licensed Therapist Clinic (`/therapist/dashboard`):** Verified clinician badge, appointment roster, consented client intake summaries, isolated clinical notes editor, availability slot manager.
4. **Institution Wellness Department (`/institution/dashboard`):** De-identified campus wellness trends, k-anonymity aggregation (cohorts < 15 suppressed), participation rate analytics, authorized safety incident review desk.
5. **Platform Administration (`/admin`):** Clinician credential verification (RCI/MCI license check), user management, AI prompt guardrail tuning, immutable system audit logs.

