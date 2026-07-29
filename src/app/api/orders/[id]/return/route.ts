import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const RETURN_WINDOW_DAYS = 3;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Login required." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const { reason } = body as { reason?: string };

  if (!reason || !reason.trim()) {
    return NextResponse.json(
      { success: false, message: "Please tell us why you're returning this order." },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payment: true },
  });

  if (!order || order.userId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Order not found." },
      { status: 404 }
    );
  }

  if (order.orderStatus !== "DELIVERED" || !order.deliveredAt) {
    return NextResponse.json(
      {
        success: false,
        message: "Only delivered orders are eligible for return.",
      },
      { status: 400 }
    );
  }

  const daysSinceDelivery =
    (Date.now() - new Date(order.deliveredAt).getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceDelivery > RETURN_WINDOW_DAYS) {
    return NextResponse.json(
      {
        success: false,
        message: `The return window (${RETURN_WINDOW_DAYS} days from delivery) has passed for this order.`,
      },
      { status: 400 }
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.order.update({
      where: { id },
      data: {
        orderStatus: "RETURNED",
        returnReason: reason,
        returnRequestedAt: new Date(),
      },
      include: { items: true, payment: true, address: true },
    });

    const admins = await tx.user.findMany({
      where: { role: { in: ["ADMIN", "SELLER"] }, isActive: true },
      select: { id: true },
    });

    if (admins.length > 0) {
      await tx.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          type: "PUSH" as const,
          title: "Return Requested",
          message: `Order ${order.invoiceNumber} — return requested. Reason: ${reason}`,
          status: "SENT" as const,
          sentAt: new Date(),
          metadata: { orderId: id },
        })),
      });
    }

    return result;
  });

  return NextResponse.json({ success: true, data: updated });
}
