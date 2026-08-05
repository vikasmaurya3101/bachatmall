import { PrismaClient } from "@prisma/client";

export async function seedCategories(prisma: PrismaClient) {
  const categories = [
    { name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80&auto=format&fit=crop" },
    { name: "Mobiles", slug: "mobiles", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80&auto=format&fit=crop" },
    { name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=600&q=80&auto=format&fit=crop" },
    { name: "Home & Kitchen", slug: "home-kitchen", image: "https://images.unsplash.com/photo-1523039031846-6b3f39302cb8?w=600&q=80&auto=format&fit=crop" },
    { name: "Beauty", slug: "beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80&auto=format&fit=crop" },
    { name: "Grocery", slug: "grocery", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80&auto=format&fit=crop" },
    { name: "Books", slug: "books", image: "https://images.unsplash.com/photo-1660606422342-2ce59709bb14?w=600&q=80&auto=format&fit=crop" },
    { name: "Toys & Stationery", slug: "toys", image: "https://images.unsplash.com/photo-1759680190851-199358b2cd8c?w=600&q=80&auto=format&fit=crop" },
    { name: "Sports", slug: "sports", image: "https://images.unsplash.com/photo-1562771242-a02d9090c90c?w=600&q=80&auto=format&fit=crop" },
    { name: "Automotive", slug: "automotive", image: "https://images.unsplash.com/photo-1623564493108-f9e3572fb321?w=600&q=80&auto=format&fit=crop" },
  ];

  for (let i = 0; i < categories.length; i++) {
    await prisma.category.upsert({
      where: {
        slug: categories[i].slug,
      },
      update: {
        name: categories[i].name,
        image: categories[i].image,
        displayOrder: i + 1,
        isActive: true,
      },
      create: {
        ...categories[i],
        isActive: true,
        displayOrder: i + 1,
      },
    });
  }

  console.log("✅ Categories Seeded");
}