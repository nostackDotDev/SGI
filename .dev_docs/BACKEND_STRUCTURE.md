# Estrutura do Backend - SGI

## 📋 Visão Geral

Este documento descreve a estrutura do backend do projeto SGI, explicando o propósito de cada pasta, arquivo e como manutenção e atualizações devem ser realizadas.

O backend é construído com **Express.js** como framework web, **Prisma** como ORM para gerenciamento de banco de dados MySQL, e segue uma arquitetura em camadas para separação de responsabilidades.

---

## 🗂️ Estrutura de Pastas

```
backend/
├── .env                      # Variáveis de ambiente (não versionado)
├── .gitignore               # Arquivos ignorados pelo Git
├── package.json             # Dependências e scripts do projeto
├── prisma.config.ts         # Configuração do Prisma
├── server.js                # Arquivo de entrada principal
├── app.js                   # Configuração da aplicação Express
├── prisma/
│   └── schema.prisma        # Schema do banco de dados
└── src/
    ├── config/              # Configurações globais
    ├── controllers/          # Lógica de requisição/resposta
    ├── integrations/         # Integrações com APIs externas
    ├── middleware/           # Middleware Express
    ├── repositories/         # Camada de acesso a dados
    ├── routes/               # Definição de rotas
    ├── services/             # Lógica de negócio
    ├── utils/                # Funções utilitárias
    └── validators/           # Validação de dados de entrada
```

---

## 📁 Descrição Detalhada de Cada Pasta

### 🔧 **Raiz do Backend**

#### `.env`

- **Propósito**: Armazenar variáveis de ambiente (chaves de acesso, URLs, portas, etc.)
- **Como atualizar**: Nunca adicionar ao repositório Git. Manter localmente e distribuir um `.env.example`
- **Exemplos de variáveis**:
  ```
  DATABASE_URL=mysql://user:password@localhost:3306/sgi
  PORT=5000
  NODE_ENV=development
  JWT_SECRET=sua_chave_secreta
  ```

#### `.gitignore`

- **Propósito**: Especificar quais arquivos/pastas não devem ser versionados
- **Como atualizar**: Adicionar novos padrões conforme novas dependências ou arquivos sejam criados
- **Não esquecer de adicionar**: `node_modules/`, `.env`, logs, arquivos temporários

#### `package.json`

- **Propósito**: Arquivo de configuração do Node.js com dependências e scripts
- **Como atualizar**:
  - Adicionar dependências: `npm install <package>`
  - Remover dependências: `npm uninstall <package>`
  - Executar scripts com: `npm run <script>`
- **Scripts principais**:
  - `npm start` - Inicia o servidor
  - `npm test` - Executa testes (quando implementados)

#### `prisma.config.ts`

- **Propósito**: Arquivo de configuração específica do Prisma
- **Como atualizar**: Modificar apenas se precisar customizar comportamentos do Prisma (geração de tipos, output paths, etc.)

#### `server.js`

- **Propósito**: Arquivo de entrada principal da aplicação. Inicializa o servidor e carrega configurações globais
- **Como atualizar**:
  - Adicionar listener de porta
  - Conectar ao banco de dados
  - Carregar variáveis de ambiente
- **Exemplo básico**:

  ```javascript
  require("dotenv").config();
  const app = require("./app");

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
  ```

#### `app.js`

- **Propósito**: Configurar a instância Express (middleware global, rotas principais, tratamento de erros)
- **Como atualizar**:
  - Adicionar middleware global
  - Registrar rotas principais
  - Configurar CORS, logging, etc.
- **Exemplo básico**:

  ```javascript
  const express = require("express");
  const cors = require("cors");

  const app = express();

  app.use(cors());
  app.use(express.json());

  // Rotas
  app.use("/api/users", require("./routes/users"));

  module.exports = app;
  ```

---

### 📊 **prisma/**

#### `schema.prisma`

- **Propósito**: Definir a estrutura do banco de dados e os modelos de dados
- **Como atualizar**:
  1. Modificar o arquivo com os novos modelos/campos
  2. Executar: `npx prisma migrate dev --name <nome_da_migracao>`
  3. O Prisma gera automaticamente migrations e atualiza o banco
- **Exemplo de modelo**:
  ```prisma
  model User {
    id    Int     @id @default(autoincrement())
    email String  @unique
    name  String?

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }
  ```

---

### 📂 **src/config/**

- **Propósito**: Armazenar configurações centralizadas da aplicação
- **Como atualizar**: Criar arquivos de configuração por feature ou contexto
- **Exemplos de arquivos a criar**:
  - `database.js` - Configuração de conexão com banco
  - `auth.js` - Configurações de autenticação
  - `logging.js` - Configurações de logs
  - `constants.js` - Constantes da aplicação

---

### 🎮 **src/controllers/**

