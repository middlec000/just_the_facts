"use server";

import { redirect } from "next/navigation";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import { getUserByUsername, createUser } from "./store";
import { setSession, clearSession } from "./session";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthState {
  error?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Validate a `from` redirect path to prevent open redirects. */
function safeRedirect(from: string | null): string {
  if (!from || !from.startsWith("/") || from.startsWith("//")) return "/";
  return from;
}

function generateSalt(): string {
  return randomBytes(16).toString("hex");
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

function verifyPassword(
  password: string,
  salt: string,
  storedHash: string,
): boolean {
  try {
    const inputHash = hashPassword(password, salt);
    return timingSafeEqual(
      Buffer.from(inputHash, "hex"),
      Buffer.from(storedHash, "hex"),
    );
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

/**
 * Sign up a new user. Designed for use with React 19's useActionState —
 * the first argument is the previous state (ignored here).
 */
export async function signUp(
  _prevState: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const username = (formData.get("username") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const confirmPassword =
    (formData.get("confirmPassword") as string | null) ?? "";

  if (!username) return { error: "Username is required." };
  if (username.length < 3)
    return { error: "Username must be at least 3 characters." };
  if (!/^[a-zA-Z0-9_-]+$/.test(username))
    return {
      error: "Username can only contain letters, numbers, underscores, and hyphens.",
    };
  if (!password) return { error: "Password is required." };
  if (password.length < 6)
    return { error: "Password must be at least 6 characters." };
  if (password !== confirmPassword) return { error: "Passwords do not match." };

  const existing = await getUserByUsername(username);
  if (existing) return { error: "Username is already taken." };

  const id = crypto.randomUUID();
  const salt = generateSalt();
  const hash = hashPassword(password, salt);
  const passwordHash = `${salt}:${hash}`;

  await createUser(id, username, username, passwordHash);

  await setSession(id);
  redirect(safeRedirect(formData.get("from") as string | null));
}

/**
 * Log in an existing user. Designed for use with React 19's useActionState.
 */
export async function logIn(
  _prevState: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const username = (formData.get("username") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!username || !password)
    return { error: "Username and password are required." };

  const user = await getUserByUsername(username);
  if (!user) return { error: "Invalid username or password." };

  const [salt, storedHash] = user.passwordHash.split(":");
  if (!verifyPassword(password, salt, storedHash))
    return { error: "Invalid username or password." };

  await setSession(user.id);
  redirect(safeRedirect(formData.get("from") as string | null));
}

/**
 * Log out the current user.
 */
export async function logOut(): Promise<void> {
  await clearSession();
  redirect("/login");
}
