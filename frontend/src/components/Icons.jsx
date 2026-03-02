export function SudarshanaChakra({ size = 40, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={`chakra-spin ${className}`}>
      <circle cx="50" cy="50" r="46" fill="none" stroke="#FFD700" strokeWidth="2" strokeDasharray="8 4" />
      {[...Array(16)].map((_, i) => {
        const angle = (i * 360) / 16
        const rad = (angle * Math.PI) / 180
        const x1 = 50 + 20 * Math.cos(rad)
        const y1 = 50 + 20 * Math.sin(rad)
        const x2 = 50 + 44 * Math.cos(rad)
        const y2 = 50 + 44 * Math.sin(rad)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFD700" strokeWidth="1.5" />
      })}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8 + 22.5
        const rad = (angle * Math.PI) / 180
        const x = 50 + 36 * Math.cos(rad)
        const y = 50 + 36 * Math.sin(rad)
        return <circle key={i} cx={x} cy={y} r="3" fill="#FF7A00" opacity="0.8" />
      })}
      <circle cx="50" cy="50" r="18" fill="none" stroke="#FF7A00" strokeWidth="2" />
      <circle cx="50" cy="50" r="6" fill="#FFD700" />
    </svg>
  )
}

export function PeacockFeather({ size = 36, className = '' }) {
  return (
    <svg width={size} height={size * 2.5} viewBox="0 0 60 150" className={className} fill="none">
      <path d="M30 150 Q28 100 30 60" stroke="#0F5C4D" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="30" cy="45" rx="18" ry="35" fill="#0F5C4D" opacity="0.15" />
      {[-14,-10,-6,-2,2,6,10,14].map((x, i) => (
        <path key={i} d={`M30 60 Q${30+x} ${50-Math.abs(x)} ${30+x*1.2} ${35-i}`}
          stroke="#0F5C4D" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
      ))}
      <ellipse cx="30" cy="30" rx="8" ry="12" fill="#1A7A68" opacity="0.7" />
      <ellipse cx="30" cy="30" rx="5" ry="8" fill="#FFD700" opacity="0.8" />
      <ellipse cx="30" cy="30" rx="3" ry="5" fill="#0D0D0D" opacity="0.9" />
      <circle cx="31" cy="28" r="1" fill="white" opacity="0.7" />
    </svg>
  )
}

export function BowArrow({ size = 60, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" opacity="0.2">
      <path d="M20 10 Q5 50 20 90" stroke="#0F5C4D" strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="10" x2="20" y2="90" stroke="#FFD700" strokeWidth="1" strokeDasharray="4 2" />
      <line x1="20" y1="50" x2="90" y2="50" stroke="#FF7A00" strokeWidth="2" strokeLinecap="round" />
      <polygon points="90,50 80,44 80,56" fill="#FF7A00" />
      <path d="M20,50 L14,44 L20,50 L14,56" stroke="#0F5C4D" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export function Flute({ size = 28, className = '' }) {
  return (
    <svg width={size * 3} height={size} viewBox="0 0 120 40" className={className} fill="none">
      <rect x="5" y="17" width="110" height="6" rx="3" fill="#0F5C4D" opacity="0.7" />
      <ellipse cx="8" cy="20" rx="5" ry="4" fill="#1A7A68" opacity="0.9" />
      {[25,38,51,64,77,90].map((x, i) => (
        <circle key={i} cx={x} cy="20" r="3" fill="#0D0D0D" opacity="0.5" />
      ))}
      <ellipse cx="115" cy="20" rx="4" ry="3" fill="#FFD700" opacity="0.6" />
      <text x="30" y="12" fontSize="8" fill="#FF7A00" opacity="0.4">♪</text>
      <text x="70" y="10" fontSize="6" fill="#FF7A00" opacity="0.3">♫</text>
    </svg>
  )
}