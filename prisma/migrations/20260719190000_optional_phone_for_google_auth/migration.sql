-- AlterTable
-- Phone becomes optional: Google sign-in creates a user before a phone
-- number is collected (see the new /add-phone flow). Existing rows keep
-- their phone value; only the NOT NULL constraint is dropped, so this is
-- a safe, backward-compatible migration.
ALTER TABLE "public"."users" ALTER COLUMN "phone" DROP NOT NULL;
