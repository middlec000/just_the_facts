"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DialogShell } from "./DialogShell";
import { createStatement } from "@/lib/actions";

const inputCls =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400";
const labelCls = "block text-sm font-medium text-neutral-700 mb-1";

export function AddStatementDialog({ currentUserId }: { currentUserId?: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createStatement(fd);
        setOpen(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <>
      <button
        onClick={() => {
          if (!currentUserId) {
            router.push(`/login?from=${encodeURIComponent(pathname)}`);
            return;
          }
          setOpen(true);
        }}
        className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
      >
        + Add Statement
      </button>

      {open && (
        <DialogShell title="Add a Statement" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <div>
              <label htmlFor="stmt-text" className={labelCls}>
                Statement <span className="text-red-500">*</span>
              </label>
              <textarea
                id="stmt-text"
                name="text"
                rows={3}
                required
                placeholder="State a clear, specific, falsifiable claim…"
                className={inputCls}
              />
              <p className="mt-1 text-xs text-neutral-400">
                Must be provable/falsifiable, clear, specific, and relevant.
              </p>
            </div>

            <div>
              <label htmlFor="stmt-tags" className={labelCls}>
                Topics (optional)
              </label>
              <input
                id="stmt-tags"
                name="tags"
                type="text"
                placeholder="e.g. science, health, technology"
                className={inputCls}
              />
              <p className="mt-1 text-xs text-neutral-400">
                Comma-separated hashtags. Leading # is stripped automatically.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 disabled:opacity-50 transition-colors"
              >
                {isPending ? "Saving…" : "Add Statement"}
              </button>
            </div>
          </form>
        </DialogShell>
      )}
    </>
  );
}
