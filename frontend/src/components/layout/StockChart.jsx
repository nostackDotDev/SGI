import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { mes: "Jan", entradas: 45, saidas: 30 },
  { mes: "Fev", entradas: 50, saidas: 40 },
  { mes: "Mar", entradas: 38, saidas: 45 },
  { mes: "Abr", entradas: 67, saidas: 50 },
  { mes: "Mai", entradas: 53, saidas: 47 },
  { mes: "Jun", entradas: 72, saidas: 57 },
];

export function StockChart() {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="mes" />

          <YAxis domain={[0, 100]} tickCount={11} />

          <Tooltip />
          <Legend />

          <Bar dataKey="entradas" fill="#2a9d8f" name="Entradas" />
          <Bar dataKey="saidas" fill="#f4a261" name="Saídas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
