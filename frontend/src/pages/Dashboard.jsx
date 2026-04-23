import PageContainer from "@/components/layout/PageContainer";
import { numberFormatter } from "@/lib/utils";

export default function Dashboard() {
  return (
    <PageContainer className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Início</h1>
        <p className="text-gray-500">
          Visão geral dos movimentos e status do estoque
        </p>
      </div>

      <div className="grid grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-1 gap-4">
        <Card title="Total de itens" value="1146" extra="+12%" />
        <Card title="Entradas este mês" value="160" extra="+8%" />
        <Card title="Saidas este mês" value="105" extra="-5%" />
        <Card title="Stock baixo" value="4" extra="atenção" />
      </div>

      <div className="grid grid-rows-[auto_auto] grid-cols-1 lg:grid-rows-1 lg:grid-cols-3 gap-4">
        {/* GRÁFICO */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl border">
          <h2 className="font-semibold mb-4">Evolução dos movimentos</h2>

          {/* Placeholder gráfico */}
          <div className="min-h-86 flex items-center justify-center text-gray-400">
            Gráfico aqui
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <h2 className="font-semibold mb-4">Movimentações recentes</h2>

          {/* Cabeçalho */}
          <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-sm font-semibold mb-2">
            <span>Nome</span>
            <span className="text-center">Tipo</span>
            <span className="text-right">Quantidade</span>
          </div>

          {/* Linhas */}
          <div className="space-y-2">
            <Row name="Resma A4" type="entrada" qty="20" />
            <Row name="Impressoras" type="saida" qty="500000" />
            <Row name="Mesas" type="saida" qty="5" />
            <Row name="Cadeiras" type="entrada" qty="10" />
            <Row name="Kiesses" type="entrada" qty="1" />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function Card({ title, value, extra }) {
  return (
    <div className="bg-white p-4 rounded-xl border">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{numberFormatter(value)}</h2>
      <span className="text-sm text-gray-400 capitalize">{extra}</span>
    </div>
  );
}

function Row({ name, type, qty }) {
  const isEntrada = type === "entrada";

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr] items-center bg-gray-50 p-2 rounded-lg transition hover:bg-gray-100">
      {/* Nome */}
      <span>{name}</span>

      {/* Tipo */}
      <span
        className={`text-sm font-medium text-center ${
          isEntrada ? "text-blue-500" : "text-red-500"
        }`}
      >
        {isEntrada ? "Entrada" : "Saída"}
      </span>

      {/* Quantidade */}
      <span className="text-right font-semibold">{numberFormatter(qty)}</span>
    </div>
  );
}
