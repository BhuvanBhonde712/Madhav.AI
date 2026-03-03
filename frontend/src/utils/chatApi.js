const API_URL = import.meta.env.VITE_API_URL || 'https://madhav-ai-g4q8.onrender.com/api'

export const sendMessage = async (message, history, sessionId) => {
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      sessionId: sessionId || 'guest_session',
      history,
    }),
  })
  return res.json()
}

export const fetchHistory = async (sessionId) => {
  const res = await fetch(`${API_URL}/chat?sessionId=${sessionId || ''}`)
  return res.json()
}

export const clearHistory = async (sessionId) => {
  const res = await fetch(`${API_URL}/chat/${sessionId || ''}`, {
    method: 'DELETE',
  })
  return res.json()
}
