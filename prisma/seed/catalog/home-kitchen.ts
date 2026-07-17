import { PrismaClient } from "@prisma/client";
import {
  calculateDiscount,
  getBrandId,
  getCategoryId,
  getSubCategoryId,
  IMAGE_PLACEHOLDER,
  random,
  randomBoolean,
  randomRating,
  randomStock,
  slugify,
} from "./helpers";

const PRODUCTS = [
  "Pressure Cooker",
  "Non Stick Fry Pan",
  "Cookware Set",
  "Dinner Set",
  "Water Bottle",
  "Kitchen Storage Container",
  "Knife Set",
  "Mixer Grinder",
  "Electric Kettle",
  "Induction Cooktop",
  "Gas Stove",
  "Rice Cooker",
  "Lunch Box",
  "Vacuum Flask",
  "Chopping Board",
  "Vegetable Cutter",
  "Dish Rack",
  "Spice Rack",
  "Serving Bowl",
  "Tea Cup Set",
];

const BRANDS = [
  "prestige",
  "pigeon",
  "milton",
  "philips",
  "bajaj",
];

export async function seedHomeKitchen(
  prisma: PrismaClient
) {
  const categoryId =
    await getCategoryId(
      prisma,
      "home-kitchen"
    );

  const subCategoryId =
    await getSubCategoryId(
      prisma,
      "kitchen"
    );

  const seller =
    await prisma.seller.findFirst();

  if (!seller) {
    throw new Error(
      "Demo seller not found."
    );
  }

  for (let i = 0; i < 100; i++) {
    const productName =
      PRODUCTS[random(0, PRODUCTS.length - 1)];

    const brandSlug =
      BRANDS[random(0, BRANDS.length - 1)];

    const brandId =
      await getBrandId(
        prisma,
        brandSlug
      );

    const mrp =
      random(500, 6000);

    const selling =
      random(
        Math.floor(mrp * 0.55),
        Math.floor(mrp * 0.9)
      );

    const product =
      await prisma.product.create({
        data: {
          name: `${productName} ${i + 1}`,
          slug: slugify(
            `${productName}-${i + 1}`
          ),
          description:
            `Premium ${productName} for everyday use.`,
          shortDescription:
            productName,

          sku: `HK-${10000 + i}`,

          categoryId,
          subCategoryId,
          sellerId: seller.id,
          brandId,

          mrp,
          sellingPrice: selling,

          discountPercent:
            calculateDiscount(
              mrp,
              selling
            ),

          stock:
            randomStock(),

          avgRating:
            randomRating(),

          totalReviews:
            random(10, 800),

          isPublished: true,
          isFeatured:
            randomBoolean(25),
          isTrending:
            randomBoolean(20),
          isBestSeller:
            randomBoolean(15),
          isNewArrival:
            randomBoolean(10),

          freeShipping:
            randomBoolean(60),

          seoTitle:
            productName,

          seoDescription:
            `Buy ${productName} online at best price.`,

          searchKeywords:
            `${productName}, kitchen, home`,

          images: {
            create: {
              url: IMAGE_PLACEHOLDER,
              altText: productName,
              isThumbnail: true,
            },
          },
        },
      });

    console.log(product.name);
  }

  console.log(
    "✅ Home & Kitchen Products Seeded"
  );
}