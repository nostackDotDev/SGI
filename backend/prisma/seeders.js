import { PERMISSIONS } from "../src/constants/tables.js";
import prisma from "../src/lib/prisma.js";

async function main() {
  // =========================
  // CARGO
  // =========================
  await prisma.cargo.upsert({
    where: { id: "admin" },
    update: {},
    create: {
      nome: "admin",
      descricao: "Administrador do sistema",
      permissoes: PERMISSIONS.ADMIN,
      instituicaoId
    },
  });

  await prisma.cargo.upsert({
    where: { nome: "user" },
    update: {},
    create: {
      nome: "user",
      descricao: "Utilizador padrão",
      permissoes: PERMISSIONS.USER,
    },
  });

  // =========================
  // CONDICAO
  // =========================
  await prisma.condicao.upsert({
    where: { nome: "bom" },
    update: {},
    create: {
      nome: "bom",
      descricao: "Em bom estado de utilização",
    },
  });

  await prisma.condicao.upsert({
    where: { nome: "manutencao" },
    update: {},
    create: {
      nome: "manutencao",
      descricao: "Em manutenção",
    },
  });

  await prisma.condicao.upsert({
    where: { nome: "emprestado" },
    update: {},
    create: {
      nome: "emprestado",
      descricao: "Emprestado a utilizador",
    },
  });

  // =========================
  // CATEGORIA
  // =========================
  await prisma.categoria.upsert({
    where: { nome: "DEFAULT" },
    update: {},
    create: {
      nome: "DEFAULT",
      descricao: "Categoria padrão",
    },
  });

  console.log("Seed concluído com sucesso");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
