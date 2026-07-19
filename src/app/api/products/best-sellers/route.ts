import { NextResponse } from "next/server";

import productService from "@/features/products/service/product.service";

export async function GET() {
  try {
    const products =
      await productService.getBestSellerProducts();

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
          "Unable to fetch best seller products.",
      },
      {
        status: 500,
      }
    );
  }
}