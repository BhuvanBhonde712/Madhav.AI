import ChakraLoader from '../components/ChakraLoader';
import { useState } from 'react';
import { useSidebar } from '../context/SidebarContext';
import { analyzeKarma } from '../utils/chatApi';

const STEPS = [
  { key: 'situation', label: 'Describe your situation', placeholder: 'What is happening in your life right now? What decision or action are you facing?' },
  { key: 'action', label: 'What action are you considering?', placeholder: 'What are you thinking of doing? Be specific and honest.' },
  { key: 'intention', label: 'Why are you considering it?', placeholder: 'What is your real reason? What do you hope to gain or avoid?' },
  { key: 'affected', label: 'Who will this affect?', placeholder: 'Who else will be impacted by this action — family, colleagues, strangers?' },
];

export default function KarmaCalculatorPage() {
  const { setIsOpen } = useSidebar();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ situation: '', action: '', intention: '', affected: '' });
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const current = STEPS[step];

  const handleNext = () => {
    if (!answers[current.key].trim()) return;
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setAnalysis('');
    try {
      const result = await analyzeKarma(answers);
      setAnalysis(result);
    } catch {
      setAnalysis('Parth… the connection was broken. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({ situation: '', action: '', intention: '', affected: '' });
    setAnalysis('');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] lg:pl-72 page-enter">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <button onClick={() => setIsOpen(true)} className="lg:hidden w-8 h-8 flex items-center justify-center text-[#666] hover:text-white">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5h12M3 9h12M3 13h8" strokeLinecap="round" /></svg>
        </button>
        <span className="text-[#FFD700]/80 text-sm" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Karma Calculator</span>
      </div>

      <div className="max-w-xl mx-auto px-6 py-10">
        {!analysis ? (
          <>
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">⚖️</div>
              <h2 className="text-[#FFD700] text-3xl font-light mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Understand Your Karma
              </h2>
              <p className="text-[#555] text-sm">
                Be honest. Madhav will give you a dharmic analysis of your actions and intentions.
              </p>
            </div>

            {/* Progress */}
            <div className="flex gap-2 mb-8">
              {STEPS.map((s, i) => (
                <div key={i} className={`flex-1 h-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-[#FFD700]' : 'bg-[#1a1a1a]'}`} />
              ))}
            </div>

            {/* Current step */}
            <div>
              <label className="block text-white text-base mb-1 font-medium">{current.label}</label>
              <p className="text-[#444] text-xs mb-3">Step {step + 1} of {STEPS.length}</p>
              <textarea
                value={answers[current.key]}
                onChange={(e) => setAnswers({ ...answers, [current.key]: e.target.value })}
                placeholder={current.placeholder}
                rows={5}
                className="w-full bg-[#141414] border border-white/8 rounded-xl px-4 py-3 text-[#ddd] text-sm placeholder-[#333] resize-none outline-none focus:border-[#0F5C4D]/50 transition-colors leading-relaxed"
              />
            </div>

            {/* Previous answers summary */}
            {step > 0 && (
              <div className="mt-4 space-y-2">
                {STEPS.slice(0, step).map((s) => (
                  <div key={s.key} className="bg-[#141414]/50 border border-white/5 rounded-lg px-3 py-2">
                    <p className="text-[#444] text-[10px] uppercase tracking-wider mb-0.5">{s.label}</p>
                    <p className="text-[#666] text-xs truncate">{answers[s.key]}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="px-4 py-3 rounded-xl border border-white/8 text-[#666] text-sm hover:bg-white/5 transition-all">
                  ← Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!answers[current.key].trim()}
                  className="flex-1 py-3 rounded-xl bg-[#0F5C4D] text-white text-sm font-medium hover:bg-[#0d4f43] transition-colors disabled:opacity-40"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!answers[current.key].trim() || loading}
                  className="flex-1 py-3 rounded-xl bg-[#FFD700] text-[#1a1a1a] text-sm font-bold hover:bg-[#e6c200] transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {loading ? <><Chakra className="w-4 h-4 animate-spin text-[#1a1a1a]" /> Calculating…</> : '⚖️ Analyze My Karma'}
                </button>
              )}
            </div>
          </>
        ) : (
          /* Analysis result */
          <div>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🦚</div>
              <h2 className="text-[#FFD700] text-2xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Madhav's Karma Analysis
              </h2>
            </div>

            <div className="bg-[#0F5C4D]/8 border border-[#0F5C4D]/20 rounded-2xl px-5 py-5 mb-6">
              <p className="text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap">{analysis}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 py-3 rounded-xl bg-[#0F5C4D] text-white text-sm font-medium hover:bg-[#0d4f43] transition-colors">
                Analyze Another Situation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}