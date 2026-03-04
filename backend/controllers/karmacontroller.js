const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeKarma = async (req, res) => {
  try {
    const { situation, action, intention, affected } = req.body;

    if (!situation) return res.status(400).json({ error: 'Situation is required' });

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are Madhav — a dharma-based AI guide inspired by Lord Krishna.
Always address the user as "Parth". Begin your reply with "Parth…".
Analyze the following from a dharmic perspective. Be honest, direct, and compassionate. Never preachy.
Structure your analysis: understand the situation, analyze the karma type, what dharma says about the intention, ripple effect on others, and a clear recommendation.
Keep it to 7-8 sentences maximum.

Situation: ${situation}
Action being considered: ${action}
Intention / reason: ${intention}
People who will be affected: ${affected}`;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();
    res.json({ analysis });

  } catch (error) {
    console.error('Karma error:', error.message);
    res.status(500).json({ error: 'Failed to analyze karma' });
  }
};