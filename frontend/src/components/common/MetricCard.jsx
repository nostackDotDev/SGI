import { motion } from "framer-motion";

export function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
  delay = 0,
}) {
  const changeColor =
    changeType === "positive"
      ? "text-success"
      : changeType === "negative"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass-card rounded-xl p-5 hover:glow-sm transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="font-heading text-3xl font-bold text-foreground">
            {value}
          </p>
          {change && (
            <p className={`text-xs font-medium ${changeColor}`}>{change}</p>
          )}
        </div>
        <div className="glass rounded-lg p-2.5">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
}
