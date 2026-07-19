import { notFound } from "next/navigation";
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
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
          {category.name}
        </h1>

        <ProductListClient filters={{ categoryId: category.id }} />
      </div>
    </main>
  );
}
