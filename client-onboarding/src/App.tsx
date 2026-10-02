import { useState, useMemo, useEffect } from 'react';
import type { ServiceType, OnboardingSession } from './types';
import ServiceSelector from './components/ServiceSelector';
import OnboardingWizard from './components/OnboardingWizard';
import SummaryView from './components/SummaryView';
import { getServiceFlow } from './data';
import { generateSummary } from './utils/summaryGenerator';
import './App.css';

function App() {
  const [currentSession, setCurrentSession] = useState<OnboardingSession | null>(() => {
    const saved = localStorage.getItem('onboarding_session');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        startedAt: new Date(parsed.startedAt),
        lastUpdatedAt: new Date(parsed.lastUpdatedAt),
      };
    }
    return null;
  });

  const [selectedService, setSelectedService] = useState<ServiceType | null>(() => {
    const saved = localStorage.getItem('onboarding_session');
    return saved ? JSON.parse(saved).serviceType : null;
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Dynamic Mouse Glow Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Dynamic Theming based on service
  useEffect(() => {
    // Accents tuned for contrast on the light theme
    if (selectedService === 'branding') {
      document.documentElement.style.setProperty('--color-primary', '#7C3AED');
      document.documentElement.style.setProperty('--color-accent', '#DB2777');
    } else if (selectedService === 'automation') {
      document.documentElement.style.setProperty('--color-primary', '#0D9488');
      document.documentElement.style.setProperty('--color-accent', '#0284C7');
    } else {
      document.documentElement.style.setProperty('--color-primary', '#4F46E5');
      document.documentElement.style.setProperty('--color-accent', '#7C3AED');
    }
  }, [selectedService]);

  // Persist session to localStorage
  useEffect(() => {
    if (currentSession) {
      localStorage.setItem('onboarding_session', JSON.stringify(currentSession));
    } else if (!isCompleted) {
      localStorage.removeItem('onboarding_session');
    }
  }, [currentSession, isCompleted]);

  const handleSelectService = (serviceType: ServiceType) => {
    setSelectedService(serviceType);
    setIsCompleted(false);

    const newSession: OnboardingSession = {
      id: `session-${Date.now()}`,
      serviceType,
      answers: [],
      currentSectionIndex: 0,
      currentQuestionIndex: 0,
      startedAt: new Date(),
      lastUpdatedAt: new Date(),
      status: 'in-progress',
    };

    setCurrentSession(newSession);
  };

  const handleUpdateSession = (updatedSession: OnboardingSession) => {
    setCurrentSession(updatedSession);
  };

  const handleComplete = (finalSession: OnboardingSession) => {
    setCurrentSession(finalSession);
    setIsCompleted(true);
  };

  const handleCancel = () => {
    setSelectedService(null);
    setCurrentSession(null);
    setIsCompleted(false);
    localStorage.removeItem('onboarding_session');
  };

  const summary = useMemo(() => {
    if (isCompleted && currentSession) {
      return generateSummary(currentSession);
    }
    return null;
  }, [isCompleted, currentSession]);

  return (
    <div className="app">
      <div
        className="cursor-glow"
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      ></div>

      <header className="app-header container">
        <div className="brand">
          <span className="brand-logo">❖</span>
          <span className="brand-name text-gradient">STRATAGEM AI</span>
        </div>
      </header>

      <main className="app-container">
        {!selectedService ? (
          <ServiceSelector onSelectService={handleSelectService} />
        ) : isCompleted && summary ? (
          <SummaryView
            summary={summary}
            onBack={handleCancel}
          />
        ) : selectedService && currentSession ? (
          <div className="onboarding-flow container">
            <OnboardingWizard
              flow={getServiceFlow(selectedService)}
              session={currentSession}
              onUpdateSession={handleUpdateSession}
              onComplete={handleComplete}
              onCancel={handleCancel}
            />
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default App;
