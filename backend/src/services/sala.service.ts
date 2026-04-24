import prisma from "../lib/prisma";


export class SalaService {
  static async softDelete(id: number) {
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