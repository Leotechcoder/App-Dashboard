import { BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const SalesChartHome = ({data}) => {

  if(!data.length){
    return(
      <p className="text-muted-foreground text-sm">
        No hay datos suficientes para mostrar el gráfico de tendencias.
      </p>
    )
  }

  return (
    <>
      <h3 className="text-lg font-semibold text-indigo-600 mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-indigo-500" /> Tendencia de Ventas
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: "#64748b" }} />
            <YAxis stroke="#94a3b8" tick={{ fill: "#64748b" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                color: "#1e293b",
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: "#ec4899", r: 4 }}
              activeDot={{ r: 7, stroke: "#6366f1", fill: "#ec4899" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default SalesChartHome;
