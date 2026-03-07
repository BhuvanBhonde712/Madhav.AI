exports.speakText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const VOICE_ID = 'nPczCjzI2devNBz1zQrb';
    const API_KEY = process.env.ELEVENLABS_API_KEY;

    if (!API_KEY) return res.status(500).json({ error: 'ElevenLabs key not set' });

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.85,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('ElevenLabs error:', err);
      return res.status(response.status).json({ error: 'ElevenLabs API failed' });
    }

    const audioBuffer = await response.arrayBuffer();
    res.set('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));

  } catch (err) {
    console.error('Voice error:', err.message);
    res.status(500).json({ error: 'Voice generation failed' });
  }
};
