import { useState, useMemo } from 'react';
import { useSidebar } from '../context/SidebarContext';
import { MenuIcon } from '../components/Icons';
import QuizResult from '../components/QuizResult';

const QUESTIONS = [
  {
    q: 'When someone wrongs you deeply, your first instinct is to…',
    answers: [
      { text: 'Confront them in a fair, direct fight', char: 'A' },
      { text: 'Strike back — you have been wronged enough', char: 'K' },
      { text: 'Seek peaceful resolution before conflict', char: 'Y' },
      { text: 'Demand justice publicly — silence is complicity', char: 'D' },
      { text: 'Understand their motive before reacting', char: 'Kr' },
      { text: 'Hold your ground silently and wait', char: 'B' },
    ],
  },
  {
    q: 'Your greatest strength, in your own eyes, is…',
    answers: [
      { text: 'Unwavering focus and mastery of my craft', char: 'A' },
      { text: 'Loyalty to those who stood by me first', char: 'K' },
      { text: 'My moral compass — I always know right from wrong', char: 'Y' },
      { text: 'My fire — I never back down from injustice', char: 'D' },
      { text: 'Seeing the bigger picture when others are lost', char: 'Kr' },
      { text: 'Discipline — I have mastered my own mind', char: 'B' },
    ],
  },
  {
    q: 'Facing a moral dilemma at work, you…',
    answers: [
      { text: 'Do what your conscience demands, however hard', char: 'A' },
      { text: 'Stand by your team regardless — loyalty first', char: 'K' },
      { text: 'Find the most truthful, transparent solution', char: 'Y' },
      { text: 'Fight for what is fair, no matter who is uncomfortable', char: 'D' },
      { text: 'Play the long game for the greater outcome', char: 'Kr' },
      { text: 'Follow protocol — order matters above all', char: 'B' },
    ],
  },
  {
    q: 'Your closest friend betrays your trust. You…',
    answers: [
      { text: 'Feel hurt but give them a chance to explain', char: 'A' },
      { text: 'Cut them off — disloyalty is unforgivable to me', char: 'K' },
      { text: 'Forgive inwardly, but protect your heart', char: 'Y' },
      { text: 'Confront them head-on and demand accountability', char: 'D' },
      { text: 'Accept it as their path, not malice, and move on', char: 'Kr' },
      { text: 'Remain dignified — your honour does not depend on them', char: 'B' },
    ],
  },
  {
    q: 'When you fail at something important, you…',
    answers: [
      { text: 'Use it as fuel — next time I will be stronger', char: 'A' },
      { text: 'Wonder if fate has always been against me', char: 'K' },
      { text: 'Reflect on what dharmic principle I violated', char: 'Y' },
      { text: 'Refuse to accept it — I will rise again with fire', char: 'D' },
      { text: 'Detach from the result — I gave my best', char: 'Kr' },
      { text: 'Accept it stoically — suffering is part of duty', char: 'B' },
    ],
  },
  {
    q: 'People admire you most for your…',
    answers: [
      { text: 'Bravery and extraordinary skill', char: 'A' },
      { text: 'Generosity — you give to everyone who asks', char: 'K' },
      { text: 'Honesty and fairness in all things', char: 'Y' },
      { text: 'Fearless strength and refusal to be silenced', char: 'D' },
      { text: 'Calm wisdom and ability to guide others', char: 'Kr' },
      { text: 'Discipline and sacrifices you have made for others', char: 'B' },
    ],
  },
  {
    q: 'In a conflict, you are usually the one who…',
    answers: [
      { text: 'Steps forward to face it directly and boldly', char: 'A' },
      { text: 'Fights with everything you have, no retreat', char: 'K' },
      { text: 'Tries to negotiate first and find common ground', char: 'Y' },
      { text: 'Speaks the uncomfortable truth others are afraid to say', char: 'D' },
      { text: 'Sees a solution nobody else noticed', char: 'Kr' },
      { text: 'Maintains order and prevents total chaos', char: 'B' },
    ],
  },
  {
    q: 'Your deepest fear in life is…',
    answers: [
      { text: 'Losing your purpose or sense of dharmic duty', char: 'A' },
      { text: 'Never being accepted despite your true worth', char: 'K' },
      { text: 'Being forced to lie or compromise integrity', char: 'Y' },
      { text: 'Being helpless when those you love are harmed', char: 'D' },
      { text: 'The world descending into chaos without guidance', char: 'Kr' },
      { text: 'Breaking a promise or failing your sacred vow', char: 'B' },
    ],
  },
  {
    q: 'When you reflect on your life so far, you feel…',
    answers: [
      { text: 'Driven — there is still so much left to master', char: 'A' },
      { text: 'Proud but misunderstood — few truly see you', char: 'K' },
      { text: 'At peace — I have lived with truth', char: 'Y' },
      { text: 'Fierce — my battles have shaped my strength', char: 'D' },
      { text: 'Purposeful — everything is part of a larger plan', char: 'Kr' },
      { text: 'Duty-bound — I chose the hard path and held it', char: 'B' },
    ],
  },
  {
    q: 'What matters most to you above everything else?',
    answers: [
      { text: 'Mastering yourself and your chosen craft', char: 'A' },
      { text: 'Being someone people can completely count on', char: 'K' },
      { text: 'Living and dying with absolute integrity', char: 'Y' },
      { text: 'Justice — for yourself and everyone around you', char: 'D' },
      { text: 'The greater good, even if it costs you personally', char: 'Kr' },
      { text: 'Honour and duty, above comfort or self-interest', char: 'B' },
    ],
  },
];

