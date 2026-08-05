import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import catalogService from "@/features/catalog/service/catalog.service";
import { UpdateBrandDto } from "@/features/catalog/dto/catalog.dto";

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
    const dto = UpdateBrandDto.parse(body);
    const brand = await catalogService.updateBrand(id, dto);

    return NextResponse.json({
      success: true,
      message: "Brand updated.",
      data: brand,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to update brand.",
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
    await catalogService.deleteBrand(id);

    return NextResponse.json({ success: true, message: "Brand deleted." });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to delete brand.",
      },
      { status: 400 }
    );
  }
}
