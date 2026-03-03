const API_URL = 'https://madhav-ai-g4q8.onrender.com/api'

export const sendMessage = async (message, sessionId, token) => {
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ message, sessionId }),
  })
  return res.json()
}

export const fetchHistory = async (sessionId, token) => {
  const res = await fetch(`${API_URL}/chat?sessionId=${sessionId}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })
  return res.json()
}

export const clearHistory = async (sessionId, token) => {
  const res = await fetch(`${API_URL}/chat/${sessionId}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })
  return res.json()
}

