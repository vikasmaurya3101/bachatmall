import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductListClient from "@/components/product/ProductListClient";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({ where: { slug } });

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Category banner */}
      <div className="relative flex h-36 items-end overflow-hidden sm:h-48">
        {category.image ? (
          <>
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand to-accent" />
        )}

        <h1 className="relative p-4 text-2xl font-bold text-white drop-shadow-sm sm:p-6 sm:text-3xl">
          {category.name}
        </h1>
      </div>

      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <ProductListClient filters={{ categoryId: category.id }} />
      </div>
    </main>
  );
}
