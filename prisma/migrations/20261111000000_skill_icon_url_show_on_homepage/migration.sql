-- AlterTable: add iconUrl (nullable) and showOnHomepage (boolean, default true)
ALTER TABLE "Skill" ADD COLUMN "iconUrl" TEXT;
ALTER TABLE "Skill" ADD COLUMN "showOnHomepage" BOOLEAN NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "Skill_showOnHomepage_idx" ON "Skill"("showOnHomepage");
