/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `item` ADD COLUMN `serialNumber` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Item_serialNumber_key` ON `Item`(`serialNumber`);
