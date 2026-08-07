import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 403 });
  }
  const flashSales = await prisma.flashSale.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json({ success: true, data: flashSales });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 403 });
  }
  try {
    const body = await request.json();
    const { name, startsAt, endsAt, isActive } = body;
    if (!name || !startsAt || !endsAt) {
      return NextResponse.json({ success: false, message: "Name, start and end dates required." }, { status: 400 });
    }
    const flashSale = await prisma.flashSale.create({
      data: { name, startsAt: new Date(startsAt), endsAt: new Date(endsAt), isActive: isActive ?? false },
    });
    return NextResponse.json({ success: true, data: flashSale });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed." }, { status: 400 });
  }
}
