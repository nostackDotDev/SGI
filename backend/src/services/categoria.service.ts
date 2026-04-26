import { softDeleteWithReassign } from "../lib/softDeleteHelper";

export class CategoriaService {
  static async softDelete(id: number) {
    // Prevent deletion of default categoria (id=1)
    if (id === 1) {
      throw new Error(
        "Default Categoria cannot be deleted. It is required as a fallback for items.",
      );
    }

    return softDeleteWithReassign({
      reassignFn: (tx) =>
        tx.item.updateMany({
          where: { categoriaId: id },
          data: { categoriaId: 1 },
        }),

      modelUpdate: (tx) =>
        tx.categoria.update({
          where: { id },
          data: { deletedAt: new Date() },
        }),
    });
  }
}
