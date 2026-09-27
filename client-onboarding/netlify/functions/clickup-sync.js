export const handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { summary } = JSON.parse(event.body);
    const CLICKUP_KEY = process.env.VITE_CLICKUP_API_KEY;
    const LIST_ID = process.env.VITE_CLICKUP_LIST_ID;

    if (!CLICKUP_KEY || !LIST_ID) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Backend API Keys not configured on Netlify' })
        };
    }

    // Format Description (Moved logic to backend for security)
    let description = `# 🚀 New Onboarding: ${summary.clientInfo.company}\n\n`;
    description += `**Service:** ${summary.projectInfo.serviceName}\n`;
    description += `**Scope:** ${summary.projectInfo.scope}\n`;
    description += `**Budget:** ${summary.projectInfo.constraints.budget}\n`;

    try {
        const response = await fetch(`https://api.clickup.com/api/v2/list/${LIST_ID}/task`, {
            method: 'POST',
            headers: {
                'Authorization': CLICKUP_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: `Onboarding: ${summary.clientInfo.company}`,
                description: description,
                tags: ['onboarding', summary.projectInfo.serviceType],
                status: 'to do'
            })
        });

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
