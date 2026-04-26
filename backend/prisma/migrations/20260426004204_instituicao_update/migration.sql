/*
  Warnings:

  - A unique constraint covering the columns `[nif]` on the table `Instituicao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Instituicao` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `instituicao` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `nif` VARCHAR(191) NULL,
    ADD COLUMN `telefone` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Instituicao_nif_key` ON `Instituicao`(`nif`);

-- CreateIndex
CREATE UNIQUE INDEX `Instituicao_email_key` ON `Instituicao`(`email`);
