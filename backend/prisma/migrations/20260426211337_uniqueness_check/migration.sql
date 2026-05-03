/*
 Warnings:
 
 - A unique constraint covering the columns `[nome,instituicaoId]` on the table `Departamento` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[nome,telefone]` on the table `Instituicao` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[nome,serialNumber,salaId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[numeroSala,departamentoId]` on the table `Sala` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[numeroSala,tipoSala]` on the table `Sala` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[nome,instituicaoId]` on the table `Utilizador` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[email,instituicaoId]` on the table `Utilizador` will be added. If there are existing duplicate values, this will fail.
 
 
 --
 
 
 - A unique constraint covering the columns `[numeroSala,tipoSala,departamentoId]` on the table `Sala` will be added. If there are existing duplicate values, this will fail.
 - Added the required column `instituicaoId` to the `Registo` table without a default value. This is not possible if the table is not empty.
 
 */
-- CreateIndex
CREATE UNIQUE INDEX `Departamento_nome_instituicaoId_key` ON `Departamento`(`nome`, `instituicaoId`);
-- CreateIndex
CREATE UNIQUE INDEX `Instituicao_nome_telefone_key` ON `Instituicao`(`nome`, `telefone`);
-- CreateIndex
CREATE UNIQUE INDEX `Item_nome_serialNumber_salaId_key` ON `Item`(`nome`, `serialNumber`, `salaId`);
-- CreateIndex
CREATE UNIQUE INDEX `Sala_numeroSala_departamentoId_key` ON `Sala`(`numeroSala`, `departamentoId`);
-- CreateIndex
-- CREATE UNIQUE INDEX `Sala_numeroSala_tipoSala_key` ON `Sala`(`numeroSala`, `tipoSala`);
-- CreateIndex
CREATE UNIQUE INDEX `Utilizador_nome_instituicaoId_key` ON `Utilizador`(`nome`, `instituicaoId`);
--

-- DropIndex
-- DROP INDEX `Sala_numeroSala_tipoSala_key` ON `sala`;
-- AlterTable
ALTER TABLE `registo`
ADD COLUMN `instituicaoId` INTEGER NOT NULL;
-- AlterTable
ALTER TABLE `sala`
ADD COLUMN `instituicaoId` INTEGER NULL;
-- CreateIndex
CREATE UNIQUE INDEX `Sala_numeroSala_tipoSala_departamentoId_key` ON `Sala`(`numeroSala`, `tipoSala`, `departamentoId`);
-- AddForeignKey
ALTER TABLE `Sala`
ADD CONSTRAINT `Sala_instituicaoId_fkey` FOREIGN KEY (`instituicaoId`) REFERENCES `Instituicao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE `Registo`
ADD CONSTRAINT `Registo_instituicaoId_fkey` FOREIGN KEY (`instituicaoId`) REFERENCES `Instituicao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;