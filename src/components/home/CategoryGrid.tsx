import Image from "next/image";
import Link from "next/link";
import {
  Blocks,
  BookOpen,
  Car,
  Cpu,
  type LucideIcon,
  Package,
  Salad,
  Shirt,
  Smartphone,
  Sofa,
  Sparkles,
  Volleyball,
} from "lucide-react";
import { CategoryData } from "@/types/product";

interface CategoryGridProps {
  categories: CategoryData[];
  sectionTitle?: string;
}

const ICONS: Record<string, LucideIcon> = {
  electronics: Cpu,
  mobiles: Smartphone,
  fashion: Shirt,
  "home-kitchen": Sofa,
  beauty: Sparkles,
  grocery: Salad,
  books: BookOpen,
  sports: Volleyball,
  toys: Blocks,
  automotive: Car,
};

// Warm gradient fallbacks (used when a category has no photo yet) — cycles
// through so neighboring tiles never repeat the same look.
const GRADIENTS = [
  "from-brand to-brand-dark",
  "from-accent to-accent-dark",
  "from-gold to-gold-dark",
  "from-brand-400 to-accent",
];

export default function CategoryGrid({ categories, sectionTitle = "Top Categories" }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
        {sectionTitle}
      </h2>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-8">
        {categories.map((category, index) => {
          const Icon = ICONS[category.slug] ?? Package;
          const gradient = GRADIENTS[index % GRADIENTS.length];

          return (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative aspect-[4/5] w-32 shrink-0 overflow-hidden shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:w-auto"
            >
              {category.image ? (
                <>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 128px, 200px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </>
              ) : (
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${gradient}`}
                >
                  <Icon
                    size={40}
                    className="text-white/90 transition duration-300 group-hover:scale-110"
                    strokeWidth={1.75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              )}

              <span className="absolute inset-x-0 bottom-0 line-clamp-2 p-3 text-sm font-semibold text-white drop-shadow-sm">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
