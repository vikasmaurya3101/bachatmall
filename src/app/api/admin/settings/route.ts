import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const ALLOWED_KEYS = [
  // contact
  "contact_email",
  "contact_phone",
  "whatsapp_number",
  "instagram_url",
  "facebook_url",
  "youtube_url",
  "twitter_url",
  "address",
  // branding
  "logo_url",
  // hero banner
  "hero_badge",
  "hero_title",
  "hero_subtitle",
  "hero_cta",
  // section titles
  "champion_section_title",
  "top_categories_title",
] as const;

type SettingKey = (typeof ALLOWED_KEYS)[number];

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Admin only." }, { status: 403 });
  }

  const rows = await prisma.siteSetting.findMany();
  const data: Record<string, string> = {};
  for (const row of rows) data[row.key] = row.value;

  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Admin only." }, { status: 403 });
  }

  const body = await request.json() as Record<string, unknown>;

  const updates: { key: SettingKey; value: string }[] = [];

  for (const key of ALLOWED_KEYS) {
    if (key in body && typeof body[key] === "string") {
      updates.push({ key, value: (body[key] as string).trim() });
    }
  }

  if (updates.length === 0) {
    return NextResponse.json({ success: false, message: "No valid fields provided." }, { status: 400 });
  }

  await prisma.$transaction(
    updates.map(({ key, value }) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  return NextResponse.json({ success: true, message: "Settings saved." });
}
