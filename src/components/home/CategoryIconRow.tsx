import Image from "next/image";
import Link from "next/link";
import {
  Blocks,
  BookOpen,
  Car,
  ChevronDown,
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

interface CategoryIconRowProps {
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

export default function CategoryIconRow({ categories }: CategoryIconRowProps) {
  if (categories.length === 0) return null;

  return (
    <section className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-4 sm:justify-between sm:gap-2 sm:px-6">
        {categories.map((category) => {
          const Icon = ICONS[category.slug] ?? Package;

          return (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="tap-shrink flex shrink-0 flex-col items-center gap-2"
            >
              <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-50 to-accent-50 ring-2 ring-brand-100">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <Icon size={26} className="text-brand" strokeWidth={1.75} />
                )}
              </span>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-gray-700">
                {category.name}
                <ChevronDown size={12} className="text-gray-400" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
