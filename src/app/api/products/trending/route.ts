import { NextResponse } from "next/server";

import productService from "@/features/products/service/product.service";

export async function GET() {
  try {
    const products =
      await productService.getTrendingProducts();

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
          "Unable to fetch trending products.",
      },
      {
        status: 500,
      }
    );
  }
}