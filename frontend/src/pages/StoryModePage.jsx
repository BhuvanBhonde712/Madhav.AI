import ChakraLoader from '../components/ChakraLoader';
import { useState } from 'react';
import { useSidebar } from '../context/SidebarContext';
import { getStoryChapter } from '../utils/chatApi';

const STORIES = [
  { id: 'arjuna_dilemma', title: "Arjuna's Dilemma", subtitle: 'The moment a warrior chose between love and duty', icon: '🏹', setting: 'Kurukshetra battlefield, moments before the great war' },
  { id: 'karna_birth', title: "Karna's Truth", subtitle: 'The tragedy of the greatest warrior born in wrong hands', icon: '⚡', setting: 'From the banks of the Ganga to the courts of Hastinapura' },
  { id: 'draupadi_swayamvar', title: "Draupadi's Fire", subtitle: 'A princess who refused to be defined by others', icon: '🔥', setting: 'The grand assembly of Panchala Kingdom' },
  { id: 'dice_game', title: 'The Dice Game', subtitle: 'The night dharma was gambled away', icon: '⚖️', setting: 'The royal court of Hastinapura' },
  { id: 'hanuman_sita', title: 'Hanuman Meets Sita', subtitle: 'Devotion that crossed oceans and impossibilities', icon: '🌅', setting: 'The gardens of Lanka' },
  { id: 'rama_exile', title: "Rama's Exile", subtitle: 'The dharma of a prince who chose his word over his crown', icon: '🌿', setting: 'The palace of Ayodhya' },
];

const LANGUAGES = [
  {
    code: 'en',
    label: 'English',
    sublabel: 'Story in English',
    icon: '🇬🇧',
    prompt: 'en',   // ← just send 'en'
  },
  {
    code: 'hi',
    label: 'हिंदी',
    sublabel: 'कहानी हिंदी में',
    icon: '🇮🇳',
    prompt: 'hi',   // ← just send 'hi'
  },
];

