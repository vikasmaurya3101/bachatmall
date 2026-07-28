import { PrismaClient } from "@prisma/client";

import { seedCategories } from "./seed/categories";
import { seedBrands } from "./seed/brands";
import { seedSubCategories } from "./seed/subcategories";
import { seedSeller } from "./seed/seller";
import { seedProducts } from "./seed/products";
import { seedFlashSale } from "./seed/flashsale";


const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Seed...");

  await seedCategories(prisma);

  await seedBrands(prisma);

  await seedSubCategories(prisma);

  await seedSeller(prisma);

  await seedProducts(prisma);

  await seedFlashSale(prisma);

  console.log("🎉 Seed Completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });