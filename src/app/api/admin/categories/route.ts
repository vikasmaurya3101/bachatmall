import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SELLER")) {
    return NextResponse.json(
      { success: false, message: "Not authorized." },
      { status: 403 }
    );
  }

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ success: true, data: categories });
}
