"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DialogShell } from "./DialogShell";
import { editArgument } from "@/lib/actions";
import type { Argument } from "@/lib/types";

const inputCls =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400";
const labelCls = "block text-sm font-medium text-neutral-700 mb-1";

interface EditArgumentDialogProps {
  argument: Argument;
}

export function EditArgumentDialog({ argument }: EditArgumentDialogProps) {
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
        await editArgument(argument.id, fd);
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
        <DialogShell title="Edit Argument" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hidden fields for revalidation */}
            <input
              type="hidden"
              name="statementId"
              value={argument.statementId}
            />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <div>
              <label htmlFor="edit-arg-title" className={labelCls}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-arg-title"
                name="title"
                type="text"
                required
                defaultValue={argument.title}
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="edit-arg-summary" className={labelCls}>
                Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                id="edit-arg-summary"
                name="summary"
                rows={4}
                required
                defaultValue={argument.summary}
                className={inputCls}
              />
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
