import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PATCH(
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

  const existing = await prisma.address.findUnique({ where: { id } });

  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Address not found." },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();

    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data: address });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to update address." },
      { status: 400 }
    );
  }
}

export async function DELETE(
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

  const existing = await prisma.address.findUnique({ where: { id } });

  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Address not found." },
      { status: 404 }
    );
  }

  await prisma.address.delete({ where: { id } });

  return NextResponse.json({ success: true, message: "Address deleted." });
}
