import type { OnboardingSession, OnboardingSummary, IdentifiedRisk } from '../types';
import { getServiceFlow } from '../data';

/**
 * Generates a structured summary from an onboarding session
 */
export const generateSummary = (session: OnboardingSession): OnboardingSummary => {
    const flow = getServiceFlow(session.serviceType);
    const answersMap = session.answers.reduce((acc, curr) => ({ ...acc, [curr.questionId]: curr.value }), {} as Record<string, any>);

    // Detect Risks
    const risks: IdentifiedRisk[] = [];

    // Timeline Risk
    const timelineAnswer = answersMap['desired-timeline'];
    if (timelineAnswer === 'ASAP (within 2-4 weeks)' || timelineAnswer === 'ASAP (within 2-3 weeks)') {
        risks.push({
            category: 'timeline',
            severity: 'high',
            description: 'The requested timeline is very tight and may not allow for full discovery or testing.',
            recommendation: 'Verify if a staged rollout or MVP is possible within this timeframe.',
        });
    }

    // Content Risk
    const contentReady = answersMap['content-ready'];
    if (contentReady === 'No, we need help creating content' || contentReady === 'Partially ready') {
        risks.push({
            category: 'scope',
            severity: 'medium',
            description: 'Content creation can often be a major cause of project delays.',
            recommendation: 'Clearly define who is responsible for copy, assets, and media by Week 1.',
        });
    }

    // Budget/Clarity Risk (Generic)
    if (answersMap['challenges']) {
        risks.push({
            category: 'clarity',
            severity: 'low',
            description: 'Client identified specific challenges or concerns that need deep diving.',
            recommendation: 'Address the mentioned challenges early in the first discovery call.',
        });
    }

    // Extract Goals
    const goals: string[] = [];
    if (answersMap['primary-goal']) goals.push(answersMap['primary-goal'] as string);
    if (answersMap['branding-goal']) goals.push(answersMap['branding-goal'] as string);

    return {
        sessionId: session.id,
        clientInfo: {
            name: (answersMap['company-name'] as string) || 'Valued Client',
            email: (answersMap['client-email'] as string) || '',
            company: answersMap['company-name'] as string,
            industry: answersMap['industry'] as string,
        },
        projectInfo: {
            serviceType: session.serviceType,
            serviceName: flow.serviceName,
            goals: goals,
            scope: (answersMap['website-type'] as string) || (answersMap['automation-types'] as string[])?.join(', ') || 'Custom Solution',
            constraints: {
                timeline: answersMap['desired-timeline'] as string,
                budget: 'To be discussed',
            },
        },
        answers: session.answers,
        identifiedRisks: risks,
        nextSteps: [
            'Review the generated summary internally.',
            'Schedule a follow-up 30-minute deep dive call.',
            'Refine the budget and technical constraints.',
        ],
        generatedAt: new Date(),
    };
};
