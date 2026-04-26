import prisma from "../lib/prisma";

export class ItemService {
  /**
   * Validates item data before creation or update
   * - Prevents negative quantities
   */
  static validateItemData(data: { quantidade?: number; nome?: string }): void {
    if (data.quantidade !== undefined && data.quantidade < 0) {
      throw new Error("Quantidade cannot be negative");
    }

    if (data.nome !== undefined && !data.nome.trim()) {
      throw new Error("Item name cannot be empty");
    }
  }

  /**
   * Create a new item with validation
   */
  static async createItem(data: {
    nome: string;
    descricao?: string;
    quantidade?: number;
    categoriaId: number;
    condicaoId: number;
    salaId: number;
  }) {
    this.validateItemData(data);

    return prisma.item.create({
      data: {
        nome: data.nome,
        descricao: data.descricao || "",
        quantidade: Math.max(0, Number(data.quantidade) || 1),
        categoriaId: Number(data.categoriaId),
        condicaoId: Number(data.condicaoId),
        salaId: Number(data.salaId),
      },
    });
  }

  /**
   * Update an item with validation
   */
  static async updateItem(
    itemId: number,
    data: {
      nome?: string;
      descricao?: string;
      quantidade?: number;
      categoriaId?: number;
      condicaoId?: number;
      salaId?: number;
    },
  ) {
    this.validateItemData(data);

    const updateData: any = {};

    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.descricao !== undefined) updateData.descricao = data.descricao;
    if (data.quantidade !== undefined)
      updateData.quantidade = Math.max(0, Number(data.quantidade));
    if (data.categoriaId !== undefined)
      updateData.categoriaId = Number(data.categoriaId);
    if (data.condicaoId !== undefined)
      updateData.condicaoId = Number(data.condicaoId);
    if (data.salaId !== undefined) updateData.salaId = Number(data.salaId);

    return prisma.item.update({
      where: { id: itemId },
      data: updateData,
    });
  }
}
