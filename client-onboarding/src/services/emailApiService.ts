import type { OnboardingSummary } from '../types';

export interface SendEmailResult {
    success: boolean;
    error?: string;
}

/**
 * Sends the summary via the secure send-summary-email Netlify Function
 * (real delivery through Resend), as opposed to emailService.ts's
 * mailto: link which only opens the user's own mail client.
 */
export const emailApiService = {
    sendSummaryEmail: async (
        summary: OnboardingSummary,
        recipientType: 'client' | 'team'
    ): Promise<SendEmailResult> => {
        try {
            const response = await fetch('/.netlify/functions/send-summary-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ summary, recipientType }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.error || 'Failed to send email' };
            }

            return { success: true };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Network error while sending email';
            return { success: false, error: message };
        }
    },
};
