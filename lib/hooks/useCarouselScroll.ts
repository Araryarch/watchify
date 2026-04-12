import { useRef, useState, useEffect } from 'react';

interface ScrollState {
  left: boolean;
  right: boolean;
}

export function useCarouselScroll(dataLength: number, isLoading: boolean) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<ScrollState>({ left: false, right: true });

  useEffect(() => {
    if (!isLoading && dataLength > 0) {
      const timeout = setTimeout(() => {
        if (scrollRef.current) {
          setScrollState({
            left: scrollRef.current.scrollLeft > 10,
            right: scrollRef.current.scrollWidth > scrollRef.current.clientWidth + 10,
          });
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [dataLength, isLoading]);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    setScrollState({
      left: scrollLeft > 10,
      right: Math.ceil(scrollLeft + clientWidth) < scrollWidth - 10,
    });
  };

  const slide = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = 190;
      const gap = 16;
      const scrollAmount = (cardWidth + gap) * 3;
      
      const targetScroll = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  return { scrollRef, scrollState, onScroll, slide };
}
