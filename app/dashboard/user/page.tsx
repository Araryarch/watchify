'use client';

import { useMe } from '@/lib/hooks/useAuth';
import { useUserDetail } from '@/lib/hooks/useUsers';
import { User, List, Star, Settings, Film } from 'lucide-react';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography';

export default function UserDashboardPage() {
  const { data: userData } = useMe();
  const user = userData?.data;
  const userId = userData?.data?.id;
  
  // Get detailed user data including film_lists and reviews
  const { data: userDetailData } = useUserDetail(userId || '');
  const userDetail = userDetailData?.data;

  return (
    <div className="min-h-screen pb-12 font-sans text-white px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10 pt-8">
        <Typography variant="h2" className="text-3xl font-black mb-2 border-0 pb-0">Halo, {user?.display_name || user?.username}!</Typography>
        <Typography variant="p" className="text-neutral-400 mt-0">Selamat datang di panel dashboard personal Anda.</Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Info Card */}
        <div className="bg-[#1b1c21] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full border border-primary/30 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <Typography variant="h4" className="text-lg font-bold">{user?.username}</Typography>
              <Typography variant="p" className="text-sm text-neutral-400 mt-0">{user?.email}</Typography>
            </div>
          </div>
          {userDetail?.bio && (
            <p className="text-sm text-neutral-300 mb-4 italic">"{userDetail.bio}"</p>
          )}
          <Link href={`/user/${user?.id}`} className="block w-full py-2.5 text-center bg-white/5 hover:bg-white/10 rounded-lg text-sm font-bold transition-all border border-white/10">
            Lihat Profil Publik
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="bg-[#1b1c21] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div>
             <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4 border border-white/10">
               <List className="w-5 h-5 text-primary" />
             </div>
             <Typography variant="h4" className="text-lg font-bold mb-1">Daftar Tontonan</Typography>
             <Typography variant="p" className="text-sm text-neutral-400 mb-4 mt-0">
               {userDetail?.film_lists?.length || 0} film dalam daftar
             </Typography>
          </div>
          <Link href="/dashboard/user/film-lists" className="text-primary text-sm font-bold hover:underline">
             Kelola Daftar &rarr;
          </Link>
        </div>

        <div className="bg-[#1b1c21] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div>
             <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4 border border-white/10">
               <Star className="w-5 h-5 text-primary" />
             </div>
             <Typography variant="h4" className="text-lg font-bold mb-1">Ulasan Saya</Typography>
             <Typography variant="p" className="text-sm text-neutral-400 mb-4 mt-0">
               {userDetail?.reviews?.length || 0} ulasan ditulis
             </Typography>
          </div>
          <Link href="/dashboard/user/reviews" className="text-primary text-sm font-bold hover:underline">
             Lihat Ulasan &rarr;
          </Link>
        </div>
      </div>

      {/* Film Lists Section */}
      {userDetail?.film_lists && userDetail.film_lists.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h3" className="text-2xl font-bold border-0 pb-0">Daftar Tontonan Saya</Typography>
            <Link href="/dashboard/user/film-lists" className="text-primary text-sm font-bold hover:underline">
              Lihat Semua &rarr;
            </Link>
          </div>
          <div className="bg-[#1b1c21] border border-white/5 rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {userDetail.film_lists.slice(0, 3).map((item: any, index: number) => (
                <div key={index} className="p-4 hover:bg-white/2 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Film className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-white font-medium">{item.film_title}</p>
                      <p className="text-xs text-neutral-500 capitalize">{item.list_status.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {userDetail?.reviews && userDetail.reviews.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h3" className="text-2xl font-bold border-0 pb-0">Ulasan Saya</Typography>
            <Link href="/dashboard/user/reviews" className="text-primary text-sm font-bold hover:underline">
              Lihat Semua &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userDetail.reviews.slice(0, 2).map((review: any, index: number) => (
              <div key={index} className="bg-[#1b1c21] border border-white/5 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-white font-bold mb-1">{review.film}</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-yellow-400 text-sm font-bold ml-1">{review.rating}/10</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
