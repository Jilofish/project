import React, { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,Scale,
  UserX,
  ShoppingCart,
  Users,
  PhilippinePeso
} from "lucide-react";

function StatsGrid() {
  
  const [statsData, setStatsData] = useState({
    sales: {
      value: 2000,
      change: "0%",
      trend: "up",
    },
    kgSold: {
      value: 0,
      change: "0%",
      trend: "up",
    },
    receivables: {
      value: 12000,
      change: "0%",
      trend: "up",
    },
    payables: {
      value: 2000,
      change: "0%",
      trend: "up",
    },
  
    inactiveCustomers: {
      value: 0
    },
  });
  
  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(res => res.json())
      .then(data => setStatsData(data))
      .catch(err => console.error("Failed to fetch stats", err));
  }, []);

  const formatMoney = (value) => {
    const num = Math.trunc(Number(value) * 100) / 100;
    return `₱${num.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const stats = [
    {
      title: "Total Sales",
      value: formatMoney(statsData.sales.value), //`₱${Number(statsData.sales.value).toFixed(2).toLocaleString()}`,
      change: statsData.sales.change,
      trend: statsData.sales.trend,
      icon: PhilippinePeso,
      color: "from-green-500 to-teal-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Total KG of items sold",
      value: `${statsData.kgSold.value.toLocaleString()} kg`,
      change: statsData.kgSold.change,
      trend: statsData.kgSold.trend,
      icon: Scale,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Total Receivables",
      value: formatMoney(statsData.receivables.value),
      change: statsData.receivables.change,
      trend: statsData.receivables.trend,
      icon: Users,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Total Payables",
      value: formatMoney(statsData.payables.value),
      change: statsData.payables.change,
      trend: statsData.payables.trend,
      icon: Scale,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Inactive Customers",
      value: statsData.inactiveCustomers.value.toLocaleString(),
      icon: UserX,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400",
    }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {stats.map((stats, index) => {
        return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50
        hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300 group cursor-pointer" key={index}>
          <div className="flex items-start justify-between">
            <div className="flex-1">

              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1 group-hover:underline">
                {stats.title} <ArrowUpRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </p>

              <p className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                {stats.value}
              </p>
              
            </div>
            <div 
            className={`p-3 rounded-xl ${stats.bgColor} group-hover:scale-110 transition-all duration-300`}>
              {<stats.icon className={`w-6 h-6 ${stats.textColor}`} />}
            </div>
          </div>
        </div>
        );
        })}
    </div>
  );
}

export default StatsGrid

