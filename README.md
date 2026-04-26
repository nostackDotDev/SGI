# SGI

# Aplicação Web Full-Stack

Este é um projeto de aplicação web full-stack organizado com separação clara entre **frontend** e **backend**.

---

## 🛠️ Tecnologias Utilizadas

### 🔹 Backend

- Node.js
- Express.js
- MySQL
- Arquitetura REST API
- Variáveis de ambiente com `.env`

### 🔹 Frontend

- React
- Vite
- TailwindCSS
- Comunicação com API via Fetch/Axios

---

## 📁 Estrutura do Projeto

```text
pasta-raiz/
│
├── backend/   # API Node + Express + MySQL
└── frontend/  # Aplicação React + Vite + TailwindCSS
```

---

## ⚙️ Instalação e Configuração

### 1️⃣ Clonar o repositório

```bash
git clone <url-do-repositorio>
cd <nome-da-pasta>
```

---

## 🚀 Configuração do Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` dentro da pasta `backend/` com as seguintes variáveis:

```env
TIDB_HOST=seu_host
TIDB_PORT=4000
TIDB_USER=seu_usuario
TIDB_PASS=sua_senha
TIDB_DB=seu_banco
```

Inicie o servidor:

```bash
npm start
```

O backend será executado em:

```text
http://localhost:8001
```

---

## 💻 Configuração do Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend será executado em:

```text
http://localhost:5173
```

---

## 🔌 Endpoints da API

```text
Método   Endpoint             Descrição
GET      /api/users           Lista todos os usuários
POST     /api/users/login     Autentica um usuário
```

---

## 🚀 CI/CD - GitHub Actions

Este projeto inclui um workflow automatizado do GitHub Actions que executa migrações de banco de dados sempre que alterações são feitas no código Prisma.

### Como configurar:

1. **Adicione o segredo no GitHub:**
   - Vá para o seu repositório no GitHub
   - Settings → Secrets and variables → Actions
   - Clique em "New repository secret"
   - Nome: `DATABASE_URL`
   - Valor: Sua string de conexão completa do TiDB (igual ao `.env`)

2. **O workflow será executado automaticamente quando:**
   - Fizer fazer push para as branches `main` ou `master`
   - Alterar arquivos em `backend/prisma/**`
   - Abrir PRs que modifiquem arquivos do Prisma

3. **Comandos disponíveis no backend:**
   ```bash
   npm run db:migrate    # Executa migrações
   npm run db:generate   # Gera cliente Prisma
   npm run db:seed       # Executa seed do banco
   npm run db:status     # Verifica status das migrações
   npm run db:reset      # Reseta banco (desenvolvimento)
   npm run db:studio     # Abre Prisma Studio
   ```

---

## ✨ Funcionalidades

- API RESTful
- Estrutura modular (frontend separado do backend)
- Conexão segura com banco de dados (SSL)
- Configuração por variáveis de ambiente
- Interface responsiva com TailwindCSS
- Integração frontend ↔ backend via HTTP

---

## 📌 Observações

- Certifique-se de que o banco de dados permite conexões do seu IP.
- O backend deve estar rodando antes de iniciar o frontend.
- Verifique se as variáveis do arquivo `.env` estão corretamente configuradas.

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

## More Info

Arquivos na pasta /.dev_docs são periodicamente atualizados com detalhes mais precisos, logs e reports. Verifique assim que puder...
