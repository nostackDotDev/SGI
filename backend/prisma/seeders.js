import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding base...");

  // -----------------------------
  // 1. PERMISSÕES
  // -----------------------------
  const permissoes = [
    "CREATE_ITEM",
    "READ_ITEM",
    "UPDATE_ITEM",
    "DELETE_ITEM",
    "MANAGE_USERS",
    "MANAGE_CARGOS",
    "MANAGE_CATEGORIAS",
    "MANAGE_SALAS",
  ];

  for (const nome of permissoes) {
    await prisma.permissao.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }

  // -----------------------------
  // 2. CONDIÇÕES
  // -----------------------------
  const condicoes = ["Boa", "Em manutenção", "Emprestado"];

  for (const nome of condicoes) {
    await prisma.condicao.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }

  console.log("Seed concluído");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
