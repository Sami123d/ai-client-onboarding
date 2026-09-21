import { describe, it, expect } from 'vitest';
import { generateSummary } from './summaryGenerator';
import type { OnboardingSession } from '../types';

const baseSession = (overrides: Partial<OnboardingSession> = {}): OnboardingSession => ({
    id: 'session-1',
    serviceType: 'website',
    answers: [],
    currentSectionIndex: 0,
    currentQuestionIndex: 0,
    startedAt: new Date(),
    lastUpdatedAt: new Date(),
    status: 'completed',
    ...overrides,
});

describe('generateSummary', () => {
    it('flags a high-severity timeline risk for ASAP requests', () => {
        const session = baseSession({
            answers: [{ questionId: 'desired-timeline', value: 'ASAP (within 2-4 weeks)', timestamp: new Date() }],
        });

        const summary = generateSummary(session);

        const timelineRisk = summary.identifiedRisks.find((r) => r.category === 'timeline');
        expect(timelineRisk).toBeDefined();
        expect(timelineRisk?.severity).toBe('high');
    });

    it('flags a medium scope risk when content is not ready', () => {
        const session = baseSession({
            answers: [{ questionId: 'content-ready', value: 'No, we need help creating content', timestamp: new Date() }],
        });

        const summary = generateSummary(session);

        const scopeRisk = summary.identifiedRisks.find((r) => r.category === 'scope');
        expect(scopeRisk?.severity).toBe('medium');
    });

    it('produces no risks for a clean, well-prepared session', () => {
        const session = baseSession({
            answers: [{ questionId: 'desired-timeline', value: '3-4 months', timestamp: new Date() }],
        });

        const summary = generateSummary(session);

        expect(summary.identifiedRisks).toHaveLength(0);
    });

    it('falls back to a placeholder client name when none is provided', () => {
        const summary = generateSummary(baseSession());
        expect(summary.clientInfo.name).toBe('Valued Client');
    });
});
