import {
  NextRequest,
  NextResponse,
} from "next/server";

import productService from "@/features/products/service/product.service";

import {
  UpdateProductDto,
} from "@/features/products/dto/update-product.dto";

export async function GET(
  _: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    const product =
      await productService.getProductById(
        id
      );

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch product.",
      },
      {
        status: 404,
      }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    const body =
      await request.json();

    const data =
      UpdateProductDto.parse(
        body
      );

    const product =
      await productService.updateProduct(
        id,
        data
      );

    return NextResponse.json({
      success: true,
      message:
        "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update product.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    await productService.deleteProduct(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Product deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete product.",
      },
      {
        status: 400,
      }
    );
  }
}