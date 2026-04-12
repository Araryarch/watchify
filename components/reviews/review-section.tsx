import { ReviewForm } from './review-form';
import { ReviewList } from './review-list';

interface ReviewSectionProps {
  filmId: string;
  reviews?: any[];
}

export function ReviewSection({ filmId, reviews = [] }: ReviewSectionProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Ulasan & Rating</h2>
      <ReviewForm filmId={filmId} />
      <ReviewList reviews={reviews} />
    </div>
  );
}
