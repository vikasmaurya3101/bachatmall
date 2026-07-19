import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import cartService from "@/features/cart/service/cart.service";
import { UpdateCartItemDto } from "@/features/cart/dto/cart.dto";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Login required." },
      { status: 401 }
    );
  }

  try {
    const { itemId } = await params;
    const body = await request.json();
    const data = UpdateCartItemDto.parse(body);

    const cart = await cartService.updateItemQuantity(
      session.userId,
      itemId,
      data.quantity
    );

    return NextResponse.json({
      success: true,
      message: "Cart updated.",
      data: cart,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to update cart.",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Login required." },
      { status: 401 }
    );
  }

  try {
    const { itemId } = await params;

    const cart = await cartService.removeItem(session.userId, itemId);

    return NextResponse.json({
      success: true,
      message: "Item removed.",
      data: cart,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to remove item.",
      },
      { status: 400 }
    );
  }
}
