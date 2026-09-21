import jsPDF from 'jspdf';
import type { OnboardingSummary } from '../types';
import type { AgenticAnalysis } from './aiAgencyBrain';

/**
 * Pure data-shaping step, kept separate from jsPDF calls so it can be
 * unit tested without a DOM/canvas environment.
 */
export interface BriefSection {
    heading: string;
    lines: string[];
}

export const buildBriefSections = (
    summary: OnboardingSummary,
    analysis: AgenticAnalysis
): BriefSection[] => {
    const sections: BriefSection[] = [];

    sections.push({
        heading: 'Client Profile',
        lines: [
            `Company: ${summary.clientInfo.company || 'N/A'}`,
            `Industry: ${summary.clientInfo.industry || 'N/A'}`,
            `Contact: ${summary.clientInfo.name}${summary.clientInfo.email ? ` <${summary.clientInfo.email}>` : ''}`,
        ],
    });

    sections.push({
        heading: 'Project Overview',
        lines: [
            `Service: ${summary.projectInfo.serviceName}`,
            `Scope: ${summary.projectInfo.scope}`,
            `Timeline: ${summary.projectInfo.constraints.timeline || 'Not specified'}`,
            `Budget: ${summary.projectInfo.constraints.budget || 'To be discussed'}`,
        ],
    });

    if (summary.projectInfo.goals.length > 0) {
        sections.push({
            heading: 'Primary Objectives',
            lines: summary.projectInfo.goals.map((g) => `• ${g}`),
        });
    }

    sections.push({
        heading: `Kickoff Readiness: ${analysis.readinessLabel} (${analysis.confidenceScore}%)`,
        lines: analysis.strategicInsights.map((i) => `[${i.type.toUpperCase()}] ${i.title}: ${i.description}`),
    });

    if (summary.identifiedRisks.length > 0) {
        sections.push({
            heading: 'Identified Risks',
            lines: summary.identifiedRisks.map(
                (r) => `[${r.severity.toUpperCase()}] ${r.category}: ${r.description}${r.recommendation ? ` — ${r.recommendation}` : ''}`
            ),
        });
    }

    if (analysis.suggestedAddons.length > 0) {
        sections.push({
            heading: 'Recommended Add-ons',
            lines: analysis.suggestedAddons.map((a) => `• ${a}`),
        });
    }

    sections.push({
        heading: 'Next Steps',
        lines: summary.nextSteps.map((s) => `→ ${s}`),
    });

    return sections;
};

/**
 * Renders a branded discovery brief PDF and triggers a browser download.
 */
export const generateDiscoveryBriefPdf = (summary: OnboardingSummary, analysis: AgenticAnalysis): void => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const marginX = 56;
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 64;

    const ensureSpace = (needed: number) => {
        if (y + needed > pageHeight - 56) {
            doc.addPage();
            y = 64;
        }
    };

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Project Discovery Brief', marginX, y);
    y += 22;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text(`Generated ${new Date(summary.generatedAt).toLocaleDateString()} · Session ${summary.sessionId}`, marginX, y);
    doc.setTextColor(0);
    y += 28;

    const sections = buildBriefSections(summary, analysis);

    for (const section of sections) {
        ensureSpace(24);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text(section.heading, marginX, y);
        y += 18;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        for (const line of section.lines) {
            const wrapped = doc.splitTextToSize(line, pageWidth - marginX * 2);
            ensureSpace(wrapped.length * 14);
            doc.text(wrapped, marginX, y);
            y += wrapped.length * 14;
        }
        y += 12;
    }

    const safeCompany = (summary.clientInfo.company || 'client').replace(/[^a-z0-9]+/gi, '_');
    doc.save(`Discovery_Brief_${safeCompany}.pdf`);
};
