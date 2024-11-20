/*
  Warnings:

  - You are about to drop the column `buyPrice` on the `CurrencyRate` table. All the data in the column will be lost.
  - You are about to drop the column `capAmount` on the `CurrencyRate` table. All the data in the column will be lost.
  - You are about to drop the column `destinationCurrency` on the `CurrencyRate` table. All the data in the column will be lost.
  - You are about to drop the column `sellPrice` on the `CurrencyRate` table. All the data in the column will be lost.
  - You are about to drop the column `sourceCurrency` on the `CurrencyRate` table. All the data in the column will be lost.
  - Added the required column `BuyPrice` to the `CurrencyRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CapAmount` to the `CurrencyRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DestinationCurrency` to the `CurrencyRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SellPrice` to the `CurrencyRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SourceCurrency` to the `CurrencyRate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CurrencyRate" DROP COLUMN "buyPrice",
DROP COLUMN "capAmount",
DROP COLUMN "destinationCurrency",
DROP COLUMN "sellPrice",
DROP COLUMN "sourceCurrency",
ADD COLUMN     "BuyPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "CapAmount" INTEGER NOT NULL,
ADD COLUMN     "DestinationCurrency" TEXT NOT NULL,
ADD COLUMN     "SellPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "SourceCurrency" TEXT NOT NULL;
