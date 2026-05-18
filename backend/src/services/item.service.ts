import prisma from "../lib/prisma.js";

export class ItemService {
  /**
   * Generate unique key from item fields (only for non-deleted items)
   * Format: {nome}_{serialNumber}_{salaId}
   * Used to enforce uniqueness constraint only on active items
   */
  static generateUniqueKey(
    nome: string,
    serialNumber: string | null | undefined,
    salaId: number | null | undefined,
  ): string {
    // Only non-null/undefined values are included
    const parts = [
      nome.trim(),
      serialNumber ? String(serialNumber).trim() : "NULL",
      salaId ? String(salaId) : "NULL",
    ];
    return parts.join("_");
  }

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

    const uniqueKey = this.generateUniqueKey(
      data.nome,
      data.serialNumber,
      data.salaId,
    );

    return prisma.item.create({
      data: {
        nome: data.nome,
        descricao: data.descricao || "",
        quantidade: Math.max(0, Number(data.quantidade) || 1),
        categoriaId: Number(data.categoriaId),
        condicaoId: Number(data.condicaoId),
        salaId: Number(data.salaId),
        serialNumber: data.serialNumber || null,
        uniqueKey,
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

    // Fetch current item to get values needed for uniqueKey
    const currentItem = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!currentItem) {
      throw new Error("Item não encontrado");
    }

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

    // Regenerate uniqueKey if any relevant field changed
    if (
      data.nome !== undefined ||
      data.serialNumber !== undefined ||
      data.salaId !== undefined
    ) {
      const newNome = data.nome ?? currentItem.nome;
      const newSerial = data.serialNumber ?? currentItem.serialNumber;
      const newSalaId = data.salaId ?? currentItem.salaId;

      updateData.uniqueKey = this.generateUniqueKey(
        newNome,
        newSerial,
        newSalaId,
      );
    }

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

    const uniqueKey = this.generateUniqueKey(
      originalItem.nome,
      originalItem.serialNumber,
      newSalaId,
    );

    return prisma.item.create({
      data: {
        nome: originalItem.nome,
        descricao: originalItem.descricao,
        quantidade: Math.max(0, Number(newQuantity)),
        serialNumber: originalItem.serialNumber,
        categoriaId: originalItem.categoriaId,
        condicaoId: Number(newCondicaoId),
        salaId: Number(newSalaId),
        uniqueKey,
      },
    });
  }

  /**
   * Consolidate item - mark as merged into another item
   * Instead of soft-deleting, track the consolidation relationship
   * Allows preserving full history while showing item as inactive
   */
  static async consolidateItem(
    sourceItemId: number,
    consolidatedIntoItemId: number,
  ) {
    return prisma.item.update({
      where: { id: sourceItemId },
      data: {
        consolidatedIntoItemId,
        deletedAt: new Date(), // Soft-delete but with consolidation reference
        uniqueKey: null, // Clear unique key since item is consolidated
      },
    });
  }

  /**
   * Get item with full consolidation history
   * Returns the item plus any items that were consolidated into it
   */
  static async getItemWithConsolidationHistory(itemId: number) {
    return prisma.item.findUnique({
      where: { id: itemId },
      include: {
        consolidatedItems: {
          include: {
            registos: true,
          },
        },
        registos: true,
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
      // Set uniqueKey to null to allow new items with same details
      return prisma.item.update({
        where: { id: itemId },
        data: {
          deletedAt: new Date(),
          uniqueKey: null, // Allow recreating this item
        },
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
      const uniqueKey = this.generateUniqueKey(
        originalItem.nome,
        originalItem.serialNumber,
        newSalaId,
      );

      return prisma.item.create({
        data: {
          nome: originalItem.nome,
          descricao: originalItem.descricao,
          quantidade: Math.max(0, Number(newQuantity)),
          serialNumber: originalItem.serialNumber || null,
          categoriaId: originalItem.categoriaId,
          condicaoId: Number(newCondicaoId),
          salaId: Number(newSalaId),
          uniqueKey,
        },
      });
    }
  }
}
