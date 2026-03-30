import { Box } from "../../core/components/Box";
import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import { QueuesServices } from "../../services/Queues";
import { QueuesViewModel } from "../../models/Queues";

/** Match your palette */
const COLORS = ["#2563eb", "#f59e0b", "#dc2626"]; // blue, amber, red

/** Prevents Tailwind JIT from purging gradient classes */
const gradientByColor: Record<"amber" | "emerald" | "blue", string> = {
  amber: "from-amber-500 to-amber-600",
  emerald: "from-emerald-500 to-emerald-600",
  blue: "from-blue-500 to-blue-600",
};

export const Dashboard = () => {
  const [waiting, setWaiting] = useState<QueuesViewModel[]>([]);
  const [serving, setServing] = useState<QueuesViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setErr(null);
      setLoading(true);

      // 👇 Use the same services as PaymentList
      const [waitingData, servingData] = await Promise.all([
        QueuesServices.getAllWaiting(),
        QueuesServices.getAllServing(),
      ]);

      setWaiting(waitingData ?? []);
      setServing(servingData ?? []);
      setLastUpdated(new Date());
    } catch (e: any) {
      console.error("Dashboard error:", e);
      setErr(e?.message ?? "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Optional: Auto-refresh every 10s (comment out if not desired)
    const iv = setInterval(fetchData, 10000);
    return () => clearInterval(iv);
  }, []);

  const stats = useMemo(() => {
    const priorityCount = { senior: 0, pwd: 0, regular: 0 };

    const bump = (key?: string | null) => {
      const k = (key ?? "").toLowerCase().trim();
      if (k === "senior" || k === "pwd" || k === "regular") {
        // @ts-ignore
        priorityCount[k] = (priorityCount as any)[k] + 1;
      }
    };

    // Count priority from BOTH waiting + serving (adjust if you prefer waiting only)
    waiting.forEach((q) => bump((q as any).priorit));
    serving.forEach((q) => bump((q as any).priorit));

    const waitingCount = waiting.length;
    const servingCount = serving.length;

    return {
      waiting: waitingCount,
      serving: servingCount,
      total: waitingCount + servingCount,
      priorityChart: [
        { name: "Senior", value: priorityCount.senior },
        { name: "PWD", value: priorityCount.pwd },
        { name: "Regular", value: priorityCount.regular },
      ],
      statusChart: [
        { name: "Waiting", value: waitingCount, color: COLORS[1] }, // amber
        { name: "Serving", value: servingCount, color: COLORS[0] }, // blue
      ],
    };
  }, [waiting, serving]);

  return (
    <Box>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg">
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Queue Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Live queue statistics & insights
            </p>
          </div>

          <div className="bg-white px-5 py-3 rounded-xl shadow-md border border-gray-200">
            <div className="text-xs text-gray-500 font-medium mb-1">
              Last Updated
            </div>
            <div className="font-mono text-xl font-bold text-gray-800">
              {lastUpdated
                ? lastUpdated.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "—"}
            </div>
          </div>
        </div>

        {/* ERROR */}
        {err && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
            {err}
          </div>
        )}

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Waiting" value={stats.waiting} color="amber" />
          <StatCard title="Serving" value={stats.serving} color="emerald" />
          <StatCard title="Total Queue" value={stats.total} color="blue" />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* PRIORITY PIE */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Queue by Priority
            </h2>

            {loading ? (
              <div className="text-center py-10 text-gray-400 animate-pulse">
                Loading chart…
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={stats.priorityChart}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ name, value }) => `${name}: ${value}`}
                    isAnimationActive={false}
                  >
                    {stats.priorityChart.map((_, index) => (
                      <Cell
                        key={`pie-cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* STATUS BAR */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Queue Status Overview
            </h2>

            {loading ? (
              <div className="text-center py-10 text-gray-400 animate-pulse">
                Loading chart…
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={stats.statusChart}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                    label={{ position: "top" }}
                  >
                    {stats.statusChart.map((d, i) => (
                      <Cell key={`bar-cell-${i}`} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
};

/** ===================== COMPONENT ===================== */
const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "amber" | "emerald" | "blue";
}) => (
  <div
    className={`bg-gradient-to-r ${gradientByColor[color]} text-white rounded-xl p-6 shadow-xl`}
  >
    <div className="text-4xl font-bold">{value}</div>
    <div className="mt-2 opacity-90">{title}</div>
  </div>
);
