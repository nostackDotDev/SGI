import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import { request } from "@/lib/request";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const REQUIRED_FIELDS = [
  "nome",
  "serialNumber",
  "categoria",
  "condicao",
  "sala",
];

const normalizeHeader = (value) => {
  if (value === undefined || value === null) return "";
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "");
};

const FIELD_MAP = {
  nome: "nome",
  name: "nome",
  item: "nome",
  itemname: "nome",
  descricao: "descricao",
  description: "descricao",
  desc: "descricao",
  serialnumber: "serialNumber",
  serial: "serialNumber",
  serie: "serialNumber",
  numerodeserie: "serialNumber",
  quantity: "quantidade",
  quantidade: "quantidade",
  qty: "quantidade",
  categoria: "categoria",
  category: "categoria",
  categoriaid: "categoria",
  condicao: "condicao",
  condition: "condicao",
  status: "condicao",
  condicaoid: "condicao",
  sala: "sala",
  location: "sala",
  localizacao: "sala",
  salaid: "sala",
};

const normalizeValue = (value) => {
  if (value === undefined || value === null) return "";
  return String(value).trim();
};

const normalizeLookupValue = (value) => {
  if (value === undefined || value === null) return "";
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
};

const mapFieldName = (key) => FIELD_MAP[normalizeHeader(key)] || null;

const getLookupItem = (value, list) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const normalized = normalizeLookupValue(value);
  const numeric = Number(value);

  if (!Number.isNaN(numeric) && numeric > 0) {
    return list.find((item) => Number(item.id) === numeric) || null;
  }

  return (
    list.find(
      (item) =>
        normalizeLookupValue(item.nome) === normalized ||
        normalizeLookupValue(item.label || "") === normalized,
    ) || null
  );
};

const parseUploadedRows = async (file) => {
  const fileName = file.name.toLowerCase();
  let rows = [];

  if (fileName.endsWith(".json")) {
    const fileText = await file.text();
    const parsed = JSON.parse(fileText);
    if (Array.isArray(parsed)) {
      rows = parsed;
    } else if (parsed?.data && Array.isArray(parsed.data)) {
      rows = parsed.data;
    } else {
      throw new Error("JSON deve conter um array de itens");
    }
  } else {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error("Arquivo não contém nenhuma planilha válida");
    }
    const worksheet = workbook.Sheets[sheetName];
    rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
  }

  if (!Array.isArray(rows)) {
    throw new Error(
      "O arquivo não pôde ser interpretado como uma lista de itens",
    );
  }

  return rows;
};

const normalizeRow = (rawRow, index) => {
  const row = {
    rowIndex: index + 1,
    nome: "",
    descricao: "",
    serialNumber: "",
    quantidade: "",
    categoria: "",
    condicao: "",
    sala: "",
  };

  Object.entries(rawRow).forEach(([key, value]) => {
    const field = mapFieldName(key);
    if (!field) return;
    const normalized = normalizeValue(value);
    row[field] = normalized;
  });

  return row;
};

const validateRow = (row, categorias, status, localizacoes) => {
  const errors = [];
  const resolvedCategoria = getLookupItem(row.categoria, categorias);
  const resolvedCondicao = getLookupItem(row.condicao, status);
  const resolvedSala = getLookupItem(row.sala, localizacoes);
  const quantityValue = row.quantidade === "" ? 1 : Number(row.quantidade);

  if (!row.nome) {
    errors.push("Nome é obrigatório");
  }

  if (!row.serialNumber) {
    errors.push("Número de série é obrigatório");
  }

  if (!row.categoria) {
    errors.push("Categoria é obrigatória");
  } else if (!resolvedCategoria) {
    errors.push("Categoria inválida");
  }

  if (!row.condicao) {
    errors.push("Condição/Status é obrigatório");
  } else if (!resolvedCondicao) {
    errors.push("Condição/Status inválido(a)");
  }

  if (!row.sala) {
    errors.push("Sala/Localização é obrigatória");
  } else if (!resolvedSala) {
    errors.push("Sala/Localização inválida");
  }

  if (
    row.quantidade !== "" &&
    (Number.isNaN(quantityValue) || quantityValue <= 0)
  ) {
    errors.push("Quantidade deve ser um número inteiro positivo");
  }

  return {
    ...row,
    quantidade: Number.isNaN(quantityValue) ? row.quantidade : quantityValue,
    categoriaId: resolvedCategoria?.id ?? null,
    condicaoId: resolvedCondicao?.id ?? null,
    salaId: resolvedSala?.id ?? null,
    errors,
  };
};

