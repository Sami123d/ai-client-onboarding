import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handler } from '../netlify/functions/send-summary-email.js';

const summary = {
    clientInfo: { name: 'Jane', company: 'Acme <script>', email: 'jane@example.com' },
    projectInfo: { serviceName: 'Website', scope: 'Marketing site', constraints: { timeline: '6 weeks' } },
    identifiedRisks: [{ severity: 'high', category: 'Timeline', description: 'Tight <b>deadline</b>' }],
    nextSteps: ['Kickoff call'],
};

const post = (body) => ({ httpMethod: 'POST', body: JSON.stringify(body) });

describe('send-summary-email Netlify function', () => {
    beforeEach(() => {
        process.env.RESEND_API_KEY = 'test-key';
        process.env.AGENCY_TEAM_EMAIL = 'team@example.com';
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        delete process.env.RESEND_API_KEY;
        delete process.env.AGENCY_TEAM_EMAIL;
    });

    it('rejects non-POST requests', async () => {
        const res = await handler({ httpMethod: 'GET' });
        expect(res.statusCode).toBe(405);
    });

    it('returns 500 when RESEND_API_KEY is missing', async () => {
        delete process.env.RESEND_API_KEY;
        const res = await handler(post({ summary, recipientType: 'team' }));
        expect(res.statusCode).toBe(500);
    });

    it('returns 400 for a body without a summary', async () => {
        const res = await handler(post({ recipientType: 'team' }));
        expect(res.statusCode).toBe(400);
    });

    it('sends to the team address via Resend with escaped HTML', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 'email_123' }) });
        vi.stubGlobal('fetch', fetchMock);

        const res = await handler(post({ summary, recipientType: 'team' }));

        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.body)).toEqual({ success: true, id: 'email_123' });
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe('https://api.resend.com/emails');
        expect(init.headers.Authorization).toBe('Bearer test-key');
        const payload = JSON.parse(init.body);
        expect(payload.to).toEqual(['team@example.com']);
        expect(payload.html).toContain('Acme &lt;script&gt;');
        expect(payload.html).not.toContain('<script>');
        expect(payload.html).toContain('Tight &lt;b&gt;deadline&lt;/b&gt;');
    });

    it('passes through Resend API errors', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 422, json: async () => ({ message: 'bad from' }) }));
        const res = await handler(post({ summary, recipientType: 'team' }));
        expect(res.statusCode).toBe(422);
        expect(JSON.parse(res.body).error).toBe('bad from');
    });
});
