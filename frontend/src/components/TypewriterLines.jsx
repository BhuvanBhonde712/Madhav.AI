import { useState, useEffect } from 'react'

const LINES = [
  'Are you struggling to make the right decision?',
  'Are you confused between Dharma and Adharma?',
  'Do you wish to understand your true Karma?',
  'Seek guidance from the wisdom of the ages…',
]

export default function TypewriterLines() {
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [text, setText] = useState('')
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => { setPaused(false); setDeleting(true) }, 2200)
      return () => clearTimeout(t)
    }
    const current = LINES[lineIndex]
    if (!deleting) {
      if (charIndex < current.length) {
        const t = setTimeout(() => { setText(current.slice(0, charIndex+1)); setCharIndex(c=>c+1) }, 42)
        return () => clearTimeout(t)
      } else { setPaused(true) }
    } else {
      if (charIndex > 0) {
        const t = setTimeout(() => { setText(current.slice(0, charIndex-1)); setCharIndex(c=>c-1) }, 22)
        return () => clearTimeout(t)
      } else { setDeleting(false); setLineIndex(i=>(i+1)%LINES.length) }
    }
  }, [charIndex, deleting, lineIndex, paused])

  return (
    <p className="font-serif text-white/70 text-lg md:text-xl italic" style={{ minHeight: '2rem' }}>
      <span style={{ borderRight: '2px solid #FF7A00', paddingRight: '2px', animation: 'typewriterBlink 1s step-end infinite' }}>
        {text}
      </span>
    </p>
  )
}