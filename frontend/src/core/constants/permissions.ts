/**
 * Frontend permission constants
 * These mirror the backend PERMISSIONS constants
 * Use these instead of hardcoding permission strings
 */
export const PERMISSIONS = {
  // Items
  ITEM_READ: "ITEM_READ",
  ITEM_CREATE: "ITEM_CREATE",
  ITEM_UPDATE: "ITEM_UPDATE",
  ITEM_DELETE: "ITEM_DELETE",

  // Users
  USER_READ: "USER_READ",
  USER_CREATE: "USER_CREATE",
  USER_UPDATE: "USER_UPDATE",
  USER_DELETE: "USER_DELETE",

  // Cargos
  CARGO_READ: "CARGO_READ",
  CARGO_CREATE: "CARGO_CREATE",
  CARGO_UPDATE: "CARGO_UPDATE",
  CARGO_DELETE: "CARGO_DELETE",

  // Categorias
  CATEGORIA_READ: "CATEGORIA_READ",
  CATEGORIA_CREATE: "CATEGORIA_CREATE",
  CATEGORIA_UPDATE: "CATEGORIA_UPDATE",
  CATEGORIA_DELETE: "CATEGORIA_DELETE",

  // Salas
  SALA_READ: "SALA_READ",
  SALA_CREATE: "SALA_CREATE",
  SALA_UPDATE: "SALA_UPDATE",
  SALA_DELETE: "SALA_DELETE",

  // Departamentos
  DEPARTAMENTO_READ: "DEPARTAMENTO_READ",
  DEPARTAMENTO_CREATE: "DEPARTAMENTO_CREATE",
  DEPARTAMENTO_UPDATE: "DEPARTAMENTO_UPDATE",
  DEPARTAMENTO_DELETE: "DEPARTAMENTO_DELETE",

  // Instituicoes
  INSTITUICAO_READ: "INSTITUICAO_READ",
  INSTITUICAO_CREATE: "INSTITUICAO_CREATE",
  INSTITUICAO_UPDATE: "INSTITUICAO_UPDATE",
  INSTITUICAO_DELETE: "INSTITUICAO_DELETE",

  // Condicoes
  CONDICAO_READ: "CONDICAO_READ",
  CONDICAO_CREATE: "CONDICAO_CREATE",
  CONDICAO_UPDATE: "CONDICAO_UPDATE",
  CONDICAO_DELETE: "CONDICAO_DELETE",

  // Registos
  REGISTO_READ: "REGISTO_READ",
  REGISTO_CREATE: "REGISTO_CREATE",
  REGISTO_UPDATE: "REGISTO_UPDATE",
  REGISTO_DELETE: "REGISTO_DELETE",

  // Relatórios
  RELATORIO_READ: "RELATORIO_READ",
  RELATORIO_CREATE: "RELATORIO_CREATE",
  RELATORIO_EXPORT: "RELATORIO_EXPORT",
} as const;

type PermissionLabelMap = Record<string, string>;

export const PERMISSION_LABELS: PermissionLabelMap = {
  ITEM_READ: "Visualizar itens",
  ITEM_CREATE: "Criar itens",
  ITEM_UPDATE: "Atualizar itens",
  ITEM_DELETE: "Excluir itens",
  USER_READ: "Visualizar utilizadores",
  USER_CREATE: "Criar utilizadores",
  USER_UPDATE: "Atualizar utilizadores",
  USER_DELETE: "Excluir utilizadores",
  CARGO_READ: "Visualizar cargos",
  CARGO_CREATE: "Criar cargos",
  CARGO_UPDATE: "Atualizar cargos",
  CARGO_DELETE: "Excluir cargos",
  CATEGORIA_READ: "Visualizar categorias",
  CATEGORIA_CREATE: "Criar categorias",
  CATEGORIA_UPDATE: "Atualizar categorias",
  CATEGORIA_DELETE: "Excluir categorias",
  SALA_READ: "Visualizar salas",
  SALA_CREATE: "Criar salas",
  SALA_UPDATE: "Atualizar salas",
  SALA_DELETE: "Excluir salas",
  DEPARTAMENTO_READ: "Visualizar departamentos",
  DEPARTAMENTO_CREATE: "Criar departamentos",
  DEPARTAMENTO_UPDATE: "Atualizar departamentos",
  DEPARTAMENTO_DELETE: "Excluir departamentos",
  INSTITUICAO_READ: "Visualizar instituição",
  INSTITUICAO_CREATE: "Criar instituição",
  INSTITUICAO_UPDATE: "Atualizar instituição",
  INSTITUICAO_DELETE: "Excluir instituição",
  CONDICAO_READ: "Visualizar condições",
  CONDICAO_CREATE: "Criar condições",
  CONDICAO_UPDATE: "Atualizar condições",
  CONDICAO_DELETE: "Excluir condições",
  REGISTO_READ: "Visualizar registos",
  REGISTO_CREATE: "Criar registos",
  REGISTO_UPDATE: "Atualizar registos",
  REGISTO_DELETE: "Excluir registos",
  RELATORIO_READ: "Visualizar relatórios",
  RELATORIO_CREATE: "Criar relatórios",
  RELATORIO_EXPORT: "Exportar relatórios",
};
