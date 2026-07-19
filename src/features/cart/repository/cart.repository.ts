import { prisma } from "@/lib/prisma";

const CART_ITEM_INCLUDE = {
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

export class CartRepository {
  async getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: CART_ITEM_INCLUDE } },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: CART_ITEM_INCLUDE } },
      });
    }

    return cart;
  }

  async findItem(cartId: string, productId: string) {
    return prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
    });
  }

  async addItem(cartId: string, productId: string, quantity: number) {
    return prisma.cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      update: { quantity: { increment: quantity } },
      create: { cartId, productId, quantity },
    });
  }

  async updateQuantity(itemId: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async removeItem(itemId: string) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  }

  async findItemById(itemId: string) {
    return prisma.cartItem.findUnique({ where: { id: itemId } });
  }

  async clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  }
}

export const cartRepository = new CartRepository();
export default cartRepository;
