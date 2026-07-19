import {
  NextRequest,
  NextResponse,
} from "next/server";

import productService from "@/features/products/service/product.service";

import {
  ProductQueryDto,
} from "@/features/products/dto/product-query.dto";

import {
  CreateProductDto,
} from "@/features/products/dto/create-product.dto";

export async function GET(
  request: NextRequest
) {
  try {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const filters =
      ProductQueryDto.parse(query);

    const data =
      await productService.getProducts(
        filters
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
          "Unable to fetch products.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const data =
      CreateProductDto.parse(body);

    const product =
      await productService.createProduct(
        data
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Product created successfully.",
        data: product,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create product.",
      },
      {
        status: 400,
      }
    );
  }
}