import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import catalogService from "@/features/catalog/service/catalog.service";
import { CreateBrandDto } from "@/features/catalog/dto/catalog.dto";

export async function GET() {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SELLER")) {
    return NextResponse.json(
      { success: false, message: "Not authorized." },
      { status: 403 }
    );
  }

  const brands = await catalogService.getBrands();

  return NextResponse.json({ success: true, data: brands });
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
    const dto = CreateBrandDto.parse(body);
    const brand = await catalogService.createBrand(dto);

    return NextResponse.json({
      success: true,
      message: "Brand created.",
      data: brand,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to create brand.",
      },
      { status: 400 }
    );
  }
}
