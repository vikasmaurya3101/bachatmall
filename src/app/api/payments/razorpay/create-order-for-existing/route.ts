import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getRazorpayInstance } from "@/lib/razorpay";
import { getPrepaidAmount } from "@/lib/utils/discount";

/**
 * Creates a Razorpay order for an existing DB order that still has
 * paymentStatus = PENDING (COD order where user chose to pay online later).
 */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Login required." }, { status: 401 });
  }

  const { orderId } = await request.json() as { orderId: string };

  if (!orderId) {
    return NextResponse.json({ success: false, message: "orderId required." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true },
  });

  if (!order || order.userId !== session.userId) {
    return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
  }

  if (order.paymentStatus !== "PENDING") {
    return NextResponse.json({ success: false, message: "Order is already paid." }, { status: 400 });
  }

  // Apply prepaid discount: COD totalAmount is full price; online payment gets ₹15 off
  const amountPaise = Math.round(getPrepaidAmount(Number(order.totalAmount)) * 100);

  const razorpay = getRazorpayInstance();
  const rzpOrder = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: `paynow_${Date.now()}_${session.userId.slice(-8)}`,
    notes: { userId: session.userId, shopkaOrderId: orderId },
  });

  return NextResponse.json({
    success: true,
    data: {
      rzpOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    },
  });
}
