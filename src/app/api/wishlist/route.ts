import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import wishlistService from "@/features/wishlist/service/wishlist.service";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Login required." },
      { status: 401 }
    );
  }

  try {
    const wishlist = await wishlistService.getOrCreateWishlist(
      session.userId
    );

    return NextResponse.json({ success: true, data: wishlist });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch wishlist." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Login required." },
      { status: 401 }
    );
  }

  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "productId is required." },
        { status: 400 }
      );
    }

    const result = await wishlistService.toggle(session.userId, productId);

    return NextResponse.json({
      success: true,
      added: result.added,
      data: result.wishlist,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to update wishlist." },
      { status: 400 }
    );
  }
}
