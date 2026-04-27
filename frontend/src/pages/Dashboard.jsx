import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { cn, numberFormatter } from "@/lib/utils";
import {
  ActivityIcon,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Package,
} from "lucide-react";
import { Activity } from "react";
import { Link } from "react-router-dom";

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

      <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 gap-4">
        <MetricCard
          title="Total de Itens"
          value="1,247"
          icon={Package}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Itens Emprestados"
          value="89"
          icon={ArrowUpRight}
          variant="warning"
          trend={{ value: 8, isPositive: false }}
        />
        <MetricCard
          title="Alertas de Estoque"
          value="4"
          icon={AlertTriangle}
          variant="warning"
        />
        <MetricCard
          title="Atividade Hoje"
          value="23"
          icon={ActivityIcon}
          variant="success"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="grid grid-rows-[auto_auto] grid-cols-1 xl:grid-rows-1 xl:grid-cols-3 gap-4">
        {/* GRÁFICO */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl border">
          <h2 className="font-semibold mb-4">Evolução dos movimentos</h2>

          {/* Placeholder gráfico */}
          <div className="min-h-86 flex items-center justify-center text-gray-400">
            Gráfico aqui
          </div>
        </div>

        <ActivityFeed />
      </div>
    </PageContainer>
  );
}

/* interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "warning" | "success";
} */

const variants = {
  default: "bg-card",
  primary: "bg-accent",
  warning: "bg-warning/10",
  success: "bg-success/10",
};

const iconVariants = {
  default: "bg-secondary text-secondary-foreground",
  primary: "bg-primary text-primary-foreground",
  warning: "bg-warning text-warning-foreground",
  success: "bg-success text-success-foreground",
};

function MetricCard({ title, value, icon: Icon, trend, variant = "default" }) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl border border-border shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5",
        variants[variant],
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-sm font-medium flex items-center gap-1",
                trend.isPositive ? "text-success" : "text-destructive",
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
              {/* <span className="text-muted-foreground font-normal">
                vs mês anterior
              </span> */}
            </p>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            iconVariants[variant],
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

/* interface Activity {
  id: string;
  type: "check-in" | "check-out";
  item: string;
  user: string;
  time: string;
} */

const activities = [
  {
    id: "1",
    type: "check-out",
    item: "Notebook Dell XPS 15",
    user: "João Silva",
    time: "há 5 min",
  },
  {
    id: "2",
    type: "check-in",
    item: 'Monitor LG 27"',
    user: "Maria Santos",
    time: "há 15 min",
  },
  {
    id: "3",
    type: "check-out",
    item: "Teclado Mecânico",
    user: "Pedro Costa",
    time: "há 30 min",
  },
  {
    id: "4",
    type: "check-in",
    item: "Mouse Wireless",
    user: "Ana Oliveira",
    time: "há 1 hora",
  },
  {
    id: "5",
    type: "check-out",
    item: "Webcam HD",
    user: "Carlos Lima",
    time: "há 2 horas",
  },
];

function ActivityFeed() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Atividade Recente</h3>
        <Link
          to="/movimentacoes"
          className="text-sm text-primary hover:underline"
        >
          Ver tudo
        </Link>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                activity.type === "check-in"
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-warning",
              )}
            >
              {activity.type === "check-in" ? (
                <ArrowDownLeft className="w-5 h-5" />
              ) : (
                <ArrowUpRight className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{activity.item}</p>
              <p className="text-sm text-muted-foreground">
                {activity.type === "check-in"
                  ? "Devolvido por"
                  : "Retirado por"}{" "}
                <span className="text-foreground">{activity.user}</span>
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {activity.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
