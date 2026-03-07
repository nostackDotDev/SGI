# Estrutura do Frontend - SGI

## 📋 Visão Geral

Este documento descreve a estrutura do frontend do projeto SGI, explicando o propósito de cada pasta, arquivo e como manutenção e atualizações devem ser realizadas.

O frontend é construído com **React 19** como biblioteca principal, **Vite** como bundler de desenvolvimento, **Tailwind CSS** para estilização, **React Router** para roteamento, e segue uma arquitetura de componentes organizada.

---

## 🗂️ Estrutura de Pastas

```
frontend/
├── index.html               # Template HTML principal
├── package.json             # Dependências e scripts do projeto
├── vite.config.js           # Configuração do Vite
├── eslint.config.js         # Configuração do ESLint
├── vercel.json              # Configuração de deploy no Vercel
├── public/                  # Arquivos estáticos públicos
│   └── vite.svg             # Ícone do Vite
└── src/
    ├── main.jsx             # Ponto de entrada da aplicação
    ├── App.jsx              # Componente principal da aplicação
    ├── index.css            # Estilos globais
    ├── style.css            # Estilos adicionais
    ├── assets/              # Recursos estáticos (imagens, ícones)
    │   └── react.svg        # Ícone do React
    └── pages/               # Páginas/componentes de rota
        ├── Login.jsx        # Página de login
        └── Test.jsx         # Página de teste da API
```

---

## 📁 Descrição Detalhada de Cada Pasta

### 🔧 **Raiz do Frontend**

#### `index.html`
- **Propósito**: Template HTML principal que serve como ponto de entrada da aplicação
- **Como atualizar**:
  - Modificar `<title>` para alterar o título da aba
  - Adicionar meta tags para SEO ou configurações específicas
  - Incluir scripts externos ou bibliotecas (raramente necessário com Vite)
- **Estrutura básica**:
  ```html
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>SGI</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/src/main.jsx"></script>
    </body>
  </html>
  ```

#### `package.json`
- **Propósito**: Arquivo de configuração do Node.js com dependências e scripts
- **Como atualizar**:
  - Adicionar dependências: `npm install <package>`
  - Remover dependências: `npm uninstall <package>`
  - Executar scripts com: `npm run <script>`
- **Scripts principais**:
  - `npm run dev` - Inicia servidor de desenvolvimento
  - `npm run build` - Gera build de produção
  - `npm run preview` - Visualiza build de produção localmente
  - `npm run lint` - Executa linting do código
- **Dependências principais**:
  - `react` & `react-dom` - Biblioteca React
  - `react-router-dom` - Roteamento
  - `axios` - Cliente HTTP
  - `tailwindcss` - Framework CSS
  - `lucide-react` - Biblioteca de ícones

#### `vite.config.js`
- **Propósito**: Configuração do bundler Vite
- **Como atualizar**:
  - Adicionar plugins específicos
  - Configurar aliases de importação
  - Modificar configurações de build
  - Configurar proxy para desenvolvimento
- **Exemplo de configuração**:
  ```javascript
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import tailwindcss from '@tailwindcss/vite'

  export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': 'http://localhost:5000'
      }
    }
  })
  ```

#### `eslint.config.js`
- **Propósito**: Configuração do ESLint para linting e formatação de código
- **Como atualizar**:
  - Adicionar/remover regras específicas
  - Configurar plugins adicionais
  - Modificar padrões de arquivos a serem verificados
- **Regras importantes**:
  - `no-unused-vars` - Evita variáveis não utilizadas
  - Regras do React Hooks - Valida uso correto dos hooks
  - Regras do React Refresh - Suporte ao Hot Module Replacement

#### `vercel.json`
- **Propósito**: Configuração de deploy na plataforma Vercel
- **Como atualizar**:
  - Modificar regras de rewrite para SPA
  - Configurar redirecionamentos
  - Definir headers específicos
