"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DialogShell } from "./DialogShell";
import { createEvidence } from "@/lib/actions";
import type { SourceType } from "@/lib/types";

const inputCls =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400";
const labelCls = "block text-sm font-medium text-neutral-700 mb-1";

const SOURCE_TYPES: { value: SourceType; label: string }[] = [
  { value: "article", label: "Article" },
  { value: "study", label: "Study" },
  { value: "official", label: "Official Source" },
  { value: "video", label: "Video" },
  { value: "book", label: "Book" },
  { value: "other", label: "Other" },
];

interface AddEvidenceDialogProps {
  argumentId: string;
  /** Passed through to revalidate the parent statement page too. */
  statementId: string;
}

export function AddEvidenceDialog({
  argumentId,
  statementId,
}: AddEvidenceDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createEvidence(fd);
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
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-300 text-neutral-600 bg-white hover:bg-neutral-50 transition-colors"
      >
        + Add Evidence
      </button>

      {open && (
        <DialogShell title="Add Evidence" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hidden IDs */}
            <input type="hidden" name="argumentId" value={argumentId} />
            <input type="hidden" name="statementId" value={statementId} />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <div>
              <label htmlFor="ev-title" className={labelCls}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="ev-title"
                name="title"
                type="text"
                required
                placeholder="Name of the source or finding"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="ev-description" className={labelCls}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="ev-description"
                name="description"
                rows={3}
                required
                placeholder="Summarise what this evidence shows…"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="ev-sourceType" className={labelCls}>
                Source type <span className="text-red-500">*</span>
              </label>
              <select
                id="ev-sourceType"
                name="sourceType"
                defaultValue="article"
                className={inputCls}
              >
                {SOURCE_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ev-sourceUrl" className={labelCls}>
                Source URL (optional)
              </label>
              <input
                id="ev-sourceUrl"
                name="sourceUrl"
                type="url"
                placeholder="https://"
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
                {isPending ? "Saving…" : "Add Evidence"}
              </button>
            </div>
          </form>
        </DialogShell>
      )}
    </>
  );
}
