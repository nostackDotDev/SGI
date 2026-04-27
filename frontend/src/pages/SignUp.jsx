import { request } from "@/lib/request";
import {
  Boxes,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  LocationEdit,
  Lock,
  Mail,
  User2,
  User2Icon,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const initialData = {
  institutionName: undefined,
  institutionAddress: undefined,
  userName: undefined,
  userEmail: undefined,
  userPassword: undefined,
  userPasswordCheck: undefined,
};

export default function SignUp() {
  const [formData, setFormData] = useState(initialData);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(formData);

    if (formData.userPassword !== formData.userPasswordCheck) {
      toast.error("As palavras-passe não coincidem", {
        position: "bottom-right",
      });
      return;
    }

    request(
      "/auth/signup",
      "POST",
      {
        data: {
          instituicao: {
            nome: formData.institutionName,
            endereco: formData.institutionAddress,
          },
          user: {
            nome: formData.userName,
            email: formData.userEmail,
            password: formData.userPassword,
          },
        },
      },
      (res) => {
        console.log(res);
        setIsLoading(false);
        if (res && !res.error) {
          navigate("/login");
          toast.success(res.message || "Conta criada com sucesso!", {
            id: "fetch-toast",
            position: "bottom-right",
          });
          return;
        }
        toast.error(res?.message || "Ocorreu um erro ao criar a conta", {
          id: "fetch-toast",
          position: "bottom-right",
        });
      },
      (err) => {
        console.error(err);
        setIsLoading(false);
        toast.error(err?.message || "Ocorreu um erro ao criar a conta", {
          id: "fetch-toast",
          position: "bottom-right",
        });
      },
    );
  };

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <main className="w-full h-full flex items-center justify-center gradient-primary">
      <section className="w-[90vw] max-w-7xl max-h-[94vh] min-h-fit rounded-xl card-elevated p-6 overflow-y-auto">
        <aside className="text-center space-y-3 pb-3">
          <i className="block mx-auto w-fit h-fit p-1.5 px-2 rounded-sm bg-success text-muted">
            <Boxes className="w-10 h-10" />
          </i>
          <h1 className="text-2xl font-bold capitalize">inventário escolar</h1>
          <p>Cadastre a sua instituição em alguns passos</p>
        </aside>
        <form
          onSubmit={handleSubmit}
          className="w-full h-fit flex flex-col justify-center gap-6 mt-6 text-lg"
        >
          <div className="grid md:grid-cols-2 gap-x-3 gap-y-2">
            <div className="h-fit flex items-start justify-center flex-col gap-1">
              <label htmlFor="institutionName" className="font-medium">
                Nome
              </label>
              <div className="w-full h-fit border border-accent rounded-md grid grid-cols-[auto_1fr]">
                <i className="w-fit bg-transparent px-2 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </i>
                <input
                  required
                  type="text"
                  id="institutionName"
                  name="institutionName"
                  placeholder="IPIKK"
                  className="p-2 focus:outline-0"
                  value={formData.institutionName ?? ""}
                  onChange={(e) =>
                    handleInput("institutionName", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="h-fit flex items-start justify-center flex-col gap-1">
              <label htmlFor="institutionAddress" className="font-medium">
                Endereço
              </label>
              <div className="w-full h-fit border border-accent rounded-md grid grid-cols-[auto_1fr]">
                <i className="w-fit bg-transparent px-2 flex items-center justify-center">
                  <LocationEdit className="w-4 h-4" />
                </i>
                <input
                  required
                  type="text"
                  id="institutionAddress"
                  name="institutionAddress"
                  placeholder="Urbanização Nova Vida, Rua 53"
                  className="p-2 focus:outline-0"
                  value={formData.institutionAddress ?? ""}
                  onChange={(e) =>
                    handleInput("institutionAddress", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-x-3 gap-y-2">
            <div className="h-fit flex items-start justify-center flex-col gap-1">
              <label htmlFor="userName" className="font-medium">
                Nome de Utilizador
              </label>
              <div className="w-full h-fit border border-accent rounded-md grid grid-cols-[auto_1fr]">
                <i className="w-fit bg-transparent px-2 flex items-center justify-center">
                  <User2 className="w-4 h-4" />
                </i>
                <input
                  required
                  type="text"
                  id="userName"
                  name="userName"
                  placeholder="Kiesse Nzinga"
                  className="p-2 focus:outline-0"
                  value={formData.userName ?? ""}
                  onChange={(e) => handleInput("userName", e.target.value)}
                />
              </div>
            </div>
            <div className="h-fit flex items-start justify-center flex-col gap-1">
              <label htmlFor="login-email" className="font-medium">
                E-mail
              </label>
              <div className="w-full h-fit border border-accent rounded-md grid grid-cols-[auto_1fr]">
                <i className="w-fit bg-transparent px-2 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </i>
                <input
                  required
                  type="email"
                  id="login-email"
                  name="email"
                  placeholder="seu@email.com"
                  className="p-2 focus:outline-0"
                  value={formData.userEmail ?? ""}
                  onChange={(e) => handleInput("userEmail", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-x-3 gap-y-2">
            <div className="h-fit flex items-start justify-center flex-col gap-1">
              <label htmlFor="login-password" className="font-medium">
                Palavra-passe
              </label>
              <div className="w-full h-fit border border-accent rounded-md grid grid-cols-[auto_1fr_auto]">
                <i className="w-fit bg-transparent px-2 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </i>
                <div className="relative w-full">
                  <input
                    required
                    type={isPasswordVisible ? "text" : "password"}
                    id="login-password"
                    name="password"
                    placeholder="****"
                    className="p-2  pr-10 w-full focus:outline-0"
                    value={formData.userPassword ?? ""}
                    onChange={(e) =>
                      handleInput("userPassword", e.target.value)
                    }
                  />
                  <i
                    onClick={() => setIsPasswordVisible((e) => !e)}
                    className="absolute top-1/3 right-2 z-2 w-fit bg-transparent pr-2 flex items-center justify-center cursor-pointer"
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </i>
                </div>
              </div>
            </div>
            <div className="h-fit flex items-start justify-center flex-col gap-1">
              <label htmlFor="login-password" className="font-medium">
                Confirmar Palavra-passe
              </label>
              <div className="w-full h-fit border border-accent rounded-md grid grid-cols-[auto_1fr_auto]">
                <i className="w-fit bg-transparent px-2 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </i>
                <input
                  required
                  type={isPasswordVisible ? "text" : "password"}
                  id="login-password"
                  name="password"
                  placeholder="****"
                  className="p-2 focus:outline-0"
                  value={formData.userPasswordCheck ?? ""}
                  onChange={(e) =>
                    handleInput("userPasswordCheck", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Link
              to="/login"
              replace
              className="text-ring text-shadow-2xs cursor-pointer hover:underline"
            >
              Já possui uma conta? Entrar
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="w-fit px-20 flex items-center justify-center gap-2 capitalize bg-success text-muted text-xl text-center py-2 rounded-lg font-semibold cursor-pointer scale-95 hover:scale-100 transition-transform ease-in duration-200"
            >
              Cadastrar{" "}
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
