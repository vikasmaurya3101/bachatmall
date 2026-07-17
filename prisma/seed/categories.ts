import { PrismaClient } from "@prisma/client";

export async function seedCategories(prisma: PrismaClient) {
  const categories = [
    { name: "Electronics", slug: "electronics" },
    { name: "Mobiles", slug: "mobiles" },
    { name: "Fashion", slug: "fashion" },
    { name: "Home & Kitchen", slug: "home-kitchen" },
    { name: "Beauty", slug: "beauty" },
    { name: "Grocery", slug: "grocery" },
    { name: "Books", slug: "books" },
    { name: "Sports", slug: "sports" },
    { name: "Toys", slug: "toys" },
    { name: "Automotive", slug: "automotive" },
  ];

  for (let i = 0; i < categories.length; i++) {
    await prisma.category.upsert({
      where: {
        slug: categories[i].slug,
      },
      update: {},
      create: {
        ...categories[i],
        isActive: true,
        displayOrder: i + 1,
      },
    });
  }

  console.log("✅ Categories Seeded");
}