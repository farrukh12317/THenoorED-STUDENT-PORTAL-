import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToMongoDB } from "@/utils/mongodb";
import { isAdmin, unauthorized } from "@/utils/adminAuth";

const col = async () =>
  (await connectToMongoDB()).client.db("centerdb").collection("transactions");

export async function PUT(req, { params }) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Bad id" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const changes = {};
    if ("type" in body) changes.type = body.type === "expense" ? "expense" : "income";
    if ("title" in body) changes.title = String(body.title).trim();
    if ("category" in body) changes.category = body.category;
    if ("amount" in body) changes.amount = Number(body.amount) || 0;
    if ("date" in body) changes.date = body.date;

    await (await col()).updateOne({ _id: new ObjectId(id) }, { $set: changes });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("PUT /api/transactions/[id]", e);
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
    console.error("DELETE /api/transactions/[id]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}