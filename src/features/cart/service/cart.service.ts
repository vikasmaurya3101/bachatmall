import { prisma } from "@/lib/prisma";
import cartRepository from "../repository/cart.repository";

export class CartService {
  async getCart(userId: string) {
    return cartRepository.getOrCreateCart(userId);
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, stock: true, isPublished: true },
    });

    if (!product || !product.isPublished) {
      throw new Error("Product not found");
    }

    const cart = await cartRepository.getOrCreateCart(userId);

    const existing = await cartRepository.findItem(cart.id, productId);
    const nextQuantity = (existing?.quantity ?? 0) + quantity;

    if (nextQuantity > product.stock) {
      throw new Error(
        `Only ${product.stock} unit(s) available in stock.`
      );
    }

    await cartRepository.addItem(cart.id, productId, quantity);

    return cartRepository.getOrCreateCart(userId);
  }

  async updateItemQuantity(
    userId: string,
    itemId: string,
    quantity: number
  ) {
    const item = await cartRepository.findItemById(itemId);

    if (!item) {
      throw new Error("Cart item not found");
    }

    const cart = await cartRepository.getOrCreateCart(userId);

    if (item.cartId !== cart.id) {
      throw new Error("You don't have permission to modify this item.");
    }

    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { stock: true },
    });

    if (product && quantity > product.stock) {
      throw new Error(
        `Only ${product.stock} unit(s) available in stock.`
      );
    }

    await cartRepository.updateQuantity(itemId, quantity);

    return cartRepository.getOrCreateCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const item = await cartRepository.findItemById(itemId);

    if (!item) {
      throw new Error("Cart item not found");
    }

    const cart = await cartRepository.getOrCreateCart(userId);

    if (item.cartId !== cart.id) {
      throw new Error("You don't have permission to modify this item.");
    }

    await cartRepository.removeItem(itemId);

    return cartRepository.getOrCreateCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await cartRepository.getOrCreateCart(userId);
    await cartRepository.clearCart(cart.id);
    return cartRepository.getOrCreateCart(userId);
  }
}

export const cartService = new CartService();
export default cartService;
