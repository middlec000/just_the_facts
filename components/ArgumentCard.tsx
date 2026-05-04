import Link from "next/link";
import { Argument } from "@/lib/types";
import { HeartButton } from "@/components/HeartButton";
import { PostedBy } from "@/components/PostedBy";
import { EditArgumentDialog } from "@/components/EditArgumentDialog";

interface ArgumentCardProps {
  argument: Argument;
  userName: string;
  evidenceUpvotes: number;
  evidenceDownvotes: number;
  currentUserId?: string;
}

export function ArgumentCard({ argument, userName, evidenceUpvotes, evidenceDownvotes, currentUserId }: ArgumentCardProps) {
  const isFor = argument.stance === "for";

  return (
    <div className="relative">
      <Link
        href={`/arguments/${argument.id}`}
        className={`block rounded-lg border p-4 transition-shadow hover:shadow-md ${
          isFor
            ? "border-for-border bg-for-bg"
            : "border-against-border bg-against-bg"
        }`}
      >
        <h3 className={`text-base font-semibold text-neutral-900 mb-2 ${currentUserId === argument.userId ? "pr-16" : ""}`}>
          {argument.title}
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed mb-3">
          {argument.summary}
        </p>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <HeartButton
            id={argument.id}
            targetType="argument"
            initialHearts={argument.hearts}
            revalidatePath={`/statements/${argument.statementId}`}
            stopPropagation
          />
          {(evidenceUpvotes > 0 || evidenceDownvotes > 0) && (
            <span className="text-xs text-neutral-400">
              Evidence: <span className="text-emerald-600">&uarr;{evidenceUpvotes}</span>{" "}
              <span className="text-rose-500">&darr;{evidenceDownvotes}</span>
            </span>
          )}
        </div>
        <PostedBy userName={userName} createdAt={argument.createdAt} updatedAt={argument.updatedAt} />
      </Link>
      {currentUserId === argument.userId && (
        <div className="absolute top-3 right-3">
          <EditArgumentDialog argument={argument} />
        </div>
      )}
    </div>
  );
}
