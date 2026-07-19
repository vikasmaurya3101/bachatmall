import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const AddressSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(10).max(15),
  houseNumber: z.string().trim().min(1),
  apartment: z.string().trim().optional(),
  area: z.string().trim().min(1),
  landmark: z.string().trim().optional(),
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  type: z.enum(["HOME", "WORK", "OTHER"]).default("HOME"),
  isDefault: z.boolean().default(false),
});

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Login required." },
      { status: 401 }
    );
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ success: true, data: addresses });
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Login required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const data = AddressSchema.parse(body);

    const completeAddress = [
      data.houseNumber,
      data.apartment,
      data.area,
      data.landmark,
      `${data.city}, ${data.state} - ${data.pincode}`,
    ]
      .filter(Boolean)
      .join(", ");

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        ...data,
        completeAddress,
        userId: session.userId,
      },
    });

    return NextResponse.json({ success: true, data: address });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to save address.",
      },
      { status: 400 }
    );
  }
}
