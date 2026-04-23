"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addStatement, addArgument, addEvidence, toggleVote } from "./store";
import { getSession } from "./session";
import type { Statement, Argument, Evidence } from "./types";

async function requireUserId(): Promise<string> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session.userId;
}

// ---------------------------------------------------------------------------
// Statements
// ---------------------------------------------------------------------------

export async function createStatement(formData: FormData) {
  const userId = await requireUserId();
  const text = (formData.get("text") as string | null)?.trim() ?? "";
  const tagsRaw = (formData.get("tags") as string | null)?.trim() ?? "";

  if (!text) throw new Error("Statement text is required.");

  // Parse comma-separated tags, strip leading # if present
  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
        .filter(Boolean)
    : [];

  const statement: Statement = {
    id: crypto.randomUUID(),
    text,
    tags,
    hearts: 0,
    userId,
    createdAt: new Date().toISOString(),
  };

  addStatement(statement);
  revalidatePath("/");
  return { id: statement.id };
}

// ---------------------------------------------------------------------------
// Arguments
// ---------------------------------------------------------------------------

export async function createArgument(formData: FormData) {
  const userId = await requireUserId();
  const statementId = (formData.get("statementId") as string | null) ?? "";
  const stance = (formData.get("stance") as "for" | "against") ?? "for";
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const summary = (formData.get("summary") as string | null)?.trim() ?? "";

  if (!statementId) throw new Error("Statement ID is missing.");
  if (!title) throw new Error("Title is required.");
  if (!summary) throw new Error("Summary is required.");

  const argument: Argument = {
    id: crypto.randomUUID(),
    statementId,
    stance,
    title,
    summary,
    hearts: 0,
    userId,
    createdAt: new Date().toISOString(),
  };

  addArgument(argument);
  revalidatePath(`/statements/${statementId}`);
  return { id: argument.id };
}

// ---------------------------------------------------------------------------
// Evidence
// ---------------------------------------------------------------------------

export async function createEvidence(formData: FormData) {
  const userId = await requireUserId();
  const argumentId = (formData.get("argumentId") as string | null) ?? "";
  const statementId = (formData.get("statementId") as string | null) ?? "";
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const description =
    (formData.get("description") as string | null)?.trim() ?? "";
  const sourceUrl =
    (formData.get("sourceUrl") as string | null)?.trim() ?? "";
  const sourceType =
    (formData.get("sourceType") as Evidence["sourceType"] | null) ?? "other";

  if (!argumentId) throw new Error("Argument ID is missing.");
  if (!title) throw new Error("Title is required.");
  if (!description) throw new Error("Description is required.");

  const ev: Evidence = {
    id: crypto.randomUUID(),
    argumentId,
    title,
    description,
    sourceUrl,
    sourceType,
    upvotes: 0,
    downvotes: 0,
    userId,
    createdAt: new Date().toISOString(),
  };

  addEvidence(ev);
  revalidatePath(`/arguments/${argumentId}`);
  if (statementId) revalidatePath(`/statements/${statementId}`);
  return { id: ev.id };
}

// ---------------------------------------------------------------------------
// Votes
// ---------------------------------------------------------------------------

export async function castHeart(
  targetType: "statement" | "argument",
  targetId: string,
  revalidate: string,
): Promise<{ active: boolean }> {
  const userId = await requireUserId();
  const active = toggleVote(userId, targetType, targetId, "heart");
  revalidatePath(revalidate);
  return { active };
}

export async function castVote(
  targetId: string,
  direction: "up" | "down",
  revalidate: string,
): Promise<{ active: boolean }> {
  const userId = await requireUserId();
  const active = toggleVote(userId, "evidence", targetId, direction);
  revalidatePath(revalidate);
  return { active };
}
