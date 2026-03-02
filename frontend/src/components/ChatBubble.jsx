import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// Peacock feather typewriter for bot messages
function PeacockTypewriter({ text }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(interval)
      }
    }, 18)
    return () => clearInterval(interval)
  }, [text])

  return (
    <span className="relative">
      {displayed}
      {/* Peacock feather cursor */}
      {!done && (
        <span
          className="inline-block ml-0.5 align-middle"
          style={{
            width: '10px',
            height: '18px',
            background: 'linear-gradient(180deg, #FFD700 0%, #0F5C4D 60%, #1A7A68 100%)',
            borderRadius: '50% 50% 30% 30%',
            display: 'inline-block',
            animation: 'float 0.6s ease-in-out infinite',
            opacity: 0.85,
            boxShadow: '0 0 6px rgba(255,215,0,0.6)',
            transform: 'rotate(10deg)',
          }}
        />
      )}
    </span>
  )
}

export default function ChatBubble({ message, role }) {
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-2`}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div className="mr-2 mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #0F5C4D, #1A7A68)', boxShadow: '0 2px 12px rgba(15,92,77,0.4)' }}>
          <span className="font-sanskrit text-yellow-400 text-xs">म</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className="max-w-[78%] md:max-w-[68%] rounded-2xl px-4 py-3"
        style={isUser
          ? {
              background: 'linear-gradient(135deg, #FF7A00, #FF9A33)',
              color: '#000000',
              borderBottomRightRadius: '6px',
              boxShadow: '0 2px 20px rgba(0, 0, 0, 0.35)',
            }
          : {
              background: 'linear-gradient(135deg, #0F5C4D, #1A7A68)',
              color: '#fff',
              borderBottomLeftRadius: '6px',
              boxShadow: '0 2px 20px rgba(15,92,77,0.35)',
            }
        }
      >
        <p className="font-sans text-sm leading-relaxed whitespace-pre-wrap">
          {isUser ? message : <PeacockTypewriter text={message} />}
        </p>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="ml-2 mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
          style={{ background: 'rgba(255,122,0,0.4)', border: '1px solid rgba(255,122,0,0.6)' }}>
          P
        </div>
      )}
    </motion.div>
  )
}