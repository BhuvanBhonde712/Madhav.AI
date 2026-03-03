const API_URL = import.meta.env.VITE_API_URL

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

