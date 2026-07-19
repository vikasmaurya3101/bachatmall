"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useSession } from "@/providers/SessionProvider";

interface ProductActionsProps {
  productId: string;
  productName: string;
  productSlug: string;
  inStock: boolean;
}

export default function ProductActions({
  productId,
  productName,
  productSlug,
  inStock,
}: ProductActionsProps) {
  const router = useRouter();
  const { isAuthenticated } = useSession();
  const { addToCart, isMutating } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const wishlisted = isWishlisted(productId);

  async function handleShare() {
    const url = `${window.location.origin}/product/${productSlug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: productName, url });
      } catch {
        // user cancelled the share sheet — nothing to do
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    toast.success("Product link copied to clipboard");
  }

  async function handleBuyNow() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/product/${productSlug}`);
      return;
    }

    setIsBuyingNow(true);

    try {
      const added = await addToCart(productId, quantity);
      if (added) router.push("/checkout");
    } finally {
      setIsBuyingNow(false);
    }
  }

  if (!inStock) {
    return (
      <div className="flex items-center gap-3">
        <button
          disabled
          className="flex-1 rounded-xl bg-gray-300 py-3 font-semibold text-gray-600 sm:flex-none sm:px-10"
        >
          Out of Stock
        </button>

        <WishlistButton wishlisted={wishlisted} onClick={() => toggleWishlist(productId)} />
        <ShareButton onClick={handleShare} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg border">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-3 hover:bg-gray-50"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-3 hover:bg-gray-50"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        <WishlistButton wishlisted={wishlisted} onClick={() => toggleWishlist(productId)} />
        <ShareButton onClick={handleShare} />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => addToCart(productId, quantity)}
          disabled={isMutating || isBuyingNow}
          className="flex-1 rounded-xl border-2 border-brand py-3 font-semibold text-brand transition hover:bg-brand-50 disabled:opacity-60"
        >
          {isMutating ? "Adding..." : "Add to Cart"}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isMutating || isBuyingNow}
          className="brand-glow flex-1 rounded-xl bg-brand py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {isBuyingNow ? "Please wait..." : "Buy Now"}
        </button>
      </div>
    </div>
  );
}

function WishlistButton({
  wishlisted,
  onClick,
}: {
  wishlisted: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border p-3 transition hover:bg-gray-50"
      aria-label="Toggle wishlist"
    >
      <Heart
        size={20}
        className={wishlisted ? "fill-brand text-brand" : "text-gray-500"}
      />
    </button>
  );
}

function ShareButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border p-3 transition hover:bg-gray-50"
      aria-label="Share product"
    >
      <Share2 size={20} className="text-gray-500" />
    </button>
  );
}
