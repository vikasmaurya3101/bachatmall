import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 403 });
  }
  try {
    const { id } = await params;
    const { productId, flashPrice, stockLimit } = await request.json();
    if (!productId || flashPrice === undefined) {
      return NextResponse.json({ success: false, message: "Product ID and flash price required." }, { status: 400 });
    }
    const item = await prisma.flashSaleProduct.upsert({
      where: { flashSaleId_productId: { flashSaleId: id, productId } },
      create: { flashSaleId: id, productId, flashPrice: parseFloat(flashPrice), stockLimit: stockLimit ? parseInt(stockLimit) : null },
      update: { flashPrice: parseFloat(flashPrice), stockLimit: stockLimit ? parseInt(stockLimit) : null },
      include: {
        product: {
          select: { id: true, name: true, mrp: true, sellingPrice: true, images: { where: { isThumbnail: true }, take: 1 } },
        },
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed." }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 403 });
  }
  try {
    const { id } = await params;
    const { productId } = await request.json();
    await prisma.flashSaleProduct.delete({
      where: { flashSaleId_productId: { flashSaleId: id, productId } },
    });
    return NextResponse.json({ success: true, message: "Product removed." });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed." }, { status: 400 });
  }
}
