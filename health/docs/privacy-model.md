# MindBridge AI — Privacy, Consent & Governance Architecture

## 1. Compliance Alignment

MindBridge AI is designed in compliance with:
- **India Digital Personal Data Protection Act (DPDPA 2023)**
- **General Data Protection Regulation (GDPR - Regulation EU 2016/679)**
- **Telemedicine Practice Guidelines of India (2020)**

---

## 2. Privacy Guarantees

### Zero Commercial Exploitation
Mental health observations, user queries, mood scores, and journal entries are strictly never sold, rented, or shared with third-party advertising or commercial profiling networks.

### Granular User Consent
Users retain granular, per-feature toggles:
- Emergency contact notification consent
- Multi-session AI conversational memory
- Inclusion in de-identified institutional wellness trends
- Third-party telemetry scripts (Disabled by default)

### Client-Side Journal Encryption
Personal journal reflections are stored with AES-GCM encryption. University deans, campus faculty, and parents cannot access student journal entries.

### K-Anonymity Institutional Protection
Institutional dashboards aggregate mental wellness indices with strict k-anonymity (cohorts below 15 students are automatically suppressed to eliminate re-identification risks).

### Data Portability & Right to Erasure
In accordance with DPDPA 2023, users can:
1. Export all data in machine-readable JSON format at any time.
2. Submit a permanent account erasure request to purge records across primary databases and backups.

