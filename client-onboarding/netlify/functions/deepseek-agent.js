const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { type, summary, messages: chatMessages } = JSON.parse(event.body);
    const DEEPSEEK_KEY = process.env.VITE_DEEPSEEK_API_KEY;

    if (!DEEPSEEK_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'DeepSeek API Key not configured on Netlify' })
        };
    }

    let systemPrompt = 'You are a highly skilled digital agency strategist and discovery agent.';
    let apiMessages = [];

    if (type === 'chat') {
        systemPrompt = `You are a professional Project Strategist for a digital agency. 
        You are in a live chat with a colleague or client who just finished onboarding for a ${summary.projectInfo.serviceType} project.
        
        PROJECT CONTEXT:
        Company: ${summary.clientInfo.company}
        Goals: ${summary.projectInfo.goals.join(', ')}
        Scope: ${summary.projectInfo.scope}
        
        Use this context to provide high-end, expert advice. Be concise but insightful.`;
        apiMessages = [
            { role: 'system', content: systemPrompt },
            ...chatMessages
        ];
    } else {
        let prompt = '';
        if (type === 'analysis') {
            prompt = `Analyze this project as a senior agency strategist:
          Company: ${summary.clientInfo.company}
          Service: ${summary.projectInfo.serviceName}
          Scope: ${summary.projectInfo.scope}
          Please provide a strategic executive summary and 3 key challenges. Use professional Markdown.`;
        } else if (type === 'estimation') {
            prompt = `Provide a project cost estimate as a JSON object:
          { "minBudget": number, "maxBudget": number, "estimatedHours": number, "rationale": "string", "currency": "USD" }
          Project details: ${summary.projectInfo.serviceName}, Scope: ${summary.projectInfo.scope}`;
        }
        apiMessages = [
            { role: 'system', content: 'You are an agentic project discovery specialist.' },
            { role: 'user', content: prompt }
        ];
    }

    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_KEY.trim()}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: apiMessages,
                response_format: type === 'estimation' ? { type: 'json_object' } : undefined
            })
        });

        const data = await response.json();
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
