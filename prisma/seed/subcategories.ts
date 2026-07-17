import { PrismaClient } from "@prisma/client";

export async function seedSubCategories(prisma: PrismaClient) {
  const categories = await prisma.category.findMany();

  const categoryMap = new Map(
    categories.map((c) => [c.slug, c.id])
  );

  const data = [
    // Home & Kitchen
    ["home-kitchen", "Cookware", "cookware"],
    ["home-kitchen", "Kitchen Storage", "kitchen-storage"],
    ["home-kitchen", "Dinnerware", "dinnerware"],
    ["home-kitchen", "Water Bottles", "water-bottles"],

    // Home Decor
    ["home-kitchen", "Home Decor", "home-decor"],

    // Toys
    ["toys", "Educational Toys", "educational-toys"],
    ["toys", "Remote Control Toys", "remote-control-toys"],
    ["toys", "Soft Toys", "soft-toys"],

    // Fashion
    ["fashion", "Men", "men"],
    ["fashion", "Women", "women"],
    ["fashion", "Kids", "kids"],

    // Mobiles
    ["mobiles", "Smartphones", "smartphones"],
    ["mobiles", "Cases", "cases"],
    ["mobiles", "Chargers", "chargers"],

    // Electronics
    ["electronics", "Laptops", "laptops"],
    ["electronics", "Monitors", "monitors"],
    ["electronics", "Keyboards", "keyboards"],
    ["electronics", "Mouse", "mouse"],

    // Beauty
    ["beauty", "Skin Care", "skin-care"],
    ["beauty", "Hair Care", "hair-care"],

    // Grocery
    ["grocery", "Snacks", "snacks"],
    ["grocery", "Beverages", "beverages"],

    // Books
    ["books", "Programming", "programming"],
    ["books", "Novels", "novels"],

    // Sports
    ["sports", "Fitness", "fitness"],
    ["sports", "Cricket", "cricket"],

    // Automotive
    ["automotive", "Bike Accessories", "bike-accessories"],
    ["automotive", "Car Accessories", "car-accessories"],
  ];

  for (const [categorySlug, name, slug] of data) {
    const categoryId = categoryMap.get(categorySlug);

    if (!categoryId) continue;

    await prisma.subCategory.upsert({
      where: { slug },
      update: {},
      create: {
        categoryId,
        name,
        slug,
        isActive: true,
      },
    });
  }

  console.log("✅ Subcategories Seeded");
}