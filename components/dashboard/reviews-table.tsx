import { Film, Star, Trash2, MessageSquare } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ReviewsTableProps {
  reviews: any[];
  isLoading: boolean;
}

export function ReviewsTable({ reviews, isLoading }: ReviewsTableProps) {
  return (
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
  );
}
