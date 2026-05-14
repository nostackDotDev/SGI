/*
  Warnings:

  - Added the required column `categories` to the `Relatorio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `records` to the `Relatorio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totals` to the `Relatorio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Relatorio` ADD COLUMN `categories` JSON NOT NULL,
    ADD COLUMN `records` JSON NOT NULL,
    ADD COLUMN `totals` JSON NOT NULL;
