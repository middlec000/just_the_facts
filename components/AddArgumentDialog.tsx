"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DialogShell } from "./DialogShell";
import { createArgument } from "@/lib/actions";
import type { Stance } from "@/lib/types";

const inputCls =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400";
const labelCls = "block text-sm font-medium text-neutral-700 mb-1";

interface AddArgumentDialogProps {
  statementId: string;
  /** Pre-select the stance (used when clicking "Add" inside a column). */
  defaultStance?: Stance;
}

export function AddArgumentDialog({
  statementId,
  defaultStance = "for",
}: AddArgumentDialogProps) {
  const [open, setOpen] = useState(false);
  const [stance, setStance] = useState<Stance>(defaultStance);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    fd.set("stance", stance); // ensure controlled value is used
    startTransition(async () => {
      try {
        await createArgument(fd);
        setOpen(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  const isFor = stance === "for";

  return (
    <>
      <button
        onClick={() => {
          setStance(defaultStance);
          setOpen(true);
        }}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
          defaultStance === "for"
            ? "border-for-border text-for bg-for-bg hover:bg-emerald-100"
            : "border-against-border text-against bg-against-bg hover:bg-red-100"
        }`}
      >
        + Add Argument
      </button>

      {open && (
        <DialogShell title="Add an Argument" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hidden statementId */}
            <input type="hidden" name="statementId" value={statementId} />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            {/* Stance toggle */}
            <div>
              <p className={labelCls}>
                Stance <span className="text-red-500">*</span>
              </p>
              <div className="flex rounded-lg border border-neutral-300 overflow-hidden text-sm font-medium">
                <button
                  type="button"
                  onClick={() => setStance("for")}
                  className={`flex-1 py-2 transition-colors ${
                    isFor
                      ? "bg-for text-white"
                      : "bg-white text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  For
                </button>
                <button
                  type="button"
                  onClick={() => setStance("against")}
                  className={`flex-1 py-2 transition-colors border-l border-neutral-300 ${
                    !isFor
                      ? "bg-against text-white"
                      : "bg-white text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  Against
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="arg-title" className={labelCls}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="arg-title"
                name="title"
                type="text"
                required
                placeholder="A concise title for this argument"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="arg-summary" className={labelCls}>
                Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                id="arg-summary"
                name="summary"
                rows={4}
                required
                placeholder="Explain the argument in 1–3 sentences…"
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
                {isPending ? "Saving…" : "Add Argument"}
              </button>
            </div>
          </form>
        </DialogShell>
      )}
    </>
  );
}
