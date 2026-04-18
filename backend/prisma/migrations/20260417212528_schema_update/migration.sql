/*
  Warnings:

  - You are about to drop the column `subcategoriaId` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `tipoItemId` on the `item` table. All the data in the column will be lost.
  - You are about to drop the `subcategoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tipoitem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nome]` on the table `Cargo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `Categoria` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `Condicao` will be added. If there are existing duplicate values, this will fail.
*/

-- =========================================================
-- DROP FOREIGN KEYS
-- =========================================================

ALTER TABLE `item` DROP FOREIGN KEY `Item_categoriaId_fkey`;
ALTER TABLE `item` DROP FOREIGN KEY `Item_subcategoriaId_fkey`;
ALTER TABLE `item` DROP FOREIGN KEY `Item_tipoItemId_fkey`;
ALTER TABLE `subcategoria` DROP FOREIGN KEY `Subcategoria_categoriaId_fkey`;
ALTER TABLE `tipoitem` DROP FOREIGN KEY `TipoItem_categoriaId_fkey`;
ALTER TABLE `tipoitem` DROP FOREIGN KEY `TipoItem_subcategoriaId_fkey`;

-- =========================================================
-- DROP INDEXES
-- =========================================================

DROP INDEX `Item_subcategoriaId_fkey` ON `item`;
DROP INDEX `Item_tipoItemId_fkey` ON `item`;

-- =========================================================
-- ALTER TABLES (SOFT DELETE + STRUCTURE CHANGES)
-- =========================================================

ALTER TABLE `cargo` ADD COLUMN `deletedAt` DATETIME(3) NULL;
ALTER TABLE `categoria` ADD COLUMN `deletedAt` DATETIME(3) NULL;
ALTER TABLE `condicao` ADD COLUMN `deletedAt` DATETIME(3) NULL;
ALTER TABLE `departamento` ADD COLUMN `deletedAt` DATETIME(3) NULL;
ALTER TABLE `instituicao` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- STEP 1: remove unused columns safely
ALTER TABLE `item`
  DROP COLUMN `subcategoriaId`,
  DROP COLUMN `tipoItemId`,
  ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- STEP 2: modify FK column AFTER cleanup
ALTER TABLE `item`
  MODIFY `categoriaId` INTEGER NULL;

ALTER TABLE `registo` ADD COLUMN `deletedAt` DATETIME(3) NULL;
ALTER TABLE `sala` ADD COLUMN `deletedAt` DATETIME(3) NULL;
ALTER TABLE `utilizador` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- =========================================================
-- DROP TABLES
-- =========================================================

DROP TABLE `subcategoria`;
DROP TABLE `tipoitem`;

-- =========================================================
-- INDEXES
-- =========================================================

CREATE UNIQUE INDEX `Cargo_nome_key` ON `Cargo`(`nome`);
CREATE INDEX `Cargo_deletedAt_idx` ON `Cargo`(`deletedAt`);

CREATE UNIQUE INDEX `Categoria_nome_key` ON `Categoria`(`nome`);
CREATE INDEX `Categoria_deletedAt_idx` ON `Categoria`(`deletedAt`);

CREATE UNIQUE INDEX `Condicao_nome_key` ON `Condicao`(`nome`);
CREATE INDEX `Condicao_deletedAt_idx` ON `Condicao`(`deletedAt`);

CREATE INDEX `Departamento_deletedAt_idx` ON `Departamento`(`deletedAt`);
CREATE INDEX `Instituicao_deletedAt_idx` ON `Instituicao`(`deletedAt`);
CREATE INDEX `Item_deletedAt_idx` ON `Item`(`deletedAt`);
CREATE INDEX `Registo_deletedAt_idx` ON `Registo`(`deletedAt`);
CREATE INDEX `Sala_deletedAt_idx` ON `Sala`(`deletedAt`);
CREATE INDEX `Utilizador_deletedAt_idx` ON `Utilizador`(`deletedAt`);

-- =========================================================
-- DEFAULT DATA SAFETY (MUST BE BEFORE FK CREATION)
-- =========================================================

INSERT INTO `Categoria` (`id`, `nome`, `descricao`, `deletedAt`)
VALUES (1, 'DEFAULT', 'Categoria padrão', NULL)
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO `Sala` (`id`, `numeroSala`, `tipoSala`, `deletedAt`)
VALUES (1, 'DEFAULT', 'DEFAULT', NULL)
ON DUPLICATE KEY UPDATE id = id;

-- =========================================================
-- FOREIGN KEYS (MOVED AFTER DATA + SCHEMA STABILIZATION)
-- =========================================================

ALTER TABLE `Item`
ADD CONSTRAINT `Item_categoriaId_fkey`
FOREIGN KEY (`categoriaId`)
REFERENCES `Categoria`(`id`)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- =========================================================
-- CUSTOM SQL SAFETY LAYER (TRIGGERS)
-- =========================================================


-- Prevent deleting default Categoria
CREATE TRIGGER prevent_delete_default_categoria
BEFORE DELETE ON Categoria
FOR EACH ROW
BEGIN
    IF OLD.id = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Default Categoria cannot be deleted';
    END IF;
END;

-- Prevent deleting default Sala
CREATE TRIGGER prevent_delete_default_sala
BEFORE DELETE ON Sala
FOR EACH ROW
BEGIN
    IF OLD.id = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Default Sala cannot be deleted';
    END IF;
END;

-- Fallback reassignment: Categoria → Item
CREATE TRIGGER fallback_categoria_items
BEFORE UPDATE ON Categoria
FOR EACH ROW
BEGIN
    IF OLD.id <> 1
       AND OLD.deletedAt IS NULL
       AND NEW.deletedAt IS NOT NULL THEN

        UPDATE Item
        SET categoriaId = 1
        WHERE categoriaId = OLD.id;

    END IF;
END;

-- Fallback reassignment: Sala → Item
CREATE TRIGGER fallback_sala_items
BEFORE UPDATE ON Sala
FOR EACH ROW
BEGIN
    IF OLD.id <> 1
       AND OLD.deletedAt IS NULL
       AND NEW.deletedAt IS NOT NULL THEN

        UPDATE Item
        SET salaId = 1
        WHERE salaId = OLD.id;

    END IF;
END;