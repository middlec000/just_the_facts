/**
 * Minimal cookie-based session.
 *
 * Cookie value format:  <userId>:<hmac-sha256(userId, SESSION_SECRET)>
 *
 * Set SESSION_SECRET in your environment (falls back to a dev default).
 */

import { cookies } from "next/headers";
import { createHmac } from "crypto";

const SECRET = process.env.SESSION_SECRET ?? "dev-secret-change-me-in-production";
const COOKIE_NAME = "jtf_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function sign(userId: string): string {
  return createHmac("sha256", SECRET).update(userId).digest("hex");
}

export async function getSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  const val = cookieStore.get(COOKIE_NAME)?.value;
  if (!val) return null;

  const separatorIndex = val.lastIndexOf(":");
  if (separatorIndex === -1) return null;

  const userId = val.slice(0, separatorIndex);
  const mac = val.slice(separatorIndex + 1);
  if (!userId || mac !== sign(userId)) return null;

  return { userId };
}

export async function setSession(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${userId}:${sign(userId)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
