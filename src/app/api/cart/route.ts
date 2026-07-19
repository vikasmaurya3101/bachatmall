import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import cartService from "@/features/cart/service/cart.service";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Login required." },
      { status: 401 }
    );
  }

  try {
    const cart = await cartService.getCart(session.userId);

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch cart." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Login required." },
      { status: 401 }
    );
  }

  try {
    const cart = await cartService.clearCart(session.userId);

    return NextResponse.json({
      success: true,
      message: "Cart cleared.",
      data: cart,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to clear cart." },
      { status: 500 }
    );
  }
}