- **Configuração atual**:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/" }
    ]
  }
  ```

---

### 📂 **public/**

- **Propósito**: Armazenar arquivos estáticos que serão servidos diretamente
- **Como atualizar**:
  - Adicionar imagens, ícones, fontes que não precisam ser processadas
  - Arquivos aqui são acessíveis via `/nome-do-arquivo`
  - Não usar para arquivos que precisam ser importados no código
- **Arquivos comuns**:
  - `favicon.ico` - Ícone da aba do navegador
  - `robots.txt` - Configuração para motores de busca
  - `manifest.json` - Configuração PWA

---

### 📂 **src/**

#### `main.jsx`
- **Propósito**: Ponto de entrada da aplicação React
- **Como atualizar**:
  - Configurar providers globais (Context, Router, etc.)
  - Adicionar configurações globais
  - Modificar estrutura de roteamento
- **Estrutura atual**:
  ```javascript
  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import './index.css'
  import App from './App.jsx'
  import { createBrowserRouter, RouterProvider } from 'react-router-dom'
  import Login from './pages/Login.jsx'
  import Test from './pages/Test.jsx'

  const routes = [
    { path: "/", element: <App /> },
    { path: "/login", element: <Login /> },
    { path: "/test/api", element: <Test /> }
  ]

  const router = createBrowserRouter(routes)

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
  ```

#### `App.jsx`
- **Propósito**: Componente principal da aplicação
- **Como atualizar**:
  - Modificar layout base da aplicação
  - Adicionar navegação global
  - Implementar roteamento aninhado
  - Adicionar providers de contexto
- **Estrutura típica**:
  ```javascript
  function App() {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4">
          {/* Conteúdo das páginas */}
        </main>
        <Footer />
      </div>
    )
  }
  ```

#### `index.css` & `style.css`
- **Propósito**: Arquivos de estilos globais
- **Como atualizar**:
  - `index.css` - Importações globais, resets CSS, variáveis
  - `style.css` - Estilos utilitários e componentes globais
- **Conteúdo típico**:
  ```css
  /* index.css */
  @import 'tailwindcss/base';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';

  /* Reset e variáveis globais */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --primary-color: #10b981;
    --secondary-color: #64748b;
  }
  ```

---

### 🎨 **src/assets/**

- **Propósito**: Armazenar recursos estáticos que são importados no código
- **Como atualizar**:
  - Adicionar imagens, ícones, fontes que serão importadas
  - Organizar por tipo: `images/`, `icons/`, `fonts/`
  - Usar importações otimizadas do Vite
- **Exemplo de uso**:
  ```javascript
  import logo from './assets/logo.svg'
  import avatar from './assets/images/avatar.jpg'

  function Component() {
    return (
      <div>
        <img src={logo} alt="Logo" />
        <img src={avatar} alt="Avatar" />
      </div>
    )
  }
  ```

---

### 📄 **src/pages/**

- **Propósito**: Armazenar componentes que representam páginas completas
- **Como atualizar**:
  1. Criar um arquivo por página: `Dashboard.jsx`, `Users.jsx`, `Settings.jsx`
  2. Implementar layout completo da página
  3. Usar componentes reutilizáveis de outras pastas
  4. Conectar com APIs quando necessário
- **Estrutura recomendada**:
  ```
  pages/
  ├── auth/
  │   ├── Login.jsx
  │   ├── Register.jsx
  │   └── ForgotPassword.jsx
  ├── dashboard/
  │   ├── Dashboard.jsx
  │   └── components/
  │       ├── StatsCard.jsx
  │       └── RecentActivity.jsx
  ├── inventory/
  │   ├── Inventory.jsx
  │   ├── ItemForm.jsx
  │   └── ItemList.jsx
  └── settings/
      ├── Settings.jsx
      └── Profile.jsx
  ```

#### `Login.jsx`
- **Propósito**: Página de autenticação de usuários
- **Funcionalidades**:
  - Formulário de login com validação
  - Estados de loading e erro
  - Integração com API de autenticação
  - Navegação após login bem-sucedido
- **Estrutura típica**:
  ```javascript
  export default function Login() {
    const [formData, setFormData] = useState({
      email: '',
      password: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
      e.preventDefault()
      setIsLoading(true)
      try {
        // Chamada da API
        const response = await loginAPI(formData)
        // Salvar token, redirecionar
      } catch (error) {
        // Tratar erro
      } finally {
        setIsLoading(false)
      }
    }

    return (
      // JSX do formulário
    )
  }
  ```

#### `Test.jsx`
- **Propósito**: Página para testes de integração com API
- **Funcionalidades**:
  - Interface para testar endpoints
  - Exibição de respostas da API
  - Debugging de requisições
- **Uso**:
  - Desenvolvimento e testes
  - Verificação de conectividade com backend
  - Debugging de problemas de API

---

## 🔄 Fluxo da Aplicação

O fluxo típico da aplicação frontend:

```
Usuário acessa URL
    ↓
[Vite serve index.html]
    ↓
[main.jsx inicializa React]
    ↓
[RouterProvider configura rotas]
    ↓
[Componente da página renderiza]
    ↓
[Componentes fazem chamadas API via Axios]
    ↓
[Estado atualiza e re-renderiza]
```

---

## 🚀 Primeiros Passos para Desenvolvimento

### 1. **Instalar Dependências**
```bash
npm install
```

### 2. **Iniciar Servidor de Desenvolvimento**
```bash
npm run dev
```
- Servidor roda em `http://localhost:5173`
- Hot Module Replacement ativo
- Suporte a React Fast Refresh

### 3. **Estruturar uma Nova Página**
1. Criar componente em `src/pages/NomeDaPagina.jsx`
2. Adicionar rota em `src/main.jsx`:
   ```javascript
   const routes = [
     // ... rotas existentes
     { path: "/nova-pagina", element: <NomeDaPagina /> }
   ]
   ```
3. Implementar navegação usando `Link` ou `useNavigate`

### 4. **Adicionar Estilos**
- Usar classes Tailwind diretamente no JSX
- Para estilos customizados, adicionar em `src/style.css`
- Seguir convenção de nomenclatura do Tailwind

### 5. **Fazer Chamadas de API**
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

// Em um componente
const [data, setData] = useState([])
const [loading, setLoading] = useState(false)

useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await api.get('/endpoint')
      setData(response.data)
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }
  fetchData()
}, [])
```

---

## 📋 Dependências Principais

### **Core**
- **React 19.2.0** - Biblioteca principal
- **React DOM 19.2.0** - Renderização no navegador
- **Vite 7.3.1** - Bundler e dev server

### **Roteamento**
- **React Router DOM 7.13.1** - Navegação SPA

### **Estilização**
- **Tailwind CSS 4.2.1** - Framework CSS utilitário
- **@tailwindcss/vite 4.2.1** - Plugin Vite para Tailwind

### **HTTP Client**
- **Axios 1.13.6** - Cliente HTTP para APIs

### **Ícones**
- **Lucide React 0.575.0** - Biblioteca de ícones SVG

### **Desenvolvimento**
- **ESLint 9.39.1** - Linting e formatação
- **@vitejs/plugin-react 5.1.1** - Plugin React para Vite

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Gera build de produção
npm run preview          # Visualiza build localmente

# Qualidade de código
npm run lint             # Executa ESLint

# Dependências
npm install <package>    # Instala nova dependência
npm uninstall <package>  # Remove dependência
```

