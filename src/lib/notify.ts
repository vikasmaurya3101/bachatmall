import { Prisma, PrismaClient } from "@prisma/client";

type Tx = PrismaClient | Prisma.TransactionClient;

/**
 * Creates an in-app notification for every ADMIN/SELLER user when a new
 * order is placed. This uses the existing `Notification` table — it shows
 * up in the admin panel's bell icon (see /api/admin/notifications).
 *
 * To also send a real push/SMS/WhatsApp/email alert, plug a provider
 * (e.g. Twilio, FCM, Resend) in here later — the `type` field already
 * distinguishes channels, this just creates the PUSH/in-app record today.
 */
export async function notifyAdminsOfNewOrder(
  tx: Tx,
  order: { id: string; invoiceNumber: string; totalAmount: Prisma.Decimal | number }
) {
  const admins = await tx.user.findMany({
    where: { role: { in: ["ADMIN", "SELLER"] }, isActive: true },
    select: { id: true },
  });

  if (admins.length === 0) return;

  await tx.notification.createMany({
    data: admins.map((admin) => ({
      userId: admin.id,
      type: "PUSH" as const,
      title: "New Order Received",
      message: `Order ${order.invoiceNumber} placed — ₹${Number(
        order.totalAmount
      ).toFixed(2)}`,
      status: "SENT" as const,
      sentAt: new Date(),
      metadata: { orderId: order.id, invoiceNumber: order.invoiceNumber },
    })),
  });
}
