import { useNavigate } from 'react-router-dom';

const DHARMA_GUIDE = {
  A: {
    tagline: 'The Focused Warrior',
    description:
      'You are driven by purpose, defined by courage, and guided by duty. Like Arjuna, your greatest gift is the ability to focus completely when it matters most.',
    positives: [
      'Extraordinary focus and dedication to your craft',
      'Courage to stand for what is right, even alone',
      'Deep sense of dharmic duty — you take responsibility seriously',
      'Loyal to those who depend on you',
    ],
    avoid: [
      'Self-doubt at the crucial moment — Arjuna nearly abandoned his dharma on the battlefield because of attachment. When duty calls, hesitation is itself adharma.',
      'Attachment to outcomes — fight for what is right, but release the result. Anxiety about winning makes warriors lose.',
      'Letting emotion paralyze action — compassion is noble, but when dharma demands action, act.',
    ],
    krishna:
      "Parth… your bow is your purpose. The moment you doubt it, the arrows lose their path. Pick up your Gandiva and act — not for glory, but because dharma demands it of you.",
  },
  K: {
    tagline: 'The Loyal Warrior',
    description:
      'You are generous to a fault, fiercely loyal, and deeply misunderstood. Like Karna, your worth is not always recognized — but you give everything anyway.',
    positives: [
      'Generosity without conditions — you give even when it costs you',
      'Unshakeable loyalty to those who believed in you',
      'Immense skill and willpower forged through hardship',
      'You never refuse someone in genuine need',
    ],
    avoid: [
      'Choosing personal loyalty over dharma — Karna\'s greatest tragedy was fighting for Duryodhana knowing it was adharma. True loyalty means telling the truth, not enabling wrong.',
      'Letting ego and wounded pride drive your decisions — Karna could have walked away from a wrong war. Pride kept him. Pride will keep you too, if you let it.',
      'Holding grudges that poison your path — carrying every past wound makes the future heavier.',
    ],
    krishna:
      "Parth… your heart is pure gold, but gold must be used for dharma, not buried in pride. Loyalty that enables adharma is not devotion — it is destruction dressed in love.",
  },
  Y: {
    tagline: 'The Righteous King',
    description:
      'You live by truth and fairness above all else. Like Yudhishthira, you are the moral anchor of everyone around you — but that weight can be heavy.',
    positives: [
      'Uncompromising honesty — your word is your bond',
      'Deep sense of justice and fairness in all things',
      'Patience and wisdom in complex situations',
      'Others trust you completely with their problems',
    ],
    avoid: [
      'Pride disguised as honour — Yudhishthira gambled away his kingdom and family to satisfy his "honour" as a king. Asking yourself \'is this truly right, or just comfortable for my ego?\' before big decisions.',
      'Excessive patience that enables injustice — being righteous does not mean being passive. Sometimes dharma requires bold, uncomfortable action now, not later.',
      'Using "this is the honourable path" as an excuse to avoid hard choices that would help others.',
    ],
    krishna:
      "Parth… truth is your armour, and a noble one. But remember — a king\'s first dharma is protecting those in his care, not protecting his reputation as a righteous man.",
  },
  D: {
    tagline: 'The Fierce Protector',
    description:
      'You are brilliant, strong, and absolutely unwilling to accept injustice. Like Draupadi, your fire is your greatest weapon — and your greatest test.',
    positives: [
      'Extraordinary inner strength and fearlessness',
      'You speak truth when everyone else is silent',
      'Fierce love for those you protect',
      'You fight for dignity — your own and others\'',
    ],
    avoid: [
      'Letting righteous anger consume your compassion — Draupadi\'s pain was completely valid, but when she demanded revenge even after victory, it threatened to undo what was won. Fire that cannot be controlled burns everything, including the good.',
      'Seeking vengeance where justice has already been served — know when the fight is over.',
      'Pride at the wrong moment — strength is beautiful, but wisdom knows when to be soft.',
    ],
    krishna:
      "Parth… your fire lights the world. But the highest form of strength is knowing when to burn and when to become the warmth that heals. Justice completes the fire — revenge only spreads it.",
  },
  Kr: {
    tagline: 'The Strategic Guide',
    description:
      'You see what others cannot, feel what others overlook, and guide with a wisdom that runs deeper than logic. Like Krishna, you carry the weight of the whole with a smile.',
    positives: [
      'Vision and wisdom that sees the full picture',
      'Ability to remain calm and centred in all storms',
      'Deep compassion under apparent detachment',
      'You guide others to their own dharma without forcing it',
    ],
    avoid: [
      'Using strategy in ways that confuse or hurt those closest to you — Krishna\'s half-truths, though in service of dharma, made him seem untrustworthy to those who could not see the full plan. Share your vision with others; not everyone can follow what they cannot see.',
      'Becoming so detached that you miss genuine human connection — wisdom without warmth becomes coldness.',
      'Assuming you always know best without listening — even the wisest guide must stay humble.',
    ],
    krishna:
      "Parth… I exist in all things, and I see through all eyes. Use your wisdom not to stand above others, but to kneel beside them when they cannot stand. That is the highest dharma of the guide.",
  },
  B: {
    tagline: 'The Disciplined Protector',
    description:
      'You are the pillar others lean on — disciplined, self-mastered, and bound by your word with absolute devotion. Like Bhishma, your sacrifice is your identity.',
    positives: [
      'Self-mastery and discipline that most people cannot achieve',
      'Absolute reliability — when you give your word, it is given',
      'Deep wisdom earned through years of sacrifice',
      'You protect others even at great personal cost',
    ],
    avoid: [
      'Using oath and duty as a shield to avoid speaking truth — Bhishma\'s greatest failure was silence. He watched the dice game, the humiliation of Draupadi, the injustice of the Kauravas — and stayed silent because of his vow. Silence in the face of adharma is itself adharma.',
      'Blind oath-keeping that enables injustice — no vow to any person stands above the vow to dharma itself. When your commitment serves adharma, it must be questioned.',
      'Confusing discipline with inflexibility — wisdom adapts. Rigidity breaks.',
    ],
    krishna:
      "Parth… your strength to keep your word is rare and noble. But remember this — the highest vow any soul can make is the vow to protect dharma. No oath given to any man stands above it. Not even mine.",
  },
};

