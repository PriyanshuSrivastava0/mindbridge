import { useState } from 'react';
import { 
  Sparkles, 
  Activity, 
  Calendar, 
  Compass, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  Video
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db/mockDatabase';
import { MoodEntry } from '../types';
import confetti from 'canvas-confetti';

export function UserDashboard({ navigate }: { navigate: (route: string) => void }) {
  const { user } = useAuth();
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(db.moodEntries);
  const [appointments] = useState(db.appointments);
  const [screenings] = useState(db.screeningResults);
  const [selectedMoodScore, setSelectedMoodScore] = useState<number | null>(null);
  const [moodSavedToast, setMoodSavedToast] = useState(false);

  const moodChartData = moodHistory.map((m) => ({
    date: new Date(m.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    mood: m.score,
    stress: m.stressLevel,
    energy: m.energyLevel
  })).reverse();

  const handleQuickMoodCheckIn = (score: number, emoji: string, label: string) => {
    setSelectedMoodScore(score);
    void db.addMoodEntry({
      userId: user.id,
      score,
      label,
      emoji,
      energyLevel: score * 2,
      stressLevel: 10 - score * 1.5,
      sleepHours: 7.0,
      triggers: ['Daily Check-in'],
      notes: 'Logged via Quick Mood Widget.'
    });

    setMoodHistory([...db.moodEntries]);
    setMoodSavedToast(true);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    setTimeout(() => setMoodSavedToast(false), 3000);
  };

  const upcomingApt = appointments.find(a => a.status === 'CONFIRMED');
  const recentScreening = screenings[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#303F70] to-[#202b4d] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-[#A99CE0] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome back, {user.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How is your heart and mind feeling today?
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
            You don't have to carry your workload or thoughts in silence. Check in with your empathetic AI companion or explore calming self-help tools.
          </p>
        </div>

        <button
          onClick={() => navigate('/chat')}
          className="shrink-0 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-[#303F70] text-xs font-bold shadow-lg transition-transform active:scale-95 flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4 text-[#A99CE0]" />
          <span>Talk with MindBridge AI</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Mood Log Widget */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#20283D] uppercase tracking-wider">
              Daily Emotion Check-in
            </h3>
            <p className="text-xs text-[#697386]">Select the emoji that best reflects your current space</p>
          </div>
          {moodSavedToast && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full animate-fade-in">
              ✓ Mood logged successfully
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { score: 5, emoji: '✨', label: 'Vibrant & Energized' },
            { score: 4, emoji: '😊', label: 'Good & Calm' },
            { score: 3, emoji: '😐', label: 'Okay / Neutral' },
            { score: 2, emoji: '😔', label: 'Low / Tired' },
            { score: 1, emoji: '🌧️', label: 'Overwhelmed' }
          ].map((item) => (
            <button
              key={item.score}
              onClick={() => handleQuickMoodCheckIn(item.score, item.emoji, item.label)}
              className={`p-4 rounded-2xl border text-center transition-all ${
                selectedMoodScore === item.score
                  ? 'border-[#303F70] bg-[#303F70]/5 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white'
              }`}
            >
              <span className="text-2xl block mb-1">{item.emoji}</span>
              <span className="text-xs font-bold text-[#20283D] block">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Section: Trends Chart & Active Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mood & Stress Recharts Graph (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#303F70]" />
              <h3 className="text-base font-bold text-[#20283D]">14-Day Wellness & Stress Trends</h3>
            </div>
            <div className="flex items-center space-x-3 text-xs text-[#697386]">
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#303F70] mr-1.5"></span>
                Mood (1-5)
              </span>
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#64B6AC] mr-1.5"></span>
                Stress Level (1-10)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#303F70" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#303F70" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64B6AC" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#64B6AC" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="mood" stroke="#303F70" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMood)" />
                <Area type="monotone" dataKey="stress" stroke="#64B6AC" strokeWidth={2} fillOpacity={1} fill="url(#colorStress)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Next Appointment & Screening Snapshot */}
        <div className="flex flex-col space-y-6">
          {/* Upcoming Appointment Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[#303F70] uppercase tracking-wider mb-3">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-[#A99CE0]" />
                  <span>Next Consultation</span>
                </span>
                {upcomingApt && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                    Confirmed
                  </span>
                )}
              </div>

              {upcomingApt ? (
                <div>
                  <h4 className="text-base font-bold text-[#20283D]">{upcomingApt.therapistName}</h4>
                  <p className="text-xs text-[#697386] mt-0.5">{upcomingApt.therapistTitle}</p>
                  
                  <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-[#20283D] space-y-1">
                    <div className="font-semibold">{upcomingApt.dateTime}</div>
                    <div className="text-[11px] text-[#697386]">50 min confidential video consultation</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-[#697386]">
                  No upcoming appointments. Need professional guidance?
                </div>
              )}
            </div>

            <div className="mt-4">
              {upcomingApt ? (
                <button
                  onClick={() => navigate(upcomingApt.meetingLink)}
                  className="w-full py-2.5 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <Video className="w-4 h-4 text-[#A99CE0]" />
                  <span>Join Video Consultation</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/therapists')}
                  className="w-full py-2.5 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Browse Therapists
                </button>
              )}
            </div>
          </div>

          {/* Recent Screening Indicator */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#303F70] uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-[#64B6AC]" />
                <span>Last Screening ({recentScreening?.screeningType || 'PHQ-9'})</span>
              </span>
              <span className="text-xs font-bold text-[#303F70]">
                {recentScreening?.concernIndex || 26}/100
              </span>
            </div>
            <p className="text-xs text-[#697386]">
              Severity Band: <strong className="text-[#20283D]">{recentScreening?.severityLevel || 'Mild'}</strong>
            </p>
            <button
              onClick={() => navigate('/screenings')}
              className="mt-3 text-xs font-bold text-[#303F70] hover:underline flex items-center space-x-1"
            >
              <span>View full factor explanation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Self-Care Interventions Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-[#303F70]" />
            <h3 className="text-base font-bold text-[#20283D]">Recommended Interventions For You</h3>
          </div>
          <button
            onClick={() => navigate('/interventions')}
            className="text-xs font-bold text-[#303F70] hover:underline flex items-center space-x-1"
          >
            <span>View All Exercises</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('/interventions')}
            className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#20283D] group-hover:text-[#303F70]">4-7-8 Breathing Circle</h4>
            <p className="text-xs text-[#697386] mt-1 leading-relaxed">
              4-minute paced breathing cycle to ease racing thoughts and downregulate sympathetic fight-or-flight response.
            </p>
          </div>

          <div
            onClick={() => navigate('/interventions')}
            className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#303F70] flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#20283D] group-hover:text-[#303F70]">5-4-3-2-1 Sensory Reset</h4>
            <p className="text-xs text-[#697386] mt-1 leading-relaxed">
              Ground your immediate sensory environment to alleviate cognitive distress, panic spikes, or dissociation.
            </p>
          </div>

          <div
            onClick={() => navigate('/dashboard/journal')}
            className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#20283D] group-hover:text-[#303F70]">Private Reflection Journal</h4>
            <p className="text-xs text-[#697386] mt-1 leading-relaxed">
              Express your feelings in an encrypted, private space with optional AI prompts. Never shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
