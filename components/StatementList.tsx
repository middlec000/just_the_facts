"use client";

import { useState } from "react";
import Link from "next/link";
import { Statement } from "@/lib/types";
import { HeartButton } from "@/components/HeartButton";
import { PostedBy } from "@/components/PostedBy";
import { EvidenceSupportBar } from "@/components/EvidenceSupportBar";
import { EditStatementDialog } from "@/components/EditStatementDialog";

type SortField = "date" | "alpha" | "activity" | "hearts" | "evidence";
type SortDir = "asc" | "desc";

const SORT_OPTIONS: { field: SortField; label: string; defaultDir: SortDir }[] = [
  { field: "date",     label: "Date posted",     defaultDir: "desc" },
  { field: "alpha",    label: "Alphabetical",     defaultDir: "asc"  },
  { field: "activity", label: "Latest activity",  defaultDir: "desc" },
  { field: "hearts",   label: "Hearts",           defaultDir: "desc" },
  { field: "evidence", label: "Evidence upvotes",  defaultDir: "desc" },
];

interface StatementWithCounts extends Statement {
  forCount: number;
  againstCount: number;
  forEvidenceUpvotes: number;
  againstEvidenceUpvotes: number;
  totalEvidenceUpvotes: number;
  latestActivityAt: string;
  userName: string;
}

interface StatementListProps {
  statements: StatementWithCounts[];
  allTags: string[];
  currentUserId?: string;
}

export function StatementList({ statements, allTags, currentUserId }: StatementListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleFieldChange(field: SortField) {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(SORT_OPTIONS.find((o) => o.field === field)!.defaultDir);
    }
  }

  const filtered =
    activeTag === null
      ? statements
      : statements.filter((s) => s.tags.includes(activeTag));

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case "date":     cmp = a.createdAt.localeCompare(b.createdAt); break;
      case "alpha":    cmp = a.text.localeCompare(b.text); break;
      case "activity": cmp = a.latestActivityAt.localeCompare(b.latestActivityAt); break;
      case "hearts":   cmp = a.hearts - b.hearts; break;
      case "evidence": cmp = a.totalEvidenceUpvotes - b.totalEvidenceUpvotes; break;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div>
      {/* Tag filter chips */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
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

      {/* Sort controls */}
      <div className="flex flex-wrap items-center gap-1.5 mb-6">
        <span className="text-xs text-neutral-400 mr-1 shrink-0">Sort:</span>
        {SORT_OPTIONS.map((opt) => {
          const active = sortField === opt.field;
          return (
            <button
              key={opt.field}
              onClick={() => handleFieldChange(opt.field)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
                active
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-600 border-neutral-300 hover:border-neutral-500"
              }`}
            >
              {opt.label}
              {active && (
                <span className="text-[10px] leading-none">
                  {sortDir === "asc" ? "↑" : "↓"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Statement cards */}
      {sorted.length === 0 ? (
        <p className="text-sm text-neutral-400 py-8 text-center">
          No statements found{activeTag ? ` for #${activeTag}` : ""}.
        </p>
      ) : (
        <div className="space-y-4">
          {sorted.map((statement) => (
            <div key={statement.id} className="relative">
              <Link
                href={`/statements/${statement.id}`}
                className="block p-6 rounded-lg border border-neutral-200 bg-white hover:shadow-md transition-shadow"
              >
                <h2 className={`text-lg font-semibold text-neutral-900 mb-3 ${currentUserId === statement.userId ? "pr-16" : ""}`}>
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
                    targetType="statement"
                    initialHearts={statement.hearts}
                    revalidatePath="/"
                    stopPropagation
                  />
                </div>
                <PostedBy
                  userName={statement.userName}
                  createdAt={statement.createdAt}
                  updatedAt={statement.updatedAt}
                />
              </Link>
              {currentUserId === statement.userId && (
                <div className="absolute top-4 right-4">
                  <EditStatementDialog statement={statement} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
