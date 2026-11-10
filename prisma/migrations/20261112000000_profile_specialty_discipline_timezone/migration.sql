-- AlterTable: add specialty, discipline, timezone (all nullable) to Profile
ALTER TABLE "Profile" ADD COLUMN "specialty" TEXT;
ALTER TABLE "Profile" ADD COLUMN "discipline" TEXT;
ALTER TABLE "Profile" ADD COLUMN "timezone" TEXT;
