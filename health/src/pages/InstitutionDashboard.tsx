import { useState } from 'react';
import { 
  Building2, 
  Users, 
  ShieldAlert, 
  TrendingUp, 
  Lock, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Eye,
  FileCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { db } from '../services/db/mockDatabase';
import { useAuth } from '../context/AuthContext';
import { SafetyCase } from '../types';

export function InstitutionDashboard() {
  const { user } = useAuth();
  const analytics = db.institutionAnalytics;
  const [safetyCases, setSafetyCases] = useState<SafetyCase[]>(db.safetyCases);
  const [selectedCase, setSelectedCase] = useState<SafetyCase | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const handleReviewCase = (caseId: string, status: SafetyCase['status']) => {
    db.reviewSafetyCase(caseId, user.name, reviewNotes || 'Review completed by institution safety officer.', status);
    setSafetyCases([...db.safetyCases]);
    setSelectedCase(null);
    setReviewNotes('');
  };

  const stressPieData = [
    { name: 'Low Stress', value: analytics.stressDistribution.low, color: '#30A46C' },
    { name: 'Moderate Stress', value: analytics.stressDistribution.moderate, color: '#F5A623' },
    { name: 'Elevated Concern', value: analytics.stressDistribution.elevated, color: '#E5484D' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#303F70] uppercase tracking-wider mb-2">
            <Building2 className="w-4 h-4 text-[#A99CE0]" />
            <span>University Wellness Department</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#20283D] tracking-tight">
            {analytics.institutionName}
          </h1>
          <p className="text-xs sm:text-sm text-[#697386] mt-1">
            Institutional Aggregate Insights & Authorized Safety Incident Desk
          </p>
        </div>

        {/* K-Anonymity Privacy Badge */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 flex items-start space-x-3 text-xs">
          <Lock className="w-4 h-4 text-[#303F70] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#303F70] block">Differential Privacy & k-Anonymity Enforced:</strong>
            <span className="text-[#697386] leading-tight block mt-0.5">
              Individual chat transcripts, identifiable scores, and journal entries are strictly blocked. Cohorts under 15 users are automatically suppressed.
            </span>
          </div>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#697386] mb-2 font-semibold">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-[#303F70]" />
          </div>
          <div className="text-2xl font-black text-[#20283D]">{analytics.enrolledUsersCount.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Active Campus Cohort</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#697386] mb-2 font-semibold">
            <span>Voluntary Participation</span>
            <Activity className="w-4 h-4 text-[#64B6AC]" />
          </div>
          <div className="text-2xl font-black text-[#303F70]">{analytics.voluntaryParticipationRate}%</div>
          <span className="text-[11px] text-[#697386] mt-1 block">1,840 monthly active users</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#697386] mb-2 font-semibold">
            <span>Campus Wellness Index</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{analytics.averageWellnessScore} / 100</div>
          <span className="text-[11px] text-[#697386] mt-1 block">+2.4 pts from previous term</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#697386] mb-2 font-semibold">
            <span>Active Safety Cases</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{safetyCases.filter(c => c.status !== 'RESOLVED').length}</div>
          <span className="text-[11px] text-[#697386] mt-1 block">Strictly authorized review only</span>
        </div>
      </div>

      {/* Aggregate Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Volume Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold text-[#20283D] mb-4">
            Aggregated Wellness Check-ins & Counsellor Bookings
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="checkInVolume" fill="#303F70" radius={[6, 6, 0, 0]} name="Check-in Volume" />
                <Bar dataKey="counselorBookings" fill="#A99CE0" radius={[6, 6, 0, 0]} name="Counsellor Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stress Distribution Donut */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#20283D] mb-1">Campus Stress Distribution</h3>
            <p className="text-xs text-[#697386]">De-identified campus population breakdown</p>
          </div>

          <div className="h-44 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stressPieData} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {stressPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {stressPieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center text-[#697386]">
                  <span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: d.color }}></span>
                  {d.name}
                </span>
                <span className="font-bold text-[#20283D]">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Authorized Safety Review Desk */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-[#20283D]">
                Authorized Safety Escalation Review Desk
              </h3>
            </div>
            <p className="text-xs text-[#697386] mt-0.5">
              Protocol: Cases require documented human review. No automatic notification sent to contacts without verified policy adherence.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/60 px-3 py-1.5 rounded-xl">
            Authorized Personnel: {user.name}
          </span>
        </div>

        {/* Safety Cases Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-[#697386] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Case ID</th>
                <th className="p-3">Subject ID</th>
                <th className="p-3">Risk Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Detected Time</th>
                <th className="p-3 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safetyCases.map((sc) => (
                <tr key={sc.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-bold text-[#303F70]">{sc.id}</td>
                  <td className="p-3 font-medium text-[#20283D]">{sc.userDisplayName}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      sc.riskCategory === 'HIGH_RISK_IMMEDIATE' 
                        ? 'bg-rose-50 text-rose-700' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {sc.riskCategory.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-700">{sc.status}</td>
                  <td className="p-3 text-slate-500">{new Date(sc.detectedAt).toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedCase(sc)}
                      className="px-3 py-1.5 rounded-lg bg-[#303F70] hover:bg-[#202b4d] text-white font-bold text-[11px]"
                    >
                      Review Case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#20283D]">Safety Case Review: {selectedCase.id}</h3>
                <span className="text-xs text-[#697386]">Subject: {selectedCase.userDisplayName}</span>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
              <strong>Escalation Safeguard Policy:</strong> MindBridge strictly forbids sending chat histories, answers, or medical labels to emergency contacts. Any outreach must follow minimum-necessary wellbeing check guidelines.
            </div>

            <div>
              <label className="text-xs font-bold text-[#20283D] block mb-1">
                Authorized Reviewer Clinical / Safety Notes:
              </label>
              <textarea
                rows={4}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Document check-in outcome, wellness team outreach, or safety verification..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Audit Trail Log */}
            <div>
              <span className="text-[11px] font-bold text-[#697386] uppercase block mb-1">Case Audit Trail:</span>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 max-h-28 overflow-y-auto space-y-1 text-[11px] text-slate-600">
                {selectedCase.auditLogs.map((log, i) => (
                  <div key={i}>
                    <span className="font-semibold text-[#20283D]">{log.actor}</span>: {log.details}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                onClick={() => handleReviewCase(selectedCase.id, 'RESOLVED')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
              >
                Mark Resolved (Safe)
              </button>

              <button
                onClick={() => handleReviewCase(selectedCase.id, 'ACKNOWLEDGED')}
                className="px-4 py-2.5 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold shadow-xs"
              >
                Acknowledge & Monitor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
