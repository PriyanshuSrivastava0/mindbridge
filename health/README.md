# MindBridge AI (माइंडब्रिज AI)
### AI-Powered Mental Health Early Risk Detection & Personalized Clinical Referral Platform

> **Important Clinical & Non-Diagnostic Notice:** MindBridge AI is an early-support, self-reflection, and clinical-referral tool. It is **not** an automated diagnostic system, emergency response service, or replacement for professional clinical care.

---

## 🌟 Key Capabilities

1. **Empathetic AI Conversational Companion**
   - Natural validation, judgment-free support, and empathetic conversational flow.
   - Multi-lingual capability: **English**, **Hindi (हिंदी)**, and **Hinglish**.
   - **Conversation Engagement Engine:** Inactivity-triggered soft check-in at ~20s and low-effort options at ~60s with full opt-out. Silence alone is never treated as danger.
   - **Speech Synthesis (TTS)** and **Web Speech Recognition (STT)** integration.

2. **Standardized Wellness Screenings**
   - Clinically validated self-paced questionnaires:
     - **PHQ-9** (Patient Health Questionnaire - 9 item for depression indicators)
     - **GAD-7** (Generalized Anxiety Disorder - 7 item scale)
     - **PSS-10** (Perceived Stress Scale with reverse scoring)
   - **Explainable Factor Breakdown:** 0–100 Experimental Wellness Concern Index, confidence level, influencing factors, and transparent non-diagnostic explanation.
   - Item 9 safety trigger check.

3. **Emergency Risk Detection & Human-in-the-Loop Safety Desk**
   - Separation of ambiguous distress from acute self-harm intent.
   - Immediate 24/7 crisis hotline presentation (**Tele-MANAS 14416**, **KIRAN 1800-599-0019**, **988 US/Canada**).
   - Priority review case generation for authorized safety personnel.
   - Documented consent requirement and minimum-necessary emergency alert formatting (zero chat transcripts or diagnoses transmitted).

4. **Verified Therapist Network & Telehealth Consultation**
   - Directory of credentialed psychologists (RCI / MCI verified) with search and filters by specialty, language, and session rate.
   - Interactive booking modal with day/time slot selection.
   - **End-to-End Encrypted Telehealth Video Room** with camera/mic controls and isolated confidential clinical notes editor.

5. **Role-Based Dashboards**
   - **Student / Individual Dashboard (`/dashboard`):** 14-day Recharts mood/stress visualizer, quick emoji logging, upcoming consultation link.
   - **Therapist Dashboard (`/therapist/dashboard`):** Confirmed sessions, consented patient screening history, clinical notes isolation, availability manager.
   - **Institution Dashboard (`/institution/dashboard`):** De-identified campus wellness trends, k-anonymity privacy protections (cohorts < 15 suppressed), authorized safety desk.
   - **Platform Admin Dashboard (`/admin`):** Clinician credential verification, user management, AI guardrails tuning, immutable audit logs.

6. **Interactive Somatic Interventions**
   - Animated **4-7-8 Parasympathetic Breathing Circle** with inhale, hold, exhale visual scaling.
   - Step-by-step **5-4-3-2-1 Sensory Grounding** exercise.
   - **Sleep Wind-Down Ritual** and **Cognitive Thought Reframing**.
   - Client-side encrypted **Personal Reflection Journal** with export to JSON.

---

## 🚀 Quick Start Guide

### 1. Install & Test
```bash
# Navigate to the project directory
cd health

# Install dependencies
npm install

# Run automated unit and integration tests (4 passed, 0 failed)
npm test

# Seed synthetic demo data
npm run seed

# Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### 2. Switch Roles in Demo Mode
Use the **"View as:"** selector in the top navbar to instantly test the platform from four distinct authenticated perspectives:
- **Student:** Alex Chen (`alex.chen@university.edu`)
- **Therapist:** Dr. Sarah Patel, Psy.D. (`dr.sarah.patel@mindbridge.care`)
- **Safety Officer:** Officer Priya Sharma (`safety.officer@university.edu`)
- **Platform Admin:** Marcus Vance (`admin@mindbridge.care`)

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript (strict mode), Tailwind CSS, Lucide Icons, Recharts, Canvas-Confetti, Zod
- **Backend & Database:** PostgreSQL, Prisma ORM (30+ models), Redis, WebSockets/SSE architecture
- **Design Palette:** Deep Indigo (`#303F70`), Soft Lavender (`#A99CE0`), Muted Teal (`#64B6AC`), Surface (`#FFFFFF`), Text (`#20283D`)
- **Containerization:** Docker & Docker Compose (`docker-compose.yml`, `Dockerfile`)

---

## 📚 Architectural & Clinical Documentation

- [System Architecture](docs/architecture.md)
- [Emergency Safety Protocol & Hotlines](docs/safety-protocol.md)
- [Privacy Model & DPDPA Compliance](docs/privacy-model.md)
- [REST API Specifications (v1)](docs/api.md)
- [Deployment & Setup Instructions](docs/deployment.md)

---

## ⚖️ Pre-Deployment Clinical & Legal Checklist

Before real-world healthcare deployment:
1. Conduct formal clinical validation review with a certified psychiatric ethics board.
2. Complete institutional review board (IRB) review for university campus deployment.
3. Establish legally verified teleconsultation agreements under the Telemedicine Practice Guidelines of India (2020) and regional laws.
4. Execute Business Associate Agreements (BAA) and Data Processing Agreements (DPA) with infrastructure providers.
