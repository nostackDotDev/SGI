/*
  Warnings:

  - Added the required column `instituicaoId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Item_nome_serialNumber_salaId_idx` ON `Item`;

-- AlterTable - Add column as nullable first
ALTER TABLE `Item` ADD COLUMN `instituicaoId` INTEGER NULL;

-- Populate instituicaoId from categoria relation
-- For each item, get instituicaoId from its categoria
UPDATE `Item` i
SET i.`instituicaoId` = (
  SELECT c.`instituicaoId` 
  FROM `Categoria` c 
  WHERE c.`id` = i.`categoriaId`
)
WHERE i.`categoriaId` IS NOT NULL;

-- For items without categoria, use a default value (first instituicao if exists)
UPDATE `Item` i
SET i.`instituicaoId` = (
  SELECT MIN(`id`) FROM `Instituicao` LIMIT 1
)
WHERE i.`instituicaoId` IS NULL;

-- Make column NOT NULL
ALTER TABLE `Item` MODIFY COLUMN `instituicaoId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Item_instituicaoId_idx` ON `Item`(`instituicaoId`);

-- CreateIndex
CREATE INDEX `Item_nome_serialNumber_salaId_instituicaoId_idx` ON `Item`(`nome`, `serialNumber`, `salaId`, `instituicaoId`);

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_instituicaoId_fkey` FOREIGN KEY (`instituicaoId`) REFERENCES `Instituicao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
