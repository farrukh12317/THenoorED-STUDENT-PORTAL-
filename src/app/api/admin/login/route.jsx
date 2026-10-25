import { NextResponse } from "next/server";
import crypto from "crypto";
import { setSessionCookie } from "@/utils/adminAuth";

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    const name = String(body.Name ?? body.name ?? body.username ?? "").trim();
    const password = String(body.password ?? "");

    if (!name || !password) {
      return NextResponse.json(
        { message: "Name and password are required." },
        { status: 400 },
      );
    }

    const adminName = process.env.ADMIN_NAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminName || !adminPassword) {
      console.error("ADMIN_NAME / ADMIN_PASSWORD missing in .env.local");
      return NextResponse.json(
        { message: "Server configuration error." },
        { status: 500 },
      );
    }

    // Evaluate both so timing doesn't reveal which one was wrong
    const nameOk = safeEqual(name, adminName);
    const passOk = safeEqual(password, adminPassword);

    if (!(nameOk && passOk)) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 },
      );
    }

    // Signed, httpOnly session cookie (checked by every /api/students and /api/transactions call)
    return setSessionCookie(NextResponse.json({ success: true }));
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 },
    );
  }
}