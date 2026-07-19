"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface AddToCartButtonProps {
  productId: string;
  inStock: boolean;
}

export default function AddToCartButton({
  productId,
  inStock,
}: AddToCartButtonProps) {
  const { addToCart, isMutating } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!inStock) {
    return (
      <button
        disabled
        className="w-full rounded-lg bg-gray-300 py-3 font-semibold text-gray-600 sm:w-auto sm:px-10"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-lg border">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="p-3 hover:bg-gray-50"
        >
          <Minus size={16} />
        </button>
        <span className="w-10 text-center font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="p-3 hover:bg-gray-50"
        >
          <Plus size={16} />
        </button>
      </div>

      <button
        onClick={() => addToCart(productId, quantity)}
        disabled={isMutating}
        className="flex-1 rounded-xl bg-brand py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60 sm:flex-none sm:px-10"
      >
        {isMutating ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}
