import { NextRequest, NextResponse } from "next/server";

import productService from "@/features/products/service/product.service";

export async function GET(
  request: NextRequest
) {
  try {
    const keyword =
      request.nextUrl.searchParams.get("q") ??
      "";

    if (!keyword.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Search keyword is required.",
        },
        {
          status: 400,
        }
      );
    }

    const products =
      await productService.search(
        keyword
      );

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to search products.",
      },
      {
        status: 500,
      }
    );
  }
}