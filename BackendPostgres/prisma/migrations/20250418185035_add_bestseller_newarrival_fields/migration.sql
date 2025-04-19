-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "id" SET DEFAULT 'ORD' || substring(gen_random_uuid()::text, 1, 8);

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNewArrival" BOOLEAN NOT NULL DEFAULT false;
