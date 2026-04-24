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

-- 
CREATE TRIGGER prevent_negative_item
BEFORE INSERT ON Item
FOR EACH ROW
BEGIN
  IF NEW.quantidade < 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Quantidade cannot be negative';
  END IF;
END;