import type { OnboardingSummary } from '../types';

export interface AIInsight {
    title: string;
    type: 'strategy' | 'upsell' | 'efficiency';
    description: string;
}

export interface AgenticAnalysis {
    confidenceScore: number;
    readinessLabel: string;
    strategicInsights: AIInsight[];
    suggestedAddons: string[];
}

/**
 * AI Agency Brain - An agentic service that provides strategic analysis
 * of project requirements.
 */
export const aiAgencyBrain = {
    analyzeProject: (summary: OnboardingSummary): AgenticAnalysis => {
        const answers = summary.answers.reduce((acc, curr) => ({ ...acc, [curr.questionId]: curr.value }), {} as Record<string, any>);
        const insights: AIInsight[] = [];
        const addons: string[] = [];
        let score = 85; // Base confidence

        // Analyze service-specific logic
        if (summary.projectInfo.serviceType === 'website') {
            if (answers['website-type'] === 'E-commerce store') {
                insights.push({
                    title: 'Inventory Sync Strategy',
                    type: 'strategy',
                    description: 'Since this is an E-commerce project, we recommend an automated inventory sync between the website and your warehouse/ERP to prevent stock discrepancies.'
                });
                addons.push('E-commerce SEO Package', 'Payment Gateway Optimization');
                score -= 5; // Higher complexity reduces kickoff readiness
            }

            if (answers['existing-website']?.includes('redesign')) {
                insights.push({
                    title: 'SEO Retention Protocol',
                    type: 'strategy',
                    description: 'A redesign poses risks to your current search rankings. We will implement a 301 redirect map as a priority during development.'
                });
            }
        }

        if (summary.projectInfo.serviceType === 'automation') {
            insights.push({
                title: 'Scalability Audit',
                type: 'efficiency',
                description: 'Your desired automations suggest a high volume of data. We recommend building on a modular framework (like Make or custom Node.js) to allow for future API additions.'
            });
            addons.push('Custom Dashboard Development', 'Advanced Error Logging Service');
        }

        // Logic based on clarity
        if (!answers['challenges'] || answers['challenges'].length < 10) {
            insights.push({
                title: 'Deep Discovery Needed',
                type: 'strategy',
                description: 'The lack of defined challenges suggests the client might not be fully aware of technical obstacles. Recommend a 60-minute deep-dive workshops.'
            });
            score -= 10;
        }

        // Logic based on content
        if (answers['content-ready'] === 'No, we need help creating content') {
            addons.push('UGC Content Strategy', 'Professional Copywriting');
            score -= 15;
        }

        const readinessLabel = score > 80 ? 'Project Ready' : score > 60 ? 'Ready with Caveats' : 'Requires Workshop';

        return {
            confidenceScore: Math.max(score, 0),
            readinessLabel,
            strategicInsights: insights,
            suggestedAddons: [...new Set(addons)]
        };
    }
};
