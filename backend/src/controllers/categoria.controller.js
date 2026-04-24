import { CategoriaService } from "../services/categoria.service";

export async function deleteCategoria(req, res) {
  try {
    const id = Number(req.params.id);

    await CategoriaService.softDelete(id);

    return res.status(200).json({
      message: "Categoria deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}