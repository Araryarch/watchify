import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollButtonProps {
  direction: 'left' | 'right';
  visible: boolean;
  onClick: () => void;
}

export function ScrollButton({ direction, visible, onClick }: ScrollButtonProps) {
  if (!visible) return <div className="hidden lg:block shrink-0 w-12" />;

  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  const label = direction === 'left' ? 'Geser kiri' : 'Geser kanan';

  return (
    <div className="hidden lg:block shrink-0 w-12">
      <button
        onClick={onClick}
        aria-label={label}
        className="w-12 h-20 flex items-center justify-center text-white/40 hover:text-white transition-colors"
      >
        <Icon className="w-8 h-8" />
      </button>
    </div>
  );
}
