# Default Items Implementation Guide

This document explains how the default items (cargo, categoria, sala, utilizador) are identified and accessed by both the frontend and backend.

## Overview

The system now has a way to identify and protect default items that are essential for system functionality. Default items:

- Are identified by a non-empty `defaultType` field in the database
- Cannot be deleted
- Are not returned in regular list endpoints
- Can only be accessed through dedicated `/default` endpoints
- Are typically created during signup/seeding and remain immutable

## Backend Implementation

### Database Schema

All relevant models have a `defaultType` field:

```prisma
model Cargo {
  id          Int     @id @default(autoincrement())
  nome        String
  descricao   String?
  defaultType String? @default("")  // Non-empty value indicates default
  // ... rest of fields
}

model Categoria {
  id          Int     @id @default(autoincrement())
  nome        String
  descricao   String?
  defaultType String? @default("")
  // ... rest of fields
}

model Sala {
  id          Int     @id @default(autoincrement())
  numeroSala  String
  tipoSala    String
  defaultType String? @default("")
  // ... rest of fields
}

model Utilizador {
  id          Int     @id @default(autoincrement())
  nome        String
  email       String  @unique
  password    String
  descricao   String?
  defaultType String? @default("")
  // ... rest of fields
}
```

### API Endpoints

#### Cargo Routes

- **GET `/cargo`** - Returns all cargos EXCEPT the default cargo (filters where `defaultType = ""`)
- **GET `/cargo/:id`** - Returns a specific cargo by ID
- **GET `/cargo/default`** - Returns the default cargo (where `defaultType != ""`)
- **DELETE `/cargo/:id`** - Deletes a cargo (blocked if `defaultType != ""`)

#### Categoria Routes

