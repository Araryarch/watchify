import Link from 'next/link';
import { Construction, Sparkles } from 'lucide-react';

export function ComingSoonSection() {
  return (
    <main className="min-h-screen bg-[#0b0c0f] pt-16 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-6 py-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
              <Construction className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          Coming Soon
        </h1>

        <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-xl mx-auto">
          Fitur filter film berdasarkan genre sedang dalam pengembangan. 
          Kami sedang bekerja keras untuk menghadirkan pengalaman terbaik untuk Anda!
        </p>

        <div className="bg-[#1b1c21] border border-white/5 rounded-2xl p-6 sm:p-8 mt-8 text-left">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 text-center">
            Yang Akan Datang
          </h2>
          <ul className="space-y-3 text-sm sm:text-base text-neutral-300">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">✓</span>
              <span>Filter film berdasarkan genre favorit</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">✓</span>
              <span>Pencarian film yang lebih canggih</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">✓</span>
              <span>Sorting berdasarkan rating, tahun, dan popularitas</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">✓</span>
              <span>Rekomendasi film personal</span>
            </li>
          </ul>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/films"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-primary hover:bg-primary/90 text-black font-bold rounded-lg transition-all shadow-[0_4px_20px_rgba(0,220,116,0.3)]"
          >
            Lihat Semua Film
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-all border border-white/10"
          >
            Kembali ke Beranda
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-neutral-500 pt-4">
          Pantau terus update terbaru dari kami
        </p>
      </div>
    </main>
  );
}
