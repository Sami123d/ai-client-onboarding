import type { OnboardingSummary, ClickUpSyncResult } from '../types';

/**
 * ClickUp API Service (Backend Proxy Version)
 * Handles task creation by calling secure Netlify Functions
 */
export const clickUpService = {
    /**
     * Syncs the onboarding summary to ClickUp by calling the backend function
     * This keeps API keys hidden from the client browser.
     */
    syncToClickUp: async (summary: OnboardingSummary): Promise<ClickUpSyncResult> => {
        try {
            console.log('🔄 Initiating Secure ClickUp Sync via Backend...');

            const response = await fetch('/.netlify/functions/clickup-sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ summary })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Backend synchronization failed');
            }

            const data = await response.json();

            return {
                success: true,
                taskId: data.id,
                taskUrl: data.url
            };
        } catch (error: any) {
            console.error('Secure ClickUp Sync Error:', error);
            return {
                success: false,
                error: error.message || 'An unknown error occurred during sync'
            };
        }
    }
};
