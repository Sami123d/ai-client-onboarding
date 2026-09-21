import { describe, it, expect } from 'vitest';
import { aiAgencyBrain } from './aiAgencyBrain';
import type { OnboardingSummary } from '../types';

const baseSummary = (overrides: Partial<OnboardingSummary> = {}): OnboardingSummary => ({
    sessionId: 'test-session',
    clientInfo: { name: 'Jane Doe', email: 'jane@example.com', company: 'Acme Co', industry: 'Retail' },
    projectInfo: {
        serviceType: 'website',
        serviceName: 'Website Development',
        goals: ['Increase conversions'],
        scope: 'Marketing site',
        constraints: { timeline: '2-3 months', budget: 'To be discussed' },
    },
    answers: [{ questionId: 'challenges', value: 'We need better SEO and faster load times', timestamp: new Date() }],
    identifiedRisks: [],
    nextSteps: [],
    generatedAt: new Date(),
    ...overrides,
});

describe('aiAgencyBrain.analyzeProject', () => {
    it('returns a high confidence score for a well-defined project', () => {
        const result = aiAgencyBrain.analyzeProject(baseSummary());
        expect(result.confidenceScore).toBeGreaterThan(70);
        expect(result.readinessLabel).toBe('Project Ready');
    });

    it('flags e-commerce projects with an inventory strategy insight and lowers score', () => {
        const summary = baseSummary({
            answers: [
                { questionId: 'website-type', value: 'E-commerce store', timestamp: new Date() },
                { questionId: 'challenges', value: 'We need better SEO and faster load times', timestamp: new Date() },
            ],
        });

        const result = aiAgencyBrain.analyzeProject(summary);

        expect(result.strategicInsights.some((i) => i.title === 'Inventory Sync Strategy')).toBe(true);
        expect(result.suggestedAddons).toContain('E-commerce SEO Package');
    });

    it('lowers confidence and requests deep discovery when challenges are unclear', () => {
        const summary = baseSummary({ answers: [] });

        const result = aiAgencyBrain.analyzeProject(summary);

        expect(result.strategicInsights.some((i) => i.title === 'Deep Discovery Needed')).toBe(true);
        expect(result.confidenceScore).toBeLessThan(85);
    });

    it('never returns a negative confidence score', () => {
        const summary = baseSummary({
            answers: [
                { questionId: 'content-ready', value: 'No, we need help creating content', timestamp: new Date() },
            ],
        });

        const result = aiAgencyBrain.analyzeProject(summary);

        expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    });
});
