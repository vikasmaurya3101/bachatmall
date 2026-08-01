"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductListClient from "@/components/product/ProductListClient";
import { ProductSort } from "@/types/product";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "popular", label: "Popularity" },
  { value: "latest", label: "Newest First" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "discount", label: "Discount" },
];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") as ProductSort) || "popular";

  const filters = useMemo(
    () => ({
      search: query || undefined,
      categoryId: searchParams.get("categoryId") ?? undefined,
      brandId: searchParams.get("brandId") ?? undefined,
      featured: searchParams.get("featured") === "true" || undefined,
      trending: searchParams.get("trending") === "true" || undefined,
      bestSeller: searchParams.get("bestSeller") === "true" || undefined,
      newArrival: searchParams.get("newArrival") === "true" || undefined,
      sort,
    }),
    [query, sort, searchParams]
  );

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-semibold text-gray-800">
            {query ? (
              <>
                Results for <span className="text-brand">&quot;{query}&quot;</span>
              </>
            ) : (
              "All Products"
            )}
          </h1>

          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none focus:border-brand"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                Sort: {option.label}
              </option>
            ))}
          </select>
        </div>

        <ProductListClient filters={filters} />
      </div>
    </main>
  );
}