- **Propósito**: Conter os controllers que tratam requisições HTTP
- **Responsabilidade**: Receber dados da requisição, chamar serviços, retornar resposta
- **Como atualizar**:
  1. Criar um arquivo por recurso: `userController.js`, `productController.js`, etc.
  2. Implementar métodos que correspondem às ações CRUD
  3. Não colocar lógica de negócio aqui, apenas orquestração
- **Exemplo de estrutura**:

  ```javascript
  // userController.js
  const userService = require("../services/userService");

  exports.getAllUsers = async (req, res) => {
    try {
      const users = await userService.getAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.createUser = async (req, res) => {
    try {
      const user = await userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  ```

---

### 🔌 **src/integrations/**

- **Propósito**: Integrar com APIs e serviços externos
- **Como atualizar**:
  1. Criar um arquivo por integração: `paymentAPI.js`, `emailService.js`, etc.
  2. Encapsular chamadas HTTP com tratamento de erros
  3. Manter configurações (URLs, chaves) centralizadas em `.env`
- **Exemplo**:

  ```javascript
  // paymentAPI.js
  const axios = require("axios");

  const paymentAPI = axios.create({
    baseURL: process.env.PAYMENT_API_URL,
    headers: {
      Authorization: `Bearer ${process.env.PAYMENT_API_KEY}`,
    },
  });

  exports.processPayment = async (amount, cardToken) => {
    // Implementar chamada à API
  };
  ```

---

### 🔐 **src/middleware/**

- **Propósito**: Implementar middleware Express para requisições (autenticação, logging, validação)
- **Como atualizar**:
  1. Criar um arquivo por middleware: `auth.js`, `errorHandler.js`, `logger.js`
  2. Middleware é executado em sequência nas rotas onde for registrado
  3. Usar `next()` para passar para o próximo middleware
- **Exemplo**:

  ```javascript
  // authMiddleware.js
  const jwt = require("jsonwebtoken");

  exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (error) {
      res.status(401).json({ error: "Token inválido" });
    }
  };
  ```

---

### 💾 **src/repositories/**

- **Propósito**: Camada de acesso a dados - encapsular operações no banco de dados
- **Benefício**: Facilita testes e permite trocar implementação do banco sem afetar o resto da aplicação
- **Como atualizar**:
  1. Criar um arquivo por modelo: `userRepository.js`, `productRepository.js`
  2. Usar Prisma Client para operações
  3. Não retornar dados sensíveis daqui
- **Exemplo**:

  ```javascript
  // userRepository.js
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  exports.findAll = async () => {
    return await prisma.user.findMany();
  };

  exports.findById = async (id) => {
    return await prisma.user.findUnique({ where: { id } });
  };

  exports.create = async (data) => {
    return await prisma.user.create({ data });
  };

  exports.update = async (id, data) => {
    return await prisma.user.update({ where: { id }, data });
  };

  exports.delete = async (id) => {
    return await prisma.user.delete({ where: { id } });
  };
  ```

---

### 🛣️ **src/routes/**

- **Propósito**: Definir as rotas da API e mapear para controllers
- **Como atualizar**:
  1. Criar um arquivo de rotas por recurso: `users.js`, `products.js`
  2. Usar Express Router
  3. Aplicar middleware específico de rota conforme necessário
- **Exemplo**:

  ```javascript
  // routes/users.js
  const express = require("express");
  const router = express.Router();
  const userController = require("../controllers/userController");
  const { authenticate } = require("../middleware/authMiddleware");
  const { validateUser } = require("../validators/userValidator");

  router.get("/", authenticate, userController.getAllUsers);
  router.get("/:id", authenticate, userController.getUserById);
  router.post("/", validateUser, userController.createUser);
  router.put("/:id", authenticate, validateUser, userController.updateUser);
  router.delete("/:id", authenticate, userController.deleteUser);

  module.exports = router;
  ```

---

### 🧠 **src/services/**

- **Propósito**: Conter a lógica de negócio da aplicação
- **Responsabilidade**: Implementar regras de negócio, manipulação de dados, orquestração
- **Como atualizar**:
  1. Criar um arquivo por serviço: `userService.js`, `productService.js`
  2. Usar repositories para acessar dados
  3. Implementar validações de negócio
- **Exemplo**:

  ```javascript
  // services/userService.js
  const userRepository = require("../repositories/userRepository");

  exports.getAll = async () => {
    return await userRepository.findAll();
  };

  exports.getById = async (id) => {
    const user = await userRepository.findById(id);
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  };

  exports.create = async (userData) => {
    // Validações de negócio
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) throw new Error("Email já registrado");

    return await userRepository.create(userData);
  };

  exports.update = async (id, userData) => {
    const user = await this.getById(id);
    return await userRepository.update(id, userData);
  };

  exports.delete = async (id) => {
    const user = await this.getById(id);
    return await userRepository.delete(id);
  };
  ```

---

### 🛠️ **src/utils/**

