import { useState } from 'react';
import { 
  Sparkles, 
  Menu, 
  X, 
  ShieldAlert, 
  Languages, 
  MessageSquare, 
  HeartHandshake, 
  Activity, 
  Compass, 
  ShieldCheck,
  ChevronDown,
  TrendingUp,
  Users,
  BookOpen,
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  LogIn
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole, LanguageCode } from '../../types';
import { CrisisModal } from './CrisisModal';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export function Navbar({ currentRoute, navigate }: NavbarProps) {
  const { user, switchRole } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);
  
  // Voice Call Modal
  const [isCallingModalOpen, setIsCallingModalOpen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallMuted, setIsCallMuted] = useState(false);
  const [callStatus, setCallStatus] = useState<'CONNECTING' | 'CONNECTED' | 'ENDED'>('CONNECTING');

  const roles: { role: UserRole; label: string; route: string; badge: string }[] = [
    { role: 'STUDENT', label: 'Student / User', route: '/dashboard', badge: 'bg-emerald-50 text-emerald-700' },
    { role: 'THERAPIST', label: 'Licensed Therapist', route: '/therapist/dashboard', badge: 'bg-purple-50 text-purple-700' },
    { role: 'INSTITUTION_SAFETY_OFFICER', label: 'Safety Officer', route: '/institution/dashboard', badge: 'bg-amber-50 text-amber-700' },
    { role: 'PLATFORM_ADMIN', label: 'Platform Admin', route: '/admin', badge: 'bg-indigo-50 text-indigo-700' }
  ];

  const handleRoleSwitch = (r: UserRole, targetRoute: string) => {
    switchRole(r);
    setRoleMenuOpen(false);
    navigate(targetRoute);
  };

  const navLinks = [
    { name: t('nav.talk'), route: '/chat', icon: MessageSquare },
    { name: 'Health Record', route: '/health-records', icon: TrendingUp },
    { name: 'Peer Community', route: '/community', icon: Users },
    { name: 'Private Journal', route: '/journal', icon: BookOpen },
    { name: t('nav.screenings'), route: '/screenings', icon: Activity },
    { name: t('nav.interventions'), route: '/interventions', icon: Compass },
    { name: t('nav.therapists'), route: '/therapists', icon: HeartHandshake }
  ];

  const startVoiceCall = () => {
    setIsCallingModalOpen(true);
    setCallStatus('CONNECTING');
    setCallDuration(0);

    setTimeout(() => {
      setCallStatus('CONNECTED');
    }, 1800);
  };

  const endVoiceCall = () => {
    setCallStatus('ENDED');
    setTimeout(() => {
      setIsCallingModalOpen(false);
      setCallDuration(0);
    }, 600);
  };

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
        {/* Top Emergency Ticker */}
        <div className="bg-[#303F70] text-white py-1 px-4 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-200">24/7 Verified Support:</span>
            <span className="font-semibold text-white">Tele-MANAS (14416)</span>
            <span className="hidden sm:inline text-slate-300">| KIRAN (1800-599-0019) | USA 988</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/login')}
              className="text-slate-200 hover:text-white font-medium text-xs flex items-center space-x-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Helper Setup</span>
            </button>
            <button
              onClick={() => setCrisisModalOpen(true)}
              className="shrink-0 text-amber-200 hover:text-white underline font-semibold text-xs flex items-center space-x-1"
            >
              <ShieldAlert className="w-3.5 h-3.5 mr-0.5" />
              <span>Crisis Help</span>
            </button>
          </div>
        </div>

        {/* Main Nav - all elements aligned to the left */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center space-x-2.5 cursor-pointer select-none group shrink-0"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#303F70] to-[#A99CE0] flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold tracking-tight text-[#303F70]">
                  MindBridge<span className="text-[#A99CE0] font-black">.ai</span>
                </div>
                <div className="text-[10px] text-[#697386] font-medium tracking-wide uppercase">
                  Empathetic Early Support
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentRoute === link.route;
                return (
                  <button
                    key={link.route}
                    onClick={() => navigate(link.route)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive 
                        ? 'bg-[#303F70]/10 text-[#303F70]' 
                        : 'text-[#697386] hover:text-[#20283D] hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{link.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Action Tools: Voice Call, Language, Demo Role Switcher, Start Chat (left aligned) */}
            <div className="hidden md:flex items-center gap-2">
              {/* Direct Voice Calling Feature */}
              <button
                onClick={startVoiceCall}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-transform active:scale-95 shadow-2xs"
                title="Direct Voice Call with Counsellor"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Call Helpline</span>
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-[#20283D] hover:bg-slate-50"
                >
                  <Languages className="w-3.5 h-3.5 text-[#303F70]" />
                  <span className="hidden sm:inline uppercase font-semibold">{language}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in">
                    <button
                      onClick={() => { setLanguage('en'); setLangMenuOpen(false); }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs font-medium ${language === 'en' ? 'bg-indigo-50 text-[#303F70] font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => { setLanguage('hi'); setLangMenuOpen(false); }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs font-medium ${language === 'hi' ? 'bg-indigo-50 text-[#303F70] font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      हिंदी (Hindi)
                    </button>
                    <button
                      onClick={() => { setLanguage('hinglish'); setLangMenuOpen(false); }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs font-medium ${language === 'hinglish' ? 'bg-indigo-50 text-[#303F70] font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      Hinglish
                    </button>
                  </div>
                )}
              </div>

              {/* Demo Role Switcher Pill */}
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs font-semibold text-[#20283D] transition-colors"
                  title="Switch Role to Preview Distinct Dashboards"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span className="text-[#697386]">Role:</span>
                  <span className="text-[#303F70]">
                    {user.role === 'STUDENT' ? 'Student' : 
                     user.role === 'THERAPIST' ? 'Therapist' : 
                     user.role === 'INSTITUTION_SAFETY_OFFICER' ? 'Safety Lead' : 'Admin'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fade-in">
                    <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">
                      Switch Role (Demo Mode)
                    </div>
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => handleRoleSwitch(r.role, r.route)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          user.role === r.role ? 'bg-[#303F70] text-white font-semibold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{r.label}</span>
                        {user.role === r.role && <ShieldCheck className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Start Chat CTA */}
              <button
                onClick={() => navigate('/chat')}
                className="px-3.5 py-1.5 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-semibold shadow-sm transition-transform active:scale-95 flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#A99CE0]" />
                <span className="hidden sm:inline">Talk to AI</span>
              </button>
            </div>

            {/* Mobile menu toggle (kept in left flow; opens left drawer) */}
            <div className="flex xl:hidden items-center gap-2">
              <button
                onClick={startVoiceCall}
                className="p-2 rounded-xl bg-emerald-50 text-emerald-700"
                aria-label="Direct Call"
              >
                <Phone className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.route}
                    onClick={() => { navigate(link.route); setMobileMenuOpen(false); }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Icon className="w-4 h-4 text-[#303F70]" />
                    <span>{link.name}</span>
                  </button>
                );
              })}
              <button
                onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ShieldCheck className="w-4 h-4 text-[#303F70]" />
                <span>Admin Dashboard</span>
              </button>
              <button
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <LogIn className="w-4 h-4 text-[#303F70]" />
                <span>Sign In & Helper Setup</span>
              </button>
            </div>

            {/* Role switch in mobile */}
            <div className="pt-3 border-t border-slate-100">
              <div className="text-xs font-semibold text-[#697386] mb-2">Switch View (Role Testing):</div>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => { handleRoleSwitch(r.role, r.route); setMobileMenuOpen(false); }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border ${
                      user.role === r.role ? 'bg-[#303F70] text-white border-[#303F70]' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Language:</span>
              <div className="flex space-x-1.5">
                {(['en', 'hi', 'hinglish'] as LanguageCode[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2.5 py-1 rounded-lg text-xs uppercase font-bold ${
                      language === lang ? 'bg-[#303F70] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Live Voice Audio Call Modal */}
      {isCallingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
          <div className="bg-gradient-to-b from-[#303F70] to-[#202b4d] text-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-[#A99CE0]/20 animate-ping"></div>
              <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mx-auto shadow-inner">
                <PhoneCall className={`w-10 h-10 ${callStatus === 'CONNECTED' ? 'text-emerald-400' : 'text-[#A99CE0] animate-pulse'}`} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold">
                {callStatus === 'CONNECTING' ? 'Connecting Direct Voice Helpline...' : 'MindBridge Voice Support'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {callStatus === 'CONNECTING' 
                  ? 'Connecting to on-duty licensed counsellor...' 
                  : 'Connected with On-Duty Counsellor Dr. Sarah Patel'}
              </p>
              {callStatus === 'CONNECTED' && (
                <div className="mt-2 text-2xl font-mono font-bold text-emerald-400">
                  {formatCallTime(callDuration)}
                </div>
              )}
            </div>

            {/* Sound Wave Animation */}
            {callStatus === 'CONNECTED' && (
              <div className="flex items-center justify-center space-x-1.5 h-10">
                {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                  <div
                    key={bar}
                    className="w-1.5 bg-[#64B6AC] rounded-full animate-pulse"
                    style={{
                      height: `${20 + (bar % 3) * 16}px`,
                      animationDelay: `${bar * 0.15}s`
                    }}
                  ></div>
                ))}
              </div>
            )}

            <div className="pt-4 flex items-center justify-center space-x-4">
              <button
                onClick={() => setIsCallMuted(!isCallMuted)}
                className={`p-4 rounded-full transition-all ${
                  isCallMuted ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={isCallMuted ? 'Unmute' : 'Mute'}
              >
                {isCallMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              <button
                onClick={endVoiceCall}
                className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-transform active:scale-95"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verified Crisis Modal */}
      <CrisisModal isOpen={crisisModalOpen} onClose={() => setCrisisModalOpen(false)} />
    </>
  );
}
