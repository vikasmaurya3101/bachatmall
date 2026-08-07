import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 403 });
  }
  const banners = await prisma.banner.findMany({
    orderBy: [{ position: "asc" }, { displayOrder: "asc" }],
  });
  return NextResponse.json({ success: true, data: banners });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 403 });
  }
  try {
    const body = await request.json();
    const { title, image, linkUrl, position, displayOrder, isActive, startsAt, endsAt } = body;
    if (!title || !image) {
      return NextResponse.json({ success: false, message: "Title and image are required." }, { status: 400 });
    }
    const banner = await prisma.banner.create({
      data: {
        title, image,
        linkUrl: linkUrl || null,
        position: position || "HOME_TOP",
        displayOrder: displayOrder ? parseInt(String(displayOrder)) : 0,
        isActive: isActive ?? true,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
      },
    });
    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed." }, { status: 400 });
  }
}
