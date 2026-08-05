import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import catalogService from "@/features/catalog/service/catalog.service";
import { UpdateCategoryDto } from "@/features/catalog/dto/catalog.dto";

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
    const dto = UpdateCategoryDto.parse(body);
    const category = await catalogService.updateCategory(id, dto);

    return NextResponse.json({
      success: true,
      message: "Category updated.",
      data: category,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to update category.",
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
    await catalogService.deleteCategory(id);

    return NextResponse.json({ success: true, message: "Category deleted." });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to delete category.",
      },
      { status: 400 }
    );
  }
}
