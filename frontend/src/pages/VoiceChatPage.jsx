import ChakraLoader from '../components/ChakraLoader';
import { useState, useEffect, useRef } from 'react';
import { useSidebar } from '../context/SidebarContext';
import { useVoice, speak, stopSpeaking } from '../hooks/usevoice';
import { sendMessage } from '../utils/chatApi';

export default function VoiceChatPage() {
  const { setIsOpen } = useSidebar();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef(null);

  const { isListening, transcript, supported, startListening, stopListening } = useVoice({
    onResult: handleVoiceResult,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleVoiceResult(text) {
    if (!text.trim()) return;
    await handleSend(text);
  }

  const handleSend = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role === 'bot' ? 'model' : 'user', content: m.content }));
      const reply = await sendMessage(text, history);
      setMessages((prev) => [...prev, { role: 'bot', content: reply }]);

      if (autoSpeak) {
        setSpeaking(true);
        speak(reply, () => setSpeaking(false));
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', content: 'Parth… connection lost. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const handleStopSpeak = () => {
    stopSpeaking();
    setSpeaking(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0D0D0D] lg:pl-72 page-enter">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 flex-shrink-0">
        <button onClick={() => setIsOpen(true)} className="lg:hidden w-8 h-8 flex items-center justify-center text-[#666] hover:text-white">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5h12M3 9h12M3 13h8" strokeLinecap="round" /></svg>
        </button>
        <span className="text-[#FFD700]/80 text-sm" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Voice with Krishna</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[#444] text-xs">Auto-speak</span>
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${autoSpeak ? 'bg-[#0F5C4D]' : 'bg-[#222]'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${autoSpeak ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Browser support warning */}
      {!supported && (
        <div className="mx-4 mt-4 bg-[#FF7A00]/10 border border-[#FF7A00]/25 rounded-xl px-4 py-3 text-[#FF7A00] text-sm">
          Your browser does not support voice input. Please use Chrome or Edge for this feature.
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 px-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center page-enter">
            <div className="text-5xl mb-4">🎙️</div>
            <h2 className="text-[#FFD700] text-2xl mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Speak to Krishna
            </h2>
            <p className="text-[#444] text-sm max-w-xs">
              Press the microphone and speak your question. Madhav will reply and read it aloud.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-3'}`}>
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-[#0F5C4D]/15 border border-[#0F5C4D]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm">🦚</span>
              </div>
            )}
            <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#FF7A00] text-[#1a1a1a] rounded-tr-sm font-medium'
                : 'bg-[#0F5C4D]/10 border border-[#0F5C4D]/15 text-[#ddd] rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-[#0F5C4D]/15 border border-[#0F5C4D]/30 flex items-center justify-center">
              <span className="text-sm">🦚</span>
            </div>
            <ChakraLoader size="sm" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice controls */}
      <div className="px-4 pb-8 pt-4 flex flex-col items-center gap-4 flex-shrink-0">
        {/* Live transcript */}
        {isListening && transcript && (
          <div className="text-[#aaa] text-sm italic bg-[#141414] rounded-xl px-4 py-2 border border-white/5 max-w-sm text-center">
            "{transcript}"
          </div>
        )}

        <div className="flex items-center gap-6">
          {/* Mic button */}
          <button
            onClick={handleMicClick}
            disabled={!supported || loading}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center text-2xl
              transition-all duration-300 shadow-lg disabled:opacity-40
              ${isListening
                ? 'bg-[#FF7A00] shadow-[#FF7A00]/30 scale-110 animate-pulse'
                : 'bg-[#141414] border border-white/10 hover:border-white/20 hover:scale-105'
              }
            `}
            style={{ willChange: 'transform' }}
          >
            {isListening ? '🔴' : '🎙️'}
          </button>

          {/* Stop speaking */}
          {speaking && (
            <button
              onClick={handleStopSpeak}
              className="w-12 h-12 rounded-full bg-[#0F5C4D]/20 border border-[#0F5C4D]/30 flex items-center justify-center text-xl hover:bg-[#0F5C4D]/30 transition-colors"
            >
              ⏹️
            </button>
          )}
        </div>

        <p className="text-[#333] text-xs">
          {isListening ? 'Listening… tap to stop' : 'Tap to speak'}
        </p>
      </div>
    </div>
  );
}