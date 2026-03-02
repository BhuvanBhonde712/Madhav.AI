import { motion } from 'framer-motion'
import { SudarshanaChakra } from './Icons'

export default function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }} className="flex items-center gap-3 px-4">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #0F5C4D, #1A7A68)' }}>
        <span className="font-sanskrit text-yellow-400 text-xs">म</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl"
        style={{ background: 'rgba(15,92,77,0.25)', border: '1px solid rgba(15,92,77,0.4)', borderBottomLeftRadius: '6px' }}>
        <SudarshanaChakra size={18} />
        <span className="font-sans text-xs text-white/50 italic">Madhav is reflecting…</span>
      </div>
    </motion.div>
  )
}