-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "id" SET DEFAULT 'ORD' || substring(gen_random_uuid()::text, 1, 8);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT;
