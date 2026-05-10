-- Add refresh token fields to Utilizador table for token rotation
ALTER TABLE `Utilizador`
ADD COLUMN `refreshToken` LONGTEXT NULL,
    ADD COLUMN `refreshTokenExpires` DATETIME(3) NULL;