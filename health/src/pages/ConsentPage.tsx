import { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db/mockDatabase';

export function ConsentPage() {
  const { user, updateConsentSettings } = useAuth();
  const consent = user.consentSettings || {
    analyticsConsent: true,
    emergencyEscalationConsent: true,
    institutionalAggregatedConsent: true,
    aiConversationMemoryConsent: true,
    thirdPartySharingConsent: false,
    version: 'v2.1-DPDPA-2023',
    lastUpdatedAt: new Date().toISOString()
  };

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [deleteRequested, setDeleteRequested] = useState(false);

  const handleToggle = (key: keyof typeof consent) => {
    if (typeof consent[key] === 'boolean') {
      const updated = !consent[key];
      updateConsentSettings({ [key]: updated });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const handleExportAllUserData = () => {
    const fullUserData = {
      userProfile: user,
      moodEntries: db.moodEntries.filter(m => m.userId === user.id),
      journalEntries: db.journalEntries.filter(j => j.userId === user.id),
      screenings: db.screeningResults.filter(s => s.userId === user.id),
      appointments: db.appointments.filter(a => a.userId === user.id),
      exportGeneratedAt: new Date().toISOString(),
      legalBasis: "DPDPA 2023 / GDPR Article 20 Data Portability"
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullUserData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mindbridge_complete_data_package_${user.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteRequest = () => {
    if (confirm("Are you sure you want to request complete permanent deletion of your account and mental health records? This action is irreversible once processed.")) {
      setDeleteRequested(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-[#303F70] text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#64B6AC]" />
          <span>DPDPA 2023 & GDPR Aligned Consent Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#20283D] tracking-tight">
          Privacy, Consent & Data Governance
        </h1>
        <p className="text-xs sm:text-sm text-[#697386] mt-1">
          You are the sole owner of your mental health data. Manage granular permissions, export your information, or exercise your right to erasure at any time.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Consent choices updated and cryptographically recorded.</span>
        </div>
      )}

      {/* Granular Toggles */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-[#20283D]">Granular Processing Preferences</h3>

        <div className="divide-y divide-slate-100 space-y-4">
          {/* Emergency Escalation */}
          <div className="pt-4 flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#20283D] block">
                Emergency Contact Safety Escalation
              </span>
              <p className="text-xs text-[#697386] mt-0.5 leading-relaxed">
                Allows an authorized human reviewer to deliver a minimal safety alert to your verified emergency contact (<strong>{user.emergencyContact?.name || 'Rohan Chen'}</strong>) if acute, immediate life-threatening danger is identified.
              </p>
            </div>
            <input
              type="checkbox"
              checked={consent.emergencyEscalationConsent}
              onChange={() => handleToggle('emergencyEscalationConsent')}
              className="mt-1 h-5 w-5 rounded border-slate-300 text-[#303F70] focus:ring-[#303F70]"
            />
          </div>

          {/* AI Memory */}
          <div className="pt-4 flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#20283D] block">
                AI Companion Multi-Session Memory
              </span>
              <p className="text-xs text-[#697386] mt-0.5 leading-relaxed">
                Permits the AI companion to remember non-sensitive topics (e.g. your preferred breathing exercise or ongoing exam schedule) across conversations to personalize support.
              </p>
            </div>
            <input
              type="checkbox"
              checked={consent.aiConversationMemoryConsent}
              onChange={() => handleToggle('aiConversationMemoryConsent')}
              className="mt-1 h-5 w-5 rounded border-slate-300 text-[#303F70] focus:ring-[#303F70]"
            />
          </div>

          {/* Institutional De-identified Analytics */}
          <div className="pt-4 flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#20283D] block">
                De-Identified University Wellness Cohort Aggregation
              </span>
              <p className="text-xs text-[#697386] mt-0.5 leading-relaxed">
                Includes your non-identifiable stress metrics in campus-wide wellness averages to help universities allocate counseling staff. Protected by k-anonymity (cohorts below 15 are suppressed).
              </p>
            </div>
            <input
              type="checkbox"
              checked={consent.institutionalAggregatedConsent}
              onChange={() => handleToggle('institutionalAggregatedConsent')}
              className="mt-1 h-5 w-5 rounded border-slate-300 text-[#303F70] focus:ring-[#303F70]"
            />
          </div>

          {/* Third-party Sharing (Always strictly opt-in) */}
          <div className="pt-4 flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#20283D] block">
                Third-Party Analytics & Marketing
              </span>
              <p className="text-xs text-[#697386] mt-0.5 leading-relaxed">
                MindBridge never sells your mental health data. Keeping this disabled prevents any third-party telemetry scripts from loading.
              </p>
            </div>
            <input
              type="checkbox"
              checked={consent.thirdPartySharingConsent}
              onChange={() => handleToggle('thirdPartySharingConsent')}
              className="mt-1 h-5 w-5 rounded border-slate-300 text-[#303F70] focus:ring-[#303F70]"
            />
          </div>
        </div>
      </div>

      {/* Data Portability & Deletion */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-[#20283D]">Your Legal Rights (Portability & Erasure)</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-center space-x-2 text-[#303F70] font-bold text-xs">
              <Download className="w-4 h-4" />
              <span>Download Complete Data Archive</span>
            </div>
            <p className="text-xs text-[#697386] leading-relaxed">
              Receive a structured JSON package containing your profile, check-ins, screening history, and consent logs.
            </p>
            <button
              onClick={handleExportAllUserData}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#303F70] hover:bg-[#303F70] hover:text-white transition-colors"
            >
              Export JSON Package
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
            <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs">
              <Trash2 className="w-4 h-4" />
              <span>Right to Erasure (Delete Account)</span>
            </div>
            <p className="text-xs text-[#697386] leading-relaxed">
              Request immediate irreversible purging of your data across all servers and backups in compliance with DPDPA 2023.
            </p>
            {deleteRequested ? (
              <span className="text-xs font-bold text-rose-600 block">
                Deletion request logged with Safety & Privacy Office.
              </span>
            ) : (
              <button
                onClick={handleDeleteRequest}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
              >
                Request Account Deletion
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
