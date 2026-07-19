"use client";

import { useEffect, useState } from "react";
import { ProductCardData } from "@/types/product";
import { getRecentlyViewedIds } from "@/lib/recently-viewed";
import ProductRail from "./ProductRail";

export default function RecentlyViewed() {
  const [products, setProducts] = useState<ProductCardData[]>([]);

  useEffect(() => {
    const ids = getRecentlyViewedIds();

    if (ids.length === 0) return;

    fetch(`/api/products/by-ids?ids=${ids.join(",")}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setProducts(json.data);
      })
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <ProductRail title="Recently Viewed" products={products} />
  );
}
