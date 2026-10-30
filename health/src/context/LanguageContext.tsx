import { createContext, useContext, useState, ReactNode } from 'react';
import { LanguageCode } from '../types';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    'brand.title': 'MindBridge AI',
    'brand.tagline': 'You Don’t Have to Figure It Out Alone.',
    'nav.talk': 'AI Companion',
    'nav.screenings': 'Wellness Screening',
    'nav.interventions': 'Self-Help Interventions',
    'nav.therapists': 'Find Therapists',
    'nav.dashboard': 'Dashboard',
    'nav.resources': 'Resources',
    'nav.crisis': 'Emergency Crisis Helpline: 14416 (India 24/7) | 988 (USA)',
    'disclaimer.non_diagnostic': 'MindBridge AI is an early-support and clinical-referral platform, not a diagnostic system, emergency responder, or replacement for professional clinical care.',
    'chat.start_conversation': 'Start a Conversation',
    'chat.placeholder': 'Type your message or share how you are feeling...',
    'chat.voice_input': 'Voice Input',
    'chat.quick_replies': 'Quick Replies',
    'btn.book_session': 'Book Consultation',
    'btn.take_screening': 'Take Confidential Screening',
    'btn.explore_exercises': 'Explore Self-Help Exercises'
  },
  hi: {
    'brand.title': 'माइंडब्रिज AI',
    'brand.tagline': 'आपको अकेले इससे जूझने की आवश्यकता नहीं है।',
    'nav.talk': 'AI साथी',
    'nav.screenings': 'कल्याण जांच',
    'nav.interventions': 'स्वयं सहायता अभ्यास',
    'nav.therapists': 'चिकित्सक खोजें',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.resources': 'संसाधन',
    'nav.crisis': 'आपातकालीन संकट हेल्पलाइन: 14416 (भारत 24/7) | 988 (अमेरिका)',
    'disclaimer.non_diagnostic': 'माइंडब्रिज AI एक प्रारंभिक सहायता और रेफरल मंच है, नैदानिक प्रणाली या आपातकालीन प्रतिक्रिया सेवा नहीं।',
    'chat.start_conversation': 'बातचीत शुरू करें',
    'chat.placeholder': 'अपना संदेश लिखें या बताएं कि आप कैसा महसूस कर रहे हैं...',
    'chat.voice_input': 'वॉइस इनपुट',
    'chat.quick_replies': 'त्वरित उत्तर',
    'btn.book_session': 'परामर्श बुक करें',
    'btn.take_screening': 'गोपनीय जांच शुरू करें',
    'btn.explore_exercises': 'कल्याण अभ्यास देखें'
  },
  hinglish: {
    'brand.title': 'MindBridge AI',
    'brand.tagline': 'You Don’t Have to Figure It Out Alone.',
    'nav.talk': 'AI Companion',
    'nav.screenings': 'Wellness Screening',
    'nav.interventions': 'Self-Help Exercises',
    'nav.therapists': 'Find Therapists',
    'nav.dashboard': 'Dashboard',
    'nav.resources': 'Resources',
    'nav.crisis': 'Emergency Helpline: 14416 (India 24/7) | 1800-599-0019',
    'disclaimer.non_diagnostic': 'MindBridge AI ek early-support aur clinical-referral tool hai, diagnostic system ya replacement for professional doctors nahi.',
    'chat.start_conversation': 'Start a Conversation',
    'chat.placeholder': 'Type your message or share what is on your mind...',
    'chat.voice_input': 'Voice Input',
    'chat.quick_replies': 'Quick Options',
    'btn.book_session': 'Book Session',
    'btn.take_screening': 'Take Screening',
    'btn.explore_exercises': 'Explore Exercises'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

