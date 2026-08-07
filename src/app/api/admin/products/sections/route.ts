import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const section = searchParams.get("section") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "30");

  const where: Record<string, unknown> = { isPublished: true };
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  if (section === "featured") where.isFeatured = true;
  else if (section === "trending") where.isTrending = true;
  else if (section === "bestseller") where.isBestSeller = true;
  else if (section === "newarrival") where.isNewArrival = true;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id: true, name: true, slug: true, sellingPrice: true, mrp: true, stock: true,
        isFeatured: true, isTrending: true, isBestSeller: true, isNewArrival: true, isPublished: true,
        images: { where: { isThumbnail: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ success: true, data: { products, total, page, totalPages: Math.ceil(total / limit) } });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 403 });
  }
  try {
    const body = await request.json();
    const { productId, flags } = body;
    // flags is an object like { isFeatured: true, isTrending: false, ... }
    if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID required." }, { status: 400 });
    }
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(flags.isFeatured !== undefined && { isFeatured: flags.isFeatured }),
        ...(flags.isTrending !== undefined && { isTrending: flags.isTrending }),
        ...(flags.isBestSeller !== undefined && { isBestSeller: flags.isBestSeller }),
        ...(flags.isNewArrival !== undefined && { isNewArrival: flags.isNewArrival }),
      },
      select: { id: true, isFeatured: true, isTrending: true, isBestSeller: true, isNewArrival: true },
    });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed." }, { status: 400 });
  }
}
