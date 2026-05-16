import { MetricCard } from "@/components/common/MetricCard";
import { SearchBar } from "@/components/dashboard/SearchBar";
import PageContainer from "@/components/layout/PageContainer";
import { request } from "@/lib/request";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Package,
  Activity,
  AlertTriangle,
  TrendingUp,
  Cog,
  PackageMinus,
  MonitorCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
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

const typeConfig = {
  in: "Entrada",
  transfer: "Transferência",
  out: "Saída",
  return: "Devolução",
  borrow: "Empréstimo",
  repair: "Reparação",
  exit: "Saída",
  reduction: "Redução",
};

export default function Dashboard() {
  const [recentActivity, setRecentActivity] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    available: 0,
    repair: 0,
    removed: 0,
  });

  const fetchRecentActivity = async () =>
    await request(
      "/registo/latest",
      "GET",
      {},
      (data) => {
        setRecentActivity(data?.data || []);
      },
      (err) => {
        console.error(err);
        setRecentActivity(recentActivity || []);
      },
    );

  const fetchSummary = async () =>
    await request(
      "/dashboard",
      "GET",
      {},
      (data) => {
        setSummary(
          data?.data?.summary || {
            total: 0,
            available: 0,
            repair: 0,
            removed: 0,
          },
        );
      },
      (err) => {
        console.error(err);
        setSummary(
          summary || {
            total: 0,
            available: 0,
            repair: 0,
            removed: 0,
          },
        );
      },
    );

  useEffect(() => {
    fetchRecentActivity();
    fetchSummary();
  }, []);

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
            value={summary.total}
            // change="+12% este mês"
            changeType="positive"
            icon={Package}
            iconColor="text-primary"
            delay={0}
          />
          <MetricCard
            title="Disponíveis"
            value={summary.available}
            // change="-8% este mês"
            // changeType="negative"
            icon={MonitorCheck}
            iconColor="text-success"
            delay={0.1}
          />
          <MetricCard
            title="Em manutenção"
            value={summary.repair}
            icon={Cog}
            iconColor="text-warning"
            delay={0.2}
          />
          <MetricCard
            title="Removidos"
            value={summary.removed}
            // change="+15%"
            changeType="positive"
            icon={PackageMinus}
            iconColor="text-destructive"
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
            className="glass-card rounded-xl max-h-96 overflow-y-auto no-scrollbar flex flex-col relative"
          >
            <div className="flex items-center justify-between sticky top-0 left-0 right-0 px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-background/50 z-2">
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
            <div className="mt-4 space-y-4 flex-1 min-h-0 px-4 p-6 pt-0">
              {recentActivity?.length > 0 ? (
                recentActivity.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                    className="flex items-start gap-3 relative"
                  >
                    <div className="absolute top-1/2 h-2 w-2 rounded-full bg-success" />
                    <div className="flex-1 min-w-0 pl-4">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.item.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {typeConfig[item.type] || item.type}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-center gap-1">
                      <span className="shrink-0 text-[10px] text-muted-foreground/60">
                        {formatDate(item.date, true)}
                      </span>

                      <span className="text-foreground/80">
                        {item.utilizador.nome}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhuma atividade recente encontrada.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </PageContainer>
  );
}
