import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  readonly?: boolean;
}

export function StarRating({ value, onChange, readonly = false }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  if (readonly) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
          <Star
            key={n}
            className={`w-5 h-5 ${
              n <= value ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-600'
            }`}
          />
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm font-bold text-yellow-400 self-center">{value}/10</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          aria-label={`Rate ${n} out of 10`}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              n <= (hover || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-neutral-600'
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-bold text-yellow-400 self-center">{value}/10</span>
      )}
    </div>
  );
}
