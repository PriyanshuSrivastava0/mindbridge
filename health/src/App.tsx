import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { ChatCompanion } from './components/chat/ChatCompanion';
import { ScreeningModule } from './components/screening/ScreeningModule';
import { TherapistDirectory } from './components/consultation/TherapistDirectory';
import { VideoConsultationRoom } from './components/consultation/VideoConsultationRoom';
import { UserDashboard } from './pages/UserDashboard';
import { JournalPage } from './pages/JournalPage';
import { HealthRecordsPage } from './pages/HealthRecordsPage';
import { CommunityPage } from './pages/CommunityPage';
import { LoginPage } from './pages/LoginPage';
import { TherapistDashboard } from './pages/TherapistDashboard';
import { InstitutionDashboard } from './pages/InstitutionDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { SafetyProtocolPage } from './pages/SafetyProtocolPage';
import { ConsentPage } from './pages/ConsentPage';
import { 
  AboutPage, 
  FeaturesPage, 
  HowItWorksPage, 
  InstitutionsPublicPage, 
  ResourcesPage, 
  PrivacyPage, 
  TermsPage 
} from './pages/PublicInfoPages';
import { InterventionsPage } from './pages/InterventionsPage';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname || '/';
      setCurrentRoute(path);

      const handlePopState = () => {
        setCurrentRoute(window.location.pathname || '/');
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderCurrentPage = () => {
    if (currentRoute === '/') return <LandingPage navigate={navigate} />;
    if (currentRoute === '/chat') return <ChatCompanion navigate={navigate} />;
    if (currentRoute === '/health-records') return <HealthRecordsPage navigate={navigate} />;
    if (currentRoute === '/community') return <CommunityPage />;
    if (currentRoute === '/journal' || currentRoute === '/dashboard/journal') return <JournalPage />;
    if (currentRoute === '/screenings') return <ScreeningModule navigate={navigate} />;
    if (currentRoute === '/interventions') return <InterventionsPage navigate={navigate} />;
    if (currentRoute === '/therapists') return <TherapistDirectory navigate={navigate} />;
    if (currentRoute === '/dashboard' || currentRoute === '/dashboard/mood') return <UserDashboard navigate={navigate} />;
    if (currentRoute === '/login') return <LoginPage navigate={navigate} />;
    if (currentRoute === '/admin') return <AdminDashboard />;
    if (currentRoute.startsWith('/consultation/')) {
      const aptId = currentRoute.replace('/consultation/', '') || 'apt-01';
      return <VideoConsultationRoom appointmentId={aptId} navigate={navigate} />;
    }
    if (currentRoute === '/therapist/dashboard') return <TherapistDashboard navigate={navigate} />;
    if (currentRoute === '/institution/dashboard') return <InstitutionDashboard />;
    if (currentRoute === '/about') return <AboutPage navigate={navigate} />;
    if (currentRoute === '/features') return <FeaturesPage navigate={navigate} />;
    if (currentRoute === '/how-it-works') return <HowItWorksPage navigate={navigate} />;
    if (currentRoute === '/institutions') return <InstitutionsPublicPage navigate={navigate} />;
    if (currentRoute === '/resources') return <ResourcesPage />;
    if (currentRoute === '/safety') return <SafetyProtocolPage />;
    if (currentRoute === '/privacy') return <PrivacyPage />;
    if (currentRoute === '/terms') return <TermsPage />;
    if (currentRoute === '/consent') return <ConsentPage />;

    // Default fallback to LandingPage
    return <LandingPage navigate={navigate} />;
  };

  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-[#F7F9FC] text-[#20283D] flex flex-col font-sans selection:bg-[#A99CE0]/30 selection:text-[#303F70]">
          <Navbar currentRoute={currentRoute} navigate={navigate} />
          <main className="flex-1">
            {renderCurrentPage()}
          </main>
          <Footer navigate={navigate} />
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
}
