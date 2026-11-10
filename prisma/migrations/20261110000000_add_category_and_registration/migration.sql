-- CreateTable: Category
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex: unique slug
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- AddColumn: categoryId (nullable FK) on Post
ALTER TABLE "Post" ADD COLUMN "categoryId" TEXT REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex: categoryId on Post
CREATE INDEX "Post_categoryId_idx" ON "Post"("categoryId");

-- Seed the four default categories from existing hardcoded values
INSERT INTO "Category" ("id", "name", "slug", "description", "createdAt", "updatedAt")
VALUES
  ('cat-web-engineering',  'Web Engineering', 'web-engineering',  '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat-pixel-art',        'Pixel Art',        'pixel-art',        '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat-ui-ux-design',     'UI/UX Design',     'ui-ux-design',     '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat-game-dev',         'Game Dev',         'game-dev',         '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Back-fill categoryId on existing posts using the category text column
UPDATE "Post" SET "categoryId" = 'cat-web-engineering' WHERE "category" = 'Web Engineering';
UPDATE "Post" SET "categoryId" = 'cat-pixel-art'       WHERE "category" = 'Pixel Art';
UPDATE "Post" SET "categoryId" = 'cat-ui-ux-design'    WHERE "category" = 'UI/UX Design';
UPDATE "Post" SET "categoryId" = 'cat-game-dev'        WHERE "category" = 'Game Dev';
