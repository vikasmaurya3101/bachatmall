import { PrismaClient } from "@prisma/client";

export const PRODUCT_COUNT = 100;

export const IMAGE_PLACEHOLDER =
  "https://placehold.co/600x600/png";

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function random(min: number, max: number) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

export function randomPrice(min: number, max: number) {
  return random(min, max);
}

export function randomRating() {
  return Number(
    (Math.random() * 1.5 + 3.5).toFixed(1)
  );
}

export function randomStock() {
  return random(5, 250);
}

export function randomBoolean(percent = 50) {
  return Math.random() * 100 < percent;
}

export function calculateDiscount(
  mrp: number,
  sellingPrice: number
) {
  return Number(
    (((mrp - sellingPrice) / mrp) * 100).toFixed(2)
  );
}

export async function getCategoryId(
  prisma: PrismaClient,
  slug: string
) {
  const category = await prisma.category.findUnique({
    where: {
      slug,
    },
  });

  if (!category) {
    throw new Error(
      `Category '${slug}' not found`
    );
  }

  return category.id;
}

export async function getSubCategoryId(
  prisma: PrismaClient,
  slug: string
) {
  const subCategory =
    await prisma.subCategory.findUnique({
      where: {
        slug,
      },
    });

  if (!subCategory) {
    throw new Error(
      `SubCategory '${slug}' not found`
    );
  }

  return subCategory.id;
}

export async function getBrandId(
  prisma: PrismaClient,
  slug: string
) {
  const brand = await prisma.brand.findUnique({
    where: {
      slug,
    },
  });

  if (!brand) {
    throw new Error(
      `Brand '${slug}' not found`
    );
  }

  return brand.id;
}