/* Fisher-Yates shuffle */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage() {
  const { setIsOpen } = useSidebar();
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState({ A: 0, K: 0, Y: 0, D: 0, Kr: 0, B: 0 });
  const [result, setResult] = useState(null);
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);

  /* Shuffle answers fresh for every question */
  const shuffledAnswers = useMemo(
    () => shuffle(QUESTIONS[current]?.answers || []),
    [current]
  );

  const handleAnswer = (char) => {
    if (animating) return;
    setSelected(char);
    setAnimating(true);

    setTimeout(() => {
      const newScores = { ...scores, [char]: scores[char] + 1 };
      setScores(newScores);

      if (current + 1 >= QUESTIONS.length) {
        const winner = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
        setResult(winner);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
        setAnimating(false);
      }
    }, 350);
  };

  const restart = () => {
    setCurrent(0);
    setScores({ A: 0, K: 0, Y: 0, D: 0, Kr: 0, B: 0 });
    setResult(null);
    setSelected(null);
    setAnimating(false);
  };

  if (result) {
    const CHARS = {
      A:  { name: 'Arjuna',       color: '#4A90D9' },
      K:  { name: 'Karna',        color: '#F5A623' },
      Y:  { name: 'Yudhishthira', color: '#7ED321' },
      D:  { name: 'Draupadi',     color: '#D0021B' },
      Kr: { name: 'Krishna',      color: '#417505' },
      B:  { name: 'Bhishma',      color: '#9B9B9B' },
    };
    return <QuizResult charKey={result} char={CHARS[result]} onRestart={restart} />;
  }

  const progress = (current / QUESTIONS.length) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0D0D] lg:pl-72 page-enter">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 flex-shrink-0">
        <button onClick={() => setIsOpen(true)} className="lg:hidden w-8 h-8 flex items-center justify-center text-[#666] hover:text-white transition-colors">
          <MenuIcon className="w-5 h-5" />
        </button>
        <span className="text-[#FFD700]/80 text-sm" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Which Mahabharata Character Are You?
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#555] text-xs">Question {current + 1} of {QUESTIONS.length}</span>
            <span className="text-[#555] text-xs">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1 bg-[#1a1a1a] rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0F5C4D] to-[#FFD700] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h2
            className="text-white text-2xl font-light mb-8 text-center leading-relaxed"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {QUESTIONS[current].q}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shuffledAnswers.map((ans, i) => {
              const isSelected = selected === ans.char;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(ans.char)}
                  className={`
                    text-left p-4 rounded-2xl border transition-all duration-300 text-sm
                    ${isSelected
                      ? 'border-[#FFD700]/60 bg-[#FFD700]/8 text-white scale-[0.98]'
                      : 'border-white/5 bg-[#141414] text-[#bbb] hover:border-white/15 hover:bg-[#1a1a1a] hover:text-white'
                    }
                  `}
                  style={{ willChange: 'transform' }}
                >
                  <span className="leading-relaxed">{ans.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}