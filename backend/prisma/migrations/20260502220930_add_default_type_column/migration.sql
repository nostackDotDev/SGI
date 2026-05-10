-- AlterTable
ALTER TABLE `Cargo` ADD COLUMN `defaultType` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Categoria` ADD COLUMN `defaultType` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Departamento` ADD COLUMN `defaultType` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Sala` ADD COLUMN `defaultType` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Utilizador` ADD COLUMN `defaultType` BOOLEAN NULL DEFAULT false;
