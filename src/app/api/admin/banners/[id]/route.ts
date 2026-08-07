import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 403 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.linkUrl !== undefined && { linkUrl: body.linkUrl || null }),
        ...(body.position !== undefined && { position: body.position }),
        ...(body.displayOrder !== undefined && { displayOrder: parseInt(String(body.displayOrder)) }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.startsAt !== undefined && { startsAt: body.startsAt ? new Date(body.startsAt) : null }),
        ...(body.endsAt !== undefined && { endsAt: body.endsAt ? new Date(body.endsAt) : null }),
      },
    });
    return NextResponse.json({ success: true, data: banner });
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
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Banner deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed." }, { status: 400 });
  }
}
