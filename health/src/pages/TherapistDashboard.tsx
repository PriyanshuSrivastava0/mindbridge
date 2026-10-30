import { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { db } from '../services/db/mockDatabase';
import { useAuth } from '../context/AuthContext';
import { Appointment } from '../types';

export function TherapistDashboard({ navigate }: { navigate: (route: string) => void }) {
  const { user } = useAuth();
  const [appointments] = useState<Appointment[]>(db.appointments);
  const [activeTab, setActiveTab] = useState<'APPOINTMENTS' | 'PATIENTS_TRACK' | 'SHARED_MESSAGES' | 'AVAILABILITY'>('APPOINTMENTS');

  // Availability state
  const therapistData = db.therapists.find(t => t.name.includes('Patel')) || db.therapists[0];
  const [availableDays, setAvailableDays] = useState<string[]>(therapistData.availableDays);
  const [availableSlots] = useState<string[]>(therapistData.availableSlots);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter(d => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleSaveAvailability = () => {
    therapistData.availableDays = availableDays;
    therapistData.availableSlots = availableSlots;
    db.persist();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const confirmedAppointments = appointments.filter(a => a.status === 'CONFIRMED');

  // Filter messages that the user EXPLICITLY approved for the counsellor to view
  const conversation = db.conversations[0];
  const approvedMessages = conversation?.messages.filter(m => m.approvedForCounsellor) || [];
  const lockedMessagesCount = (conversation?.messages.length || 0) - approvedMessages.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
            alt="Doctor Avatar"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-50"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#20283D]">{user.name}</h1>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Clinician (RCI / MCI)</span>
              </span>
            </div>
            <p className="text-xs text-[#303F70] font-medium mt-0.5">
              Licensed Clinical Psychologist & Cognitive Behavioral Lead
            </p>
            <p className="text-[11px] text-[#697386] mt-1">
              Active Treatment Relationships: 14 Patients • License #CP-8921-ND
            </p>
          </div>
        </div>

        {/* Quick Earnings / Consultation Metric */}
        <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[11px] text-[#697386] block">Monthly Completed</span>
            <span className="text-lg font-bold text-[#303F70]">28 Consultations</span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div>
            <span className="text-[11px] text-[#697386] block">Consultation Earnings</span>
            <span className="text-lg font-bold text-emerald-700">₹42,000</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('APPOINTMENTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'APPOINTMENTS'
              ? 'bg-[#303F70] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Scheduled Sessions ({confirmedAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('PATIENTS_TRACK')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'PATIENTS_TRACK'
              ? 'bg-[#303F70] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Patient Health Improvement Track
        </button>
        <button
          onClick={() => setActiveTab('SHARED_MESSAGES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
            activeTab === 'SHARED_MESSAGES'
              ? 'bg-[#303F70] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Patient Approved Messages ({approvedMessages.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('AVAILABILITY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'AVAILABILITY'
              ? 'bg-[#303F70] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Availability & Slot Settings
        </button>
      </div>

      {/* Tab 1: Scheduled Consultations */}
      {activeTab === 'APPOINTMENTS' && (
        <div className="space-y-4">
          {confirmedAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-base text-[#20283D]">{apt.userName}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#303F70] text-[10px] font-bold">
                    {apt.type} SESSION
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-[#697386] mt-1">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {apt.dateTime}
                  </span>
                  <span>• {apt.durationMinutes} mins</span>
                  <span className="text-emerald-700 font-semibold">• Payment Confirmed (₹{apt.fee})</span>
                </div>
                {apt.clinicalNotes && (
                  <p className="text-xs text-[#697386] bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-3 max-w-xl">
                    <strong className="text-[#20283D]">Preliminary Clinician Note:</strong> {apt.clinicalNotes}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => navigate(apt.meetingLink)}
                  className="px-5 py-2.5 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold shadow-sm transition-transform active:scale-95 flex items-center space-x-1.5"
                >
                  <Video className="w-4 h-4 text-[#A99CE0]" />
                  <span>Join Consultation Room</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Patient Health Improvement Track (Longitudinal trends visible without seeing private chats) */}
      {activeTab === 'PATIENTS_TRACK' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-[#20283D]">
                  Patient: Alex Chen — Longitudinal Health Improvement Track
                </h3>
              </div>
              <p className="text-xs text-[#697386] mt-0.5">
                Counsellor has full authorization to track health recovery metrics, sleep, and screening trends over time.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
              +55% Net Improvement (14 Days)
            </span>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-[#697386] block">Baseline Wellness</span>
              <span className="text-xl font-bold text-[#20283D]">54 / 100</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Oct 16 (Intake)</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-[#697386] block">Current Wellness</span>
              <span className="text-xl font-bold text-emerald-700">84 / 100</span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">▲ +30 pts gained</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-[#697386] block">Stress Index Curve</span>
              <span className="text-xl font-bold text-[#303F70]">9 → 3 / 10</span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">66% drop in stress</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-[#697386] block">Sleep Duration</span>
              <span className="text-xl font-bold text-indigo-700">8.0 hrs / night</span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Stabilized deep sleep</span>
            </div>
          </div>

          {/* Day-by-day table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#303F70] mb-3">
              Day-by-Day Historical Progression Log
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-[#697386] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-xl">Timeline</th>
                    <th className="p-3">Overall Score</th>
                    <th className="p-3">Mood Score</th>
                    <th className="p-3">Stress Index</th>
                    <th className="p-3">Sleep</th>
                    <th className="p-3 rounded-r-xl">Clinician Notes & Observations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {db.dailyProgressHistory.slice(-5).map((row) => (
                    <tr key={row.date} className="hover:bg-slate-50/60">
                      <td className="p-3 font-bold text-[#303F70]">{row.dayLabel} ({row.date})</td>
                      <td className="p-3 font-bold text-emerald-700">{row.overallScore}/100</td>
                      <td className="p-3">{row.moodScore} / 5</td>
                      <td className="p-3 text-amber-700 font-semibold">{row.stressLevel} / 10</td>
                      <td className="p-3">{row.sleepHours} hrs</td>
                      <td className="p-3 text-slate-600">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Strict Patient Message Privacy (Only displays messages explicitly approved by the patient) */}
      {activeTab === 'SHARED_MESSAGES' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-[#20283D]">
                  Patient Explicitly Approved Messages
                </h3>
              </div>
              <p className="text-xs text-[#697386] mt-0.5">
                Client confidentiality boundary: Personal chats and reflections remain strictly hidden until the user clicks the lock icon to approve sharing with you.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full">
              {approvedMessages.length} Approved • {lockedMessagesCount} Kept Private
            </span>
          </div>

          {/* Privacy Guarantee Alert */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Clinician Protocol Note:</strong> You have full visibility into Alex's longitudinal health scores, screening indices, and treatment improvements. However, per our clinical privacy architecture, personal conversational messages between Alex and the AI companion are hidden unless Alex explicitly marks them as <em>"Approved for Counsellor"</em>.
            </div>
          </div>

          {/* Display Approved Messages */}
          {approvedMessages.length > 0 ? (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#303F70] block">
                Messages Shared by Alex Chen for Clinical Review:
              </span>
              {approvedMessages.map((msg) => (
                <div key={msg.id} className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#303F70]">Sender: Alex Chen (Student)</span>
                    <span className="text-slate-400">{msg.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#20283D] leading-relaxed whitespace-pre-wrap">
                    "{msg.content}"
                  </p>
                  <div className="flex items-center space-x-1.5 text-[10px] text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Patient Consent Verified: Transmitted for clinical intake</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl space-y-3">
              <Lock className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-[#20283D]">No Personal Messages Shared Yet</h4>
              <p className="text-xs text-[#697386] max-w-md mx-auto leading-relaxed">
                Alex Chen has not yet marked any conversational messages for clinician disclosure. The patient's full health score track remains accessible under the Health Track tab.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Availability & Slot Settings */}
      {activeTab === 'AVAILABILITY' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#20283D]">Consultation Schedule Manager</h3>
              <p className="text-xs text-[#697386]">Configure days and time windows open for booking</p>
            </div>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full animate-fade-in">
                ✓ Availability Updated
              </span>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-[#20283D] block mb-2">Available Consultation Days:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    availableDays.includes(day)
                      ? 'bg-[#303F70] text-white border-[#303F70]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {availableDays.includes(day) ? '✓ ' : ''}{day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#20283D] block mb-2">Daily Time Slots:</label>
            <div className="flex flex-wrap gap-2">
              {availableSlots.map((slot) => (
                <span
                  key={slot}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1"
                >
                  <Clock className="w-3.5 h-3.5 text-[#303F70]" />
                  <span>{slot}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              // eslint-disable-next-line react-hooks/immutability
              onClick={handleSaveAvailability}
              className="px-6 py-2.5 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
            >
              Save Schedule Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
