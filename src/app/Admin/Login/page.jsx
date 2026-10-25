"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AdminLogin from "@/components/ui/AdminLogin";

const AUTH_KEY = "adminAuth";
const DASHBOARD_PATH = "/Admin/Dashborad"; // must match your folder name exactly

export default function Page() {
  const router = useRouter();

  // Already logged in? Skip the login form and go straight to the dashboard.
  useEffect(() => {
    try {
      const auth = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
      if (auth?.loggedIn && auth.expires > Date.now()) {
        router.replace(DASHBOARD_PATH);
      }
    } catch {
      // ignore bad data, just show the login form
    }
  }, [router]);

  return <AdminLogin />;
}