- **Propósito**: Armazenar funções utilitárias reutilizáveis
- **Como atualizar**:
  1. Criar arquivos por funcionalidade: `dateHelpers.js`, `formatters.js`, `validators.js`
  2. Funções devem ser puras e reutilizáveis
  3. Não dependam de estado global
- **Exemplo**:

  ```javascript
  // utils/dateHelpers.js
  exports.formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  exports.getDateDifference = (date1, date2) => {
    return Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
  };
  ```

---

### ✅ **src/validators/**

- **Propósito**: Validação de dados de entrada antes de processar
- **Como atualizar**:
  1. Criar um arquivo por entidade/rota: `userValidator.js`, `productValidator.js`
  2. Usar bibliotecas como Joi, Zod ou implementar manualmente
  3. Validadores são usados como middleware nas rotas
- **Exemplo com Joi**:

  ```javascript
  // validators/userValidator.js
  const Joi = require("joi");

  const userSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(3).required(),
    password: Joi.string().min(8).required(),
  });

  exports.validateUser = (req, res, next) => {
    const { error, value } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    req.validatedBody = value;
    next();
  };
  ```

---

## 🔄 Fluxo de Requisição

O fluxo típico de uma requisição no backend:

```
Requisição HTTP
    ↓
[Middleware Global - app.js]
    ↓
[Rota - routes/users.js]
    ↓
[Middleware Específico - validators/userValidator.js]
    ↓
[Middleware Específico - middleware/authMiddleware.js]
    ↓
[Controller - controllers/userController.js]
    ↓
[Service - services/userService.js]
    ↓
[Repository - repositories/userRepository.js]
    ↓
[Prisma Client - Banco de Dados]
    ↓
Resposta HTTP
```

---

## 🚀 Primeiros Passos para Desenvolvimento

### 1. **Configurar Banco de Dados**

```bash
# Copiar .env.example para .env e preencher dados de conexão
cp .env.example .env

# Executar migrations
npx prisma migrate dev --name init
```

### 2. **Instalar Dependências**

```bash
npm install
```

### 3. **Estruturar uma Nova Feature**

Seguir a ordem:

1. Atualizar `prisma/schema.prisma` com novo modelo
2. Criar migration: `npx prisma migrate dev --name nome_feature`
3. Criar `repositories/featureRepository.js`
4. Criar `services/featureService.js`
5. Criar `controllers/featureController.js`
6. Criar `validators/featureValidator.js` (se necessário)
7. Criar `routes/feature.js`
8. Registrar rota em `app.js`

### 4. **Iniciar Servidor**

```bash
npm start
```

---

## 📋 Dependências Principais

- **Express** (v5.2.1) - Framework web
- **Prisma** (v6.19.2) - ORM para banco de dados
- **Prisma Client** (v7.4.2) - Cliente do Prisma
- **MySQL2** (v3.18.2) - Driver MySQL
- **CORS** (v2.8.6) - Middleware para CORS
- **Axios** (v1.13.6) - Cliente HTTP
- **dotenv** (v17.3.1) - Variáveis de ambiente

---

## 🔧 Comandos Úteis do Prisma

```bash
# Gerar migration após alterar schema
npx prisma migrate dev --name <nome>

# Ver status das migrations
npx prisma migrate status

# Abrir Prisma Studio (UI para ver/editar dados)
npx prisma studio

# Gerar Prisma Client após instalar
npx prisma generate

# Verificar syntax do schema
npx prisma validate
```

---

## 📝 Boas Práticas

1. **Separação de Responsabilidades**: Cada camada (controller, service, repository) tem responsabilidade clara
2. **DRY (Don't Repeat Yourself)**: Reutilizar código em utils e services
3. **Tratamento de Erros**: Sempre envolver operações assincronas em try/catch
4. **Validação**: Validar inputs no validators antes de processar
5. **Variáveis de Ambiente**: Nunca commitar `.env`, usar `.env.example`
6. **Nomenclatura**: Seguir convenção de nomes clara (userService, userController, etc.)
7. **Logging**: Adicionar logs em operações críticas
8. **Autenticação**: Proteger rotas sensíveis com middleware de autenticação

---

## ❓ Perguntas Frequentes

**P: Onde devo colocar lógica de validação?**
R: Validação de formato/schema → validators; Validação de negócio → services

**P: Quando usar repositories vs services?**
R: Repositories → operações com banco; Services → lógica de negócio e orquestração

**P: Como adicionar um novo modelo?**
R: Adicionar em schema.prisma → fazer migration → criar repository/service/controller

**P: Onde armazenar configurações?**
R: Variáveis sensíveis → .env; Configurações de negócio → config/

---

## 📞 Suporte

Para dúvidas sobre estrutura ou desenvolvimento, consulte este documento ou a documentação oficial:

- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/docs/)
- [Node.js](https://nodejs.org/en/docs/)

---

**Última atualização**: Março 2026
