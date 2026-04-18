import { SalaService } from "../services/sala.service";

export async function deleteSala(req, res) {
    try {
        const id = Number(req.params.id);

        await SalaService.softDelete(id);

        return res.status(200).json({
            message: "Sala deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
}