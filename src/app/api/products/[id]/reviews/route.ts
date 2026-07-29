import { NextRequest, NextResponse } from "next/server";
import productService from "@/features/products/service/product.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") ?? "1") || 1;
    const limit = Number(searchParams.get("limit") ?? "5") || 5;

    const [reviews, summary] = await Promise.all([
      productService.getProductReviews(id, page, limit),
      productService.getReviewSummary(id),
    ]);

    return NextResponse.json({
      success: true,
      data: { ...reviews, summary },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to load reviews.",
      },
      { status: 400 }
    );
  }
}
