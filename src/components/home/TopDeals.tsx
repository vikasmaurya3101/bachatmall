import Link from "next/link";
import { ProductCardData } from "@/types/product";
import ProductPrice from "@/components/product/ProductPrice";
import Image from "next/image";

export default function TopDeals({
  products,
}: {
  products: ProductCardData[];
}) {
  const deals = products.slice(0, 4);

  if (deals.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h2 className="mb-5 text-2xl font-bold text-gray-800 sm:text-3xl">
        Top Deals
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {deals.map((product) => {
          const thumbnail =
            product.images.find((img) => img.isThumbnail)?.url ??
            product.images[0]?.url ??
            "/placeholder-product.png";

          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="flex items-center gap-3 rounded-xl border bg-white p-3 transition hover:shadow-md"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                <Image
                  src={thumbnail}
                  alt={product.name}
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium text-gray-800">
                  {product.name}
                </p>
                <ProductPrice
                  mrp={product.mrp}
                  sellingPrice={product.sellingPrice}
                  discountPercent={product.discountPercent}
                  size="sm"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
