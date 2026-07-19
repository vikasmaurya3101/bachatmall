import { prisma } from "@/lib/prisma";

const WISHLIST_ITEM_INCLUDE = {
  product: {
    include: {
      images: { orderBy: { displayOrder: "asc" as const } },
      brand: true,
      category: true,
      subCategory: true,
      seller: true,
    },
  },
};

export class WishlistService {
  async getOrCreateWishlist(userId: string) {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: { items: { include: WISHLIST_ITEM_INCLUDE } },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: { items: { include: WISHLIST_ITEM_INCLUDE } },
      });
    }

    return wishlist;
  }

  async toggle(userId: string, productId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return { added: false, wishlist: await this.getOrCreateWishlist(userId) };
    }

    await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId },
    });

    return { added: true, wishlist: await this.getOrCreateWishlist(userId) };
  }

  async remove(userId: string, productId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);

    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id, productId },
    });

    return this.getOrCreateWishlist(userId);
  }
}

export const wishlistService = new WishlistService();
export default wishlistService;
