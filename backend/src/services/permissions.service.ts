import prisma from "../lib/prisma";

export async function getUserPermissions(userId: number) {
  const user = await prisma.utilizador.findUnique({
    where: { id: userId },
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

  const cargoPerms = user.cargo.permissoes.map((p) => p.permissao.nome);

  const finalPerms = new Set(cargoPerms);

  for (const override of user.permissoes) {
    const nome = override.permissao.nome;

    if (override.permitido) finalPerms.add(nome);
    else finalPerms.delete(nome);
  }

  return finalPerms;
}
