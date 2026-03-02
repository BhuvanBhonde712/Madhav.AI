import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ChatBubble from '../components/ChatBubble'
import TypingIndicator from '../components/TypingIndicator'
import { SudarshanaChakra, PeacockFeather } from '../components/Icons'
import { sendMessage, fetchHistory, clearHistory } from '../utils/chatApi'

const SUGGESTIONS = [
  'I am confused about a big decision in my life.',
  'How do I deal with someone who betrayed me?',
  'Should I forgive or stand my ground?',
  'What does Dharma say about my situation?',
]

function getSessionId() {
  let id = sessionStorage.getItem('madhav_session')
  if (!id) { id = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`; sessionStorage.setItem('madhav_session', id) }
  return id
}

// Bow & Arrow send button SVG
function BowArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
      {/* Bow arc — facing UP (north), curved upward */}
      <path d="M15 55 Q50 10 85 55" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
      {/* Bowstring — horizontal */}
      <line x1="15" y1="55" x2="85" y2="55" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeDasharray="5 3"/>
      {/* Arrow shaft — vertical, pointing UP */}
      <line x1="50" y1="55" x2="50" y2="20" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Arrowhead — pointing straight up */}
      <polygon points="50,8 40,26 60,26" fill="white"/>
      {/* Fletching — at bowstring level */}
      <path d="M44,62 L50,55 L56,62" stroke="rgba(255,215,0,0.9)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M44,68 L50,61 L56,68" stroke="rgba(255,215,0,0.6)" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

export default function ChatPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const sessionId = useRef(user?.isGuest ? getSessionId() : null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, loading])

  useEffect(() => {
    if (user && !user.isGuest) {
      setHistoryLoading(true)
      fetchHistory().then(msgs => setMessages(msgs)).catch(() => {}).finally(() => setHistoryLoading(false))
    }
  }, [user])

  const handleSend = async (text = input.trim()) => {
    if (!text || loading) return
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)
    try {
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
      const data = await sendMessage(text, history, sessionId.current)
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Parth… I apologize, there seems to be a technical issue. Please try again in a moment.' }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: '#0D0D0D' }}>

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 flex-shrink-0 border-b"
        style={{ background: 'rgba(13,13,13,0.95)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2">
          <PeacockFeather size={18} />
          {messages.length > 0 && (
            <button onClick={async () => { if (!user?.isGuest) { try { await clearHistory() } catch {} }; setMessages([]) }}
              className="text-xs text-white/25 hover:text-white/50 transition-colors hidden md:block">
              Clear
            </button>
          )}
        </div>
        <div className="text-center">
          <h1 className="font-serif text-xl font-light text-white">
            Madhav<span className="text-orange-500">.ai</span>
          </h1>
          <p className="font-sanskrit text-[10px] text-yellow-500/50 tracking-wider hidden md:block">
            धर्मो रक्षति रक्षितः
          </p>
        </div>
        <div className="flex items-center gap-3">
          {loading && <SudarshanaChakra size={20} />}
          <button onClick={() => { logout(); navigate('/') }}
            className="text-xs text-white/25 hover:text-white/50 transition-colors">
            {user?.isGuest ? 'Login' : 'Logout'}
          </button>
        </div>
      </header>

      {/* ── Chat Area ── */}
      <div className="flex-1 overflow-y-auto relative" style={{ background: '#0D0D0D' }}>

        {/* Subtle watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
          <span className="font-sanskrit text-white select-none" style={{ fontSize: '20vw' }}>ॐ</span>
        </div>

        {/* Empty state */}
        {!historyLoading && messages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center h-full px-4 py-12 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: 'linear-gradient(135deg, #0F5C4D, #1A7A68)', boxShadow: '0 8px 32px rgba(15,92,77,0.4)' }}>
                <span className="font-sanskrit text-yellow-400 text-2xl">म</span>
              </div>
              <h2 className="font-serif text-2xl text-white/90">Namaste, Parth</h2>
              <p className="font-sans text-sm text-white/40 max-w-xs">
                What guidance do you seek today?
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full max-w-md">
              {SUGGESTIONS.map((s, i) => (
                <motion.button key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  onClick={() => handleSend(s)}
                  className="text-left px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white/90 transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', }}>
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {historyLoading && (
          <div className="flex items-center justify-center h-full">
            <SudarshanaChakra size={40} />
          </div>
        )}

        {/* Messages */}
        {!historyLoading && messages.length > 0 && (
          <div className="flex flex-col gap-4 px-2 md:px-6 py-6 max-w-3xl mx-auto">
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg.content} role={msg.role} />
            ))}
            <AnimatePresence>
              {loading && <TypingIndicator key="typing" />}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Input Area ── */}
      <div className="flex-shrink-0 px-3 md:px-6 py-4 border-t"
        style={{ background: 'rgba(13,13,13,0.98)', borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 rounded-2xl px-4 py-3 border"
            style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Parth, speak your heart…"
              rows={1}
              className="flex-1 resize-none text-sm text-white placeholder-white/25 outline-none bg-transparent py-1 max-h-32 leading-relaxed"
              onInput={e => { e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight}px` }}
            />
            {/* Bow & Arrow Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-25"
              style={{
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, #0F5C4D, #1A7A68)'
                  : 'rgba(255,255,255,0.08)',
                boxShadow: input.trim() && !loading ? '0 4px 16px rgba(15,92,77,0.4)' : 'none',
              }}>
              <BowArrowIcon />
            </button>
          </div>
          <p className="text-center text-[10px] text-white/15 mt-2 font-sans">
            Dharma guidance · Not a replacement for professional advice
          </p>
        </div>
      </div>
    </div>
  )
}