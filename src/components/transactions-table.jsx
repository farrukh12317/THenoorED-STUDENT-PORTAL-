"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const selectClass =
  "border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-green-600";

const emptyForm = () => ({
  type: "income",
  title: "",
  category: "",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
});

export default function TransactionsTable({
  transactions = [],
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());

  const rows = useMemo(
    () =>
      transactions
        .filter((t) => filter === "all" || t.type === filter)
        .sort((a, b) => (b.date || "").localeCompare(a.date || "")),
    [transactions, filter]
  );

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm());
    setOpen(true);
  }

  function openEdit(t) {
    setEditingId(t.id);
    setForm({ ...t, amount: String(t.amount) });
    setOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, amount: Number(form.amount) || 0 };
    if (editingId) onUpdate(editingId, payload);
    else onAdd(payload);
    setOpen(false);
  }

  function handleDelete(t) {
    if (window.confirm(`Delete "${t.title}"?`)) onDelete(t.id);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`${selectClass} w-40`}
        >
          <option value="all">All records</option>
          <option value="income">Income only</option>
          <option value="expense">Expenses only</option>
        </select>
        <Button onClick={openAdd} className="bg-green-600 text-white hover:bg-green-700">
          <Plus className="mr-1 h-4 w-4" /> Add Record
        </Button>
      </div>

      {/* Table scrolls sideways on phones */}
      <div className="overflow-x-auto rounded-lg border border-green-100 bg-white">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No records found.
                </TableCell>
              </TableRow>
            )}
            {rows.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.date}</TableCell>
                <TableCell className="font-medium">{t.title}</TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      t.type === "income"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {t.type === "income" ? "Income" : "Expense"}
                  </Badge>
                </TableCell>
                <TableCell
                  className={`text-right font-medium whitespace-nowrap ${
                    t.type === "income" ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"} Rs {Number(t.amount).toLocaleString()}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(t)} aria-label="Edit">
                    <Pencil className="h-4 w-4 text-green-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(t)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-green-900">
              {editingId ? "Edit Record" : "Add Record"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select id="type" value={form.type} onChange={set("type")} className={selectClass}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" required value={form.title} onChange={set("title")} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Fees, Rent, Salary..."
                  value={form.category}
                  onChange={set("category")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (Rs)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  required
                  value={form.amount}
                  onChange={set("amount")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" required value={form.date} onChange={set("date")} />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
                {editingId ? "Save changes" : "Add record"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}