export function averageRating(
  ratings: number[]
): number {
  if (!ratings.length) return 0;

  return Number(
    (
      ratings.reduce((a, b) => a + b, 0) /
      ratings.length
    ).toFixed(1)
  );
}

export function totalReviews(
  ratings: number[]
): number {
  return ratings.length;
}

export function ratingStars(
  rating: number
) {
  return {
    full: Math.floor(rating),
    half:
      rating % 1 >= 0.5,
    empty:
      5 -
      Math.ceil(rating),
  };
}