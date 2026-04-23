import prisma from "../lib/prisma";

export class CategoriaService {
  static async softDelete(id: number) {
    return prisma.$transaction(async (tx) => {
      // 1. Reassign dependent items
      await tx.item.updateMany({
        where: { categoriaId: id },
        data: { categoriaId: 1 },
      });

      // 2. Soft delete categoria
      return tx.categoria.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    });
  }
}

/* 
import { softDeleteWithReassign } from "./softDelete.helper";

export class CategoriaService {
  static async softDelete(id: number) {
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
*/