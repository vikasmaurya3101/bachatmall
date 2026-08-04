import { PrismaClient, Prisma } from "@prisma/client";

export const PLACEHOLDER_IMAGES = [
  "https://placehold.co/600x600/png",
  "https://placehold.co/600x600/orange/white",
  "https://placehold.co/600x600/green/white",
  "https://placehold.co/600x600/blue/white",
  "https://placehold.co/600x600/red/white",
];

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function random(min: number, max: number) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

export function randomBoolean(percent = 50) {
  return Math.random() * 100 <= percent;
}

export function randomRating() {
  return new Prisma.Decimal(
    (Math.random() * 1.5 + 3.5).toFixed(2)
  );
}

export function randomReviews() {
  return random(5, 2500);
}

export function randomStock() {
  return random(10, 500);
}

export function randomMRP() {
  return random(299, 9999);
}

export function sellingPrice(mrp: number) {
  return random(
    Math.floor(mrp * 0.55),
    Math.floor(mrp * 0.9)
  );
}

export function discount(
  mrp: number,
  selling: number
) {
  return new Prisma.Decimal(
    (
      ((mrp - selling) / mrp) *
      100
    ).toFixed(2)
  );
}

export function sku(
  category: string,
  index: number
) {
  return `${category
    .substring(0, 3)
    .toUpperCase()}-${100000 + index}`;
}

export async function getCategory(
  prisma: PrismaClient,
  slug: string
) {
  const category =
    await prisma.category.findUnique({
      where: {
        slug,
      },
    });

  if (!category)
    throw new Error(
      `Category ${slug} not found`
    );

  return category;
}

export async function getSubCategory(
  prisma: PrismaClient,
  slug: string
) {
  const sub =
    await prisma.subCategory.findUnique({
      where: {
        slug,
      },
    });

  if (!sub)
    throw new Error(
      `SubCategory ${slug} not found`
    );

  return sub;
}

export async function getBrand(
  prisma: PrismaClient,
  slug: string
) {
  const brand =
    await prisma.brand.findUnique({
      where: {
        slug,
      },
    });

  if (!brand)
    throw new Error(
      `Brand ${slug} not found`
    );

  return brand;
}

export async function getSeller(
  prisma: PrismaClient
) {
  const seller =
    await prisma.seller.findFirst();

  if (!seller)
    throw new Error(
      "Seller not found"
    );

  return seller;
}

export function imageData(
  productName: string
) {
  return [
    {
      url: PLACEHOLDER_IMAGES[0],
      altText: productName,
      isThumbnail: true,
      displayOrder: 1,
    },

    {
      url: PLACEHOLDER_IMAGES[1],
      altText: productName,
      displayOrder: 2,
    },

    {
      url: PLACEHOLDER_IMAGES[2],
      altText: productName,
      displayOrder: 3,
    },
  ];
}

export function seoTitle(
  product: string
) {
  return `Buy ${product} Online at Best Price | Shopka`;
}

export function seoDescription(
  product: string
) {
  return `Shop ${product} online from Shopka with best prices, secure payment and fast delivery.`;
}

export function keywords(
  product: string,
  category: string
) {
  return `${product}, ${category}, online shopping, India, Shopka`;
}
export async function createProduct(
  prisma: PrismaClient,
  data: {
    index: number;
    name: string;
    categorySlug: string;
    subCategorySlug: string;
    brandSlug: string;
  }
) {
  const category = await getCategory(
    prisma,
    data.categorySlug
  );

  const subCategory = await getSubCategory(
    prisma,
    data.subCategorySlug
  );

  const brand = await getBrand(
    prisma,
    data.brandSlug
  );

  const seller = await getSeller(prisma);

  const mrp = randomMRP();

  const selling = sellingPrice(mrp);

  const product = await prisma.product.upsert({
    where: {
      slug: slugify(
        `${data.name}-${data.index}`
      ),
    },

    update: {},

    create: {
      name: `${data.name} ${data.index}`,

      slug: slugify(
        `${data.name}-${data.index}`
      ),

      description:
        `Premium quality ${data.name} for everyday use. Designed with durability and performance in mind. Ideal for Indian households.`,

      shortDescription:
        data.name,

      sku: sku(
        data.categorySlug,
        data.index
      ),

      categoryId: category.id,

      subCategoryId:
        subCategory.id,

      brandId: brand.id,

      sellerId: seller.id,

      mrp: new Prisma.Decimal(
        mrp
      ),

      sellingPrice:
        new Prisma.Decimal(
          selling
        ),

      discountPercent:
        discount(
          mrp,
          selling
        ),

      taxPercent:
        new Prisma.Decimal(
          18
        ),

      stock:
        randomStock(),

      minOrderQuantity: 1,

      isPublished: true,

      isFeatured:
        randomBoolean(25),

      isTrending:
        randomBoolean(20),

      isBestSeller:
        randomBoolean(15),

      isNewArrival:
        randomBoolean(20),

      freeShipping:
        randomBoolean(60),

      avgRating:
        randomRating(),

      totalReviews:
        randomReviews(),

      seoTitle:
        seoTitle(data.name),

      seoDescription:
        seoDescription(
          data.name
        ),

      searchKeywords:
        keywords(
          data.name,
          category.name
        ),

      images: {
        create: imageData(
          data.name
        ),
      },
    },

    include: {
      images: true,
      brand: true,
      category: true,
      seller: true,
    },
  });

  console.log(
    `✅ ${product.name}`
  );

  return product;
}

export async function clearProducts(
  prisma: PrismaClient
) {
  await prisma.productImage.deleteMany();

  await prisma.product.deleteMany();

  console.log(
    "🗑 Existing products removed"
  );
}

export async function resetCatalog(
  prisma: PrismaClient
) {
  await clearProducts(prisma);

  console.log(
    "♻ Catalog Ready"
  );
}