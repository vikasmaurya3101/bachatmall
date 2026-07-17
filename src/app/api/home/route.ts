import { NextResponse } from "next/server";
import { productService } from "@/features/products/services/product.service";

export async function GET() {
  try {
    const data =
      await productService.getHomePageData();

    return NextResponse.json({
      success: true,
      message: "Home data fetched successfully.",
      data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch home data.",
      },
      {
        status: 500,
      }
    );
  }
}