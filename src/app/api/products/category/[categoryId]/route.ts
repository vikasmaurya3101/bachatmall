import { NextRequest, NextResponse } from "next/server";

import productService from "@/features/products/service/product.service";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      categoryId: string;
    }>;
  }
) {
  try {
    const { categoryId } = await params;

    const page = Number(
      request.nextUrl.searchParams.get("page") ??
        1
    );

    const limit = Number(
      request.nextUrl.searchParams.get("limit") ??
        20
    );

    const data =
      await productService.getCategoryProducts(
        categoryId,
        page,
        limit
      );

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch category products.",
      },
      {
        status: 500,
      }
    );
  }
}