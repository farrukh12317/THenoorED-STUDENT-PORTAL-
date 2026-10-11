import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/utils/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Login body:", body);

    const username = (body.username ?? body.name ?? "").trim();
    const { password } = body;

    const { client } = await connectToMongoDB();
    const db = client.db("centerdb");

    const user = await db.collection("user").findOne({ username });
    if (!user) {
      console.log("No user found for:", JSON.stringify(username));
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.password !== password) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    const { password: _, ...safeUser } = user;   // don't send the password back
    return NextResponse.json({
  user: {
    id: user._id.toString(),
    name: user.username,
  },
});
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
  
}