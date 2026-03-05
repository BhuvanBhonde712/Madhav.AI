import { useState, useRef, useCallback, useEffect } from 'react';

export function useVoice({ onResult, onEnd } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false); // track real-time state, not stale closure

  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SpeechRec);
    if (!SpeechRec) return;

    const recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onresult = (e) => {
      const t = Array.from(e.results).map((r) => r[0].transcript).join('');
      setTranscript(t);
      if (e.results[e.results.length - 1].isFinal) {
        onResult?.(t);
      }
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setIsListening(false);
      onEnd?.();
    };

    recognition.onerror = (e) => {
      console.warn('Speech recognition error:', e.error);
      isListeningRef.current = false;
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListeningRef.current) return; // use ref not state — no race condition
    setTranscript('');
    isListeningRef.current = true;
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Start error:', e);
      isListeningRef.current = false;
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    isListeningRef.current = false;
    setIsListening(false);
    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.warn('Stop error:', e);
    }
  }, []);

  return { isListening, transcript, supported, startListening, stopListening };
}

export function speak(text, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 0.8;
  utterance.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const deep = voices.find((v) =>
    v.name.toLowerCase().includes('male') ||
    v.name.toLowerCase().includes('david') ||
    v.name.toLowerCase().includes('raj')
  );
  if (deep) utterance.voice = deep;
  utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel();
}
