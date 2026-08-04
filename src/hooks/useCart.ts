"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/providers/SessionProvider";
import { CartData } from "@/types/cart";

const PENDING_CART_KEY = "shopka_pending_cart";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export function useCart() {
  const { isAuthenticated } = useSession();
  const router = useRouter();
  const pathname = usePathname();
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
        try {
          localStorage.setItem(
            PENDING_CART_KEY,
            JSON.stringify({ productId, quantity })
          );
        } catch {
          // localStorage unavailable — user will just need to re-add manually
        }

        toast.info("Please login to add items to cart.");
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
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
    [isAuthenticated, router, pathname]
  );

  // After a successful login, automatically add whatever item the user
  // was trying to add before being redirected, then forget it.
  useEffect(() => {
    if (!isAuthenticated) return;

    let pending: { productId: string; quantity: number } | null = null;

    try {
      const raw = localStorage.getItem(PENDING_CART_KEY);
      if (raw) pending = JSON.parse(raw);
    } catch {
      pending = null;
    }

    if (!pending) return;

    localStorage.removeItem(PENDING_CART_KEY);
    addToCart(pending.productId, pending.quantity);
    // addToCart is intentionally omitted from deps — it changes identity
    // whenever isAuthenticated flips, which is exactly what triggers this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

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
