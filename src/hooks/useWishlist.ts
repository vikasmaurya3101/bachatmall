"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "@/providers/SessionProvider";
import { ProductCardData } from "@/types/product";

interface WishlistItemData {
  id: string;
  productId: string;
  product: ProductCardData;
}

interface WishlistData {
  id: string;
  items: WishlistItemData[];
}

interface ApiResponse<T> {
  success: boolean;
  added?: boolean;
  message?: string;
  data?: T;
}

export function useWishlist() {
  const { isAuthenticated } = useSession();
  const [wishlist, setWishlist] = useState<WishlistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/wishlist", { cache: "no-store" });
      const json: ApiResponse<WishlistData> = await res.json();
      setWishlist(json.success ? json.data ?? null : null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = useCallback(
    (productId: string) =>
      !!wishlist?.items.some((item) => item.productId === productId),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!isAuthenticated) {
        toast.error("Please login to use your wishlist.");
        return;
      }

      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const json: ApiResponse<WishlistData> = await res.json();

      if (!json.success) {
        toast.error(json.message ?? "Unable to update wishlist.");
        return;
      }

      setWishlist(json.data ?? null);
      toast.success(json.added ? "Added to wishlist" : "Removed from wishlist");
    },
    [isAuthenticated]
  );

  return {
    wishlist,
    isLoading,
    isWishlisted,
    toggleWishlist,
    refresh: fetchWishlist,
  };
}

export default useWishlist;
