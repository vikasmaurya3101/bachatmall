import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: NextRequest,
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

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payment: true, address: true },
  });

  if (!order || order.userId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Order not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: order });
}
