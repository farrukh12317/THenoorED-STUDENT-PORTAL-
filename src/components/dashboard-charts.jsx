"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const STATUS_COLORS = {
  Active: "#16a34a",
  Inactive: "#f59e0b",
  Left: "#ef4444",
};

export default function DashboardCharts({ students = [], transactions = [] }) {
  // Pie: students by status
  const statusData = useMemo(() => {
    const count = (s) => students.filter((x) => x.status === s).length;
    return [
      { name: "Active", value: count("active") },
      { name: "Inactive", value: count("inactive") },
      { name: "Left", value: count("left") },
    ].filter((d) => d.value > 0);
  }, [students]);

  // Bar: income vs expenses for the last 6 months
  const monthlyData = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.push({
        key,
        month: d.toLocaleString("en", { month: "short" }),
        Income: 0,
        Expenses: 0,
      });
    }
    transactions.forEach((t) => {
      const m = months.find((x) => x.key === (t.date || "").slice(0, 7));
      if (!m) return;
      if (t.type === "income") m.Income += Number(t.amount) || 0;
      else m.Expenses += Number(t.amount) || 0;
    });
    return months;
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="border-green-100 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-green-900">Income vs Expenses</CardTitle>
          <CardDescription>Last 6 months</CardDescription>
        </CardHeader>
        <CardContent className="h-64 px-2 sm:h-72 sm:px-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} width={44} fontSize={12} />
              <Tooltip formatter={(v) => `Rs ${Number(v).toLocaleString()}`} />
              <Legend />
              <Bar dataKey="Income" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-900">Students by Status</CardTitle>
          <CardDescription>Active, inactive and left</CardDescription>
        </CardHeader>
        <CardContent className="h-64 sm:h-72">
          {statusData.length === 0 ? (
            <p className="text-sm text-muted-foreground">No students yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={3}
                >
                  {statusData.map((d) => (
                    <Cell key={d.name} fill={STATUS_COLORS[d.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}