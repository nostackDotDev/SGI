import prisma from "../lib/prisma.js";

export class RecordService {
  /**
   * Create a new movement registry
   */
  static async createRecord({
    instituicaoId,
    utilizadorId,
    itemId,
    quantidade,
    type,
    reason,
  }: {
    quantidade: number;
    instituicaoId: number;
    itemId: number;
    utilizadorId: number;
    type: string;
    reason?: string;
  }) {
    return prisma.registo.create({
      data: {
        quantidade,
        instituicaoId,
        itemId,
        utilizadorId,
        type,
        reason,
      },
    });
  }
}
