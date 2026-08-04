"use client";

import { useState } from "react";
import { Star, BadgeCheck } from "lucide-react";
import { formatDate } from "@/lib/utils/date";
import { ReviewData, ReviewListResponse, ReviewSummaryData } from "@/types/review";

interface ProductReviewsProps {
  productId: string;
  initialReviews: ReviewData[];
  initialSummary: ReviewSummaryData;
  initialTotalPages: number;
}

const BREAKDOWN_ROWS: { key: keyof ReviewSummaryData["ratingBreakdown"]; label: string }[] = [
  { key: "five", label: "Excellent" },
  { key: "four", label: "Very Good" },
  { key: "three", label: "Good" },
  { key: "two", label: "Average" },
  { key: "one", label: "Poor" },
];

function reviewerName(user: ReviewData["user"]) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || "Shopka User";
}

export default function ProductReviews({
  productId,
  initialReviews,
  initialSummary,
  initialTotalPages,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ReviewData[]>(initialReviews);
  const [summary] = useState<ReviewSummaryData>(initialSummary);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const maxBreakdown = Math.max(
    1,
    ...BREAKDOWN_ROWS.map((row) => summary.ratingBreakdown[row.key])
  );

  async function loadMore() {
    setIsLoadingMore(true);

    try {
      const nextPage = page + 1;
      const res = await fetch(
        `/api/products/${productId}/reviews?page=${nextPage}&limit=5`
      );
      const json: { success: boolean; data?: ReviewListResponse } =
        await res.json();

      if (json.success && json.data) {
        setReviews((prev) => [...prev, ...json.data!.data]);
        setPage(nextPage);
        setTotalPages(json.data.totalPages);
      }
    } finally {
      setIsLoadingMore(false);
    }
  }

  if (summary.totalReviews === 0) {
    return (
      <section className="mt-8 rounded-xl bg-white p-5 sm:p-8">
        <h2 className="mb-2 font-semibold text-gray-800">
          Product Ratings &amp; Reviews
        </h2>
        <p className="text-sm text-gray-500">
          No reviews yet — be the first to try this product.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-xl bg-white p-5 sm:p-8">
      <h2 className="mb-4 font-semibold text-gray-800">
        Product Ratings &amp; Reviews
      </h2>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex shrink-0 flex-col items-center gap-1 sm:items-start">
          <p className="flex items-center gap-1 text-3xl font-bold text-gray-900">
            {summary.averageRating.toFixed(1)}
            <Star size={22} className="fill-gold text-gold" />
          </p>
          <p className="text-xs text-gray-500">
            {summary.totalReviews} {summary.totalReviews === 1 ? "Review" : "Reviews"}
          </p>
        </div>

        <div className="flex-1 space-y-1.5">
          {BREAKDOWN_ROWS.map((row) => {
            const count = summary.ratingBreakdown[row.key];
            const pct = (count / maxBreakdown) * 100;
            const barColor =
              row.key === "five" || row.key === "four"
                ? "bg-green-500"
                : row.key === "three"
                ? "bg-amber-400"
                : "bg-red-400";

            return (
              <div key={row.key} className="flex items-center gap-2 text-xs">
                <span className="w-20 shrink-0 text-gray-500">{row.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-gray-400">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 divide-y">
        {reviews.map((review) => (
          <div key={review.id} className="py-4 first:pt-0">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded bg-green-600 px-1.5 py-0.5 text-xs font-semibold text-white">
                {review.rating.toFixed(1)}
                <Star size={11} className="fill-white" />
              </span>
              <span className="text-sm font-medium text-gray-800">
                {reviewerName(review.user)}
              </span>
              {review.isVerifiedPurchase && (
                <span className="flex items-center gap-1 text-xs font-medium text-brand">
                  <BadgeCheck size={13} />
                  Verified Purchase
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-gray-400">
              Posted on {formatDate(review.createdAt)}
            </p>

            {review.title && (
              <p className="mt-2 text-sm font-medium text-gray-800">
                {review.title}
              </p>
            )}

            {review.comment && (
              <p className="mt-1 text-sm text-gray-600">{review.comment}</p>
            )}
          </div>
        ))}
      </div>

      {page < totalPages && (
        <button
          onClick={loadMore}
          disabled={isLoadingMore}
          className="tap-shrink mt-4 w-full rounded-lg border py-2.5 text-sm font-semibold text-brand hover:bg-brand-50 disabled:opacity-60"
        >
          {isLoadingMore ? "Loading..." : "Load More Reviews"}
        </button>
      )}
    </section>
  );
}
