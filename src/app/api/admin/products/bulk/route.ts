import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import productService from "@/features/products/service/product.service";

const BulkActionDto = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("publish"),
    ids: z.array(z.string()).min(1),
  }),
  z.object({
    action: z.literal("unpublish"),
    ids: z.array(z.string()).min(1),
  }),
  z.object({
    action: z.literal("delete"),
    ids: z.array(z.string()).min(1),
  }),
  z.object({
    action: z.literal("reassign"),
    ids: z.array(z.string()).min(1),
    categoryId: z.string(),
    subCategoryId: z.string().nullable().optional(),
  }),
]);

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
    const dto = BulkActionDto.parse(body);

    let count = 0;

    if (dto.action === "publish") {
      const result = await productService.bulkPublish(dto.ids);
      count = result.count;
    } else if (dto.action === "unpublish") {
      const result = await productService.bulkUnPublish(dto.ids);
      count = result.count;
    } else if (dto.action === "delete") {
      const result = await productService.bulkDelete(dto.ids);
      count = result.count;
    } else if (dto.action === "reassign") {
      const result = await productService.bulkReassign(
        dto.ids,
        dto.categoryId,
        dto.subCategoryId ?? null
      );
      count = result.count;
    }

    return NextResponse.json({
      success: true,
      message: `${count} product(s) updated.`,
      count,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Bulk action failed." },
      { status: 400 }
    );
  }
}
