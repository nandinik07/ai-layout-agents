import { SYSTEM_PROMPT } from '../prompts/systemPrompt.js';

export const processChatRequest = async (userMessage, history, currentLayout) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set in backend/.env");

  // Keep recent history (last 6 messages) for context handling ("Make *it* smaller")
  const recentHistory = history.slice(-6).map(msg => ({ 
    role: msg.role, 
    content: msg.content 
  }));

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...recentHistory,
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: "json_object" },
        messages: messages,
        temperature: 0.1
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    return JSON.parse(data.choices[0].message.content);
  } catch (err) {
    console.error("OpenAI API Error:", err);
    throw err;
  }
};