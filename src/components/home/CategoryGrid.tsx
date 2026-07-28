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

const TINTS = [
  { bg: "bg-brand-50", fg: "text-brand" },
  { bg: "bg-accent-50", fg: "text-accent" },
  { bg: "bg-amber-50", fg: "text-gold-dark" },
];

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
        Browse Categories
      </h2>

      <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {categories.map((category, index) => {
          const Icon = ICONS[category.slug] ?? Package;
          const tint = TINTS[index % TINTS.length];

          return (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full ${tint.bg}`}
              >
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <Icon size={26} className={tint.fg} strokeWidth={2} />
                )}
              </div>

              <span className="line-clamp-2 text-xs font-medium text-gray-700 sm:text-sm">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
