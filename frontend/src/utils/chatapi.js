import axios from 'axios'

export async function sendMessage(message, history = [], sessionId = null) {
  const payload = { message, history }
  if (sessionId) payload.sessionId = sessionId
  const res = await axios.post('/api/chat/send', payload)
  return res.data
}

export async function fetchHistory() {
  const res = await axios.get('/api/chat/history')
  return res.data.messages || []
}

export async function clearHistory() {
  await axios.delete('/api/chat/history')
}