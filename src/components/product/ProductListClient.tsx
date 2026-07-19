"use client";

import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import { ProductFilters } from "@/types/product";
import ProductGrid from "./ProductGrid";
import Loader from "@/components/ui/Loader";

export default function ProductListClient({
  filters,
}: {
  filters: ProductFilters;
}) {
  const { products, isLoading, isLoadingMore, hasNext, loadMore, total } =
    useInfiniteProducts(filters);

  if (isLoading) {
    return <Loader size="lg" />;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">{total} products found</p>

      <ProductGrid products={products} />

      {hasNext && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="rounded-full border-2 border-brand px-8 py-2.5 font-semibold text-brand transition hover:bg-brand-50 disabled:opacity-60"
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
