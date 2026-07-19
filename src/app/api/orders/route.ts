import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Login required." },
      { status: 401 }
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: { items: true, payment: true, address: true },
    orderBy: { placedAt: "desc" },
  });

  return NextResponse.json({ success: true, data: orders });
}
