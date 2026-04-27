import { login, signup, refreshAccessToken } from "../services/auth.service.js";

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

    // Set httpOnly cookies for both tokens
    // Access token - short-lived (1 hour)
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Refresh token - long-lived (7 days)
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      message: "Login realizado com sucesso",
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

export async function refreshController(req, res) {
  try {
    // Get refresh token from cookies
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Unauthorized",
        data: null,
        error: "No refresh token provided",
      });
    }

    // Validate refresh token and generate new access token
    const result = await refreshAccessToken(refreshToken);

    if (!result) {
      // Refresh token invalid or expired, clear cookies
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return res.status(401).json({
        message: "Unauthorized",
        data: null,
        error: "Refresh token invalid or expired",
      });
    }

    // Set new tokens in cookies
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      message: "Token refreshed successfully",
      data: {
        accessToken: result.accessToken,
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
