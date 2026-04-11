'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Bookmark, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Film } from '@/lib/api/films';
import { Typography } from '@/components/ui/typography';
import Image from 'next/image';

interface HeroCarouselProps {
  heroes: Film[];
}

export function HeroCarousel({ heroes }: HeroCarouselProps) {
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    if (heroes.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroes.length]);

  const nextHero = () => setCurrentHero((prev) => (prev + 1) % heroes.length);
  const prevHero = () =>
    setCurrentHero((prev) => (prev - 1 + heroes.length) % heroes.length);

  if (heroes.length === 0) {
    return <section className="relative h-[85vh] w-full bg-[#0b0c0f] animate-pulse" />;
  }

  return (
    <section className="relative h-[85vh] w-full bg-neutral-900 overflow-hidden group/hero">
      {heroes.map((film: any, idx: number) => (
        <div
          key={film.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === currentHero ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image Container */}
          <div className="absolute inset-0 w-full h-full">
            {/* Left gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c0f]/90 via-[#0b0c0f]/40 to-transparent z-10 w-full md:w-3/5" />
            {/* Bottom gradient to blend into content rows smoothly */}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0b0c0f] via-[#0b0c0f]/80 to-transparent z-10" />
            <Image
              src={
                film.images && film.images.length > 0
                  ? `https://film-management-api.labse.id/api/static/${film.images[0]}`
                  : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80'
              }
              alt={film.title}
              fill
              priority={idx === 0}
              quality={85}
              sizes="100vw"
              className="object-cover object-center"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80';
              }}
            />
          </div>

          {/* Hero Content (Vertically Centered on Left) */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center">
            <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-12 mt-16 md:mt-20">
              <div className="max-w-xl md:max-w-2xl space-y-4">
                {/* Title */}
                <Typography
                  variant="h1"
                  className="text-4xl md:text-6xl lg:text-[5.5rem] font-bold text-white leading-[1.1] drop-shadow-lg tracking-tight border-0 pb-0"
                >
                  {film.title}
                </Typography>

                {/* Badges Row 1 */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {film.average_rating && film.average_rating >= 8.0 && (
                    <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-sm">
                      TOP RATED
                    </span>
                  )}
                  {film.airing_status === 'airing' && (
                    <span className="px-2 py-0.5 bg-white/20 text-neutral-200 text-xs font-semibold rounded-sm backdrop-blur-sm">
                      Sedang Tayang
                    </span>
                  )}
                  {film.airing_status === 'finished' && (
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded-sm border border-primary/30">
                      Completed
                    </span>
                  )}
                  {!film.airing_status && (
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded-sm border border-primary/30">
                      Original
                    </span>
                  )}
                </div>

                {/* Metadata Row 2 */}
                <div className="flex items-center gap-3 text-white text-sm font-medium">
                  {film.average_rating !== undefined && film.average_rating > 0 && (
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="w-4 h-4 fill-primary" />
                      <span className="text-base">{film.average_rating.toFixed(1)}</span>
                    </div>
                  )}
                  {film.average_rating > 0 && <span className="text-neutral-300">|</span>}
                  <span>
                    {film.release_date
                      ? new Date(film.release_date).getFullYear()
                      : new Date().getFullYear()}
                  </span>
                  <span className="text-neutral-300">|</span>
                  <span>13+</span>
                  {film.total_episodes > 0 && (
                    <>
                      <span className="text-neutral-300">|</span>
                      <span>
                        {film.total_episodes}{' '}
                        {film.total_episodes === 1 ? 'Episode' : 'Episodes'}
                      </span>
                    </>
                  )}
                </div>

                {/* Synopsis */}
                {film.synopsis && (
                  <Typography
                    variant="p"
                    className="text-sm md:text-[15px] text-neutral-300 leading-relaxed line-clamp-3 max-w-xl drop-shadow-md"
                  >
                    {film.synopsis}
                  </Typography>
                )}

                {/* Genre Pills */}
                {film.genres && film.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {film.genres.slice(0, 4).map((genre: any) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/20"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Circular Action Buttons */}
                <div className="flex items-center gap-4 pt-4">
                  <Link href={`/film/${film.id}`}>
                    <button className="w-14 h-14 rounded-full bg-primary hover:brightness-90 text-primary-foreground flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-[0_4px_20px_rgba(var(--primary),0.4)]">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </button>
                  </Link>
                  <button className="w-14 h-14 rounded-full bg-[#1b1c21] hover:bg-neutral-700/80 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
                    <Bookmark className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows - show on hover */}
      <button
        onClick={prevHero}
        className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white z-30 transition-all opacity-0 group-hover/hero:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextHero}
        className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white z-30 transition-all opacity-0 group-hover/hero:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Carousel Indicators */}
      <div className="absolute bottom-[20%] right-4 sm:right-8 z-30 hidden md:flex gap-1.5">
        {heroes.map((_: any, idx: number) => (
          <button
            key={idx}
            onClick={() => setCurrentHero(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-sm transition-all duration-300 ${
              idx === currentHero ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

