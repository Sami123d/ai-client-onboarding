import { describe, it, expect } from 'vitest';
import { buildBriefSections } from './pdfGenerator';
import type { OnboardingSummary } from '../types';
import type { AgenticAnalysis } from './aiAgencyBrain';

const summary: OnboardingSummary = {
    sessionId: 'session-1',
    clientInfo: { name: 'Jane Doe', email: 'jane@example.com', company: 'Acme Co', industry: 'Retail' },
    projectInfo: {
        serviceType: 'website',
        serviceName: 'Website Development',
        goals: ['Increase conversions'],
        scope: 'Marketing site',
        constraints: { timeline: '2-3 months', budget: '$10k-$20k' },
    },
    answers: [],
    identifiedRisks: [
        { category: 'timeline', severity: 'high', description: 'Tight deadline', recommendation: 'Consider an MVP' },
    ],
    nextSteps: ['Schedule kickoff call'],
    generatedAt: new Date(),
};

const analysis: AgenticAnalysis = {
    confidenceScore: 82,
    readinessLabel: 'Project Ready',
    strategicInsights: [{ title: 'SEO Retention Protocol', type: 'strategy', description: 'Preserve rankings.' }],
    suggestedAddons: ['E-commerce SEO Package'],
};

describe('buildBriefSections', () => {
    it('includes client, project, risk, and next-step sections', () => {
        const sections = buildBriefSections(summary, analysis);
        const headings = sections.map((s) => s.heading);

        expect(headings).toContain('Client Profile');
        expect(headings).toContain('Project Overview');
        expect(headings).toContain('Identified Risks');
        expect(headings).toContain('Next Steps');
    });

    it('formats risk lines with severity and recommendation', () => {
        const sections = buildBriefSections(summary, analysis);
        const riskSection = sections.find((s) => s.heading === 'Identified Risks');

        expect(riskSection?.lines[0]).toContain('[HIGH]');
        expect(riskSection?.lines[0]).toContain('Consider an MVP');
    });

    it('omits the add-ons section when there are none', () => {
        const noAddons: AgenticAnalysis = { ...analysis, suggestedAddons: [] };
        const sections = buildBriefSections(summary, noAddons);

        expect(sections.map((s) => s.heading)).not.toContain('Recommended Add-ons');
    });
});
