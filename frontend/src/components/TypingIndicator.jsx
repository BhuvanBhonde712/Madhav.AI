import { Chakra } from './Icons';

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 py-1">
      <Chakra className="w-5 h-5 text-[#0F5C4D] animate-spin" />
      <span className="text-[#444] text-xs">Madhav is reflecting…</span>
    </div>
  );
}