export function BulkImportDialog({
  open,
  onOpenChange,
  categorias = [],
  status = [],
  localizacoes = [],
  onSuccess,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [parsedRows, setParsedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setRows([]);
      setParsedRows([]);
      setIsLoading(false);
    }
  }, [open]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setSelectedFile(null);
      setRows([]);
      setParsedRows([]);
      return;
    }

    setSelectedFile(file);
    setParsedRows([]);
    setRows([]);

    try {
      const uploadedRows = await parseUploadedRows(file);
      const normalizedRows = uploadedRows.map((rawRow, index) =>
        normalizeRow(rawRow, index),
      );
      setRows(normalizedRows);
    } catch (error) {
      console.error("Erro ao ler arquivo:", error);
      toast.error(error.message || "Falha ao processar o arquivo", {
        id: "bulk-import-toast",
      });
      setSelectedFile(null);
      setRows([]);
      setParsedRows([]);
    }
  };

  useEffect(() => {
    const processed = rows.map((row) =>
      validateRow(row, categorias, status, localizacoes),
    );
    setParsedRows(processed);
  }, [rows, categorias, status, localizacoes]);

  const totalRows = parsedRows.length;
  const invalidRows = parsedRows.filter((row) => row.errors?.length > 0);
  const validRows = parsedRows.filter((row) => row.errors?.length === 0);

  const duplicateErrors = useMemo(() => {
    const seen = new Map();
    const duplicates = [];

    parsedRows.forEach((row) => {
      if (!row.nome || !row.serialNumber || !row.salaId) return;
      const key = `${row.nome.trim()}|${row.serialNumber.trim()}|${row.salaId}`;
      const count = seen.get(key) ?? 0;
      seen.set(key, count + 1);
    });

    seen.forEach((count, key) => {
      if (count > 1) {
        const [nome, serialNumber, salaId] = key.split("|");
        duplicates.push(
          `Itens duplicados no arquivo: ${nome} / ${serialNumber} / sala ${salaId}`,
        );
      }
    });

    return duplicates;
  }, [parsedRows]);

  const canUpload =
    selectedFile &&
    totalRows > 0 &&
    invalidRows.length === 0 &&
    duplicateErrors.length === 0;

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    request(
      "/item/bulk-upload",
      "POST",
      {
        data: formData,
      },
      (res) => {
        setIsLoading(false);
        if (!res || res.error) {
          toast.error(res?.message || "Erro ao importar itens", {
            id: "bulk-import-toast",
          });
          return;
        }

        toast.success(res.message || "Itens importados com sucesso", {
          id: "bulk-import-toast",
        });
        onSuccess?.();
        onOpenChange(false);
      },
      (err) => {
        console.error("Erro no upload em massa:", err);
        const errorMessage =
          err?.message || err?.error || "Falha ao importar itens";
        toast.error(errorMessage, {
          id: "bulk-import-toast",
        });
        setIsLoading(false);
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Importação em massa de itens</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo Excel, CSV ou JSON e revise os itens antes
            de importar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="bulk-import-file">Arquivo</Label>
            <Input
              id="bulk-import-file"
              type="file"
              accept=".csv,.json,.xlsx,.xls"
              onChange={handleFileChange}
            />
          </div>

          {selectedFile && (
            <div className="grid gap-3 p-4 rounded-lg border border-border bg-muted/50">
              <p className="text-sm font-medium">Arquivo selecionado:</p>
              <p className="text-sm text-muted-foreground">
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Total de linhas: {totalRows} • Linhas válidas:{" "}
                {validRows.length} • Linhas inválidas: {invalidRows.length}
              </p>
              {duplicateErrors.length > 0 && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {duplicateErrors.map((message, index) => (
                    <p key={index}>{message}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {parsedRows.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Linha</th>
                    <th className="px-3 py-2">Nome</th>
                    <th className="px-3 py-2">Nº Série</th>
                    <th className="px-3 py-2">Quantidade</th>
                    <th className="px-3 py-2">Categoria</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Sala</th>
                    <th className="px-3 py-2">Erros</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(0, 200).map((row) => (
                    <tr
                      key={row.rowIndex}
                      className={
                        row.errors?.length
                          ? "bg-destructive/10"
                          : "bg-transparent"
                      }
                    >
                      <td className="border-t border-border px-3 py-2">
                        {row.rowIndex}
                      </td>
                      <td className="border-t border-border px-3 py-2">
                        {row.nome}
                      </td>
                      <td className="border-t border-border px-3 py-2">
                        {row.serialNumber}
                      </td>
                      <td className="border-t border-border px-3 py-2">
                        {row.quantidade}
                      </td>
                      <td className="border-t border-border px-3 py-2">
                        {row.categoria}
                      </td>
                      <td className="border-t border-border px-3 py-2">
                        {row.condicao}
                      </td>
                      <td className="border-t border-border px-3 py-2">
                        {row.sala}
                      </td>
                      <td className="border-t border-border px-3 py-2 text-sm text-destructive">
                        {row.errors?.join("; ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedRows.length > 200 && (
                <div className="p-3 text-sm text-muted-foreground">
                  Mostrando as primeiras 200 linhas. Arquivo completo contém{" "}
                  {parsedRows.length} linhas.
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={!canUpload || isLoading}>
            {isLoading ? "Importando..." : "Importar Itens"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
