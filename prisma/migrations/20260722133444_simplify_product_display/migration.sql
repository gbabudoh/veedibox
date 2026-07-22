-- Formats badge is now derived from real uploaded file extensions instead of admin free text
-- (see deriveFormats in src/lib/product-mapper.ts). Dimensions duplicated the existing
-- metadata.printSizes field for Wall Art and was meaningless for other categories.
ALTER TABLE "Product" DROP COLUMN "dimensions";
ALTER TABLE "Product" DROP COLUMN "formats";
