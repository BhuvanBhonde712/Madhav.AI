<h1 align="center">Madhav.AI</h1>

India's first Dharma-based AI guidance chatbot inspired by Lord Krishna. Madhav.ai provides ethical and moral guidance using wisdom from the Bhagavad Gita, Mahabharata, and Ramayana. It is not a religious application — it is a practical moral guidance system built for modern life.

---

## Live Demo: https://madhav-ai.vercel.app

---


## Overview

Madhav.ai addresses users as "Parth" and responds in the same language the user writes in — English, Hindi, or Hinglish. It draws from ancient Indian scriptures to help users navigate real-life dilemmas with clarity and dharmic reasoning.

---

## Features

- **AI Chat** — Dharma-based guidance powered by Google Gemini 
- **Voice Mode** — Speak your question and receive a spoken reply using ElevenLabs TTS
- **Story Mode** — Interactive branching stories from the Mahabharata and Ramayana in English or Hindi
- **Daily Verse** — A daily shloka from the Bhagavad Gita with meaning and transliteration
- **Karma Calculator** — Reflect on your actions and receive a dharmic analysis
- **Mahabharata Character Quiz** — Discover which character from the epic you resemble most

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TailwindCSS v3, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| AI | Google Gemini 2.0 Flash Lite |
| Voice Output | ElevenLabs Text-to-Speech API |
| Auth | JWT Tokens |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## Project Structure

```
Project-712/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Icons.jsx
│   │   │   ├── ChatBubble.jsx
│   │   │   ├── ChakraLoader.jsx
│   │   │   ├── FloatingWords.jsx
│   │   │   ├── TypewriterLines.jsx
│   │   │   ├── TypingIndicator.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SidebarContext.jsx
│   │   ├── hooks/
│   │   │   └── usevoice.js
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── VoiceChatPage.jsx
│   │   │   ├── StoryModePage.jsx
│   │   │   ├── DailyVersePage.jsx
│   │   │   ├── KarmaCalculatorPage.jsx
│   │   │   └── QuizPage.jsx
│   │   ├── utils/
│   │   │   └── chatApi.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── backend/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── chatController.js
    │   ├── verseController.js
    │   ├── storyController.js
    │   └── karmaController.js
    ├── middleware/
    │   └── auth.js
    ├── models/
    │   ├── User.js
    │   └── Chat.js
    ├── routes/
    │   ├── auth.js
    │   ├── chat.js
    │   ├── verse.js
    │   ├── story.js
    │   └── karma.js
    └── server.js
```

---

## Design System

| Element | Value |
|---------|-------|
| Background | #0D0D0D |
| Primary | #0F5C4D (Peacock Green) |
| Accent | #FF7A00 (Saffron Orange) |
| Divine | #FFD700 (Golden) |
| Display Font | Cormorant Garamond |
| Body Font | DM Sans |
| Sanskrit Font | Noto Serif Devanagari |

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account
- Google Gemini API key (free)
- ElevenLabs API key (free tier available)

### Environment Variables

Create a `.env` file inside the `backend/` directory:

```
PORT=5000
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file inside the `frontend/` directory:

```
VITE_API_URL=http://localhost:5000/api
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### Installation

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running Locally

```bash
# Start backend
cd backend
node server.js

# Start frontend (in a separate terminal)
cd frontend
npm run dev
```

---

## Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend | Vercel | Auto-deploys on GitHub push |
| Backend | Render | Manual deploy required after changes |
| Database | MongoDB Atlas | Free tier cluster |

### Important Deployment Notes

- Always use Tailwind v3 — run `npm install -D tailwindcss@3` if issues arise
- MongoDB requires a direct connection string, not SRV — some ISPs block SRV DNS queries
- Render free tier sleeps after 15 minutes of inactivity — first request may be slow
- Gemini free tier allows 1500 requests per day and 15 per minute
- Never commit `.env` files to version control

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get current user profile |
| POST | /api/chat/send | Send message to Madhav AI |
| GET | /api/chat/recent | Get recent chat history |
| GET | /api/verse/daily | Get daily Bhagavad Gita verse |
| POST | /api/story/chapter | Get story chapter with choices |
| POST | /api/karma/analyze | Analyze karma based on actions |

---

## AI Behaviour

Madhav always:
- Addresses the user as "Parth"
- Starts every reply with "Parth..."
- Detects the language of the user's message and replies in the same language
- Draws guidance from the Bhagavad Gita, Mahabharata, and Ramayana
- Keeps answers concise — maximum 4 to 5 sentences
- Never preaches or shames the user

---

This project is for educational and personal use.

---

*Dharmo rakshati rakshitah — Dharma protects those who protect Dharma*
