"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DialogShell } from "./DialogShell";
import { editStatement } from "@/lib/actions";
import type { Statement } from "@/lib/types";

const inputCls =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400";
const labelCls = "block text-sm font-medium text-neutral-700 mb-1";

interface EditStatementDialogProps {
  statement: Statement;
}

export function EditStatementDialog({ statement }: EditStatementDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleOpen(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await editStatement(statement.id, fd);
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
        type="button"
        onClick={handleOpen}
        className="px-2.5 py-1 rounded-md border border-neutral-300 text-xs font-medium text-neutral-600 bg-white hover:bg-neutral-50 transition-colors"
      >
        Edit
      </button>

      {open && (
        <DialogShell title="Edit Statement" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <div>
              <label htmlFor="edit-stmt-text" className={labelCls}>
                Statement <span className="text-red-500">*</span>
              </label>
              <textarea
                id="edit-stmt-text"
                name="text"
                rows={3}
                required
                defaultValue={statement.text}
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="edit-stmt-tags" className={labelCls}>
                Topics (optional)
              </label>
              <input
                id="edit-stmt-tags"
                name="tags"
                type="text"
                defaultValue={statement.tags.join(", ")}
                placeholder="e.g. science, health, technology"
                className={inputCls}
              />
              <p className="mt-1 text-xs text-neutral-400">
                Comma-separated hashtags.
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
                {isPending ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </DialogShell>
      )}
    </>
  );
}
