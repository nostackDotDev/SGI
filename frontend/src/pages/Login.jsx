import { useAuth } from "@/core/contexts/AuthContext";
import { request } from "@/lib/request";
import { Boxes, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const initialData = {
  email: "",
  password: "",
};

export default function Login() {
  const [formData, setFormData] = useState(initialData);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    request(
      "/auth/login",
      "POST",
      {
        data: formData,
      },
      (res) => {
        if (res && !res.error) {
          const user = { ...res.data.user, instituicao: res.data.instituicao };
          setUser(user);
          setIsLoading(false);
          setFormData(initialData);
          navigate("/");
          toast.success(res.message ?? "Login realizado com sucesso!", {
            id: "fetch-toast",
            position: "bottom-right",
          });
          return;
        }
        toast.error(res.message || "Ocorreu um erro ao criar a conta", {
          id: "fetch-toast",
          position: "bottom-right",
        });
        return;
      },
      (err) => {
        console.error(err);
        toast.error(err?.message || "Ocorreu um erro ao criar a conta", {
          id: "fetch-toast",
          position: "bottom-right",
        });
        setIsLoading(false);
      },
    );
  };

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <main className="w-full h-full min-h-fit flex items-center justify-center gradient-primary py-4">
      <section className="w-2xl max-w-[90vw] bg-card max-h-[94vh] min-h-fit rounded-xl p-6 overflow-y-auto no-scrollbar">
        <aside className="text-center space-y-1">
          <i className="block mx-auto w-fit h-fit p-1 rounded-sm text-muted-foreground">
            <img src="/logo.png" className="w-30 aspect-auto" alt="IPIKK" />
          </i>
          <h1 className="text-2xl font-bold capitalize -mt-5">
            inventário escolar
          </h1>
          <p>Faça login para acessar o sistema</p>
        </aside>
        <form
          onSubmit={handleLogin}
          className="w-full h-fit flex flex-col justify-center gap-6 mt-6 text-lg"
        >
          <div className="h-fit flex items-start justify-center flex-col gap-1">
            <label htmlFor="login-email" className="font-medium">
              E-mail
            </label>
            <div className="w-full h-fit border border-accent rounded-md grid grid-cols-[auto_1fr] hover:shadow-xs shadow-muted-foreground/60 focus-within:border-primary transition-colors ease">
              <i className="w-fit bg-transparent px-2 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </i>
              <input
                type="email"
                id="login-email"
                name="email"
                required
                placeholder="seu@email.com"
                className="p-2 focus:outline-0 rounded-r-md"
                value={formData.email}
                onChange={(e) => handleInput("email", e.target.value)}
              />
            </div>
          </div>
          <div className="h-fit flex items-start justify-center flex-col gap-1">
            <label htmlFor="login-password" className="font-medium">
              Senha
            </label>
            <div className="w-full h-fit border border-accent rounded-md grid grid-cols-[auto_1fr_auto] hover:shadow-xs shadow-muted-foreground/60 focus-within:border-primary transition-colors ease relative">
              <i className="w-fit bg-transparent px-2 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </i>
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="login-password"
                name="password"
                required
                placeholder="****"
                className="p-2 focus:outline-0 rounded-r-md"
                value={formData.password ?? ""}
                onChange={(e) => handleInput("password", e.target.value)}
              />
              <i
                onClick={() => setIsPasswordVisible((e) => !e)}
                className="absolute top-3 right-2 w-fit bg-transparent pr-2 flex items-center justify-center cursor-pointer"
              >
                {isPasswordVisible ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </i>
            </div>
          </div>
          <div className="h-fit flex items-center justify-end">
            {/* <div className="flex items-end justify-center gap-1">
              <input
                type="checkbox"
                name="remeberUser"
                id="rememberUser"
                className="rounded-full text-success cursor-pointer"
              />
              <label htmlFor="rememberUser" className="cursor-pointer">
                Lembrar-me
              </label>
            </div> */}
            <span className="text-ring text-shadow-2xs cursor-pointer hover:underline">
              Esqueceu a senha?
            </span>
          </div>
          <Link
            to="/signup"
            replace
            className="-mt-5 text-right text-ring text-shadow-2xs cursor-pointer hover:underline"
          >
            Não possui uma conta? Criar conta
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full capitalize bg-success text-muted text-xl text-center py-2 rounded-lg font-semibold cursor-pointer scale-95 hover:scale-100 transition-transform ease-in duration-200 flex items-center justify-center gap-2 disabled:opacity-65 disabled:cursor-not-allowed"
          >
            {isLoading && (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            )}
            entrar
          </button>
        </form>
      </section>
    </main>
  );
}
