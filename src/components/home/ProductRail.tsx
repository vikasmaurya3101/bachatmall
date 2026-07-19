import Link from "next/link";
import { ProductCardData } from "@/types/product";
import ProductGrid from "@/components/product/ProductGrid";

interface ProductRailProps {
  title: string;
  subtitle?: string;
  products: ProductCardData[];
  viewAllHref?: string;
}

export default function ProductRail({
  title,
  subtitle,
  products,
  viewAllHref,
}: ProductRailProps) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm font-semibold text-brand hover:underline"
          >
            View all
          </Link>
        )}
      </div>

      <ProductGrid products={products} />
    </section>
  );
}
