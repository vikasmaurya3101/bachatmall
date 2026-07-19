"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "@/providers/SessionProvider";
import { CartData } from "@/types/cart";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export function useCart() {
  const { isAuthenticated } = useSession();
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      const json: ApiResponse<CartData> = await res.json();
      setCart(json.success ? json.data ?? null : null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (productId: string, quantity = 1) => {
      if (!isAuthenticated) {
        toast.error("Please login to add items to cart.");
        return false;
      }

      setIsMutating(true);

      try {
        const res = await fetch("/api/cart/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        });

        const json: ApiResponse<CartData> = await res.json();

        if (!json.success) {
          toast.error(json.message ?? "Unable to add to cart.");
          return false;
        }

        setCart(json.data ?? null);
        toast.success("Added to cart");
        return true;
      } finally {
        setIsMutating(false);
      }
    },
    [isAuthenticated]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      setIsMutating(true);

      try {
        const res = await fetch(`/api/cart/items/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        });

        const json: ApiResponse<CartData> = await res.json();

        if (!json.success) {
          toast.error(json.message ?? "Unable to update cart.");
          return false;
        }

        setCart(json.data ?? null);
        return true;
      } finally {
        setIsMutating(false);
      }
    },
    []
  );

  const removeItem = useCallback(async (itemId: string) => {
    setIsMutating(true);

    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      });

      const json: ApiResponse<CartData> = await res.json();

      if (!json.success) {
        toast.error(json.message ?? "Unable to remove item.");
        return false;
      }

      setCart(json.data ?? null);
      toast.success("Removed from cart");
      return true;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return {
    cart,
    itemCount,
    isLoading,
    isMutating,
    addToCart,
    updateQuantity,
    removeItem,
    refresh: fetchCart,
  };
}

export default useCart;
