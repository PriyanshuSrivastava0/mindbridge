
import { CheckCircle2 } from 'lucide-react';
import { CRISIS_RESOURCES } from '../services/ai/safetyTriage';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-[#20283D]">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#303F70]">Our Mission & Values</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Compassionate Technology for Emotional Health
        </h1>
        <p className="text-sm text-[#697386] max-w-2xl mx-auto leading-relaxed">
          MindBridge AI was founded by mental health clinicians, AI safety researchers, and digital health engineers to bridge the critical gap between early emotional distress and qualified human care.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-[#303F70]">Our Guiding Principles</h3>
        <ul className="space-y-3 text-xs sm:text-sm text-[#697386]">
          <li className="flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#64B6AC] shrink-0 mt-0.5" />
            <span><strong>Never Replace the Human Touch:</strong> AI is an early listener and signpost, not a therapist, psychiatrist, or diagnostic authority.</span>
          </li>
          <li className="flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#64B6AC] shrink-0 mt-0.5" />
            <span><strong>Zero Surveillance:</strong> University wellness centers and family members never receive secret transcripts or invasive surveillance telemetry.</span>
          </li>
          <li className="flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#64B6AC] shrink-0 mt-0.5" />
            <span><strong>Explainable Care:</strong> Any screening metric or recommended exercise must be completely explainable in clear, patient-friendly language.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function FeaturesPage() {
  const features = [
    { title: 'Empathetic AI Companion', desc: 'Conversational agent tuned for validation, active listening, and calm presence. Multi-lingual support in English, Hindi, and Hinglish.' },
    { title: 'Clinical-Grade Standardized Screenings', desc: 'Validated PHQ-9, GAD-7, and PSS-10 questionnaires scored according to peer-reviewed clinical rules.' },
    { title: 'Interactive Somatic Interventions', desc: 'Step-by-step 4-7-8 parasympathetic breathing circles and 5-4-3-2-1 sensory grounding to arrest acute panic.' },
    { title: 'Verified Therapist Consultations', desc: 'End-to-end encrypted telehealth video consultation with verified licensed psychologists (RCI / MCI credentialed).' },
    { title: 'Zero-Harm Emergency Safety Triage', desc: 'Policy-enforced safety cases with human safety officer verification and verified crisis resources.' },
    { title: 'De-Identified Institutional Analytics', desc: 'K-anonymity aggregate trend reporting for university campuses without compromising individual student privacy.' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#20283D] tracking-tight">
          Platform Architecture & Capabilities
        </h1>
        <p className="text-sm text-[#697386] max-w-2xl mx-auto">
          An integrated ecosystem designed for proactive resilience, early detection, and verified clinical collaboration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2.5">
            <h3 className="text-base font-bold text-[#303F70]">{f.title}</h3>
            <p className="text-xs text-[#697386] leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#20283D]">
          How MindBridge AI Works
        </h1>
        <p className="text-sm text-[#697386] max-w-xl mx-auto">
          From your first conversation to licensed therapy: a secure, dignified, patient-centered journey.
        </p>
      </div>

      <div className="space-y-6">
        {[
          { step: '01', title: 'Start a Judgment-Free Conversation', desc: 'Talk or type about whatever is weighing on your mind. The AI responds with genuine warmth, validates your experience, and respects your pace.' },
          { step: '02', title: 'Complete Voluntary Check-ins', desc: 'If you choose, take a standardized 3-minute screening (PHQ-9 or GAD-7). Receive an explainable breakdown of observed indicators, with zero diagnostic labels.' },
          { step: '03', title: 'Access Personalized Self-Care', desc: 'Try clinically proven somatic grounding, guided breathing, or structured thought reframing tools tailored to your current stress levels.' },
          { step: '04', title: 'Connect with a Verified Professional', desc: 'When you are ready for deeper clinical exploration, book a confidential 50-minute telehealth session with a credentialed psychologist.' }
        ].map((s) => (
          <div key={s.step} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start space-x-5">
            <span className="font-mono text-2xl font-black text-[#A99CE0]">{s.step}</span>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#20283D]">{s.title}</h3>
              <p className="text-xs sm:text-sm text-[#697386] leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InstitutionsPublicPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#303F70]">Campus Partnerships</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#20283D]">
          University & College Wellness Partnerships
        </h1>
        <p className="text-sm text-[#697386] max-w-2xl mx-auto">
          Empowering academic institutions to support student mental health with dignity, high engagement, and absolute privacy safeguards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-[#303F70]">For Students</h3>
          <p className="text-xs text-[#697386] leading-relaxed">
            Free, round-the-clock emotional first aid, exam stress decompression, and voluntary subsidized counseling sessions provided through university benefits.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-[#303F70]">For Wellness Deans & Safety Officers</h3>
          <p className="text-xs text-[#697386] leading-relaxed">
            Anonymized campus health indices, early seasonal stress tracking (e.g. finals week spikes), and structured safety incident oversight without infringing upon student privacy.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ResourcesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#20283D]">
          Crisis & Mental Health Resources
        </h1>
        <p className="text-sm text-[#697386] max-w-2xl mx-auto">
          Free, confidential, and verified hotlines and self-advocacy guides available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CRISIS_RESOURCES.map((res) => (
          <div key={res.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#20283D]">{res.name}</h3>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-700">{res.region}</span>
            </div>
            <p className="text-xs text-[#697386]">{res.description}</p>
            <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#303F70]">
              <span>{res.contact}</span>
              <span className="text-emerald-700 text-[11px]">● {res.availability}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#20283D]">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold">Privacy Policy & Data Protection</h1>
        <p className="text-xs text-[#697386]">Aligned with the Digital Personal Data Protection Act (DPDPA 2023) and GDPR.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 text-xs sm:text-sm leading-relaxed text-[#697386]">
        <section className="space-y-2">
          <h3 className="text-base font-bold text-[#20283D]">1. Purpose and Scope</h3>
          <p>
            MindBridge AI processes voluntary conversational and questionnaire information solely for providing empathetic early support, self-paced wellness recommendations, and connecting users with verified psychologists.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-[#20283D]">2. Zero Commercial Exploitation</h3>
          <p>
            MindBridge AI strictly prohibits selling, licensing, or sharing personal mental health data with advertisers, third-party brokers, or commercial profiling engines.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-[#20283D]">3. Data Portability and Erasure</h3>
          <p>
            Users maintain the right to export all personal check-ins, journal entries, and assessment records at any time as structured JSON packages, or request complete, irreversible account purging.
          </p>
        </section>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#20283D]">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold">Terms of Service & Clinical Disclaimer</h1>
        <p className="text-xs text-[#697386]">Last updated: October 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 text-xs sm:text-sm leading-relaxed text-[#697386]">
        <section className="space-y-2">
          <h3 className="text-base font-bold text-[#20283D]">1. Non-Diagnostic Notice</h3>
          <p>
            MindBridge AI is an informational early-support and referral service. It is not an automated medical diagnostic tool and does not provide formal psychiatric diagnoses or emergency response services.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-[#20283D]">2. Emergency Services</h3>
          <p>
            If you or someone you know is in immediate life-threatening physical peril, you must immediately contact regional emergency responders (112 in India, 911 in the USA) or call a dedicated 24/7 crisis hotline (Tele-MANAS: 14416).
          </p>
        </section>
      </div>
    </div>
  );
}

