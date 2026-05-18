/*
  Warnings:

  - A unique constraint covering the columns `[uniqueKey]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Item_nome_serialNumber_salaId_key` ON `Item`;

-- AlterTable
ALTER TABLE `Item` ADD COLUMN `uniqueKey` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Item_uniqueKey_key` ON `Item`(`uniqueKey`);
