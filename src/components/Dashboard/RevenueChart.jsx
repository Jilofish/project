import React, { useState, useEffect } from "react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Cell,
} from "recharts";
function RevenueChart({revenueChartData}) {
/* function RevenueChart() { */
  // 1. CREATE THEME STATE
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  // 2. OBSERVE THEME CHANGES
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  /* const mockData = [
    { month: "Jan", revenue: 45000, cogs: 27000, profit: 18000 },
    { month: "Feb", revenue: 52000, cogs: 31200, profit: 20800 },
    { month: "Mar", revenue: 48500, cogs: 29100, profit: 19400 },
    { month: "Apr", revenue: 61000, cogs: 33550, profit: 27450 },
    { month: "May", revenue: 58000, cogs: 34800, profit: 23200 },
    { month: "Jun", revenue: 72000, cogs: 39600, profit: 32400 },
    { month: "Jul", revenue: 68500, cogs: 41100, profit: 27400 },
    { month: "Aug", revenue: 75000, cogs: 42000, profit: 33000 },
    { month: "Sep", revenue: 64000, cogs: 38400, profit: 25600 },
    { month: "Oct", revenue: 79000, cogs: 43340, profit: 35660 },
    { month: "Nov", revenue: 85000, cogs: 46750, profit: 38250 },
    { month: "Dec", revenue: 92000, cogs: 50600, profit: 41400 },
  ]; */

  const formatMoney = (value) => {
    const num = Math.trunc(Number(value) * 100) / 100;
    return `₱${num.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  //remove this when api is ready
  /*const data = mockData; */

  //calls the data from the parent component which is the dashboard.jsx
  const data = revenueChartData ?? [];
  return (
    <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            Revenue Breakdown
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monthly Sales (COGS + Profit)
          </p>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Profit</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">COGS</span>
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 2"
              stroke={isDark ? "#ffffffa4" : "#00000073"} 
              opacity={0.3}
            />

            <XAxis
              dataKey="month"
              stroke={isDark ? "#94a3b8" : "#64748b"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickCount={8}
              stroke={isDark ? "#94a3b8" : "#64748b"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                `₱${(Math.trunc(value * 100) / 100).toLocaleString()}`
              }
            />

            <Tooltip
              cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }}
              contentStyle={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
                color: isDark ? "#ffffff" : "#1e293b"
              }}
              itemStyle={{ color: isDark ? "#cbd5e1" : "#383838" }}
              formatter={(value, name) => {
                if (name === "cogs") return [formatMoney(value), "COGS"];
                if (name === "profit") return [formatMoney(value), "Profit"];
              }}
              labelFormatter={(label) => {
                const item = data.find(d => d.month === label);
                if (item) {
                  return `${label} — Total: ${formatMoney(item.revenue)}`;
                }
                return label;
              }}
            />

            <Bar
              dataKey="cogs"
              stackId="revenue"
              fill="url(#cogsGradient)"
            />

            <Bar
              dataKey="profit"
              stackId="revenue"
              fill="url(#profitGradient)"
              radius={[6, 6, 0, 0]}
            />

            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>

              <linearGradient id="cogsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;