import { Boxes, Eye, EyeOff, Lock, Mail } from "lucide-react";
import React, { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: undefined,
    password: undefined,
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log(formData);
    return;
  };

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <main className="w-full h-full flex items-center justify-center bg-linear-to-br from-emerald-300 to-emerald-950">
      <section className="w-111 max-w-[90vw] max-h-[80vh] min-h-fit rounded-xl card-elevated p-6 overflow-y-auto">
        <aside className="text-center space-y-1">
          <i className="block mx-auto w-fit h-fit p-1.5 px-2 rounded-sm bg-emerald-500 text-white">
          <Boxes className="w-10 h-10" />
          </i>
          <h1 className="text-2xl font-bold capitalize">inventário escolar</h1>
          <p className="text-sm">Faça login para acessar o sistema</p>
        </aside>
        <form
          onSubmit={handleLogin}
          className="w-full h-fit grid grid-cols-1 grid-rows-[auto] gap-6 mt-6"
        >
          <div className="h-fit flex items-start justify-center flex-col gap-1">
            <label htmlFor="login-email" className="font-medium">
              E-mail
            </label>
            <div className="w-full h-fit border border-olive-500 rounded-md grid grid-cols-[auto_1fr]">
              <i className="w-fit bg-transparent px-2 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </i>
              <input
                type="email"
                id="login-email"
                name="email"
                placeholder="seu@email.com"
                className="p-2 focus:outline-0"
                value={formData.email ?? ""}
                onChange={(e) => handleInput("email", e.target.value)}
              />
            </div>
          </div>
          <div className="h-fit flex items-start justify-center flex-col gap-1">
            <label htmlFor="login-password" className="font-medium">
              Senha
            </label>
            <div className="w-full h-fit border border-olive-500 rounded-md grid grid-cols-[auto_1fr_auto]">
              <i className="w-fit bg-transparent px-2 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </i>
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="login-password"
                name="password"
                placeholder="****"
                className="p-2 focus:outline-0"
                value={formData.password ?? ""}
                onChange={(e) => handleInput("password", e.target.value)}
              />
              <i
                onClick={() => setIsPasswordVisible((e) => !e)}
                className="w-fit bg-transparent pr-2 flex items-center justify-center cursor-pointer"
              >
                {isPasswordVisible ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </i>
            </div>
          </div>
          <div className="h-fit flex items-center justify-between">
            <div className="flex items-end justify-center gap-1">
              <input
                type="checkbox"
                name="remeberUser"
                id="rememberUser"
                className="rounded-full text-emerald-500 cursor-pointer"
              />
              <label htmlFor="rememberUser" className="cursor-pointer">Lembrar-me</label>
            </div>
            <span className="text-emerald-400 font-semibold text-shadow-2xs cursor-pointer hover:underline">
              Esqueceu a senha?
            </span>
          </div>
          <button
            type="submit"
            className="capitalize bg-emerald-400 text-white text-xl text-center py-2 rounded-lg font-semibold cursor-pointer scale-95 hover:scale-100 transition-transform ease-out"
          >
            entrar
          </button>
          <span className="text-sm text-center">
            Não tem uma conta?{" "}
            <a className="text-emerald-400 font-semibold text-shadow-2xs cursor-pointer hover:underline">Cadastre-se</a>
          </span>
        </form>
      </section>
    </main>
  );
}
