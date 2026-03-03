# 📝 Guia de Commits Semânticos

Este projeto utiliza a convenção [Conventional Commits](https://www.conventionalcommits.org) para padronizar as mensagens de envio, facilitando a leitura do histórico e a automação de versões.

---

## 🏗️ Estrutura da Mensagem
A estrutura de um commit deve ser:
`tipo(escopo): descrição curta`

---

## 🏷️ Definição dos Principais Termos (Tipos)

De acordo com o padrão, deves utilizar os seguintes prefixos para categorizar as tuas alterações:


| Tipo | Definição e Uso |
| :--- | :--- |
| **`feat`** | **Funcionalidade:** Quando adicionas um novo recurso ao sistema. |
| **`fix`** | **Correção:** Quando resolves um erro ou comportamento inesperado (bug). |
| **`docs`** | **Documentação:** Alterações em ficheiros de texto como README, manuais ou comentários de código. |
| **`style`** | **Estilo:** Mudanças visuais ou de formatação (espaços, pontos e vírgulas) que **não** alteram a lógica. |
| **`refactor`** | **Refatoração:** Alteração no código que melhora a estrutura interna sem mudar o comportamento final. |
| **`perf`** | **Performance:** Mudanças feitas especificamente para tornar o sistema mais rápido ou eficiente. |
| **`test`** | **Testes:** Quando adicionas, removes ou modificas testes unitários ou de integração. |
| **`build`** | **Build:** Alterações que afetam o processo de compilação ou dependências (ex: `package.json`, `Gemfile`). |
| **`ci`** | **CI:** Mudanças em ficheiros de configuração de Integração Contínua (ex: `.github/workflows`). |
| **`chore`** | **Tarefas:** Mudanças rotineiras que não mexem no código principal (ex: atualizar o `.gitignore`). |
| **`revert`** | **Reversão:** Indica que o commit atual está a desfazer uma alteração anterior. |

---

## ⚠️ Regras Importantes

1. **Imperativo:** O assunto deve ser escrito como um comando (ex: `feat: add filter` e não `added filter`).
2. **Minúsculas:** O tipo e a descrição curta devem ser sempre em minúsculas.
3. **Breaking Changes:** Se a mudança quebrar a compatibilidade, adiciona um `!` após o tipo (ex: `feat!: remove legacy api`).

---

## 🛠️ Automação
Para garantir que todos seguem este padrão, recomendamos o uso do [Commitlint](https://commitlint.js.org) em conjunto com o [Husky](https://typicode.github.io).
