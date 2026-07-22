import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const SHIPPING_CHARGE_THRESHOLD = 499;
const SHIPPING_CHARGE = 49;

interface RazorpayPaymentDetails {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

/**
 * Verifies the HMAC-SHA256 signature Razorpay returns after a successful
 * payment, proving the payment really happened and wasn't tampered with.
 * https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration/#step-5-verify-payment-signature
 */
function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: RazorpayPaymentDetails) {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    throw new Error("Razorpay isn't configured on the server.");
  }

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new Error("Missing payment verification details.");
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expected !== razorpaySignature) {
    throw new Error("Payment verification failed. Please contact support.");
  }
}

function generateInvoiceNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `BM-${y}-${rand}`;
}

export class CheckoutService {
  async placeOrder(
    userId: string,
    addressId: string,
    paymentMethod: "COD" | "RAZORPAY" | "UPI",
    razorpayDetails?: RazorpayPaymentDetails
  ) {
    if (paymentMethod === "RAZORPAY") {
      verifyRazorpaySignature(razorpayDetails ?? {});
    }

    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      throw new Error("Delivery address not found.");
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { displayOrder: "asc" } },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Your cart is empty.");
    }

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new Error(
          `${item.product.name} only has ${item.product.stock} unit(s) left.`
        );
      }
    }

    let subtotal = new Prisma.Decimal(0);
    let mrpTotal = new Prisma.Decimal(0);
    let taxTotal = new Prisma.Decimal(0);

    const orderItemsData = cart.items.map((item) => {
      const sellingPrice = new Prisma.Decimal(item.product.sellingPrice);
      const mrp = new Prisma.Decimal(item.product.mrp);
      const lineTotal = sellingPrice.mul(item.quantity);
      const lineTax = lineTotal
        .mul(new Prisma.Decimal(item.product.taxPercent))
        .div(100);

      subtotal = subtotal.add(lineTotal);
      mrpTotal = mrpTotal.add(mrp.mul(item.quantity));
      taxTotal = taxTotal.add(lineTax);

      return {
        productId: item.productId,
        productName: item.product.name,
        productImage:
          item.product.images.find((img) => img.isThumbnail)?.url ??
          item.product.images[0]?.url ??
          null,
        sku: item.product.sku,
        quantity: item.quantity,
        mrp: item.product.mrp,
        sellingPrice: item.product.sellingPrice,
        taxAmount: lineTax,
        totalAmount: lineTotal.add(lineTax),
      };
    });

    const discountAmount = mrpTotal.sub(subtotal);
    const shippingCharge = subtotal.gte(SHIPPING_CHARGE_THRESHOLD)
      ? new Prisma.Decimal(0)
      : new Prisma.Decimal(SHIPPING_CHARGE);
    const totalAmount = subtotal.add(taxTotal).add(shippingCharge);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          invoiceNumber: generateInvoiceNumber(),
          userId,
          addressId,
          subtotal,
          discountAmount,
          shippingCharge,
          taxAmount: taxTotal,
          totalAmount,
          orderStatus: "CONFIRMED",
          paymentStatus: paymentMethod === "RAZORPAY" ? "PAID" : "PENDING",
          shipmentStatus: "PENDING",
          items: { create: orderItemsData },
          payment: {
            create: {
              method: paymentMethod,
              status: paymentMethod === "RAZORPAY" ? "PAID" : "PENDING",
              amount: totalAmount,
              ...(paymentMethod === "RAZORPAY"
                ? {
                    razorpayOrderId: razorpayDetails?.razorpayOrderId,
                    razorpayPaymentId: razorpayDetails?.razorpayPaymentId,
                    razorpaySignature: razorpayDetails?.razorpaySignature,
                    paidAt: new Date(),
                  }
                : {}),
            },
          },
        },
        include: { items: true, payment: true, address: true },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    return order;
  }
}

export const checkoutService = new CheckoutService();
export default checkoutService;
