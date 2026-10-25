"use client";

import { useCallback, useEffect, useState } from "react";

const LOGIN_PATH = "/Admin/Login";

// fetch wrapper: sends JSON, handles expired sessions, never throws on empty bodies
async function api(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });

  if (res.status === 401) {
    try {
      localStorage.removeItem("adminAuth");
    } catch {}
    window.location.href = LOGIN_PATH;
    return { ok: false, data: { error: "Unauthorized" } };
  }

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export function useAcademyStore() {
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api("/api/students"), api("/api/transactions")])
      .then(([s, t]) => {
        if (cancelled) return;
        if (s.ok && Array.isArray(s.data)) setStudents(s.data);
        if (t.ok && Array.isArray(t.data)) setTransactions(t.data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ---------- Students ----------
  const addStudent = useCallback(async (payload) => {
    const { ok, data } = await api("/api/students", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!ok) return alert(data.error || "Failed to add student");
    setStudents((list) => [data, ...list]);
  }, []);

  const updateStudent = useCallback(async (id, payload) => {
    const { ok, data } = await api(`/api/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (!ok) return alert(data.error || "Failed to update student");
    setStudents((list) => list.map((x) => (x.id === id ? { ...x, ...payload } : x)));
  }, []);

  const deleteStudent = useCallback(async (id) => {
    const { ok, data } = await api(`/api/students/${id}`, { method: "DELETE" });
    if (!ok) return alert(data.error || "Failed to delete student");
    setStudents((list) => list.filter((x) => x.id !== id));
  }, []);

  // ---------- Income / Expenses ----------
  const addTransaction = useCallback(async (payload) => {
    const { ok, data } = await api("/api/transactions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!ok) return alert(data.error || "Failed to add record");
    setTransactions((list) => [data, ...list]);
  }, []);

  const updateTransaction = useCallback(async (id, payload) => {
    const { ok, data } = await api(`/api/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (!ok) return alert(data.error || "Failed to update record");
    setTransactions((list) => list.map((x) => (x.id === id ? { ...x, ...payload } : x)));
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    const { ok, data } = await api(`/api/transactions/${id}`, { method: "DELETE" });
    if (!ok) return alert(data.error || "Failed to delete record");
    setTransactions((list) => list.filter((x) => x.id !== id));
  }, []);

  return {
    students,
    transactions,
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}