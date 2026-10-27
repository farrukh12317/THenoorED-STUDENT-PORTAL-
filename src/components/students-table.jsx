"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

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

const statusStyle = {
  active: "bg-green-100 text-green-800 hover:bg-green-100",
  inactive: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  left: "bg-red-100 text-red-800 hover:bg-red-100",
};

const emptyCourse = () => ({ name: "", progress: "beginning", fee: "" });

const emptyForm = () => ({
  username: "",
  name: "",
  password: "",
  fatherName: "",
  phone: "",
  courses: [emptyCourse()],
  teacherRemarks: "",
  joinDate: new Date().toISOString().slice(0, 10),
  status: "active",
});

// Safe helpers so old/incomplete documents in the DB never crash the table
const coursesOf = (s) => (Array.isArray(s.courses) ? s.courses : []);
const totalFee = (s) =>
  coursesOf(s).reduce((t, c) => t + (Number(c.fee) || 0), 0);

export default function StudentsTable({
  students = [],
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [showPassword, setShowPassword] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter(
      (s) =>
        (filter === "all" || s.status === filter) &&
        (!q ||
          (s.name || "").toLowerCase().includes(q) ||
          (s.username || "").toLowerCase().includes(q) ||
          (s.phone || "").includes(q) ||
          coursesOf(s).some((c) => (c.name || "").toLowerCase().includes(q))),
    );
  }, [students, query, filter]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const setCourse = (i, key) => (e) =>
    setForm((f) => ({
      ...f,
      courses: f.courses.map((c, j) =>
        j === i ? { ...c, [key]: e.target.value } : c,
      ),
    }));

  const addCourseRow = () =>
    setForm((f) => ({ ...f, courses: [...f.courses, emptyCourse()] }));

  const removeCourseRow = (i) =>
    setForm((f) => ({ ...f, courses: f.courses.filter((_, j) => j !== i) }));

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm());
    setShowPassword(false);
    setOpen(true);
  }

  function openEdit(s) {
    const courses = coursesOf(s).length
      ? coursesOf(s).map((c) => ({
          name: c.name || "",
          progress: c.progress || "beginning",
          fee: String(c.fee ?? ""),
        }))
      : [emptyCourse()];
    setEditingId(s.id);
    setShowPassword(false);
    setForm({
      ...emptyForm(),
      username: s.username || "",
      name: s.name || "",
      password : s.password || "",
      fatherName: s.fatherName || "",
      phone: s.phone || "",
      teacherRemarks: s.teacherRemarks || "",
      joinDate: s.joinDate || emptyForm().joinDate,
      status: s.status || "active",
      courses,
    });
    setOpen(true);
  }
  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      courses: form.courses
        .filter((c) => c.name.trim())
        .map((c) => ({
          name: c.name.trim(),
          progress: c.progress,
          fee: Number(c.fee) || 0,
        })),
    };
    if (!payload.password) delete payload.password; // keep the existing password on edit
    if (editingId) onUpdate(editingId, payload);
    else onAdd(payload);
    setOpen(false);
  }
  function handleDelete(s) {
    if (
      window.confirm(`Delete ${s.name || s.username}? This cannot be undone.`)
    )
      onDelete(s.id);
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-green-600" />
            <Input
              placeholder="Search name, course, phone"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`${selectClass} w-28 shrink-0 sm:w-32`}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="left">Left</option>
          </select>
        </div>
        <Button
          onClick={openAdd}
          className="w-full bg-green-600 text-white hover:bg-green-700 sm:w-auto"
        >
          <Plus className="mr-1 h-4 w-4" /> Add Student
        </Button>
      </div>

      {/* Table (scrolls sideways on phones) */}
      <div className="overflow-x-auto rounded-lg border border-green-100 bg-white">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  No students found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="font-medium">{s.name || s.username}</div>
                  {s.fatherName && (
                    <div className="text-xs text-muted-foreground">
                      S/O {s.fatherName}
                    </div>
                  )}
                </TableCell>
                <TableCell>{s.phone}</TableCell>
                <TableCell>
                  {coursesOf(s).length === 0 ? (
                    <span className="text-muted-foreground">-</span>
                  ) : (
                    <div className="space-y-0.5">
                      {coursesOf(s).map((c, i) => (
                        <div key={i} className="text-sm">
                          {c.name}{" "}
                          <span className="text-xs capitalize text-muted-foreground">
                            ({c.progress})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell>Rs {totalFee(s).toLocaleString()}</TableCell>
                <TableCell>{s.joinDate}</TableCell>
                <TableCell>
                  <Badge
                    className={`capitalize ${statusStyle[s.status] || ""}`}
                  >
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(s)}
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4 text-green-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(s)}
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

      {/* Add / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-green-900">
              {editingId ? "Edit Student" : "Add Student"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  required
                  value={form.username}
                  onChange={set("username")}
                />
              </div>

              {/* NEW: Student password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  {editingId ? "Set new password" : "Set student password"}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required={!editingId}
                    minLength={6}
                    autoComplete="new-password"
                    placeholder={
                      editingId
                        ? "Leave blank to keep current"
                        : "Min 6 characters"
                    }
                    value={form.password}
                    onChange={set("password")}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-green-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={set("name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father name</Label>
                <Input
                  id="fatherName"
                  value={form.fatherName}
                  onChange={set("fatherName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={set("phone")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join date</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={form.joinDate}
                  onChange={set("joinDate")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={set("status")}
                  className={selectClass}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="left">Left</option>
                </select>
              </div>
            </div>

            {/* Courses */}
            <div className="space-y-2">
              <Label>Courses</Label>
              {form.courses.map((c, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 gap-2 rounded-md border border-green-100 p-2 sm:grid-cols-[1fr_1fr_6rem_auto] sm:border-0 sm:p-0"
                >
                  <Input
                    className="col-span-2 sm:col-span-1"
                    placeholder="Course (e.g. CIT)"
                    value={c.name}
                    onChange={setCourse(i, "name")}
                  />
                  <select
                    className={selectClass}
                    value={c.progress}
                    onChange={setCourse(i, "progress")}
                  >
                    <option value="beginning">Beginning</option>
                    <option value="middle">Middle</option>
                    <option value="complete">Complete</option>
                  </select>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Fee"
                    value={c.fee}
                    onChange={setCourse(i, "fee")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="col-span-2 w-full sm:col-span-1 sm:w-9"
                    onClick={() => removeCourseRow(i)}
                    disabled={form.courses.length === 1}
                    aria-label="Remove course"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCourseRow}
              >
                <Plus className="mr-1 h-4 w-4" /> Add course
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacherRemarks">Teacher remarks</Label>
              <Input
                id="teacherRemarks"
                value={form.teacherRemarks}
                onChange={set("teacherRemarks")}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {editingId ? "Save changes" : "Add student"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
