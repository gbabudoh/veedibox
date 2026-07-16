-- CreateTable
CREATE TABLE "HomepageContent" (
    "id" TEXT NOT NULL DEFAULT 'homepage',
    "badgeText" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "subheading" TEXT NOT NULL,
    "primaryButtonText" TEXT NOT NULL,
    "primaryButtonHref" TEXT NOT NULL,
    "secondaryButtonText" TEXT NOT NULL,
    "secondaryButtonHref" TEXT NOT NULL,
    "heroTiles" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageContent_pkey" PRIMARY KEY ("id")
);
