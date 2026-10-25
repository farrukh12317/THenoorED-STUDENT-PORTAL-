"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  LogOut,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserMinus,
  UserX,
  Users,
  Wallet,
} from "lucide-react";

import DashboardCharts from "@/components/dashboard-charts";
import StudentsTable from "@/components/students-table";
import TransactionsTable from "@/components/transactions-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAcademyStore } from "@/hooks/use-academy-store";

const AUTH_KEY = "adminAuth";
const LOGIN_PATH = "/Admin/Login";

const money = (n) => `Rs ${Number(n || 0).toLocaleString()}`;

function StatCard({ title, value, icon: Icon, tone = "green" }) {
  const tones = {
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };
  return (
    <Card className="border-green-100">
      <CardContent className="flex items-center justify-between gap-2 p-3 sm:p-5">
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground sm:text-sm">{title}</p>
          <p className="mt-1 truncate text-lg font-bold text-green-950 sm:text-2xl">
            {value}
          </p>
        </div>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${tones[tone]}`}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  // Hooks must be called inside the component, never at module level.
  const store = useAcademyStore();
  const students = store.students ?? [];
  const transactions = store.transactions ?? [];

  // Auth guard: read the saved login, otherwise redirect to the login page
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      const auth = raw ? JSON.parse(raw) : null;
      if (auth?.loggedIn && auth.expires > Date.now()) {
        setAuthed(true);
        return;
      }
    } catch {
      // bad or missing data falls through to the redirect
    }
    localStorage.removeItem(AUTH_KEY);
    router.replace(LOGIN_PATH);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    router.replace(LOGIN_PATH);
  }

  const stats = useMemo(() => {
    const count = (s) => students.filter((x) => x.status === s).length;
    const sum = (type) =>
      transactions
        .filter((t) => t.type === type)
        .reduce((a, t) => a + Number(t.amount), 0);
    const income = sum("income");
    const expenses = sum("expense");
    return {
      total: students.length,
      active: count("active"),
      inactive: count("inactive"),
      left: count("left"),
      income,
      expenses,
      profit: income - expenses,
    };
  }, [students, transactions]);

  // Early return comes after all hooks. This also prevents a flash of the
  // dashboard before an unauthenticated visitor is redirected.
  if (!authed || store.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-green-700">
        Loading dashboard...
      </div>
    );
  }

  const tab =
    "data-[state=active]:bg-green-600 data-[state=active]:text-white";

  return (
    <div className="min-h-screen bg-green-50/40">
      <header className="border-b border-green-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white sm:h-10 sm:w-10">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold text-green-950 sm:text-lg">
              THE NOORED ACADEMY
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              Students, income and expenses
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="shrink-0 border-green-200 text-green-800"
          >
            <LogOut className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:space-y-6 sm:px-4 sm:py-6">
        {/* Student stats */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard title="Total Students" value={stats.total} icon={Users} />
          <StatCard title="Active" value={stats.active} icon={UserCheck} />
          <StatCard title="Inactive" value={stats.inactive} icon={UserMinus} tone="amber" />
          <StatCard title="Left" value={stats.left} icon={UserX} tone="red" />
        </section>

        {/* Money stats */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <StatCard title="Total Income" value={money(stats.income)} icon={TrendingUp} />
          <StatCard
            title="Total Expenses"
            value={money(stats.expenses)}
            icon={TrendingDown}
            tone="red"
          />
          <StatCard
            title="Net Profit"
            value={money(stats.profit)}
            icon={Wallet}
            tone={stats.profit >= 0 ? "green" : "red"}
          />
        </section>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid h-auto w-full grid-cols-3 bg-green-100 sm:inline-flex sm:w-auto">
            <TabsTrigger value="overview" className={tab}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="students" className={tab}>
              Students
            </TabsTrigger>
            <TabsTrigger value="finance" className={tab}>
              <span className="sm:hidden">Finance</span>
              <span className="hidden sm:inline">Income &amp; Expenses</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardCharts students={students} transactions={transactions} />
          </TabsContent>

          <TabsContent value="students">
            <StudentsTable
              students={students}
              onAdd={store.addStudent}
              onUpdate={store.updateStudent}
              onDelete={store.deleteStudent}
            />
          </TabsContent>

          <TabsContent value="finance">
            <TransactionsTable
              transactions={transactions}
              onAdd={store.addTransaction}
              onUpdate={store.updateTransaction}
              onDelete={store.deleteTransaction}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}