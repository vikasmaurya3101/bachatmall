import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 403 });
  }
  const { id } = await params;
  const flashSale = await prisma.flashSale.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          product: {
            select: { id: true, name: true, mrp: true, sellingPrice: true, stock: true, images: { where: { isThumbnail: true }, take: 1 } },
          },
        },
      },
    },
  });
  if (!flashSale) return NextResponse.json({ success: false, message: "Not found." }, { status: 404 });
  return NextResponse.json({ success: true, data: flashSale });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 403 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const flashSale = await prisma.flashSale.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.startsAt !== undefined && { startsAt: new Date(body.startsAt) }),
        ...(body.endsAt !== undefined && { endsAt: new Date(body.endsAt) }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });
    return NextResponse.json({ success: true, data: flashSale });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed." }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 403 });
  }
  try {
    const { id } = await params;
    await prisma.flashSale.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Flash sale deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed." }, { status: 400 });
  }
}
