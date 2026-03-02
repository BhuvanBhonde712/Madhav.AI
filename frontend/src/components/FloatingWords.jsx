import { useMemo } from 'react'

const POSITIVE_WORDS = ['सत्य', 'प्रेम', 'श्रद्धा', 'करुणा', 'त्याग', 'शांति', 'धैर्य']
const NEGATIVE_WORDS = ['अधर्म', 'असत्य', 'मोह', 'क्रोध', 'लोभ', 'अहंकार', 'काम', 'आतंक']

export default function FloatingWords() {
  const grid = useMemo(() => {
    const all = []
    const combined = []
    const maxLen = Math.max(POSITIVE_WORDS.length, NEGATIVE_WORDS.length)
    for (let i = 0; i < maxLen; i++) {
      if (i < NEGATIVE_WORDS.length) combined.push({ text: NEGATIVE_WORDS[i], positive: false })
      if (i < POSITIVE_WORDS.length) combined.push({ text: POSITIVE_WORDS[i], positive: true })
    }
    const cols = 7
    const rows = 6
    let idx = 0
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const word = combined[idx % combined.length]
        all.push({
          id: `${row}-${col}`,
          text: word.text,
          positive: word.positive,
          left: `${(col * 15) + (row * 4)}%`,
          top: `${(row * 17) + (col * 1.5)}%`,
        })
        idx++
      }
    }
    return all
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {grid.map((w) => (
        <span key={w.id} className="absolute select-none font-sanskrit"
          style={{
            top: w.top, left: w.left, fontSize: '18px', fontWeight: 500,
            color: w.positive ? 'rgba(220,80,60,0.45)' : 'rgba(140,140,140,0.22)',
            transform: 'rotate(-15deg)', whiteSpace: 'nowrap',
          }}>
          {w.text}
        </span>
      ))}

      {/* धर्म — just left of center auth box */}
      <span className="absolute select-none font-sanskrit font-bold"
        style={{
          fontSize: 'clamp(60px, 7vw, 96px)',
          right: 'calc(50% + 220px)',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#FFD700',
          textShadow: '0 0 30px rgba(255,215,0,0.7), 0 0 60px rgba(255,215,0,0.3)',
          animation: 'float 8s ease-in-out infinite',
          zIndex: 1,
        }}>
        धर्म
      </span>

      {/* कर्म — just right of center auth box */}
      <span className="absolute select-none font-sanskrit font-bold"
        style={{
          fontSize: 'clamp(60px, 7vw, 96px)',
          left: 'calc(50% + 220px)',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#FFD700',
          textShadow: '0 0 30px rgba(255,215,0,0.7), 0 0 60px rgba(255,215,0,0.3)',
          animation: 'floatAlt 9s ease-in-out infinite',
          zIndex: 1,
        }}>
        कर्म
      </span>
    </div>
  )
}