import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function signup(data) {
  const hashedPassword = await bcrypt.hash(data.user.password, 10);

  return await prisma.$transaction(async (tx) => {
    // -----------------------------
    // 1. Instituição
    // -----------------------------
    const instituicao = await tx.instituicao.create({
      data: {
        nome: data.instituicao.nome,
        endereco: data.instituicao.endereco,
        descricao: data.instituicao.descricao,
      },
    });

    // -----------------------------
    // 2. Categoria default (POR INSTITUIÇÃO)
    // -----------------------------
    const categoria = await tx.categoria.create({
      data: {
        nome: "Default",
        descricao: "Categoria padrão",
        instituicaoId: instituicao.id,
      },
    });

    // -----------------------------
    // 3. Sala default (POR INSTITUIÇÃO)
    // -----------------------------
    const sala = await tx.sala.create({
      data: {
        numeroSala: "0",
        tipoSala: "Default",
        departamentoId: null,
      },
    });

    // -----------------------------
    // 4. Cargo SUPER ADMIN
    // -----------------------------
    const cargo = await tx.cargo.create({
      data: {
        nome: "Super Admin",
        instituicaoId: instituicao.id,
      },
    });

    // -----------------------------
    // 5. Permissões base
    // -----------------------------
    const permissoes = await tx.permissao.findMany();

    await tx.cargoPermissao.createMany({
      data: permissoes.map((p) => ({
        cargoId: cargo.id,
        permissaoId: p.id,
      })),
    });

    // -----------------------------
    // 6. Utilizador admin
    // -----------------------------
    const user = await tx.utilizador.create({
      data: {
        nome: data.user.nome,
        email: data.user.email,
        password: hashedPassword,
        instituicaoId: instituicao.id,
        cargoId: cargo.id,
      },
    });

    return {
      instituicao,
      categoria,
      sala,
      cargo,
      user,
    };
  });
}

export async function login(email, password) {
  const user = await prisma.utilizador.findUnique({
    where: { email },
    include: {
      instituicao: true,
      cargo: true,
    },
  });

  // 1. user not found
  if (!user) {
    return null;
  }

  // 2. verify password
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid || !process.env.JWT_SECRET) {
    return null;
  }

  // 3. generate token
  const token = jwt.sign(
    {
      userId: user.id,
      instituicaoId: user.instituicaoId,
      cargoId: user.cargoId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  return {
    token,
    user: {
      nome: user.nome,
      email: user.email,
      cargo: user.cargo.nome,
    },
    instituicao: {
      nome: user.instituicao.nome,
      endereco: user.instituicao.endereco,
      descricao: user.instituicao.descricao,
    },
  };
}
