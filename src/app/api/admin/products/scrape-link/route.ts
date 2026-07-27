import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { scrapeProductFromUrl } from "@/lib/scrape-product";

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SELLER")) {
    return NextResponse.json(
      { success: false, message: "Not authorized." },
      { status: 403 }
    );
  }

  try {
    const { url } = await request.json();

    if (typeof url !== "string" || !/^https?:\/\//i.test(url)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid product URL." },
        { status: 400 }
      );
    }

    const data = await scrapeProductFromUrl(url);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Couldn't read that link. You can still fill the form manually.",
      },
      { status: 200 }
    );
  }
}
