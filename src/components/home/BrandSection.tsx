import Image from "next/image";
import Link from "next/link";
import { BrandData } from "@/types/product";

export default function BrandSection({ brands }: { brands: BrandData[] }) {
  if (brands.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h2 className="mb-5 text-2xl font-bold text-gray-800 sm:text-3xl">
        Shop by Brand
      </h2>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/search?brandId=${brand.id}`}
            className="flex h-16 items-center justify-center rounded-xl border bg-white p-3 transition hover:shadow-md"
          >
            {brand.logo ? (
              <div className="relative h-full w-full">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  sizes="120px"
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="text-sm font-semibold text-gray-600">
                {brand.name}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
