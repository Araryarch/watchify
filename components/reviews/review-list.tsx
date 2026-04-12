import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import { ReviewUserInfo } from './review-user-info';
import { useCreateReaction, useUpdateReaction } from '@/lib/hooks/useReactions';
import { useMe } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/store/authStore';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ReviewListProps {
  reviews: any[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  const { token } = useAuthStore();
  const { data: meData } = useMe();
  const currentUserId = meData?.data?.id;
  const { mutate: createReaction } = useCreateReaction();
  const { mutate: updateReaction } = useUpdateReaction();

  const getUserReaction = (review: any) => {
    if (!currentUserId || !review.reactions) return null;
    return review.reactions.find((r: any) => r.user_id === currentUserId);
  };

  const handleReaction = (review: any, status: 'like' | 'dislike') => {
    if (!token) {
      toast.error('Login terlebih dahulu untuk memberi reaksi');
      return;
    }

    const existingReaction = getUserReaction(review);
    
    if (existingReaction) {
      if (existingReaction.status === status) {
        toast.info('Anda sudah memberi reaksi ini');
        return;
      }
      
      updateReaction(
        { id: existingReaction.id, payload: { status } },
        {
          onSuccess: () => {
            toast.success(status === 'like' ? 'Diubah ke suka' : 'Diubah ke tidak suka');
          },
          onError: (e: any) => {
            toast.error(e.response?.data?.error || 'Gagal mengubah reaksi');
          },
        }
      );
    } else {
      createReaction(
        { review_id: review.id, status },
        {
          onSuccess: () => {
            toast.success(status === 'like' ? 'Disukai' : 'Tidak disukai');
          },
          onError: (e: any) => {
            let errorMsg = e.response?.data?.error || e.response?.data?.message || '';
            if (errorMsg.toLowerCase().includes('user has already reacted')) {
              errorMsg = errorMsg.replace(/user has/i, 'You have');
            }
            toast.error(errorMsg || 'Gagal memberi reaksi');
          },
        }
      );
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-[#1b1c21] border border-white/5 rounded-xl sm:rounded-2xl p-8 text-center text-neutral-400">
        <p className="text-sm">Belum ada ulasan untuk tayangan ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-bold text-white">Ulasan Pengguna ({reviews.length})</h3>
      <div className="space-y-4">
        {reviews.map((review: any) => {
          const userReaction = getUserReaction(review);
          const likeCount = review.reactions?.filter((r: any) => r.status === 'like').length || 0;
          const dislikeCount = review.reactions?.filter((r: any) => r.status === 'dislike').length || 0;

          return (
            <div key={review.id} className="bg-[#1b1c21] border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ReviewUserInfo user={review.user} />
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-yellow-400 text-xs sm:text-sm font-bold ml-1">{review.rating}/10</span>
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{review.comment}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleReaction(review, 'like')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs sm:text-sm font-medium ${
                          userReaction?.status === 'like'
                            ? 'bg-[#00dc74]/20 text-[#00dc74] border border-[#00dc74]/30'
                            : 'bg-white/5 text-neutral-400 hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{likeCount}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Suka</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleReaction(review, 'dislike')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs sm:text-sm font-medium ${
                          userReaction?.status === 'dislike'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-white/5 text-neutral-400 hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>{dislikeCount}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tidak suka</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
