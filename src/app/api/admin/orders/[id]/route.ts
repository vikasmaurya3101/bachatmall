import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { OrderStatus, ShipmentStatus, PaymentStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SELLER")) {
    return null;
  }

  return session;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Not authorized." },
      { status: 403 }
    );
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      payment: true,
      address: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          profileImage: true,
          createdAt: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json(
      { success: false, message: "Order not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: order });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Not authorized." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const body = await request.json();
  const { orderStatus, shipmentStatus } = body as {
    orderStatus?: OrderStatus;
    shipmentStatus?: ShipmentStatus;
  };

  const existing = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payment: true },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Order not found." },
      { status: 404 }
    );
  }

  const RESTOCK_STATUSES: OrderStatus[] = ["CANCELLED", "RETURNED"];
  const wasAlreadyRestocked = RESTOCK_STATUSES.includes(existing.orderStatus);
  const isNewlyRestockable =
    !!orderStatus &&
    RESTOCK_STATUSES.includes(orderStatus) &&
    !wasAlreadyRestocked;

  const isNewlyCancelled =
    orderStatus === "CANCELLED" && existing.orderStatus !== "CANCELLED";
  const isNewlyDelivered =
    orderStatus === "DELIVERED" && existing.orderStatus !== "DELIVERED";
  const shouldMarkRefunded =
    (orderStatus === "CANCELLED" || orderStatus === "REFUNDED") &&
    existing.payment?.status === "PAID" &&
    existing.payment.status !== "REFUNDED";

  const updated = await prisma.$transaction(async (tx) => {
    // Cancelling or returning restocks inventory. If it was already paid, we
    // also mark the payment refunded (the actual refund still needs to be
    // issued via your payment gateway — this just reflects it in the record).
    if (isNewlyRestockable) {
      for (const item of existing.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    if (shouldMarkRefunded) {
      await tx.payment.update({
        where: { orderId: id },
        data: { status: "REFUNDED" as PaymentStatus },
      });
    }

    const order = await tx.order.update({
      where: { id },
      data: {
        ...(orderStatus ? { orderStatus } : {}),
        ...(shipmentStatus ? { shipmentStatus } : {}),
        ...(isNewlyDelivered && !existing.deliveredAt
          ? { deliveredAt: new Date() }
          : {}),
        ...(shouldMarkRefunded ? { paymentStatus: "REFUNDED" as PaymentStatus } : {}),
      },
      include: { items: true, payment: true, address: true, user: true },
    });

    await tx.notification.create({
      data: {
        userId: existing.userId,
        type: "PUSH",
        title: isNewlyCancelled ? "Order Cancelled" : "Order Update",
        message: isNewlyCancelled
          ? `Your order ${existing.invoiceNumber} has been cancelled.`
          : `Your order ${existing.invoiceNumber} is now ${
              orderStatus ?? existing.orderStatus
            }.`,
        status: "SENT",
        sentAt: new Date(),
        metadata: { orderId: id },
      },
    });

    return order;
  });

  return NextResponse.json({ success: true, data: updated });
}
