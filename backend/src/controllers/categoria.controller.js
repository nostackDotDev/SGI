import { CategoriaService } from "../services/categoria.service";

export async function deleteCategoria(req, res) {
  try {
    const id = Number(req.params.id);

    await CategoriaService.softDelete(id);

    return res.status(200).json({
      message: "Categoria deleted successfully",
    });
  } catch (err) {
    // Check if it's a validation error (trying to delete default categoria)
    if (err.message.includes("Default Categoria cannot be deleted")) {
      return res.status(400).json({
        error: err.message,
      });
    }
    return res.status(500).json({
      error: err.message,
    });
  }
}
