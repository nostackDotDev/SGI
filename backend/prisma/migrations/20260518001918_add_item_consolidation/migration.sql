-- AlterTable
ALTER TABLE `Item` ADD COLUMN `consolidatedIntoItemId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Item_nome_serialNumber_salaId_idx` ON `Item`(`nome`, `serialNumber`, `salaId`);

-- CreateIndex
CREATE INDEX `Item_consolidatedIntoItemId_idx` ON `Item`(`consolidatedIntoItemId`);

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_consolidatedIntoItemId_fkey` FOREIGN KEY (`consolidatedIntoItemId`) REFERENCES `Item`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
