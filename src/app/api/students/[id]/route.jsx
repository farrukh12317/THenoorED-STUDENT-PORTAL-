import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToMongoDB } from "@/utils/mongodb";
import { isAdmin, unauthorized } from "@/utils/adminAuth";

const col = async () =>
  (await connectToMongoDB()).client.db("centerdb").collection("user");

const ALLOWED = [
  "username",
  "name",
  "password",
  "fatherName",
  "phone",
  "courses",
  "teacherRemarks",
  "joinDate",
  "status",
];

export async function PUT(req, { params }) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Bad id" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const changes = {};
    for (const key of ALLOWED) if (key in body) changes[key] = body[key];
    if (changes.username !== undefined) {
      changes.username = String(changes.username).trim().toLowerCase();
    }

    await (await col()).updateOne({ _id: new ObjectId(id) }, { $set: changes });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e.code === 11000) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    }
    console.error("PUT /api/students/[id]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Bad id" }, { status: 400 });
    }
    await (await col()).deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/students/[id]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}