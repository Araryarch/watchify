'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from 'framer-motion';
import { ArrowDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';

/* ─────────────────────────────────────────────
   Scroll-driven word-by-word opacity reveal
   ───────────────────────────────────────────── */
function ScrollRevealText({
  text,
  className = '',
  offsetStart = 'start 0.9',
  offsetEnd = 'start 0.25',
}: {
  text: string;
  className?: string;
  offsetStart?: string;
  offsetEnd?: string;
}) {
  const container = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: [offsetStart, offsetEnd] as any,
  });

  const words = text.split(' ');

  return (
    <p ref={container} className={`relative flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return <RevealWord key={i} range={[start, end]} progress={scrollYProgress} word={word} />;
      })}
    </p>
  );
}

function RevealWord({ range, progress, word }: { range: [number, number]; progress: any; word: string }) {
  const opacity = useTransform(progress, range, [0.08, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] mt-1 inline-block will-change-[opacity] transition-none">
      {word}
    </motion.span>
  );
}

/* ─────────────────────────────────────────────
   Animated counter (easeOutQuart)
   ───────────────────────────────────────────── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    const dur = 2200;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Magnetic hover wrapper
   ───────────────────────────────────────────── */
function Magnetic({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    ref.current.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)';
  }, []);

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`transition-transform duration-300 ease-out ${className}`}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Stagger-in children wrapper
   ───────────────────────────────────────────── */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 25, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any } },
};

/* ═══════════════════════════════════════════════
   ABOUT PAGE
   ═══════════════════════════════════════════════ */
export default function AboutPage() {
  // Global scroll progress for the thin bar
  const { scrollYProgress: pageProgress } = useScroll();

  // Hero parallax
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);
  const heroY = useTransform(heroP, [0, 0.7], [0, 120]);

  // Timeline horizontal scroll
  const tlRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: tlP } = useScroll({ target: tlRef });
  const tlX = useTransform(tlP, [0, 1], ['2%', '-82%']);
  const tlXSmooth = useSpring(tlX, { stiffness: 50, damping: 20, restDelta: 0.001 });

  const milestones = [
    { year: '2020', title: 'The Spark', body: 'Three engineers in a Jakarta garage dared to dream: cinema without borders, accessible to everyone.', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80' },
    { year: '2021', title: 'Public Beta', body: '14 months of stealth development. Then, launch day — 10 000 users in the first 72 hours.', img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80' },
    { year: '2022', title: 'One Million', body: 'The community exploded. 1M active subscribers and 200+ features shipped in a single year.', img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80' },
    { year: '2023', title: 'Global Reach', body: '190 countries. 30 languages. From Seoul to São Paulo, stories now travel without passports.', img: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&q=80' },
    { year: '2024', title: 'Originals', body: 'Our first original film premiered at TIFF. Three productions, two festivals, one standing ovation.', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80' },
    { year: 'Now', title: '10 Million', body: 'A decade\'s worth of growth in five years. 10M users. 50K titles. And this is still just the opening scene.', img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&q=80' },
  ];

  return (
    <div className="relative bg-[var(--background)] text-[var(--foreground)]" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}>

      {/* ─── Scroll progress indicator ─── */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[999] origin-left" style={{ scaleX: pageProgress }} />

      {/* ═══════════════════════════════════
          HERO — Full viewport, text-only, editorial
          ═══════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[100svh] flex items-center justify-center overflow-hidden">
        {/* Dot pattern subtle bg */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 max-w-[64rem] mx-auto px-6 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col items-center">
            {/* Overline */}
            <motion.span variants={staggerItem} className="inline-block text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-[var(--muted-foreground)] font-medium border border-[var(--border)] px-5 py-2.5 rounded-full mb-10">
              Didirikan 2020 — Jakarta, Indonesia
            </motion.span>

            {/* Main title */}
            <motion.h1 variants={staggerItem} className="text-[clamp(2.6rem,7.5vw,7.5rem)] font-black leading-[0.92] tracking-[-0.045em] mb-8">
              Kami percaya pada
              <br />
              <span className="text-primary inline-block relative">
                kekuatan cerita
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-[2px] md:h-[3px] bg-primary/40 origin-left"
                />
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p variants={staggerItem} className="text-base sm:text-lg md:text-xl text-[var(--muted-foreground)] max-w-xl mx-auto leading-relaxed font-normal">
              Watchify adalah platform streaming generasi baru yang menghubungkan penonton dengan sinema berkelas dunia — dari film independen hingga premiere global.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
          <span className="text-[9px] tracking-[0.4em] uppercase text-[var(--muted-foreground)] font-medium">Gulir</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
            <ArrowDown className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════
          PHILOSOPHY — Scroll-reveal paragraph
          ═══════════════════════════════════ */}
      <section className="relative py-40 md:py-60">
        <div className="max-w-[56rem] mx-auto px-6">
          <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="block text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-primary font-semibold mb-14">
            Filosofi Kami
          </motion.span>

          <ScrollRevealText
            text="Kami tidak hanya menyajikan konten — kami mengkurasi pengalaman. Setiap frame, setiap cerita, setiap emosi dipilih dengan cermat untuk membawa Anda ke dunia di luar imajinasi. Teknologi harus menghilang. Hanya cerita yang tersisa."
            className="text-[clamp(1.4rem,3.8vw,3.2rem)] font-semibold leading-[1.25] tracking-[-0.02em]"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════
          STATS — Minimal grid with animated counters
          ═══════════════════════════════════ */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 border border-[var(--border)] rounded-2xl overflow-hidden">
            {[
              { value: 10, suffix: 'Jt+', label: 'Pengguna', sub: 'di seluruh dunia' },
              { value: 50, suffix: 'Rb+', label: 'Konten', sub: 'film & series' },
              { value: 190, suffix: '+', label: 'Negara', sub: 'jangkauan global' },
              { value: 4, suffix: '.9', label: 'Rating', sub: 'dari 5' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`relative p-8 md:p-12 text-center ${i > 0 ? 'border-l border-[var(--border)]' : ''} ${i >= 2 ? 'border-t lg:border-t-0' : ''}`}
              >
                <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.03em] mb-2 tabular-nums">
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm font-semibold mb-0.5">{s.label}</div>
                <div className="text-xs text-[var(--muted-foreground)]">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          VISUAL — Full-bleed cinematic image
          ═══════════════════════════════════ */}
      <section className="relative my-12 md:my-20">
        {/* Image */}
        <div className="relative h-[60vh] md:h-[80vh] overflow-hidden mx-4 md:mx-8 rounded-3xl">
          <motion.img
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070"
            alt="Cinematic experience at Watchify"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.15 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

          {/* Copy on image */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 lg:p-20">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(1.6rem,4.5vw,3.8rem)] font-bold leading-[1.1] tracking-[-0.03em] max-w-3xl text-white"
            >
              Sinema bukan hanya hiburan.
              <br />
              <span className="text-primary">Ini cara kita memahami satu sama lain.</span>
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          TWO-COLUMN — Mission details
          ═══════════════════════════════════ */}
      <section className="relative py-24 md:py-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7 }}>
              <h3 className="text-xl md:text-2xl font-bold mb-5 leading-snug">
                Dibuat oleh pecinta film,<br />untuk pecinta film.
              </h3>
              <p className="text-[var(--muted-foreground)] text-base leading-[1.8]">
                Tim kami terdiri dari pembuat film, insinyur, dan pencerita yang hidup dan bernapas sinema.
                Kami terobsesi dengan detail — dari streaming akurat warna hingga playlist yang dikurasi dengan sempurna.
                Setiap piksel, setiap transisi, setiap rekomendasi dibuat dengan niat yang jelas.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: 0.12 }}>
              <h3 className="text-xl md:text-2xl font-bold mb-5 leading-snug">
                Teknologi yang<br />tidak terlihat.
              </h3>
              <p className="text-[var(--muted-foreground)] text-base leading-[1.8]">
                Kami menggunakan adaptive bitrate streaming, edge computing di 80+ lokasi, dan rekomendasi AI yang cerdas.
                Hasilnya? Tanpa buffering, pemutaran instan, dan saran yang benar-benar memahami selera Anda.
                Anda tidak akan pernah menyadari teknologinya — hanya keajaiban di layar.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          TIMELINE — Horizontal scroll journey
          ═══════════════════════════════════ */}
      <section className="relative border-t border-[var(--border)]">
        {/* Section header */}
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex items-end justify-between gap-8">
            <div>
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-primary font-semibold mb-4">Timeline</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05]">
                Every year,<br />a new chapter.
              </h2>
            </div>
            <p className="hidden md:block text-[var(--muted-foreground)] text-sm max-w-[16rem] text-right leading-relaxed">
              Scroll to travel through the milestones that shaped Watchify into what it is today.
            </p>
          </motion.div>
        </div>

        {/* Scroll area */}
        <div ref={tlRef} className="relative h-[450vh]">
          <div className="sticky top-0 h-screen overflow-hidden flex items-center">
            {/* Gradient masks */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-[var(--background)] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-[var(--background)] to-transparent z-20 pointer-events-none" />

            <motion.div style={{ x: tlXSmooth }} className="flex items-stretch gap-5 md:gap-7 pl-8 md:pl-24 pr-[60vw]">
              {milestones.map((m, i) => (
                <article key={i} className="relative flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[44vw] lg:w-[36vw] h-[65vh] md:h-[70vh] group rounded-2xl overflow-hidden cursor-default">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={m.img}
                      alt={m.title}
                      className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.08]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-8 md:p-10">
                    {/* Top */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-primary bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">{m.year}</span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-medium bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
                        {String(i + 1).padStart(2, '0')} / {String(milestones.length).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Bottom */}
                    <div>
                      <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[1] mb-4 text-white drop-shadow-lg">
                        {m.title}
                      </h3>
                      <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-md">
                        {m.body}
                      </p>
                    </div>
                  </div>

                  {/* Hover line accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          VALUES — Numbered list, left-right layout
          ═══════════════════════════════════ */}
      <section className="relative py-32 md:py-48 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-20">
            {/* Left sticky heading */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-primary font-semibold mb-4">Principles</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05]">
                What we<br />stand for.
              </h2>
            </div>

            {/* Right — values list */}
            <div>
              {[
                { n: '01', t: 'Accessibility First', b: 'Great stories shouldn\'t be gatekept. Tiered pricing, 30+ subtitle languages, and audio descriptions ensure no one is left out.' },
                { n: '02', t: 'Uncompromising Quality', b: '4K HDR, Dolby Atmos, color-accurate grading. We refuse to cut corners on the viewing experience. Every pixel matters.' },
                { n: '03', t: 'Creator Empowerment', b: 'Direct partnerships with independent filmmakers and studios — fair revenue sharing and creative freedom the industry rarely provides.' },
                { n: '04', t: 'Privacy by Design', b: 'Your watch history is yours. We don\'t sell data. Our recommendation engine prioritizes on-device processing whenever possible.' },
                { n: '05', t: 'Community Driven', b: 'User-voted features, community film festivals, open roadmaps. Our users aren\'t subscribers — they\'re co-creators.' },
              ].map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group py-8 md:py-10 border-b border-[var(--border)] first:border-t last:border-b-0"
                >
                  <div className="flex items-start gap-6 md:gap-8">
                    <span className="text-xs text-[var(--muted-foreground)] font-mono pt-1.5 flex-shrink-0 w-6">{v.n}</span>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold mb-2.5 group-hover:text-primary transition-colors duration-300">{v.t}</h3>
                      <p className="text-[var(--muted-foreground)] text-sm md:text-base leading-[1.7] max-w-2xl">{v.b}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FINAL CTA — Cinematic close
          ═══════════════════════════════════ */}
      <section className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden border-t border-[var(--border)]">
        {/* Atmospheric glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[700px] aspect-square bg-primary/[0.07] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-[var(--muted-foreground)] font-medium mb-10">
              The next chapter starts with you
            </span>

            <h2 className="text-[clamp(2.2rem,6vw,6.5rem)] font-black leading-[0.92] tracking-[-0.045em] mb-8">
              Ready to
              <br />
              <span className="text-primary">press play?</span>
            </h2>

            <p className="text-base md:text-lg text-[var(--muted-foreground)] max-w-lg mx-auto mb-12 leading-relaxed">
              Join 10 million people who chose a smarter, more beautiful way to experience cinema.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Magnetic>
                <Link href="/register" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full transition-shadow text-sm hover:shadow-[0_0_40px_rgba(0,220,116,0.35)]">
                  Start Watching Free
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/films" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-full transition-colors text-sm border border-[var(--border)] hover:border-[var(--foreground)]/30 hover:bg-[var(--foreground)]/[0.03]">
                  Browse Catalog
                </Link>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
