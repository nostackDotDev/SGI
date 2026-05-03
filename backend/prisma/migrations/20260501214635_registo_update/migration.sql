/*
  Warnings:

  - Added the required column `type` to the `Registo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `registo` ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Registo_type_utilizadorId_idx` ON `Registo`(`type`, `utilizadorId`);
