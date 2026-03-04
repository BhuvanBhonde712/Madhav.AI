import { useState, useEffect, useRef, memo } from 'react';
import { Feather } from './Icons';/* ── Tokenize: split text preserving newlines ── */
function tokenize(text) {
  const tokens = [];
  text.split(/(\n)/).forEach((seg) => {
    if (seg === '\n') {
      tokens.push({ type: 'br' });
    } else {
      seg.split(' ').forEach((word, i) => {
        if (word) tokens.push({ type: 'word', content: word, addSpace: true });
      });
    }
  });
  return tokens;
}

/* ── Inline markdown: **bold**, *italic* ── */
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**'))
      return <strong key={i} className="text-[#FFD700]/90 font-semibold">{p.slice(2, -2)}</strong>;
    if (p.startsWith('*') && p.endsWith('*'))
      return <em key={i}>{p.slice(1, -1)}</em>;
    return p;
  });
}

/* ── Formatted final text ── */
function FormattedText({ text }) {
  const paragraphs = text.split(/\n\n+/);
  return (
    <div className="space-y-2">
      {paragraphs.map((para, pi) => (
        <p key={pi} className="leading-relaxed">
          {para.split('\n').map((line, li) => (
            <span key={li}>
              {li > 0 && <br />}
              {renderInline(line)}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

/* ── Streaming text: word-by-word with fade-in ── */
function StreamingText({ text, onDone }) {
  const [displayed, setDisplayed] = useState([]);
  const [done, setDone] = useState(false);
  const counterRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setDisplayed([]);
    setDone(false);
    counterRef.current = 0;
    const tokens = tokenize(text);

    const addNext = () => {
      const i = counterRef.current;
      if (i >= tokens.length) {
        setDone(true);
        onDone?.();
        return;
      }
      setDisplayed((prev) => [...prev, { ...tokens[i], key: i }]);
      counterRef.current++;
      timerRef.current = setTimeout(addNext, 16);
    };

    timerRef.current = setTimeout(addNext, 60);
    return () => clearTimeout(timerRef.current);
  }, [text]);

  if (done) return <FormattedText text={text} />;

  return (
    <span className="leading-relaxed">
      {displayed.map((t) =>
        t.type === 'br'
          ? <br key={t.key} />
          : <span key={t.key} className="word-stream">{t.content} </span>
      )}
      <span className="inline-block w-[2px] h-[13px] bg-[#0F5C4D] ml-0.5 animate-pulse align-middle" />
    </span>
  );
}

/* ── Main ChatBubble ── */
const ChatBubble = memo(function ChatBubble({ message, isBot, stream = false }) {
  const [streamDone, setStreamDone] = useState(false);

  useEffect(() => {
    if (!stream) setStreamDone(true);
    else setStreamDone(false);
  }, [stream, message]);

  if (!isBot) {
    return (
      <div className="flex justify-end px-4">
        <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm bg-[#FF7A00] text-[#1a1a1a] text-sm leading-relaxed font-medium shadow-lg shadow-[#FF7A00]/10">
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 px-4">
      <div className="w-8 h-8 rounded-full bg-[#0F5C4D]/15 border border-[#0F5C4D]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Feather className="w-4 h-4 text-[#0F5C4D]" />
      </div>
      <div className="max-w-[78%] px-4 py-3 rounded-2xl rounded-tl-sm bg-[#0F5C4D]/10 border border-[#0F5C4D]/15 text-[#ddd] text-sm shadow-sm">
        {stream && !streamDone
          ? <StreamingText text={message} onDone={() => setStreamDone(true)} />
          : <FormattedText text={message} />
        }
      </div>
    </div>
  );
});

export default ChatBubble;
