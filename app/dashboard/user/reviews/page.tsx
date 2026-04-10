'use client';

import { useMe } from '@/lib/hooks/useAuth';
import { useUserDetail } from '@/lib/hooks/useUsers';
import { Star, ArrowLeft, Film } from 'lucide-react';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ReviewsPage() {
  const { data: userData } = useMe();
  const userId = userData?.data?.personal_info?.id;
  const { data: userDetailData, isLoading } = useUserDetail(userId || '', { enabled: !!userId });
  const reviews = userDetailData?.data?.reviews || [];

  return (
    <div className="min-h-screen pt-24 pb-12 font-sans text-white px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/dashboard/user" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        <Typography variant="h2" className="text-3xl font-black mb-2 border-0 pb-0">Ulasan Saya</Typography>
        <Typography variant="p" className="text-neutral-400 mt-0">Lihat semua ulasan yang sudah Anda tulis</Typography>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-neutral-500 gap-3 py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-medium text-sm">Memuat data...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((review: any, index: number) => (
              <div key={index} className="bg-[#1b1c21] border border-white/5 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-white font-bold mb-2">{review.film}</p>
                    <div className="flex items-center gap-1 mb-2">
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
        ) : (
          <div className="bg-[#1b1c21] border border-white/5 rounded-xl p-12 text-center">
            <Star className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">Belum ada ulasan yang ditulis</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-[#1b1c21] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/2 border-b border-white/5">
            <TableRow className="border-b-white/5 hover:bg-transparent">
              <TableHead className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest">Film</TableHead>
              <TableHead className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest">Rating</TableHead>
              <TableHead className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest">Komentar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-b-white/5 hover:bg-transparent">
                <TableCell colSpan={3} className="h-48 text-center">
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
                    <div className="flex items-center gap-3">
                      <Film className="w-5 h-5 text-primary" />
                      <span className="font-bold text-white">{review.film}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-yellow-400 text-sm font-bold ml-2">{review.rating}/10</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <p className="text-gray-300 text-sm line-clamp-2">{review.comment}</p>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-b-white/5 hover:bg-transparent">
                <TableCell colSpan={3} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-neutral-500 gap-3">
                    <Star className="w-12 h-12 text-neutral-600" />
                    <p>Belum ada ulasan yang ditulis</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
