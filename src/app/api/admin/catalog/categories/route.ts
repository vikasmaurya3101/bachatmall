import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import catalogService from "@/features/catalog/service/catalog.service";
import { CreateCategoryDto } from "@/features/catalog/dto/catalog.dto";

export async function GET() {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SELLER")) {
    return NextResponse.json(
      { success: false, message: "Not authorized." },
      { status: 403 }
    );
  }

  const categories = await catalogService.getCategories();

  return NextResponse.json({ success: true, data: categories });
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Not authorized." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const dto = CreateCategoryDto.parse(body);
    const category = await catalogService.createCategory(dto);

    return NextResponse.json({
      success: true,
      message: "Category created.",
      data: category,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to create category.",
      },
      { status: 400 }
    );
  }
}
