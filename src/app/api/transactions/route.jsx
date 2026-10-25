import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/utils/mongodb";
import { isAdmin, unauthorized } from "@/utils/adminAuth";

const col = async () =>
  (await connectToMongoDB()).client.db("centerdb").collection("transactions");

const clean = ({ _id, ...rest }) => ({ id: _id.toString(), ...rest });

export async function GET(req) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const rows = await (await col()).find({}).sort({ date: -1 }).toArray();
    return NextResponse.json(rows.map(clean));
  } catch (e) {
    console.error("GET /api/transactions", e);
    return NextResponse.json({ error: "Failed to load records" }, { status: 500 });
  }
}

export async function POST(req) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const body = await req.json().catch(() => ({}));

    const doc = {
      type: body.type === "expense" ? "expense" : "income",
      title: String(body.title || "").trim(),
      category: body.category || "",
      amount: Number(body.amount) || 0,
      date: body.date || new Date().toISOString().slice(0, 10),
    };

    if (!doc.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const { insertedId } = await (await col()).insertOne(doc);
    return NextResponse.json({ id: insertedId.toString(), ...doc }, { status: 201 });
  } catch (e) {
    console.error("POST /api/transactions", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}