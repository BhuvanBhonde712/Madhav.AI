import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';
import { BowArrow, MenuIcon, QuizIcon, VerseIcon, KarmaIcon, StoryIcon } from '../components/Icons';
import { useSidebar } from '../context/SidebarContext';
import { sendMessage } from '../utils/chatApi';

const SHORTCUTS = [
  {
    title: 'Seek Guidance',
    sub: 'On a life dilemma',
    prompt: 'Madhav, I am facing a difficult situation and need dharmic guidance. Help me understand the right path.',
  },
  {
    title: 'Gita Wisdom',
    sub: 'Understand a teaching',
    prompt: 'Share a teaching from the Bhagavad Gita that is most relevant to dealing with modern life stress.',
  },
  {
    title: 'Dharma Story',
    sub: 'Learn through a tale',
    prompt: 'Tell me an inspiring story from the Mahabharata that teaches an important lesson about dharma.',
  },
  {
    title: 'What Would Krishna Do?',
    sub: 'Modern challenges',
    prompt: 'If Krishna were advising someone today who feels lost and overwhelmed by life, what would he say?',
  },
];

const FEATURE_LINKS = [
  { label: 'Find Your Character', path: '/quiz',        Icon: QuizIcon  },
  { label: 'Daily Verse',         path: '/daily-verse', Icon: VerseIcon },
  { label: 'Karma Check',         path: '/karma',       Icon: KarmaIcon },
  { label: 'Story Mode',          path: '/story',       Icon: StoryIcon },
];

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingIdx, setStreamingIdx] = useState(-1);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { setIsOpen } = useSidebar();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, loading]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');

    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content,
      }));
      const reply = await sendMessage(msg, history);
      setMessages((prev) => {
        const updated = [...prev, { role: 'bot', content: reply }];
        setStreamingIdx(updated.length - 1);
        return updated;
      });
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Parth… forgive me, the connection to the divine was broken. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0D0D0D] lg:pl-72">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 flex-shrink-0">
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden w-8 h-8 flex items-center justify-center text-[#666] hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        <span className="text-[#FFD700]/80 text-sm font-medium" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Madhav.ai
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {messages.length === 0 ? (
          <EmptyState onShortcut={handleSend} navigate={navigate} />
        ) : (
          <>
            {messages.map((msg, idx) => (
              <ChatBubble
                key={idx}
                message={msg.content}
                isBot={msg.role === 'bot'}
                stream={msg.role === 'bot' && idx === streamingIdx}
              />
            ))}
            {loading && (
              <div className="px-4 flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-[#0F5C4D]/15 border border-[#0F5C4D]/30 flex items-center justify-center flex-shrink-0">
                  <Feather className="w-4 h-4 text-[#0F5C4D]" />
                </div>
                <TypingIndicator />
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0">
        <div className="flex items-end gap-2 bg-[#141414] border border-white/8 rounded-2xl px-4 py-3 focus-within:border-[#0F5C4D]/50 transition-colors duration-200">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Madhav anything about dharma, life, or duty…"
            rows={1}
            className="flex-1 bg-transparent text-[#ddd] text-sm placeholder-[#444] resize-none outline-none leading-relaxed max-h-32 overflow-y-auto"
            style={{ scrollbarWidth: 'none' }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
              input.trim() && !loading
                ? 'bg-[#FF7A00] text-white hover:bg-[#e06900] shadow-lg shadow-[#FF7A00]/20'
                : 'text-[#333]'
            }`}
          >
            <BowArrow className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[#2a2a2a] text-[10px] mt-2">
          Madhav speaks from dharma. Always use your own judgment.
        </p>
      </div>
    </div>
  );
}

function EmptyState({ onShortcut, navigate }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 page-enter">
      <h2
        className="text-[#FFD700] text-3xl font-light mb-1 text-center"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
      >
        Speak, Parth
      </h2>
      <p className="text-[#444] text-sm mb-10 text-center">What do you seek today?</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xl mb-8">
        {SHORTCUTS.map((s, i) => (
          <button
            key={i}
            onClick={() => onShortcut(s.prompt)}
            className="shortcut-card text-left p-4 rounded-2xl bg-[#141414] border border-white/5 hover:border-[#0F5C4D]/40 hover:bg-[#0F5C4D]/5"
          >
            <div className="text-white text-sm font-medium mb-0.5">{s.title}</div>
            <div className="text-[#555] text-xs">{s.sub}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {FEATURE_LINKS.map((f) => (
          <button
            key={f.path}
            onClick={() => navigate(f.path)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141414] border border-white/5 hover:border-[#0F5C4D]/30 text-[#666] hover:text-[#aaa] text-xs transition-all duration-200"
          >
            <f.Icon className="w-3 h-3" />
            <span>{f.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// local feather for typing indicator
function Feather({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17" y1="15" x2="9" y2="15" />
    </svg>
  );
}
