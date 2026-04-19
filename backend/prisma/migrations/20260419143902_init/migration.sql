-- CreateTable
CREATE TABLE `Instituicao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `registrada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `deletedAt` DATETIME(3) NULL,

    INDEX `Instituicao_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Departamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `registrado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `deletedAt` DATETIME(3) NULL,
    `instituicaoId` INTEGER NOT NULL,

    INDEX `Departamento_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sala` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numeroSala` VARCHAR(191) NOT NULL,
    `tipoSala` VARCHAR(191) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `departamentoId` INTEGER NULL,

    INDEX `Sala_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cargo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `permissoes` JSON NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Cargo_nome_key`(`nome`),
    INDEX `Cargo_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Utilizador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,
    `cargoId` INTEGER NOT NULL,

    UNIQUE INDEX `Utilizador_email_key`(`email`),
    INDEX `Utilizador_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Categoria_nome_key`(`nome`),
    INDEX `Categoria_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Condicao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Condicao_nome_key`(`nome`),
    INDEX `Condicao_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 1,
    `registrado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `deletedAt` DATETIME(3) NULL,
    `categoriaId` INTEGER NULL,
    `condicaoId` INTEGER NOT NULL,
    `salaId` INTEGER NULL,

    INDEX `Item_deletedAt_idx`(`deletedAt`),
    INDEX `Item_categoriaId_idx`(`categoriaId`),
    INDEX `Item_salaId_idx`(`salaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Registo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantidade` INTEGER NOT NULL,
    `registrado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `itemId` INTEGER NOT NULL,
    `utilizadorId` INTEGER NOT NULL,

    INDEX `Registo_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Departamento` ADD CONSTRAINT `Departamento_instituicaoId_fkey` FOREIGN KEY (`instituicaoId`) REFERENCES `Instituicao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sala` ADD CONSTRAINT `Sala_departamentoId_fkey` FOREIGN KEY (`departamentoId`) REFERENCES `Departamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Utilizador` ADD CONSTRAINT `Utilizador_cargoId_fkey` FOREIGN KEY (`cargoId`) REFERENCES `Cargo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_condicaoId_fkey` FOREIGN KEY (`condicaoId`) REFERENCES `Condicao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_salaId_fkey` FOREIGN KEY (`salaId`) REFERENCES `Sala`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registo` ADD CONSTRAINT `Registo_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registo` ADD CONSTRAINT `Registo_utilizadorId_fkey` FOREIGN KEY (`utilizadorId`) REFERENCES `Utilizador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;


-- =========================================================
-- CUSTOM SQL SAFETY LAYER (TRIGGERS)
-- =========================================================

CREATE TRIGGER prevent_delete_default_categoria
BEFORE DELETE ON `Categoria`
FOR EACH ROW
BEGIN
    IF OLD.id = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Default Categoria cannot be deleted';
    END IF;
END;

CREATE TRIGGER prevent_delete_default_sala
BEFORE DELETE ON `Sala`
FOR EACH ROW
BEGIN
    IF OLD.id = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Default Sala cannot be deleted';
    END IF;
END;

CREATE TRIGGER fallback_categoria_items
BEFORE UPDATE ON `Categoria`
FOR EACH ROW
BEGIN
    IF OLD.id <> 1
       AND OLD.deletedAt IS NULL
       AND NEW.deletedAt IS NOT NULL THEN

        UPDATE `Item`
        SET categoriaId = 1
        WHERE categoriaId = OLD.id;

    END IF;
END;

CREATE TRIGGER fallback_sala_items
BEFORE UPDATE ON `Sala`
FOR EACH ROW
BEGIN
    IF OLD.id <> 1
       AND OLD.deletedAt IS NULL
       AND NEW.deletedAt IS NOT NULL THEN

        UPDATE `Item`
        SET salaId = 1
        WHERE salaId = OLD.id;

    END IF;
END;