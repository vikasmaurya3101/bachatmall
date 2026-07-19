"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useSession } from "@/providers/SessionProvider";
import { formatCurrency } from "@/lib/utils/currency";
import Loader from "@/components/ui/Loader";

export default function CartPage() {
  const { isAuthenticated, isLoading: isSessionLoading } = useSession();
  const { cart, isLoading, isMutating, updateQuantity, removeItem } =
    useCart();

  if (isSessionLoading || isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <Loader size="lg" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Login to view your cart
        </h1>
        <Link
          href="/login?redirect=/cart"
          className="rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
        >
          Login
        </Link>
      </main>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Your cart is empty
        </h1>
        <Link
          href="/"
          className="rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.sellingPrice) * item.quantity,
    0
  );

  const mrpTotal = items.reduce(
    (sum, item) => sum + Number(item.product.mrp) * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
          My Cart ({items.length})
        </h1>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            {items.map((item) => {
              const thumbnail =
                item.product.images.find((img) => img.isThumbnail)?.url ??
                item.product.images[0]?.url ??
                "/placeholder-product.png";

              return (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border bg-white p-4"
                >
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50"
                  >
                    <Image
                      src={thumbnail}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-brand"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-1 font-semibold text-gray-900">
                        {formatCurrency(item.product.sellingPrice)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-lg border">
                        <button
                          disabled={isMutating}
                          onClick={() =>
                            item.quantity > 1
                              ? updateQuantity(item.id, item.quantity - 1)
                              : removeItem(item.id)
                          }
                          className="p-2 hover:bg-gray-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          disabled={isMutating}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        disabled={isMutating}
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-fit rounded-xl border bg-white p-5">
            <h2 className="mb-4 font-semibold text-gray-800">
              Price Details
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Price ({items.length} items)</span>
                <span>{formatCurrency(mrpTotal)}</span>
              </div>
              <div className="flex justify-between text-brand">
                <span>Discount</span>
                <span>-{formatCurrency(mrpTotal - subtotal)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-5 block rounded-xl bg-brand py-3 text-center font-semibold text-white transition hover:bg-brand-dark"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
