import { Star, StarHalf } from "lucide-react";
import { ratingStars } from "@/lib/utils/rating";

interface ProductRatingProps {
  rating: number | string;
  totalReviews?: number;
  size?: number;
  showCount?: boolean;
}

export default function ProductRating({
  rating,
  totalReviews = 0,
  size = 14,
  showCount = true,
}: ProductRatingProps) {
  const numericRating = Number(rating) || 0;
  const { full, half, empty } = ratingStars(numericRating);

  if (numericRating === 0 && totalReviews === 0) {
    return <span className="text-xs text-gray-400">No ratings yet</span>;
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center rounded bg-accent px-1.5 py-0.5 text-white">
        <span className="text-xs font-semibold">
          {numericRating.toFixed(1)}
        </span>
        <Star size={size - 3} className="ml-0.5 fill-white" />
      </div>

      <div className="flex items-center text-gold">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`full-${i}`} size={size} className="fill-gold" />
        ))}
        {half && <StarHalf size={size} className="fill-gold" />}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-gray-300" />
        ))}
      </div>

      {showCount && totalReviews > 0 && (
        <span className="text-xs text-gray-500">({totalReviews})</span>
      )}
    </div>
  );
}
