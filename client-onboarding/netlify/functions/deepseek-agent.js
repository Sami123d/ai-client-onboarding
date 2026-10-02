export const handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { type, summary, messages: chatMessages } = JSON.parse(event.body);
    // Provider selection: Gemini (free tier, OpenAI-compatible endpoint) if
    // GEMINI_API_KEY is set, otherwise DeepSeek.
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    const DEEPSEEK_KEY = process.env.VITE_DEEPSEEK_API_KEY;
    const useGemini = Boolean(GEMINI_KEY);
    const API_KEY = useGemini ? GEMINI_KEY : DEEPSEEK_KEY;
    const API_URL = useGemini
        ? 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
        : 'https://api.deepseek.com/chat/completions';
    const MODEL = process.env.LLM_MODEL || (useGemini ? 'gemini-flash-latest' : 'deepseek-chat');

    if (!API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'No AI key configured on Netlify (set GEMINI_API_KEY or VITE_DEEPSEEK_API_KEY)' })
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
        // On the Gemini free tier the main model can be overloaded (503) or
        // rate limited (429); fall back to the lighter model on the same key.
        const models = useGemini
            ? [MODEL, process.env.LLM_FALLBACK_MODEL || 'gemini-flash-lite-latest']
            : [MODEL];
        let response, data;
        for (const model of models) {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY.trim()}`
                },
                body: JSON.stringify({
                    model,
                    messages: apiMessages,
                    response_format: type === 'estimation' ? { type: 'json_object' } : undefined
                })
            });
            data = await response.json();
            if (response.ok || ![429, 500, 503].includes(response.status)) break;
        }
        if (!response.ok || !data.choices?.[0]?.message) {
            const msg = (Array.isArray(data) ? data[0]?.error?.message : data?.error?.message) || `AI provider returned ${response.status}`;
            return {
                statusCode: 502,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: msg })
            };
        }
        // Some models wrap JSON in ```json fences; the client JSON.parses this field.
        if (type === 'estimation') {
            const raw = data.choices[0].message.content || '';
            const match = raw.match(/\{[\s\S]*\}/);
            if (match) data.choices[0].message.content = match[0];
        }
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
