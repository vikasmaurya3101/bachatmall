import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PRODUCT_INCLUDE = {
  images: { orderBy: { displayOrder: "asc" as const } },
  brand: true,
  category: true,
  subCategory: true,
  seller: true,
};

/**
 * Batch-fetch published products by id, preserving the requested order.
 * Used by the "Recently Viewed" rail, which only has ids in localStorage.
 */
export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids") ?? "";
  const ids = idsParam.split(",").map((id) => id.trim()).filter(Boolean);

  if (ids.length === 0) {
    return NextResponse.json({ success: true, data: [] });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isPublished: true },
    include: PRODUCT_INCLUDE,
  });

  const byId = new Map(products.map((p) => [p.id, p]));
  const ordered = ids.map((id) => byId.get(id)).filter(Boolean);

  return NextResponse.json({ success: true, data: ordered });
}
