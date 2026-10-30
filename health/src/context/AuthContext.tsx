import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, LanguageCode } from '../types';
import { db } from '../services/db/mockDatabase';

interface AuthContextType {
  user: User;
  switchRole: (role: UserRole) => void;
  setUserLanguage: (lang: LanguageCode) => void;
  logout: () => void;
  updateConsentSettings: (settings: Partial<NonNullable<User['consentSettings']>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(db.currentUser);

  useEffect(() => {
    setUser(db.currentUser);
  }, []);

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

  const setUserLanguage = (lang: LanguageCode) => {
    user.preferredLanguage = lang;
    db.currentUser.preferredLanguage = lang;
    db.persist();
    setUser({ ...user, preferredLanguage: lang });
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
    <AuthContext.Provider value={{ user, switchRole, setUserLanguage, logout, updateConsentSettings }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

