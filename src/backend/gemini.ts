// ============================================================================
// EcoTrack — Gemini AI Client (works both server-side and client-side)
// Uses NEXT_PUBLIC_GEMINI_API_KEY for client/static builds
// Falls back to mock responses when API key is missing or on error
// ============================================================================

import { getMockAssistantResponse } from './mock-data';

// Works in both server (GEMINI_API_KEY) and client/static (NEXT_PUBLIC_GEMINI_API_KEY)
const getApiKey = () =>
  (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GEMINI_API_KEY) ||
  '';

const SYSTEM_PROMPT = `You are EcoTrack AI Assistant, a friendly and knowledgeable carbon footprint advisor. Your role is to:

1. Help users understand their carbon footprint and its environmental impact
2. Provide personalized, actionable recommendations to reduce CO₂ emissions
3. Answer questions about climate change, sustainability, and eco-friendly practices
4. Celebrate progress and motivate users to keep improving

Guidelines:
- Be warm, encouraging, and non-judgmental
- Use specific numbers and comparisons to make impact tangible
- Suggest practical, everyday changes rather than extreme lifestyle overhauls
- Use emojis sparingly for friendliness
- Keep responses concise (2-4 paragraphs max)
- Reference Indian context when relevant (e.g., local transport, climate, energy sources)
- If asked about something unrelated to sustainability, gently redirect the conversation

User's context: They are tracking their daily carbon footprint across transport, food, energy, and shopping categories.`;

/**
 * Get a response from Gemini AI or fall back to mock responses.
 * Works in both SSR (server API key) and static/CSR (public API key) contexts.
 */
export async function getGeminiResponse(
  userMessage: string,
  conversationHistory: { role: string; content: string }[] = []
): Promise<string> {
  const GEMINI_API_KEY = getApiKey();

  // If no API key, use mock responses
  if (!GEMINI_API_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return getMockAssistantResponse(userMessage);
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // Build chat history in new SDK format
    const history = conversationHistory.slice(0, -1).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Try flash-lite first (higher free quota), fallback to 1.5-flash on rate limit
    const tryModel = async (modelName: string): Promise<string> => {
      const chat = ai.chats.create({
        model: modelName,
        config: { systemInstruction: SYSTEM_PROMPT },
        history,
      });
      const response = await chat.sendMessage({ message: userMessage });
      return response.text ?? getMockAssistantResponse(userMessage);
    };

    try {
      return await tryModel('gemini-2.0-flash-lite');
    } catch (rateErr: unknown) {
      const isRateLimit = rateErr instanceof Error && rateErr.message.includes('429');
      if (isRateLimit) {
        try {
          return await tryModel('gemini-1.5-flash');
        } catch {
          throw rateErr;
        }
      }
      throw rateErr;
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return getMockAssistantResponse(userMessage);
  }
}
