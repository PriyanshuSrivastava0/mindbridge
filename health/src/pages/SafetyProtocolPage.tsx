import { ShieldAlert, PhoneCall, CheckCircle2, Lock, HeartHandshake, AlertTriangle } from 'lucide-react';
import { CRISIS_RESOURCES } from '../services/ai/safetyTriage';

export function SafetyProtocolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold">
          <ShieldAlert className="w-4 h-4" />
          <span>Zero-Harm Clinical Safety Protocols</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#20283D] tracking-tight">
          Emergency Risk Detection & Human-in-the-Loop Protocol
        </h1>
        <p className="text-xs sm:text-sm text-[#697386] leading-relaxed">
          How MindBridge AI balances compassionate support, automated triage, explainable risk evidence, and human clinical oversight while safeguarding user privacy.
        </p>
      </div>

      {/* Safety Protocol 8-Step Flow */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-[#20283D] uppercase tracking-wider text-[#303F70]">
          The 8-Stage Safety Escalation Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            {
              num: '01',
              title: 'Safety Signal Detection',
              desc: 'Dedicated safety classifier inspects incoming conversational text and screening item 9 specifically for explicit self-harm intent.'
            },
            {
              num: '02',
              title: 'Contextual Disambiguation',
              desc: 'Distinguishes genuine immediate peril from ambiguous distress, colloquial frustration, or academic fatigue to minimize false alarms.'
            },
            {
              num: '03',
              title: 'Immediate Supportive Response',
              desc: 'AI immediately validates distress without clinical judgment, assesses immediate safety, and offers comforting grounding presence.'
            },
            {
              num: '04',
              title: 'Emergency Hotlines Presentation',
              desc: 'Surface verified 24/7 national helplines (Tele-MANAS, KIRAN, 988) with one-click direct dialing.'
            },
            {
              num: '05',
              title: 'Immediate Professional Referral',
              desc: 'Provides instant fast-track booking with an on-call human licensed counsellor or campus crisis responder.'
            },
            {
              num: '06',
              title: 'Priority Human Review Desk',
              desc: 'Creates a confidential priority case for an authorized safety officer. No automated disclosure occurs purely based on AI probability.'
            },
            {
              num: '07',
              title: 'Policy-Enforced Escalation',
              desc: 'If user consent is documented and safety officer verifies acute danger, a minimum-necessary alert is dispatched to the verified contact.'
            },
            {
              num: '08',
              title: 'Zero-Transcript Privacy Guarantee',
              desc: 'Emergency notifications never contain personal chat transcripts, journal entries, or psychiatric diagnoses.'
            }
          ].map((step) => (
            <div key={step.num} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-mono font-black text-sm text-[#303F70]">{step.num}</span>
              <h4 className="font-bold text-[#20283D] text-sm">{step.title}</h4>
              <p className="text-[#697386] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Crisis Directory */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-[#20283D]">Verified Global Crisis Hotlines</h3>
          <p className="text-xs text-[#697386] mt-0.5">Free, confidential support available 24/7/365.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CRISIS_RESOURCES.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#20283D]">{r.name}</span>
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full font-medium text-slate-700">
                  {r.region}
                </span>
              </div>
              <p className="text-[11px] text-[#697386] leading-relaxed">{r.description}</p>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-[#303F70]">{r.contact}</span>
                {r.type === 'PHONE' && (
                  <a
                    href={`tel:${r.contact.replace(/[^0-9+]/g, '')}`}
                    className="px-3 py-1 rounded-lg bg-[#303F70] text-white text-[11px] font-bold"
                  >
                    Call Now
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
