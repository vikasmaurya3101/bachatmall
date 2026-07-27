import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getRazorpayInstance } from "@/lib/razorpay";

const SHIPPING_CHARGE_THRESHOLD = 499;
const SHIPPING_CHARGE = 49;

/**
 * Creates a Razorpay order sized to the user's current cart total, so the
 * checkout page can open the Razorpay payment modal against it. The actual
 * order/payment record in our DB is only created afterwards, in
 * /api/checkout, once the payment is confirmed & the signature verified.
 */
export async function POST() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Login required." },
      { status: 401 }
    );
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Your cart is empty." },
        { status: 400 }
      );
    }

    let subtotal = new Prisma.Decimal(0);
    let taxTotal = new Prisma.Decimal(0);

    for (const item of cart.items) {
      const sellingPrice = new Prisma.Decimal(item.product.sellingPrice);
      const lineTotal = sellingPrice.mul(item.quantity);
      const lineTax = lineTotal
        .mul(new Prisma.Decimal(item.product.taxPercent))
        .div(100);

      subtotal = subtotal.add(lineTotal);
      taxTotal = taxTotal.add(lineTax);
    }

    const shippingCharge = subtotal.gte(SHIPPING_CHARGE_THRESHOLD)
      ? new Prisma.Decimal(0)
      : new Prisma.Decimal(SHIPPING_CHARGE);

    const totalAmount = subtotal.add(taxTotal).add(shippingCharge);
    const amountInPaise = Math.round(totalAmount.toNumber() * 100);

    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `ord_${Date.now()}_${session.userId.slice(-8)}`,
      notes: { userId: session.userId },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error("RAZORPAY CREATE ORDER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to start payment. Please try again.",
      },
      { status: 500 }
    );
  }
}
