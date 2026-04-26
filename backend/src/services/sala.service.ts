import prisma from "../lib/prisma";

export class SalaService {
  static async softDelete(id: number) {
    // Prevent deletion of default sala (id=1)
    if (id === 1) {
      throw new Error(
        "Default Sala cannot be deleted. It is required as a fallback for items.",
      );
    }

    return prisma.$transaction(async (tx) => {
      await tx.item.updateMany({
        where: { salaId: id },
        data: { salaId: 1 },
      });

      return tx.sala.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    });
  }
}
