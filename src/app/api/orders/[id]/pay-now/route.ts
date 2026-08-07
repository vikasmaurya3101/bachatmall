import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

/**
 * Verifies Razorpay payment for an existing PENDING order and marks it PAID.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Login required." }, { status: 401 });
  }

  const { id } = await params;
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    await request.json() as {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    };

  const order = await prisma.order.findUnique({
    where: { id },
    include: { payment: true, items: true, address: true },
  });

  if (!order || order.userId !== session.userId) {
    return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
  }

  if (order.paymentStatus !== "PENDING") {
    return NextResponse.json({ success: false, message: "Order is already paid." }, { status: 400 });
  }

  // Verify HMAC signature
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ success: false, message: "Payment not configured." }, { status: 500 });
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expected !== razorpaySignature) {
    return NextResponse.json({ success: false, message: "Payment verification failed." }, { status: 400 });
  }

  // Mark order and payment as paid, confirm the order
  const updated = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id },
      data: {
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
      },
      include: { payment: true, items: true, address: true },
    });

    if (order.payment) {
      await tx.payment.update({
        where: { id: order.payment.id },
        data: {
          status: "PAID",
          method: "RAZORPAY",
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          paidAt: new Date(),
        },
      });
    } else {
      await tx.payment.create({
        data: {
          orderId: id,
          method: "RAZORPAY",
          status: "PAID",
          amount: order.totalAmount,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          paidAt: new Date(),
        },
      });
    }

    return updatedOrder;
  });

  return NextResponse.json({ success: true, data: updated });
}
