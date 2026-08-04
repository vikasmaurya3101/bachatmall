import { PrismaClient, Role } from "@prisma/client";

export async function seedSeller(
  prisma: PrismaClient
) {
  const phone = "9999999999";

  const user = await prisma.user.upsert({
    where: {
      phone,
    },
    update: {},
    create: {
      phone,
      phoneVerified: true,
      firstName: "Demo",
      lastName: "Seller",
      role: Role.CUSTOMER,
    },
  });

  await prisma.seller.upsert({
    where: {
      userId: user.id,
    },
    update: {},
    create: {
      userId: user.id,
      businessName: "Shopka Official Store",
      gstNumber: "22AAAAA0000A1Z5",
      isApproved: true,
    },
  });

  console.log("✅ Demo Seller Seeded");
}