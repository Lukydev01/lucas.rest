-- AlterTable
ALTER TABLE "Episode" ADD COLUMN     "sourceType" TEXT NOT NULL DEFAULT 'youtube',
ADD COLUMN     "youtubeId" TEXT,
ALTER COLUMN "videoUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MediaAsset" ADD COLUMN     "sourceType" TEXT NOT NULL DEFAULT 'youtube',
ADD COLUMN     "youtubeId" TEXT,
ALTER COLUMN "url" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Episode_seasonId_idx" ON "Episode"("seasonId");
