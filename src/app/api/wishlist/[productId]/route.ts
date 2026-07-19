import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import wishlistService from "@/features/wishlist/service/wishlist.service";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Login required." },
      { status: 401 }
    );
  }

  try {
    const { productId } = await params;

    const wishlist = await wishlistService.remove(
      session.userId,
      productId
    );

    return NextResponse.json({
      success: true,
      message: "Removed from wishlist.",
      data: wishlist,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to remove item." },
      { status: 400 }
    );
  }
}
