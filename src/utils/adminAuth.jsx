import crypto from "crypto";
import { NextResponse } from "next/server";

export const COOKIE_NAME = "admin_session";
const MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("Set ADMIN_SESSION_SECRET (16+ chars) in .env.local");
  }
  return s;
}

const sign = (value) =>
  crypto.createHmac("sha256", secret()).update(value).digest("base64url");

function createSessionToken() {
  const payload = Buffer.from(
    JSON.stringify({ role: "admin", exp: Date.now() + MAX_AGE_SECONDS * 1000 })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token) {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const a = Buffer.from(sig);
  const b = Buffer.from(sign(payload));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  try {
    const { role, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return role === "admin" && exp > Date.now();
  } catch {
    return false;
  }
}

// Use at the top of every protected route handler
export function isAdmin(req) {
  return verifySessionToken(req.cookies.get(COOKIE_NAME)?.value);
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Call on the successful login response
export function setSessionCookie(res) {
  res.cookies.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return res;
}

export function clearSessionCookie(res) {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}