import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/utils/mongodb";
import { isAdmin, unauthorized } from "@/utils/adminAuth";

const col = async () =>
  (await connectToMongoDB()).client.db("centerdb").collection("user");

// Only these fields are ever sent to the browser (password never leaves the server)
const PUBLIC_FIELDS = {
  username: 1,
  name: 1,
  fatherName: 1,
  phone: 1,
  courses: 1,
  teacherRemarks: 1,
  joinDate: 1,
  status: 1,
};

const clean = ({ _id, ...rest }) => ({ id: _id.toString(), ...rest });

export async function GET(req) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const rows = await (await col())
      .find({}, { projection: PUBLIC_FIELDS })
      .sort({ joinDate: -1 })
      .toArray();
    return NextResponse.json(rows.map(clean));
  } catch (e) {
    console.error("GET /api/students", e);
    return NextResponse.json({ error: "Failed to load students" }, { status: 500 });
  }
}

export async function POST(req) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const body = await req.json().catch(() => ({}));

    const doc = {
      username: String(body.username || "").trim().toLowerCase(),
      password: String(body.password || ""),   // added
      name: String(body.name || "").trim(),
      fatherName: body.fatherName || "",
      phone: body.phone || "",
      courses: Array.isArray(body.courses) ? body.courses : [],
      teacherRemarks: body.teacherRemarks || "",
      joinDate: body.joinDate || new Date().toISOString().slice(0, 10),
      status: body.status || "active",
    };

    if (!doc.username || !doc.name || !doc.password) {
      return NextResponse.json(
        { error: "Username, name and password are required" },
        { status: 400 }
      );
    }

    const { insertedId } = await (await col()).insertOne(doc);
    const { password: _pw, ...safeDoc } = doc;   // don't send password back
    return NextResponse.json({ id: insertedId.toString(), ...safeDoc }, { status: 201 });
  } catch (e) {
    if (e.code === 11000) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    }
    console.error("POST /api/students", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}