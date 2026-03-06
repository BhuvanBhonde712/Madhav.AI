const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getStoryChapter = async (req, res) => {
  try {
    const { storyId, chapter, userChoice, setting, title, history = [], language = '' } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const isStart = chapter === 0;
    const historyText = history.join('\n\n---\n\n');

    const langInstruction = language.includes('हिंदी')
      ? 'IMPORTANT: You MUST write the ENTIRE story and ALL choices in Hindi (Devanagari script) only. Do NOT use any English words at all.'
      : 'IMPORTANT: You MUST write the ENTIRE story and ALL choices in English only.';

    const prompt = isStart
      ? `You are a master storyteller narrating tales from the Mahabharata and Ramayana.
${langInstruction}
Story: "${title}"
Setting: "${setting}"

Begin the story with a dramatic, immersive opening paragraph of 4-6 sentences. Set the scene vividly.
Then provide exactly 2 choices for what happens next. Choices must be in the same language as the story.

Respond ONLY in this exact JSON format with no markdown, no backticks, no extra text:
{"chapter":"story text here","choices":["choice 1","choice 2"]}`

      : `You are a master storyteller narrating tales from the Mahabharata and Ramayana.
${langInstruction}
Story: "${title}"
Setting: "${setting}"

Previous story so far:
${historyText}

The reader chose: "${userChoice}"

Continue the story for 4-6 sentences based on this choice. Write in the same language as before.
${chapter >= 4
  ? 'This is the final chapter. Bring it to a meaningful, dharma-guided conclusion. Return empty choices array.'
  : 'Then provide exactly 2 choices for what happens next. Choices must be in the same language as the story.'
}

Respond ONLY in this exact JSON format with no markdown, no backticks, no extra text:
{"chapter":"story text here","choices":["choice 1","choice 2"]}`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Strip any accidental markdown
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(text);
    res.json({ chapter: parsed.chapter, choices: parsed.choices || [] });

  } catch (error) {
    console.error('Story error:', error.message);
    res.status(500).json({ error: 'Story generation failed' });
  }
};
