"use client";

import { useEffect } from "react";
import { trackProductView } from "@/lib/recently-viewed";

export default function TrackProductView({
  productId,
}: {
  productId: string;
}) {
  useEffect(() => {
    trackProductView(productId);
  }, [productId]);

  return null;
}
