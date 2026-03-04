import { Chakra } from './Icons';

export default function ChakraLoader({ size = 'md', text = '' }) {
  const sizes = {
    sm:  'w-5 h-5',
    md:  'w-8 h-8',
    lg:  'w-12 h-12',
    xl:  'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Chakra
        className={`${sizes[size]} text-[#0F5C4D] animate-spin`}
        style={{ animationDuration: '1.2s', animationTimingFunction: 'linear' }}
      />
      {text && (
        <p className="text-[#555] text-xs tracking-wide">{text}</p>
      )}
    </div>
  );
}