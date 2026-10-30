import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, LanguageCode } from '../types';
import { db } from '../services/db/mockDatabase';

interface AuthContextType {
  user: User;
  switchRole: (role: UserRole) => void;
  signIn: (email: string) => boolean;
  setUserLanguage: (lang: LanguageCode) => void;
  logout: () => void;
  updateConsentSettings: (settings: Partial<NonNullable<User['consentSettings']>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(db.currentUser);

  const switchRole = (role: UserRole) => {
    let target = db.users.find(u => u.role === role);
    if (!target) {
      target = {
        id: 'usr-' + role.toLowerCase(),
        email: `${role.toLowerCase()}@mindbridge.care`,
        name: `${role.replace(/_/g, ' ')} Demo User`,
        role: role,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        preferredLanguage: 'en',
        createdAt: new Date().toISOString(),
        isVerified: true
      };
      db.users.push(target);
    }
    const switched = db.switchUser(target.id);
    setUser({ ...switched });
  };

  const signIn = (email: string): boolean => {
    const target = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!target) return false;
    const switched = db.switchUser(target.id);
    setUser({ ...switched });
    return true;
  };

  const setUserLanguage = (lang: LanguageCode) => {
    db.currentUser.preferredLanguage = lang;
    db.persist();
    setUser(prev => ({ ...prev, preferredLanguage: lang }));
  };

  const logout = () => {
    // Reset to default student
    const defaultUser = db.switchUser(db.users[0].id);
    setUser({ ...defaultUser });
  };

  const updateConsentSettings = (settings: Partial<NonNullable<User['consentSettings']>>) => {
    db.updateConsent(settings);
    setUser({ ...db.currentUser });
  };

  return (
    <AuthContext.Provider value={{ user, switchRole, signIn, setUserLanguage, logout, updateConsentSettings }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

