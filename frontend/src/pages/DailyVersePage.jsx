import { useState } from 'react';
import { useSidebar } from '../context/SidebarContext';
import { MenuIcon } from '../components/Icons';
import ChakraLoader from '../components/ChakraLoader';
import { getVerseExplanation } from '../utils/chatApi';

const VERSES = [
  { sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन', transliteration: 'Karmanye vadhikaraste ma phaleshu kadachana', translation: 'You have the right to perform your duty, but never to the fruits of your action.', ref: 'Bhagavad Gita 2.47', theme: 'Karma Yoga' },
  { sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय', transliteration: 'Yogasthah kuru karmani sangam tyaktva dhananjaya', translation: 'Be steadfast in yoga, O Arjuna. Perform your duty without attachment, and abandon both success and failure equally.', ref: 'Bhagavad Gita 2.48', theme: 'Detachment' },
  { sanskrit: 'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते', transliteration: 'Na hi jnanena sadrisham pavitram iha vidyate', translation: 'In this world, there is nothing so purifying as knowledge.', ref: 'Bhagavad Gita 4.38', theme: 'Wisdom' },
  { sanskrit: 'श्रद्धावान् लभते ज्ञानं तत्परः संयतेन्द्रियः', transliteration: 'Shraddhavan labhate jnanam tatparah samyatendriyah', translation: 'The man of faith, devoted and with mastered senses, attains knowledge.', ref: 'Bhagavad Gita 4.39', theme: 'Faith' },
  { sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत', transliteration: 'Yada yada hi dharmasya glanir bhavati bharata', translation: 'Whenever dharma declines and adharma rises, I manifest myself on earth.', ref: 'Bhagavad Gita 4.7', theme: 'Divine Purpose' },
  { sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज', transliteration: 'Sarvadharmān parityajya māmekam śaraṇam vraja', translation: 'Abandon all duties and take refuge in me alone. I will liberate you from all sins.', ref: 'Bhagavad Gita 18.66', theme: 'Surrender' },
  { sanskrit: 'मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु', transliteration: 'Manmana bhava madbhakto madyaji mam namaskuru', translation: 'Fix your mind on me, be devoted to me, worship me, bow down to me.', ref: 'Bhagavad Gita 9.34', theme: 'Devotion' },
  { sanskrit: 'नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः', transliteration: 'Nainam chhindanti shastrani nainam dahati pavakah', translation: 'No weapon can pierce the soul; no fire can burn it, no water can drench it, no wind dry it.', ref: 'Bhagavad Gita 2.23', theme: 'Immortal Soul' },
  { sanskrit: 'समः शत्रौ च मित्रे च तथा मानापमानयोः', transliteration: 'Samah shatrau cha mitre cha tatha manapamanayoh', translation: 'One who is the same to a friend and an enemy, in honour and dishonour, in cold and heat — they are dear to me.', ref: 'Bhagavad Gita 12.18', theme: 'Equanimity' },
  { sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्', transliteration: 'Uddharead atmanatmanam natmanam avasadayet', translation: 'Lift yourself by yourself. Do not degrade yourself, for the self alone is the friend and foe of the self.', ref: 'Bhagavad Gita 6.5', theme: 'Self-Upliftment' },
  { sanskrit: 'विद्याविनयसम्पन्ने ब्राह्मणे गवि हस्तिनि', transliteration: 'Vidya vinaya sampanne brahmane gavi hastini', translation: 'The wise see with equal vision a learned person, a cow, an elephant, a dog, and an outcaste.', ref: 'Bhagavad Gita 5.18', theme: 'Equal Vision' },
  { sanskrit: 'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः', transliteration: 'Duhkheshv anudvigna manah sukheshu vigatasprihah', translation: 'One who is not disturbed in mind even amid misery, and does not crave for pleasure in happiness, is a stable sage.', ref: 'Bhagavad Gita 2.56', theme: 'Steady Mind' },
  { sanskrit: 'अहिंसा सत्यमक्रोधस्त्यागः शान्तिरपैशुनम्', transliteration: 'Ahimsa satyam akrodhas tyagah shantir apaishsunam', translation: 'Non-violence, truth, absence of anger, renunciation, peacefulness, compassion — these are divine virtues.', ref: 'Bhagavad Gita 16.2', theme: 'Divine Virtues' },
  { sanskrit: 'न त्वहं कामये राज्यं न स्वर्गं न पुनर्भवम्', transliteration: 'Na tvam kamaye rajyam na svargam na punarbhavam', translation: 'I do not desire kingdom, nor heaven, nor liberation — I desire only the removal of the suffering of all living beings.', ref: 'Mahabharata — Yudhishthira', theme: 'Compassion' },
];

export default function DailyVersePage() {
  const { setIsOpen } = useSidebar();
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  // Pick verse based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const verse = VERSES[dayOfYear % VERSES.length];
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const handleExplain = async () => {
    setLoading(true);
    setExplanation('');
    try {
      const text = `${verse.sanskrit} — ${verse.translation} (${verse.ref})`;
      const result = await getVerseExplanation(text);
      setExplanation(result);
    } catch {
      setExplanation('Parth… the connection was broken. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] lg:pl-72 page-enter">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <button onClick={() => setIsOpen(true)} className="lg:hidden w-8 h-8 flex items-center justify-center text-[#666] hover:text-white transition-colors">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5h12M3 9h12M3 13h8" strokeLinecap="round" /></svg>
        </button>
        <span className="text-[#FFD700]/80 text-sm" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Daily Dharma Verse</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <p className="text-[#444] text-xs mb-6 text-center uppercase tracking-widest">{today}</p>

        {/* Theme badge */}
        <div className="flex justify-center mb-6">
          <span className="px-3 py-1 rounded-full bg-[#0F5C4D]/15 border border-[#0F5C4D]/25 text-[#0F5C4D] text-xs font-medium">
            {verse.theme}
          </span>
        </div>

        {/* Sanskrit */}
        <div className="text-center mb-8 bg-[#141414] border border-white/5 rounded-2xl px-6 py-8">
          <p
            className="text-[#FFD700] text-2xl mb-3 leading-relaxed"
            style={{ fontFamily: 'Noto Serif Devanagari, serif' }}
          >
            {verse.sanskrit}
          </p>
          <p className="text-[#555] text-sm italic mb-4">{verse.transliteration}</p>
          <div className="w-12 h-px bg-[#333] mx-auto mb-4" />
          <p className="text-[#ccc] text-base leading-relaxed">{verse.translation}</p>
          <p className="text-[#444] text-xs mt-3">— {verse.ref}</p>
        </div>

        {/* Ask Madhav to explain */}
        {!explanation && (
          <button
            onClick={handleExplain}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#0F5C4D] text-white text-sm font-medium hover:bg-[#0d4f43] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <ChakraLoader size="sm" />
                <span>Madhav is reflecting…</span>
              </div>
            ) : (
              <>
                <span>Ask Madhav to Explain This</span>
              </>
            )}
          </button>
        )}

        {/* Explanation */}
        {explanation && (
          <div className="mt-6 bg-[#0F5C4D]/8 border border-[#0F5C4D]/20 rounded-2xl px-5 py-5">
            <p className="text-[#0F5C4D] text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>🦚</span> Madhav explains
            </p>
            <p className="text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap">{explanation}</p>
            <button
              onClick={() => setExplanation('')}
              className="mt-4 text-[#444] text-xs hover:text-[#666] transition-colors"
            >
              ← Ask again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}