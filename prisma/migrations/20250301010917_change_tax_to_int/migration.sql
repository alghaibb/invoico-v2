/*
  Warnings:

  - You are about to alter the column `tax` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "invoiceName" SET DEFAULT 'New Invoice',
ALTER COLUMN "tax" DROP DEFAULT,
ALTER COLUMN "tax" SET DATA TYPE INTEGER;
