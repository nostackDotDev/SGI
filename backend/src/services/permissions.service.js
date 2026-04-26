import prisma from "../lib/prisma.js";

export async function getUserPermissions(userId) {
  const user = await prisma.utilizador.findUnique({
    where: { id: parseInt(userId) },
    include: {
      cargo: {
        include: {
          permissoes: {
            include: { permissao: true },
          },
        },
      },
      permissoes: {
        include: { permissao: true },
      },
    },
  });

  if (!user) throw new Error("User not found");

  // Start with cargo permissions
  const finalPerms = new Set();

  for (const cargoPermission of user.cargo.permissoes) {
    finalPerms.add(cargoPermission.permissao.nome);
  }

  // Apply user-specific overrides
  for (const override of user.permissoes) {
    const nome = override.permissao.nome;

    if (override.permitido) {
      // Override grants permission
      finalPerms.add(nome);
    } else {
      // Override denies permission
      finalPerms.delete(nome);
    }
  }

  return finalPerms;
}
