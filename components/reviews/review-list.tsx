import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import { ReviewUserInfo } from './review-user-info';
import { useCreateReaction, useUpdateReaction } from '@/lib/hooks/useReactions';
import { useMe } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ReviewListProps {
  reviews: any[];
  filmId: string;
}

export function ReviewList({ reviews, filmId }: ReviewListProps) {
  const { token } = useAuthStore();
  const { data: meData } = useMe();
  const currentUserId = meData?.data?.personal_info?.id;
  const { mutate: createReaction } = useCreateReaction(filmId);
  const { mutate: updateReaction } = useUpdateReaction(filmId);
  const queryClient = useQueryClient();

  const getUserReaction = (review: any) => {
    if (!currentUserId || !review.reactions) return null;
    return review.reactions.find((r: any) => r.user_id === currentUserId);
  };

  const handleReaction = async (review: any, status: 'like' | 'dislike') => {
    if (!token) {
      toast.error('Login terlebih dahulu untuk memberi reaksi');
      return;
    }

    const existingReaction = getUserReaction(review);
    
    if (existingReaction) {
      // If clicking the same reaction, show info message
      if (existingReaction.status === status) {
        toast.info('Anda sudah memberi reaksi ini');
        return;
      }
      
      // Optimistic update for changing reaction
      const previousData = queryClient.getQueryData(['film', filmId]);
      
      queryClient.setQueryData(['film', filmId], (old: any) => {
        if (!old?.data?.reviews) return old;
        return {
          ...old,
          data: {
            ...old.data,
            reviews: old.data.reviews.map((r: any) => {
              if (r.id !== review.id) return r;
              return {
                ...r,
                likes: status === 'like' ? r.likes + 1 : r.likes - 1,
                dislikes: status === 'dislike' ? r.dislikes + 1 : r.dislikes - 1,
                reactions: r.reactions.map((reaction: any) =>
                  reaction.id === existingReaction.id
                    ? { ...reaction, status }
                    : reaction
                ),
              };
            }),
          },
        };
      });
      
      // Update to different reaction using PUT /api/v1/reactions/:id
      updateReaction(
        { id: existingReaction.id, payload: { status } },
        {
          onSuccess: () => {
            toast.success(status === 'like' ? 'Diubah ke suka' : 'Diubah ke tidak suka');
          },
          onError: (e: any) => {
            // Rollback on error
            queryClient.setQueryData(['film', filmId], previousData);
            toast.error(e.response?.data?.error || 'Gagal mengubah reaksi');
          },
        }
      );
    } else {
      // Optimistic update for new reaction
      const previousData = queryClient.getQueryData(['film', filmId]);
      
      queryClient.setQueryData(['film', filmId], (old: any) => {
        if (!old?.data?.reviews) return old;
        return {
          ...old,
          data: {
            ...old.data,
            reviews: old.data.reviews.map((r: any) => {
              if (r.id !== review.id) return r;
              return {
                ...r,
                likes: status === 'like' ? r.likes + 1 : r.likes,
                dislikes: status === 'dislike' ? r.dislikes + 1 : r.dislikes,
                reactions: [
                  ...r.reactions,
                  {
                    id: 'temp-' + Date.now(),
                    review_id: review.id,
                    user_id: currentUserId,
                    status,
                    user: meData?.data?.personal_info,
                  },
                ],
              };
            }),
          },
        };
      });
      
      // Create new reaction using POST /api/v1/reactions
      createReaction(
        { review_id: review.id, status },
        {
          onSuccess: () => {
            toast.success(status === 'like' ? 'Disukai' : 'Tidak disukai');
          },
          onError: async (e: any) => {
            const statusCode = e.response?.status;
            
            // If 409 Conflict, reaction already exists - refetch and retry with update
            if (statusCode === 409) {
              try {
                // Refetch film data to get the latest reactions with IDs
                await queryClient.refetchQueries({ queryKey: ['film', filmId] });
                
                // Get updated film data from cache
                const filmData: any = queryClient.getQueryData(['film', filmId]);
                
                if (filmData?.data?.reviews) {
                  // Find the review and user's reaction
                  const updatedReview = filmData.data.reviews.find((r: any) => r.id === review.id);
                  
                  // Try to find user ID
                  let userId = currentUserId;
                  if (!userId && meData) {
                    userId = meData.data?.personal_info?.id || meData.data?.id || meData.id;
                  }
                  
                  const userReaction = updatedReview?.reactions?.find((r: any) => r.user_id === userId);
                  
                  if (userReaction) {
                    // Now we have the reaction ID, update it with PUT
                    updateReaction(
                      { id: userReaction.id, payload: { status } },
                      {
                        onSuccess: () => {
                          toast.success(status === 'like' ? 'Disukai' : 'Tidak disukai');
                        },
                        onError: (updateError: any) => {
                          toast.error(updateError.response?.data?.error || 'Gagal memberi reaksi');
                        },
                      }
                    );
                  } else {
                    toast.error('Gagal menemukan reaksi. Silakan refresh halaman.');
                  }
                } else {
                  toast.error('Gagal memuat data. Silakan refresh halaman.');
                }
              } catch (refetchError) {
                // Rollback on error
                queryClient.setQueryData(['film', filmId], previousData);
                toast.error('Gagal memuat data. Silakan refresh halaman.');
              }
            } else {
              // Handle other errors - rollback
              queryClient.setQueryData(['film', filmId], previousData);
              let errorMsg = e.response?.data?.error || e.response?.data?.message || '';
              if (errorMsg.toLowerCase().includes('user has already reacted')) {
                errorMsg = 'Anda sudah memberi reaksi. Silakan refresh halaman.';
              }
              toast.error(errorMsg || 'Gagal memberi reaksi');
            }
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
                        <ThumbsUp className={`w-3.5 h-3.5 ${userReaction?.status === 'like' ? 'fill-current' : ''}`} />
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
                        <ThumbsDown className={`w-3.5 h-3.5 ${userReaction?.status === 'dislike' ? 'fill-current' : ''}`} />
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
