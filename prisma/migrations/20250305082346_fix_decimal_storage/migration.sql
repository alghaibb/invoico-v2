/*
  Warnings:

  - You are about to alter the column `price` on the `invoice_items` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `total` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "invoice_items" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);
