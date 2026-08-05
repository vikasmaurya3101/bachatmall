import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import catalogService from "@/features/catalog/service/catalog.service";
import { UpdateSubCategoryDto } from "@/features/catalog/dto/catalog.dto";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Not authorized." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const dto = UpdateSubCategoryDto.parse(body);
    const subCategory = await catalogService.updateSubCategory(id, dto);

    return NextResponse.json({
      success: true,
      message: "Subcategory updated.",
      data: subCategory,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to update subcategory.",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Not authorized." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    await catalogService.deleteSubCategory(id);

    return NextResponse.json({ success: true, message: "Subcategory deleted." });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to delete subcategory.",
      },
      { status: 400 }
    );
  }
}
