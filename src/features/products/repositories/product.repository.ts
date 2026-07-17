import { prisma } from "@/lib/prisma";

export class ProductRepository {
  async getHomeData() {
    const [
      categories,
      featuredProducts,
      flashSaleProducts,
      newArrivals,
      trendingProducts,
      brands,
    ] = await prisma.$transaction([
      prisma.category.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          displayOrder: "asc",
        },
        take: 8,
      }),

      prisma.product.findMany({
        where: {
          isPublished: true,
          isFeatured: true,
        },
        include: {
          images: {
            where: {
              isThumbnail: true,
            },
            take: 1,
          },
          brand: true,
          seller: true,
          category: true,
        },
        take: 8,
      }),

      prisma.product.findMany({
        where: {
          isPublished: true,
        },
        include: {
          images: {
            where: {
              isThumbnail: true,
            },
            take: 1,
          },
        },
        orderBy: {
          discountPercent: "desc",
        },
        take: 8,
      }),

      prisma.product.findMany({
        where: {
          isPublished: true,
          isNewArrival: true,
        },
        include: {
          images: {
            where: {
              isThumbnail: true,
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 8,
      }),

      prisma.product.findMany({
        where: {
          isPublished: true,
          isTrending: true,
        },
        include: {
          images: {
            where: {
              isThumbnail: true,
            },
            take: 1,
          },
        },
        take: 8,
      }),

      prisma.brand.findMany({
        where: {
          isActive: true,
        },
        take: 12,
      }),
    ]);

    return {
      categories,
      featuredProducts,
      flashSaleProducts,
      newArrivals,
      trendingProducts,
      brands,
    };
  }
}

export const productRepository = new ProductRepository();