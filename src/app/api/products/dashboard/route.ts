import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import productService from "@/features/products/service/product.service";

/**
 * Seller/admin product dashboard stats: counts, revenue estimate,
 * low-stock and out-of-stock alerts.
 */
export async function GET() {
  const session = await getSession();

  if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
    return NextResponse.json(
      { success: false, message: "Not authorized." },
      { status: 403 }
    );
  }

  try {
    const [stats, lowStock, outOfStock] = await Promise.all([
      productService.getDashboardStats(),
      productService.getLowStockProducts(),
      productService.getOutOfStockProducts(),
    ]);

    return NextResponse.json({
      success: true,
      data: { stats, lowStock, outOfStock },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to load dashboard data." },
      { status: 500 }
    );
  }
}
