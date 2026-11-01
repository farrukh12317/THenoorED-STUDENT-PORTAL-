import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToMongoDB } from "@/utils/mongodb";
import { isAdmin, unauthorized } from "@/utils/adminAuth";

const col = async () =>
  (await connectToMongoDB()).client.db("centerdb").collection("user");

const validId = (id) => ObjectId.isValid(id);

// UPDATE a student
export async function PUT(req, { params }) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { id } = await params; // Next 15+: params is a promise
    if (!validId(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));

    const update = {
      name: String(body.name || "").trim(),
      fatherName: body.fatherName || "",
      phone: body.phone || "",
      courses: Array.isArray(body.courses) ? body.courses : [],
      teacherRemarks: body.teacherRemarks || "",
      joinDate: body.joinDate,
      status: body.status || "active",
    };

    if (body.username) {
      update.username = String(body.username).trim().toLowerCase();
    }
    // Only change the password when a new one was typed (plain text for testing)
    if (body.password) {
      update.password = String(body.password);
    }

    const result = await (await col()).updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (!result.matchedCount) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e.code === 11000) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    }
    console.error("PUT /api/students/[id]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE a student
export async function DELETE(req, { params }) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { id } = await params;
    if (!validId(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const result = await (await col()).deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/students/[id]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}