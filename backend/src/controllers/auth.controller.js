import { login, signup } from "../services/auth.service.js";

export async function signupController(req, res) {
  try {
    const result = await signup(req.body);

    return res.status(201).json({
      message: "Instituição criada com sucesso",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao criar conta",
      data: null,
      error: error?.message ?? "Unrecognized error encountered",
    });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    const result = await login(email, password);

    if (!result) {
      return res.status(401).json({
        message: "Credenciais inválidas",
        data: null,
        error: "Invalid email or password",
      });
    }

    // set httpOnly cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 day
    });

    return res.json({
      data: {
        user: result.user,
        instituicao: result.instituicao,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(error?.status || 500).json({
      message: "Internal server error",
      data: null,
      error: error?.message ?? "Unrecognized error encountered",
    });
  }
}
