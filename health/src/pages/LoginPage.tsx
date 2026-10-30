import { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  User,
  Stethoscope,
  ShieldAlert,
  Building,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { UserRole } from '../types';

interface LoginPageProps {
  navigate: (route: string) => void;
}

type RoleKey = 'STUDENT' | 'THERAPIST' | 'INSTITUTION_SAFETY_OFFICER' | 'PLATFORM_ADMIN';

const ROLE_DEFAULTS: Record<RoleKey, {
  role: UserRole;
  label: string;
  icon: React.ElementType;
  email: string;
  route: string;
  color: string;
  desc: string;
}> = {
  STUDENT: {
    role: 'STUDENT',
    label: 'Student',
    icon: User,
    email: 'alex.chen@university.edu',
    route: '/dashboard',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    desc: 'Wellness support for students and learners'
  },
  THERAPIST: {
    role: 'THERAPIST',
    label: 'Licensed Therapist',
    icon: Stethoscope,
    email: 'dr.sarah.patel@mindbridge.care',
    route: '/therapist/dashboard',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    desc: 'Clinical dashboard for licensed therapists'
  },
  INSTITUTION_SAFETY_OFFICER: {
    role: 'INSTITUTION_SAFETY_OFFICER',
    label: 'Safety Officer',
    icon: ShieldAlert,
    email: 'safety.officer@university.edu',
    route: '/institution/dashboard',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    desc: 'Institution safety and escalation desk'
  },
  PLATFORM_ADMIN: {
    role: 'PLATFORM_ADMIN',
    label: 'Platform Admin',
    icon: Building,
    email: 'admin@mindbridge.care',
    route: '/admin',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    desc: 'Platform administration panel'
  }
};

export function LoginPage({ navigate }: LoginPageProps) {
  const { signIn } = useAuth();
  const [selectedRole, setSelectedRole] = useState<RoleKey>('STUDENT');
  const [email, setEmail] = useState(ROLE_DEFAULTS.STUDENT.email);
  const [password, setPassword] = useState('MindBridge@2024');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleRoleSelect = (role: RoleKey) => {
    setSelectedRole(role);
    setEmail(ROLE_DEFAULTS[role].email);
    setLoginError(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    // Demo-mode authentication: any password works for pre-configured default accounts.
    const ok = signIn(email);
    setIsLoggingIn(false);

    if (!ok) {
      setLoginError('No account found for this email. Please use one of the default accounts listed below.');
      return;
    }

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    navigate(ROLE_DEFAULTS[selectedRole].route);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#303F70] text-white flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-6 h-6 text-[#A99CE0]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20283D] tracking-tight">
          Sign In to MindBridge
        </h1>
        <p className="text-xs sm:text-sm text-[#697386]">
          Secure, role-based access to your MindBridge wellness dashboard.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm space-y-6">
        {/* Role Selector */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#303F70]">Sign in as</span>
            <span className="h-px flex-1 bg-slate-200"></span>
            <span className="text-xs font-semibold text-[#697386]">Choose your role</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(ROLE_DEFAULTS).map((r) => {
              const active = selectedRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => handleRoleSelect(r.role as RoleKey)}
                  className={`flex items-center space-x-3 px-3.5 py-3 rounded-2xl border transition-all text-left ${
                    active
                      ? `${r.color} shadow-sm ring-2 ring-offset-1`
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${active ? 'text-white' : 'text-slate-500'}`}>
                    <r.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${active ? 'text-[#303F70]' : 'text-slate-700'}`}>{r.label}</div>
                    <div className="text-[10px] text-[#697386]">{r.desc}</div>
                  </div>
                  <div className={`text-[10px] font-medium ${active ? 'text-white' : 'text-slate-400'}`}>
                    {r.email.split('@')[0]}…
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#20283D] block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              placeholder="e.g. alex.chen@university.edu"
              className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#303F70]/30 disabled:opacity-60"
              disabled={isLoggingIn}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#20283D] block">Password</label>
              <span className="text-[10px] text-[#697386]">Demo access enabled</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#303F70]/30 disabled:opacity-60"
              disabled={isLoggingIn}
            />
          </div>

          {loginError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700 text-xs flex items-center space-x-2 animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className={`w-full py-3.5 rounded-2xl text-white text-sm font-bold shadow-md transition-transform active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed ${
              isLoggingIn
                ? 'bg-slate-400'
                : 'bg-[#303F70] hover:bg-[#202b4d]'
            }`}
          >
            {isLoggingIn ? (
              <>
                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in…
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In & Enter Dashboard
              </>
            )}
          </button>
        </form>

        {/* Default credentials hint */}
        <div className="rounded-xl border border-slate-200 bg-[#F7F9FC]/50 p-3 space-y-2">
          <div className="flex items-center space-x-2 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#303F70] shrink-0" />
            <span className="font-semibold text-[#20283D]">Default access accounts (pre-configured)</span>
          </div>
          <div className="text-[11px] text-[#697386] space-y-1">
            <div className="flex justify-between"><span className="font-medium text-slate-600">Student:</span> <span className="font-mono text-slate-400">alex.chen@university.edu</span></div>
            <div className="flex justify-between"><span className="font-medium text-slate-600">Therapist:</span> <span className="font-mono text-slate-400">dr.sarah.patel@mindbridge.care</span></div>
            <div className="flex justify-between"><span className="font-medium text-slate-600">Safety Officer:</span> <span className="font-mono text-slate-400">safety.officer@university.edu</span></div>
            <div className="flex justify-between"><span className="font-medium text-slate-600">Platform Admin:</span> <span className="font-mono text-slate-400">admin@mindbridge.care</span></div>
            <div className="flex justify-between"><span className="font-medium text-slate-600">Password (all accounts):</span> <span className="font-mono text-slate-400">MindBridge@2024</span></div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#697386]">
          <div className="flex items-center space-x-1.5 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DPDPA 2023 Compliant</span>
          </div>
          <button onClick={() => navigate('/')} className="hover:text-[#303F70] hover:underline">Back to Home</button>
        </div>
      </div>
    </div>
  );
}
