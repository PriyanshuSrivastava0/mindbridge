import { useState } from 'react';
import { 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  Moon, 
  Sparkles,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
} from 'recharts';
import { db } from '../services/db/mockDatabase';
import { useAuth } from '../context/AuthContext';
import { DailyProgressSnapshot } from '../types';

export function HealthRecordsPage() {
  const { user } = useAuth();
  const [history] = useState<DailyProgressSnapshot[]>(db.dailyProgressHistory);
  const [selectedMetric, setSelectedMetric] = useState<'overall' | 'stress' | 'sleep' | 'anxiety'>('overall');

  const firstDay = history[0];
  const latestDay = history[history.length - 1];
  const improvementPoints = latestDay.overallScore - firstDay.overallScore;
  const improvementPercent = Math.round((improvementPoints / firstDay.overallScore) * 100);

  const chartData = history.map((h) => ({
    day: h.dayLabel,
    date: h.date,
    overallScore: h.overallScore,
    stressLevel: h.stressLevel,
    sleepHours: h.sleepHours,
    anxietyScore: h.anxietyScore,
    moodScore: h.moodScore
  }));

  const handleExportHealthReport = () => {
    const report = {
      patientName: user.name,
      patientId: user.id,
      trackingPeriod: `${firstDay.date} to ${latestDay.date}`,
      initialBaselineScore: firstDay.overallScore,
      currentWellnessScore: latestDay.overallScore,
      netImprovement: `+${improvementPoints} points (+${improvementPercent}%)`,
      dayByDayHistory: history,
      reportGeneratedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mindbridge_health_improvement_record_${user.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#303F70] to-[#202b4d] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-[#A99CE0] text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Day-by-Day Health & Improvement Record</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Your Longitudinal Wellness Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
            Objective track of your mental health recovery curve, stress alleviation, and sleep stabilization over time.
          </p>
        </div>

        <button
          onClick={handleExportHealthReport}
          className="shrink-0 px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-[#303F70] text-xs font-bold shadow-md transition-colors flex items-center space-x-2"
        >
          <Download className="w-4 h-4 text-[#A99CE0]" />
          <span>Export Progress Report</span>
        </button>
      </div>

      {/* Net Improvement Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#697386] mb-2 font-semibold">
            <span>Overall Improvement</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700">+{improvementPercent}%</div>
          <span className="text-[11px] text-[#697386] mt-1 block">
            Baseline: {firstDay.overallScore}/100 → Today: <strong>{latestDay.overallScore}/100</strong>
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#697386] mb-2 font-semibold">
            <span>Stress Reduction</span>
            <Activity className="w-4 h-4 text-[#64B6AC]" />
          </div>
          <div className="text-3xl font-black text-[#303F70]">
            {firstDay.stressLevel} <span className="text-sm font-normal text-slate-400">→</span> {latestDay.stressLevel}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            -66% decrease in acute stress
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#697386] mb-2 font-semibold">
            <span>Sleep Stabilization</span>
            <Moon className="w-4 h-4 text-[#A99CE0]" />
          </div>
          <div className="text-3xl font-black text-indigo-700">
            {latestDay.sleepHours} hrs
          </div>
          <span className="text-[11px] text-[#697386] mt-1 block">
            Up from {firstDay.sleepHours} hrs baseline (+3.2h)
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#697386] mb-2 font-semibold">
            <span>Check-in Consistency</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">14 Days</div>
          <span className="text-[11px] text-[#697386] mt-1 block">
            Continuous daily tracking streak
          </span>
        </div>
      </div>

      {/* Main Interactive Day-by-Day Recharts Canvas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#20283D]">
              Day-by-Day Mental Health Recovery Curve
            </h3>
            <p className="text-xs text-[#697386]">
              Real historical measurements comparing baseline stress and wellness indicators
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-2xl">
            {[
              { key: 'overall', label: 'Overall Score (0-100)' },
              { key: 'stress', label: 'Stress (1-10)' },
              { key: 'sleep', label: 'Sleep Hours' },
              { key: 'anxiety', label: 'Anxiety (GAD-7)' }
            ].map((m) => (
              <button
                key={m.key}
                onClick={() => setSelectedMetric(m.key as 'overall' | 'stress' | 'sleep' | 'anxiety')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedMetric === m.key
                    ? 'bg-white text-[#303F70] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="curveColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#303F70" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#303F70" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey={
                  selectedMetric === 'overall'
                    ? 'overallScore'
                    : selectedMetric === 'stress'
                    ? 'stressLevel'
                    : selectedMetric === 'sleep'
                    ? 'sleepHours'
                    : 'anxietyScore'
                }
                stroke="#303F70"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#curveColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Day-by-Day Detailed Log Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-[#20283D]">14-Day Chronological Health Record</h3>
            <p className="text-xs text-[#697386]">Detailed day-by-day metrics and milestone reflections</p>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span>Accessible to You & Summarized for Counsellor</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-[#697386] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Timeline</th>
                <th className="p-3">Overall Score</th>
                <th className="p-3">Mood</th>
                <th className="p-3">Stress</th>
                <th className="p-3">Sleep</th>
                <th className="p-3">Mindfulness</th>
                <th className="p-3 rounded-r-xl">Observations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...history].reverse().map((day) => (
                <tr key={day.date} className="hover:bg-slate-50/60">
                  <td className="p-3 font-bold text-[#303F70]">
                    <div>{day.dayLabel}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{day.date}</div>
                  </td>
                  <td className="p-3">
                    <span className="font-extrabold text-sm text-[#20283D]">{day.overallScore}/100</span>
                    {day.improvingDayOverDay && (
                      <span className="ml-1.5 text-[10px] text-emerald-600 font-bold">▲ Up</span>
                    )}
                  </td>
                  <td className="p-3 font-semibold">{day.moodScore} / 5</td>
                  <td className="p-3 font-semibold text-amber-700">{day.stressLevel} / 10</td>
                  <td className="p-3">{day.sleepHours} hrs</td>
                  <td className="p-3 font-medium text-emerald-700">{day.mindfulnessMinutes} mins</td>
                  <td className="p-3 text-slate-600 max-w-xs">{day.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

