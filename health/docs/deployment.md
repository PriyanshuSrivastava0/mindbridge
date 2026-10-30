# MindBridge AI — Deployment & Local Setup Guide

## 1. Quick Local Development Setup

### Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+` or `v11+`
- (Optional) Docker & Docker Compose for PostgreSQL + Redis

### Steps
1. Navigate to the project directory:
   ```bash
   cd health
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Run automated test suite:
   ```bash
   npm test
   ```
5. Seed demo database:
   ```bash
   npm run seed
   ```
6. Start Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 2. Docker Deployment

To launch the full containerized stack (Web App, PostgreSQL, Redis):

```bash
docker-compose up --build -d
```

Access the application at `http://localhost:3000`.

---

## 3. Demo Accounts for Immediate Review

The platform includes pre-configured synthetic personas accessible via the **View As** switcher pill in the navigation header:

| Role | Name | Email | Primary Capability |
| :--- | :--- | :--- | :--- |
| **Student** | Alex Chen | `alex.chen@university.edu` | AI Chat, 4-7-8 Breathing, Mood Trends, GAD-7 / PHQ-9, Booking |
| **Therapist** | Dr. Sarah Patel, Psy.D. | `dr.sarah.patel@mindbridge.care` | Confirmed Appointments, Video Room, Clinical Notes, Availability |
| **Safety Officer** | Officer Priya Sharma | `safety.officer@university.edu` | Campus Aggregate Trends, K-Anonymity, Safety Case Review Desk |
| **Platform Admin** | Marcus Vance | `admin@mindbridge.care` | Clinician Verification, AI Guardrails Tuning, System Audit Logs |

