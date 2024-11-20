-- CreateTable
CREATE TABLE "CurrencyRate" (
    "EntryId" SERIAL NOT NULL,
    "sourceCurrency" TEXT NOT NULL,
    "destinationCurrency" TEXT NOT NULL,
    "buyPrice" DOUBLE PRECISION NOT NULL,
    "sellPrice" DOUBLE PRECISION NOT NULL,
    "capAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurrencyRate_pkey" PRIMARY KEY ("EntryId")
);
