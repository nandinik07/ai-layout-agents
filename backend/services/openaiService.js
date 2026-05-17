import fetch from 'node-fetch';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt.js';

export const processChatRequest = async (
  userMessage,
  history,
  currentLayout
) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('API KEY is not set in backend/.env');
    }

    // Keep recent history
    const recentHistory = history
      .slice(-6)
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));

    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      ...recentHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    // Call GROQ API
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages,
          temperature: 0.1,
          response_format: {
            type: 'json_object'
          }
        })
      }
    );

    // Handle HTTP errors
    if (!response.ok) {
      const errorText = await response.text();

      console.error('GROQ API ERROR:', errorText);

      throw new Error(
        `Groq API request failed with status ${response.status}`
      );
    }

    const data = await response.json();

    // Validate AI response
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      console.error('INVALID RESPONSE:', data);

      throw new Error('No response content from AI');
    }

    // Parse JSON safely
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('RAW AI RESPONSE:', content);

      throw new Error('AI did not return valid JSON');
    }

  } catch (err) {
    console.error('FULL ERROR:', err);
    throw err;
  }
};