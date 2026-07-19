"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildQueryString } from "@/lib/utils";
import { ProductCardData, ProductFilters } from "@/types/product";

interface ApiResponse {
  success: boolean;
  data?: {
    data: ProductCardData[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
  };
}

/**
 * Fetches products page-by-page and accumulates results, for
 * "Load more" / infinite-scroll product grids (search, category pages).
 */
export function useInfiniteProducts(filters: ProductFilters) {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filtersKey = JSON.stringify(filters);
  const requestId = useRef(0);

  const fetchPage = useCallback(
    async (targetPage: number, replace: boolean) => {
      const currentRequest = ++requestId.current;

      if (replace) setIsLoading(true);
      else setIsLoadingMore(true);

      try {
        const query = buildQueryString({
          ...filters,
          page: targetPage,
          limit: filters.limit ?? 20,
        });

        const res = await fetch(`/api/products${query}`, {
          cache: "no-store",
        });
        const json: ApiResponse = await res.json();

        if (currentRequest !== requestId.current) return;

        if (json.success && json.data) {
          setProducts((prev) =>
            replace ? json.data!.data : [...prev, ...json.data!.data]
          );
          setPage(json.data.page);
          setHasNext(json.data.hasNext);
          setTotal(json.data.total);
        }
      } finally {
        if (currentRequest === requestId.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtersKey]
  );

  useEffect(() => {
    fetchPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  const loadMore = useCallback(() => {
    if (!hasNext || isLoadingMore) return;
    fetchPage(page + 1, false);
  }, [fetchPage, hasNext, isLoadingMore, page]);

  return {
    products,
    total,
    isLoading,
    isLoadingMore,
    hasNext,
    loadMore,
  };
}

export default useInfiniteProducts;
