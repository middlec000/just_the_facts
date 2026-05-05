"use client";

import { useState, useTransition } from "react";
import { castUpvote } from "@/lib/actions";

interface UpvoteButtonProps {
  id: string;
  targetType: "statement" | "argument";
  initialUpvotes: number;
  revalidatePath: string;
  /** Stop click events from bubbling (useful when UpvoteButton is inside a <Link>) */
  stopPropagation?: boolean;
}

export function UpvoteButton({
  id,
  targetType,
  initialUpvotes,
  revalidatePath,
  stopPropagation = false,
}: UpvoteButtonProps) {
  const [upvoted, setUpvoted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Apply the optimistic delta only while the server call is in flight.
  // Once the transition completes, initialUpvotes is already refreshed by
  // revalidatePath, so we use it directly to avoid double-counting.
  const upvotes = isPending
    ? initialUpvotes + (upvoted ? 1 : -1)
    : initialUpvotes;

  function handleUpvote(e: React.MouseEvent) {
    if (stopPropagation) e.preventDefault();
    e.stopPropagation();
    const next = !upvoted;
    setUpvoted(next);
    startTransition(async () => {
      const result = await castUpvote(targetType, id, revalidatePath);
      // Reconcile with server truth
      setUpvoted(result.active);
    });
  }

  return (
    <button
      onClick={handleUpvote}
      aria-label={upvoted ? "Remove upvote" : "Upvote"}
      aria-pressed={upvoted}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-sm transition-colors select-none ${
        upvoted
          ? "bg-blue-50 border-blue-400 text-blue-500"
          : "bg-white border-neutral-300 text-neutral-500 hover:border-blue-400 hover:text-blue-500"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path
          fillRule="evenodd"
          d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z"
          clipRule="evenodd"
        />
      </svg>
      <span className="font-medium">{upvotes}</span>
    </button>
  );
}
