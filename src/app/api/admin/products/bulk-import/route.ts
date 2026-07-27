import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { CreateProductDto } from "@/features/products/dto/create-product.dto";
import productService from "@/features/products/service/product.service";

interface ImportRow {
  name: string;
  description: string;
  sku: string;
  category: string;
  mrp: string | number;
  sellingPrice: string | number;
  stock?: string | number;
  imageUrl?: string;
  isPublished?: string | boolean;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SELLER")) {
    return NextResponse.json(
      { success: false, message: "Not authorized." },
      { status: 403 }
    );
  }

  const { rows } = (await request.json()) as { rows: ImportRow[] };

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json(
      { success: false, message: "No rows to import." },
      { status: 400 }
    );
  }

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });

  const categoryByName = new Map(
    categories.map((c) => [c.name.trim().toLowerCase(), c.id])
  );

  const results: { row: number; name: string; success: boolean; message: string }[] =
    [];

  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i];
    const rowNum = i + 2; // +2: header row + 1-indexed

    const categoryId = categoryByName.get(
      String(raw.category ?? "").trim().toLowerCase()
    );

    if (!categoryId) {
      results.push({
        row: rowNum,
        name: raw.name ?? "",
        success: false,
        message: `Unknown category "${raw.category}"`,
      });
      continue;
    }

    const candidate = {
      name: raw.name,
      slug: slugify(raw.name ?? ""),
      description: raw.description,
      sku: raw.sku,
      categoryId,
      mrp: Number(raw.mrp),
      sellingPrice: Number(raw.sellingPrice),
      stock: raw.stock ? Number(raw.stock) : 0,
      isPublished:
        String(raw.isPublished ?? "").toUpperCase() === "TRUE" ||
        raw.isPublished === true,
      images: raw.imageUrl
        ? [{ url: raw.imageUrl, isThumbnail: true, displayOrder: 0 }]
        : [],
    };

    const parsed = CreateProductDto.safeParse(candidate);

    if (!parsed.success) {
      results.push({
        row: rowNum,
        name: raw.name ?? "",
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid data",
      });
      continue;
    }

    try {
      await productService.createProduct(parsed.data);

      results.push({
        row: rowNum,
        name: parsed.data.name,
        success: true,
        message: "Created",
      });
    } catch (error) {
      results.push({
        row: rowNum,
        name: raw.name ?? "",
        success: false,
        message: error instanceof Error ? error.message : "Unable to create",
      });
    }
  }

  const successCount = results.filter((r) => r.success).length;

  return NextResponse.json({
    success: true,
    message: `${successCount} of ${rows.length} products created.`,
    data: results,
  });
}
