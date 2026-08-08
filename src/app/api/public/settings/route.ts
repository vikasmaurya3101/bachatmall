import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

const PUBLIC_KEYS = [
  "logo_url",
  "hero_badge",
  "hero_title",
  "hero_subtitle",
  "hero_cta",
  "champion_section_title",
  "top_categories_title",
];

export async function GET() {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: PUBLIC_KEYS } },
  });
  const data: Record<string, string> = {};
  for (const row of rows) data[row.key] = row.value;
  return NextResponse.json({ success: true, data });
}
