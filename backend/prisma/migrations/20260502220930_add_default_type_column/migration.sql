-- AlterTable
ALTER TABLE `cargo` ADD COLUMN `defaultType` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `categoria` ADD COLUMN `defaultType` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `departamento` ADD COLUMN `defaultType` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `sala` ADD COLUMN `defaultType` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `utilizador` ADD COLUMN `defaultType` BOOLEAN NULL DEFAULT false;
