"use client";

import { useState, useTransition } from "react";
import { reviewStatement } from "@/lib/actions";
import { Review, ReviewStatus } from "@/lib/types";

interface ReviewStatementControlProps {
  statementId: string;
  existingReview: Review | null;
}

const STATUS_OPTIONS: { value: ReviewStatus; label: string }[] = [
  { value: "verified", label: "✅ Verified" },
  { value: "not_objective", label: "❌ Not Objective" },
  { value: "not_falsifiable", label: "❌ Not Falsifiable" },
];

export function ReviewStatementControl({
  statementId,
  existingReview,
}: ReviewStatementControlProps) {
  const [selected, setSelected] = useState<ReviewStatus>(
    existingReview?.status ?? "verified",
  );
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await reviewStatement(statementId, selected);
      setSubmitted(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-wrap mt-3">
      <span className="text-xs text-neutral-500 font-medium shrink-0">
        {existingReview ? "Update your review:" : "Review this statement:"}
      </span>
      <select
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value as ReviewStatus);
          setSubmitted(false);
        }}
        className="text-xs border border-neutral-300 rounded-md px-2 py-1 bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        disabled={isPending}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isPending || (submitted && selected === existingReview?.status)}
        className="text-xs px-3 py-1 rounded-md bg-neutral-900 text-white font-medium hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Saving…" : submitted ? "Saved ✓" : existingReview ? "Update" : "Submit"}
      </button>
    </form>
  );
}
