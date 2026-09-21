import React, { useState, useMemo } from 'react';
import type { ServiceFlow, Answer, OnboardingSession } from '../types';
import QuestionRenderer from './QuestionRenderer';
import './OnboardingWizard.css';

interface OnboardingWizardProps {
    flow: ServiceFlow;
    session: OnboardingSession;
    onUpdateSession: (session: OnboardingSession) => void;
    onComplete: (session: OnboardingSession) => void;
    onCancel: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
    flow,
    session,
    onUpdateSession,
    onComplete,
    onCancel,
}) => {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(session.currentSectionIndex);
    const [answers, setAnswers] = useState<Record<string, any>>(
        session.answers.reduce((acc, curr) => ({ ...acc, [curr.questionId]: curr.value }), {})
    );

    const currentSection = flow.sections[currentSectionIndex];

    // Helper to check if a question should be shown based on conditional logic
    const shouldShowQuestion = (question: any) => {
        if (!question.conditionalOn) return true;
        const { questionId, value } = question.conditionalOn;
        const dependentValue = answers[questionId];

        if (Array.isArray(value)) {
            return value.includes(dependentValue);
        }
        return dependentValue === value;
    };

    const visibleQuestions = useMemo(() => {
        return currentSection.questions.filter(shouldShowQuestion);
    }, [currentSection, answers]);

    const handleAnswerChange = (questionId: string, value: any) => {
        const newAnswers = { ...answers, [questionId]: value };
        setAnswers(newAnswers);

        // Update session state
        const updatedAnswers: Answer[] = Object.entries(newAnswers).map(([qId, val]) => ({
            questionId: qId,
            value: val,
            timestamp: new Date(),
        }));

        onUpdateSession({
            ...session,
            answers: updatedAnswers,
            lastUpdatedAt: new Date(),
        });
    };

    const handleNextSection = () => {
        if (currentSectionIndex < flow.sections.length - 1) {
            const nextIndex = currentSectionIndex + 1;
            setCurrentSectionIndex(nextIndex);
            onUpdateSession({
                ...session,
                currentSectionIndex: nextIndex,
                lastUpdatedAt: new Date(),
            });
            window.scrollTo(0, 0);
        } else {
            onComplete({
                ...session,
                status: 'completed',
                completedAt: new Date(),
            });
        }
    };

    const handlePrevSection = () => {
        if (currentSectionIndex > 0) {
            const prevIndex = currentSectionIndex - 1;
            setCurrentSectionIndex(prevIndex);
            onUpdateSession({
                ...session,
                currentSectionIndex: prevIndex,
                lastUpdatedAt: new Date(),
            });
            window.scrollTo(0, 0);
        } else {
            onCancel();
        }
    };

    const progress = Math.round(((currentSectionIndex) / flow.sections.length) * 100);

    return (
        <div className="onboarding-wizard container container-sm fade-in">
            <div className="wizard-header">
                <div className="header-top">
                    <button className="btn-back" onClick={handlePrevSection}>
                        {currentSectionIndex === 0 ? '← Exit' : '← Back'}
                    </button>
                    <span className="step-count">Section {currentSectionIndex + 1} of {flow.sections.length}</span>
                </div>
                <h1>{currentSection.title}</h1>
                {currentSection.description && <p className="section-desc">{currentSection.description}</p>}
                <div className="progress-container">
                    <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="progress-text">{progress}% Complete</span>
                </div>
            </div>

            <div className="wizard-content glass-card">
                {visibleQuestions.map((question) => (
                    <QuestionRenderer
                        key={question.id}
                        question={question}
                        value={answers[question.id]}
                        onChange={(value) => handleAnswerChange(question.id, value)}
                    />
                ))}

                <div className="wizard-footer">
                    <button
                        className="btn btn-primary btn-next"
                        onClick={handleNextSection}
                    >
                        {currentSectionIndex === flow.sections.length - 1 ? 'Finish & Generate Summary' : 'Next Section →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;
