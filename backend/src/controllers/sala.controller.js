import { SalaService } from "../services/sala.service";

export async function deleteSala(req, res) {
  try {
    const id = Number(req.params.id);

    await SalaService.softDelete(id);

    return res.status(200).json({
      message: "Sala deleted successfully",
    });
  } catch (err) {
    // Check if it's a validation error (trying to delete default sala)
    if (err.message.includes("Default Sala cannot be deleted")) {
      return res.status(400).json({
        error: err.message,
      });
    }
    return res.status(500).json({
      error: err.message,
    });
  }
}
