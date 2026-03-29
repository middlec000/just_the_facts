"use client";

import { useState } from "react";
import Link from "next/link";
import { Statement } from "@/lib/types";
import { HeartButton } from "@/components/HeartButton";
import { PostedBy } from "@/components/PostedBy";
import { EvidenceSupportBar } from "@/components/EvidenceSupportBar";

interface StatementWithCounts extends Statement {
  forCount: number;
  againstCount: number;
  forEvidenceUpvotes: number;
  againstEvidenceUpvotes: number;
  userName: string;
}

interface StatementListProps {
  statements: StatementWithCounts[];
  allTags: string[];
}

export function StatementList({ statements, allTags }: StatementListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered =
    activeTag === null
      ? statements
      : statements.filter((s) => s.tags.includes(activeTag));

  return (
    <div>
      {/* Tag filter chips */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              activeTag === null
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-600 border-neutral-300 hover:border-neutral-500"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                activeTag === tag
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-600 border-neutral-300 hover:border-neutral-500"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Statement cards */}
      {filtered.length === 0 ? (
        <p className="text-sm text-neutral-400 py-8 text-center">
          No statements found{activeTag ? ` for #${activeTag}` : ""}.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((statement) => (
            <Link
              key={statement.id}
              href={`/statements/${statement.id}`}
              className="block p-6 rounded-lg border border-neutral-200 bg-white hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-semibold text-neutral-900 mb-3">
                &ldquo;{statement.text}&rdquo;
              </h2>

              {/* Hashtags */}
              {statement.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {statement.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Evidence support bar */}
              <div className="mb-3">
                <EvidenceSupportBar
                  forUpvotes={statement.forEvidenceUpvotes}
                  againstUpvotes={statement.againstEvidenceUpvotes}
                />
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex gap-4 text-sm">
                  <span className="text-for">
                    {statement.forCount} argument
                    {statement.forCount !== 1 && "s"} for
                  </span>
                  <span className="text-neutral-300">|</span>
                  <span className="text-against">
                    {statement.againstCount} argument
                    {statement.againstCount !== 1 && "s"} against
                  </span>
                </div>
                <HeartButton
                  id={statement.id}
                  initialHearts={statement.hearts}
                  stopPropagation
                />
              </div>
              <PostedBy userName={statement.userName} createdAt={statement.createdAt} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
