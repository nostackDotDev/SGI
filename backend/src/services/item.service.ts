import prisma from "../lib/prisma.js";

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
    serialNumber?: string;
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
        serialNumber: data.serialNumber || null,
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
      serialNumber?: string;
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
    if (data.serialNumber !== undefined)
      updateData.serialNumber = data.serialNumber || null;
    return prisma.item.update({
      where: { id: itemId },
      data: updateData,
    });
  }

  /**
   * Validate quantity transfer between movements
   * Ensures transfer quantity is valid: 0 < transferQty < currentQty
   */
  static validateQuantityTransfer(
    currentQty: number,
    transferQty: number,
  ): void {
    const transferNum = Number(transferQty);
    const currentNum = Number(currentQty);

    if (transferNum <= 0) {
      throw new Error("Quantidade de transferência deve ser maior que 0");
    }

    if (transferNum > currentNum) {
      throw new Error(
        "Quantidade de transferência não pode ser superior à quantidade atual",
      );
    }
  }

  /**
   * Duplicate an item with new location, status, and quantity
   * Used for returns and reductions that create new items
   */
  static async duplicateItemWithNewLocation(
    itemId: number,
    newSalaId: number,
    newCondicaoId: number,
    newQuantity: number,
  ) {
    const originalItem = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!originalItem) {
      throw new Error("Item original não encontrado");
    }

    return prisma.item.create({
      data: {
        nome: originalItem.nome,
        descricao: originalItem.descricao,
        quantidade: Math.max(0, Number(newQuantity)),
        serialNumber: originalItem.serialNumber,
        categoriaId: originalItem.categoriaId,
        condicaoId: Number(newCondicaoId),
        salaId: Number(newSalaId),
      },
    });
  }

  /**
   * Reduce item quantity and soft-delete if quantity reaches 0
   */
  static async reduceAndDeleteIfZero(itemId: number, reduceByQty: number) {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new Error("Item não encontrado");
    }

    const newQty = Number(item.quantidade) - Number(reduceByQty);

    if (newQty <= 0) {
      // Soft delete if quantity reaches 0 or below
      return prisma.item.update({
        where: { id: itemId },
        data: { deletedAt: new Date() },
      });
    }

    // Otherwise just reduce quantity
    return prisma.item.update({
      where: { id: itemId },
      data: { quantidade: newQty },
    });
  }

  /**
   * Upsert (update or insert) an item at a specific location
   * If an item with the same (nome, serialNumber, salaId) exists, update its quantity
   * Otherwise, create a new item
   */
  static async upsertItemAtLocation(
    itemId: number,
    newSalaId: number,
    newCondicaoId: number,
    newQuantity: number,
  ) {
    const originalItem = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!originalItem) {
      throw new Error("Item original não encontrado");
    }

    // Check if an item with the same (nome, serialNumber, salaId) already exists at the new location
    const existingItem = await prisma.item.findFirst({
      where: {
        nome: originalItem.nome,
        serialNumber: originalItem.serialNumber,
        salaId: newSalaId,
        deletedAt: null,
      },
    });

    if (existingItem) {
      // Update existing item's quantity
      return prisma.item.update({
        where: { id: existingItem.id },
        data: {
          quantidade: {
            increment: Number(newQuantity),
          },
        },
      });
    } else {
      // Create new item
      return prisma.item.create({
        data: {
          nome: originalItem.nome,
          descricao: originalItem.descricao,
          quantidade: Math.max(0, Number(newQuantity)),
          serialNumber: originalItem.serialNumber || null,
          categoriaId: originalItem.categoriaId,
          condicaoId: Number(newCondicaoId),
          salaId: Number(newSalaId),
        },
      });
    }
  }
}