---

## 📱 Padrões de Desenvolvimento

### **Estrutura de Componentes**
```javascript
// Componente funcional com hooks
import React, { useState, useEffect } from 'react'

export default function MeuComponente({ prop1, prop2 }) {
  const [estado, setEstado] = useState(initialValue)

  useEffect(() => {
    // Efeitos colaterais
  }, [dependencias])

  const handleEvent = () => {
    // Lógica do evento
  }

  return (
    <div className="container">
      {/* JSX */}
    </div>
  )
}
```

### **Convenções de Nomenclatura**
- **Componentes**: PascalCase (`UserCard`, `LoginForm`)
- **Funções**: camelCase (`handleSubmit`, `fetchData`)
- **Variáveis**: camelCase (`userData`, `isLoading`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Arquivos**: PascalCase para componentes, camelCase para utils

### **Estilização com Tailwind**
```javascript
// Classes utilitárias
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-800">Título</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
    Ação
  </button>
</div>
```

### **Gerenciamento de Estado**
- **Estado local**: `useState` para estado do componente
- **Estado global**: Context API ou bibliotecas como Zustand/Redux
- **Estado de servidor**: React Query/SWR para cache e sincronização

---

## 🔗 Integração com Backend

### **Configuração do Axios**
```javascript
// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirecionar para login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

### **Estrutura de Serviços**
```javascript
// src/services/userService.js
import api from './api'

export const userService = {
  async getAll() {
    const response = await api.get('/users')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  async create(userData) {
    const response = await api.post('/users', userData)
    return response.data
  },

  async update(id, userData) {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },

  async delete(id) {
    await api.delete(`/users/${id}`)
  }
}
```

---

## 📊 Padrões de Componentes

### **Componente de Formulário**
```javascript
export default function UserForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      // Reset form ou navegação
    } catch (error) {
      setErrors(error.response?.data?.errors || {})
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campos do formulário */}
    </form>
  )
}
```

### **Componente de Loading**
```javascript
export default function LoadingSpinner({ size = 'md', message = 'Carregando...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 ${sizeClasses[size]}`}></div>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  )
}
```

---

## 🚀 Deploy

### **Vercel**
1. Conectar repositório no Vercel
2. Configurar build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Adicionar variáveis de ambiente no dashboard do Vercel

### **Build de Produção**
```bash
npm run build
```
- Gera pasta `dist/` com arquivos otimizados
- Minificação automática
- Tree shaking para remover código não utilizado

---

## ❓ Perguntas Frequentes

**P: Como adicionar uma nova rota?**
R: Adicionar objeto de rota em `main.jsx` no array `routes`

**P: Onde colocar lógica reutilizável?**
R: Criar hooks customizados em `src/hooks/` ou utilitários em `src/utils/`

**P: Como gerenciar estado global?**
R: Usar Context API para casos simples, ou bibliotecas como Zustand/Redux para aplicações maiores

**P: Como otimizar performance?**
R: Usar `React.memo`, `useMemo`, `useCallback`, lazy loading de componentes, code splitting

**P: Como testar componentes?**
R: Usar Vitest + React Testing Library (já configurado com Vite)

---

## 📞 Suporte

Para dúvidas sobre estrutura ou desenvolvimento, consulte este documento ou a documentação oficial:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)

---

**Última atualização**: Março 2026