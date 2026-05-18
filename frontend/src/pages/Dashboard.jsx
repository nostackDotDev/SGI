import { MetricCard } from "@/components/common/MetricCard";
import { SearchBar } from "@/components/dashboard/SearchBar";
import PageContainer from "@/components/layout/PageContainer";
import { useAuth } from "@/core/contexts/AuthContext";
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
  Sector,
  PieChart,
  Pie,
} from "recharts";

const typeConfig = {
  in: "Entrada",
  transfer: "Transferência",
  out: "Saída",
  return: "Devolução",
  borrow: "Empréstimo",
  repair: "Reparação",
  // exit: "Saída",
  reduction: "Redução",
};

export default function Dashboard() {
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    available: 0,
    repair: 0,
    removed: 0,
  });

  const { user } = useAuth();

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

  const fetchChartData = async () =>
    await request(
      "/dashboard/chart-data",
      "GET",
      {},
      (data) => {
        setChartData(data?.data?.chartData || []);
        setChartLabels(data?.data?.labels || []);
      },
      (err) => {
        console.error(err);
        setChartData(chartData || []);
        setChartLabels(chartLabels || []);
      },
    );

  useEffect(() => {
    fetchRecentActivity();
    fetchSummary();
    fetchChartData();
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
              Bém-vindo de volta, {user?.nome}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Instituto Politécnico Industrial Nova Vida nº 8050 Kilamba Kiaxi
            </p>
          </div>
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
            {chartData.length ? (
              <div className="w-full grid grid-cols-1 2xl:grid-cols-2 gap-4">
                <section className="relative">
                  <Chart data={chartData} />
                </section>

                <section className="min-h-fit p-4 flex items-center justify-center">
                  <ChartLabels labels={chartLabels} />
                </section>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-4 gap-4 text-muted-foreground text-lg">
                <p>Não existem dados suficientes para o gráfico</p>
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card rounded-xl max-h-full overflow-y-auto no-scrollbar flex flex-col relative"
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

const Chart = ({ data, isAnimationActive = true }) => {
  //   import { Pie, PieChart, PieLabelRenderProps, PieSectorShapeProps, Sector } from 'recharts';
  // import { RechartsDevtools } from '@recharts/devtools';

  const COLORS = [
    "#4F46E5", // Indigo
    "#7C3AED", // Purple
    "#0891B2", // Cyan
    "#059669", // Emerald
    "#D97706", // Amber
    "#DC2626", // Red
    "#2563EB", // Blue
    "#9333EA", // Violet
    "#0F766E", // Teal
    "#BE185D", // Pink
  ];

  // #endregion
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    if (
      cx == null ||
      cy == null ||
      innerRadius == null ||
      outerRadius == null
    ) {
      return null;
    }

    // Hide small slices
    if ((percent ?? 0) < 0.06) {
      return null;
    }

    const RADIAN = Math.PI / 180;

    // Move label slightly inward
    const radius = innerRadius + (outerRadius - innerRadius) * 0.42;

    const x = Number(cx) + radius * Math.cos(-(midAngle ?? 0) * RADIAN);

    const y = Number(cy) + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-lg font-medium select-none pointer-none:"
      >
        {`${((percent ?? 0) * 100).toFixed(1)}%`}
      </text>
    );
  };

  const MyCustomPie = (props) => {
    return <Sector {...props} fill={COLORS[props.index % COLORS.length]} />;
  };

  return (
    <PieChart
      style={{
        width: "100%",
        maxWidth: "500px",
        maxHeight: "80vh",
        aspectRatio: 1,
      }}
      responsive
    >
      <Pie
        data={data}
        labelLine={false}
        label={renderCustomizedLabel}
        fill="#8884d8"
        dataKey="value"
        isAnimationActive={isAnimationActive}
        shape={MyCustomPie}
      />
      {/* <RechartsDevtools /> */}
    </PieChart>
  );
};

const ChartLabels = ({ labels }) => {
  return (
    <div className="flex flex-col gap-2">
      {labels.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: [
                "#4F46E5", // Indigo
                "#7C3AED", // Purple
                "#0891B2", // Cyan
                "#059669", // Emerald
                "#D97706", // Amber
                "#DC2626", // Red
                "#2563EB", // Blue
                "#9333EA", // Violet
                "#0F766E", // Teal
                "#BE185D", // Pink
              ][i % 10],
            }}
          />
          <span className="text-lg text-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
};