export default function StoryModePage() {
  const { setIsOpen } = useSidebar();
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedLang, setSelectedLang] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('select'); // 'select' | 'language' | 'reading'

  const handleStorySelect = (story) => {
    setSelectedStory(story);
    setStep('language');
  };

  const startStory = async (lang) => {
    setSelectedLang(lang);
    setChapters([]);
    setChoices([]);
    setStep('reading');
    setLoading(true);

    try {
      const data = await getStoryChapter({
        storyId: selectedStory.id,
        chapter: 0,
        userChoice: null,
        setting: selectedStory.setting,
        title: selectedStory.title,
        language: lang.prompt,
      });
      setChapters([data.chapter]);
      setChoices(data.choices || []);
    } catch {
      setChapters(['Parth… the story could not begin. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  const makeChoice = async (choice) => {
    setLoading(true);
    setChoices([]);

    try {
      const data = await getStoryChapter({
        storyId: selectedStory.id,
        chapter: chapters.length,
        userChoice: choice,
        setting: selectedStory.setting,
        title: selectedStory.title,
        history: chapters,
        language: selectedLang.prompt,
      });
      setChapters((prev) => [...prev, `\nYour choice: ${choice}\n\n${data.chapter}`]);
      setChoices(data.choices || []);
    } catch {
      setChapters((prev) => [...prev, 'Parth… the story was interrupted.']);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedStory(null);
    setSelectedLang(null);
    setChapters([]);
    setChoices([]);
    setStep('select');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] lg:pl-72 page-enter">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <button onClick={() => setIsOpen(true)} className="lg:hidden w-8 h-8 flex items-center justify-center text-[#666] hover:text-white">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5h12M3 9h12M3 13h8" strokeLinecap="round" /></svg>
        </button>
        <span className="text-[#FFD700]/80 text-sm" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Story Mode</span>
        {step !== 'select' && (
          <button
            onClick={() => step === 'reading' ? setStep('language') : reset()}
            className="ml-auto text-[#444] text-xs hover:text-[#888] transition-colors"
          >
            ← {step === 'reading' ? 'Change Language' : 'Stories'}
          </button>
        )}
      </div>

      {/* Step 1 — Story Selection */}
      {step === 'select' && (
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">📖</div>
            <h2 className="text-[#FFD700] text-3xl font-light mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Choose Your Story
            </h2>
            <p className="text-[#555] text-sm">Interactive tales from the Mahabharata and Ramayana</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {STORIES.map((story) => (
              <button
                key={story.id}
                onClick={() => handleStorySelect(story)}
                className="shortcut-card text-left p-5 rounded-2xl bg-[#141414] border border-white/5 hover:border-[#0F5C4D]/30 hover:bg-[#0F5C4D]/5"
              >
                <div className="text-2xl mb-3">{story.icon}</div>
                <div className="text-white text-sm font-semibold mb-1">{story.title}</div>
                <div className="text-[#555] text-xs leading-relaxed">{story.subtitle}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Language Selection */}
      {step === 'language' && selectedStory && (
        <div className="max-w-sm mx-auto px-6 py-10">
          <div className="text-center mb-8">
            <div className="text-3xl mb-3">{selectedStory.icon}</div>
            <h2 className="text-[#FFD700] text-2xl font-light mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {selectedStory.title}
            </h2>
            <p className="text-[#555] text-xs italic mb-6">{selectedStory.subtitle}</p>
            <p className="text-[#666] text-sm">Choose your language</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => startStory(lang)}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#141414] border border-white/5 hover:border-[#0F5C4D]/40 hover:bg-[#0F5C4D]/5 transition-all duration-200 group"
              >
                <span className="text-3xl">{lang.icon}</span>
                <div className="text-center">
                  <div className="text-white text-base font-semibold group-hover:text-[#FFD700] transition-colors"
                    style={{ fontFamily: lang.code === 'hi' ? 'Noto Serif Devanagari, serif' : 'inherit' }}>
                    {lang.label}
                  </div>
                  <div className="text-[#555] text-xs mt-0.5">{lang.sublabel}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 — Story Reading */}
      {step === 'reading' && (
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <span className="text-[#FFD700] text-xl mr-2">{selectedStory.icon}</span>
              <span className="text-[#FFD700] text-xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {selectedStory.title}
              </span>
              <p className="text-[#444] text-xs mt-1 italic">{selectedStory.setting}</p>
            </div>
            <span className="text-[#444] text-xs mt-1 flex-shrink-0">
              {selectedLang.icon} {selectedLang.label}
            </span>
          </div>

          {/* Story text */}
          <div className="space-y-4 mb-6">
            {chapters.map((chapter, i) => (
              <div key={i} className="text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap"
                style={{ fontFamily: selectedLang.code === 'hi' ? 'Noto Serif Devanagari, serif' : 'inherit' }}>
                {chapter}
              </div>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-2 text-[#0F5C4D] text-sm py-4">
              <ChakraLoader size="sm" />
              <span>{selectedLang.code === 'hi' ? 'कहानी जारी है…' : 'The story continues…'}</span>
            </div>
          )}

          {/* Choices */}
          {!loading && choices.length > 0 && (
            <div>
              <p className="text-[#444] text-xs uppercase tracking-widest mb-3">
                {selectedLang.code === 'hi' ? 'आगे क्या होगा?' : 'What happens next?'}
              </p>
              <div className="space-y-2">
                {choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => makeChoice(choice)}
                    className="w-full text-left px-4 py-3 rounded-xl bg-[#141414] border border-white/5 text-[#bbb] text-sm hover:border-[#0F5C4D]/30 hover:text-white hover:bg-[#0F5C4D]/5 transition-all duration-200"
                    style={{ fontFamily: selectedLang.code === 'hi' ? 'Noto Serif Devanagari, serif' : 'inherit' }}
                  >
                    <span className="text-[#0F5C4D] mr-2">{i + 1}.</span>{choice}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Story ended */}
          {!loading && choices.length === 0 && chapters.length > 0 && (
            <div className="text-center py-6">
              <p className="text-[#555] text-sm italic mb-4">
                {selectedLang.code === 'hi' ? '— कहानी समाप्त —' : '— The story concludes —'}
              </p>
              <button onClick={reset} className="px-6 py-3 rounded-xl bg-[#0F5C4D] text-white text-sm hover:bg-[#0d4f43] transition-colors">
                {selectedLang.code === 'hi' ? 'दूसरी कहानी पढ़ें' : 'Read Another Story'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

