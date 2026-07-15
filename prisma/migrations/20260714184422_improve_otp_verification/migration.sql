/*
  Warnings:

  - You are about to drop the column `otpCode` on the `otp_verifications` table. All the data in the column will be lost.
  - Added the required column `otpHash` to the `otp_verifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `otp_verifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."otp_verifications" DROP COLUMN "otpCode",
ADD COLUMN     "otpHash" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verifiedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "otp_verifications_expiresAt_idx" ON "public"."otp_verifications"("expiresAt");

-- CreateIndex
CREATE INDEX "otp_verifications_phone_purpose_isVerified_idx" ON "public"."otp_verifications"("phone", "purpose", "isVerified");
