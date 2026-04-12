'use client';

import { useMe } from '@/lib/hooks/useAuth';
import { useUserDetail } from '@/lib/hooks/useUsers';
import { MessageSquare, Star, Film } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import { StatsCard } from '@/components/dashboard/stats-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminReviewsPage() {
  const { data: userData } = useMe();
  const userId = userData?.data?.personal_info?.id;
  const { data: userDetailData, isLoading } = useUserDetail(userId || '');
  const reviews = userDetailData?.data?.reviews || [];

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';
  const totalLikes = reviews.reduce((sum: number, r: any) => sum + (r.likes || 0), 0);

  return (
    <div className="flex-1 w-full bg-[#0b0c0f] font-sans text-white p-4 sm:p-6 lg:p-8 min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Typography variant="h2" className="text-3xl font-black mb-2 border-0 pb-0">Ulasan Saya</Typography>
          <Typography variant="p" className="text-neutral-400 mt-0">Lihat semua ulasan yang sudah Anda tulis</Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatsCard label="Total Reviews" value={totalReviews} icon={MessageSquare} />
          <StatsCard label="Avg Rating" value={avgRating} icon={Star} iconColor="text-yellow-400" />
          <StatsCard label="Total Likes" value={totalLikes} icon={Star} iconColor="text-green-400" />
        </div>

        <ReviewsTable reviews={reviews} isLoading={isLoading} />
      </div>
    </div>
  );
}
            <p className="text-3xl font-black text-white">{avgRating}</p>
          </div>
          <div className="bg-[#1b1c21] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm font-medium">Total Likes</span>
              <Star className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-black text-white">{totalLikes}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1b1c21] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-white/2 border-b border-white/5">
              <TableRow className="border-b-white/5 hover:bg-transparent">
                <TableHead className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest">Film</TableHead>
                <TableHead className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest">Rating</TableHead>
                <TableHead className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest">Comment</TableHead>
                <TableHead className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest">Likes</TableHead>
                <TableHead className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="border-b-white/5 hover:bg-transparent">
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-500 gap-3">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="font-medium text-sm">Memuat data...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : reviews.length > 0 ? (
                reviews.map((review: any, index: number) => (
                  <TableRow key={index} className="border-b-white/5 hover:bg-white/2 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4 text-neutral-500" />
                        <span className="font-bold text-white">
                          {review.film || 'Unknown Film'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-yellow-400">{review.rating}</span>
                        <span className="text-neutral-500 text-sm">/10</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 max-w-md">
                      <p className="text-sm text-neutral-300 line-clamp-2">{review.comment}</p>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm font-bold text-green-400">{review.likes || 0}</span>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <button 
                        className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        aria-label="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-b-white/5 hover:bg-transparent">
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-500 gap-3">
                      <MessageSquare className="w-12 h-12 text-neutral-600" />
                      <p>Belum ada reviews</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

import { ReviewsTable } from '@/components/dashboard/reviews-table';
