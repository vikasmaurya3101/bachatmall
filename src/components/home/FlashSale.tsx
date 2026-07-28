"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { ProductCardData } from "@/types/product";
import ProductGrid from "@/components/product/ProductGrid";

function useCountdown(endsAt: string | null) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!endsAt) {
      setRemaining(0);
      return;
    }

    const end = new Date(endsAt).getTime();

    function tick() {
      setRemaining(Math.max(0, end - Date.now()));
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return { hours, minutes, seconds };
}

export default function FlashSale({
  products,
  endsAt,
}: {
  products: ProductCardData[];
  endsAt: string | null;
}) {
  const { hours, minutes, seconds } = useCountdown(endsAt);

  if (products.length === 0) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="bg-brand-50/40 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="brand-glow mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl brand-gradient px-5 py-4 text-white">
          <div className="flex items-center gap-2">
            <Zap size={24} className="fill-gold text-gold" />
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Flash Sale
            </h2>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-black/20 px-4 py-1.5 font-mono text-sm font-semibold">
            <span>{pad(hours)}</span>:<span>{pad(minutes)}</span>:
            <span>{pad(seconds)}</span>
          </div>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
