import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Use default axios instance — AuthContext already sets the Authorization header on it
export async function sendMessage(message, history = []) {
  const res = await axios.post(`${API}/chat/send`, { message, history });
  return res.data.reply || '';
}

export async function getChatHistory() {
  try {
    const res = await axios.get(`${API}/chat/recent`);
    return res.data || [];
  } catch { return []; }
}

export async function getVerseExplanation(verse) {
  const res = await axios.post(`${API}/verse/explain`, { verse });
  return res.data.explanation || '';
}

export async function analyzeKarma(payload) {
  const res = await axios.post(`${API}/karma/analyze`, payload);
  return res.data.analysis || '';
}

export async function getStoryChapter(payload) {
  const res = await axios.post(`${API}/story/chapter`, payload);
  return res.data;
}
