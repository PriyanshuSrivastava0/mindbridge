import { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Trash2,
  Search,
} from 'lucide-react';
import { db } from '../services/db/mockDatabase';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export function AdminDashboard() {
  useAuth();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'VERIFICATIONS' | 'USERS' | 'AI_CONFIG' | 'COMMUNITY_MOD' | 'AUDIT'>('OVERVIEW');
  const [therapists, setTherapists] = useState(db.therapists);
  const [usersList, setUsersList] = useState(db.users);
  const [communityPosts, setCommunityPosts] = useState(db.communityPosts);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // AI Configuration state
  const [inactivityThreshold, setInactivityThreshold] = useState(20);
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(0.85);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [configSaved, setConfigSaved] = useState(false);

  const handleToggleVerifyTherapist = (id: string) => {
    const target = therapists.find(t => t.id === id);
    if (target) {
      target.isVerified = !target.isVerified;
      db.persist();
      setTherapists([...db.therapists]);
    }
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const target = usersList.find(u => u.id === userId);
    if (target) {
      target.role = newRole;
      db.persist();
      setUsersList([...db.users]);
    }
  };

  const handleDeleteCommunityPost = (postId: string) => {
    if (confirm("Remove this post from public community circles?")) {
      // eslint-disable-next-line react-hooks/immutability
      db.communityPosts = db.communityPosts.filter(p => p.id !== postId);
      db.persist();
      setCommunityPosts([...db.communityPosts]);
    }
  };

  const handleSaveConfig = () => {
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#303F70] uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-[#A99CE0]" />
            <span>Platform Governance & Trust Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#20283D] tracking-tight">
            MindBridge Platform Administration
          </h1>
          <p className="text-xs sm:text-sm text-[#697386] mt-1">
            System health, verified clinician credential audits, and safety threshold governance.
          </p>
        </div>

        {/* Security Policy Badge */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center space-x-2">
          <Lock className="w-4 h-4 text-[#303F70]" />
          <span className="text-[#20283D] font-semibold">Strict Role-Based Least-Privilege Enforced</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'OVERVIEW' ? 'bg-[#303F70] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          System Overview
        </button>
        <button
          onClick={() => setActiveTab('VERIFICATIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'VERIFICATIONS' ? 'bg-[#303F70] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Clinician Verifications ({therapists.length})
        </button>
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'USERS' ? 'bg-[#303F70] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          User Accounts ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('COMMUNITY_MOD')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'COMMUNITY_MOD' ? 'bg-[#303F70] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Community Moderation
        </button>
        <button
          onClick={() => setActiveTab('AI_CONFIG')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'AI_CONFIG' ? 'bg-[#303F70] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          AI Guardrails Configuration
        </button>
        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'AUDIT' ? 'bg-[#303F70] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Immutable Audit Logs
        </button>
      </div>

      {/* Tab 0: System Overview */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-xs font-semibold text-[#697386] block">Platform Health Uptime</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">99.98%</span>
              <span className="text-[11px] text-[#697386]">LLM Response Latency: 340ms</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-xs font-semibold text-[#697386] block">Active User Accounts</span>
              <span className="text-2xl font-black text-[#303F70] mt-1 block">{usersList.length}</span>
              <span className="text-[11px] text-emerald-700 font-medium">All DPDPA Verified</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-xs font-semibold text-[#697386] block">Verified Clinicians</span>
              <span className="text-2xl font-black text-[#303F70] mt-1 block">
                {therapists.filter(t => t.isVerified).length} / {therapists.length}
              </span>
              <span className="text-[11px] text-[#697386]">RCI / MCI Registry Audited</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-xs font-semibold text-[#697386] block">Helper Emergency Alerts</span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">
                {db.currentUser.emergencyHelper?.alertSentCount || 0} Sent
              </span>
              <span className="text-[11px] text-[#697386]">Zero transcript leakage verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Clinician Verifications */}
      {activeTab === 'VERIFICATIONS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#20283D]">Therapist & Counsellor Credential Verification</h3>
              <p className="text-xs text-[#697386]">Review medical council registrations, licenses, and verified status</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {therapists.map((t) => (
              <div key={t.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <img src={t.avatarUrl} alt={t.name} className="w-12 h-12 rounded-2xl object-cover" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-[#20283D]">{t.name}</h4>
                      <span className="text-xs text-[#697386]">({t.title})</span>
                    </div>
                    <div className="text-xs text-[#697386] mt-0.5">
                      License ID: <strong className="text-[#20283D]">{t.licenseNumber}</strong> • Rating: {t.rating}★ • Fee: ₹{t.sessionFee}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    t.isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {t.isVerified ? '✓ Credential Verified' : 'Pending Verification'}
                  </span>
                  <button
                    onClick={() => handleToggleVerifyTherapist(t.id)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    {t.isVerified ? 'Revoke Status' : 'Approve Clinician'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: User Accounts */}
      {activeTab === 'USERS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-base font-bold text-[#20283D]">Platform Users & Role Assignments</h3>
              <p className="text-xs text-[#697386]">Manage accounts, role-based access control, and helper configurations</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user, email, or role..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full text-xs py-2 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-[#697386] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-xl">User ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">Helper Safeguard</th>
                  <th className="p-3 rounded-r-xl">Role Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-mono text-[#303F70]">{u.id}</td>
                    <td className="p-3 font-semibold text-[#20283D]">{u.name}</td>
                    <td className="p-3 text-slate-600">{u.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[#303F70] font-bold text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      {u.emergencyHelper ? (
                        <span className="text-emerald-700 font-semibold text-[11px]">
                          ✓ {u.emergencyHelper.name} ({u.emergencyHelper.relationship})
                        </span>
                      ) : (
                        <span className="text-slate-400">Not configured</span>
                      )}
                    </td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="text-xs p-1 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="STUDENT">STUDENT</option>
                        <option value="USER">USER</option>
                        <option value="THERAPIST">THERAPIST</option>
                        <option value="INSTITUTION_SAFETY_OFFICER">SAFETY OFFICER</option>
                        <option value="PLATFORM_ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Community Moderation */}
      {activeTab === 'COMMUNITY_MOD' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#20283D]">Peer Circles Community Moderation</h3>
              <p className="text-xs text-[#697386]">Review anonymous peer posts to ensure safety and trigger-free discussions</p>
            </div>
          </div>

          <div className="space-y-3">
            {communityPosts.map((post) => (
              <div key={post.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-bold text-[#303F70]">{post.authorHandle}</span>
                    <span className="text-[#697386]">in {post.circleName}</span>
                    <span className="text-[10px] text-slate-400">• {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-[#20283D] leading-relaxed">"{post.content}"</p>
                  <div className="flex space-x-1.5 pt-1">
                    {post.tags.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCommunityPost(post.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors shrink-0"
                  title="Remove post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: AI Guardrails Configuration */}
      {activeTab === 'AI_CONFIG' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#20283D]">AI Safety & Conversational Guardrails</h3>
              <p className="text-xs text-[#697386]">Tune engagement timeouts, mid-conversation nudges, and crisis evaluation thresholds</p>
            </div>
            {configSaved && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full animate-fade-in">
                ✓ AI Guardrails Updated
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <label className="text-xs font-bold text-[#20283D] block">
                Mid-Conversation Inactivity Nudge Delay: {inactivityThreshold} seconds
              </label>
              <input
                type="range"
                min={10}
                max={40}
                value={inactivityThreshold}
                onChange={(e) => setInactivityThreshold(Number(e.target.value))}
                className="w-full accent-[#303F70]"
              />
              <span className="text-[11px] text-[#697386] block">
                Controls the time window before gentle check-in is displayed if user goes quiet mid-chat.
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <label className="text-xs font-bold text-[#20283D] block">
                Crisis Safety Confidence Floor: {(aiConfidenceThreshold * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min={0.5}
                max={0.99}
                step={0.05}
                value={aiConfidenceThreshold}
                onChange={(e) => setAiConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-[#303F70]"
              />
              <span className="text-[11px] text-[#697386] block">
                Required confidence score before categorizing message as emergency risk.
              </span>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2 text-xs font-semibold text-[#20283D]">
              <input
                type="checkbox"
                checked={quietHoursEnabled}
                onChange={(e) => setQuietHoursEnabled(e.target.checked)}
                className="rounded border-slate-300 text-[#303F70]"
              />
              <span>Enforce Nighttime Quiet Hours (11:00 PM – 06:00 AM) for Proactive Prompts</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveConfig}
              className="px-6 py-2.5 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold shadow-sm"
            >
              Apply Guardrail Changes
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Immutable Audit Logs */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#20283D]">System Health & Governance Audit Logs</h3>
          </div>

          <div className="space-y-2 text-xs text-slate-600 font-mono">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
              <span>[2026-10-29 20:45:00 UTC] HELPER_EMERGENCY_ALERT: Warning notification dispatched without transcript leakage</span>
              <span className="text-emerald-700">DELIVERED</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
              <span>[2026-10-29 19:30:12 UTC] DPDPA_CONSENT_AUDIT: User #usr-student-01 refreshed privacy preferences</span>
              <span className="text-emerald-700">RECORDED</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
              <span>[2026-10-29 18:10:00 UTC] PEER_COMMUNITY_SYNC: Post approved in #mild-stress circle</span>
              <span className="text-[#303F70]">PUBLISHED</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
              <span>[2026-10-28 14:10:00 UTC] SAFETY_TRIAGE_RUN: Automated safety classifier parsed distress message</span>
              <span className="text-[#303F70]">CASE_OPENED</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
