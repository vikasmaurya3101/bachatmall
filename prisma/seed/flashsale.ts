import { PrismaClient } from "@prisma/client";

/**
 * EDIT THIS LIST to control exactly which products show up in the
 * homepage "Flash Sale" section.
 *
 * - sku: must match an existing product's SKU exactly
 * - flashPrice: the price shown during the sale (the "OFF %" badge is
 *   calculated automatically from this vs. the product's normal MRP)
 * - stockLimit: optional — cap how many units can sell at the flash price
 */
const FLASH_SALE_NAME = "Homepage Flash Sale";

const FLASH_SALE_STARTS_AT = new Date();
const FLASH_SALE_ENDS_AT = new Date(
  FLASH_SALE_STARTS_AT.getTime() + 24 * 60 * 60 * 1000 // ends 24h from now
);

const FLASH_SALE_ITEMS: {
  sku: string;
  flashPrice: number;
  stockLimit?: number;
}[] = [
  // Example — replace with your real product SKUs:
  // { sku: "APL-IP15-BLU-128", flashPrice: 64999, stockLimit: 20 },
  // { sku: "LB-FLASH72", flashPrice: 99 },
];

export async function seedFlashSale(prisma: PrismaClient) {
  if (FLASH_SALE_ITEMS.length === 0) {
    console.log("⚠️  No flash sale items configured, skipping.");
    return;
  }

  const existing = await prisma.flashSale.findFirst({
    where: { name: FLASH_SALE_NAME },
  });

  const flashSale = existing
    ? await prisma.flashSale.update({
        where: { id: existing.id },
        data: {
          startsAt: FLASH_SALE_STARTS_AT,
          endsAt: FLASH_SALE_ENDS_AT,
          isActive: true,
        },
      })
    : await prisma.flashSale.create({
        data: {
          name: FLASH_SALE_NAME,
          startsAt: FLASH_SALE_STARTS_AT,
          endsAt: FLASH_SALE_ENDS_AT,
          isActive: true,
        },
      });

  for (const item of FLASH_SALE_ITEMS) {
    const product = await prisma.product.findUnique({
      where: { sku: item.sku },
    });

    if (!product) {
      console.warn(`⚠️  Skipping flash sale item — no product with SKU "${item.sku}"`);
      continue;
    }

    await prisma.flashSaleProduct.upsert({
      where: {
        flashSaleId_productId: {
          flashSaleId: flashSale.id,
          productId: product.id,
        },
      },
      update: {
        flashPrice: item.flashPrice,
        stockLimit: item.stockLimit ?? null,
      },
      create: {
        flashSaleId: flashSale.id,
        productId: product.id,
        flashPrice: item.flashPrice,
        stockLimit: item.stockLimit ?? null,
      },
    });
  }

  console.log("✅ Flash Sale Seeded");
}
