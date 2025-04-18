/*
  Warnings:

  - You are about to drop the column `variantId` on the `WishlistItem` table. All the data in the column will be lost.
  - Added the required column `productId` to the `WishlistItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WishlistItem" DROP CONSTRAINT "WishlistItem_variantId_fkey";

-- DropForeignKey
ALTER TABLE "WishlistItem" DROP CONSTRAINT "WishlistItem_wishlistId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "id" SET DEFAULT 'ORD' || substring(gen_random_uuid()::text, 1, 8);

-- AlterTable
ALTER TABLE "WishlistItem" DROP COLUMN "variantId",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "productVariantId" TEXT;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
