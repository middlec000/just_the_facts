"use client";

import { useState, useEffect } from "react";

type VoteState = "up" | "down" | null;

const STORAGE_KEY = "jtf_votes";

function loadVotes(): Record<string, VoteState> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveVote(id: string, vote: VoteState) {
  const votes = loadVotes();
  if (vote === null) {
    delete votes[id];
  } else {
    votes[id] = vote;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
}

interface VoteButtonsProps {
  id: string;
  initialUpvotes: number;
  initialDownvotes: number;
  /** Stop click events from bubbling (useful when VoteButtons is inside a <Link>) */
  stopPropagation?: boolean;
}

export function VoteButtons({
  id,
  initialUpvotes,
  initialDownvotes,
  stopPropagation = false,
}: VoteButtonsProps) {
  const [vote, setVote] = useState<VoteState>(null);

  // Hydrate from localStorage after mount
  useEffect(() => {
    setVote(loadVotes()[id] ?? null);
  }, [id]);

  const upvotes =
    initialUpvotes + (vote === "up" ? 1 : 0);
  const downvotes =
    initialDownvotes + (vote === "down" ? 1 : 0);

  function handleVote(e: React.MouseEvent, direction: "up" | "down") {
    if (stopPropagation) e.preventDefault();
    e.stopPropagation();

    const next: VoteState = vote === direction ? null : direction;
    setVote(next);
    saveVote(id, next);
  }

  return (
    <div className="flex items-center gap-2 text-sm select-none">
      {/* Upvote */}
      <button
        onClick={(e) => handleVote(e, "up")}
        aria-label="Upvote"
        aria-pressed={vote === "up"}
        className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-colors ${
          vote === "up"
            ? "bg-emerald-600 border-emerald-600 text-white"
            : "bg-white border-neutral-300 text-neutral-600 hover:border-emerald-500 hover:text-emerald-600"
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

      {/* Downvote */}
      <button
        onClick={(e) => handleVote(e, "down")}
        aria-label="Downvote"
        aria-pressed={vote === "down"}
        className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-colors ${
          vote === "down"
            ? "bg-rose-600 border-rose-600 text-white"
            : "bg-white border-neutral-300 text-neutral-600 hover:border-rose-500 hover:text-rose-600"
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
            d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">{downvotes}</span>
      </button>
    </div>
  );
}
