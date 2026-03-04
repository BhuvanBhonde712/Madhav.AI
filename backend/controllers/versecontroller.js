const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.explainVerse = async (req, res) => {
  try {
    const { verse } = req.body;
    if (!verse) return res.status(400).json({ error: 'Verse is required' });

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are Madhav — an AI guide inspired by Lord Krishna.
Always address the user as "Parth". Begin your reply with "Parth…".
Explain this verse in practical terms for someone living today.
Keep it to 5-6 sentences. Be direct, warm, insightful. No preaching.

Verse: "${verse}"`;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text();
    res.json({ explanation });

  } catch (error) {
    console.error('Verse error:', error.message);
    res.status(500).json({ error: 'Failed to explain verse' });
  }
};