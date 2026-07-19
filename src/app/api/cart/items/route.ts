import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import cartService from "@/features/cart/service/cart.service";
import { AddCartItemDto } from "@/features/cart/dto/cart.dto";

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Login required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const data = AddCartItemDto.parse(body);

    const cart = await cartService.addItem(
      session.userId,
      data.productId,
      data.quantity
    );

    return NextResponse.json({
      success: true,
      message: "Added to cart.",
      data: cart,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to add to cart.",
      },
      { status: 400 }
    );
  }
}
