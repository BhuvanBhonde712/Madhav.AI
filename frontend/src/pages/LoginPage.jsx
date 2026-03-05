import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import FloatingWords from '../components/FloatingWords'
import TypewriterLines from '../components/TypewriterLines'
import { Chakra as SudarshanaChakra } from '../components/Icons';
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }
  })
}

function SignupForm({ onSuccess, onBack }) {
  const { signup } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await signup(form.name, form.email, form.password); onSuccess() }
    catch (err) { setError(err.response?.data?.message || 'Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder="Your name"
        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-orange-500/60 transition-colors text-sm" />
      <input type="email" placeholder="Email address"
        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-orange-500/60 transition-colors text-sm" />
      <input type="password" placeholder="Password (min 6 characters)"
        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-orange-500/60 transition-colors text-sm" />
      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-xl text-sm text-white font-medium flex items-center justify-center gap-2 transition-all"
        style={{ background: 'linear-gradient(135deg, #0F5C4D, #1A7A68)', boxShadow: '0 4px 24px rgba(15,92,77,0.4)' }}>
        {loading ? <SudarshanaChakra size={20} /> : 'Create Account →'}
      </button>
      <button type="button" onClick={onBack}
        className="w-full text-white/40 text-xs hover:text-white/70 transition-colors py-1">
        ← Go Back
      </button>
    </form>
  )
}

function SigninForm({ onSuccess, onBack }) {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await login(form.email, form.password); onSuccess() }
    catch (err) { setError(err.response?.data?.message || 'Invalid email or password.') }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="email" placeholder="Email address"
        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-orange-500/60 transition-colors text-sm" />
      <input type="password" placeholder="Password"
        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-orange-500/60 transition-colors text-sm" />
      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-xl text-sm text-white font-medium flex items-center justify-center gap-2 transition-all"
        style={{ background: 'linear-gradient(135deg, #FF7A00, #CC6200)', boxShadow: '0 4px 24px rgba(255,122,0,0.3)' }}>
        {loading ? <SudarshanaChakra size={20} /> : 'Sign In →'}
      </button>
      <button type="button" onClick={onBack}
        className="w-full text-white/40 text-xs hover:text-white/70 transition-colors py-1">
        ← Go Back
      </button>
    </form>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { continueAsGuest } = useAuth()
  const [panel, setPanel] = useState('main')
  const goToChat = () => navigate('/chat')
  const handleGuest = () => { continueAsGuest(); goToChat() }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4"
      style={{ background: '#0D0D0D' }}>

      <FloatingWords />

      {/* Center glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(15,92,77,0.15) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8">

        {/* Header */}
        <motion.div className="text-center space-y-3" initial="hidden" animate="visible">
          <motion.p variants={fadeUp} custom={0}
            className="font-sanskrit text-yellow-400 text-xl tracking-widest"
            style={{ textShadow: '0 0 20px rgba(255,215,0,0.5)' }}>
            ॥ धर्मो रक्षति रक्षितः ॥
          </motion.p>
          <motion.h1 variants={fadeUp} custom={0.1}
            className="font-serif text-white font-light"
            style={{ fontSize: 'clamp(36px, 8vw, 52px)' }}>
            Madhav<span className="text-orange-500">.ai</span>
          </motion.h1>
          <motion.div variants={fadeUp} custom={0.2} className="min-h-[3.5rem]">
            <p className="font-serif text-white/50 text-base mb-1">Parth,</p>
            <TypewriterLines />
          </motion.div>
        </motion.div>

        {/* Auth Card */}
        <motion.div variants={fadeUp} custom={0.3} initial="hidden" animate="visible"
          className="w-full p-6"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1.25rem',
          }}>
          <AnimatePresence mode="wait">
            {panel === 'main' && (
              <motion.div key="main"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                className="space-y-3">
                <p className="text-center text-white/40 text-xs mb-4 tracking-widest uppercase font-sans">
                  Choose Your Journey
                </p>
                <button onClick={() => setPanel('signup')}
                  className="w-full py-3 rounded-xl text-sm text-white font-medium transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #0F5C4D, #1A7A68)', boxShadow: '0 4px 20px rgba(15,92,77,0.4)' }}
                  onMouseEnter={e => e.target.style.boxShadow = '0 4px 32px rgba(15,92,77,0.65)'}
                  onMouseLeave={e => e.target.style.boxShadow = '0 4px 20px rgba(15,92,77,0.4)'}>
                  Create New Account
                </button>
                <button onClick={() => setPanel('signin')}
                  className="w-full py-3 rounded-xl text-sm text-white font-medium border transition-all duration-300 hover:bg-orange-500/10"
                  style={{ borderColor: 'rgba(255,122,0,0.5)' }}
                  onMouseEnter={e => e.target.style.boxShadow = '0 0 20px rgba(255,122,0,0.25)'}
                  onMouseLeave={e => e.target.style.boxShadow = 'none'}>
                  Already have an account? Sign In
                </button>
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative text-center">
                    <span className="px-3 text-white/25 text-xs font-sans"
                      style={{ background: 'transparent' }}>OR</span>
                  </div>
                </div>
                <button onClick={handleGuest}
                  className="w-full py-3 rounded-xl text-sm text-white/45 hover:text-white/70 transition-colors border border-white/10">
                  Continue without login
                </button>
              </motion.div>
            )}
            {panel === 'signup' && (
              <motion.div key="signup"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <p className="text-center text-white/40 text-xs mb-5 tracking-widest uppercase">Create Account</p>
                <SignupForm onSuccess={goToChat} onBack={() => setPanel('main')} />
              </motion.div>
            )}
            {panel === 'signin' && (
              <motion.div key="signin"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <p className="text-center text-white/40 text-xs mb-5 tracking-widest uppercase">Welcome Back</p>
                <SigninForm onSuccess={goToChat} onBack={() => setPanel('main')} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.p variants={fadeUp} custom={0.5} initial="hidden" animate="visible"
          className="text-white/20 text-xs text-center font-sans">
          Dharma-based ethical guidance · Not religious preaching
        </motion.p>
      </div>
    </div>
  )
}
