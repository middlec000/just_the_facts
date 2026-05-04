"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DialogShell } from "./DialogShell";
import { editEvidence } from "@/lib/actions";
import type { Evidence, SourceType } from "@/lib/types";

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

interface EditEvidenceDialogProps {
  evidence: Evidence;
}

export function EditEvidenceDialog({
  evidence,
}: EditEvidenceDialogProps) {
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
        await editEvidence(evidence.id, fd);
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
        onClick={() => setOpen(true)}
        className="px-2.5 py-1 rounded-md border border-neutral-300 text-xs font-medium text-neutral-600 bg-white hover:bg-neutral-50 transition-colors"
      >
        Edit
      </button>

      {open && (
        <DialogShell title="Edit Evidence" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hidden argumentId for revalidation */}
            <input
              type="hidden"
              name="argumentId"
              value={evidence.argumentId}
            />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <div>
              <label htmlFor="edit-ev-title" className={labelCls}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-ev-title"
                name="title"
                type="text"
                required
                defaultValue={evidence.title}
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="edit-ev-description" className={labelCls}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="edit-ev-description"
                name="description"
                rows={3}
                required
                defaultValue={evidence.description}
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="edit-ev-sourceType" className={labelCls}>
                Source type <span className="text-red-500">*</span>
              </label>
              <select
                id="edit-ev-sourceType"
                name="sourceType"
                defaultValue={evidence.sourceType}
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
              <label htmlFor="edit-ev-sourceUrl" className={labelCls}>
                Source URL (optional)
              </label>
              <input
                id="edit-ev-sourceUrl"
                name="sourceUrl"
                type="url"
                defaultValue={evidence.sourceUrl}
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
                {isPending ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </DialogShell>
      )}
    </>
  );
}
