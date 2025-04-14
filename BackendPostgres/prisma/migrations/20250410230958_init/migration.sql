/*
  Warnings:

  - A unique constraint covering the columns `[PHONE]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "PHONE" TEXT NOT NULL DEFAULT '000';

-- CreateIndex
CREATE UNIQUE INDEX "User_PHONE_key" ON "User"("PHONE");
