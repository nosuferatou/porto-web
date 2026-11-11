-- AlterTable: add imageRatio with default 'video' to preserve existing posts
ALTER TABLE "Post" ADD COLUMN "imageRatio" TEXT NOT NULL DEFAULT 'video';
