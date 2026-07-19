import { PrismaClient } from "@prisma/client";

export async function seedBrands(prisma: PrismaClient) {
  const brands = [
    "Apple",
    "Samsung",
    "Xiaomi",
    "OnePlus",
    "Sony",
    "HP",
    "Dell",
    "Lenovo",
    "Boat",
    "Nike",
    "Puma",
    "Adidas",

    // Home & Kitchen
    "Prestige",
    "Pigeon",
    "Milton",
    "Philips",
    "Bajaj",
    "Butterfly",
    "Hawkins",
    "Cello",

    // Beauty
    "Lakme",
    "Mamaearth",
    "Nivea",
    "Dove",

    // Grocery
    "Tata",
    "Aashirvaad",
    "Fortune",

    // Appliances
    "LG",
    "Whirlpool",
    "IFB",
    "Bosch",

    // Toys
    "Funskool",
    "Lego",
    "Hot Wheels",

    // Fashion
    "Levis",
    "Allen Solly",
    "US Polo",
    "Campus",

    // Additional brands used in seed products
    "Barbie",
    "Biba",
    "Cadbury",
    "FunBlast",
    "Ganesh",
    "Generic",
    "Himalaya",
    "Lavie",
    "Mattel",
    "Maybelline",
    "Noise",
    "Skillmatics",
    "Spaces",
    "Tata Sampann",
    "Tata Tea",
    "Tickles",
    "Titan",
    "Toyshine",
  ];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: {
        slug: brand
          .toLowerCase()
          .replace(/\s+/g, "-"),
      },
      update: {},
      create: {
        name: brand,
        slug: brand
          .toLowerCase()
          .replace(/\s+/g, "-"),
        isActive: true,
      },
    });
  }

  console.log("✅ Brands Seeded");
}