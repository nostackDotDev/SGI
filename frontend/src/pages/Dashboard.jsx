import { MetricCard } from "@/components/common/MetricCard";
import { SearchBar } from "@/components/dashboard/SearchBar";
import PageContainer from "@/components/layout/PageContainer";
import { motion } from "framer-motion";
import { Package, Activity, AlertTriangle, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const chartData = [
  { month: "Jan", entradas: 45, saidas: 30 },
  { month: "Fev", entradas: 52, saidas: 38 },
  { month: "Mar", entradas: 36, saidas: 45 },
  { month: "Abr", entradas: 70, saidas: 52 },
  { month: "Mai", entradas: 48, saidas: 50 },
  { month: "Jun", entradas: 55, saidas: 58 },
];

const recentActivity = [
  {
    item: "Notebook Dell XPS 15",
    user: "João Silva",
    action: "Retirado",
    time: "há 5 min",
    color: "text-warning",
  },
  {
    item: 'Monitor LG 27"',
    user: "Maria Santos",
    action: "Devolvido",
    time: "há 15 min",
    color: "text-success",
  },
  {
    item: "Teclado Mecânico",
    user: "Pedro Costa",
    action: "Retirado",
    time: "há 30 min",
    color: "text-warning",
  },
  {
    item: "Mouse Wireless",
    user: "Ana Oliveira",
    action: "Devolvido",
    time: "há 1 hora",
    color: "text-success",
  },
  {
    item: "Webcam HD",
    user: "Carlos Lima",
    action: "Retirado",
    time: "há 2 horas",
    color: "text-warning",
  },
];

export default function Dashboard() {
  return (
    <PageContainer className="flex flex-col gap-8 px-0 pt-0">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-fit px-6 pb-8 pt-12 md:px-10 md:pt-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-10 h-36 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-20 top-0 h-20 w-80 rounded-full bg-purple-accent/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-12 w-72 rounded-full bg-cyan-accent/8 blur-3xl" />
        </div>
        <div className="relative space-y-8">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Sistema de Gestão de Inventário
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Instituto Politécnico Industrial ova Vida Kilamba Kiaxi
            </p>
          </div>

          {/* <SearchBar /> */}
        </div>
      </div>

      {/* Metrics */}
      <div className="px-6 md:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total de Equipamentos"
            value="1,247"
            change="+12% este mês"
            changeType="positive"
            icon={Package}
            iconColor="text-primary"
            delay={0}
          />
          <MetricCard
            title="Em Uso"
            value="89"
            change="-8% este mês"
            changeType="negative"
            icon={TrendingUp}
            iconColor="text-purple-accent"
            delay={0.1}
          />
          <MetricCard
            title="Alertas"
            value="4"
            icon={AlertTriangle}
            iconColor="text-warning"
            delay={0.2}
          />
          <MetricCard
            title="Atividade Hoje"
            value="23"
            change="+15%"
            changeType="positive"
            icon={Activity}
            iconColor="text-success"
            delay={0.3}
          />
        </div>
      </div>

      {/* Charts & Activity */}
      <div className="px-6 md:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card rounded-xl p-6 lg:col-span-2"
          >
            <h2 className="font-heading text-base font-semibold text-foreground">
              Evolução dos Movimentos
            </h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={4}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.85 0.01 260 / 60%)"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "oklch(0.5 0.02 260)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "oklch(0.5 0.02 260)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(1 0 0 / 95%)",
                      border: "1px solid oklch(0.9 0.01 260)",
                      borderRadius: "12px",
                      backdropFilter: "blur(12px)",
                      color: "oklch(0.18 0.03 265)",
                      boxShadow: "0 10px 40px -10px oklch(0.4 0.1 260 / 20%)",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: "12px",
                      color: "oklch(0.5 0.02 260)",
                    }}
                  />
                  <Bar
                    dataKey="entradas"
                    name="Entradas"
                    fill="#3B82F6"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="saidas"
                    name="Saídas"
                    fill="#8B5CF6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-base font-semibold text-foreground">
                Atividade Recente
              </h2>
              <a
                href="/movimentacoes"
                className="text-xs text-primary hover:underline"
              >
                Ver tudo
              </a>
            </div>
            <div className="mt-4 space-y-4">
              {recentActivity.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div
                    className={`mt-0.5 h-2 w-2 rounded-full ${item.color === "text-success" ? "bg-success" : "bg-warning"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.item}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.action} por{" "}
                      <span className="text-foreground/80">{item.user}</span>
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground/60">
                    {item.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageContainer>
  );
}
