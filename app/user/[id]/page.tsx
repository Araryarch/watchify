'use client';

import { useParams } from 'next/navigation';
import { useUserDetail } from '@/lib/hooks/useUsers';
import { BookOpen, Star, List, User } from 'lucide-react';
import Link from 'next/link';

export default function UserProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading } = useUserDetail(id);
  const user = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0c0f] pt-16 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#00dc74] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0c0f] pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl font-black text-[#00dc74] mb-4">404</p>
          <h2 className="text-2xl font-bold text-white mb-2">Pengguna tidak ditemukan</h2>
          <p className="text-neutral-400 text-sm">Profil yang Anda cari tidak tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c0f] pt-20 font-sans text-white">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00dc74]/30 to-[#00dc74]/10 border-2 border-[#00dc74]/30 flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 text-[#00dc74]" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-black text-white mb-1">{user.display_name || user.username}</h1>
            <p className="text-neutral-400 text-sm mb-3">@{user.username}</p>
            {user.bio && (
              <p className="text-neutral-300 text-sm max-w-lg leading-relaxed">{user.bio}</p>
            )}
            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <List className="w-4 h-4 text-[#00dc74]" />
                <span className="text-neutral-400">Daftar Tonton:</span>
                <span className="font-bold text-white">{user.film_lists?.length ?? 0}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-[#00dc74]" />
                <span className="text-neutral-400">Ulasan:</span>
                <span className="font-bold text-white">{user.reviews?.length ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Film List */}
          <div>
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <List className="w-5 h-5 text-[#00dc74]" /> Daftar Tonton
            </h2>
            {user.film_lists && user.film_lists.length > 0 ? (
              <div className="space-y-3">
                {user.film_lists.map((item: any, i: number) => (
                  <div key={i} className="bg-[#1b1c21] border border-white/5 rounded-xl px-5 py-4 flex items-center justify-between">
                    <span className="font-medium text-white text-sm line-clamp-1">{item.film_title}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ml-3 flex-shrink-0 ${
                      item.list_status === 'watching'
                        ? 'bg-[#00dc74]/10 text-[#00dc74] border-[#00dc74]/20'
                        : item.list_status === 'completed'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : item.list_status === 'dropped'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-white/5 text-neutral-400 border-white/10'
                    }`}>
                      {item.list_status === 'watching' ? 'Menonton'
                        : item.list_status === 'completed' ? 'Selesai'
                        : item.list_status === 'plan_to_watch' ? 'Ingin Nonton'
                        : 'Berhenti'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#1b1c21] border border-white/5 rounded-xl px-5 py-8 text-center text-neutral-500 text-sm">
                Belum ada film dalam daftar tonton.
              </div>
            )}
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#00dc74]" /> Ulasan
            </h2>
            {user.reviews && user.reviews.length > 0 ? (
              <div className="space-y-4">
                {user.reviews.map((review: any, i: number) => (
                  <div key={i} className="bg-[#1b1c21] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-white text-sm line-clamp-1">{review.film}</p>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-yellow-400 font-bold text-sm">{review.rating}</span>
                        <span className="text-neutral-500 text-xs">/10</span>
                      </div>
                    </div>
                    <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#1b1c21] border border-white/5 rounded-xl px-5 py-8 text-center text-neutral-500 text-sm">
                Belum ada ulasan yang ditulis.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
