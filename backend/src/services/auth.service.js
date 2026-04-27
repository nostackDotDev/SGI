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
    // 2. Departamento default (POR INSTITUIÇÃO)
    // -----------------------------
    const departamento = await tx.departamento.create({
      data: {
        nome: "Default",
        descricao: "Departamento padrão",
        instituicaoId: instituicao.id,
      },
    });

    // -----------------------------
    // 3. Categoria default (POR INSTITUIÇÃO)
    // -----------------------------
    const categoria = await tx.categoria.create({
      data: {
        nome: "Default",
        descricao: "Categoria padrão",
        instituicaoId: instituicao.id,
      },
    });

    // -----------------------------
    // 4. Sala default (POR INSTITUIÇÃO)
    // -----------------------------
    const sala = await tx.sala.create({
      data: {
        numeroSala: "Default",
        tipoSala: "Armazém padrão",
        departamentoId: departamento.id,
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
      departamento,
      categoria,
      sala,
      cargo,
      user,
    };
  });
}

export async function login(email, password) {
  const user = await prisma.utilizador.findFirst({
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

  // 3. generate access token (1 hour)
  const accessToken = jwt.sign(
    {
      userId: user.id,
      instituicaoId: user.instituicaoId,
      cargoId: user.cargoId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  // 4. generate refresh token (7 days)
  const refreshToken = jwt.sign(
    {
      userId: user.id,
      tokenVersion: 1,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  // 5. store refresh token in database with expiry
  const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.utilizador.update({
    where: { id: user.id },
    data: {
      refreshToken,
      refreshTokenExpires,
    },
  });

  return {
    accessToken,
    refreshToken,
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

/**
 * Refresh the access token using a valid refresh token
 * Implements token rotation: invalidates old refresh token, issues new one
 */
export async function refreshAccessToken(refreshToken) {
  if (!refreshToken || !process.env.JWT_SECRET) {
    return null;
  }

  try {
    // 1. Verify refresh token signature
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // 2. Find user and validate refresh token matches
    const user = await prisma.utilizador.findFirst({
      where: { id: decoded.userId },
      include: {
        instituicao: true,
        cargo: true,
      },
    });

    if (!user) {
      return null;
    }

    // 3. Validate refresh token stored in DB matches the one sent
    if (user.refreshToken !== refreshToken) {
      // Token has been rotated/invalidated
      return null;
    }

    // 4. Validate refresh token hasn't expired (double-check with DB)
    if (user.refreshTokenExpires && user.refreshTokenExpires < new Date()) {
      return null;
    }

    // 5. Generate new access token (1 hour)
    const newAccessToken = jwt.sign(
      {
        userId: user.id,
        instituicaoId: user.instituicaoId,
        cargoId: user.cargoId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // 6. Generate new refresh token (7 days) for rotation
    const newRefreshToken = jwt.sign(
      {
        userId: user.id,
        tokenVersion: (decoded.tokenVersion || 0) + 1,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 7. Store new refresh token (invalidates old one)
    const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.utilizador.update({
      where: { id: user.id },
      data: {
        refreshToken: newRefreshToken,
        refreshTokenExpires,
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    // Refresh token invalid, expired, or tampered with
    return null;
  }
}
