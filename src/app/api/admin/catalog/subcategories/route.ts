import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import catalogService from "@/features/catalog/service/catalog.service";
import { CreateSubCategoryDto } from "@/features/catalog/dto/catalog.dto";

export async function GET() {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SELLER")) {
    return NextResponse.json(
      { success: false, message: "Not authorized." },
      { status: 403 }
    );
  }

  const subCategories = await catalogService.getSubCategories();

  return NextResponse.json({ success: true, data: subCategories });
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
    const dto = CreateSubCategoryDto.parse(body);
    const subCategory = await catalogService.createSubCategory(dto);

    return NextResponse.json({
      success: true,
      message: "Subcategory created.",
      data: subCategory,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to create subcategory.",
      },
      { status: 400 }
    );
  }
}
