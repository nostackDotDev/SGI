import prisma from "../lib/prisma.js";

const VALID_MOVEMENT_TYPES = [
  "in",
  "out",
  "transfer",
  "return",
  "reduction",
  "exit",
  "borrow",
  "repair",
  "restore",
];

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
    this.validateMovementType(type);

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

  /**
   * Validate that the movement type is supported
   */
  static validateMovementType(type: string): void {
    if (!VALID_MOVEMENT_TYPES.includes(type)) {
      throw new Error(
        `Tipo de movimento inválido. Tipos suportados: ${VALID_MOVEMENT_TYPES.join(", ")}`,
      );
    }
  }

  /**
   * Get valid movement types
   */
  static getValidMovementTypes(): string[] {
    return VALID_MOVEMENT_TYPES;
  }
}
