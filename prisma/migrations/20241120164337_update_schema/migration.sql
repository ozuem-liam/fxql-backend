/*
  Warnings:

  - A unique constraint covering the columns `[CurrencyPair]` on the table `CurrencyRate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `CurrencyPair` to the `CurrencyRate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CurrencyRate" ADD COLUMN     "CurrencyPair" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyRate_CurrencyPair_key" ON "CurrencyRate"("CurrencyPair");
