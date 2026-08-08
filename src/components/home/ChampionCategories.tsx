import Image from "next/image";
import Link from "next/link";
import { ProductCardData } from "@/types/product";

interface ChampionCategoriesProps {
  products: ProductCardData[];
  sectionTitle?: string;
}

export default function ChampionCategories({ products, sectionTitle = "Champion Categories" }: ChampionCategoriesProps) {
  const picks = products.slice(0, 3);
  if (picks.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="bg-gradient-to-r from-brand via-accent to-brand-dark bg-clip-text text-4xl font-extrabold italic text-transparent drop-shadow-sm sm:text-5xl">
            {sectionTitle}
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-40 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {picks.map((product) => {
            const price = Math.round(Number(product.sellingPrice));
            const image = product.images[0]?.url;

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="tap-shrink group relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl border-2 border-gold bg-gradient-to-br from-accent-dark via-brand-dark to-brand p-5 shadow-lg"
              >
                {/* curtain-style top accent */}
                <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-r from-gold via-gold-dark to-gold" />

                {image && (
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover object-center opacity-90 transition duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                <div className="relative">
                  <p className="text-sm font-medium text-white/85">
                    {product.category.name}
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-white">
                    Top Picks
                  </p>
                  <p className="mt-1 text-lg font-bold text-gold">
                    From ₹{price}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
