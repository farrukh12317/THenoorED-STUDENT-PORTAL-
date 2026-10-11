"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  BookOpen,
  CreditCard,
  LogOut,
  Download,
  UserRound,
  MessageSquareText,
  Sun,
  Moon,
  Menu,
  X,
  GraduationCap,
  CheckCircle2,
  CircleDashed,
  Clock3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function StudentDashboard({ studentdata }) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const student = useMemo(() => {
    const data = studentdata ?? {};

    const activeCourses = Array.isArray(data.activeCourses)
      ? data.activeCourses
      : Array.isArray(data["active course"])
        ? data["active course"]
        : Array.isArray(data.activeCourse)
          ? data.activeCourse
          : [];

    const courseProgress = Array.isArray(data.courseProgress)
      ? data.courseProgress
      : Array.isArray(data["course progress"])
        ? data["course progress"]
        : [];

    return {
      name: data.username ?? "Loading name...",
      fatherName: data.fatherName ?? data["father name"] ?? "Not provided",
      activeCourses,
      courseProgress,
      teacherRemarks:
        data.teacherRemarks ?? data["teacher remarks"] ?? "No remarks available.",
      id: data._id ? `STU-${String(data._id).slice(-6).toUpperCase()}` : "STU-000000",
    };
  }, [studentdata]);

  const courses = useMemo(
    () =>
      student.activeCourses.map((course, index) => ({
        name: String(course),
        progressLabel: String(student.courseProgress[index] ?? "beginning").toLowerCase(),
      })),
    [student]
  );

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  const getProgressValue = (status) => {
    switch (status) {
      case "complete":
        return 100;
      case "middle":
        return 66;
      case "beginning":
      default:
        return 33;
    }
  };

  const getProgressMeta = (status) => {
    switch (status) {
      case "complete":
        return {
          label: "Complete",
          icon: CheckCircle2,
          badgeClass:
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
        };
      case "middle":
        return {
          label: "In Progress",
          icon: Clock3,
          badgeClass:
            "border-lime-200 bg-lime-50 text-lime-700 dark:border-lime-900 dark:bg-lime-950/40 dark:text-lime-300",
        };
      case "beginning":
      default:
        return {
          label: "Beginning",
          icon: CircleDashed,
          badgeClass:
            "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300",
        };
    }
  };

  const initials = String(student.name || "Student")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-green-50/60 dark:bg-slate-950 p-4 md:p-6 flex flex-col gap-4 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {/* Top Header */}
        <header className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 md:p-4 rounded-2xl border border-green-100 dark:border-green-950 shadow-sm h-16 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger Button (Mobile Only) */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-green-50 dark:hover:bg-green-950/40"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            <div className="h-10 w-28 md:w-32 rounded-lg border border-green-200 dark:border-green-900 bg-green-50/70 dark:bg-green-950/30 flex items-center justify-center overflow-hidden">
              <Image
                src="/logo center.jpeg"
                alt="Center Logo"
                width={128}
                height={40}
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="border-green-200 hover:bg-green-50 dark:border-green-900 dark:hover:bg-green-950/40"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-green-700" />
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-950 dark:text-red-400 dark:hover:bg-red-950/40 gap-2 px-3 md:px-4 text-xs md:text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Log Out</span>
            </Button>
          </div>
        </header>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-4 flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <aside
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } lg:flex flex-col lg:w-64 shrink-0 rounded-2xl border border-green-100 dark:border-green-950 bg-white dark:bg-slate-900 p-4 shadow-sm justify-between transition-all`}
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-green-100 dark:border-green-950">
                <Avatar className="h-10 w-10 border border-green-200 dark:border-green-900">
                  <AvatarFallback className="bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 font-bold">
                    {initials || "ST"}
                  </AvatarFallback>
                </Avatar>

                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {student.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {student.id}
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium p-2.5 bg-green-100/80 dark:bg-green-950/40 rounded-lg text-green-900 dark:text-green-200 cursor-pointer">
                  <User className="w-4 h-4 shrink-0" /> Personal Profile
                </div>
                <div className="flex items-center gap-2 text-sm font-medium p-2.5 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 cursor-pointer transition-colors">
                  <BookOpen className="w-4 h-4 shrink-0" /> Enrolled Courses
                </div>
                <div className="flex items-center gap-2 text-sm font-medium p-2.5 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 cursor-pointer transition-colors">
                  <CreditCard className="w-4 h-4 shrink-0" /> Student ID Card
                </div>
              </nav>
            </div>

            <div className="mt-6 lg:mt-0 rounded-xl border border-green-100 dark:border-green-950 bg-green-50/70 dark:bg-green-950/20 p-3 text-xs space-y-1">
              <p className="font-semibold text-green-900 dark:text-green-200">Student Status</p>
              <p className="text-slate-500 dark:text-slate-400">
                {courses.length} active course{courses.length === 1 ? "" : "s"}
              </p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col gap-4 overflow-y-auto min-w-0">
            {/* Dashboard Overview */}
            <Card className="border-green-100 dark:border-green-950 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400" />
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div className="flex items-center gap-4 min-w-0">
                    <Avatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-green-100 dark:border-green-950 shrink-0">
                      <AvatarFallback className="bg-green-600 text-white text-xl md:text-2xl font-bold">
                        {initials || "ST"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-300 border border-green-200 dark:border-green-900">
                        Student Dashboard
                      </Badge>
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                        {student.name}
                      </h1>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        ID: {student.id}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-green-100 dark:border-green-950 bg-green-50/70 dark:bg-green-950/20 p-4 min-w-[220px]">
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                      <GraduationCap className="h-5 w-5" />
                      <span className="text-sm font-semibold">Active Courses</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {courses.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="border border-green-100 dark:border-green-950 rounded-2xl bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm space-y-6">
              {/* Personal Info Section */}
              <section>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <UserRound className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
                        Personal Details
                      </h2>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Basic information from the student record.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-green-100 dark:border-green-950 bg-green-50/40 dark:bg-green-950/10">
                    <CardContent className="p-5">
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Username
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                        {student.name}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-green-100 dark:border-green-950 bg-green-50/40 dark:bg-green-950/10">
                    <CardContent className="p-5">
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Father Name
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white truncate">
                        {student.fatherName}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="bg-green-100 dark:bg-green-950" />

              {/* Courses Info Section */}
              <section>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
                        Active Enrolled Courses
                      </h2>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Current courses and their progress.
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="w-fit border-green-200 text-green-700 dark:border-green-900 dark:text-green-300"
                  >
                    {courses.length} course{courses.length === 1 ? "" : "s"}
                  </Badge>
                </div>

                {courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {courses.map((course) => {
                      const meta = getProgressMeta(course.progressLabel);
                      const ProgressIcon = meta.icon;

                      return (
                        <Card
                          key={`${course.name}-${course.progressLabel}`}
                          className="border-green-100 dark:border-green-950 bg-white dark:bg-slate-900 shadow-none hover:shadow-sm transition-shadow"
                        >
                          <CardHeader className="p-5 pb-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate">
                                  {course.name}
                                </CardTitle>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                  Active enrolled course
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={`shrink-0 gap-1 ${meta.badgeClass}`}
                              >
                                <ProgressIcon className="h-3 w-3" />
                                {meta.label}
                              </Badge>
                            </div>
                          </CardHeader>

                          <CardContent className="p-5 pt-2 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500 dark:text-slate-400">Progress</span>
                              <span className="font-semibold text-green-700 dark:text-green-300">
                                {getProgressValue(course.progressLabel)}%
                              </span>
                            </div>
                            <Progress
                              value={getProgressValue(course.progressLabel)}
                              className="h-2 bg-green-100 dark:bg-green-950"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                              Status: {course.progressLabel}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="border-dashed border-green-200 dark:border-green-900 bg-green-50/40 dark:bg-green-950/10">
                    <CardContent className="p-8 text-center">
                      <BookOpen className="mx-auto h-8 w-8 text-green-500" />
                      <p className="mt-3 font-medium text-slate-800 dark:text-slate-200">
                        No active courses found.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </section>

              <Separator className="bg-green-100 dark:bg-green-950" />

              {/* Teacher Remarks */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquareText className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
                      Teacher Remarks
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Latest feedback from the teacher.
                    </p>
                  </div>
                </div>

                <Card className="border-green-200 dark:border-green-900 bg-green-50/70 dark:bg-green-950/20">
                  <CardContent className="p-5">
                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {student.teacherRemarks}
                    </p>
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Generated ID Card Footer Section */}
            <Card className="border-green-700 bg-green-700 dark:border-green-900 dark:bg-green-900 text-white shadow-sm shrink-0 overflow-hidden">
              <CardContent className="p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center font-bold text-lg text-white shrink-0 border border-white/15">
                    ID
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-sm md:text-base truncate">{student.name}</p>
                      <span className="text-[10px] md:text-xs bg-white/15 px-2 py-0.5 rounded text-green-50 whitespace-nowrap">
                        {student.id}
                      </span>
                    </div>
                    <p className="text-xs text-green-100 mt-0.5 truncate">
                      Student profile • Official ID
                    </p>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full sm:w-auto gap-2 bg-white text-green-700 hover:bg-green-50"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Download ID Card</span>
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}