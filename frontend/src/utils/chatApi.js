const API_URL = import.meta.env.VITE_API_URL || 'https://madhav-ai-g4q8.onrender.com/api'

export const sendMessage = async (message, token) => {
  const sessionId = 'session_' + (token || 'guest')  // ✅ always a string

  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      message,
      sessionId,   // ✅ string
      userId: null
    }),
  })
  return res.json()
}

export const fetchHistory = async (token) => {
  const sessionId = 'session_' + (token || 'guest')
  const res = await fetch(`${API_URL}/chat?sessionId=${sessionId}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })
  return res.json()
}

export const clearHistory = async (token) => {
  const sessionId = 'session_' + (token || 'guest')
  const res = await fetch(`${API_URL}/chat/${sessionId}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })
  return res.json()
}
