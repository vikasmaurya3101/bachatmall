-- AlterTable
-- Captures the buyer's exact GPS coordinates at checkout (optional —
-- addresses saved before this feature, or where the user denies location
-- permission, simply have NULL here and still work fine).
ALTER TABLE "public"."addresses" ADD COLUMN "latitude" DOUBLE PRECISION;
ALTER TABLE "public"."addresses" ADD COLUMN "longitude" DOUBLE PRECISION;
