import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding base...");

  // -----------------------------
  // 1. PERMISSÕES
  // -----------------------------
  const permissoes = [
    // Items
    "ITEM_READ",
    "ITEM_CREATE",
    "ITEM_UPDATE",
    "ITEM_DELETE",

    // Users
    "USER_READ",
    "USER_CREATE",
    "USER_UPDATE",
    "USER_DELETE",

    // Cargos
    "CARGO_READ",
    "CARGO_CREATE",
    "CARGO_UPDATE",
    "CARGO_DELETE",

    // Categorias
    "CATEGORIA_READ",
    "CATEGORIA_CREATE",
    "CATEGORIA_UPDATE",
    "CATEGORIA_DELETE",

    // Salas
    "SALA_READ",
    "SALA_CREATE",
    "SALA_UPDATE",
    "SALA_DELETE",

    // Departamentos
    "DEPARTAMENTO_READ",
    "DEPARTAMENTO_CREATE",
    "DEPARTAMENTO_UPDATE",
    "DEPARTAMENTO_DELETE",

    // Instituicoes
    "INSTITUICAO_READ",
    "INSTITUICAO_CREATE",
    "INSTITUICAO_UPDATE",
    "INSTITUICAO_DELETE",

    // Condicoes
    "CONDICAO_READ",
    "CONDICAO_CREATE",
    "CONDICAO_UPDATE",
    "CONDICAO_DELETE",

    // Registos
    "REGISTO_READ",
    "REGISTO_CREATE",
    "REGISTO_UPDATE",
    "REGISTO_DELETE",
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
