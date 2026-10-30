import { useState } from 'react';
import {
  MessageSquare, TrendingUp, Users, BookOpen, Activity, Compass, HeartHandshake,
  Phone, Languages, Settings, LogOut, ChevronLeft, ChevronRight, User, Menu, X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';
import { CrisisModal } from './CrisisModal';

interface SidebarProps { currentRoute: string; navigate: (route: string) => void; }

const roles: { role: UserRole; label: string; route: string }[] = [
  { role: 'STUDENT', label: 'Student / User', route: '/dashboard' },
  { role: 'THERAPIST', label: 'Licensed Therapist', route: '/therapist/dashboard' },
  { role: 'INSTITUTION_SAFETY_OFFICER', label: 'Safety Officer', route: '/institution/dashboard' },
  { role: 'PLATFORM_ADMIN', label: 'Platform Admin', route: '/admin' }
];

export function Sidebar({ currentRoute, navigate }: SidebarProps) {
  const { user, switchRole, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [crisisOpen, setCrisisOpen] = useState(false);

  const handleRoleSwitch = (r: UserRole, targetRoute: string) => {
    switchRole(r); setRoleMenuOpen(false); navigate(targetRoute); setMobileOpen(false);
  };

  const NavItem = ({ name, route, icon: Icon }: { name: string; route: string; icon: any }) => {
    const active = currentRoute === route;
    return (
      <button onClick={() => { navigate(route); setMobileOpen(false); }}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          active ? 'bg-[#303F70] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-[#303F70]'
        } ${collapsed ? 'justify-center' : ''}`} title={collapsed ? name : undefined}>
        <Icon className="w-5 h-5 shrink-0" />
        {!collapsed && <span className="truncate">{name}</span>}
      </button>
    );
  };

  const SectionLabel = ({ label }: { label: string }) => (
    !collapsed ? <p className="px-3 mt-4 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      : <div className="my-2 border-t border-slate-100" />
  );

  const content = (
    <div className="flex flex-col h-full relative">
      <div className={`flex items-center gap-2 px-3 py-4 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-[#303F70] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-[#A99CE0]" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-bold text-[#303F70] text-sm leading-tight">MindBridge.ai</p>
            <p className="text-[10px] text-slate-500 truncate">Empathetic Early Support</p>
          </div>
        )}
      </div>

      <button onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 rounded-full bg-white border border-slate-200 items-center justify-center text-slate-500 hover:text-[#303F70] shadow-sm"
        aria-label="Toggle sidebar">
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <nav className="flex-1 overflow-y-auto px-2 pb-2">
        <SectionLabel label="Main Menu" />
        <NavItem name={t('nav.talk')} route="/chat" icon={MessageSquare} />
        <NavItem name="Health Record" route="/health-records" icon={TrendingUp} />
        <NavItem name="Peer Community" route="/community" icon={Users} />
        <NavItem name="Private Journal" route="/journal" icon={BookOpen} />

        <SectionLabel label="Wellness" />
        <NavItem name={t('nav.screenings')} route="/screenings" icon={Activity} />
        <NavItem name={t('nav.interventions')} route="/interventions" icon={Compass} />
        <NavItem name={t('nav.therapists')} route="/therapists" icon={HeartHandshake} />

        <SectionLabel label="Support" />
        <button onClick={() => { setCrisisOpen(true); setMobileOpen(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Call Helpline' : undefined}>
          <Phone className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Call Helpline</span>}
        </button>
      </nav>

      <div className="px-2 pt-2 border-t border-slate-100 space-y-1">
        <div className="relative">
          <button onClick={() => setLangMenuOpen(!langMenuOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all ${collapsed ? 'justify-center' : ''}`}>
            <Languages className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate">{language.toUpperCase()}</span>}
          </button>
          {langMenuOpen && (
            <div className={`absolute bottom-12 ${collapsed ? 'left-12' : 'left-0'} bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-50 min-w-[120px]`}>
              {(['en','hi','hinglish'] as const).map((l) => (
                <button key={l} onClick={() => { setLanguage(l); setLangMenuOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${language === l ? 'bg-[#303F70] text-white' : 'hover:bg-slate-100 text-slate-700'}`}>
                  {l === 'en' ? 'English' : l === 'hi' ? 'Hindi' : 'Hinglish'}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={`flex items-center gap-3 px-3 py-2.5 ${collapsed ? 'justify-center' : ''}`}>
          <img src={user.avatarUrl || 'https://i.pravatar.cc/40'} alt={user.name} className="w-8 h-8 rounded-full border border-slate-200 shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#20283D] truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.role.replace(/_/g,' ')}</p>
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all ${collapsed ? 'justify-center' : ''}`}>
            <User className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Switch Role</span>}
          </button>
          {roleMenuOpen && (
            <div className={`absolute bottom-12 ${collapsed ? 'left-12' : 'left-0'} bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-50 min-w-[200px]`}>
              {roles.map((r) => (
                <button key={r.role} onClick={() => handleRoleSwitch(r.role, r.route)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${user.role === r.role ? 'bg-[#303F70] text-white' : 'hover:bg-slate-100 text-slate-700'}`}>
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <NavItem name="Settings" route="/dashboard" icon={Settings} />
        <button onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <CrisisModal isOpen={crisisOpen} onClose={() => setCrisisOpen(false)} />
    </div>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-xl bg-white border border-slate-200 shadow-sm text-[#303F70]"
        aria-label="Open menu">
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 bg-white h-full shadow-2xl overflow-hidden">
            <button onClick={() => setMobileOpen(false)} className="absolute top-3 right-3 p-2 rounded-xl hover:bg-slate-100 text-slate-500">
              <X className="w-5 h-5" />
            </button>
            {content}
          </aside>
        </div>
      )}

      <aside className={`hidden lg:flex relative flex-col bg-white border-r border-slate-100 transition-all duration-300 shrink-0 ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}>
        {content}
      </aside>
    </>
  );
}
