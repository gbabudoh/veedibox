-- CreateEnum
CREATE TYPE "FileKind" AS ENUM ('DIGITAL', 'PRINT');

-- CreateTable
CREATE TABLE "ProductFile" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "kind" "FileKind" NOT NULL DEFAULT 'DIGITAL',
    "fileKey" TEXT NOT NULL,
    "fileSizeMb" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductFile_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "fileKey";
ALTER TABLE "Product" DROP COLUMN "fileSizeMb";

-- AlterTable
ALTER TABLE "DownloadToken" ADD COLUMN "productFileId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductFile" ADD CONSTRAINT "ProductFile_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadToken" ADD CONSTRAINT "DownloadToken_productFileId_fkey" FOREIGN KEY ("productFileId") REFERENCES "ProductFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
