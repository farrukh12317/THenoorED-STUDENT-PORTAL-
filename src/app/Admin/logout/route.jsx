import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/utils/adminAuth";

export async function POST() {
  return clearSessionCookie(NextResponse.json({ ok: true }));
}