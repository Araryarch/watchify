import { FilmCard } from '@/components/film-card';
import { Typography } from '@/components/ui/typography';
import { ChevronRight } from 'lucide-react';
import { ScrollButton } from './scroll-button';
import { useCarouselScroll } from '@/lib/hooks/useCarouselScroll';

interface FilmSectionProps {
  title: string;
  films: any[];
  ariaLabel: string;
  className?: string;
}

export function FilmSection({ title, films, ariaLabel, className = '' }: FilmSectionProps) {
  const { scrollRef, scrollState, onScroll, slide } = useCarouselScroll(films.length, false);

  return (
    <section className={`w-full ${className}`} aria-label={ariaLabel}>
      <div className="max-w-400 mx-auto px-6 lg:px-12">
        <div className="w-full flex items-center gap-2">
          <div className="hidden lg:block shrink-0 w-12" />
          <header className="flex-1 flex items-center justify-between mb-4">
            <Typography 
              variant="h3" 
              className="text-xl md:text-2xl font-bold text-white flex items-center gap-1 hover:text-primary cursor-pointer transition-colors border-0 pb-0"
            >
              {title} <ChevronRight className="w-6 h-6 text-neutral-400" aria-hidden="true" />
            </Typography>
          </header>
          <div className="hidden lg:block shrink-0 w-12" />
        </div>

        <div className="w-full flex items-center gap-2">
          <ScrollButton 
            direction="left" 
            visible={scrollState.left} 
            onClick={() => slide('left')} 
          />

          <div 
            ref={scrollRef} 
            onScroll={onScroll} 
            role="list" 
            className="flex-1 flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pt-10 pb-48 -mb-40" 
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {films.map((film: any) => (
              <div 
                role="listitem" 
                key={film.id || film.title} 
                className="shrink-0 w-35 sm:w-40 md:w-42.5 lg:w-47.5" 
                style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
              >
                <FilmCard film={film} />
              </div>
            ))}
            <div className="shrink-0 w-4" aria-hidden="true" />
          </div>

          <ScrollButton 
            direction="right" 
            visible={scrollState.right} 
            onClick={() => slide('right')} 
          />
        </div>
      </div>
    </section>
  );
}