- **GET `/categoria`** - Returns all categorias EXCEPT the default categoria
- **GET `/categoria/:id`** - Returns a specific categoria by ID
- **GET `/categoria/default`** - Returns the default categoria
- **DELETE `/categoria/:id`** - Deletes a categoria (blocked if it's the default)

#### Sala (Localizacao) Routes

- **GET `/localizacao`** - Returns all salas EXCEPT the default sala
- **GET `/localizacao/:id`** - Returns a specific sala by ID
- **GET `/localizacao/default`** - Returns the default sala
- **DELETE `/localizacao/:id`** - Deletes a sala (blocked if it's the default)

#### Utilizador Routes

- **GET `/utilizador`** - Returns all utilizadores EXCEPT the default utilizador
- **GET `/utilizador/:id`** - Returns a specific utilizador by ID
- **GET `/utilizador/default`** - Returns the default utilizador (super admin)
- **DELETE `/utilizador/delete/:id`** - Deletes a utilizador (blocked if it's the default)

### Response Format

All default endpoints return the item with an `isDefault: true` flag:

```json
{
  "data": {
    "id": 1,
    "nome": "Super Admin",
    "descricao": "Administrator cargo",
    "isDefault": true,
    "permissoes": ["ITEM_READ", "ITEM_CREATE", ...]
  },
  "error": null
}
```

### Error Handling

Attempting to delete a default item returns:

```json
{
  "data": null,
  "error": "Cannot delete the default [tipo]"
}
```

## Frontend Implementation

### Utility Functions (`src/lib/defaults.ts`)

#### Type Checking

```typescript
import {
  isDefaultItem,
  hasDefaultInList,
  getDefaultFromList,
} from "@/lib/defaults";

// Check if a single item is default
if (isDefaultItem(cargo)) {
  // Show protection UI
}

// Check if list contains any defaults
if (hasDefaultInList(cargos)) {
  // Adjust UI accordingly
}

// Extract default from mixed list
const defaultCargo = getDefaultFromList(cargos);
```

#### List Filtering

```typescript
import { filterOutDefaults, separateDefaults } from "@/lib/defaults";

// Remove defaults from a list
const nonDefaultCargos = filterOutDefaults(allCargos);

// Separate defaults from non-defaults
const { defaults, nonDefaults } = separateDefaults(allCargos);
```

#### Validation & Messages

```typescript
import {
  canDeleteItem,
  getDeleteConfirmationMessage,
  getDefaultProtectionAlert,
} from "@/lib/defaults";

// Check if deletion is allowed
if (!canDeleteItem(cargo)) {
  alert(getDefaultProtectionAlert("cargo"));
  return;
}

// Show appropriate confirmation
const message = getDeleteConfirmationMessage(
  "cargo",
  cargo.nome,
  isDefaultItem(cargo),
);
// User sees: "Cannot delete the default cargo. The item 'Super Admin' is essential..."
```

### API Helpers (`src/lib/defaultsApi.ts`)

#### Cargo API

```typescript
import { cargoApi } from "@/lib/defaultsApi";

// Fetch default cargo
cargoApi.getDefault(
  (data) => console.log("Default cargo:", data),
  (error) => console.error("Error:", error),
);

// Fetch list (excludes defaults)
cargoApi.getList(
  (data) => setCargosList(data),
  (error) => console.error("Error:", error),
);

// Fetch specific cargo
cargoApi.getById(
  cargoId,
  (data) => console.log("Cargo:", data),
  (error) => console.error("Error:", error),
);
```

#### Categoria API

```typescript
import { categoriaApi } from "@/lib/defaultsApi";

// Fetch default categoria
categoriaApi.getDefault(
  (data) => setDefaultCategoria(data),
  (error) => showError(error),
);

// Fetch non-default categorias
categoriaApi.getList(
  (data) => setCategorias(data.data),
  (error) => showError(error),
);
```

#### Sala API

```typescript
import { salaApi } from "@/lib/defaultsApi";

// Fetch default sala
salaApi.getDefault(
  (data) => setDefaultSala(data),
  (error) => showError(error),
);

// Fetch non-default salas
salaApi.getList(
  (data) => setSalas(data.data),
  (error) => showError(error),
);
```

#### Utilizador API

```typescript
import { utilizadorApi } from "@/lib/defaultsApi";

// Fetch default utilizador (super admin)
utilizadorApi.getDefault(
  (data) => setDefaultUser(data),
  (error) => showError(error),
);

// Fetch non-default utilizadores
utilizadorApi.getList(
  (data) => setUsers(data.data),
  (error) => showError(error),
);
```

### Usage in React Components

#### Example: Delete with Protection

```typescript
import { canDeleteItem, getDefaultProtectionAlert } from "@/lib/defaults";
import { api } from "@/lib/request";

function handleDeleteCargo(cargo: any) {
  if (!canDeleteItem(cargo)) {
    alert(getDefaultProtectionAlert("cargo"));
    return;
  }

  if (window.confirm(`Delete cargo "${cargo.nome}"?`)) {
    api.delete(
      `/cargo/${cargo.id}`,
      {},
      () => {
        console.log("Deleted successfully");
        // Refresh list
      },
      (error) => console.error(error),
    );
  }
}
```

#### Example: Separate Default from List

```typescript
import { separateDefaults } from '@/lib/defaults';
import { cargoApi } from '@/lib/defaultsApi';

function CargoList() {
  const [defaultCargo, setDefaultCargo] = useState<any>(null);
  const [cargos, setCargos] = useState<any[]>([]);

  useEffect(() => {
    cargoApi.getDefault(
      (data) => setDefaultCargo(data.data),
      (error) => console.error(error)
    );

    cargoApi.getList(
      (data) => setCargos(data.data),
      (error) => console.error(error)
    );
  }, []);

  return (
    <div>
      {defaultCargo && (
        <div className="default-section">
          <h3>Cargo Padrão</h3>
          <div className="badge">{defaultCargo.nome} (Protected)</div>
        </div>
      )}

      <div className="regular-section">
        <h3>Outros Cargos</h3>
        {cargos.map((cargo) => (
          <div key={cargo.id}>{cargo.nome}</div>
        ))}
      </div>
    </div>
  );
}
```

#### Example: Delete Confirmation with Validation

```typescript
import {
  isDefaultItem,
  getDeleteConfirmationMessage,
  getDefaultProtectionAlert
} from '@/lib/defaults';

function DeleteDialog({ item, type, onConfirm }) {
  if (isDefaultItem(item)) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Cannot Delete</AlertTitle>
        <AlertDescription>
          {getDefaultProtectionAlert(type)}
        </AlertDescription>
      </Alert>
    );
  }

  const message = getDeleteConfirmationMessage(type, item.nome);

  return (
    <Dialog>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogDescription>{message}</DialogDescription>
      <Button onClick={onConfirm} variant="destructive">
        Delete
      </Button>
    </Dialog>
  );
}
```

## Seeding Defaults

When creating institution during signup, seed the defaults:

```typescript
// Create default cargo
const defaultCargo = await prisma.cargo.create({
  data: {
    nome: "Super Admin",
    descricao: "Administrator role",
    defaultType: "super_admin",
    instituicaoId: instituicaoId,
    permissoes: {
      create: allPermissions.map((p) => ({
        permissaoId: p.id,
      })),
    },
  },
});

// Create default categoria
const defaultCategoria = await prisma.categoria.create({
  data: {
    nome: "Default",
    descricao: "Default category",
    defaultType: "default",
    instituicaoId: instituicaoId,
  },
});

// Create default sala
const defaultSala = await prisma.sala.create({
  data: {
    numeroSala: "Default",
    tipoSala: "Default",
    defaultType: "default",
    instituicaoId: instituicaoId,
  },
});

// Create default utilizador (super admin)
const defaultUser = await prisma.utilizador.create({
  data: {
    nome: "Administrator",
    email: "admin@institution.com",
    password: hashedPassword,
    defaultType: "super_admin",
    instituicaoId: instituicaoId,
    cargoId: defaultCargo.id,
  },
});
```

## Summary

| Feature                 | Backend                               | Frontend                      |
| ----------------------- | ------------------------------------- | ----------------------------- |
| **Identify Default**    | Check `defaultType != ""`             | `isDefaultItem(item)`         |
| **Get Default**         | `GET /{resource}/default`             | `{resource}Api.getDefault()`  |
| **Get List**            | `GET /{resource}` (excludes defaults) | `{resource}Api.getList()`     |
| **Delete Protection**   | Return 400 error if default           | `canDeleteItem(item)`         |
| **Validation Messages** | Built into delete endpoint            | `getDefaultProtectionAlert()` |

This implementation ensures that critical system items remain protected while providing a seamless experience for managing non-default items.
