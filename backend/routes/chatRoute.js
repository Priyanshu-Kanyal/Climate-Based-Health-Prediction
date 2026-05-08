import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
    }

    // Build context-aware prompt
    let systemPrompt = 'You are a medical assistant trained on diseases and precautionary measures. Answer helpfully and factually, without giving prescriptions. ';
    
    if (context && context.prediction) {
      const { prediction, location, weather, language } = context;
      const locationName = location?.locationName || location?.cityVillage || 'the user\'s location';
      const stateName = location?.state || '';
      const langName = language?.name || 'English';
      const langNative = language?.native || 'English';
      const category = prediction?.category || 'Unknown';
      const features = prediction?.features || {};
      
      systemPrompt += `\n\nIMPORTANT CONTEXT (ALWAYS MAINTAIN THIS THROUGHOUT CONVERSATION):\n` +
        `- The user has received a disease prediction: **${category}**\n` +
        `- Location: ${locationName}${stateName ? `, ${stateName}, India` : ''}\n` +
        `- User's local language: ${langName} (${langNative})\n` +
        `- Weather conditions: Temperature ${weather?.temperature || 'N/A'}°C, Humidity ${weather?.humidity || 'N/A'}%, ` +
        `Precipitation ${weather?.precipitation || 'N/A'}mm\n` +
        `- Environmental factors: ${features.environment || 'N/A'}, Air Quality: ${features.air_quality || 'N/A'}\n\n` +
        `CRITICAL RESPONSE REQUIREMENTS (FOR ALL MESSAGES):\n` +
        `1. ALWAYS provide explanations in BOTH English and ${langName} (${langNative}) - this is mandatory\n` +
        `2. If the user asks a question in English, respond in both English and ${langName}\n` +
        `3. If the user asks a question in ${langName}, respond in both ${langName} and English\n` +
        `4. Maintain context about the "${category}" prediction throughout the conversation\n` +
        `5. Provide specific precautionary measures relevant to ${locationName}\n` +
        `6. Consider the weather conditions (${weather?.temperature || 'N/A'}°C, ${weather?.humidity || 'N/A'}% humidity) in your recommendations\n` +
        `7. Use markdown formatting with clear sections\n` +
        `8. Be culturally sensitive and provide practical, location-specific advice\n\n` +
        `RESPONSE FORMAT:\n` +
        `Start with a section header, then provide content in both languages:\n` +
        `**English:**\n` +
        `[Your response in English]\n\n` +
        `**${langName} (${langNative}):**\n` +
        `[Your response in ${langName}]\n\n` +
        `For longer responses, use clear subsections like:\n` +
        `- **What This Means:**\n` +
        `- **Precautionary Measures:**\n` +
        `- **Tips for ${locationName}:**\n` +
        `- **When to Seek Medical Help:**\n\n`;
    } else {
      systemPrompt += 'Format your response with clear sections: **Precautionary Measures**, **Tips**, **Cautionary Actions**. ' +
        'Use markdown formatting with bullet points and bold headers. ';
    }
    
    systemPrompt += 'User Question: ' + message;

    async function callGemini(url) {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: systemPrompt,
                },
              ],
            },
          ],
        }),
      });
      const json = await response.json();
      return { response, json };
    }

    // Use v1 endpoint with Gemini 2.5 Flash
    const { response: geminiRes, json } = await callGemini(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`
    );

    if (!geminiRes.ok) {
      console.error('Gemini API error:', {
        status: geminiRes.status,
        statusText: geminiRes.statusText,
        body: json,
      });
      const errMsg = json?.error?.message || json?.message || 'Gemini API error';
      return res.status(500).json({ error: errMsg });
    }

    const parts = json?.candidates?.[0]?.content?.parts || [];
    const reply = parts
      .map((p) => (typeof p?.text === 'string' ? p.text : ''))
      .filter(Boolean)
      .join('\n') || 'No content returned from model.';

    return res.json({ reply });
  } catch (err) {
    console.error('Server error in /api/chat:', err);
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
});

export default router;


