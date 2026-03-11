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
} from "recharts";

import { WaitingServices } from "../../services/Waiting";
import { ServingServices } from "../../services/Serving";
import { WaitingViewModel } from "../../models/ViewWaiting";
import { ServingViewModel } from "../../models/ViewServing";

const COLORS = ["#2563eb", "#f59e0b", "#dc2626"];

export const Dashboard = () => {
  const [waiting, setWaiting] = useState<WaitingViewModel[]>([]);
  const [serving, setServing] = useState<ServingViewModel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [waitingData, servingData] = await Promise.all([
        WaitingServices.getAll(),
        ServingServices.getAll(),
      ]);
      setWaiting(waitingData);
      setServing(servingData);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ===================== STATS ===================== */

  const stats = useMemo(() => {
    const priorityCount = {
      senior: 0,
      pwd: 0,
      regular: 0,
    };

    return {
      waiting: waiting.length,
      serving: serving.length,
      total: waiting.length + serving.length,
      priorityChart: [
        { name: "Senior", value: priorityCount.senior },
        { name: "PWD", value: priorityCount.pwd },
        { name: "Regular", value: priorityCount.regular },
      ],
      statusChart: [
        { name: "Waiting", value: waiting.length },
        { name: "Serving", value: serving.length },
      ],
    };
  }, [waiting, serving]);

  return (
    <Box>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Queue Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Live queue statistics & insights</p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Waiting" value={stats.waiting} color="amber" />
          <StatCard title="Serving" value={stats.serving} color="emerald" />
          <StatCard title="Total Queue" value={stats.total} color="amber" />
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
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.priorityChart}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    {stats.priorityChart.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
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
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.statusChart}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
};

/* ===================== COMPONENT ===================== */

const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) => (
  <div
    className={`bg-gradient-to-r from-${color}-500 to-${color}-600 text-white rounded-xl p-6 shadow-xl`}
  >
    <div className="text-4xl font-bold">{value}</div>
    <div className="mt-2 opacity-90">{title}</div>
  </div>
);
