-- CreateTable
CREATE TABLE "AdIntegration" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "pixelId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdIntegration_platform_key" ON "AdIntegration"("platform");