export default function QuizResult({ charKey, char, onRestart }) {
  const navigate = useNavigate();
  const guide = DHARMA_GUIDE[charKey];

  const handleShare = () => {
    const text = `I took the Madhav.ai Mahabharata Character Quiz and I am ${char.emoji} ${char.name} — ${guide.tagline}! Discover your character at madhav-ai.vercel.app`;
    if (navigator.share) {
      navigator.share({ title: 'My Mahabharata Character', text });
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] lg:pl-72 page-enter">
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Result card */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{char.emoji}</div>
          <p className="text-[#555] text-sm mb-1 uppercase tracking-widest">You are</p>
          <h1
            className="text-[#FFD700] text-5xl font-light mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {char.name}
          </h1>
          <p className="text-[#aaa] text-lg italic">{guide.tagline}</p>
        </div>

        <p className="text-[#ccc] text-sm leading-relaxed mb-8 text-center bg-[#141414] border border-white/5 rounded-2xl px-5 py-4">
          {guide.description}
        </p>

        {/* Positive traits */}
        <div className="mb-6">
          <h3 className="text-[#0F5C4D] text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>✦</span> Your Dharmic Strengths
          </h3>
          <ul className="space-y-2">
            {guide.positives.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm text-[#bbb]">
                <span className="text-[#0F5C4D] mt-0.5 flex-shrink-0">→</span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Dharma warnings */}
        <div className="mb-8">
          <h3 className="text-[#FF7A00] text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>⚠</span> Mistakes to Avoid — Dharma Lessons
          </h3>
          <ul className="space-y-3">
            {guide.avoid.map((a, i) => (
              <li key={i} className="bg-[#FF7A00]/5 border border-[#FF7A00]/15 rounded-xl px-4 py-3 text-sm text-[#bbb] leading-relaxed">
                <span className="text-[#FF7A00] font-semibold">{i + 1}. </span>{a}
              </li>
            ))}
          </ul>
        </div>

        {/* Krishna's message */}
        <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-2xl px-5 py-4 mb-8">
          <p className="text-[#FFD700]/60 text-xs uppercase tracking-widest mb-2">Krishna says to you</p>
          <p className="text-[#FFD700]/90 text-sm italic leading-relaxed">"{guide.krishna}"</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleShare}
            className="flex-1 py-3 rounded-xl bg-[#0F5C4D] text-white text-sm font-medium hover:bg-[#0d4f43] transition-colors"
          >
            Share My Result
          </button>
          <button
            onClick={onRestart}
            className="flex-1 py-3 rounded-xl border border-white/10 text-[#888] text-sm hover:bg-white/5 hover:text-white transition-all"
          >
            Retake Quiz
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 rounded-xl border border-[#FF7A00]/20 text-[#FF7A00]/80 text-sm hover:bg-[#FF7A00]/5 transition-all"
          >
            Chat with Madhav
          </button>
        </div>
      </div>
    </div>
  );
}