-- CreateTable
CREATE TABLE "AboutPageContent" (
    "id" TEXT NOT NULL DEFAULT 'about',
    "badgeText" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "paragraph1" TEXT NOT NULL,
    "paragraph2" TEXT NOT NULL,
    "storyVisualHue" INTEGER NOT NULL,
    "storyVisualTitle" TEXT NOT NULL,
    "storyVisualSubtitle" TEXT NOT NULL,
    "pillar1Title" TEXT NOT NULL,
    "pillar1Desc" TEXT NOT NULL,
    "pillar2Title" TEXT NOT NULL,
    "pillar2Desc" TEXT NOT NULL,
    "pillar3Title" TEXT NOT NULL,
    "pillar3Desc" TEXT NOT NULL,
    "ctaHeading" TEXT NOT NULL,
    "ctaSubheading" TEXT NOT NULL,
    "ctaButtonText" TEXT NOT NULL,
    "ctaButtonHref" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPageContent_pkey" PRIMARY KEY ("id")
);
