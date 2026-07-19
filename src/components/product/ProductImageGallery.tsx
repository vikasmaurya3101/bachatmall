"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImageData } from "@/types/product";

interface ProductImageGalleryProps {
  images: ProductImageData[];
  productName: string;
}

const SWIPE_THRESHOLD = 40;

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const sorted = [...images].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const active = sorted[activeIndex] ?? sorted[0];

  function goTo(index: number) {
    setActiveIndex((index + sorted.length) % sorted.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;

    const delta = e.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      goTo(delta > 0 ? activeIndex - 1 : activeIndex + 1);
    }

    touchStartX.current = null;
  }

  if (!active) {
    return (
      <div className="aspect-square w-full rounded-xl bg-gray-100" />
    );
  }

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      <div className="hidden gap-3 overflow-x-auto sm:flex sm:flex-col sm:overflow-visible">
        {sorted.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setActiveIndex(index)}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
              index === activeIndex
                ? "border-brand"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <Image
              src={image.url}
              alt={image.altText ?? productName}
              fill
              sizes="64px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div
        className="relative aspect-square w-full flex-1 overflow-hidden rounded-xl bg-gray-50"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          key={active.id}
          src={active.url}
          alt={active.altText ?? productName}
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-contain"
          priority
        />

        {sorted.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-sm transition hover:bg-white sm:flex"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-sm transition hover:bg-white sm:flex"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dot indicators — swipeable on mobile, matches thumbnail rail on desktop */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:hidden">
              {sorted.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to image ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-5 bg-brand"
                      : "w-1.5 bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
